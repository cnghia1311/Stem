"use client"

import { Settings, X } from "lucide-react"
import { type Block, categoryColors, categoryBorderClasses } from "./block-data"
import { Button } from "@/components/ui/button"

interface PlacedBlockProps {
  block: Block
  onRemove: () => void
  onConfigure: () => void
  isSelected: boolean
  onSelect: () => void
}

export function PlacedBlock({ block, onRemove, onConfigure, isSelected, onSelect }: PlacedBlockProps) {
  const IconComponent = block.icon
  const borderColor = categoryColors[block.category]

  return (
    <div
      onClick={onSelect}
      className={`group relative w-[350px] p-4 rounded-2xl cursor-pointer transition-all duration-300 glass border border-border/50 ${isSelected ? 'ring-2 ring-neon-blue' : ''}`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: borderColor,
        boxShadow: isSelected ? `0 0 30px ${borderColor}30` : `0 4px 20px rgba(0,0,0,0.3)`
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 30px ${borderColor}20` }}
      />

      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
          style={{ backgroundColor: `${borderColor}20` }}
        >
          <IconComponent className="w-6 h-6" style={{ color: borderColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground">{block.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: `${borderColor}20`, color: borderColor }}
            >
              {block.category}
            </span>
          </div>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={(e) => {
              e.stopPropagation()
              onConfigure()
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
