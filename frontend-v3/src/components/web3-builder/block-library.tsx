"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "./search-bar"
import { DraggableBlock } from "./draggable-block"
import { PageManager, type PageItem } from "./page-manager"
import { blocks, createPageLinkBlock, type Block } from "./block-data"
import { ChevronDown, ChevronRight, Puzzle, Layers, BookOpen, LayoutGrid } from "lucide-react"
import { LESSONS, CATEGORIES } from "./subjects"

interface BlockLibraryProps {
  onDragStart: (block: Block) => void
  pages: PageItem[]
  currentPage: string
  onPageChange: (pageId: string) => void
  onAddPage: (page: PageItem) => void
  onDeletePage?: (pageId: string) => void
  onRenamePage?: (pageId: string, newName: string) => void
  allPageBlocks?: any[]
  deviceType?: "mobile" | "desktop"
  onDeleteGlobal?: (id: string) => void
}

export function BlockLibrary({ onDragStart, pages, currentPage, onPageChange, onAddPage, onDeletePage, onRenamePage, allPageBlocks = [], deviceType, onDeleteGlobal }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mode, setMode] = useState<"lesson" | "free" | "tray">("lesson")
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]?.id)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.id))
  )
  const [logicBlocks, setLogicBlocks] = useState<Block[]>([])

  useEffect(() => {
    fetch('/api/v1/blocks/metadata')
      .then(r => r.json())
      .then((data: any[]) => {
        const mapped: Block[] = data.map(b => {
          return {
            id: b.id,
            title: b.name,
            category: "Basic", // Dummy category, will be mapped dynamically
            icon: Layers,
            description: b.desc,
            blockType: "logic",
            defaultSize: { width: 320, height: Math.max((b.minHeight || 150) + 20, 180) },
            contractFields: b.contractFields,
            html: b.html,
            uiFields: [
              { key: "buttonText", label: "Tên nút (Text)", type: "text" },
              { key: "buttonColor", label: "Màu nền (Hex, rgba)", type: "text" }
            ]
          }
        })
        setLogicBlocks(mapped)
      })
      .catch(err => console.error("Failed to fetch backend blocks", err))
  }, [])

  // Generate dynamic "Go to [Page]" link blocks
  const dynamicLinkBlocks: Block[] = pages
    .filter(p => p.id !== currentPage)
    .map(p => createPageLinkBlock(p.id, p.name))

  const decorativeBlocks = blocks.filter(b => b.blockType === "decorative")
  const allBlocks = [...logicBlocks, ...decorativeBlocks, ...dynamicLinkBlocks]

  const getFilteredBlocks = () => {
    let result = allBlocks

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q)
      )
    }
    return result
  }

  const filteredBlocks = getFilteredBlocks()

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const trayBlocks = allPageBlocks.filter(b => !b.layouts?.[deviceType || "desktop"])

  return (
    <aside className="w-[300px] h-full flex flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-foreground">Thư Viện Khối</h2>
        </div>
      </div>

      {/* Page Manager */}
      <div className="p-4 border-b border-border">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Quản Lý Trang
        </label>
        <PageManager
          currentPage={currentPage}
          pages={pages}
          onPageChange={onPageChange}
          onAddPage={onAddPage}
          onDeletePage={onDeletePage}
          onRenamePage={onRenamePage}
        />
      </div>

      {/* Mode Switcher */}
      <div className="p-3 border-b border-border flex gap-1">
        <button
          onClick={() => setMode("lesson")}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            mode === "lesson" ? "bg-neon-purple text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Bài Học
        </button>
        <button
          onClick={() => setMode("free")}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            mode === "free" ? "bg-neon-blue text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Tự Do
        </button>
        <button
          onClick={() => setMode("tray")}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors relative ${
            mode === "tray" ? "bg-orange-500 text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Khay
          {trayBlocks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
              {trayBlocks.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b border-border">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Lesson Selector */}
      {mode === "lesson" && (
        <div className="p-4 border-b border-border bg-secondary/20">
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="w-full p-2 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none focus:border-neon-purple"
          >
            {LESSONS.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === "lesson" ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-neon-purple" />
              Khối trong bài
            </h3>
            {filteredBlocks
              .filter(b => {
                const lesson = LESSONS.find(l => l.id === selectedLesson)
                return lesson?.blocks.includes(b.id)
              })
              .map(block => (
                <DraggableBlock key={block.id} block={block} onDragStart={onDragStart} />
              ))}
          </div>
        ) : mode === "tray" ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              Khay Nhớ Khối
            </h3>
            {trayBlocks.map(block => (
              <div key={block.instanceId} className="relative group">
                <DraggableBlock block={block} onDragStart={onDragStart} />
                <button 
                  onClick={() => onDeleteGlobal?.(block.instanceId)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Xóa vĩnh viễn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
            {trayBlocks.length === 0 && (
              <div className="text-center text-xs text-muted-foreground p-4 bg-secondary/30 rounded-lg border border-border border-dashed">
                Không có khối nào trong khay.
                <br/><br/>
                Khi bạn xóa 1 khối trên màn hình, nó sẽ được cất vào đây.
              </div>
            )}
          </div>
        ) : (
          CATEGORIES.map(category => {
            const categoryBlocks = filteredBlocks.filter(b => {
              if (category.id === "nav") {
                return b.id.startsWith("link-to-")
              }
              return category.blocks.includes(b.id)
            })
            const isExpanded = expandedCategories.has(category.id)

            if (categoryBlocks.length === 0) return null

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-2 w-full text-left mb-2 group"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({categoryBlocks.length})
                  </span>
                </button>

                {isExpanded && (
                  <div className="space-y-2 ml-2">
                    {categoryBlocks.map(block => (
                      <DraggableBlock key={block.id} block={block} onDragStart={onDragStart} />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}

        {filteredBlocks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground p-8">
            Không tìm thấy khối nào
          </div>
        )}
      </div>
    </aside>
  )
}
