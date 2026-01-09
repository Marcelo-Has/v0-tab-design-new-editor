"use client"

import { useState } from "react"
import { Eye, EyeOff, ChevronDown, Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { TextStyleSelector } from "./text-style-selector"
import type { TemplateElement, GlobalStyle, StyleConfig } from "@/lib/types"

interface ElementConfigSectionProps {
  element: TemplateElement
  globalStyles: GlobalStyle[]
  onUpdate: (updates: Partial<TemplateElement>) => void
}

function StyleSelectorCompact({
  label,
  selectedStyleId,
  globalStyles,
  onSelectStyle,
  onCustom,
  isCustom,
}: {
  label: string
  selectedStyleId?: string
  globalStyles: GlobalStyle[]
  onSelectStyle: (styleId: string) => void
  onCustom: () => void
  isCustom: boolean
}) {
  const [open, setOpen] = useState(false)
  const selectedStyle = globalStyles.find((s) => s.id === selectedStyleId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between h-8 px-3 rounded border border-input bg-background text-xs hover:bg-muted/50 transition-colors"
      >
        <span className={cn(!selectedStyle && !isCustom && "text-muted-foreground")}>
          {isCustom ? "Custom" : selectedStyle?.name || label}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 py-1 max-h-40 overflow-y-auto">
          {globalStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => {
                onSelectStyle(style.id)
                setOpen(false)
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors",
                selectedStyleId === style.id && "bg-primary/10 text-primary",
              )}
            >
              {style.name}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => {
                onCustom()
                setOpen(false)
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors flex items-center gap-2",
                isCustom && "bg-primary/10 text-primary",
              )}
            >
              <Settings2 className="h-3 w-3" />
              Custom
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AdditionalContentItem({
  type,
  enabled,
  value,
  styles,
  globalStyles,
  globalStyleId,
  onToggle,
  onValueChange,
  onStylesChange,
  onGlobalStyleChange,
}: {
  type: "title" | "caption" | "divider"
  enabled: boolean
  value?: string
  styles: StyleConfig
  globalStyles: GlobalStyle[]
  globalStyleId?: string
  onToggle: () => void
  onValueChange?: (value: string) => void
  onStylesChange: (styles: StyleConfig) => void
  onGlobalStyleChange: (styleId: string | undefined) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/20">
        <button onClick={onToggle} className="p-0.5">
          {enabled ? (
            <Eye className="h-3.5 w-3.5 text-primary" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between"
          disabled={!enabled}
        >
          <span className={cn("text-sm capitalize", !enabled && "text-muted-foreground")}>{type}</span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </button>
      </div>
      {expanded && enabled && (
        <div className="p-3 space-y-3 bg-background">
          {type !== "divider" && onValueChange && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Value</Label>
              <Input
                value={value || ""}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={`Enter ${type} text`}
                className="h-8 text-sm"
              />
            </div>
          )}

          {type !== "divider" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Text Style</Label>
              <TextStyleSelector
                styles={styles}
                globalStyleId={globalStyleId}
                globalStyles={globalStyles}
                onStylesChange={onStylesChange}
                onGlobalStyleChange={onGlobalStyleChange}
                compact
              />
            </div>
          )}

          {type === "divider" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Position</Label>
                <select
                  value={(styles as any).position || "end"}
                  onChange={(e) => onStylesChange({ ...styles, position: e.target.value } as any)}
                  className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
                >
                  <option value="start">Start</option>
                  <option value="end">End</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Size</Label>
                  <Input
                    type="number"
                    value={(styles as any).size || "1"}
                    onChange={(e) => onStylesChange({ ...styles, size: e.target.value } as any)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Color</Label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={styles.background || "#e5e7eb"}
                      onChange={(e) => onStylesChange({ ...styles, background: e.target.value })}
                      className="h-7 w-7 rounded border border-input cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ElementConfigSection({ element, globalStyles, onUpdate }: ElementConfigSectionProps) {
  const handleTitleChange = (updates: Partial<TemplateElement["title"]>) => {
    onUpdate({
      title: {
        enabled: element.title?.enabled ?? false,
        value: element.title?.value ?? "",
        styles: element.title?.styles ?? {},
        ...updates,
      },
    })
  }

  const handleCaptionChange = (updates: Partial<TemplateElement["caption"]>) => {
    onUpdate({
      caption: {
        enabled: element.caption?.enabled ?? false,
        value: element.caption?.value ?? "",
        styles: element.caption?.styles ?? {},
        ...updates,
      },
    })
  }

  const handleDividerChange = (updates: Partial<NonNullable<TemplateElement["divider"]>>) => {
    onUpdate({
      divider: {
        enabled: element.divider?.enabled ?? false,
        position: element.divider?.position ?? "end",
        size: element.divider?.size ?? 1,
        ...updates,
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Additional Elements Section */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Additional Elements
        </Label>
        <div className="space-y-2">
          <AdditionalContentItem
            type="title"
            enabled={element.title?.enabled ?? false}
            value={element.title?.value}
            styles={element.title?.styles ?? {}}
            globalStyles={globalStyles}
            globalStyleId={element.title?.globalStyleId}
            onToggle={() => handleTitleChange({ enabled: !element.title?.enabled })}
            onValueChange={(value) => handleTitleChange({ value })}
            onStylesChange={(styles) => handleTitleChange({ styles })}
            onGlobalStyleChange={(globalStyleId) => handleTitleChange({ globalStyleId })}
          />
          <AdditionalContentItem
            type="caption"
            enabled={element.caption?.enabled ?? false}
            value={element.caption?.value}
            styles={element.caption?.styles ?? {}}
            globalStyles={globalStyles}
            globalStyleId={element.caption?.globalStyleId}
            onToggle={() => handleCaptionChange({ enabled: !element.caption?.enabled })}
            onValueChange={(value) => handleCaptionChange({ value })}
            onStylesChange={(styles) => handleCaptionChange({ styles })}
            onGlobalStyleChange={(globalStyleId) => handleCaptionChange({ globalStyleId })}
          />
          <AdditionalContentItem
            type="divider"
            enabled={element.divider?.enabled ?? false}
            styles={
              {
                background: element.divider?.color,
                size: String(element.divider?.size ?? 1),
                position: element.divider?.position,
              } as any
            }
            globalStyles={globalStyles}
            globalStyleId={element.divider?.globalStyleId}
            onToggle={() => handleDividerChange({ enabled: !element.divider?.enabled })}
            onStylesChange={(styles: any) =>
              handleDividerChange({
                color: styles.background,
                size: Number(styles.size) || 1,
                position: styles.position,
              })
            }
            onGlobalStyleChange={(globalStyleId) => handleDividerChange({ globalStyleId })}
          />
        </div>
      </div>
    </div>
  )
}
