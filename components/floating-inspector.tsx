"use client"

import { useState } from "react"
import { X, ChevronRight, Eye, EyeOff, Plus, Trash2, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { GridConfigPanel } from "./grid-config-panel"
import { ElementConfigSection } from "./element-config-section"
import { ContainerStylesSection } from "./container-styles-section"
import { TextStyleSelector } from "./text-style-selector"
import { ElementSpecificConfig } from "./element-specific-config"
import type {
  TemplateBlock,
  TemplateElement,
  StyleConfig,
  ElementType,
  GridConfig,
  GridArea,
  GlobalStyle,
  ChartColorsConfig,
} from "@/lib/types"

interface FloatingInspectorProps {
  block: TemplateBlock | null
  element: TemplateElement | null
  onBlockUpdate: (block: TemplateBlock) => void
  onElementSelect: (elementId: string | null) => void
  onClose: () => void
  gridConfig: GridConfig
  onGridConfigChange: (config: GridConfig) => void
  gridAreas: GridArea[]
  onGridAreasChange: (areas: GridArea[]) => void
  globalStyles: GlobalStyle[]
  defaultChartColors: ChartColorsConfig
  onDefaultChartColorsChange: (colors: ChartColorsConfig) => void
}

const elementTypeLabels: Record<ElementType, string> = {
  image: "Image",
  text: "Text",
  navigation: "Navigation",
  filter: "Filter",
  title: "Title",
  caption: "Caption",
  divider: "Divider",
}

function ElementListItem({
  element,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: {
  element: TemplateElement
  isSelected: boolean
  onSelect: () => void
  onToggleVisibility: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all",
        isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent",
      )}
      onClick={onSelect}
    >
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab" />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleVisibility()
        }}
        className="p-0.5"
      >
        {element.visible ? (
          <Eye className="h-3.5 w-3.5 text-primary" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      <span className={cn("text-sm flex-1", !element.visible && "text-muted-foreground line-through")}>
        {element.label}
      </span>
      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
        {elementTypeLabels[element.type]}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  )
}

