"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Send, MessageCircle, Zap, Code, Package, Copy } from "lucide-react"
import { BACKEND_URL } from "../constants"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "circuit" | "firmware" | "bom" | "general"
}

interface CircuitResponse {
  content: string
  type: "circuit" | "firmware" | "bom" | "general"
  firmware?: string
}

const CIRCUIT_SUGGESTIONS = [
  "Create a simple LED blink circuit",
  "Design a temperature sensor circuit",
  "Build a motor control circuit",
  "Make a voltage divider circuit",
  "Create an Arduino-based alarm system",
  "Design a light sensor circuit",
  "Build a servo motor controller",
  "Create a buzzer alarm circuit",
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return

    setHasUserInteracted(true)

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsGenerating(true)

    try {
      const componentsResponse = fetch(`${BACKEND_URL}/perplexity/components`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      })
      const reactComponentsResponse = fetch(`${BACKEND_URL}/claude/diagrams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      })

      const [componentsData, reactComponentsData] = await Promise.all([componentsResponse, reactComponentsResponse])

      let cleaned = reactComponentsData.data.replace(/^```[a-zA-Z]*\n/, '').replace(/```$/, '');
      cleaned = cleaned.replace(/\\n/g, '\n');

      console.log(cleaned)


      console.log(JSON.stringify(JSON.parse(JSON.stringify(componentsData, null, 2)), null, 2))
      console.log(JSON.stringify(JSON.parse(JSON.stringify(reactComponentsData, null, 2)), null, 2))

      // Handle components response
      if (componentsData.ok) {
        const componentsResult = await componentsData.json()
        console.log('Components response:', componentsResult)
        
        // Add assistant message for components
        const assistantMessage: Message = {
          id: Date.now().toString() + '-components',
          content: `Component list generated successfully. Response ID: ${componentsResult.id}`,
          sender: "assistant",
          timestamp: new Date(),
          type: "bom"
        }
        setMessages((prev) => [...prev, assistantMessage])
      }

      // Handle diagrams response
      if (reactComponentsData.ok) {
        const diagramsResult = await reactComponentsData.json()
        console.log('Diagrams response:', diagramsResult)
        
        // Add assistant message for diagrams
        const assistantMessage: Message = {
          id: Date.now().toString() + '-diagrams',
          content: diagramsResult.data || 'Circuit diagram generated successfully.',
          sender: "assistant",
          timestamp: new Date(),
          type: "circuit"
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error making API requests:', error)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: 'Sorry, there was an error processing your request. Please try again.',
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsGenerating(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setHasUserInteracted(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "circuit":
        return <Zap className="w-4 h-4 text-blue-500" />
      case "firmware":
        return <Code className="w-4 h-4 text-green-500" />
      case "bom":
        return <Package className="w-4 h-4 text-orange-500" />
      default:
        return null
    }
  }

  const renderMessageContent = (content: string) => {
    const parts = content.split(/```(\w+)?\n([\s\S]*?)```/)

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // This is code content
        const language = parts[index - 1] || "text"
        return (
          <div key={index} className="my-3 relative">
            <div className="bg-gray-100 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-200 text-sm">
                <span className="font-mono text-gray-600">{language}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(part)}
                  className="h-6 px-2 text-gray-600 hover:text-gray-800"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="p-3 text-sm overflow-x-auto">
                <code>{part}</code>
              </pre>
            </div>
          </div>
        )
      } else if (index % 3 === 0) {
        // This is regular text
        return <span key={index}>{part}</span>
      }
      return null
    })
  }

  return (
    <div className="flex flex-col h-full bg-cream border-r border-charcoal/20">
      <div className="p-4 border-b border-charcoal/20">
        <div className="flex items-center gap-2">
          <h2 className="font-cormorant text-xl font-semibold text-charcoal">Assistant</h2>
        </div>
        <p className="text-sm text-charcoal/70 mt-1">Design circuits, generate firmware, create BOMs</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && !hasUserInteracted && (
            <div className="text-center text-charcoal/50 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-cormorant text-lg">Ready to design circuits</p>
              <p className="text-sm">Choose a suggestion below or describe what you want to build</p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-charcoal text-cream"
                    : "bg-white text-charcoal border border-charcoal/20"
                }`}
              >
                {message.sender === "assistant" && message.type && (
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageIcon(message.type)}
                    <span className="text-xs font-medium capitalize">{message.type}</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
                <span className="text-xs opacity-70 mt-2 block">{message.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white text-charcoal border border-charcoal/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-charcoal/20 border-t-charcoal rounded-full"></div>
                  <span className="text-sm">Generating circuit design...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Horizontal Scrollable Suggestions */}
      {!hasUserInteracted && (
        <div className="px-4 pb-2">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex gap-2 pb-2 min-w-max">
              {CIRCUIT_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex-shrink-0 px-3 py-1 text-xs bg-white/80 text-charcoal border border-charcoal/20 rounded-full cursor-pointer hover:bg-white transition-colors whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="p-4 border-t border-charcoal/20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe the circuit you want to build..."
            className="flex-1 bg-white border-charcoal/20"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isGenerating}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-charcoal hover:bg-charcoal/80 text-cream"
            disabled={isGenerating}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
