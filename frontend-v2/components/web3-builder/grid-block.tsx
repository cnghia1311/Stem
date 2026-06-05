"use client"

import { useState, useRef, useCallback } from "react"
import { Settings, X, GripVertical } from "lucide-react"
import { type Block, categoryColors } from "./block-data"

interface GridBlockData extends Block {
  instanceId: string
  gridPosition: { col: number; row: number; colSpan: number; rowSpan: number }
}

interface GridBlockProps {
  block: GridBlockData
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onConfigure: () => void
  onResize: (newSpan: { colSpan: number; rowSpan: number }) => void
}

export function GridBlock({
  block,
  isSelected,
  onSelect,
  onRemove,
  onConfigure,
  onResize,
}: GridBlockProps) {
  const [isResizing, setIsResizing] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const color = categoryColors[block.category]
  const Icon = block.icon

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: "e" | "s" | "se") => {
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startColSpan = block.gridPosition.colSpan
    const startRowSpan = block.gridPosition.rowSpan
    const cellWidth = 80 // Approximate cell width
    const cellHeight = 60 // Approximate cell height

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newColSpan = startColSpan
      let newRowSpan = startRowSpan

      if (direction === "e" || direction === "se") {
        newColSpan = Math.max(2, Math.min(12, startColSpan + Math.round(deltaX / cellWidth)))
      }
      if (direction === "s" || direction === "se") {
        newRowSpan = Math.max(1, Math.min(4, startRowSpan + Math.round(deltaY / cellHeight)))
      }

      onResize({ colSpan: newColSpan, rowSpan: newRowSpan })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [block.gridPosition, onResize])

  return (
    <div
      ref={blockRef}
      onClick={onSelect}
      className={`relative group rounded-xl bg-card/80 backdrop-blur-sm border-2 transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? "border-neon-blue shadow-lg shadow-neon-blue/20"
          : "border-border hover:border-neon-blue/50"
      } ${isResizing ? "select-none" : ""}`}
      style={{
        gridColumn: `span ${block.gridPosition.colSpan}`,
        gridRow: `span ${block.gridPosition.rowSpan}`,
        borderLeftColor: color,
        borderLeftWidth: 4,
      }}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate">{block.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{block.description}</p>
          </div>
        </div>

        {/* Expanded content for larger blocks */}
        {(block.gridPosition.colSpan >= 4 || block.gridPosition.rowSpan >= 2) && (
          <div className="mt-3 pt-3 border-t border-border/50 flex-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="px-2 py-1.5 rounded-md bg-secondary/50">
                <span className="text-muted-foreground">Category</span>
                <p className="font-medium text-foreground capitalize">{block.category}</p>
              </div>
              <div className="px-2 py-1.5 rounded-md bg-secondary/50">
                <span className="text-muted-foreground">Size</span>
                <p className="font-medium text-foreground">{block.gridPosition.colSpan}x{block.gridPosition.rowSpan}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onConfigure()
          }}
          className="p-1.5 rounded-md bg-secondary/80 hover:bg-neon-blue/20 text-muted-foreground hover:text-neon-blue transition-colors"
          title="Configure"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-1.5 rounded-md bg-secondary/80 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
          title="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "e")}
            className="absolute top-0 right-0 w-2 h-full cursor-e-resize hover:bg-neon-blue/30 transition-colors"
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "s")}
            className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize hover:bg-neon-blue/30 transition-colors"
          />
          {/* Corner */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "se")}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-neon-blue" />
          </div>
        </>
      )}
    </div>
  )
}
