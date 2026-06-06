

import { useState, useCallback, useEffect } from "react"
import { TopNavbar } from "@/components/web3-builder/top-navbar"
import { BlockLibrary } from "@/components/web3-builder/block-library"
import { WysiwygCanvas, type CanvasBlock } from "@/components/web3-builder/wysiwyg-canvas"
import { InspectorPanel } from "@/components/web3-builder/inspector-panel"
import { type Block, blocks } from "@/components/web3-builder/block-data"
import { defaultPages, type PageItem } from "@/components/web3-builder/page-manager"
import { Smartphone, Tablet, Monitor, Construction, MonitorSmartphone, Eye, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

type DeviceType = "mobile" | "desktop"

// Mobile warning component
function MobileWarning() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-6 z-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Construction className="w-16 h-16 text-neon-orange animate-pulse" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Desktop Required
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Please open <span className="text-neon-purple font-semibold">STEM Web3 Builder</span> on a Desktop or Laptop for the best experience.
        </p>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <MonitorSmartphone className="w-8 h-8" />
          <span className="text-sm">Minimum width: 768px</span>
        </div>
        <div className="mt-8 p-4 rounded-lg bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground">
            The builder requires a larger screen to display the block library, canvas, and inspector panels side by side.
          </p>
        </div>
      </div>
    </div>
  )
}

// Remove hardcoded demo logic blocks because their IDs don't match backend

