import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Chat() {
  const { messages, sendMessage, connected } = useChat();
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(
    () => localStorage.getItem("epirbe_username") || `user${Math.floor(Math.random() * 9999)}`
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Persist username
  useEffect(() => {
    localStorage.setItem("epirbe_username", username);
  }, [username]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingUsername) {
      usernameInputRef.current?.focus();
      usernameInputRef.current?.select();
    }
  }, [editingUsername]);

  const commitUsername = () => {
    const trimmed = usernameInput.trim();
    if (trimmed) {
      setUsername(trimmed);
    } else {
      setUsernameInput(username);
    }
    setEditingUsername(false);
  };

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
    <div className="bg-radio-surface-1 border border-radio-border-subtle rounded-xl flex flex-col h-80">
      <div className="flex items-center justify-between px-4 py-2 border-b border-radio-border-subtle">
        <h2 className="text-sm font-semibold text-radio-text-tertiary uppercase tracking-wider">Chat</h2>
        <span className="flex items-center gap-1">
          {editingUsername ? (
            <>
              <label htmlFor="username-input" className="sr-only">Username</label>
              <input
                id="username-input"
                ref={usernameInputRef}
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onBlur={commitUsername}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitUsername();
                  if (e.key === "Escape") {
                    setUsernameInput(username);
                    setEditingUsername(false);
                  }
                }}
                className="bg-radio-surface-base border border-radio-border-subtle rounded px-1.5 py-0.5 text-xs outline-none focus:border-radio-primary w-24"
                maxLength={20}
              />
            </>
          ) : (
            <>
              <span className="text-xs text-radio-text-secondary">{username}</span>
              <button
                onClick={() => {
                  setUsernameInput(username);
                  setEditingUsername(true);
                }}
                aria-label="Edit username"
                className="p-2 -m-2 text-radio-text-tertiary hover:text-radio-primary transition-colors"
                title="Edit username"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </>
          )}
        </span>
      </div>

      <ul role="log" aria-live="polite" aria-label="Chat messages" className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold text-radio-primary">{msg.username}</span>{" "}
            <span className="text-radio-text-tertiary text-xs">{timeAgo(msg.timestamp)}</span>{" "}
            <span className="text-radio-text-primary">{msg.message}</span>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>

      <form onSubmit={handleSend} className="flex border-t border-radio-border-subtle">
        <label htmlFor="chat-input" className="sr-only">Chat message</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Say something..." : "Connecting..."}
          disabled={!connected}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-radio-text-primary outline-none placeholder:text-radio-text-tertiary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!connected}
          className="px-4 py-2 text-sm font-semibold text-radio-primary hover:bg-radio-surface-2 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}
