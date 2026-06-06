/**
 * HTML Shell Template — boilerplate cho app xuất ra
 * Tương tự exportEngine.js cũ nhưng tách riêng
 */

export const getHtmlShell = (config = {}) => {
  const { tokenName = 'STEM', theme = 'dark', layout = 'mobile', hasMobileLayout = true } = config
  const maxWidth = layout === 'mobile' ? '375px' : layout === 'tablet' ? '768px' : '100%';
  const containerHeight = layout === 'mobile' ? '667px' : layout === 'tablet' ? '1024px' : '100vh';
  const frameBreakpoint = layout === 'mobile' ? '600px' : layout === 'tablet' ? '1024px' : '9999px';

  // Viewport tiêu chuẩn, việc co dãn sẽ được xử lý bằng JS Auto-Scaler
  const viewportContent = 'width=device-width, initial-scale=1.0';

  return {
    head: `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="${viewportContent}">
<title>${tokenName} — Web3 App</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{overflow-x:hidden;scrollbar-width:none;-ms-overflow-style:none;}
body::-webkit-scrollbar{display:none;}
body{font-family:'Segoe UI',sans-serif;min-height:100vh;margin:0;padding:0;width:100%;
${theme === 'dark'
        ? 'background:linear-gradient(135deg,#0f172a,#1e293b);color:#e2e8f0;'
        : theme === 'neon'
          ? 'background:linear-gradient(135deg,#0a0015,#1a0030);color:#e0d0ff;'
          : 'background:#f0f4f8;color:#1e293b;'
      }}
.app-container{
  width:100%;
  max-width:100%;
  min-height:100vh;
  margin:0;
  padding:0;
  position:relative;
  overflow:hidden;
  background: inherit;
}
@media (min-width: ${frameBreakpoint}) {
  .app-container {
    max-width: ${maxWidth};
    height: ${containerHeight};
    min-height: auto;
    margin: 40px auto;
    border-radius: ${layout === 'mobile' ? '40px' : '24px'};
    border: 12px solid ${theme === 'dark' || theme === 'neon' ? '#0b1120' : '#e2e8f0'};
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  }
}
.tab-bar{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:8px;border-radius:99px;z-index:1000;max-width:90%;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none;
${theme === 'dark' || theme === 'neon'
        ? 'background:rgba(15,23,42,0.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 40px rgba(0,0,0,0.5);'
        : 'background:rgba(255,255,255,0.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,0,0,0.05);box-shadow:0 10px 40px rgba(0,0,0,0.1);'
      }}
.tab-bar::-webkit-scrollbar{display:none;}
.tab-btn{padding:10px 24px;border:none;border-radius:99px;cursor:pointer;font-size:14px;font-weight:600;white-space:nowrap;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);background:transparent;
${theme === 'dark' || theme === 'neon' ? 'color:#94a3b8;' : 'color:#64748b;'}
}
.tab-btn:hover{
${theme === 'dark' || theme === 'neon' ? 'color:#fff;background:rgba(255,255,255,0.05);' : 'color:#0f172a;background:rgba(0,0,0,0.03);'}
}
.tab-btn.active{
${theme === 'dark'
        ? 'background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 4px 15px rgba(99,102,241,0.4);'
        : theme === 'neon'
          ? 'background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;box-shadow:0 4px 15px rgba(236,72,153,0.4);'
          : 'background:#6366f1;color:#fff;box-shadow:0 4px 15px rgba(99,102,241,0.3);'
      }}
.tab-content{display:none;animation:fadeIn 0.4s ease forwards;}
.tab-content.active{display:block;}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.row{display:grid;gap:12px;margin-bottom:12px;}
.row-1{grid-template-columns:1fr;}
.row-2{grid-template-columns:1fr 1fr;}
.row-3{grid-template-columns:1fr 1fr 1fr;}
.khoi{
${theme === 'dark'
        ? 'background:rgba(30,41,59,0.8);border:1px solid #334155;'
        : theme === 'neon'
          ? 'background:rgba(20,0,50,0.6);border:1px solid rgba(139,92,246,0.3);'
          : 'background:#ffffff;border:1px solid #e2e8f0;'
      }
border-radius:16px;padding:20px;border-left:4px solid;position:absolute;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;overflow:hidden;}
.khoi>*{flex-shrink:0;}
.khoi-title{font-size:15px;font-weight:700;margin-bottom:12px;}
.khoi p{font-size:13px;margin-bottom:10px;}
button{width:100%;padding:12px;border:none;border-radius:10px;color:#fff;font-weight:600;cursor:pointer;font-size:14px;transition:all .2s;}
button:hover{opacity:0.9;transform:translateY(-1px);}
select,input{font-family:inherit;width:100%;padding:10px;font-size:13px;border-radius:8px;}
.toast-container{position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;}
.toast{padding:12px 20px;border-radius:10px;color:#fff;font-size:13px;font-weight:500;opacity:0;transform:translateX(100px);animation:toastIn .3s ease forwards;}
.toast.success{background:linear-gradient(135deg,#10b981,#34d399);}
.toast.error{background:linear-gradient(135deg,#ef4444,#f87171);}
.toast.info{background:linear-gradient(135deg,#3b82f6,#60a5fa);}
@keyframes toastIn{to{opacity:1;transform:translateX(0);}}
</style>
</head>
<body>
<div class="toast-container" id="toast-container"></div>
<div class="app-container" id="app-root" data-design-w="${layout === 'mobile' ? 375 : 1280}" data-design-h="${layout === 'mobile' ? 667 : 800}">
`,

    foot: `
</div>
<script>
let provider,signer,userAddr;
function toast(type,msg){
  const c=document.getElementById('toast-container');
  const d=document.createElement('div');d.className='toast '+type;d.textContent=msg;
  c.appendChild(d);setTimeout(()=>d.remove(),3500);
}

// ── Universal Auto-Scaler (Desktop & Mobile) ──
(function() {
  function autoScale() {
    var root = document.getElementById('app-root');
    if (!root) return;
    
    var vw = window.innerWidth;
    var hasMobileLayout = ${hasMobileLayout ? 'true' : 'false'};
    var isMobileView = hasMobileLayout && vw <= 600;
    var designW = isMobileView ? 375 : 1280;
    var minSafeWidth = isMobileView ? 320 : 1024;
    
    var scale, targetWidth;
    if (vw >= designW) {
        // Màn to hơn thiết kế: Giãn chun tối đa
        scale = 1;
        targetWidth = '100%';
    } else if (vw >= minSafeWidth) {
        // Màn hơi hẹp: Co dây chun, khối giữ nguyên
        scale = 1;
        targetWidth = '100%';
    } else {
        // Màn quá hẹp: Thu nhỏ khối để tránh đụng xe
        scale = vw / minSafeWidth;
        targetWidth = minSafeWidth + 'px';
    }
    
    root.style.width = targetWidth;
    root.style.maxWidth = 'none';
    root.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';
    root.style.transformOrigin = 'top left';
    root.style.margin = '0'; 
    
    var designH = parseFloat(getComputedStyle(root).getPropertyValue('--design-h')) || (isMobileView ? 667 : 800);
    
    root.style.minHeight = designH + 'px';
    if (scale < 1) {
        root.style.marginBottom = -(designH - designH * scale) + 'px';
    } else {
        root.style.marginBottom = '0px';
    }
    
    var tabs = root.querySelectorAll('.tab-content');
    tabs.forEach(t => {
      t.style.width = targetWidth;
      t.style.minHeight = designH + 'px';
      t.style.overflow = 'visible';
    });
    
    document.body.style.minHeight = (designH * scale) + 'px';
  }
  window.addEventListener('resize', autoScale);
  autoScale();
  setTimeout(autoScale, 100);
})();
</script>
`
  }
}