export default function App() {
  // Multi-canvas state: store blocks per page
  const [pageBlocks, setPageBlocks] = useState<Record<string, CanvasBlock[]>>({
    home: []
  })
  const [pageExtraHeights, setPageExtraHeights] = useState<Record<string, { mobile: number, desktop: number }>>({})
  const [pages, setPages] = useState<PageItem[]>(defaultPages)
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null)
  const [deviceType, setDeviceType] = useState<DeviceType>("mobile")
  const [isMobile, setIsMobile] = useState(false)
  const [contractsConfig, setContractsConfig] = useState<Record<string, any>>({})
  const [appConfig, setAppConfig] = useState<Record<string, any>>({ showTabBar: true })

  // Responsive check for mobile warning
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Get current page blocks
  const allPageBlocks = pageBlocks[currentPage] || []
  // Only show blocks that are explicitly placed on the current device
  const placedBlocks = allPageBlocks.filter(b => b.layouts?.[deviceType] !== undefined)

  const handleDragStart = useCallback((block: Block) => {
    setDraggedBlock(block)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent, position: { x: number; y: number }) => {
    e.preventDefault()
    if (draggedBlock) {
      // Nếu block đã có instanceId (nghĩa là kéo từ Khay Nhớ)
      if ((draggedBlock as CanvasBlock).instanceId) {
        const instanceId = (draggedBlock as CanvasBlock).instanceId;
        setPageBlocks(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(b => {
            if (b.instanceId === instanceId) {
              return {
                ...b,
                position, // Cập nhật position
                size: { ...(b.defaultSize || { width: 300, height: 150 }) }, // Trả về kích thước mặc định cho thiết bị mới
                anchors: undefined, // Xóa neo cũ
                layouts: {
                  ...(b.layouts || {}),
                  [deviceType]: { 
                    position, 
                    size: { ...(b.defaultSize || { width: 300, height: 150 }) }, 
                    anchors: undefined 
                  }
                }
              }
            }
            return b;
          })
        }))
        setSelectedBlockId(instanceId)
        setDraggedBlock(null)
        return
      }

      // Nếu kéo từ Thư Viện (Tạo mới)
      const newBlock: CanvasBlock = {
        ...draggedBlock,
        instanceId: `${draggedBlock.id}-${Date.now()}`,
        position,
        size: { ...draggedBlock.defaultSize },
        layouts: {
          [deviceType]: { position, size: { ...draggedBlock.defaultSize } }
        }
      }
      
      setPageBlocks(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newBlock]
      }))
      setSelectedBlockId(newBlock.instanceId)

      // HTML đã có sẵn trong block.html từ API metadata
      if (newBlock.blockType === "logic" && newBlock.html) {
        // Không cần gọi API nữa
      }

      setDraggedBlock(null)
    }
  }, [draggedBlock, currentPage, pageBlocks, deviceType])

  const handleSelectBlock = useCallback((instanceId: string | null) => {
    setSelectedBlockId(instanceId)
  }, [])

  const handleRemoveBlock = useCallback((id: string) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(b => {
        if (b.instanceId === id) {
           const newLayouts = { ...(b.layouts || {}) };
           delete newLayouts[deviceType]; // Cất vào khay
           return { ...b, layouts: newLayouts };
        }
        
        // Xóa neo trỏ tới khối vừa bị cất vào khay (cho thiết bị hiện tại)
        let changed = false;
        const newAnchors = { ...(b.anchors || {}) } as any;
        (['top', 'right', 'bottom', 'left']).forEach(edge => {
          if (newAnchors[edge] && newAnchors[edge].target === id) {
            delete newAnchors[edge];
            changed = true;
          }
        });

        if (changed) {
          return {
            ...b,
            anchors: Object.keys(newAnchors).length > 0 ? newAnchors : undefined,
            layouts: {
              ...(b.layouts || {}),
              [deviceType]: { 
                position: b.position, 
                size: b.size, 
                anchors: Object.keys(newAnchors).length > 0 ? newAnchors : undefined 
              }
            }
          };
        }
        return b;
      })
    }))
    if (selectedBlockId === id) setSelectedBlockId(null)
  }, [currentPage, selectedBlockId, deviceType])

  const handleDeleteBlockGlobal = useCallback((id: string) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter(b => b.instanceId !== id)
    }))
  }, [currentPage])

  const handleConfigureBlock = useCallback((instanceId: string) => {
    setSelectedBlockId(instanceId)
  }, [])

  const handleMoveBlock = useCallback((instanceId: string, position: { x: number; y: number }) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(b => 
        b.instanceId === instanceId ? { 
          ...b, 
          position,
          layouts: { 
            ...(b.layouts || {}), 
            [deviceType]: { position, size: b.size, anchors: b.anchors ? { ...b.anchors } : undefined }
          }
        } : b
      )
    }))
  }, [currentPage, deviceType])

  const handleResizeBlock = useCallback((id: string, size: { width: number; height: number }) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(b => 
        b.instanceId === id ? { 
          ...b, 
          size,
          layouts: {
            ...(b.layouts || {}),
            [deviceType]: {
              position: b.position,
              size,
              anchors: b.anchors ? { ...b.anchors } : undefined
            }
          }
        } : b
      )
    }))
  }, [currentPage, deviceType])

  const handleUpdateAnchors = useCallback((instanceId: string, anchors: any) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(b => 
        b.instanceId === instanceId ? { 
          ...b, 
          anchors,
          layouts: { 
            ...(b.layouts || {}), 
            [deviceType]: { position: b.position, size: b.size, anchors: anchors ? { ...anchors } : undefined }
          }
        } : b
      )
    }))
  }, [currentPage, deviceType])

  // Page change handler - clear selection when switching pages
  const handlePageChange = useCallback((pageId: string) => {
    setCurrentPage(pageId)
    setSelectedBlockId(null) // Clear selection when switching pages
  }, [])

  // Add new page handler - auto-creates empty canvas
  const handleAddPage = useCallback((page: PageItem) => {
    setPages(prev => [...prev, page])
    // Initialize empty canvas for new page
    setPageBlocks(prev => ({
      ...prev,
      [page.id]: []
    }))
    // Switch to the new page
    setCurrentPage(page.id)
    setSelectedBlockId(null)
  }, [])

  const handleDeletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) {
      alert("Không thể xóa trang cuối cùng!")
      return
    }
    setPages(prev => prev.filter(p => p.id !== pageId))
    setPageBlocks(prev => {
      const newBlocks = { ...prev }
      delete newBlocks[pageId]
      return newBlocks
    })
    if (currentPage === pageId) {
      const remaining = pages.filter(p => p.id !== pageId)
      setCurrentPage(remaining[0].id)
    }
  }, [pages, currentPage])

  const handleRenamePage = useCallback((pageId: string, newName: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, name: newName } : p))
  }, [])

  const selectedBlock = placedBlocks.find(b => b.instanceId === selectedBlockId) || null

  const deviceButtons: { type: DeviceType; icon: typeof Smartphone; label: string }[] = [
    { type: "mobile", icon: Smartphone, label: "Mobile" },
    { type: "desktop", icon: Monitor, label: "Desktop" },
  ]

  const handleUpdateContract = useCallback((blockId: string, fieldKey: string, value: string) => {
    setContractsConfig(prev => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [fieldKey]: value
      }
    }))
  }, [])

  const handleUpdateDecorative = useCallback((instanceId: string, fieldKey: string, value: string) => {
    setPageBlocks(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(b => 
        b.instanceId === instanceId ? { ...b, [fieldKey]: value } : b
      )
    }))
  }, [currentPage])

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")

  const handleUpdateAppConfig = useCallback((key: string, value: any) => {
    setAppConfig(prev => ({ ...prev, [key]: value }))
  }, [])


  // Preview Handler (No file generation)
  const handlePreview = useCallback(async () => {
    try {
      const tabsPayload = pages.map(p => ({
        id: p.id,
        name: p.name,
        blocks: pageBlocks[p.id] || []
      }))

      const payload = {
        appTitle: "STEM Web3 App",
        tabs: tabsPayload,
        config: { theme: 'dark', layout: deviceType, showTabBar: appConfig.showTabBar },
        contracts: contractsConfig
      }

      const res = await fetch('/api/v1/export/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.html) {
        setPreviewHtml(data.html)
        setIsPreviewMode(true)
      } else {
        alert("Preview failed: " + JSON.stringify(data))
      }
    } catch(err) {
      console.error("Preview error:", err)
      alert("Error generating preview")
    }
  }, [pages, pageBlocks, deviceType, appConfig.showTabBar, contractsConfig])

  // Export Handler (Generates physical file)
  const handleExport = useCallback(async () => {
    try {
      // Build tabs structure for backend
      const tabsPayload = pages.map(p => ({
        id: p.id,
        name: p.name,
        blocks: pageBlocks[p.id] || [],
        extraHeight: pageExtraHeights[p.id] || { mobile: 0, desktop: 0 }
      }))

      const payload = {
        appTitle: "STEM Web3 App",
        tabs: tabsPayload,
        config: { theme: 'dark', layout: deviceType, showTabBar: appConfig.showTabBar },
        contracts: contractsConfig
      }

      const res = await fetch('/api/v1/export/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        alert("Export failed: " + JSON.stringify(data))
      }
    } catch(err) {
      console.error("Export error:", err)
      alert("Error exporting project")
    }
  }, [pages, pageBlocks, deviceType, appConfig.showTabBar, contractsConfig])

  // Show mobile warning on small screens (MUST be after all hooks)
  if (isMobile) {
    return <MobileWarning />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      <TopNavbar onExport={handleExport} onPreview={handlePreview} />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Block Library */}
        <BlockLibrary 
          onDragStart={handleDragStart}
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onRenamePage={handleRenamePage}
          allPageBlocks={allPageBlocks}
          deviceType={deviceType}
          onDeleteGlobal={handleDeleteBlockGlobal}
        />
        
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Device Toggle Toolbar */}
          <div className="flex items-center justify-center px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
              {deviceButtons.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    if (deviceType !== type) {
                      setPageBlocks(prev => {
                        const newPageBlocks = { ...prev };
                        Object.keys(newPageBlocks).forEach(pageId => {
                          newPageBlocks[pageId] = newPageBlocks[pageId].map((block: any) => {
                            const layouts = { ...(block.layouts || {}) };
                            // Save current state into old device layout IF it was placed there
                            if (layouts[deviceType]) {
                              layouts[deviceType] = {
                                position: { ...block.position },
                                size: { ...block.size },
                                anchors: block.anchors ? { ...block.anchors } : undefined
                              };
                            }
                            
                            // Load new state or keep in tray
                            let targetLayout = layouts[type];
                            if (targetLayout) {
                              return {
                                ...block,
                                layouts,
                                position: { ...targetLayout.position },
                                size: { ...targetLayout.size },
                                anchors: targetLayout.anchors ? { ...targetLayout.anchors } : undefined
                              };
                            }
                            return { ...block, layouts };
                          });
                        });
                        return newPageBlocks;
                      });
                      
                      setDeviceType(type);
                      setSelectedBlockId(null);
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${deviceType === type 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* WYSIWYG Canvas with Device Frame */}
          <WysiwygCanvas 
            placedBlocks={placedBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            onRemoveBlock={handleRemoveBlock}
            onConfigureBlock={handleConfigureBlock}
            onMoveBlock={handleMoveBlock}
            onResizeBlock={handleResizeBlock}
            onUpdateAnchors={handleUpdateAnchors}
            onDrop={handleDrop}
            deviceType={deviceType}
            contractsConfig={contractsConfig}
            extraHeight={pageExtraHeights[currentPage]?.[deviceType] || 0}
            onChangeExtraHeight={(val) => setPageExtraHeights(prev => ({
              ...prev,
              [currentPage]: {
                ...(prev[currentPage] || { mobile: 0, desktop: 0 }),
                [deviceType]: val
              }
            }))}
          />
        </div>

        {/* Right Sidebar - Inspector */}
        <InspectorPanel 
          selectedBlock={selectedBlock} 
          contractsConfig={contractsConfig}
          onUpdateContract={handleUpdateContract}
          onUpdateDecorative={handleUpdateDecorative}
          appConfig={appConfig}
          onUpdateAppConfig={handleUpdateAppConfig}
        />
      </div>

      {/* Fullscreen Preview Modal */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col backdrop-blur-sm animate-in fade-in duration-200">
          {/* Header */}
          <div className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shadow-md">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-neon-blue" />
              Chế Độ Xem Trước (Live Preview)
            </h2>
            <div className="flex items-center gap-3">
              <Button 
                className="animated-gradient text-white font-semibold border-0 hover:opacity-90 transition-opacity rounded-full px-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                onClick={handleExport}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Xuất DApp Ngay
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsPreviewMode(false)} className="rounded-full px-6">
                Đóng Preview
              </Button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 w-full h-full p-0">
             <div className="relative w-full h-full bg-black overflow-hidden">
                <iframe srcDoc={previewHtml} className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-popups allow-same-origin" />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
