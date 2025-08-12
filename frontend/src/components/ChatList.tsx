import { Conversation } from "@/types";
interface Props { conversations: Conversation[]; activeId: string; onSelect: (id: string) => void; }

export default function ChatList({ conversations, activeId, onSelect }: Props) {
  return (
    <aside className="w-full md:w-1/3 bg-white border-r overflow-y-auto shadow-sm">
      <h2 className="p-4 font-extrabold text-xl bg-green-50 border-b">Chats</h2>
      {conversations.map(c => (
        <div key={c._id}
          onClick={() => onSelect(c._id)}
          className={`flex gap-3 p-3 items-center cursor-pointer border-b transition-all
            ${c._id === activeId ? "bg-green-100" : "hover:bg-green-50"}`}>
          <div className="w-11 h-11 rounded-full bg-green-300 flex items-center justify-center text-lg font-bold shadow">
            {c.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <div className="font-semibold">{c.name || c._id}</div>
            <div className="text-xs text-gray-500 truncate">{c.last_message}</div>
          </div>
        </div>
      ))}
    </aside>
  );
}
