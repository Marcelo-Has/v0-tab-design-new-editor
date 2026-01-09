"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, Type, Square, Box, Palette, Minus, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { GlobalStyle, GlobalStyleCategory } from "@/lib/types"

interface GlobalStylesPanelProps {
  styles: GlobalStyle[]
  onStylesChange: (styles: GlobalStyle[]) => void
}

const categoryIcons: Record<GlobalStyleCategory, React.ReactNode> = {
  texts: <Type className="h-3.5 w-3.5" />,
  paddings: <Square className="h-3.5 w-3.5" />,
  margins: <Box className="h-3.5 w-3.5" />,
  borders: <Minus className="h-3.5 w-3.5" />,
  backgrounds: <Palette className="h-3.5 w-3.5" />,
}

const categoryLabels: Record<GlobalStyleCategory, string> = {
  texts: "Text Styles",
  paddings: "Paddings",
  margins: "Margins",
  borders: "Borders",
  backgrounds: "Backgrounds",
}

export function GlobalStylesPanel({ styles, onStylesChange }: GlobalStylesPanelProps) {
  const [editingStyle, setEditingStyle] = useState<GlobalStyle | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<GlobalStyleCategory | null>(null)

  const groupedStyles = styles.reduce(
    (acc, style) => {
      if (!acc[style.category]) acc[style.category] = []
      acc[style.category].push(style)
      return acc
    },
    {} as Record<GlobalStyleCategory, GlobalStyle[]>,
  )

  const handleAddStyle = (category: GlobalStyleCategory) => {
    const newStyle: GlobalStyle = {
      id: `${category}-${Date.now()}`,
      name: `new${category.charAt(0).toUpperCase() + category.slice(1, -1)}`,
      category,
      ...(category === "texts" && { fontSize: "14", fontColor: "#333333", fontWeight: "400" }),
      ...(category === "paddings" && { value: "8px" }),
      ...(category === "margins" && { value: "4px" }),
      ...(category === "borders" && { borderWidth: "1px", borderStyle: "solid", borderColor: "#e5e7eb" }),
      ...(category === "backgrounds" && { backgroundColor: "#ffffff" }),
    }
    onStylesChange([...styles, newStyle])
    setEditingStyle(newStyle)
  }

  const handleUpdateStyle = (updatedStyle: GlobalStyle) => {
    onStylesChange(styles.map((s) => (s.id === updatedStyle.id ? updatedStyle : s)))
    setEditingStyle(updatedStyle)
  }

  const handleDeleteStyle = (styleId: string) => {
    onStylesChange(styles.filter((s) => s.id !== styleId))
    if (editingStyle?.id === styleId) setEditingStyle(null)
  }

  return (
    <div className="px-4 pb-2">
      {/* Category list */}
      <div className="space-y-1">
        {(Object.keys(categoryLabels) as GlobalStyleCategory[]).map((category) => (
          <div key={category} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
                expandedCategory === category ? "bg-muted/50" : "hover:bg-muted/30",
              )}
            >
              <div className="flex items-center gap-2">
                {categoryIcons[category]}
                <span className="font-medium">{categoryLabels[category]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {groupedStyles[category]?.length || 0}
                </span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    expandedCategory === category && "rotate-90",
                  )}
                />
              </div>
            </button>

            {expandedCategory === category && (
              <div className="border-t border-border bg-background">
                {/* Style items */}
                <div className="p-2 space-y-1">
                  {groupedStyles[category]?.map((style) => (
                    <div
                      key={style.id}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-colors",
                        editingStyle?.id === style.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                      onClick={() => setEditingStyle(editingStyle?.id === style.id ? null : style)}
                    >
                      {category === "texts" && <Type className="h-3 w-3 shrink-0" />}
                      {category === "backgrounds" && (
                        <div
                          className="w-3 h-3 rounded-sm border border-border shrink-0"
                          style={{ backgroundColor: style.backgroundColor }}
                        />
                      )}
                      {(category === "paddings" || category === "margins") && <Square className="h-3 w-3 shrink-0" />}
                      {category === "borders" && (
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ border: `2px ${style.borderStyle || "solid"} ${style.borderColor || "#ccc"}` }}
                        />
                      )}
                      <span className="truncate flex-1">{style.name}</span>
                      {editingStyle?.id === style.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteStyle(style.id)
                          }}
                          className="p-0.5 hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add button */}
                  <button
                    onClick={() => handleAddStyle(category)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add new</span>
                  </button>
                </div>

                {/* Inline edit panel for selected style */}
                {editingStyle && editingStyle.category === category && (
                  <div className="border-t border-border p-3 space-y-3 bg-muted/20">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Name</Label>
                        <Input
                          value={editingStyle.name}
                          onChange={(e) => handleUpdateStyle({ ...editingStyle, name: e.target.value })}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Input
                          value={editingStyle.description || ""}
                          onChange={(e) => handleUpdateStyle({ ...editingStyle, description: e.target.value })}
                          placeholder="Optional"
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>

                    {/* Text style properties */}
                    {editingStyle.category === "texts" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editingStyle.fontColor || "#333333"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, fontColor: e.target.value })}
                            className="h-7 w-7 rounded border border-input cursor-pointer shrink-0"
                          />
                          <div className="space-y-1 flex-1">
                            <Input
                              type="number"
                              value={editingStyle.fontSize || "14"}
                              onChange={(e) => handleUpdateStyle({ ...editingStyle, fontSize: e.target.value })}
                              placeholder="Size"
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() =>
                                handleUpdateStyle({
                                  ...editingStyle,
                                  fontWeight: editingStyle.fontWeight === "700" ? "400" : "700",
                                })
                              }
                              className={cn(
                                "p-1 rounded border text-xs",
                                editingStyle.fontWeight === "700" ? "border-primary bg-primary/10" : "border-input",
                              )}
                            >
                              <span className="font-bold">B</span>
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStyle({
                                  ...editingStyle,
                                  fontStyle: editingStyle.fontStyle === "italic" ? "normal" : "italic",
                                })
                              }
                              className={cn(
                                "p-1 rounded border text-xs",
                                editingStyle.fontStyle === "italic" ? "border-primary bg-primary/10" : "border-input",
                              )}
                            >
                              <span className="italic">I</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Padding/Margin */}
                    {(editingStyle.category === "paddings" || editingStyle.category === "margins") && (
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Value</Label>
                        <Input
                          value={editingStyle.value || ""}
                          onChange={(e) => handleUpdateStyle({ ...editingStyle, value: e.target.value })}
                          placeholder="8px or 8px 16px"
                          className="h-7 text-xs"
                        />
                      </div>
                    )}

                    {/* Border */}
                    {editingStyle.category === "borders" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Width</Label>
                          <Input
                            value={editingStyle.borderWidth || "1px"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, borderWidth: e.target.value })}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Style</Label>
                          <select
                            value={editingStyle.borderStyle || "solid"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, borderStyle: e.target.value })}
                            className="w-full h-7 text-xs rounded-md border border-input bg-background px-2"
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Color</Label>
                          <input
                            type="color"
                            value={editingStyle.borderColor || "#e5e7eb"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, borderColor: e.target.value })}
                            className="h-7 w-full rounded border border-input cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* Background */}
                    {editingStyle.category === "backgrounds" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingStyle.backgroundColor || "#ffffff"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, backgroundColor: e.target.value })}
                            className="h-7 w-7 rounded border border-input cursor-pointer shrink-0"
                          />
                          <Input
                            value={editingStyle.backgroundColor || "#ffffff"}
                            onChange={(e) => handleUpdateStyle({ ...editingStyle, backgroundColor: e.target.value })}
                            className="h-7 text-xs flex-1"
                          />
                        </div>
                        <div
                          className="h-8 rounded border border-border"
                          style={{
                            background: editingStyle.backgroundGradient || editingStyle.backgroundColor || "#ffffff",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
