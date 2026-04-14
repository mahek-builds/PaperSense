# 🧠 PaperSense

PaperSense is an AI-powered document intelligence system that allows users to upload PDFs and ask context-aware questions using semantic search (FAISS) and LLMs (Groq API).

---

## 🚀 Features
- **📄 PDF Upload & Processing:** Fast processing via FastAPI.
- **🧠 Intelligent Extraction:** Text extraction + chunking for high-accuracy retrieval.
- **🔍 Semantic Search:** High-performance similarity search using FAISS vector database.
- **🤖 Context-aware Q&A:** Reasoning powered by **Groq LLaMA 3.1 (8b-instant)**.
- **🧾 Auto-Embeddings:** Automatic vector generation using HuggingFace `all-MiniLM-L6-v2`.
- **⚡ Persistent Storage:** FAISS index is saved locally to maintain context between sessions.
- **🌐 CORS-Enabled:** Backend ready for seamless frontend integration.

---

## 🏗 Tech Stack
- **Backend:** FastAPI
- **Embeddings:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
- **Vector DB:** FAISS
- **LLM API:** Groq (LLaMA 3.1)
- **PDF Processing:** PyPDFLoader (LangChain)
- **Text Splitting:** RecursiveCharacterTextSplitter
- **Environment:** python-dotenv

---

## ⚙️ How It Works
1. **Upload PDF:** User uploads a file via `/upload`. It is stored in a `temp/` folder.
2. **Text Extraction:** `PyPDFLoader` converts the PDF into raw text.
3. **Chunking:** Text is split into chunks (Size: 1000, Overlap: 100) for better context window management.
4. **Embedding:** HuggingFace model converts text chunks into numerical vectors.
5. **Vector Storage:** Embeddings are saved in `index.faiss` and `index.pkl`.
6. **Querying:** When a user asks a question, FAISS retrieves the **top 3** relevant chunks.
7. **Groq LLM:** The chunks and question are sent to LLaMA 3.1 to generate a natural language response.

---

## 📌 API Endpoints

### 🟢 Home
`GET /`
- **Response:** `{"status": "API running", "index_loaded": true}`

### 📄 Upload PDF
`POST /upload`
- **Form-data:** `file: <PDF_FILE>`
- **Response:**
  ```json
  {
    "message": "PDF uploaded, embedded, and merged into vector index",
    "chunks_added": 12,
    "pages_read": 5,
    "preview_text": "..."
  }
  ##Zaroor! Maine pure content ko ek professional README.md format mein convert kar diya hai. Aap ise direct copy karke apni GitHub repository ya project folder mein paste kar sakte hain.

Markdown
# 🧠 PaperSense

**PaperSense** ek AI-powered document intelligence system hai jo users ko PDFs upload karne aur semantic search (**FAISS**) aur LLMs (**Groq API**) ka use karke context-aware sawal puchne ki permission deta hai.

---

## 🚀 Features
- **📄 PDF Upload & Processing:** FastAPI ke through fast processing.
- **🧠 Intelligent Extraction:** Behtar retrieval ke liye text extraction aur chunking.
- **🔍 Semantic Search:** FAISS vector database ka use karke high-performance similarity search.
- **🤖 Context-aware Q&A:** **Groq LLaMA 3.1 (8b-instant)** dwara powered reasoning.
- **🧾 Auto-Embeddings:** HuggingFace `all-MiniLM-L6-v2` ka use karke automatic vector generation.
- **⚡ Persistent Storage:** FAISS index locally save hota hai taaki sessions ke beech context bana rahe.
- **🌐 CORS-Enabled:** Frontend integration ke liye backend puri tarah ready hai.

---

## 🏗 Tech Stack
- **Backend:** FastAPI
- **Embeddings:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
- **Vector DB:** FAISS
- **LLM API:** Groq (LLaMA 3.1)
- **PDF Processing:** PyPDFLoader (LangChain)
- **Text Splitting:** RecursiveCharacterTextSplitter
- **Environment:** python-dotenv

---

## ⚙️ How It Works
1. **Upload PDF:** User `/upload` ke through file upload karta hai. Yeh `temp/` folder mein store hoti hai.
2. **Text Extraction:** `PyPDFLoader` PDF ko raw text mein convert karta hai.
3. **Chunking:** Text ko chunks mein split kiya jata hai (Size: 1000, Overlap: 100).
4. **Embedding:** HuggingFace model text chunks ko numerical vectors mein convert karta hai.
5. **Vector Storage:** Embeddings ko `index.faiss` aur `index.pkl` mein save kiya jata hai.
6. **Querying:** Jab user sawal puchta hai, FAISS **top 3** relevant chunks nikalta hai.
7. **Groq LLM:** Chunks aur sawal Groq API ko bheje jate hain jo final answer generate karta hai.

---

## 📌 API Endpoints

### 🟢 Home
`GET /`
- **Response:** `{"status": "API running", "index_loaded": true}`

### 📄 Upload PDF
`POST /upload`
- **Form-data:** `file: <PDF_FILE>`
- **Response:**
  ```json
  {
    "message": "PDF uploaded, embedded, and merged into vector index",
    "chunks_added": 12,
    "pages_read": 5,
    "preview_text": "..."
  }
❓ Ask Question
POST /query

Body: ```json
{ "question": "What is this document about?" }

Response: {"answer": "..."}

##🧠 Architecture Flow
PDF Upload → Temp Storage → Text Extraction → Chunking → Embeddings → FAISS Index → User Query → Similarity Search → Groq LLM → Final Answer

##📁 File Structure
faiss_index/: Isme index.faiss (vectors) aur index.pkl (metadata) hota hai.

temp/: Isme uploaded uploaded.pdf temporary store hota hai.

##🎯 Why PaperSense?
🚀 Fast: Near-instant semantic search.

##🧠 Smart: Sirf keyword matching nahi, balki AI-powered reasoning.

📄 Simple: Aapke documents ke liye "ChatGPT" ki tarah kaam karta hai.

##🔮 Future Enhancements
[ ] Multi-PDF chat support.

[ ] Processing ke baad automatic file clean-up.

[ ] Groq se streaming responses.

[ ] DOCX / TXT / Web pages ka support.

[ ] User authentication system.

[ ] Cloud storage integration (S3 / Firebase).
