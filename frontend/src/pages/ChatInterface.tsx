"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChatPanel } from "@/components/ChatPanel"
import { CodeEditor } from "@/components/CodeEditor"
import { BOMTable } from "@/components/BomTable"
import { Button } from "@/components/ui/button"
import { MessageCircle, Code, Package, HomeIcon, GripVertical, X } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

type PanelPosition = "left" | "right" | "bottom" | "center" | "hidden"

interface Panel {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
  position: PanelPosition
}

interface DragItem {
  id: string
  type: string
}

const PANEL_ICONS = {
  chat: <MessageCircle className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
  bom: <Package className="w-4 h-4" />,
}

function DropZone({
  position,
  onDrop,
  isVisible,
  className,
  label,
}: {
  position: PanelPosition
  onDrop: (id: string, position: PanelPosition) => void
  isVisible: boolean
  className: string
  label: string
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "panel",
    drop: (item: DragItem) => {
      onDrop(item.id, position)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  if (!isVisible) return null

  return (
    <div
      ref={drop}
      className={`absolute z-50 transition-all duration-200 ${
        isOver ? "bg-blue-500/40 border-2 border-blue-500" : "bg-blue-500/20 border-2 border-blue-400 border-dashed"
      } ${className}`}
    >
      <div className="flex items-center justify-center h-full">
        <div className="bg-white/90 px-3 py-1 rounded-md text-sm font-medium text-charcoal shadow-lg">{label}</div>
      </div>
    </div>
  )
}

function DraggableTab({
  panel,
  onMove,
  onSetDragging,
}: {
  panel: Panel
  onMove: (id: string, position: PanelPosition) => void
  onSetDragging: (isDragging: boolean) => void
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "panel",
    item: { id: panel.id, type: "panel" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    onSetDragging(isDragging)
  }, [isDragging, onSetDragging])

  const togglePanel = () => {
    if (panel.position === "hidden") {
      onMove(panel.id, "left")
    } else {
      onMove(panel.id, "hidden")
    }
  }

  return (
    <Button
      ref={drag}
      variant="ghost"
      size="sm"
      onClick={togglePanel}
      className={`text-cream hover:bg-cream/10 cursor-move ${
        panel.position !== "hidden" ? "bg-cream/20" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {panel.icon}
      <span className="ml-2 capitalize">{panel.title}</span>
      <GripVertical className="w-3 h-3 ml-1 opacity-50" />
    </Button>
  )
}

function PanelTabs({
  panels,
  activePanel,
  onSetActive,
  onClose,
}: {
  panels: Panel[]
  activePanel: string
  onSetActive: (id: string) => void
  onClose: (id: string) => void
}) {
  if (panels.length <= 1) return null

  return (
    <div className="flex border-b border-charcoal/20 bg-cream">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className={`flex items-center px-3 py-2 border-r border-charcoal/20 cursor-pointer group ${
            activePanel === panel.id ? "bg-white" : "hover:bg-white/50"
          }`}
          onClick={() => onSetActive(panel.id)}
        >
          {panel.icon}
          <span className="ml-2 text-sm capitalize">{panel.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose(panel.id)
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-charcoal/10 rounded p-1 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ChatInterface() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ChatInterfaceContent />
    </DndProvider>
  )
}

function ChatInterfaceContent() {
  const [panels, setPanels] = useState<Panel[]>([
    {
      id: "chat",
      title: "chat",
      icon: PANEL_ICONS.chat,
      component: <ChatPanel />,
      position: "left",
    },
    {
      id: "code",
      title: "code",
      icon: PANEL_ICONS.code,
      component: <CodeEditor />,
      position: "right",
    },
    {
      id: "bom",
      title: "bom",
      icon: PANEL_ICONS.bom,
      component: <BOMTable />,
      position: "right",
    },
  ])

  const [isDragging, setIsDragging] = useState(false)
  const [activeTabs, setActiveTabs] = useState<Record<PanelPosition, string>>({
    left: "chat",
    right: "code",
    bottom: "bom",
    center: "code",
    hidden: "chat",
  })

  // Fix ResizeObserver error
  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", handleResizeObserverError)
    return () => window.removeEventListener("error", handleResizeObserverError)
  }, [])

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const movePanel = (id: string, position: PanelPosition) => {
    setPanels((prev) => prev.map((panel) => (panel.id === id ? { ...panel, position } : panel)))
    if (position !== "hidden") {
      setActiveTabs((prev) => ({ ...prev, [position]: id }))
    }
  }

  const closePanel = (id: string) => {
    setPanels((prev) => prev.map((panel) => (panel.id === id ? { ...panel, position: "hidden" } : panel)))
  }

  const setActiveTab = (position: PanelPosition, id: string) => {
    setActiveTabs((prev) => ({ ...prev, [position]: id }))
  }

  const leftPanels = panels.filter((p) => p.position === "left")
  const rightPanels = panels.filter((p) => p.position === "right")
  const bottomPanels = panels.filter((p) => p.position === "bottom")
  const centerPanels = panels.filter((p) => p.position === "center")

  const renderPanelGroup = (panelGroup: Panel[], position: PanelPosition) => {
    if (panelGroup.length === 0) return null

    const activePanel = activeTabs[position]
    const currentPanel = panelGroup.find((p) => p.id === activePanel) || panelGroup[0]

    return (
      <div className="h-full flex flex-col">
        <PanelTabs
          panels={panelGroup}
          activePanel={currentPanel.id}
          onSetActive={(id) => setActiveTab(position, id)}
          onClose={closePanel}
        />
        <div className="flex-1">{currentPanel.component}</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-cream overflow-hidden relative">
      {/* Drop Zones */}
      <DropZone
        position="left"
        onDrop={movePanel}
        isVisible={isDragging}
        className="top-16 left-0 w-1/4 h-[calc(100vh-4rem)]"
        label="Left Panel"
      />
      <DropZone
        position="right"
        onDrop={movePanel}
        isVisible={isDragging}
        className="top-16 right-0 w-1/4 h-[calc(100vh-4rem)]"
        label="Right Panel"
      />
      <DropZone
        position="bottom"
        onDrop={movePanel}
        isVisible={isDragging}
        className="bottom-0 left-1/4 w-1/2 h-1/3"
        label="Bottom Panel"
      />
      <DropZone
        position="center"
        onDrop={movePanel}
        isVisible={isDragging}
        className="top-16 left-1/4 w-1/2 h-1/3"
        label="Center Tabs"
      />

      {/* Header */}
      <header className="h-16 bg-charcoal text-cream px-6 flex items-center border-b border-charcoal/20 relative z-50">
        <Button variant="ghost" size="sm" onClick={handleGoHome} className="text-cream hover:bg-cream/10 mr-4">
          <HomeIcon className="w-4 h-4 mr-2" />
        </Button>
        <h1 className="font-cormorant text-2xl font-bold mr-8">Circuit Studio</h1>

        {/* Draggable Panel Tabs */}
        <div className="flex gap-2">
          {panels.map((panel) => (
            <DraggableTab key={panel.id} panel={panel} onMove={movePanel} onSetDragging={setIsDragging} />
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="h-[calc(100vh-4rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Top Section */}
          <ResizablePanel defaultSize={bottomPanels.length > 0 ? 70 : 100}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Left Panel */}
              {leftPanels.length > 0 && (
                <>
                  <ResizablePanel defaultSize={25} minSize={15} maxSize={45}>
                    {renderPanelGroup(leftPanels, "left")}
                  </ResizablePanel>
                  <ResizableHandle className="w-2 bg-charcoal/10 hover:bg-charcoal/20 transition-colors">
                    <div className="flex h-full items-center justify-center">
                      <GripVertical className="w-4 h-4 text-charcoal/40" />
                    </div>
                  </ResizableHandle>
                </>
              )}

              {/* Main Content Area */}
              <ResizablePanel
                defaultSize={
                  leftPanels.length === 0 && rightPanels.length === 0 && centerPanels.length === 0 ? 100 : 50
                }
              >
                {centerPanels.length > 0 ? (
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={70}>
                      <div className="h-full bg-white relative overflow-hidden">
                        <iframe
                          src="https://tscircuit.com/editor?template=blank-circuit-board#data:application/gzip;base64,H4sIAJsBqGcAA91ZXW/bNhR9768g9JR0dSLJH3GHOIBne0ODtAnsxtswDIMs07EwWTRkKhlm9L+XlESKIkWRTvvUhwDhFS/vOYeX95IJ/G+PUgzWcBNkMQZn52B0A87eAHC9QkG6Bi/RGm9HztDd7RywhdHTFo+cKzq6IZMAOF6+BQsUByl4CBIYgw/JPsNggpIEhhil4O3ll3ze9T5KtjBYwzQfApAEOzhybj2nHJPvE5QleHT0Cw9qwiGJ7V/0eyQeM4arP0ZHl88JV3+Ojh2/zwyHcCt+J0P6fVitmdwFKxgfRse/nMX93Xj+k/MOFL91nL+LaZcFN05wiWIcPEEwh09ZHFBaZ/3lecUt3Eb7Gq1HTmuDEN6nEeHlHBD2/a7AlwE5lqbc6P0MnOWHT8470egT42+fpnVjl868f/xct/bKqaXtiyAU0aXjm5TrDJqlkzUpNjoM9kEYUUU25Cfl+lTSsAk1fSZcn/J7kITE7Llu9muDcp7vDur73+kaeby343Gf4W8h4muINPJwh25f4uEZeXTteHyMwhSFKMEpimMoAleSk2OuJWcUepXIbck5majJOXbV3Bx7amaO/bqtT23dum1AbA+/f5S8rwqr5D9sOhjviXEqAfJcapTW9CifqbSkR/lMJUweJTTtSUbKaNqXjJTSfLaYSefSo7T0B1NKA7F+qeWsHMopcDede6ADPqN9tfspPEQHOWvpRIajmMDS9l+rrJVz1jNU354Wr0/wzmlTMSPmWfsaxBXCRn1LgGZ9uwTvLwhjtDMD5qX+O0hsUFgvcI8AvoMbC3173wJXSIFGgVkKGBR+yOK4s0YvSQkCpYe8HhN4BwODkzJ64FZ9OMcvoVcy2jNntAbWKWmrwJJVlVBJopYgLUCdkpomrQxS2St1SgIqoJQElNuoWau8iyLa9Kdp9ExaKC2m4/+jXYa3be2UI5Ha6fDV3VS+/tHmo3Q52nyU2x9tPoqRdR6ln86kOLSbLhfaq6OkcHWVbL45lsNWiWn9n8XwOcARStpE5snxY4ts0thO4gVMn1EpNH+KCQVU8xbjpap6i/HLZ8tbTEmM6m7enBiax9hsvrz3itdY/us/5LpXjRofZzom4ivrBCYmIvY8/IqHX+Phax+ZUxiibB9HyZP0GNlpb/bNTxJOXn5bJY1vEqWUVrSaOjl/nbc3cvRCkBLQNPfI0RaSD6dBCMEmRbuRc3HrgRtwQY+pAzAihkfBUC5q8JhYe/hyDGKw8+AxdB7ikvUYPZNHl8XwDTwUj0drD86DedjzYB5DnYcwQUI14C7ijbSWFRjp07sWJn/bSKlioi/4MDriIo0++ig6yZQYDZI1gxPwWxMS0BSETD76KCSN2j1OJtR9BSHmwwkJizTD00bRHTUlhjWh3isIMR9OSFikGZ42St/kYSJU3bfWxX3LXJH5UuT0FmsL6rVXgCvmIcBr9+CMTZuuephU1ccwVjIlhn3tYzF0Z0v1YDG0HsKS9RhVeZU8hCXrMRoKcpEdFmnBopJDli96a2wlLCr3MCUSX9J6y/iS1lvGYyhy6jaAx1DkrDzaL3GVuhpxJycXTu5hUwFmSbCKIb2lFn9N2QkVwbjf/FAbLxtMFq3H9WX+P6WbN+dfAclBhlR2GgAA"
                          className="w-full h-full border-0"
                          title="TSCircuit Editor"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        />
                      </div>
                    </ResizablePanel>
                    <ResizableHandle className="h-2 bg-charcoal/10 hover:bg-charcoal/20 transition-colors">
                      <div className="flex w-full items-center justify-center">
                        <GripVertical className="w-4 h-4 text-charcoal/40 rotate-90" />
                      </div>
                    </ResizableHandle>
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                      {renderPanelGroup(centerPanels, "center")}
                    </ResizablePanel>
                  </ResizablePanelGroup>
                ) : (
                  <div className="h-full bg-white relative overflow-hidden">
                    <iframe
                      src="https://tscircuit.com/editor?template=blank-circuit-board#data:application/gzip;base64,H4sIAJsBqGcAA91ZXW/bNhR9768g9JR0dSLJH3GHOIBne0ODtAnsxtswDIMs07EwWTRkKhlm9L+XlESKIkWRTvvUhwDhFS/vOYeX95IJ/G+PUgzWcBNkMQZn52B0A87eAHC9QkG6Bi/RGm9HztDd7RywhdHTFo+cKzq6IZMAOF6+BQsUByl4CBIYgw/JPsNggpIEhhil4O3ll3ze9T5KtjBYwzQfApAEOzhybj2nHJPvE5QleHT0Cw9qwiGJ7V/0eyQeM4arP0ZHl88JV3+Ojh2/zwyHcCt+J0P6fVitmdwFKxgfRse/nMX93Xj+k/MOFL91nL+LaZcFN05wiWIcPEEwh09ZHFBaZ/3lecUt3Eb7Gq1HTmuDEN6nEeHlHBD2/a7AlwE5lqbc6P0MnOWHT8470egT42+fpnVjl868f/xct/bKqaXtiyAU0aXjm5TrDJqlkzUpNjoM9kEYUUU25Cfl+lTSsAk1fSZcn/J7kITE7Llu9muDcp7vDur73+kaeby343Gf4W8h4muINPJwh25f4uEZeXTteHyMwhSFKMEpimMoAleSk2OuJWcUepXIbck5majJOXbV3Bx7amaO/bqtT23dum1AbA+/f5S8rwqr5D9sOhjviXEqAfJcapTW9CifqbSkR/lMJUweJTTtSUbKaNqXjJTSfLaYSefSo7T0B1NKA7F+qeWsHMopcDede6ADPqN9tfspPEQHOWvpRIajmMDS9l+rrJVz1jNU354Wr0/wzmlTMSPmWfsaxBXCRn1LgGZ9uwTvLwhjtDMD5qX+O0hsUFgvcI8AvoMbC3173wJXSIFGgVkKGBR+yOK4s0YvSQkCpYe8HhN4BwODkzJ64FZ9OMcvoVcy2jNntAbWKWmrwJJVlVBJopYgLUCdkpomrQxS2St1SgIqoJQElNuoWau8iyLa9Kdp9ExaKC2m4/+jXYa3be2UI5Ha6fDV3VS+/tHmo3Q52nyU2x9tPoqRdR6ln86kOLSbLhfaq6OkcHWVbL45lsNWiWn9n8XwOcARStpE5snxY4ts0thO4gVMn1EpNH+KCQVU8xbjpap6i/HLZ8tbTEmM6m7enBiax9hsvrz3itdY/us/5LpXjRofZzom4ivrBCYmIvY8/IqHX+Phax+ZUxiibB9HyZP0GNlpb/bNTxJOXn5bJY1vEqWUVrSaOjl/nbc3cvRCkBLQNPfI0RaSD6dBCMEmRbuRc3HrgRtwQY+pAzAihkfBUC5q8JhYe/hyDGKw8+AxdB7ikvUYPZNHl8XwDTwUj0drD86DedjzYB5DnYcwQUI14C7ijbSWFRjp07sWJn/bSKlioi/4MDriIo0++ig6yZQYDZI1gxPwWxMS0BSETD76KCSN2j1OJtR9BSHmwwkJizTD00bRHTUlhjWh3isIMR9OSFikGZ42St/kYSJU3bfWxX3LXJH5UuT0FmsL6rVXgCvmIcBr9+CMTZuuephU1ccwVjIlhn3tYzF0Z0v1YDG0HsKS9RhVeZU8hCXrMRoKcpEdFmnBopJDli96a2wlLCr3MCUSX9J6y/iS1lvGYyhy6jaAx1DkrDzaL3GVuhpxJycXTu5hUwFmSbCKIb2lFn9N2QkVwbjf/FAbLxtMFq3H9WX+P6WbN+dfAclBhlR2GgAA"
                      className="w-full h-full border-0"
                      title="TSCircuit Editor"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                  </div>
                )}
              </ResizablePanel>

              {/* Right Panel */}
              {rightPanels.length > 0 && (
                <>
                  <ResizableHandle className="w-2 bg-charcoal/10 hover:bg-charcoal/20 transition-colors">
                    <div className="flex h-full items-center justify-center">
                      <GripVertical className="w-4 h-4 text-charcoal/40" />
                    </div>
                  </ResizableHandle>
                  <ResizablePanel defaultSize={25} minSize={15} maxSize={45}>
                    {renderPanelGroup(rightPanels, "right")}
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Bottom Panel */}
          {bottomPanels.length > 0 && (
            <>
              <ResizableHandle className="h-2 bg-charcoal/10 hover:bg-charcoal/20 transition-colors">
                <div className="flex w-full items-center justify-center">
                  <GripVertical className="w-4 h-4 text-charcoal/40 rotate-90" />
                </div>
              </ResizableHandle>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                {renderPanelGroup(bottomPanels, "bottom")}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
