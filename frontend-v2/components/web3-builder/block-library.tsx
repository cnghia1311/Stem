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
}

export function BlockLibrary({ onDragStart, pages, currentPage, onPageChange, onAddPage, onDeletePage, onRenamePage }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mode, setMode] = useState<"lesson" | "free">("lesson")
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
      <div className="p-3 border-b border-border flex gap-2">
        <button
          onClick={() => setMode("lesson")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            mode === "lesson" ? "bg-neon-purple text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Bài Học
        </button>
        <button
          onClick={() => setMode("free")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            mode === "free" ? "bg-neon-blue text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Tự Do
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
