"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "./CodeEditor"
import { BOMTable } from "./BomTable"
import { Code, Package } from "lucide-react"

type ActivePanel = "code" | "bom" | null

export function RightPanel() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("code")

  return (
    <div className="flex flex-col h-full bg-cream border-l border-charcoal/20">
      <div className="p-4 border-b border-charcoal/20">
        <div className="flex gap-2">
          <Button
            variant={activePanel === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePanel(activePanel === "code" ? null : "code")}
            className={
              activePanel === "code"
                ? "bg-charcoal text-cream hover:bg-charcoal/80"
                : "bg-white text-charcoal border-charcoal/20 hover:bg-cream"
            }
          >
            <Code className="w-4 h-4 mr-1" />
            Code
          </Button>
          <Button
            variant={activePanel === "bom" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePanel(activePanel === "bom" ? null : "bom")}
            className={
              activePanel === "bom"
                ? "bg-charcoal text-cream hover:bg-charcoal/80"
                : "bg-white text-charcoal border-charcoal/20 hover:bg-cream"
            }
          >
            <Package className="w-4 h-4 mr-1" />
            BOM
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {activePanel === "code" && <CodeEditor />}
        {activePanel === "bom" && <BOMTable />}
        {!activePanel && (
          <div className="flex items-center justify-center h-full text-charcoal/50">
            <p className="font-cormorant text-lg">Select a tool to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
