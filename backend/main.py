from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Whatsapp API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://assignment-whatsapp-ui-s3es.vercel.app/"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["whatsapp"]
messages_col = db["processed_messages"]

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.get("/conversations")
def get_conversations():
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {
            "$group": {
                "_id": "$wa_id",
                "name": {"$first": "$name"},
                "last_message": {"$first": "$text"},
                "last_time": {"$first": "$timestamp"},
            }
        },
        {"$sort": {"last_time": -1}},
    ]
    return list(messages_col.aggregate(pipeline))

@app.get("/messages/{wa_id}")
def get_messages(wa_id: str):
    docs = list(messages_col.find({"wa_id": wa_id}).sort("timestamp", 1))
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.post("/messages")
def send_message(message: dict):
    message["timestamp"] = datetime.utcnow().isoformat()
    res = messages_col.insert_one(message)
    message["_id"] = str(res.inserted_id)

    return message
