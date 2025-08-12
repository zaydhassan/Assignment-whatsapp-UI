import { Message, Conversation } from "@/types";
import { useEffect, useRef } from "react";
import React from "react";

const STATUS_ICONS: Record<string, React.ReactElement> = {
  sent: <span>✓</span>,
  delivered: <span>✓✓</span>,
  read: <span className="text-blue-500">✓✓</span>,
};

export default function ChatWindow({ messages, activeConversation }: { messages: Message[]; activeConversation: Conversation | undefined; }) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <section className="flex-1 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-white border-b shadow-md">
        <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center font-bold shadow">
          {activeConversation?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <div className="font-semibold">{activeConversation?.name || activeConversation?._id}</div>
          <div className="text-xs text-gray-500">{activeConversation?._id}</div>
        </div>
      </header>
      {/* Messages */}
      <main className="flex-1 p-4 overflow-y-auto bg-chat-pattern">
        {messages.map(msg => {
          const isMe = msg.from === "me";
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`max-w-xs p-3 rounded-2xl shadow-sm transition-all ${
                isMe
                  ? "bg-green-400 text-white rounded-br-sm hover:shadow-green-200"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm hover:shadow-gray-200"
              }`}>
                {msg.text}
                <div className={`text-xs mt-1 flex items-center justify-end gap-1 opacity-80 ${
                  isMe ? "text-gray-100" : "text-gray-500"
                }`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {isMe && STATUS_ICONS[msg.status]}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </main>
    </section>
  );
}
