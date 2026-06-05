"use client"

import { type Block, categoryColors } from "./block-data"
import { GripVertical } from "lucide-react"

interface DraggableBlockProps {
  block: Block
  onDragStart: (block: Block) => void
}

export function DraggableBlock({ block, onDragStart }: DraggableBlockProps) {
  const IconComponent = block.icon
  const borderColor = categoryColors[block.category]

  return (
    <div
      draggable
      onDragStart={() => onDragStart(block)}
      className="group relative flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02] bg-secondary/50 border-2 border-transparent hover:bg-secondary"
      style={{ 
        borderLeftColor: borderColor, 
        borderLeftWidth: '4px',
        boxShadow: `0 0 0 0 ${borderColor}40`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 15px 0 ${borderColor}40`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 0 ${borderColor}40`
      }}
    >
      <div 
        className="flex items-center justify-center w-9 h-9 rounded-lg"
        style={{ backgroundColor: `${borderColor}20` }}
      >
        <IconComponent className="w-5 h-5" style={{ color: borderColor }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{block.title}</p>
        <p className="text-xs text-muted-foreground truncate">{block.description}</p>
      </div>
      
      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
