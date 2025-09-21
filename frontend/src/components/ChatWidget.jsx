import React, { useState } from "react";
import apiClient from "../api/apiClient"; // adjust path if your apiClient is located elsewhere

export default function ChatWidget() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // {role:'user'|'bot', text:''}
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    // add user message locally
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);

    try {
      const payload = { message: trimmed /*, history: optional history array */ };
      const res = await apiClient.post("/chat", payload);
      const reply = (res?.data?.reply) ?? "No reply from AI";

      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      console.error("Chat error", err);
      setMessages((m) => [...m, { role: "bot", text: "Error: " + (err?.message || "Request failed") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border rounded-lg p-4 min-h-[220px] mb-3 overflow-auto">
        {messages.length === 0 && <div className="text-gray-500">Say hi to the assistant 👋</div>}

        {messages.map((m, idx) => (
          <div key={idx} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`inline-block p-2 rounded-md ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          </div>
        ))}

        {loading && <div className="text-gray-500 mt-2">Thinking…</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
