from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from groq import Groq


# # Load environment variables
# ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

QDRANT_URL=os.getenv("QDRANT_URL")
QDRANT_API_KEY=os.getenv("QDRANT_API_KEY")
COLLECTION_NAME="PaperSense-documents"

if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("QDRANT_URL and QDRANT_API_KEY not found in .env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:5173",
        # "http://127.0.0.1:5173"
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
db = None
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Pydantic model for queries
class QueryRequest(BaseModel):
    question: str

# Load the Qdrant collection at startup, if it already exists.
@app.on_event("startup")
def load_qdrant_collection():
    global db
    client=QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY
    )
    if client.collection_exists(COLLECTION_NAME):
        db=QdrantVectorStore.from_existing_collection(
            collection_name=COLLECTION_NAME,
            embedding=embeddings,
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )

# Home route
@app.get("/")
def home():
    return {"status": "API running", "index_loaded": db is not None}

# Upload PDF and create embeddings
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global db
    try:
        if not file.filename.endswith(".pdf"):
            return {"error": "Only PDF files allowed"}

        os.makedirs("temp", exist_ok=True)
        file_path = f"temp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Load PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # Split text into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        docs = splitter.split_documents(documents)

        if not docs:
            return {"error": "No readable content found in PDF"}

        # Create the collection on the first upload; otherwise append chunks.
        if db is None:
            db = QdrantVectorStore.from_documents(
                docs,
                embedding=embeddings,
                api_key=QDRANT_API_KEY,
                url=QDRANT_URL,
                collection_name=COLLECTION_NAME,
            )
        else:
            db.add_documents(docs)

        preview_text = " ".join(
            "\n\n".join(doc.page_content for doc in docs[:2]).split()
        )[:700]

        return {
            "message": "PDF uploaded, embedded, and stored in Qdrant",
            "chunks_added": len(docs),
            "pages_read": len(documents),
            "preview_text": preview_text,
        }
#new wcahnges
    except Exception as e:
        return {"error": str(e)}

# Query endpoint using Groq API
@app.post("/query")
def query(data: QueryRequest):
    global db
    if db is None:
        return {"error": "No PDF uploaded yet"}

    try:
        # Retrieve top 3 relevant chunks
        results = db.similarity_search(data.question, k=3)
        context = "\n\n".join([doc.page_content for doc in results])
        context = context[:12000]  # truncate to avoid token overflow

        # Prepare prompt
        prompt = f"Answer the question based on the context below:\n\nContext:\n{context}\n\nQuestion:\n{data.question}"

        model = "openai/gpt-oss-20b"

        groq_client = Groq(api_key=GROQ_API_KEY)
        response = groq_client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=500,
        )
        return {"answer": response.choices[0].message.content}


    except Exception as e:
        return {"error": str(e)}
