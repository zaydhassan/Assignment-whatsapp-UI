export interface Conversation {
  _id: string; 
  name?: string;
  last_message?: string;
}

export interface Message {
  _id?: string;
  wa_id: string;
  from: string;
  to: string;
  name: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}