"use client"

import type React from "react"
import { useState } from "react"
import {
  ChevronRight,
  Eye,
  EyeOff,
  ImageIcon,
  Type,
  Navigation,
  Filter,
  LayoutGrid,
  Plus,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TemplateBlock, TemplateElement, ElementType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LayerTreePanelProps {
  blocks: TemplateBlock[]
  selection: { blockId: string | null; elementId: string | null }
  onSelectBlock: (blockId: string | null) => void
  onSelectElement: (blockId: string, elementId: string) => void
  onBlockUpdate: (block: TemplateBlock) => void
}

const blockIcons: Record<string, React.ReactNode> = {
  topbar: <div className="w-4 h-1.5 rounded-sm bg-current" />,
  header: <div className="w-4 h-2 rounded-sm bg-current" />,
  leftbar: <div className="w-1.5 h-4 rounded-sm bg-current" />,
  rightbar: <div className="w-1.5 h-4 rounded-sm bg-current" />,
  chartArea: <LayoutGrid className="h-4 w-4" />,
}

const elementIcons: Record<ElementType, React.ReactNode> = {
  image: <ImageIcon className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  title: <Type className="h-3.5 w-3.5" />,
  caption: <Type className="h-3.5 w-3.5" />,
  navigation: <Navigation className="h-3.5 w-3.5" />,
  filter: <Filter className="h-3.5 w-3.5" />,
  divider: <div className="w-3.5 h-0.5 bg-current rounded" />,
}

const addableElements: { type: ElementType; label: string }[] = [
  { type: "image", label: "Image" },
  { type: "title", label: "Title" },
  { type: "caption", label: "Caption" },
  { type: "text", label: "Text" },
  { type: "navigation", label: "Navigation" },
  { type: "filter", label: "Filter" },
  { type: "divider", label: "Divider" },
]

export function LayerTreePanel({
  blocks,
  selection,
  onSelectBlock,
  onSelectElement,
  onBlockUpdate,
}: LayerTreePanelProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set(["topbar", "header", "leftbar"]))
  const [draggedElement, setDraggedElement] = useState<{ blockId: string; elementId: string } | null>(null)
  const [dragOverElement, setDragOverElement] = useState<{ blockId: string; elementId: string } | null>(null)

  const toggleExpand = (blockId: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) {
        next.delete(blockId)
      } else {
        next.add(blockId)
      }
      return next
    })
  }

  const toggleBlockEnabled = (block: TemplateBlock, e: React.MouseEvent) => {
    e.stopPropagation()
    onBlockUpdate({ ...block, enabled: !block.enabled })
  }

  const toggleElementVisible = (block: TemplateBlock, elementId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onBlockUpdate({
      ...block,
      elements: block.elements.map((el) => (el.id === elementId ? { ...el, visible: !el.visible } : el)),
    })
  }

  const handleAddElement = (block: TemplateBlock, type: ElementType) => {
    const newElement: TemplateElement = {
      id: `${block.id}-${type}-${Date.now()}`,
      type,
      label: addableElements.find((e) => e.type === type)?.label || type,
      visible: true,
      styles: {},
      order: block.elements.length,
    }
    onBlockUpdate({
      ...block,
      elements: [...block.elements, newElement],
    })
  }

  const handleDragStart = (blockId: string, elementId: string) => {
    setDraggedElement({ blockId, elementId })
  }

  const handleDragOver = (e: React.DragEvent, blockId: string, elementId: string) => {
    e.preventDefault()
    if (draggedElement && draggedElement.blockId === blockId && draggedElement.elementId !== elementId) {
      setDragOverElement({ blockId, elementId })
    }
  }

  const handleDragLeave = () => {
    setDragOverElement(null)
  }

  const handleDrop = (e: React.DragEvent, targetBlockId: string, targetElementId: string) => {
    e.preventDefault()
    if (!draggedElement || draggedElement.blockId !== targetBlockId) {
      setDraggedElement(null)
      setDragOverElement(null)
      return
    }

    const block = blocks.find((b) => b.id === targetBlockId)
    if (!block) return

    const draggedIndex = block.elements.findIndex((el) => el.id === draggedElement.elementId)
    const targetIndex = block.elements.findIndex((el) => el.id === targetElementId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newElements = [...block.elements]
    const [removed] = newElements.splice(draggedIndex, 1)
    newElements.splice(targetIndex, 0, removed)

    // Update order property
    const reorderedElements = newElements.map((el, index) => ({ ...el, order: index }))

    onBlockUpdate({ ...block, elements: reorderedElements })
    setDraggedElement(null)
    setDragOverElement(null)
  }

  const handleDragEnd = () => {
    setDraggedElement(null)
    setDragOverElement(null)
  }

  return (
    <div className="w-56 bg-card border-r border-border flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layers</h2>
      </div>

      <div className="flex-1 overflow-auto py-1">
        {blocks.map((block) => {
          const isBlockSelected = selection.blockId === block.id && !selection.elementId
          const hasSelectedElement = selection.blockId === block.id && selection.elementId
          const isExpanded = expandedBlocks.has(block.id)

          return (
            <div key={block.id} className="select-none">
              {/* Block Row */}
              <div
                className={cn(
                  "group flex items-center gap-1 px-2 py-1.5 cursor-pointer transition-colors",
                  isBlockSelected && "bg-primary/10",
                  hasSelectedElement && "bg-muted/50",
                  !isBlockSelected && !hasSelectedElement && "hover:bg-muted/50",
                )}
                onClick={() => onSelectBlock(block.id)}
              >
                {/* Expand/Collapse */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(block.id)
                  }}
                  className={cn("p-0.5 rounded hover:bg-muted transition-transform", isExpanded && "rotate-90")}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {/* Visibility Toggle */}
                <button onClick={(e) => toggleBlockEnabled(block, e)} className="p-0.5 rounded hover:bg-muted">
                  {block.enabled ? (
                    <Eye className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>

                {/* Block Icon */}
                <span className={cn("text-muted-foreground", !block.enabled && "opacity-40")}>
                  {blockIcons[block.type]}
                </span>

                {/* Block Label */}
                <span
                  className={cn(
                    "flex-1 text-sm truncate",
                    !block.enabled && "text-muted-foreground line-through",
                    isBlockSelected && "font-medium text-primary",
                  )}
                >
                  {block.label}
                </span>

                {/* Add Element Button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
                    >
                      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-40 p-1">
                    <div className="space-y-0.5">
                      {addableElements.map((el) => (
                        <button
                          key={el.type}
                          onClick={() => handleAddElement(block, el.type)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
                        >
                          {elementIcons[el.type]}
                          <span>{el.label}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Child Elements - with drag and drop */}
              {isExpanded && block.elements.length > 0 && (
                <div className="ml-4 border-l border-border/50">
                  {[...block.elements]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((element) => {
                      const isElementSelected = selection.elementId === element.id
                      const isDragging = draggedElement?.elementId === element.id
                      const isDragOver = dragOverElement?.elementId === element.id

                      return (
                        <div
                          key={element.id}
                          draggable
                          onDragStart={() => handleDragStart(block.id, element.id)}
                          onDragOver={(e) => handleDragOver(e, block.id, element.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, block.id, element.id)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "group flex items-center gap-1 px-2 py-1 cursor-pointer transition-all",
                            isElementSelected ? "bg-primary/10" : "hover:bg-muted/50",
                            isDragging && "opacity-50",
                            isDragOver && "border-t-2 border-primary",
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectElement(block.id, element.id)
                          }}
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />

                          {/* Visibility Toggle */}
                          <button
                            onClick={(e) => toggleElementVisible(block, element.id, e)}
                            className="p-0.5 rounded hover:bg-muted"
                          >
                            {element.visible ? (
                              <Eye className="h-3 w-3 text-foreground" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            )}
                          </button>

                          {/* Element Icon */}
                          <span className={cn("text-muted-foreground", !element.visible && "opacity-40")}>
                            {elementIcons[element.type]}
                          </span>

                          {/* Element Label */}
                          <span
                            className={cn(
                              "flex-1 text-xs truncate",
                              !element.visible && "text-muted-foreground line-through",
                              isElementSelected && "font-medium text-primary",
                            )}
                          >
                            {element.label}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}

              {/* Empty state for expanded blocks with no elements */}
              {isExpanded && block.elements.length === 0 && (
                <div className="ml-8 px-2 py-2 text-xs text-muted-foreground italic">No elements</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
