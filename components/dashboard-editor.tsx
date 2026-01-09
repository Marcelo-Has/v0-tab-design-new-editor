"use client"

import { useState } from "react"
import { VisualCanvasPreview } from "./visual-canvas-preview"
import { EditorHeader } from "./editor-header"
import { LayerTreePanel } from "./layer-tree-panel"
import { RightPanel } from "./right-panel"
import type {
  ChartConfig,
  TemplateBlock,
  SelectionState,
  GridConfig,
  GridArea,
  GlobalStyle,
  TemplateConfig,
  ChartColorsConfig,
} from "@/lib/types"

const initialCharts: ChartConfig[] = [
  {
    id: "chart-1",
    type: { category: "bar", style: "vertical-bar" },
    title: "Sales by Category",
    subtitle: "Q1 2025",
    sheetName: "sales_data",
    width: 1,
    height: 1,
    aliases: {
      dimension: "Category",
      measure: "Revenue",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "chart-2",
    type: { category: "line", style: "basic-line" },
    title: "Monthly Trend",
    subtitle: "Year over Year",
    sheetName: "monthly_metrics",
    width: 1,
    height: 1,
    aliases: {
      dimension: "Date",
      measure: "Sales",
    },
    position: { x: 1, y: 0 },
  },
  {
    id: "chart-3",
    type: { category: "bar", style: "horizontal-bar" },
    title: "Product Performance",
    subtitle: "Top Sellers",
    sheetName: "products",
    width: 1,
    height: 1,
    aliases: {
      dimension: "Product",
      measure: "Units Sold",
    },
    position: { x: 1, y: 1 },
  },
]

const initialBlocks: TemplateBlock[] = [
  {
    id: "topbar",
    type: "topbar",
    label: "Top Bar",
    enabled: true,
    size: 60,
    styles: { padding: "8px 16px", background: "#1a1a2e" },
    elements: [
      {
        id: "topbar-image",
        type: "image",
        label: "Logo",
        visible: true,
        styles: {},
        order: 0,
        imageConfig: { size: 32, expand: false, centralize: true, url: "" },
      },
      {
        id: "topbar-nav",
        type: "navigation",
        label: "Navigation",
        visible: true,
        styles: {},
        order: 1,
        navigationConfig: {
          size: 200,
          buttonSize: 32,
          onState: {
            customTextStyles: { fontColor: "#ffffff", fontWeight: "500" },
            customBackgroundStyles: { backgroundColor: "#3b82f6", borderRadius: "6px" },
          },
          offState: {
            customTextStyles: { fontColor: "#9ca3af", fontWeight: "400" },
            customBackgroundStyles: { backgroundColor: "transparent", borderRadius: "6px" },
          },
        },
      },
      {
        id: "topbar-filter",
        type: "filter",
        label: "Filters",
        visible: false,
        styles: {},
        order: 2,
        filterConfig: { size: 150 },
      },
    ],
  },
  {
    id: "header",
    type: "header",
    label: "Header",
    enabled: true,
    size: 48,
    styles: { padding: "12px 16px", background: "#ffffff" },
    elements: [
      {
        id: "header-title",
        type: "title",
        label: "Dashboard Title",
        visible: true,
        value: "Dashboard Name",
        styles: { fontSize: "18px", fontWeight: "600" },
        order: 0,
        textConfig: { size: 200, titlePosition: "left", captionPosition: "right" },
      },
      {
        id: "header-caption",
        type: "caption",
        label: "View Name",
        visible: true,
        value: "VIEW NAME",
        styles: { fontSize: "14px", fontColor: "#666" },
        order: 1,
        textConfig: { size: 100, titlePosition: "left", captionPosition: "right" },
      },
      {
        id: "header-filter",
        type: "filter",
        label: "Quick Filters",
        visible: true,
        styles: {},
        order: 2,
        filterConfig: { size: 120 },
      },
    ],
  },
  {
    id: "leftbar",
    type: "leftbar",
    label: "Left Sidebar",
    enabled: true,
    size: 200,
    styles: { padding: "16px", background: "#f8f9fa" },
    elements: [
      {
        id: "leftbar-title",
        type: "title",
        label: "Section Title",
        visible: true,
        value: "Navigation",
        styles: {},
        order: 0,
        textConfig: { size: 180, titlePosition: "above", captionPosition: "below" },
      },
      {
        id: "leftbar-nav",
        type: "navigation",
        label: "Menu Items",
        visible: true,
        styles: {},
        order: 1,
        navigationConfig: {
          size: 180,
          buttonSize: 36,
          onState: {
            customTextStyles: { fontColor: "#111827", fontWeight: "500" },
            customBackgroundStyles: { backgroundColor: "#e5e7eb", borderRadius: "8px" },
          },
          offState: {
            customTextStyles: { fontColor: "#6b7280", fontWeight: "400" },
            customBackgroundStyles: { backgroundColor: "transparent", borderRadius: "8px" },
          },
        },
      },
    ],
  },
  {
    id: "rightbar",
    type: "rightbar",
    label: "Right Sidebar",
    enabled: false,
    size: 250,
    styles: { padding: "16px", background: "#f8f9fa" },
    elements: [
      {
        id: "rightbar-filter",
        type: "filter",
        label: "Filters",
        visible: true,
        styles: {},
        order: 0,
        filterConfig: { size: 220 },
      },
    ],
  },
  {
    id: "chartArea",
    type: "chartArea",
    label: "Chart Area",
    enabled: true,
    styles: { padding: "16px", background: "#f5f5f5" },
    elements: [],
  },
]

const initialGridConfig: GridConfig = {
  gap: 16,
  gutter: 8,
  innerPadding: 16,
  outerPadding: 24,
  rows: 3,
  cols: 3,
  width: 1600,
  height: 800,
}

const initialGlobalStyles: GlobalStyle[] = [
  { id: "text-nav", name: "navText", category: "texts", fontSize: "14", fontColor: "#374151", fontWeight: "500" },
  {
    id: "text-heading",
    name: "headingText",
    category: "texts",
    fontSize: "18",
    fontColor: "#111827",
    fontWeight: "600",
  },
  {
    id: "text-secondary",
    name: "secondaryText",
    category: "texts",
    fontSize: "12",
    fontColor: "#6b7280",
    fontWeight: "400",
  },
  { id: "pad-sidebar", name: "sidebarPad", category: "paddings", value: "16px" },
  { id: "pad-chart", name: "chartPadding", category: "paddings", value: "12px" },
  { id: "pad-topbar", name: "topbarPadding", category: "paddings", value: "8px 16px" },
  { id: "pad-header", name: "headerPadding", category: "paddings", value: "12px 16px" },
  { id: "margin-default", name: "defaultMargin", category: "margins", value: "8px" },
  {
    id: "border-card",
    name: "cardBorder",
    category: "borders",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: "8px",
  },
  { id: "bg-white", name: "whiteBg", category: "backgrounds", backgroundColor: "#ffffff" },
  { id: "bg-muted", name: "mutedBg", category: "backgrounds", backgroundColor: "#f9fafb" },
  { id: "bg-primary", name: "primaryBg", category: "backgrounds", backgroundColor: "#3b82f6" },
  { id: "bg-accent", name: "accentBg", category: "backgrounds", backgroundColor: "#60a5fa" },
]

const initialTemplateConfig: TemplateConfig = {
  title: "My Dashboard Template",
  description: "",
  isPublic: false,
  mode: "light",
  style: "modern",
  accessibility: "default",
  width: 1600,
  height: 800,
  chartHeader: {
    showTitle: true,
    showSubtitle: true,
    useNativeTitle: false,
  },
  defaultChartColors: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
  },
}

