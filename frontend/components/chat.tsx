"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your hardware assistant. How can I help you today?",
    role: "assistant",
    timestamp: new Date(),
  },
]

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getHardwareResponse(input),
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-white animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white animation-delay-200"></div>
            <div className="w-2 h-2 rounded-full bg-white animation-delay-400"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-end space-x-2">
          <textarea
            className="flex-1 bg-zinc-900 text-white border border-zinc-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white resize-none min-h-[80px]"
            placeholder="Ask about hardware..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={cn(
              "bg-zinc-700 hover:bg-zinc-600 text-white p-3 h-12 w-12",
              (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Simple response generator based on hardware-related keywords
function getHardwareResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("cpu") || lowerInput.includes("processor")) {
    return "Modern CPUs like AMD Ryzen and Intel Core series offer excellent performance for various computing needs. What specific CPU information are you looking for?"
  } else if (lowerInput.includes("gpu") || lowerInput.includes("graphics")) {
    return "Graphics cards from NVIDIA and AMD are the primary options for gaming and professional workloads. The RTX 4000 and RX 7000 series are the latest generations. What's your use case?"
  } else if (lowerInput.includes("ram") || lowerInput.includes("memory")) {
    return "DDR5 RAM is the latest standard, offering higher speeds than DDR4. For most users, 16GB is the sweet spot, while 32GB or more is recommended for heavy workloads. What system are you building?"
  } else if (lowerInput.includes("motherboard")) {
    return "Motherboards come in different form factors and chipsets. Key considerations include CPU socket compatibility, expansion slots, and connectivity options. Are you looking for a specific platform?"
  } else if (lowerInput.includes("storage") || lowerInput.includes("ssd") || lowerInput.includes("hdd")) {
    return "NVMe SSDs offer the best performance for primary storage, while SATA SSDs and HDDs provide cost-effective capacity. What storage configuration are you considering?"
  } else {
    return "I'm your hardware assistant. Feel free to ask about CPUs, GPUs, RAM, motherboards, storage, or any other computer hardware components!"
  }
}
