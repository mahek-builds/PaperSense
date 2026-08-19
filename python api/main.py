from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from uuid import uuid4
from pathlib import Path
import requests
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load environment variables
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

INDEX_DIR = os.getenv("FAISS_INDEX_PATH", "faiss_index")
TEMP_DIR = os.getenv("TEMP_DIR", "temp")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
print(f"--- Loaded Groq model: {GROQ_MODEL} ---")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "25"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "100"))


def parse_cors_origins() -> list[str]:
    raw_origins = os.getenv(
        "CORS_ORIGINS", '["http://localhost:5173","http://127.0.0.1:5173"]'
    )
    try:
        parsed = json.loads(raw_origins)
    except json.JSONDecodeError:
        parsed = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    return parsed if isinstance(parsed, list) and parsed else ["http://localhost:5173"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
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
        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        content = await file.read()
        max_bytes = MAX_FILE_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds max allowed size of {MAX_FILE_SIZE_MB} MB",
            )

        os.makedirs(TEMP_DIR, exist_ok=True)
        safe_filename = f"{uuid4().hex}.pdf"
        file_path = os.path.join(TEMP_DIR, safe_filename)
        with open(file_path, "wb") as f:
            f.write(content)

        # Load PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # Split text into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
        )
        docs = splitter.split_documents(documents)

        if not docs:
            raise HTTPException(status_code=422, detail="No readable content found in PDF")

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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}") from e
    finally:
        if "file_path" in locals() and os.path.exists(file_path):
            os.remove(file_path)

# Query endpoint using Groq API
@app.post("/query")
def query(data: QueryRequest):
    global db
    if db is None:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

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
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "max_tokens": 2048
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

    except requests.exceptions.Timeout as e:
        raise HTTPException(
            status_code=504, detail="Request timed out. Groq API is taking too long."
        ) from e
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=502, detail=f"Upstream Groq error: {e}. Response: {response.text}"
        ) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}") from e


@app.get("/health")
def health_check():
    index_file = os.path.join(INDEX_DIR, "index.faiss")
    return {
        "status": "ok",
        "index_loaded": db is not None,
        "index_exists": os.path.exists(index_file),
    }