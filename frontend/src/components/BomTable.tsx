"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Trash2, Download, ExternalLink } from "lucide-react"

interface BOMItem {
  id: string
  component: string
  description: string
  quantity: number
  unitPrice: number
  supplier: string
  supplierLink: string
  datasheet?: string
}

export function BOMTable() {
  const [bomItems, setBomItems] = useState<BOMItem[]>([
    {
      id: "1",
      component: "Arduino Uno R3",
      description: "Microcontroller board",
      quantity: 1,
      unitPrice: 25.0,
      supplier: "Arduino Store",
      supplierLink: "https://store.arduino.cc/products/arduino-uno-rev3",
      datasheet: "https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf",
    },
    {
      id: "2",
      component: "LED (Red)",
      description: "5mm red LED",
      quantity: 5,
      unitPrice: 0.25,
      supplier: "Digikey",
      supplierLink: "https://www.digikey.com/en/products/detail/kingbright/WP7113ID/1747663",
    },
    {
      id: "3",
      component: "Resistor 220Ω",
      description: "1/4W carbon film resistor",
      quantity: 5,
      unitPrice: 0.1,
      supplier: "Mouser",
      supplierLink: "https://www.mouser.com/ProductDetail/YAGEO/CFR-25JB-52-220R",
    },
    {
      id: "4",
      component: "Breadboard",
      description: "Half-size breadboard",
      quantity: 1,
      unitPrice: 5.5,
      supplier: "Adafruit",
      supplierLink: "https://www.adafruit.com/product/64",
    },
    {
      id: "5",
      component: "LM35 Temperature Sensor",
      description: "Precision temperature sensor",
      quantity: 1,
      unitPrice: 3.2,
      supplier: "SparkFun",
      supplierLink: "https://www.sparkfun.com/products/10988",
      datasheet: "https://www.ti.com/lit/ds/symlink/lm35.pdf",
    },
  ])

  const totalCost = bomItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const handleDeleteItem = (id: string) => {
    setBomItems((prev) => prev.filter((item) => item.id !== id))
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
            <Button size="sm" variant="outline" className="bg-white text-charcoal border-charcoal/20">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
            <Button size="sm" className="bg-charcoal hover:bg-charcoal/80 text-cream">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-cormorant font-semibold">Component</TableHead>
                <TableHead className="font-cormorant font-semibold">Description</TableHead>
                <TableHead className="font-cormorant font-semibold">Qty</TableHead>
                <TableHead className="font-cormorant font-semibold">Unit Price</TableHead>
                <TableHead className="font-cormorant font-semibold">Total</TableHead>
                <TableHead className="font-cormorant font-semibold">Supplier</TableHead>
                <TableHead className="font-cormorant font-semibold">Links</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bomItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.component}</TableCell>
                  <TableCell className="text-sm text-charcoal/70">{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-sm">{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openLink(item.supplierLink)}
                        className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View on supplier website"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      {item.datasheet && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openLink(item.datasheet)}
                          className="p-1 h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="View datasheet"
                        >
                          📄
                        </Button>
                      )}
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

          <div className="mt-4 p-4 bg-white rounded-lg border border-charcoal/20">
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
      </ScrollArea>
    </div>
  )
}
