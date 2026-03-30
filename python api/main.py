from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

INDEX_DIR = "faiss_index"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
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

# Load FAISS index at startup
@app.on_event("startup")
def load_faiss_index():
    global db
    index_file = os.path.join(INDEX_DIR, "index.faiss")
    store_file = os.path.join(INDEX_DIR, "index.pkl")
    if os.path.exists(index_file) and os.path.exists(store_file):
        db = FAISS.load_local(
            INDEX_DIR,
            embeddings,
            allow_dangerous_deserialization=True
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

        # Add to FAISS DB
        if db is None:
            db = FAISS.from_documents(docs, embeddings)
        else:
            db.add_documents(docs)

        os.makedirs(INDEX_DIR, exist_ok=True)
        db.save_local(INDEX_DIR)

        preview_text = " ".join("\n\n".join(doc.page_content for doc in docs[:2]).split())[:700]

        return {
            "message": "PDF uploaded, embedded, and merged into vector index",
            "chunks_added": len(docs),
            "pages_read": len(documents),
            "preview_text": preview_text
        }

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

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-8b-8192",  # supported model
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "max_tokens": 500
        }

        # Make API request
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"]

        return {"answer": answer}

    except requests.exceptions.Timeout:
        return {"error": "Request timed out. Groq API is taking too long."}
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error: {e}, Response: {response.text}"}
    except Exception as e:
        return {"error": str(e)}