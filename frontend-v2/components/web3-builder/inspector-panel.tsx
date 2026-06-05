"use client"

import { Settings2, Move, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { type Block, categoryColors } from "./block-data"

interface PlacedBlockData extends Block {
  instanceId: string
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

interface InspectorPanelProps {
  selectedBlock: PlacedBlockData | null
  contractsConfig: Record<string, any>
  onUpdateContract: (blockId: string, fieldKey: string, value: string) => void
  onUpdateDecorative: (instanceId: string, fieldKey: string, value: string) => void
  appConfig?: Record<string, any>
  onUpdateAppConfig?: (key: string, value: any) => void
}

export function InspectorPanel({ 
  selectedBlock, 
  contractsConfig, 
  onUpdateContract, 
  onUpdateDecorative,
  appConfig,
  onUpdateAppConfig
}: InspectorPanelProps) {
  return (
    <aside className="w-[320px] h-full flex flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neon-blue/20">
            <Settings2 className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {selectedBlock ? "Thuộc Tính Khối" : "Cài Đặt DApp"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedBlock ? "Cài đặt thông số cho Smart Contract" : "Cấu hình chung cho dự án"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedBlock ? (
          <div className="space-y-6">
            {/* Selected block info */}
            <div 
              className="p-4 rounded-xl border"
              style={{ 
                borderColor: categoryColors[selectedBlock.category],
                backgroundColor: `${categoryColors[selectedBlock.category]}10`
              }}
            >
              <div className="flex items-center gap-3">
                <selectedBlock.icon 
                  className="w-6 h-6" 
                  style={{ color: categoryColors[selectedBlock.category] }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{selectedBlock.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedBlock.category}</p>
                </div>
                {/* Block type badge */}
                <div 
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                    ${selectedBlock.blockType === "logic" 
                      ? "bg-neon-purple/20 text-neon-purple" 
                      : "bg-slate-500/20 text-slate-400"
                    }
                  `}
                >
                  {selectedBlock.blockType === "logic" ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Logic</span>
                    </>
                  ) : (
                    <>
                      <Move className="w-3 h-3" />
                      <span>UI</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Block type description */}
              <p className="text-xs text-muted-foreground mt-3 p-2 rounded-lg bg-black/20">
                {selectedBlock.blockType === "logic" 
                  ? "Đây là khối Logic tĩnh, nó có kích thước cố định và không thể thay đổi."
                  : "Đây là khối Trang trí. Bạn có thể kéo các góc để thu phóng hoặc di chuyển tự do."
                }
              </p>
            </div>

            {/* Position & Size info */}
            {selectedBlock.position && selectedBlock.size && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Vị Trí (X, Y)</Label>
                  <p className="text-sm font-mono text-foreground mt-1">
                    {selectedBlock.position.x}, {selectedBlock.position.y}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Kích Thước</Label>
                  <p className="text-sm font-mono text-foreground mt-1">
                    {selectedBlock.size.width} x {selectedBlock.size.height}
                  </p>
                </div>
              </div>
            )}

            {/* Form inputs */}
            <div className="space-y-4 border-t border-border pt-6">
              {selectedBlock.blockType === "logic" ? (
                <>
                  <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neon-purple" />
                    Cấu Hình Hợp Đồng
                  </h4>
                  {selectedBlock.contractFields && selectedBlock.contractFields.length > 0 ? (
                    selectedBlock.contractFields.map((field, idx) => (
                      <div className="space-y-2" key={`${selectedBlock.id}-${idx}`}>
                        <Label htmlFor={`field-${field.key}`} className="text-sm font-medium text-foreground">
                          {field.label}
                        </Label>
                        <Input
                          id={`field-${field.key}`}
                          placeholder={field.placeholder}
                          value={contractsConfig[selectedBlock.id]?.[field.key] || ""}
                          onChange={(e) => onUpdateContract(selectedBlock.id, field.key, e.target.value)}
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground glow-input focus:border-neon-blue"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic bg-secondary/30 p-3 rounded-lg border border-border">
                      Khối này không yêu cầu cài đặt Smart Contract.
                    </p>
                  )}
                  {selectedBlock.uiFields && selectedBlock.uiFields.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                        <Move className="w-4 h-4 text-slate-400" />
                        Tùy Chỉnh Giao Diện (UI)
                      </h4>
                      {selectedBlock.uiFields.map((field, idx) => (
                        <div className="space-y-2 mb-4" key={`ui-${selectedBlock.id}-${idx}`}>
                          <Label htmlFor={`ui-${field.key}`} className="text-sm font-medium text-foreground">
                            {field.label}
                          </Label>
                          {field.type === "select" ? (
                            <select
                              id={`ui-${field.key}`}
                              value={contractsConfig[selectedBlock.id]?.[field.key] || ""}
                              onChange={(e) => onUpdateContract(selectedBlock.id, field.key, e.target.value)}
                              className="w-full p-2 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none focus:border-neon-blue"
                            >
                              <option value="">-- Mặc định --</option>
                              {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              id={`ui-${field.key}`}
                              placeholder={field.label}
                              value={contractsConfig[selectedBlock.id]?.[field.key] || ""}
                              onChange={(e) => onUpdateContract(selectedBlock.id, field.key, e.target.value)}
                              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground glow-input focus:border-neon-blue"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Move className="w-4 h-4 text-slate-400" />
                    Thuộc Tính Giao Diện
                  </h4>
                  {selectedBlock.id === "text-title" && (
                    <div className="space-y-2">
                      <Label htmlFor="decorative-title" className="text-sm font-medium text-foreground">
                        Nội dung văn bản
                      </Label>
                      <Input
                        id="decorative-title"
                        placeholder="Heading text..."
                        value={selectedBlock.title || ""}
                        onChange={(e) => onUpdateDecorative(selectedBlock.instanceId, "title", e.target.value)}
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground glow-input focus:border-neon-blue"
                      />
                    </div>
                  )}
                  {selectedBlock.id === "background-image" && (
                    <div className="space-y-2">
                      <Label htmlFor="decorative-image" className="text-sm font-medium text-foreground">
                        Đường dẫn (URL) ảnh
                      </Label>
                      <Input
                        id="decorative-image"
                        placeholder="https://..."
                        value={(selectedBlock as any).imageUrl || ""}
                        onChange={(e) => onUpdateDecorative(selectedBlock.instanceId, "imageUrl", e.target.value)}
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground glow-input focus:border-neon-blue"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                <Settings2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Chưa chọn khối</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng click vào một khối trên Bảng vẽ để cài đặt
              </p>
            </div>
            
            {/* Global Settings */}
            <div className="p-4 border-t border-border mt-auto bg-secondary/10">
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-400" />
                Cài Đặt Chung
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-tab-bar" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                    Hiện Menu chuyển trang (Dock)
                  </Label>
                  <Switch 
                    id="show-tab-bar" 
                    checked={appConfig?.showTabBar !== false}
                    onCheckedChange={(checked) => onUpdateAppConfig?.("showTabBar", checked)}
                    className="data-[state=checked]:bg-neon-blue"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Khi tắt, thanh chuyển hướng ở dưới đáy DApp sẽ bị ẩn. Hãy đảm bảo bạn đã tạo các "Nút Chuyển Trang" thay thế!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
