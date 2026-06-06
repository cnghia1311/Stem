"use client"

import { useState } from "react"
import { ChevronDown, Plus, Home, Image, Shield, FileCode, Trash2, Edit2, Check, X } from "lucide-react"

export interface PageItem {
  id: string
  name: string
  icon: React.ReactNode
}

const defaultPages: PageItem[] = [
  { id: "home", name: "Trang chủ", icon: <Home className="w-4 h-4" /> }
]

interface PageManagerProps {
  currentPage: string
  pages: PageItem[]
  onPageChange: (pageId: string) => void
  onAddPage: (page: PageItem) => void
  onDeletePage?: (pageId: string) => void
  onRenamePage?: (pageId: string, newName: string) => void
}

export function PageManager({ currentPage, pages, onPageChange, onAddPage, onDeletePage, onRenamePage }: PageManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const selectedPage = pages.find(p => p.id === currentPage) || pages[0]

  const handleAddPage = () => {
    const pageNumber = pages.length + 1
    const newPage: PageItem = {
      id: `page-${Date.now()}`,
      name: `Trang ${pageNumber}`,
      icon: <FileCode className="w-4 h-4" />
    }
    onAddPage(newPage)
  }

  const handleStartEdit = (e: React.MouseEvent, page: PageItem) => {
    e.stopPropagation()
    setEditingId(page.id)
    setEditName(page.name)
  }

  const handleSaveEdit = (e: React.MouseEvent | React.KeyboardEvent, pageId: string) => {
    e.stopPropagation()
    if (editName.trim() && onRenamePage) {
      onRenamePage(pageId, editName.trim())
    }
    setEditingId(null)
  }

  const handleDelete = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation()
    if (onDeletePage) {
      if (confirm("Bạn có chắc muốn xóa trang này?")) {
        onDeletePage(pageId)
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-secondary/50 border border-border hover:border-neon-purple/50 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="text-neon-purple">{selectedPage.icon}</div>
            <span className="text-sm font-medium text-foreground">{selectedPage.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        <button
          onClick={handleAddPage}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-neon-purple/20 border border-neon-purple/30 hover:bg-neon-purple/30 hover:border-neon-purple/50 transition-all"
          title="Thêm trang mới"
        >
          <Plus className="w-5 h-5 text-neon-purple" />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-10 mt-2 py-1 rounded-lg bg-card border border-border shadow-xl z-20">
            {pages.map(page => (
              <div
                key={page.id}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-secondary/50 transition-colors group ${
                  page.id === currentPage ? "bg-neon-purple/10 text-neon-purple" : "text-foreground"
                }`}
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (editingId !== page.id) {
                      onPageChange(page.id)
                      setIsOpen(false)
                    }
                  }}
                >
                  <div className={page.id === currentPage ? "text-neon-purple" : "text-muted-foreground"}>
                    {page.icon}
                  </div>
                  {editingId === page.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveEdit(e, page.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="bg-background border border-neon-purple rounded px-2 py-0.5 text-sm w-full outline-none text-foreground"
                    />
                  ) : (
                    <span className="text-sm font-medium truncate">{page.name}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {editingId === page.id ? (
                    <>
                      <button onClick={e => handleSaveEdit(e, page.id)} className="p-1 text-green-500 hover:bg-green-500/20 rounded">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setEditingId(null) }} className="p-1 text-red-500 hover:bg-red-500/20 rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={e => handleStartEdit(e, page)} className="p-1 text-muted-foreground hover:text-neon-blue hover:bg-neon-blue/20 rounded" title="Đổi tên">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {pages.length > 1 && (
                        <button onClick={e => handleDelete(e, page.id)} className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/20 rounded" title="Xóa trang">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export { defaultPages }
