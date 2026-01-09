"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { StyleConfig, GlobalStyle } from "@/lib/types"

interface ContainerStylesSectionProps {
  styles: StyleConfig
  containerStyleId?: string
  globalStyles: GlobalStyle[]
  onStylesChange: (styles: StyleConfig) => void
  onContainerStyleChange: (styleId: string | undefined) => void
}

type StyleMode = "none" | "global" | "custom"

interface ContainerStyleConfig {
  padding: { mode: StyleMode; globalId?: string; value?: string }
  margin: { mode: StyleMode; globalId?: string; value?: string }
  border: { mode: StyleMode; globalId?: string; value?: string }
  background: { mode: StyleMode; globalId?: string; value?: string }
}

export function ContainerStylesSection({
  styles,
  containerStyleId,
  globalStyles,
  onStylesChange,
  onContainerStyleChange,
}: ContainerStylesSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [styleConfigs, setStyleConfigs] = useState<ContainerStyleConfig>({
    padding: { mode: styles.padding ? "custom" : "none", value: styles.padding },
    margin: { mode: styles.margin ? "custom" : "none", value: styles.margin },
    border: { mode: styles.border ? "custom" : "none", value: styles.border },
    background: { mode: styles.background ? "custom" : "none", value: styles.background },
  })

  const paddingStyles = globalStyles.filter((s) => s.category === "paddings")
  const marginStyles = globalStyles.filter((s) => s.category === "margins")
  const borderStyles = globalStyles.filter((s) => s.category === "borders")
  const backgroundStyles = globalStyles.filter((s) => s.category === "backgrounds")

  const handleModeChange = (property: keyof ContainerStyleConfig, mode: StyleMode, globalId?: string) => {
    const newConfigs = { ...styleConfigs }
    newConfigs[property] = { mode, globalId, value: mode === "custom" ? styles[property] || "" : undefined }
    setStyleConfigs(newConfigs)

    // Apply the style based on mode
    if (mode === "none") {
      const newStyles = { ...styles }
      delete newStyles[property]
      onStylesChange(newStyles)
    } else if (mode === "global" && globalId) {
      const globalStyle = globalStyles.find((s) => s.id === globalId)
      if (globalStyle) {
        let value = ""
        if (property === "padding" || property === "margin") {
          value = globalStyle.value || ""
        } else if (property === "border") {
          value = `${globalStyle.borderWidth || "1px"} ${globalStyle.borderStyle || "solid"} ${globalStyle.borderColor || "#e5e7eb"}`
        } else if (property === "background") {
          value = globalStyle.backgroundGradient || globalStyle.backgroundColor || "#ffffff"
        }
        onStylesChange({ ...styles, [property]: value })
      }
    }
  }

  const handleCustomValueChange = (property: keyof ContainerStyleConfig, value: string) => {
    setStyleConfigs({
      ...styleConfigs,
      [property]: { ...styleConfigs[property], value },
    })
    onStylesChange({ ...styles, [property]: value })
  }

  const renderStyleProperty = (
    property: "padding" | "margin" | "border" | "background",
    label: string,
    globalOptions: GlobalStyle[],
    placeholder: string,
  ) => {
    const config = styleConfigs[property]

    return (
      <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">{label}</Label>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => handleModeChange(property, "none")}
            className={cn(
              "flex-1 py-1.5 text-xs rounded-md transition-colors",
              config.mode === "none"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            None
          </button>
          {globalOptions.length > 0 && (
            <button
              onClick={() => handleModeChange(property, "global", globalOptions[0]?.id)}
              className={cn(
                "flex-1 py-1.5 text-xs rounded-md transition-colors",
                config.mode === "global"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Global
            </button>
          )}
          <button
            onClick={() => handleModeChange(property, "custom")}
            className={cn(
              "flex-1 py-1.5 text-xs rounded-md transition-colors",
              config.mode === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Custom
          </button>
        </div>

        {/* Global Style Selector */}
        {config.mode === "global" && globalOptions.length > 0 && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
              {globalOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleModeChange(property, "global", style.id)}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left",
                    config.globalId === style.id
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-muted/30 hover:bg-muted/50",
                  )}
                >
                  <span>{style.name}</span>
                  {config.globalId === style.id && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Value Input */}
        {config.mode === "custom" && (
          <div className="flex gap-2">
            <Input
              value={styles[property] || ""}
              onChange={(e) => handleCustomValueChange(property, e.target.value)}
              placeholder={placeholder}
              className="h-8 text-sm flex-1"
            />
            {property === "background" && (
              <input
                type="color"
                value={styles.background?.startsWith("#") ? styles.background : "#ffffff"}
                onChange={(e) => handleCustomValueChange("background", e.target.value)}
                className="h-8 w-8 rounded border border-input cursor-pointer"
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer">
          Container Styles
        </Label>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="space-y-2">
          {renderStyleProperty("padding", "Padding", paddingStyles, "8px 16px")}
          {renderStyleProperty("margin", "Margin", marginStyles, "0px")}
          {renderStyleProperty("border", "Border", borderStyles, "1px solid #ddd")}
          {renderStyleProperty("background", "Background", backgroundStyles, "#ffffff")}
        </div>
      )}
    </div>
  )
}
