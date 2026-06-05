/**
 * Assembler — Nối HTML hoàn chỉnh từ project data
 * GỌI HÀM trực tiếp trên block objects (không đọc string templates)
 */
import { getHtmlShell } from './template.js'

class Assembler {
  /**
   * Build full HTML từ project data
   * @param {Array} tabs - Mảng tab, mỗi tab có { id, name, rows: [{ id, columns, blocks: ["wallet", "balance", null] }] }
   * @param {Object} config - Cấu hình app { title, theme, layout, tokenName }
   * @param {Object} contracts - Contract addresses { balance: { tokenAddress: "0x..." }, ... }
   * @param {BlockCache} cache - Block cache instance
   */
  buildFullHtml(tabs, config, contracts, cache) {
    const tokenName = config.tokenName || config.title || 'STEM'
    const shell = getHtmlShell({ ...config, tokenName })

    let bodyHtml = ''
    const engineParts = []
    const globalParts = []
    const bindingParts = []
    const usedBlockIds = new Set()

    // ═══ Tab bar ═══
    if (tabs.length > 1 && config.showTabBar !== false) {
      bodyHtml += '<div class="tab-bar">\n'
      tabs.forEach((tab, i) => {
        bodyHtml += `  <button class="tab-btn${i === 0 ? ' active' : ''}" onclick="switchTab(${i})">${tab.name}</button>\n`
      })
      bodyHtml += '</div>\n'
    }

    // ═══ Từng tab ═══
    tabs.forEach((tab, tabIdx) => {
      // Container of each tab needs position: relative to hold absolute blocks
      // We assume a default canvas height of 800px for now, can be responsive later
      const deviceLayout = config.layout || 'desktop'
      const deviceW = deviceLayout === 'desktop' ? 1280 : deviceLayout === 'tablet' ? 768 : 375
      const deviceH = deviceLayout === 'desktop' ? 800 : deviceLayout === 'tablet' ? 1024 : 667
      bodyHtml += `<div class="tab-content${tabIdx === 0 ? ' active' : ''}" id="tab-${tabIdx}" style="position: relative; width: 100%; min-height: 100vh; background: transparent;">\n`

      const blocks = tab.blocks || []
      for (const block of blocks) {
        const blockId = block.id
        const pos = block.position || { x: 0, y: 0 }
        const size = block.size || { width: 200, height: 50 }
        const isStretchable = block.category === "Decorative" || block.category === "Layout/Navigation";
        
        // Wrapper for Absolute Positioning
        const wrapperStyle = `position: absolute; left: ${pos.x}px; top: ${pos.y}px; width: ${size.width}px; height: ${size.height}px;`
        const instanceId = block.instanceId || blockId
        const anchorsJson = JSON.stringify(block.anchors || {})
        bodyHtml += `  <div class="block-wrapper" id="block-${instanceId}" data-anchors='${anchorsJson}' data-default-x="${pos.x}" data-default-y="${pos.y}" data-w="${size.width}" data-h="${size.height}" data-stretchable="${isStretchable}" style="${wrapperStyle}">\n`

        if (block.blockType === 'decorative') {
          // Render decorative blocks (text, containers) based on frontend data
          if (block.html) {
             bodyHtml += `    ${block.html}\n`
          } else if (blockId === 'text-title') {
             bodyHtml += `    <h2 style="margin:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-size: 24px;">${block.title || 'Text'}</h2>\n`
          } else {
             bodyHtml += `    <div style="width:100%; height:100%; background:rgba(255,255,255,0.1); border-radius:12px;"></div>\n`
          }
        } else {
          // Xử lý Dynamic Link Blocks
          if (blockId.startsWith('link-') || blockId === 'link-button') {
            const config = contracts?.[blockId] || {}
            const text = config.buttonText || block.title || 'Link Button'
            const img = config.buttonImage || ''
            const layout = config.buttonLayout || 'icon-left'
            const bgColor = config.buttonColor || (layout === 'bg-image' && img ? 'transparent' : '#0ea5e9')

            // Target tab logic
            let targetTabId = blockId.replace('link-to-', '')
            let targetIdx = tabs.findIndex(t => t.id === targetTabId)
            if (targetIdx === -1) targetIdx = 0

            const flexDir = layout === 'icon-right' ? 'row-reverse' : layout === 'icon-top' ? 'column' : layout === 'icon-bottom' ? 'column-reverse' : 'row'
            const bgStyle = layout === 'bg-image' && img ? `url(${img}) center/cover no-repeat` : bgColor

            let innerHtml = ''
            if (layout !== 'bg-image' && img) {
              innerHtml += `<img src="${img}" style="width:24px;height:24px;object-fit:contain;" />`
            }
            innerHtml += `<span style="z-index:10; ${layout==='bg-image' ? 'text-shadow:0 2px 4px rgba(0,0,0,0.8);' : ''}">${text}</span>`

            const buttonHtml = `
              <button onclick="switchTab(${targetIdx})" style="width:100%;height:100%;border:none;border-radius:8px;cursor:pointer;color:white;font-weight:bold;display:flex;align-items:center;justify-content:center;gap:8px;flex-direction:${flexDir};background:${bgStyle};transition:all 0.2s;">
                ${innerHtml}
              </button>
            `
            bodyHtml += `    ${buttonHtml}\n`
          } else {
            // Logic block from backend cache
            const cachedBlock = cache.getBlock(blockId)

            if (cachedBlock && cachedBlock.exportHtml) {
              // Lấy contract data cho block này
              const contractData = contracts?.[blockId] || {}
              const tokenList = contractData.tokenAddress ? [contractData.tokenAddress] : (contractData.tokens || [])

              // Gọi HÀM exportHtml — truyền tham số đúng chuẩn
              let blockHtml = typeof cachedBlock.exportHtml === 'function'
                ? cachedBlock.exportHtml(tokenName, tokenList.length > 0 ? tokenList : contractData)
                : cachedBlock.exportHtml

              // Inject Custom UI
              if (contractData.buttonColor) {
                blockHtml = blockHtml.replace(/background:[^;]+;/g, `background:${contractData.buttonColor} !important;`)
              }
              if (contractData.buttonText) {
                blockHtml = blockHtml.replace(/<button[^>]*>([^<]*)<\/button>/, (m, p1) => m.replace(p1, contractData.buttonText))
                blockHtml = blockHtml.replace(/<div class="pv-btn"[^>]*>([^<]*)<\/div>/, (m, p1) => m.replace(p1, contractData.buttonText))
              }

              bodyHtml += blockHtml + '\n'

            // Thu thập engine code
            if (cachedBlock.engineCode && !usedBlockIds.has(blockId + '-engine')) {
              usedBlockIds.add(blockId + '-engine')
              const code = typeof cachedBlock.engineCode === 'function'
                ? cachedBlock.engineCode('')
                : cachedBlock.engineCode
              if (code) engineParts.push(code)
            }

            // Thu thập global code
            if (cachedBlock.globalCode && !usedBlockIds.has(blockId + '-global')) {
              usedBlockIds.add(blockId + '-global')
              const code = typeof cachedBlock.globalCode === 'function'
                ? cachedBlock.globalCode()
                : cachedBlock.globalCode
              if (code) globalParts.push(code)
            }

            // Thu thập bindings
            if (cachedBlock.bindings && !usedBlockIds.has(blockId + '-bind')) {
              usedBlockIds.add(blockId + '-bind')
              cachedBlock.bindings.forEach(b => {
                const event = b.event || 'click'
                bindingParts.push(`document.getElementById('${b.btn}')?.addEventListener('${event}',${b.fn});`)
              })
            }
            } else {
              bodyHtml += `    <div class="khoi" style="border-left-color:#666;opacity:0.5;"><div class="khoi-title">⚠️ Block not found: ${blockId}</div></div>\n`
            }
          }
        }
        
        bodyHtml += `  </div>\n` // close block-wrapper
      }

      bodyHtml += '</div>\n' // close tab-content
    })

    // ═══ Tab switching script ═══
    const tabScript = tabs.length > 1
      ? `\nfunction switchTab(idx){
  document.querySelectorAll('.tab-content').forEach((t,i)=>{t.classList.toggle('active',i===idx);});
  document.querySelectorAll('.tab-btn').forEach((b,i)=>{b.classList.toggle('active',i===idx);});
}\n`
      : ''

    // ═══ Nối tất cả ═══
    const fullHtml = shell.head
      + bodyHtml
      + shell.foot
      + '\n<script>\n'
      + '// ═══ GLOBAL CODE ═══\n'
      + globalParts.join('\n')
      + '\n// ═══ ENGINE CODE ═══\n'
      + engineParts.join('\n')
      + '\n// ═══ TAB SWITCHING ═══\n'
      + tabScript
      + '\n// ═══ BINDINGS ═══\n'
      + bindingParts.join('\n')
      + '\n</script>\n</body>\n</html>'

    return fullHtml
  }
}

export const assembler = new Assembler()
