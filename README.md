# 📱 WhatsApp Web Clone

A full-stack **WhatsApp-like chat application** built with **Next.js (frontend)** and **FastAPI (backend)**, using **MongoDB** for persistence.  
Deployed on **Render** for both frontend and backend.

---

## 🚀 Live Demo
- **Frontend**: [https://assignment-whatsapp-frontend.onrender.com](https://assignment-whatsapp-frontend.onrender.com)
- **Backend API**: [https://assignment-whatsapp-ui.onrender.com](https://assignment-whatsapp-ui.onrender.com)

---

## 🛠 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (React framework)
- TypeScript
- Axios
- Tailwind CSS

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) (Python web framework)
- MongoDB (Atlas or local)
- pymongo
- python-dotenv

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone <repo-url>

cd your-repo

---

### 2️⃣ Backend Setup

cd backend

python -m venv venv

pip install -r requirements.txt


**Environment Variables (`backend/.env`):**

MONGO_URI=your_mongo_connection_string


**Run locally:**

uvicorn main:app --reload --host 0.0.0.0 --port 8000

---

### 3️⃣ Frontend Setup

cd frontend

npm install


**Environment Variables (`frontend/.env.local`):**

NEXT_PUBLIC_API_URL=http://localhost:8000

> In production, this will be set to your backend’s Render URL.

**Run locally:**

npm run dev


