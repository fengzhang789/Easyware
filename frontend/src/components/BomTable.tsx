"use client"

import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Package, Trash2, Download, ExternalLink } from "lucide-react"
import type { BOMItem } from "../types"

export function BOMTable({ bomItems, onBomChange }: { bomItems: BOMItem[]; onBomChange: (items: BOMItem[]) => void }) {
  const totalCost = bomItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const handleDeleteItem = (id: string) => {
    onBomChange(bomItems.filter((item) => item.id !== id))
  }

  const handleExport = () => {
    const headers = ["Component", "Quantity", "Unit Price", "Total", "Link"]
    const rows = bomItems.map((item) =>
      [
        `"${item.component.replace(/"/g, '""')}"`, // Handle quotes in component name
        item.quantity,
        item.unitPrice.toFixed(2),
        (item.quantity * item.unitPrice).toFixed(2),
        item.link,
      ].join(",")
    )

    const csvContent = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "bill-of-materials.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="p-4 border-b border-charcoal/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-charcoal" />
            <h3 className="font-cormorant text-xl font-semibold text-charcoal">Bill of Materials</h3>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-white hover:bg-accent cursor-pointer text-cream" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="overflow-x-auto">
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-cormorant font-semibold">Component</TableHead>
                    <TableHead className="font-cormorant font-semibold">Qty</TableHead>
                    <TableHead className="font-cormorant font-semibold">Unit Price</TableHead>
                    <TableHead className="font-cormorant font-semibold">Total</TableHead>
                    <TableHead className="font-cormorant font-semibold">Links</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bomItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.component}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openLink(item.link)}
                            className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="View on supplier website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg border border-charcoal/20 overflow-x-auto">
            <div className="flex justify-between items-center">
              <span className="font-cormorant text-lg font-semibold">Total Cost:</span>
              <span className="font-cormorant text-xl font-bold text-charcoal">${totalCost.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm text-charcoal/70">
              <p>• Prices exclude shipping and taxes</p>
              <p>• Click links to view components on supplier websites</p>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
