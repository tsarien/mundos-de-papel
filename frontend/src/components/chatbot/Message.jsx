const TypingIndicator = () => (
  <div className="flex items-end gap-2.5 justify-start">
    {/* Avatar */}
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
      L
    </div>

    {/* Typing bubbles */}
    <div className="glass-panel border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-accent-purple animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent-purple animate-bounce"
          style={{ animationDelay: "160ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent-purple animate-bounce"
          style={{ animationDelay: "320ms" }}
        />
      </div>
    </div>
  </div>
);

/**
 * Renders a single chat message bubble.
 *
 * @param {{ role: "user" | "assistant", content: string, timestamp: Date }} message
 * @param {boolean} isTyping - Shows the typing indicator instead of content
 */
const Message = ({ message, isTyping = false }) => {
  if (isTyping) return <TypingIndicator />;

  const isUser = message.role === "user";

  const timeLabel = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "justify-start"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
          L
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={
            isUser
              ? "bg-gradient-to-br from-accent-purple to-accent-pink text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-md text-sm leading-relaxed"
              : "glass-panel border border-white/10 text-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-md text-sm leading-relaxed"
          }
        >
          {/* Render line breaks in bot messages */}
          {message.content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Timestamp */}
        {timeLabel && (
          <span className="text-[10px] text-gray-500 px-1">{timeLabel}</span>
        )}
      </div>
    </div>
  );
};

export default Message;
