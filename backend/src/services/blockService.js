import { blockCache } from '../engine/blockCache.js'

/**
 * Lấy danh sách metadata nhẹ (~2KB) — không cần auth
 * Sidebar dùng để hiển thị danh sách block
 */
const getMetadata = async () => {
  return blockCache.getAllMeta()
}

/**
 * Lấy code (exportHtml, engineCode, globalCode) của nhiều block cùng lúc
 * Dùng khi export hoặc preview
 */
const getBatchCode = async (blockIds) => {
  const result = {}

  for (const id of blockIds) {
    const block = blockCache.getBlock(id)
    if (block) {
      const html = typeof block.exportHtml === 'function' ? block.exportHtml('Token', {}) : (block.exportHtml || '')
      result[id] = {
        exportHtml: html,
        engineCode: typeof block.engineCode === 'function' ? block.engineCode('') : (block.engineCode || ''),
        globalCode: typeof block.globalCode === 'function' ? block.globalCode() : (block.globalCode || '')
      }
    }
  }

  return result
}

export const blockService = {
  getMetadata,
  getBatchCode
}