export function FloatingInspector({
  block,
  element,
  onBlockUpdate,
  onElementSelect,
  onClose,
  gridConfig,
  onGridConfigChange,
  gridAreas,
  onGridAreasChange,
  globalStyles,
  defaultChartColors,
  onDefaultChartColorsChange,
}: FloatingInspectorProps) {
  const [activeSection, setActiveSection] = useState<"content" | "styles">("content")

  if (!block) return null

  const isChartArea = block.type === "chartArea"

  const handleStyleChange = (key: keyof StyleConfig, value: string) => {
    if (element) {
      onBlockUpdate({
        ...block,
        elements: block.elements.map((el) =>
          el.id === element.id ? { ...el, styles: { ...el.styles, [key]: value } } : el,
        ),
      })
    } else {
      onBlockUpdate({
        ...block,
        styles: { ...block.styles, [key]: value },
      })
    }
  }

  const handleElementUpdate = (updates: Partial<TemplateElement>) => {
    if (!element) return
    onBlockUpdate({
      ...block,
      elements: block.elements.map((el) => (el.id === element.id ? { ...el, ...updates } : el)),
    })
  }

  const handleAddElement = (type: ElementType) => {
    const newElement: TemplateElement = {
      id: `${block.id}-${type}-${Date.now()}`,
      type,
      label: elementTypeLabels[type],
      visible: true,
      styles: {},
      order: block.elements.length,
    }
    onBlockUpdate({
      ...block,
      elements: [...block.elements, newElement],
    })
  }

  const handleDeleteElement = (elementId: string) => {
    onBlockUpdate({
      ...block,
      elements: block.elements.filter((el) => el.id !== elementId),
    })
    if (element?.id === elementId) {
      onElementSelect(null)
    }
  }

  const currentStyles = element ? element.styles : block.styles
  const isTextElement = element && ["title", "caption", "text"].includes(element.type)

  return (
    <div className="bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {element && (
            <button onClick={() => onElementSelect(null)} className="p-1 hover:bg-muted rounded transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180 text-muted-foreground" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-semibold">{element ? element.label : block.label}</h3>
            {element && <p className="text-xs text-muted-foreground">{block.label}</p>}
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveSection("content")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors",
            activeSection === "content"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Content
        </button>
        <button
          onClick={() => setActiveSection("styles")}
          className={cn(
            "flex-1 py-2 text-xs font-medium transition-colors",
            activeSection === "styles"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Styles
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeSection === "content" ? (
          <>
            {/* Block/Element visibility */}
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
              <span className="text-sm">Visible</span>
              <button
                onClick={() => {
                  if (element) {
                    handleElementUpdate({ visible: !element.visible })
                  } else {
                    onBlockUpdate({ ...block, enabled: !block.enabled })
                  }
                }}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  (element ? element.visible : block.enabled) ? "bg-primary" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                    (element ? element.visible : block.enabled) ? "left-5" : "left-1",
                  )}
                />
              </button>
            </div>

            {/* Block size (only for blocks) */}
            {!element && block.size !== undefined && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Size (px)</Label>
                <Input
                  value={String(block.size)}
                  onChange={(e) => onBlockUpdate({ ...block, size: Number.parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 60"
                  className="h-8 text-sm"
                />
              </div>
            )}

            {/* Grid config for chart area */}
            {isChartArea && !element && (
              <GridConfigPanel
                config={gridConfig}
                onChange={onGridConfigChange}
                areas={gridAreas}
                onAreasChange={onGridAreasChange}
                defaultChartColors={defaultChartColors}
                onDefaultChartColorsChange={onDefaultChartColorsChange}
                globalStyles={globalStyles}
              />
            )}

            {/* Element value (for text elements) */}
            {isTextElement && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Text Value</Label>
                <Input
                  value={element.value || ""}
                  onChange={(e) => handleElementUpdate({ value: e.target.value })}
                  placeholder="Enter text content"
                  className="h-8 text-sm"
                />
              </div>
            )}

            {/* Element label */}
            {element && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input
                  value={element.label}
                  onChange={(e) => handleElementUpdate({ label: e.target.value })}
                  placeholder="Element label"
                  className="h-8 text-sm"
                />
              </div>
            )}

            {element && (
              <ElementSpecificConfig
                element={element}
                parentBlockType={block.type}
                globalStyles={globalStyles}
                onUpdate={handleElementUpdate}
              />
            )}

            {/* Element-specific config with additional content */}
            {element && (
              <ElementConfigSection element={element} globalStyles={globalStyles} onUpdate={handleElementUpdate} />
            )}

            {/* Child Elements List (only when viewing a block, not an element) */}
            {!element && !isChartArea && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Child Elements</Label>
                </div>
                <div className="space-y-1">
                  {[...block.elements]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((el) => (
                      <ElementListItem
                        key={el.id}
                        element={el}
                        isSelected={false}
                        onSelect={() => onElementSelect(el.id)}
                        onToggleVisibility={() => {
                          onBlockUpdate({
                            ...block,
                            elements: block.elements.map((e) => (e.id === el.id ? { ...e, visible: !e.visible } : e)),
                          })
                        }}
                        onDelete={() => handleDeleteElement(el.id)}
                      />
                    ))}
                </div>

                {/* Add Element Dropdown */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-1">
                    {(["image", "text", "title", "navigation", "filter"] as ElementType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAddElement(type)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="capitalize text-[10px]">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {isTextElement && (
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Text Style</Label>
                <TextStyleSelector
                  styles={currentStyles}
                  globalStyleId={element?.textStyleId}
                  globalStyles={globalStyles}
                  onStylesChange={(styles) => handleElementUpdate({ styles })}
                  onGlobalStyleChange={(styleId) => handleElementUpdate({ textStyleId: styleId })}
                />
              </div>
            )}

            {/* Container Styles - always available */}
            <ContainerStylesSection
              styles={currentStyles}
              containerStyleId={element?.containerStyleId}
              globalStyles={globalStyles}
              onStylesChange={(styles) => {
                if (element) {
                  handleElementUpdate({ styles })
                } else {
                  onBlockUpdate({ ...block, styles })
                }
              }}
              onContainerStyleChange={(styleId) => {
                if (element) {
                  handleElementUpdate({ containerStyleId: styleId })
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
