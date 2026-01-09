"use client"

import { useState } from "react"
import { Check, ChevronDown, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { StyleConfig, SavedStyle } from "@/lib/types"

const savedStyles: SavedStyle[] = [
  {
    id: "minimal",
    name: "Minimal",
    styles: { padding: "8px", margin: "0px", border: "none", background: "transparent" },
  },
  {
    id: "card",
    name: "Card",
    styles: { padding: "16px", margin: "8px", border: "1px solid #e5e7eb", background: "#ffffff" },
  },
  {
    id: "elevated",
    name: "Elevated",
    styles: { padding: "20px", margin: "12px", border: "none", background: "#ffffff" },
  },
  {
    id: "bordered",
    name: "Bordered",
    styles: { padding: "12px", margin: "4px", border: "2px solid #3b82f6", background: "#f0f9ff" },
  },
  {
    id: "dark",
    name: "Dark",
    styles: { padding: "16px", margin: "8px", border: "1px solid #374151", background: "#1f2937" },
  },
  {
    id: "gradient-blue",
    name: "Gradient Blue",
    styles: {
      padding: "16px",
      margin: "8px",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  },
]

interface StyleSelectorProps {
  currentStyles: StyleConfig
  onStyleChange: (styles: StyleConfig) => void
  label: string
}

export function StyleSelector({ currentStyles, onStyleChange, label }: StyleSelectorProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleSelectSavedStyle = (style: SavedStyle) => {
    setSelectedStyleId(style.id)
    setIsCustom(false)
    onStyleChange(style.styles)
    setOpen(false)
  }

  const handleCustomClick = () => {
    setIsCustom(true)
    setSelectedStyleId(null)
  }

  const getDisplayName = () => {
    if (isCustom) return "Custom"
    if (selectedStyleId) {
      const style = savedStyles.find((s) => s.id === selectedStyleId)
      return style?.name || "Select style"
    }
    return "Select style"
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex items-center justify-between h-9 px-3 rounded-lg border border-input bg-background text-sm hover:bg-muted/50 transition-colors">
            <span className={cn(!selectedStyleId && !isCustom && "text-muted-foreground")}>{getDisplayName()}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground px-2">Saved Styles</span>
          </div>
          <div className="p-2 space-y-1 max-h-[240px] overflow-y-auto">
            {savedStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSelectSavedStyle(style)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                  selectedStyleId === style.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
              >
                <div
                  className="w-8 h-8 rounded border border-border flex-shrink-0"
                  style={{
                    background: style.styles.background || "#ffffff",
                    border: style.styles.border || "1px solid #e5e7eb",
                  }}
                />
                <span className="flex-1 text-left">{style.name}</span>
                {selectedStyleId === style.id && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
          <div className="border-t border-border p-2">
            <button
              onClick={handleCustomClick}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                isCustom ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
            >
              <div className="w-8 h-8 rounded border border-dashed border-muted-foreground/40 flex items-center justify-center">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left">Custom</span>
              {isCustom && <Check className="h-4 w-4 text-primary" />}
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Custom style inputs - shown when Custom is selected */}
      {isCustom && (
        <div className="space-y-3 pt-2 pl-3 border-l-2 border-primary/20">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Padding</Label>
            <Input
              value={currentStyles.padding || ""}
              onChange={(e) => onStyleChange({ ...currentStyles, padding: e.target.value })}
              placeholder="8px 16px"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Margin</Label>
            <Input
              value={currentStyles.margin || ""}
              onChange={(e) => onStyleChange({ ...currentStyles, margin: e.target.value })}
              placeholder="0px"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Border</Label>
            <Input
              value={currentStyles.border || ""}
              onChange={(e) => onStyleChange({ ...currentStyles, border: e.target.value })}
              placeholder="1px solid #ddd"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Background</Label>
            <div className="flex gap-2">
              <Input
                value={currentStyles.background || ""}
                onChange={(e) => onStyleChange({ ...currentStyles, background: e.target.value })}
                placeholder="#ffffff"
                className="h-8 text-sm flex-1"
              />
              <input
                type="color"
                value={currentStyles.background || "#ffffff"}
                onChange={(e) => onStyleChange({ ...currentStyles, background: e.target.value })}
                className="h-8 w-8 rounded border border-input cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
