"use client"

import type React from "react"

import { useState } from "react"
import { Settings, Palette, ChevronDown, ChevronUp, LayoutTemplate } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartConfigPanel } from "./chart-config-panel"
import { FloatingInspector } from "./floating-inspector"
import { GlobalStylesPanel } from "./global-styles-panel"
import { TemplateConfigPanel } from "./template-config-panel"
import { cn } from "@/lib/utils"
import type {
  ChartConfig,
  TemplateBlock,
  TemplateElement,
  GridConfig,
  GridArea,
  GlobalStyle,
  TemplateConfig,
  ChartColorsConfig,
} from "@/lib/types"

interface RightPanelProps {
  selectedChart: ChartConfig | null
  selectedBlock: TemplateBlock | null
  selectedElement: TemplateElement | null
  onChartUpdate: (chart: ChartConfig) => void
  onBlockUpdate: (block: TemplateBlock) => void
  onElementSelect: (elementId: string | null) => void
  onClearSelection: () => void
  gridConfig: GridConfig
  onGridConfigChange: (config: GridConfig) => void
  gridAreas: GridArea[]
  onGridAreasChange: (areas: GridArea[]) => void
  globalStyles: GlobalStyle[]
  onGlobalStylesChange: (styles: GlobalStyle[]) => void
  templateConfig: TemplateConfig
  onTemplateConfigChange: (config: TemplateConfig) => void
  defaultChartColors: ChartColorsConfig
  onDefaultChartColorsChange: (colors: ChartColorsConfig) => void
}

function BottomDrawer({
  title,
  icon: Icon,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  icon: React.ElementType
  badge?: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={cn("border-t border-border bg-background transition-all", isOpen ? "flex-1 min-h-0" : "")}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/50 transition-colors"
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-medium text-left">{title}</span>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{badge}</span>
        )}
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <ScrollArea className="h-[300px]">
          <div className="pb-4">{children}</div>
        </ScrollArea>
      )}
    </div>
  )
}

export function RightPanel({
  selectedChart,
  selectedBlock,
  selectedElement,
  onChartUpdate,
  onBlockUpdate,
  onElementSelect,
  onClearSelection,
  gridConfig,
  onGridConfigChange,
  gridAreas,
  onGridAreasChange,
  globalStyles,
  onGlobalStylesChange,
  templateConfig,
  onTemplateConfigChange,
  defaultChartColors,
  onDefaultChartColorsChange,
}: RightPanelProps) {
  const hasSelection = selectedChart || selectedBlock
  const [openDrawer, setOpenDrawer] = useState<"template" | "styles" | null>(null)

  const handleDrawerToggle = (drawer: "template" | "styles") => {
    setOpenDrawer(openDrawer === drawer ? null : drawer)
  }

  return (
    <div className="fixed right-0 top-14 bottom-0 w-96 border-l border-border bg-background flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {hasSelection ? (
            <div>
              {selectedChart ? (
                <ChartConfigPanel
                  chart={selectedChart}
                  onUpdate={onChartUpdate}
                  onClearSelection={onClearSelection}
                  defaultChartColors={defaultChartColors}
                />
              ) : selectedBlock ? (
                <FloatingInspector
                  block={selectedBlock}
                  element={selectedElement}
                  onBlockUpdate={onBlockUpdate}
                  onElementSelect={onElementSelect}
                  onClose={onClearSelection}
                  gridConfig={gridConfig}
                  onGridConfigChange={onGridConfigChange}
                  gridAreas={gridAreas}
                  onGridAreasChange={onGridAreasChange}
                  globalStyles={globalStyles}
                  defaultChartColors={defaultChartColors}
                  onDefaultChartColorsChange={onDefaultChartColorsChange}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No selection</p>
              <p className="text-xs text-muted-foreground text-center">
                Click on any region, element, or chart in the canvas to configure it
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col border-t border-border">
        <BottomDrawer
          title="Template Info"
          icon={LayoutTemplate}
          isOpen={openDrawer === "template"}
          onToggle={() => handleDrawerToggle("template")}
        >
          <TemplateConfigPanel config={templateConfig} onChange={onTemplateConfigChange} />
        </BottomDrawer>

        <BottomDrawer
          title="Global Styles"
          icon={Palette}
          badge={`${globalStyles.length}`}
          isOpen={openDrawer === "styles"}
          onToggle={() => handleDrawerToggle("styles")}
        >
          <GlobalStylesPanel styles={globalStyles} onStylesChange={onGlobalStylesChange} />
        </BottomDrawer>
      </div>
    </div>
  )
}
