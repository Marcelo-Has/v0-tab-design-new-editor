export type ChartCategory = "bar" | "line" | "area" | "pie" | "scatter" | "combo" | "funnel" | "gauge" | "specialized"

export type ChartStyle =
  // Bar variations
  | "vertical-bar"
  | "horizontal-bar"
  | "stacked-bar"
  | "grouped-bar"
  | "waterfall-bar"
  | "diverging-bar"
  | "rounded-bar"
  | "gradient-bar"
  | "lollipop"
  | "histogram"
  | "bullet-bar"
  | "pyramid-bar"
  // Line variations
  | "basic-line"
  | "smooth-line"
  | "stepped-line"
  | "multi-line"
  | "dashed-line"
  | "dotted-line"
  | "line-markers"
  | "sparkline"
  | "slope-chart"
  | "bump-chart"
  // Area variations
  | "basic-area"
  | "stacked-area"
  | "gradient-area"
  | "stream-area"
  | "ridgeline-area"
  | "percent-area"
  | "baseline-area"
  | "area-markers"
  // Pie variations
  | "basic-pie"
  | "donut"
  | "semi-donut"
  | "nested-donut"
  | "exploded-pie"
  | "rose-chart"
  | "sunburst"
  | "gauge-pie"
  | "radial-bar"
  // Scatter variations
  | "basic-scatter"
  | "bubble"
  | "scatter-line"
  | "scatter-quadrant"
  | "scatter-categories"
  | "connected-scatter"
  | "heatmap-scatter"
  // Combo variations
  | "bar-line"
  | "area-line"
  | "stacked-line"
  | "dual-axis"
  | "bar-area"
  | "scatter-bar"
  // Funnel variations
  | "basic-funnel"
  | "pyramid-funnel"
  | "horizontal-funnel"
  | "sankey"
  | "chord"
  // Gauge variations
  | "basic-gauge"
  | "linear-gauge"
  | "thermometer"
  | "kpi-card"
  | "comparison-gauge"
  | "bullet-gauge"
  // Specialized
  | "radar"
  | "polar-area"
  | "treemap"
  | "heatmap"
  | "calendar"
  | "box-plot"
  | "candlestick"
  | "waterfall"
  | "violin"

export interface ChartTypeConfig {
  category: ChartCategory
  style: ChartStyle
}

export interface ChartConfig {
  id: string
  type: ChartTypeConfig
  title: string
  subtitle: string
  sheetName: string
  width: number
  height: number
  aliases: Record<string, string>
  position: { x: number; y: number }
  colors?: ChartColorsConfig // Override default colors
  useDefaultColors?: boolean
}

export interface ChartStyleOption {
  style: ChartStyle
  label: string
  preview: string // SVG path or identifier
}

export interface ChartCategoryOption {
  category: ChartCategory
  label: string
  icon: string
  styles: ChartStyleOption[]
}

export type ElementType = "image" | "text" | "navigation" | "filter" | "title" | "caption" | "divider"
export type BlockType = "topbar" | "header" | "leftbar" | "rightbar" | "chartArea"

export interface StyleConfig {
  padding?: string
  margin?: string
  border?: string
  background?: string
  fontSize?: string
  fontColor?: string
  fontWeight?: string
}

export type GlobalStyleCategory = "texts" | "paddings" | "margins" | "borders" | "backgrounds"

export interface GlobalStyle {
  id: string
  name: string
  description?: string
  category: GlobalStyleCategory
  // For text styles
  fontSize?: string
  fontColor?: string
  fontWeight?: string
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  // For spacing styles
  value?: string
  // For border styles
  borderWidth?: string
  borderStyle?: string
  borderColor?: string
  borderRadius?: string
  // For background styles
  backgroundColor?: string
  backgroundGradient?: string
}

export interface AdditionalContent {
  enabled: boolean
  value?: string
  styles: StyleConfig
  globalStyleId?: string
}

export interface ChartHeaderConfig {
  showTitle: boolean
  showSubtitle: boolean
  useNativeTitle: boolean // Use Tableau's native title feature
  titleStyleId?: string
  subtitleStyleId?: string
}

export interface ImageElementConfig {
  size: number
  expand: boolean
  centralize: boolean
  url: string
}

export interface TextElementConfig {
  size: number
  titlePosition: "left" | "above"
  captionPosition: "right" | "below"
}

export interface FilterElementConfig {
  size: number
}

export interface NavigationElementConfig {
  size: number
  buttonSize: number
  onState: {
    textStyleId?: string
    backgroundStyleId?: string
    customTextStyles?: {
      fontSize?: string
      fontColor?: string
      fontWeight?: string
    }
    customBackgroundStyles?: {
      backgroundColor?: string
      borderRadius?: string
    }
  }
  offState: {
    textStyleId?: string
    backgroundStyleId?: string
    customTextStyles?: {
      fontSize?: string
      fontColor?: string
      fontWeight?: string
    }
    customBackgroundStyles?: {
      backgroundColor?: string
      borderRadius?: string
    }
  }
}

export interface TemplateElement {
  id: string
  type: ElementType
  label: string
  visible: boolean
  value?: string
  styles: StyleConfig
  containerStyleId?: string
  textStyleId?: string
  title?: AdditionalContent
  caption?: AdditionalContent
  divider?: {
    enabled: boolean
    position: "start" | "end" | "both"
    size: number
    color?: string
    globalStyleId?: string
  }
  imageConfig?: ImageElementConfig
  textConfig?: TextElementConfig
  filterConfig?: FilterElementConfig
  navigationConfig?: NavigationElementConfig
  order?: number // For drag and drop ordering
}

export interface TemplateBlock {
  id: string
  type: BlockType
  label: string
  enabled: boolean
  size?: number
  styles: StyleConfig
  elements: TemplateElement[]
}

export interface SelectionState {
  blockId: string | null
  elementId: string | null
}

export interface SavedStyle {
  id: string
  name: string
  styles: StyleConfig
}

export interface GridConfig {
  gap: number
  gutter: number
  innerPadding: number
  outerPadding: number
  rows: number
  cols: number
  width: number
  height: number
}

export interface GridArea {
  id: string
  name: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export interface TemplateConfig {
  title: string
  description: string
  isPublic: boolean
  mode: "light" | "dark"
  style: "modern" | "classic" | "minimal" | "bold"
  accessibility: "default" | "high-contrast" | "grayscale"
  width: number
  height: number
  chartHeader: ChartHeaderConfig
  defaultChartColors: ChartColorsConfig
}

export interface ChartColorsConfig {
  primary: string
  secondary: string
  primaryStyleId?: string // Reference to global style for primary color
  secondaryStyleId?: string // Reference to global style for secondary color
  useGlobalPrimary?: boolean
  useGlobalSecondary?: boolean
}
