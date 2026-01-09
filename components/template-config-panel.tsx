"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TemplateConfig } from "@/lib/types"

interface TemplateConfigPanelProps {
  config: TemplateConfig
  onChange: (config: TemplateConfig) => void
}

export function TemplateConfigPanel({ config, onChange }: TemplateConfigPanelProps) {
  const handleChange = <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="px-4 pb-2 space-y-5">
      {/* General Section */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Title</Label>
          <Input
            value={config.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Template name"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea
            value={config.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="What's this template for?"
            className="min-h-[60px] text-sm resize-none"
          />
        </div>
      </div>

      {/* Layout Section */}
      <div className="space-y-3 pt-3 border-t border-border">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layout</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Width (px)</Label>
            <Input
              type="number"
              value={config.width}
              onChange={(e) => handleChange("width", Number.parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Height (px)</Label>
            <Input
              type="number"
              value={config.height}
              onChange={(e) => handleChange("height", Number.parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Labels & Categories Section */}
      <div className="space-y-3 pt-3 border-t border-border">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</Label>

        {/* Public Template Toggle */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
          <span className="text-sm">Public Template</span>
          <button
            onClick={() => handleChange("isPublic", !config.isPublic)}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative",
              config.isPublic ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                config.isPublic ? "left-5" : "left-1",
              )}
            />
          </button>
        </div>

        {/* Mode Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Mode</Label>
          <select
            value={config.mode}
            onChange={(e) => handleChange("mode", e.target.value as TemplateConfig["mode"])}
            className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Style Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Style</Label>
          <select
            value={config.style}
            onChange={(e) => handleChange("style", e.target.value as TemplateConfig["style"])}
            className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        {/* Accessibility Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Accessibility</Label>
          <select
            value={config.accessibility}
            onChange={(e) => handleChange("accessibility", e.target.value as TemplateConfig["accessibility"])}
            className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
          >
            <option value="default">Default</option>
            <option value="high-contrast">High Contrast</option>
            <option value="grayscale">Grayscale Compatible</option>
          </select>
        </div>
      </div>
    </div>
  )
}
