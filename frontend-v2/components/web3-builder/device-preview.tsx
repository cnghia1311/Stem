"use client"

import { useState } from "react"
import { Smartphone, Tablet, Monitor } from "lucide-react"
import { type Block, categoryColors } from "./block-data"

type DeviceType = "mobile" | "tablet" | "desktop"

interface PlacedBlockData extends Block {
  instanceId: string
  gridPosition?: { col: number; row: number; colSpan: number; rowSpan: number }
}

interface DevicePreviewProps {
  placedBlocks: PlacedBlockData[]
}

const deviceConfig = {
  mobile: { width: 375, height: 667, scale: 0.85 },
  tablet: { width: 768, height: 1024, scale: 0.55 },
  desktop: { width: 1280, height: 800, scale: 0.4 },
}

export function DevicePreview({ placedBlocks }: DevicePreviewProps) {
  const [device, setDevice] = useState<DeviceType>("mobile")
  const config = deviceConfig[device]

  return (
    <div className="flex flex-col h-full">
      {/* Device Toggle */}
      <div className="flex items-center justify-center gap-1 p-3 border-b border-border bg-background/50">
        {(["mobile", "tablet", "desktop"] as DeviceType[]).map((d) => {
          const Icon = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor
          return (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                device === d
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{d}</span>
            </button>
          )
        })}
      </div>

      {/* Device Frame */}
      <div className="flex-1 flex items-center justify-center p-6 bg-secondary/20 overflow-auto">
        <div
          className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl"
          style={{ transform: `scale(${config.scale})`, transformOrigin: "center" }}
        >
          {/* iPhone notch */}
          {device === "mobile" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1a] rounded-b-2xl z-10" />
          )}
          
          {/* Screen bezel */}
          <div
            className="relative bg-background rounded-[2.5rem] overflow-hidden border-4 border-[#2a2a2a]"
            style={{ width: config.width, height: config.height }}
          >
            {/* Status bar for mobile */}
            {device === "mobile" && (
              <div className="h-12 bg-background flex items-end justify-between px-6 pb-1">
                <span className="text-xs font-semibold text-foreground">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 rounded-sm bg-foreground" />
                  <div className="w-4 h-2 rounded-sm bg-foreground" />
                  <div className="w-6 h-3 rounded-sm border border-foreground">
                    <div className="w-4 h-full bg-emerald rounded-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* App content preview */}
            <div className="p-4 space-y-3">
              {/* App header preview */}
              <div className="text-center py-4">
                <h3 className="text-lg font-bold text-foreground">My Web3 App</h3>
                <p className="text-xs text-muted-foreground mt-1">Built with STEM Builder</p>
              </div>

              {/* Preview of placed blocks */}
              {placedBlocks.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">Add blocks to see preview</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {placedBlocks.slice(0, 4).map((block) => {
                    const color = categoryColors[block.category]
                    const Icon = block.icon
                    return (
                      <div
                        key={block.instanceId}
                        className="p-3 rounded-xl bg-card border border-border"
                        style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{block.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{block.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {placedBlocks.length > 4 && (
                    <p className="text-xs text-center text-muted-foreground">
                      +{placedBlocks.length - 4} more blocks
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Home indicator for mobile */}
            {device === "mobile" && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
