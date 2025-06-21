import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser ? "bg-zinc-800 text-white" : "bg-black border border-zinc-800 text-white",
        )}
      >
        <div className="flex items-center mb-1">
          <div className={cn("text-sm font-medium", isUser ? "text-zinc-300" : "text-white")}>
            {isUser ? "You" : "Hardware Assistant"}
          </div>
          <div className="text-xs text-zinc-500 ml-2">{formatTime(message.timestamp)}</div>
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}
