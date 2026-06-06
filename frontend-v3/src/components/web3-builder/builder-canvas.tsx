"use client"

import { Layers, Plus } from "lucide-react"
import { type Block } from "./block-data"
import { PlacedBlock } from "./placed-block"

interface PlacedBlockData extends Block {
  instanceId: string
}

interface BuilderCanvasProps {
  placedBlocks: PlacedBlockData[]
  selectedBlockId: string | null
  onSelectBlock: (instanceId: string | null) => void
  onRemoveBlock: (instanceId: string) => void
  onConfigureBlock: (instanceId: string) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
}

export function BuilderCanvas({
  placedBlocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onConfigureBlock,
  onDrop,
  onDragOver
}: BuilderCanvasProps) {
  return (
    <main 
      className="flex-1 h-full overflow-auto bg-card dotted-grid"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="min-h-full p-8 flex flex-col items-center">
        {placedBlocks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 border-2 border-dashed border-border">
              <Layers className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Build Your Web3 App</h3>
            <p className="text-muted-foreground max-w-sm">
              Drag & Drop blocks here to build your Web3 App!
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-neon-blue">
              <Plus className="w-4 h-4" />
              <span>Drop your first block to get started</span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-4 py-8">
            {/* Connection lines between blocks */}
            {placedBlocks.map((block, index) => (
              <div key={block.instanceId} className="relative">
                {index > 0 && (
                  <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-border to-neon-blue/50" />
                )}
                <PlacedBlock
                  block={block}
                  isSelected={selectedBlockId === block.instanceId}
                  onSelect={() => onSelectBlock(block.instanceId)}
                  onRemove={() => onRemoveBlock(block.instanceId)}
                  onConfigure={() => onConfigureBlock(block.instanceId)}
                />
                {index < placedBlocks.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-neon-blue/50 to-border" />
                )}
              </div>
            ))}
            
            {/* Drop zone hint at the bottom */}
            <div className="mt-8 p-4 rounded-xl border-2 border-dashed border-border/50 bg-secondary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Drop more blocks here to expand your DApp
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
