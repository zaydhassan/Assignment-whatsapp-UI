import { useState } from "react";

export default function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [msg, setMsg] = useState("");

  const send = () => { if (msg.trim()) { onSend(msg); setMsg(""); } };

  return (
    <footer className="sticky bottom-0 p-3 bg-white border-t flex gap-2 shadow-inner">
      <input
        className="flex-1 rounded-full border px-4 py-3 focus:border-green-400 focus:ring-2 ring-green-300 text-gray-900"
        placeholder="Type a message..."
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow font-bold transition-colors"
      >
        Send
      </button>
    </footer>
  );
}