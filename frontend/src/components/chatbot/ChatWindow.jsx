import { useState, useEffect, useRef } from "react";
import { TbSend, TbX, TbRefresh, TbBook2 } from "react-icons/tb";
import Message from "./Message";
import { enviarMensaje } from "../../services/chatService";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "¡Hola! Soy LIBRA, tu asistente literario 📚\n¿En qué puedo ayudarte hoy? Puedo recomendarte libros, contarte sobre nuestro catálogo o ayudarte con tu pedido.",
  timestamp: new Date(),
};

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Build history array (exclude welcome message for cleaner context)
    const history = messages
      .filter((m) => m !== WELCOME_MESSAGE)
      .map(({ role, content }) => ({ role, content }));

    try {
      const reply = await enviarMensaje(text, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("No pude conectarme. ¿Intentamos de nuevo?");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div
      className="
        fixed bottom-24 right-6 z-50
        w-[340px] sm:w-[380px]
        flex flex-col
        rounded-2xl overflow-hidden
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        border border-white/10
        bg-[#13151b]/95 backdrop-blur-xl
        animate-[slideUp_0.25s_ease-out]
      "
      style={{ height: "520px" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-gradient-to-r from-accent-purple/20 to-accent-pink/10 shrink-0">
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-md">
          <TbBook2 size={19} className="text-white" />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-bold text-white text-sm leading-tight">
            LIBRA
          </p>
          <p className="text-[11px] text-accent-purple leading-tight">
            Asistente literario
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={handleReset}
          title="Nueva conversación"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-accent-purple hover:bg-white/5 transition-all"
        >
          <TbRefresh size={16} />
        </button>
        <button
          onClick={onClose}
          title="Cerrar"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-accent-pink hover:bg-white/5 transition-all"
        >
          <TbX size={17} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}

        {isLoading && <Message isTyping />}

        {error && (
          <div className="text-center">
            <p className="text-xs text-red-400 mb-2">{error}</p>
            <button
              onClick={handleSend}
              className="text-xs text-accent-purple hover:text-accent-pink transition-colors underline underline-offset-2"
            >
              Reintentar
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-3 py-3 border-t border-white/8 shrink-0 bg-[#0e1016]/60">
        <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-accent-purple/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none leading-relaxed max-h-24 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white shadow-md transition-all hover:shadow-accent-purple/30 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shrink-0 mb-0.5"
          >
            <TbSend size={15} className="-translate-x-px" />
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-1.5">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
