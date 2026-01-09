"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutGrid, MoreHorizontal } from "lucide-react"

export function EditorHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <LayoutGrid className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">TabDesign</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </Button>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save
        </Button>
        <Button variant="outline" size="sm">
          Reset
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">hasTech Team</span>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
      </div>
    </header>
  )
}
