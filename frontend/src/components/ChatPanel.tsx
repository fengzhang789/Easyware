"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Zap, Code, Package, Copy } from "lucide-react"

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

const FIRMWARE_TEMPLATES: Record<string, string> = {
  led_blink: `// LED Blink Circuit Firmware
#include <Arduino.h>

#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("LED Blink Circuit Ready");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,

  temperature_sensor: `// Temperature Sensor Circuit Firmware
#include <Arduino.h>

#define TEMP_PIN A0
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("Temperature Sensor Ready");
}

void loop() {
  int sensorValue = analogRead(TEMP_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  float temperature = (voltage - 0.5) * 100;
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  if (temperature > 25) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  
  delay(1000);
}`,
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const generateCircuitResponse = (userMessage: string): CircuitResponse => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("led") || lowerMessage.includes("blink")) {
      return {
        content:
          "I'll create a simple LED blink circuit for you! This circuit includes:\n\n• Arduino Uno microcontroller\n• LED with current-limiting resistor\n• Breadboard connections\n\nThe circuit is now loading in the editor. Would you like me to generate the corresponding firmware code?",
        type: "circuit",
        firmware: "led_blink",
      }
    } else if (lowerMessage.includes("temperature") || lowerMessage.includes("sensor")) {
      return {
        content:
          "Creating a temperature sensor circuit! This design features:\n\n• Arduino Uno microcontroller\n• LM35 temperature sensor\n• Status LED indicator\n• Analog input configuration\n\nThe circuit is being generated. Should I also create the firmware to read temperature values?",
        type: "circuit",
        firmware: "temperature_sensor",
      }
    } else if (lowerMessage.includes("motor")) {
      return {
        content:
          "Designing a motor control circuit with:\n\n• Arduino Uno microcontroller\n• L298N motor driver\n• DC motor\n• Control buttons\n• Power supply connections\n\nCircuit is being assembled in the editor. Ready for firmware generation?",
        type: "circuit",
      }
    } else {
      return {
        content:
          "I can help you design various circuits! Here are some popular options:\n\n• LED blink circuits\n• Temperature sensor circuits\n• Motor control circuits\n• Voltage divider circuits\n\nWhat type of circuit interests you?",
        type: "general",
      }
    }
  }

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

    setTimeout(() => {
      const response = generateCircuitResponse(inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: "assistant",
        timestamp: new Date(),
        type: response.type,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsGenerating(false)

      if (response.firmware) {
        setTimeout(() => {
          const firmwareMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `Here's the Arduino firmware code for your circuit:\n\n\`\`\`cpp\n${FIRMWARE_TEMPLATES[response.firmware]}\n\`\`\`\n\nThis code will be automatically loaded into the Arduino IDE. You can export it as a .ino file!`,
            sender: "assistant",
            timestamp: new Date(),
            type: "firmware",
          }
          setMessages((prev) => [...prev, firmwareMessage])
        }, 2000)
      }
    }, 1500)
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
