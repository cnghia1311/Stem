/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOCKS_DIR = path.resolve(__dirname, '../../data/blocks')

/**
 * Block Cache — Load 14 file JS riêng biệt từ data/blocks/
 * Mỗi file export default 1 object chứa hết: exportHtml(), engineCode(), globalCode(), bindings, preview()
 */
class BlockCache {
  constructor() {
    this._blocks = new Map()
    this._totalBytes = 0
  }

  /**
   * Load tất cả file .js trong thư mục blocks/
   */
  async load() {
    const files = fs.readdirSync(BLOCKS_DIR).filter(f => f.endsWith('.js'))

    for (const file of files) {
      try {
        const filePath = path.join(BLOCKS_DIR, file)
        const module = await import('file:///' + filePath.replace(/\\/g, '/'))
        const block = module.default

        if (block && block.id) {
          this._blocks.set(block.id, block)
          this._totalBytes += fs.statSync(filePath).size
          console.log(`  ✅ Loaded block: ${block.id}`)
        }
      } catch (err) {
        console.error(`  ❌ Failed to load ${file}:`, err.message)
      }
    }

    console.log(`📦 Block Cache: ${this._blocks.size} blocks loaded (${this._totalBytes} bytes)`)
  }

  /**
   * Lấy block theo ID — O(1)
   */
  getBlock(blockId) {
    return this._blocks.get(blockId) || null
  }

  /**
   * Lấy tất cả block metadata
   */
  getAllMeta() {
    return [...this._blocks.values()].map(b => {
      const html = typeof b.exportHtml === 'function' ? b.exportHtml('STEM', {}) : (b.exportHtml || '')

      // Auto-calculate minHeight from HTML content
      const countTag = (tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length
      const numInputs    = countTag('input')
      const numSelects   = countTag('select')
      const numTextareas = countTag('textarea')
      const numButtons   = countTag('button')
      const numImages    = countTag('img')

      const minHeight = 40                    // padding top+bottom
        + 27                                  // khoi-title
        + (numInputs + numSelects) * 50       // each input/select ~50px
        + numTextareas * 90                   // textarea ~90px
        + numButtons * 50                     // each button ~50px
        + numImages * 100                     // image preview ~100px
        + 20                                  // breathing room

      return {
        id: b.id,
        name: b.name,
        desc: b.desc,
        color: b.color,
        label: b.label,
        required: b.required || false,
        multiToken: b.multiToken || false,
        contractKey: b.contractKey || null,
        contractFields: b.contractFields || null,
        config: b.config || null,
        html,
        minHeight: Math.max(minHeight, 130)   // never smaller than 130px
      }
    })
  }

  get size() { return this._blocks.size }
}

export const blockCache = new BlockCache()
