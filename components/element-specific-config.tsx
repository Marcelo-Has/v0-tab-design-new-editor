"use client"

import { useState } from "react"
import { ChevronDown, ImageIcon, Type, Filter, Navigation, Maximize2, AlignCenter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { TextStyleSelector } from "./text-style-selector"
import type {
  TemplateElement,
  GlobalStyle,
  ImageElementConfig,
  TextElementConfig,
  FilterElementConfig,
  NavigationElementConfig,
  BlockType,
} from "@/lib/types"

interface ElementSpecificConfigProps {
  element: TemplateElement
  parentBlockType: BlockType
  globalStyles: GlobalStyle[]
  onUpdate: (updates: Partial<TemplateElement>) => void
}

function ImageConfig({
  config,
  onChange,
}: {
  config: ImageElementConfig
  onChange: (config: ImageElementConfig) => void
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Image URL</Label>
        <Input
          value={config.url}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://..."
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Size (px)</Label>
        <Input
          type="number"
          value={config.size}
          onChange={(e) => onChange({ ...config, size: Number.parseInt(e.target.value) || 32 })}
          className="h-8 text-sm"
        />
      </div>
      <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Expand</span>
        </div>
        <Switch checked={config.expand} onCheckedChange={(expand) => onChange({ ...config, expand })} />
      </div>
      <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <AlignCenter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Centralize</span>
        </div>
        <Switch checked={config.centralize} onCheckedChange={(centralize) => onChange({ ...config, centralize })} />
      </div>
    </div>
  )
}

function TextConfig({
  config,
  onChange,
  showPositionOptions,
}: {
  config: TextElementConfig
  onChange: (config: TextElementConfig) => void
  showPositionOptions: boolean
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Size (px)</Label>
        <Input
          type="number"
          value={config.size}
          onChange={(e) => onChange({ ...config, size: Number.parseInt(e.target.value) || 100 })}
          className="h-8 text-sm"
        />
      </div>
      {showPositionOptions && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ ...config, titlePosition: "left" })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  config.titlePosition === "left"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Left
              </button>
              <button
                onClick={() => onChange({ ...config, titlePosition: "above" })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  config.titlePosition === "above"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Above
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Caption Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ ...config, captionPosition: "right" })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  config.captionPosition === "right"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Right
              </button>
              <button
                onClick={() => onChange({ ...config, captionPosition: "below" })}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-all",
                  config.captionPosition === "below"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                Below
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function FilterConfig({
  config,
  onChange,
}: {
  config: FilterElementConfig
  onChange: (config: FilterElementConfig) => void
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Size (px)</Label>
        <Input
          type="number"
          value={config.size}
          onChange={(e) => onChange({ ...config, size: Number.parseInt(e.target.value) || 150 })}
          className="h-8 text-sm"
        />
      </div>
    </div>
  )
}

function NavigationConfig({
  config,
  onChange,
  globalStyles,
}: {
  config: NavigationElementConfig
  onChange: (config: NavigationElementConfig) => void
  globalStyles: GlobalStyle[]
}) {
  const [expandedState, setExpandedState] = useState<"on" | "off" | null>("on")

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Element Size</Label>
          <Input
            type="number"
            value={config.size}
            onChange={(e) => onChange({ ...config, size: Number.parseInt(e.target.value) || 200 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Button Size</Label>
          <Input
            type="number"
            value={config.buttonSize}
            onChange={(e) => onChange({ ...config, buttonSize: Number.parseInt(e.target.value) || 32 })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* On State */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedState(expandedState === "on" ? null : "on")}
          className="w-full flex items-center justify-between px-3 py-2 bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <span className="text-sm font-medium text-primary">On State (Active)</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", expandedState === "on" && "rotate-180")} />
        </button>
        {expandedState === "on" && (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Text Style</Label>
              <TextStyleSelector
                styles={config.onState.customTextStyles || {}}
                globalStyleId={config.onState.textStyleId}
                globalStyles={globalStyles}
                onStylesChange={(styles) =>
                  onChange({
                    ...config,
                    onState: { ...config.onState, customTextStyles: styles as any },
                  })
                }
                onGlobalStyleChange={(styleId) =>
                  onChange({
                    ...config,
                    onState: { ...config.onState, textStyleId: styleId },
                  })
                }
                compact
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <div className="flex gap-2">
                <Input
                  value={config.onState.customBackgroundStyles?.backgroundColor || "#3b82f6"}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      onState: {
                        ...config.onState,
                        customBackgroundStyles: {
                          ...config.onState.customBackgroundStyles,
                          backgroundColor: e.target.value,
                        },
                      },
                    })
                  }
                  className="h-8 text-sm flex-1"
                  placeholder="#3b82f6"
                />
                <input
                  type="color"
                  value={config.onState.customBackgroundStyles?.backgroundColor || "#3b82f6"}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      onState: {
                        ...config.onState,
                        customBackgroundStyles: {
                          ...config.onState.customBackgroundStyles,
                          backgroundColor: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Off State */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedState(expandedState === "off" ? null : "off")}
          className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-medium">Off State (Inactive)</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", expandedState === "off" && "rotate-180")} />
        </button>
        {expandedState === "off" && (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Text Style</Label>
              <TextStyleSelector
                styles={config.offState.customTextStyles || {}}
                globalStyleId={config.offState.textStyleId}
                globalStyles={globalStyles}
                onStylesChange={(styles) =>
                  onChange({
                    ...config,
                    offState: { ...config.offState, customTextStyles: styles as any },
                  })
                }
                onGlobalStyleChange={(styleId) =>
                  onChange({
                    ...config,
                    offState: { ...config.offState, textStyleId: styleId },
                  })
                }
                compact
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <div className="flex gap-2">
                <Input
                  value={config.offState.customBackgroundStyles?.backgroundColor || "#f3f4f6"}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      offState: {
                        ...config.offState,
                        customBackgroundStyles: {
                          ...config.offState.customBackgroundStyles,
                          backgroundColor: e.target.value,
                        },
                      },
                    })
                  }
                  className="h-8 text-sm flex-1"
                  placeholder="#f3f4f6"
                />
                <input
                  type="color"
                  value={config.offState.customBackgroundStyles?.backgroundColor || "#f3f4f6"}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      offState: {
                        ...config.offState,
                        customBackgroundStyles: {
                          ...config.offState.customBackgroundStyles,
                          backgroundColor: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ElementSpecificConfig({
  element,
  parentBlockType,
  globalStyles,
  onUpdate,
}: ElementSpecificConfigProps) {
  const showPositionOptions = parentBlockType === "topbar" || parentBlockType === "header"

  const getDefaultImageConfig = (): ImageElementConfig => ({
    size: element.imageConfig?.size ?? 32,
    expand: element.imageConfig?.expand ?? false,
    centralize: element.imageConfig?.centralize ?? true,
    url: element.imageConfig?.url ?? "",
  })

  const getDefaultTextConfig = (): TextElementConfig => ({
    size: element.textConfig?.size ?? 100,
    titlePosition: element.textConfig?.titlePosition ?? "left",
    captionPosition: element.textConfig?.captionPosition ?? "right",
  })

  const getDefaultFilterConfig = (): FilterElementConfig => ({
    size: element.filterConfig?.size ?? 150,
  })

  const getDefaultNavigationConfig = (): NavigationElementConfig => ({
    size: element.navigationConfig?.size ?? 200,
    buttonSize: element.navigationConfig?.buttonSize ?? 32,
    onState: element.navigationConfig?.onState ?? {
      customTextStyles: { fontColor: "#ffffff", fontWeight: "500" },
      customBackgroundStyles: { backgroundColor: "#3b82f6", borderRadius: "6px" },
    },
    offState: element.navigationConfig?.offState ?? {
      customTextStyles: { fontColor: "#374151", fontWeight: "400" },
      customBackgroundStyles: { backgroundColor: "transparent", borderRadius: "6px" },
    },
  })

  const elementIcons = {
    image: <ImageIcon className="h-4 w-4" />,
    text: <Type className="h-4 w-4" />,
    title: <Type className="h-4 w-4" />,
    caption: <Type className="h-4 w-4" />,
    filter: <Filter className="h-4 w-4" />,
    navigation: <Navigation className="h-4 w-4" />,
    divider: <div className="w-4 h-0.5 bg-current rounded" />,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {elementIcons[element.type]}
        <Label className="text-xs font-medium uppercase tracking-wider">Element Settings</Label>
      </div>

      {element.type === "image" && (
        <ImageConfig config={getDefaultImageConfig()} onChange={(config) => onUpdate({ imageConfig: config })} />
      )}

      {(element.type === "text" || element.type === "title" || element.type === "caption") && (
        <TextConfig
          config={getDefaultTextConfig()}
          onChange={(config) => onUpdate({ textConfig: config })}
          showPositionOptions={showPositionOptions}
        />
      )}

      {element.type === "filter" && (
        <FilterConfig config={getDefaultFilterConfig()} onChange={(config) => onUpdate({ filterConfig: config })} />
      )}

      {element.type === "navigation" && (
        <NavigationConfig
          config={getDefaultNavigationConfig()}
          onChange={(config) => onUpdate({ navigationConfig: config })}
          globalStyles={globalStyles}
        />
      )}
    </div>
  )
}
