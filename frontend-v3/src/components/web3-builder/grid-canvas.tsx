"use client"

import { Layers, Plus } from "lucide-react"
import { type Block } from "./block-data"
import { GridBlock } from "./grid-block"

interface GridBlockData extends Block {
  instanceId: string
  gridPosition: { col: number; row: number; colSpan: number; rowSpan: number }
}

interface GridCanvasProps {
  placedBlocks: GridBlockData[]
  selectedBlockId: string | null
  onSelectBlock: (instanceId: string | null) => void
  onRemoveBlock: (instanceId: string) => void
  onConfigureBlock: (instanceId: string) => void
  onResizeBlock: (instanceId: string, newSpan: { colSpan: number; rowSpan: number }) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
}

export function GridCanvas({
  placedBlocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onConfigureBlock,
  onResizeBlock,
  onDrop,
  onDragOver,
}: GridCanvasProps) {
  return (
    <div
      className="flex-1 h-full overflow-auto bg-card relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => onSelectBlock(null)}
    >
      {/* 12-column dotted grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "calc(100% / 12) 60px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Grid labels */}
      <div className="absolute top-0 left-0 right-0 h-6 flex border-b border-border/30 bg-background/50 backdrop-blur-sm z-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground/50 font-mono"
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="p-6 pt-10 min-h-full">
        {placedBlocks.length === 0 ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 border-2 border-dashed border-border">
              <Layers className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Build Your Web3 App</h3>
            <p className="text-muted-foreground max-w-sm">
              Drag & Drop blocks to the grid canvas
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-neon-blue">
              <Plus className="w-4 h-4" />
              <span>Blocks snap to the 12-column grid</span>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridAutoRows: "60px",
            }}
          >
            {placedBlocks.map((block) => (
              <GridBlock
                key={block.instanceId}
                block={block}
                isSelected={selectedBlockId === block.instanceId}
                onSelect={() => onSelectBlock(block.instanceId)}
                onRemove={() => onRemoveBlock(block.instanceId)}
                onConfigure={() => onConfigureBlock(block.instanceId)}
                onResize={(newSpan) => onResizeBlock(block.instanceId, newSpan)}
              />
            ))}
          </div>
        )}

        {/* Drop zone hint */}
        {placedBlocks.length > 0 && (
          <div className="mt-8 p-4 rounded-xl border-2 border-dashed border-border/50 bg-secondary/10 text-center">
            <p className="text-sm text-muted-foreground">
              Drop more blocks here - they will snap to the grid
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
