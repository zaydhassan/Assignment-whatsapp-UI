"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { Conversation, Message } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Page() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    axios.get(`${API}/conversations`)
      .then((res) => {
        setConversations(res.data);
        if (res.data.length > 0) setActiveId(res.data[0]._id);
      })
      .catch((err) => console.error("Error fetching conversations:", err));
  }, []);
  
  useEffect(() => {
    if (activeId) {
      axios.get(`${API}/messages/${activeId}`)
        .then((res) => setMessages(res.data))
        .catch((err) =>
          console.error(`Error fetching messages for ${activeId}:`, err)
        );
    }
  }, [activeId]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMsg: Omit<Message, "_id"> = {
      wa_id: activeId,
      from: "me",
      to: activeId,
      name: "Me",
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    axios.post(`${API}/messages`, newMsg)
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  const activeConversation = conversations.find((c) => c._id === activeId);

  return (
    <div className="flex h-screen">
      <ChatList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />
      {activeConversation && (
        <div className="flex flex-col flex-1">
          <ChatWindow
            messages={messages}
            activeConversation={activeConversation}
          />
          <MessageInput onSend={sendMessage} />
        </div>
      )}
    </div>
  );
}