const initialChartColors: ChartColorsConfig = {
  primary: "#3b82f6",
  secondary: "#60a5fa",
}

export function DashboardEditor() {
  const [charts, setCharts] = useState<ChartConfig[]>(initialCharts)
  const [blocks, setBlocks] = useState<TemplateBlock[]>(initialBlocks)
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
  const [selection, setSelection] = useState<SelectionState>({ blockId: null, elementId: null })
  const [gridConfig, setGridConfig] = useState<GridConfig>(initialGridConfig)
  const [gridAreas, setGridAreas] = useState<GridArea[]>([])
  const [globalStyles, setGlobalStyles] = useState<GlobalStyle[]>(initialGlobalStyles)
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(initialTemplateConfig)
  const [defaultChartColors, setDefaultChartColors] = useState<ChartColorsConfig>(initialChartColors)

  const selectedChart = charts.find((c) => c.id === selectedChartId) || null
  const selectedBlock = blocks.find((b) => b.id === selection.blockId) || null
  const selectedElement = selectedBlock?.elements.find((e) => e.id === selection.elementId) || null

  const handleChartUpdate = (updatedChart: ChartConfig) => {
    setCharts((prev) => prev.map((c) => (c.id === updatedChart.id ? updatedChart : c)))
  }

  const handleBlockUpdate = (updatedBlock: TemplateBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)))
  }

  const handleClearSelection = () => {
    setSelectedChartId(null)
    setSelection({ blockId: null, elementId: null })
  }

  const handleChartSelect = (chartId: string | null) => {
    setSelectedChartId(chartId)
    if (chartId) {
      setSelection({ blockId: null, elementId: null })
    }
  }

  const handleBlockSelect = (blockId: string | null) => {
    setSelection({ blockId, elementId: null })
    if (blockId) {
      setSelectedChartId(null)
    }
  }

  const handleElementSelect = (blockId: string, elementId: string) => {
    setSelection({ blockId, elementId })
    setSelectedChartId(null)
  }

  const handleElementSelectFromInspector = (elementId: string | null) => {
    setSelection((prev) => ({ ...prev, elementId }))
  }

  const handleTemplateConfigChange = (config: TemplateConfig) => {
    setTemplateConfig(config)
    if (config.width !== gridConfig.width || config.height !== gridConfig.height) {
      setGridConfig({ ...gridConfig, width: config.width, height: config.height })
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <LayerTreePanel
          blocks={blocks}
          selection={selection}
          onSelectBlock={handleBlockSelect}
          onSelectElement={handleElementSelect}
          onBlockUpdate={handleBlockUpdate}
        />

        <div className="flex-1 relative pr-96 overflow-auto">
          <VisualCanvasPreview
            blocks={blocks}
            charts={charts}
            selection={selection}
            onSelectBlock={handleBlockSelect}
            onSelectElement={handleElementSelect}
            selectedChartId={selectedChartId}
            onSelectChart={handleChartSelect}
            gridConfig={gridConfig}
          />
        </div>

        <RightPanel
          selectedChart={selectedChart}
          selectedBlock={selectedBlock}
          selectedElement={selectedElement}
          onChartUpdate={handleChartUpdate}
          onBlockUpdate={handleBlockUpdate}
          onElementSelect={handleElementSelectFromInspector}
          onClearSelection={handleClearSelection}
          gridConfig={gridConfig}
          onGridConfigChange={setGridConfig}
          gridAreas={gridAreas}
          onGridAreasChange={setGridAreas}
          globalStyles={globalStyles}
          onGlobalStylesChange={setGlobalStyles}
          templateConfig={templateConfig}
          onTemplateConfigChange={handleTemplateConfigChange}
          defaultChartColors={defaultChartColors}
          onDefaultChartColorsChange={setDefaultChartColors}
        />
      </div>
    </div>
  )
}
