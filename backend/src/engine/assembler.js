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
    const globalHasDesktopLayout = tabs.some(tab =>
      (tab.blocks || []).some(b => b.layouts && b.layouts.desktop)
    )

    const shell = getHtmlShell({ ...config, tokenName, hasMobileLayout: globalHasMobileLayout, hasDesktopLayout: globalHasDesktopLayout })

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

    let fixedHtml = ''

    // ═══ Từng tab ═══
    tabs.forEach((tab, tabIdx) => {
      const tabDesktopH = 800 + (tab.extraHeight?.desktop || 0);
      const tabMobileH = 667 + (tab.extraHeight?.mobile || 0);

      // Container of each tab needs position: relative to hold absolute blocks
      // We assume a default canvas height of 800px for now, can be responsive later
      const deviceLayout = config.layout || 'desktop'
      const deviceW = deviceLayout === 'desktop' ? 1280 : 375
      const deviceH = deviceLayout === 'desktop' ? 800 : 667
      bodyHtml += `<div class="tab-content${tabIdx === 0 ? ' active' : ''}" id="tab-${tabIdx}" style="position: relative; width: 100%; min-height: ${deviceLayout === 'desktop' ? tabDesktopH : tabMobileH}px; background: transparent;">\n`
      fixedHtml += `<div class="fixed-tab-content${tabIdx === 0 ? ' active' : ''}" id="fixed-tab-${tabIdx}" style="display:${tabIdx === 0 ? 'block' : 'none'}; width: 100%; height: 100%; position: relative;">\n`
      
      layoutStyles += `#tab-${tabIdx} { min-height: ${tabDesktopH}px; }\n`
      layoutStyles += `@container (max-width: 600px) { #tab-${tabIdx} { min-height: ${tabMobileH}px; } }\n`

      const blocks = tab.blocks || []
      const hasMobileLayout = blocks.some(b => b.layouts && b.layouts.mobile)
      const hasDesktopLayout = blocks.some(b => b.layouts && b.layouts.desktop)

      // Viewport fallback đã được xử lý ở template.js (HEAD)
      
      if (!hasDesktopLayout && hasMobileLayout) {
        // Fallback is handled by template.js forcing Phone Frame now!
        // Just ensure background is correct
        layoutStyles += `@media (min-width: 601px) { #tab-${tabIdx} { max-width: 375px; margin: 0 auto; overflow: hidden; } }\n`
      }

      const buildBlock = (block, parentBlock = null, isFixedTree = false) => {
        const blockId = block.id
        const instanceId = block.instanceId || blockId
        const currentIsFixed = isFixedTree || !!block.isFixed

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

        let parentW = 1280;
        let parentH = currentIsFixed ? 800 : tabDesktopH;
        let mobileParentW = 375;
        let mobileParentH = currentIsFixed ? 667 : tabMobileH;

        if (parentBlock) {
           parentW = parentBlock.size?.width || 1280;
           parentH = parentBlock.size?.height || tabDesktopH;
           if (parentBlock.layouts?.mobile) {
              mobileParentW = parentBlock.layouts.mobile.size?.width || 375;
              mobileParentH = parentBlock.layouts.mobile.size?.height || tabMobileH;
           } else {
              mobileParentW = parentW;
              mobileParentH = parentH;
           }
        }

        const buildPosCss = (lay, pW, pH, isMobile = false) => {
          let s = `{ ${isMobile ? 'display: block !important; ' : ''}position: absolute; `
          
          let relX = lay.position.x;
          let relY = lay.position.y;
          
          if (parentBlock) {
             const pLay = isMobile && parentBlock.layouts?.mobile ? parentBlock.layouts.mobile : (parentBlock.layouts?.desktop || {position: parentBlock.position || {x:0, y:0}});
             relX = lay.position.x - pLay.position.x;
             relY = lay.position.y - pLay.position.y;
          }

          if (lay.anchors) {
            let hasL = false, hasR = false, hasT = false, hasB = false;
            if (lay.anchors.left && lay.anchors.left.target === 'parent') { s += `left: ${lay.anchors.left.distance}px; `; hasL = true; }
            if (lay.anchors.right && lay.anchors.right.target === 'parent') { s += `right: ${lay.anchors.right.distance}px; `; hasR = true; }
            if (!hasL && !hasR) {
              const centerX = relX + (lay.size.width / 2);
              if (centerX > pW / 2) {
                const distR = pW - (relX + lay.size.width);
                s += `right: ${(distR / pW * 100).toFixed(4)}%; `;
                s += `max-width: calc(100% - ${(distR / pW * 100).toFixed(4)}%); `;
              } else {
                s += `left: ${(relX / pW * 100).toFixed(4)}%; `;
                s += `max-width: calc(100% - ${(relX / pW * 100).toFixed(4)}%); `;
              }
            }

            if (lay.anchors.top && lay.anchors.top.target === 'parent') { s += `top: ${lay.anchors.top.distance}px; `; hasT = true; }
            if (lay.anchors.bottom && lay.anchors.bottom.target === 'parent') { s += `bottom: ${lay.anchors.bottom.distance}px; `; hasB = true; }
            if (!hasT && !hasB) {
              const centerY = relY + (lay.size.height / 2);
              if (centerY > pH / 2) {
                const distB = pH - (relY + lay.size.height);
                s += `bottom: ${(distB / pH * 100).toFixed(4)}%; `
              } else {
                s += `top: ${(relY / pH * 100).toFixed(4)}%; `
              }
            }
            
            s += `width: ${hasL && hasR ? 'auto' : lay.size.width + 'px'}; `
            s += `height: ${hasT && hasB ? 'auto' : lay.size.height + 'px'}; `
            
            // Add max-width to prevent overflow
            if (hasL && !hasR) {
              s += `max-width: calc(100% - ${lay.anchors.left.distance}px); `
            } else if (hasR && !hasL) {
              s += `max-width: calc(100% - ${lay.anchors.right.distance}px); `
            }
          } else {
            const centerX = relX + (lay.size.width / 2);
            const centerY = relY + (lay.size.height / 2);
            let hPos, vPos, maxW;
            
            if (centerX > pW / 2) {
              const distR = pW - (relX + lay.size.width);
              hPos = `right: ${(distR / pW * 100).toFixed(4)}%;`;
              maxW = `max-width: calc(100% - ${(distR / pW * 100).toFixed(4)}%);`;
            } else {
              hPos = `left: ${(relX / pW * 100).toFixed(4)}%;`;
              maxW = `max-width: calc(100% - ${(relX / pW * 100).toFixed(4)}%);`;
            }
            
            if (centerY > pH / 2) {
              const distB = pH - (relY + lay.size.height);
              vPos = `bottom: ${(distB / pH * 100).toFixed(4)}%;`;
            } else {
              vPos = `top: ${(relY / pH * 100).toFixed(4)}%;`;
            }
            
            s += `${hPos} ${vPos} width: ${lay.size.width}px; height: ${lay.size.height}px; ${maxW} `
          }
          return s + '}'
        }

        if (desk) {
          layoutStyles += `#block-${instanceId} ${buildPosCss(desk, parentW, parentH)}\n`
        } else {
          layoutStyles += `#block-${instanceId} { display: none; }\n`
        }

        if (layouts.mobile) {
          layoutStyles += `@container (max-width: 600px) { #block-${instanceId} ${buildPosCss(layouts.mobile, mobileParentW, mobileParentH, true)} }\n`
        } else if (hasMobileLayout) {
          layoutStyles += `@container (max-width: 600px) { #block-${instanceId} { display: none !important; } }\n`
        }

        let blockHtmlStr = `  <div class="block-wrapper" id="block-${instanceId}">\n`

        if (block.blockType === 'decorative') {
          if (block.html) {
            blockHtmlStr += `    ${block.html}\n`
          } else if (blockId === 'text-title') {
            blockHtmlStr += `    <h2 style="margin:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-size: 24px;">${block.title || 'Text'}</h2>\n`
          } else {
            blockHtmlStr += `    <div style="width:100%; height:100%; background:rgba(255,255,255,0.1); border-radius:12px;"></div>\n`
          }
        } else {
          if (blockId.startsWith('link-') || blockId === 'link-button') {
            const config = contracts?.[blockId] || {}
            const text = config.buttonText || block.title || 'Link Button'
            const img = config.buttonImage || ''
            const layout = config.buttonLayout || 'icon-left'
            const bgColor = config.buttonColor || (layout === 'bg-image' && img ? 'transparent' : '#0ea5e9')

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
            blockHtmlStr += `    ${buttonHtml}\n`
          } else {
            const cachedBlock = cache.getBlock(blockId)
            if (cachedBlock && cachedBlock.exportHtml) {
              const contractData = contracts?.[blockId] || {}
              const tokenList = contractData.tokenAddress ? [contractData.tokenAddress] : (contractData.tokens || [])
              let blockHtml = typeof cachedBlock.exportHtml === 'function'
                ? cachedBlock.exportHtml(tokenName, tokenList.length > 0 ? tokenList : contractData)
                : cachedBlock.exportHtml

              if (contractData.buttonColor) {
                blockHtml = blockHtml.replace(/background:[^;]+;/g, `background:${contractData.buttonColor} !important;`)
              }
              if (contractData.buttonText) {
                blockHtml = blockHtml.replace(/<button[^>]*>([^<]*)<\/button>/, (m, p1) => m.replace(p1, contractData.buttonText))
                blockHtml = blockHtml.replace(/<div class="pv-btn"[^>]*>([^<]*)<\/div>/, (m, p1) => m.replace(p1, contractData.buttonText))
              }
              blockHtmlStr += blockHtml + '\n'

              if (cachedBlock.engineCode && !usedBlockIds.has(blockId + '-engine')) {
                usedBlockIds.add(blockId + '-engine')
                const code = typeof cachedBlock.engineCode === 'function' ? cachedBlock.engineCode('') : cachedBlock.engineCode
                if (code) engineParts.push(code)
              }

              if (cachedBlock.globalCode && !usedBlockIds.has(blockId + '-global')) {
                usedBlockIds.add(blockId + '-global')
                const code = typeof cachedBlock.globalCode === 'function' ? cachedBlock.globalCode() : cachedBlock.globalCode
                if (code) globalParts.push(code)
              }

              if (cachedBlock.bindings && !usedBlockIds.has(blockId + '-bind')) {
                usedBlockIds.add(blockId + '-bind')
                cachedBlock.bindings.forEach(b => {
                  const event = b.event || 'click'
                  bindingParts.push(`document.getElementById('${b.btn}')?.addEventListener('${event}',${b.fn});`)
                })
              }
            } else {
              blockHtmlStr += `    <div class="khoi" style="border-left-color:#666;opacity:0.5;"><div class="khoi-title">⚠️ Block not found: ${blockId}</div></div>\n`
            }
          }
        }

        if (blockId === 'container' || (block.blockType === 'decorative' && block.id === 'container')) {
           const children = blocks.filter(b => b.parentId === instanceId);
           children.forEach(child => {
             blockHtmlStr += buildBlock(child, block, currentIsFixed);
           });
        }

        blockHtmlStr += `  </div>\n` // close block-wrapper
        return blockHtmlStr;
      }

      const topLevelBlocks = blocks.filter(b => !b.parentId);
      topLevelBlocks.forEach(b => {
        const html = buildBlock(b, null, false);
        if (b.isFixed) {
          fixedHtml += html;
        } else {
          bodyHtml += html;
        }
      });

      bodyHtml += '</div>\n' // close tab-content
      fixedHtml += '</div>\n' // close fixed-tab-content
    })

    // ═══ Tab switching script ═══
    const tabScript = tabs.length > 1
      ? `\nfunction switchTab(idx){
  document.querySelectorAll('.tab-content').forEach((t,i)=>{t.classList.toggle('active',i===idx);});
  document.querySelectorAll('.fixed-tab-content').forEach((t,i)=>{t.style.display=i===idx?'block':'none';});
  document.querySelectorAll('.tab-btn').forEach((b,i)=>{b.classList.toggle('active',i===idx);});
}\n`
      : ''

    let fullHtml = shell.head.replace('</head>', '<style id="responsive-layouts">\n' + layoutStyles + '</style>\n</head>')
      + bodyHtml
      + shell.foot
      
    // Inject fixedHtml into FIXED_TABS_INJECTED_HERE
    fullHtml = fullHtml.replace('<!-- FIXED_TABS_INJECTED_HERE -->', fixedHtml)
      
    fullHtml += '\n<script>\n'
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
