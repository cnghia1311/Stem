"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isFocused ? 'text-neon-blue' : 'text-muted-foreground'}`} />
      <Input
        type="text"
        placeholder="Search blocks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground glow-input transition-all duration-200 ${isFocused ? 'border-neon-blue ring-2 ring-neon-blue/20' : ''}`}
      />
    </div>
  )
}
