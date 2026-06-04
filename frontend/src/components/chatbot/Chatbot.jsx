import { useState } from "react";
import { TbMessageChatbot, TbX } from "react-icons/tb";
import ChatWindow from "./ChatWindow";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat window — only mounted when open */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title={isOpen ? "Cerrar chat" : "Abrir asistente LIBRA"}
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-accent-purple to-accent-pink
          text-white shadow-[0_8px_24px_rgba(182,166,230,0.35)]
          flex items-center justify-center
          transition-all duration-200
          hover:scale-110 hover:shadow-[0_12px_32px_rgba(182,166,230,0.5)]
          active:scale-95
          border border-white/10
        "
      >
        <span
          className="transition-all duration-200"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen
              ? "rotate(90deg) scale(0.5)"
              : "rotate(0deg) scale(1)",
            position: isOpen ? "absolute" : "static",
          }}
        >
          <TbMessageChatbot size={26} />
        </span>
        <span
          className="transition-all duration-200"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen
              ? "rotate(0deg) scale(1)"
              : "rotate(-90deg) scale(0.5)",
            position: isOpen ? "static" : "absolute",
          }}
        >
          <TbX size={24} />
        </span>
      </button>
    </>
  );
}

export default ChatBot;
