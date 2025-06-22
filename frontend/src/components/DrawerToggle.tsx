"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DrawerToggleProps {
  isOpen: boolean
  onToggle: () => void
  side: "left" | "right"
  icon?: React.ReactNode
  label?: string
}

export function DrawerToggle({ isOpen, onToggle, side, icon, label }: DrawerToggleProps) {
  const ChevronIcon = side === "left" ? (isOpen ? ChevronLeft : ChevronRight) : isOpen ? ChevronRight : ChevronLeft

  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="sm"
      className={`
        absolute top-1/2 -translate-y-1/2 z-10 bg-white border border-charcoal/20 shadow-md hover:bg-cream
        ${side === "left" ? (isOpen ? "left-80" : "left-0") : isOpen ? "right-80" : "right-0"}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex items-center gap-1">
        {side === "left" && icon && <span className="text-charcoal">{icon}</span>}
        <ChevronIcon className="w-4 h-4 text-charcoal" />
        {side === "right" && icon && <span className="text-charcoal">{icon}</span>}
      </div>
      {label && <span className="sr-only">{label}</span>}
    </Button>
  )
}
