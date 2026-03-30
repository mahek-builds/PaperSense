# 🧠 PaperSense

PaperSense is an AI-powered Research Analyst system that extracts insights, summarizes documents, and answers context-aware queries using semantic search and LLMs.

---

## 🚀 Features

- 📄 PDF Upload & Processing
- 🧠 AI-powered Summarization
- 🔍 Semantic Search using FAISS
- 🤖 Context-aware AI Responses
- ⚡ GPU Acceleration with PyTorch
- 🗂 Temporary File Handling for Secure Processing

---

## 🏗 Tech Stack

- Frontend: React.js
- Backend: FastAPI
- Embeddings: Hugging Face Sentence Transformers
- Vector Database: FAISS
- AI Model: OpenAI GPT
- Deep Learning: PyTorch (GPU Enabled)
- Workflow Automation: n8n
- Deployment: Docker

---

## ⚙️ How It Works

1. User uploads a PDF.
2. File is stored temporarily in a secure temp folder.
3. Text is extracted and split into chunks.
4. Embeddings are generated using PyTorch (GPU).
5. FAISS stores embeddings for fast retrieval.
6. User queries are answered using retrieved context + GPT.

---

## 🎯 Why PaperSense?

- Saves research time
- Enables intelligent document interaction
- Scalable architecture
- GPU-accelerated performance

---

## 🔮 Future Enhancements

- Multi-document comparison
- Support for Word/HTML files
- Advanced LLM integrations
