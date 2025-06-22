"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Download } from "lucide-react"
import Editor from "@monaco-editor/react"

export function CodeEditor() {
  const [code, setCode] = useState(`// Arduino Firmware for tscircuit
#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("Circuit initialized");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  
  Serial.println("LED blink cycle complete");
}`)

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "")
  }

  const handleExport = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "circuit_firmware.ino"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="p-4 border-b border-charcoal/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-charcoal" />
            <h3 className="font-cormorant text-xl font-semibold text-charcoal font-cormorant ">Arduino IDE</h3>
          </div>
          <Button onClick={handleExport} size="sm" className="bg-charcoal hover:bg-charcoal/80 text-cream hover:bg-accent hover:cursor-pointer active:bg-gray-200 font-crimson">
            <Download className="w-4 h-4 mr-1" />
            Export .ino
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="h-full border border-charcoal/20 rounded-md overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </div>
  )
}
