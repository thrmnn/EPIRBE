import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const { messages, sendMessage, connected } = useChat();
  const [input, setInput] = useState("");
  const [username] = useState(
    () => localStorage.getItem("epirbe_username") || `user${Math.floor(Math.random() * 9999)}`
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  // Persist username
  useEffect(() => {
    localStorage.setItem("epirbe_username", username);
  }, [username]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(username, input.trim());
    setInput("");
  };

  return (
    <div className="bg-radio-surface border border-radio-border rounded-xl flex flex-col h-80">
      <div className="flex items-center justify-between px-4 py-2 border-b border-radio-border">
        <h2 className="text-sm font-semibold text-radio-muted uppercase tracking-wider">Chat</h2>
        <span className="text-xs text-radio-muted">{username}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold text-radio-accent">{msg.username}</span>{" "}
            <span className="text-radio-text">{msg.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex border-t border-radio-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Say something..." : "Connecting..."}
          disabled={!connected}
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-radio-muted"
        />
        <button
          type="submit"
          disabled={!connected}
          className="px-4 py-2 text-sm font-semibold text-radio-accent hover:bg-radio-border transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}
