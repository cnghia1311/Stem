"use client"

import { Eye, Rocket, Blocks } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopNavbar({ onExport, onPreview }: { onExport?: () => void, onPreview?: () => void }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue">
          <Blocks className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text">
          STEM Web3 Builder
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="secondary" 
          className="bg-secondary hover:bg-secondary/80 text-foreground border border-border"
          onClick={onPreview}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button 
          className="animated-gradient text-white font-semibold border-0 hover:opacity-90 transition-opacity"
          onClick={onExport}
        >
          <Rocket className="w-4 h-4 mr-2" />
          Export DApp
        </Button>
      </div>
    </header>
  )
}
