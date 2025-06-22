"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send, MessageCircle, Zap, Code, Package, Copy } from "lucide-react"
import { BACKEND_URL } from "../constants"
import cleanCircuitString from "../utils/circuit"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "circuit" | "firmware" | "bom" | "general"
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

export function ChatPanel({
  setCircuit,
  setComponentsData,
  setCode,
  initialPrompt,
}: {
  setCircuit: (circuit: string) => void
  setComponentsData: (data: Record<string, unknown>) => void
  setCode: (code: string) => void
  initialPrompt?: string | null
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isGenerating])

  // Auto-send initial prompt if provided
  useEffect(() => {
    if (initialPrompt && !hasUserInteracted) {
      setInputValue(initialPrompt)
      setHasUserInteracted(true)
      // Use setTimeout to ensure the component is fully mounted
      setTimeout(() => {
        handleSendMessageInternal(initialPrompt)
      }, 100)
    }
  }, [initialPrompt, hasUserInteracted])

  const handleSendMessageInternal = async (customInput?: string) => {
    const messageToSend = customInput || inputValue
    if (!messageToSend.trim() || isGenerating) return

    setHasUserInteracted(true)

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
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
          message: messageToSend,
        }),
      })
      const reactComponentsResponse = fetch(`${BACKEND_URL}/letta/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
        }),
      })
      const codeResponse = fetch(`${BACKEND_URL}/letta/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
        }),
      })

      const [componentsData, reactComponentsData, codeData] = await Promise.all([componentsResponse, reactComponentsResponse, codeResponse])

      // Parse the JSON responses
      const componentsResult = await componentsData.json()
      const diagramsResult = await reactComponentsData.json()
      const codeResult = await codeData.json()

      console.log('Code result:', codeResult)
      console.log('Raw diagrams result:', diagramsResult)
      console.log('Diagrams data:', diagramsResult.data)

      // Only set circuit if the diagrams request was successful
      if (reactComponentsData.ok && diagramsResult.data) {
        console.log('API response status:', reactComponentsData.status)
        console.log('API response headers:', reactComponentsData.headers)
        console.log('Raw diagrams data type:', typeof diagramsResult.data)
        console.log('Raw diagrams data length:', diagramsResult.data.length)
        
        const data = diagramsResult.data
        const cleaned = cleanCircuitString(data.messages[data.messages.length - 1].content)
        console.log('Cleaned circuit:', cleaned)
        console.log('Cleaned circuit type:', typeof cleaned)
        console.log('Cleaned circuit length:', cleaned.length)
        
        setCircuit(cleaned)
        setComponentsData(componentsResult)
        setCode(codeResult.data.messages[codeResult.data.messages.length - 1].content)
        console.log(componentsResult)
      } else {
        console.error('Diagrams request failed or no data:', reactComponentsData.status, diagramsResult)
      }

      console.log(JSON.stringify(JSON.parse(JSON.stringify(componentsResult, null, 2)), null, 2))
      console.log(JSON.stringify(JSON.parse(JSON.stringify(diagramsResult, null, 2)), null, 2))
      console.log(JSON.stringify(JSON.parse(JSON.stringify(componentsData, null, 2)), null, 2))

      // Handle components response
      if (componentsData.ok) {
        
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
        console.log('Diagrams response:', diagramsResult)
        
        // Extract the actual content from the Letta response
        let contentText = 'Circuit diagram generated successfully.'
        
        if (diagramsResult.data && diagramsResult.data.messages) {
          // Find the assistant message with the circuit content
          const assistantMessage = diagramsResult.data.messages.find(
            (msg: { messageType: string; content?: string }) => msg.messageType === "assistant_message"
          )
          
          if (assistantMessage && assistantMessage.content) {
            contentText = assistantMessage.content
          }
        }
        
        // Add assistant message for diagrams
        const assistantMessage: Message = {
          id: Date.now().toString() + '-diagrams',
          content: contentText,
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

  const handleSendMessage = async (customInput?: string) => {
    await handleSendMessageInternal(customInput)
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
    <div className="flex flex-col bg-cream border-r border-charcoal/20" style={{ height: 'calc(100vh - 60px)' }}>
      <div className="p-4 border-b border-charcoal/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-charcoal font-crimson-italic">Assistant</h2>
        </div>
        <p className="text-sm text-charcoal/70 mt-1 font-crimson">Design circuits, generate firmware, create BOMs</p>
      </div>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-scroll p-4">
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
                    ? "bg-accent text-charcoal border border-charcoal/20"
                    : "bg-white text-charcoal border border-charcoal/20"
                }`}
              >
                {message.sender === "assistant" && message.type && (
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageIcon(message.type)}
                    <span className="text-xs font-medium capitalize font-crimson">{message.type}</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap font-crimson break-words">{renderMessageContent(message.content)}</div>
                <span className="text-xs opacity-70 mt-2 block font-crimson-italic">{message.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white text-charcoal border border-charcoal/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-solid border-charcoal border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-crimson">Generating...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!hasUserInteracted && (
        <div className="px-4 pb-2">
          <div className="w-full overflow-hidden">
            <div className="flex gap-2 pb-2 flex-wrap">
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
          </div>
        </div>
      )}

      <div className="p-4 border-t border-charcoal/20 ">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe the circuit you want to build..."
            className="flex-1 bg-white border-charcoal/20 font-crimson-italic"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isGenerating}
          />
          <Button
            onClick={() => handleSendMessage()}
            size="icon"
            className="bg-charcoal hover:bg-charcoal/80 text-cream hover:bg-accent hover:cursor-pointer active:bg-gray-200"
            disabled={isGenerating}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
