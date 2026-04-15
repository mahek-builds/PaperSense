# 🧠 PaperSense

PaperSense is an AI-powered document intelligence system that allows users to upload PDFs and ask context-aware questions using semantic search (FAISS) and LLMs (Groq API).

##  Features

-  PDF Upload & Processing via FastAPI
-  Text extraction + chunking for better retrieval
-  Semantic Search using FAISS vector database
-  Context-aware Q&A using Groq LLaMA 3.1
-  Automatic embedding generation using HuggingFace Transformers
-  Persistent vector storage (FAISS index saved locally)
-  CORS-enabled backend for frontend integration

##  Tech Stack

- **Backend:** FastAPI
- **Embeddings:** HuggingFace sentence-transformers/all-MiniLM-L6-v2
- **Vector DB:** FAISS
- **LLM API:** Groq (llama-3.1-8b-instant)
- **PDF Processing:** PyPDFLoader (LangChain)
- **Text Splitting:** RecursiveCharacterTextSplitter
- **Environment Management:** python-dotenv
- **HTTP Requests:** requests

## ⚙️ How It Works

1. **Upload PDF**
   - User uploads a PDF via /upload
   - File is temporarily stored in temp/ folder

2. **Text Extraction**
   - PDF is loaded using PyPDFLoader
   - Pages are converted into raw text

3. **Chunking**
   - Text is split into chunks of:
     - chunk_size = 1000
     - chunk_overlap = 100

4. **Embedding Generation**
   - HuggingFace model converts chunks into embeddings

5. **Vector Storage (FAISS)**
   - Embeddings are stored in FAISS index
   - Saved locally as:
     - index.faiss
     - index.pkl

6. **Querying**
   - User asks a question via /query
   - FAISS retrieves top 3 relevant chunks
   - Context is sent to Groq LLM
   - AI returns final answer

## 📌 API Endpoints

###  Home

**GET /**

**Response:**

```json
{
  "status": "API running",
  "index_loaded": true
}
```

### 📄 Upload PDF

**POST /upload**

**Form-data:**

- file: PDF file

**Response:**

```json
{
  "message": "PDF uploaded, embedded, and merged into vector index",
  "chunks_added": 12,
  "pages_read": 5,
  "preview_text": "..."
}
```

### ❓ Ask Question

**POST /query**

**Body:**

```json
{
  "question": "What is this document about?"
}
```

**Response:**

```json
{
  "answer": "..."
}
```



## 🌐 Live Project

-  Frontend (Live App):https://papersense.netlify.app/
-  Backend API (AI Model):https://mahek2bhatia-ai-research-analyst.hf.space/docs

 
##  Architecture Flow

PDF Upload  
↓  
Temp Storage  
↓  
Text Extraction (PyPDFLoader)  
↓  
Chunking (RecursiveCharacterTextSplitter)  
↓  
Embeddings (HuggingFace)  
↓  
FAISS Index Storage (.faiss + .pkl)  
↓  
User Query  
↓  
Similarity Search (Top 3 chunks)  
↓  
Groq LLM (LLaMA 3.1)  
↓  
Final Answer

##  File Storage

text
faiss_index/
 ├── index.faiss   → Vector embeddings
 └── index.pkl     → Metadata + mapping

temp/
 └── uploaded.pdf  → Temporary file storage



##  Why PaperSense?
-  AI-powered reasoning over PDFs
-  Fast semantic document search
-  Works like a "ChatGPT for your documents"
-  Lightweight + scalable architecture

##  Future Enhancements

- Multi-PDF chat support
- File auto-cleanup after processing
- Streaming responses from Groq
- Support for DOCX / TXT / Web pages
- User authentication system
- Cloud storage (S3 / Firebase)
