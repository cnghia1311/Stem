"use client"

import { 
  Wallet, 
  Coins, 
  Image, 
  Store, 
  Users, 
  Box, 
  Layers, 
  Shield,
  Zap,
  Gift,
  Vote,
  Lock,
  Type,
  Square,
  Link2,
  Menu,
  type LucideIcon
} from "lucide-react"

export type BlockCategory = "Layout/Navigation" | "Basic" | "Assets/Coin" | "NFTs" | "Market" | "DAO" | "Decorative"
export type BlockType = "logic" | "decorative"

export interface Block {
  id: string
  title: string
  category: BlockCategory
  icon: LucideIcon
  description: string
  blockType: BlockType
  defaultSize: { width: number; height: number }
  contractFields?: { key: string; label: string; placeholder: string; type?: string }[]
  uiFields?: { key: string; label: string; type: string; options?: {label: string, value: string}[] }[]
}

export const categoryColors: Record<BlockCategory, string> = {
  "Layout/Navigation": "#06b6d4",
  "Basic": "#3b82f6",
  "Assets/Coin": "#f97316", 
  "NFTs": "#a855f7",
  "Market": "#10b981",
  "DAO": "#ec4899",
  "Decorative": "#64748b"
}

export const categoryBorderClasses: Record<BlockCategory, string> = {
  "Layout/Navigation": "border-l-[#06b6d4]",
  "Basic": "border-l-[#3b82f6]",
  "Assets/Coin": "border-l-[#f97316]", 
  "NFTs": "border-l-[#a855f7]",
  "Market": "border-l-[#10b981]",
  "DAO": "border-l-[#ec4899]",
  "Decorative": "border-l-[#64748b]"
}

export const blocks: Block[] = [
  // Layout/Navigation - Logic blocks (fixed size, max-width 350px)
  { 
    id: "link-button", title: "Link Button", category: "Layout/Navigation", icon: Link2, description: "CTA jump to pages", blockType: "logic", defaultSize: { width: 160, height: 44 },
    uiFields: [
      { key: "buttonText", label: "Tên nút", type: "text" },
      { key: "buttonImage", label: "Link Icon/Ảnh", type: "text" },
      { key: "buttonLayout", label: "Bố cục", type: "select", options: [
        { label: "➡️ Icon Trái - Chữ Phải", value: "icon-left" },
        { label: "⬅️ Chữ Trái - Icon Phải", value: "icon-right" },
        { label: "⬇️ Icon Trên - Chữ Dưới", value: "icon-top" },
        { label: "⬆️ Chữ Trên - Icon Dưới", value: "icon-bottom" },
        { label: "🖼️ Ảnh làm nền (Chữ đè lên)", value: "bg-image" }
      ]}
    ]
  },
  { id: "navbar-tabbar", title: "Navbar / Tab Bar", category: "Layout/Navigation", icon: Menu, description: "Global app navigation", blockType: "logic", defaultSize: { width: 350, height: 56 } },

  // Basic - Logic blocks (fixed size, max-width 350px)
  { id: "wallet-connect", title: "Wallet Connect", category: "Basic", icon: Wallet, description: "Connect user wallets", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "smart-contract", title: "Smart Contract", category: "Basic", icon: Box, description: "Deploy contracts", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "gas-optimizer", title: "Gas Optimizer", category: "Basic", icon: Zap, description: "Optimize gas fees", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  
  // Assets/Coin - Logic blocks (fixed size, max-width 350px)
  { id: "create-token", title: "Create Token", category: "Assets/Coin", icon: Coins, description: "Mint ERC-20 tokens", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "token-transfer", title: "Token Transfer", category: "Assets/Coin", icon: Layers, description: "Transfer tokens", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "airdrop", title: "Airdrop", category: "Assets/Coin", icon: Gift, description: "Distribute tokens", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  
  // NFTs - Logic blocks (fixed size, max-width 350px)
  { id: "nft-mint", title: "NFT Mint", category: "NFTs", icon: Image, description: "Create NFT collections", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "nft-gallery", title: "NFT Gallery", category: "NFTs", icon: Layers, description: "Display NFTs", blockType: "logic", defaultSize: { width: 180, height: 120 } },
  
  // Market - Logic blocks (fixed size, max-width 350px)
  { id: "marketplace", title: "Marketplace", category: "Market", icon: Store, description: "Buy & sell NFTs", blockType: "logic", defaultSize: { width: 180, height: 80 } },
  { id: "swap", title: "Token Swap", category: "Market", icon: Coins, description: "Exchange tokens", blockType: "logic", defaultSize: { width: 160, height: 60 } },
  
  // DAO - Logic blocks (fixed size, max-width 350px)
  { id: "dao-voting", title: "DAO Voting", category: "DAO", icon: Vote, description: "Governance voting", blockType: "logic", defaultSize: { width: 160, height: 60 } },
  { id: "multisig", title: "Multisig Treasury", category: "DAO", icon: Shield, description: "Secure treasury", blockType: "logic", defaultSize: { width: 160, height: 60 } },
  { id: "admin-role", title: "Admin Roles", category: "DAO", icon: Lock, description: "Access control", blockType: "logic", defaultSize: { width: 140, height: 48 } },
  { id: "members", title: "Member List", category: "DAO", icon: Users, description: "Manage members", blockType: "logic", defaultSize: { width: 160, height: 100 } },

  // Decorative blocks (resizable)
  { id: "text-title", title: "Văn Bản", category: "Decorative", icon: Type, description: "Thêm dòng chữ", blockType: "decorative", defaultSize: { width: 200, height: 40 } },
  { id: "background-image", title: "Ảnh Nền", category: "Decorative", icon: Image, description: "Thêm ảnh", blockType: "decorative", defaultSize: { width: 280, height: 160 } },
  { id: "container", title: "Khung Chứa", category: "Decorative", icon: Square, description: "Nhóm giao diện", blockType: "decorative", defaultSize: { width: 240, height: 180 } },
]

export const categories: BlockCategory[] = ["Layout/Navigation", "Basic", "Assets/Coin", "NFTs", "Market", "DAO", "Decorative"]

// Helper to create a dynamic "Go to [Page]" link button
export function createPageLinkBlock(pageId: string, pageName: string): Block {
  return {
    id: `link-to-${pageId}`,
    title: `Đến: ${pageName}`,
    category: "Layout/Navigation",
    icon: Link2,
    description: `Chuyển tới trang ${pageName}`,
    blockType: "logic",
    defaultSize: { width: 160, height: 44 },
    uiFields: [
      { key: "buttonText", label: "Tên nút", type: "text" },
      { key: "buttonImage", label: "Link Icon/Ảnh", type: "text" },
      { key: "buttonLayout", label: "Bố cục", type: "select", options: [
        { label: "➡️ Icon Trái - Chữ Phải", value: "icon-left" },
        { label: "⬅️ Chữ Trái - Icon Phải", value: "icon-right" },
        { label: "⬇️ Icon Trên - Chữ Dưới", value: "icon-top" },
        { label: "⬆️ Chữ Trên - Icon Dưới", value: "icon-bottom" },
        { label: "🖼️ Ảnh làm nền (Chữ đè lên)", value: "bg-image" }
      ]}
    ]
  }
}
