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

    // Quét toàn bộ tabs xem có bất kỳ khối nào có mobile layout không
    const globalHasMobileLayout = tabs.some(tab =>
      (tab.blocks || []).some(b => b.layouts && b.layouts.mobile)
    )

    const shell = getHtmlShell({ ...config, tokenName, hasMobileLayout: globalHasMobileLayout })

    let bodyHtml = '';
    let maxDesktopH = 800;
    let maxMobileH = 667;

    tabs.forEach(tab => {
      const tabDesktopH = 800 + (tab.extraHeight?.desktop || 0);
      const tabMobileH = 667 + (tab.extraHeight?.mobile || 0);
      if (tabDesktopH > maxDesktopH) maxDesktopH = tabDesktopH;
      if (tabMobileH > maxMobileH) maxMobileH = tabMobileH;

      (tab.blocks || []).forEach(block => {
        let desktop = block.layouts?.desktop;
        if (!desktop && block.position) {
          desktop = { position: block.position, size: block.size, anchors: block.anchors };
        }
      });
    });

    let layoutStyles = `
#app-root { --design-w: 1280; --design-h: ${maxDesktopH}; }
@media (max-width: 600px) { #app-root { --design-w: 375; --design-h: ${maxMobileH}; } }
`
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
      const deviceW = deviceLayout === 'desktop' ? 1280 : 375
      const deviceH = deviceLayout === 'desktop' ? 800 : 667
      bodyHtml += `<div class="tab-content${tabIdx === 0 ? ' active' : ''}" id="tab-${tabIdx}" style="position: relative; width: 100%; min-height: 100vh; background: transparent;">\n`

      const blocks = tab.blocks || []
      const hasMobileLayout = blocks.some(b => b.layouts && b.layouts.mobile)
      const hasDesktopLayout = blocks.some(b => b.layouts && b.layouts.desktop)

      // Viewport fallback đã được xử lý ở template.js (HEAD)
      
      if (!hasDesktopLayout && hasMobileLayout) {
        // Nếu chỉ thiết kế mobile mà bỏ quên desktop, mô phỏng giao diện điện thoại giữa màn hình máy tính
        layoutStyles += `@media (min-width: 601px) { #tab-${tabIdx} { max-width: 375px; margin: 0 auto; border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #0f172a; } }\n`
      }

      for (const block of blocks) {
        const blockId = block.id
        const instanceId = block.instanceId || blockId

        let layouts = block.layouts
        if (!layouts || Object.keys(layouts).length === 0) {
          layouts = {
            desktop: {
              position: block.position || { x: 0, y: 0 },
              size: block.size || { width: 200, height: 50 }
            }
          }
        }

        let desk = layouts.desktop
        if (!hasDesktopLayout && layouts.mobile) {
           desk = layouts.mobile // Mượn tạm layout mobile làm nền tảng
        }

        const buildPosCss = (lay, parentW, parentH, isMobile = false) => {
          let s = `{ ${isMobile ? 'display: block !important; ' : ''}position: absolute; `
          if (lay.anchors) {
            let hasL = false, hasR = false, hasT = false, hasB = false;
            if (lay.anchors.left && lay.anchors.left.target === 'parent') { s += `left: ${lay.anchors.left.distance}px; `; hasL = true; }
            if (lay.anchors.right && lay.anchors.right.target === 'parent') { s += `right: ${lay.anchors.right.distance}px; `; hasR = true; }
            if (!hasL && !hasR) s += `left: ${(lay.position.x / parentW * 100).toFixed(4)}%; `

            if (lay.anchors.top && lay.anchors.top.target === 'parent') { s += `top: ${lay.anchors.top.distance}px; `; hasT = true; }
            if (lay.anchors.bottom && lay.anchors.bottom.target === 'parent') { s += `bottom: ${lay.anchors.bottom.distance}px; `; hasB = true; }
            if (!hasT && !hasB) s += `top: ${(lay.position.y / parentH * 100).toFixed(4)}%; `
            
            s += `width: ${hasL && hasR ? 'auto' : lay.size.width + 'px'}; `
            s += `height: ${hasT && hasB ? 'auto' : lay.size.height + 'px'}; `
          } else {
            s += `left: ${(lay.position.x / parentW * 100).toFixed(4)}%; top: ${(lay.position.y / parentH * 100).toFixed(4)}%; width: ${lay.size.width}px; height: ${lay.size.height}px; `
          }
          return s + '}'
        }

        const tabDesktopH = 800 + (tab.extraHeight?.desktop || 0);
        const tabMobileH = 667 + (tab.extraHeight?.mobile || 0);

        if (desk) {
          layoutStyles += `#block-${instanceId} ${buildPosCss(desk, 1280, tabDesktopH)}\n`
        } else {
          layoutStyles += `#block-${instanceId} { display: none; }\n`
        }

        if (layouts.mobile) {
          layoutStyles += `@media (max-width: 600px) { #block-${instanceId} ${buildPosCss(layouts.mobile, 375, tabMobileH, true)} }\n`
        } else if (hasMobileLayout) {
          // Chỉ giấu khối trên Mobile nếu thực sự có ít nhất 1 khối được xếp trên Mobile
          layoutStyles += `@media (max-width: 600px) { #block-${instanceId} { display: none !important; } }\n`
        }

        bodyHtml += `  <div class="block-wrapper" id="block-${instanceId}">\n`

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
            innerHtml += `<span style="z-index:10; ${layout === 'bg-image' ? 'text-shadow:0 2px 4px rgba(0,0,0,0.8);' : ''}">${text}</span>`

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

    const fullHtml = shell.head.replace('</head>', '<style id="responsive-layouts">\n' + layoutStyles + '</style>\n</head>')
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
