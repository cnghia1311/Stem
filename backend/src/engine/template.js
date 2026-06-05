/**
 * HTML Shell Template — boilerplate cho app xuất ra
 * Tương tự exportEngine.js cũ nhưng tách riêng
 */

export const getHtmlShell = (config = {}) => {
  const { tokenName = 'STEM', theme = 'dark', layout = 'mobile' } = config
  const maxWidth = layout === 'mobile' ? '375px' : layout === 'tablet' ? '768px' : '100%';
  const containerHeight = layout === 'mobile' ? '667px' : layout === 'tablet' ? '1024px' : '100vh';
  const frameBreakpoint = layout === 'mobile' ? '600px' : layout === 'tablet' ? '1024px' : '9999px';

  return {
    head: `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${tokenName} — Web3 App</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{overflow-x:hidden;scrollbar-width:none;-ms-overflow-style:none;}
body::-webkit-scrollbar{display:none;}
body{font-family:'Segoe UI',sans-serif;min-height:100vh;margin:0;padding:0;width:100vw;
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
border-radius:16px;padding:20px;border-left:4px solid;position:relative;width:100%;height:100%;display:flex;flex-direction:column;}
.khoi-title{font-size:15px;font-weight:700;margin-bottom:12px;}
button{width:100%;padding:12px;border:none;border-radius:10px;color:#fff;font-weight:600;cursor:pointer;font-size:14px;transition:all .2s;}
button:hover{opacity:0.9;transform:translateY(-1px);}
select,input{font-family:inherit;}
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
<div class="app-container" id="app-root">
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
// ── Constraint solver: anchor-based responsive layout ──
(function(){
  function solveConstraints(){
    var root = document.getElementById('app-root');
    if(!root) return;
    var vw = root.clientWidth || window.innerWidth;
    var vh = root.clientHeight || window.innerHeight;
    var blocks = Array.from(root.querySelectorAll('.block-wrapper'));
    var springsX = [];
    var springsY = [];
    
    // Parse all anchors into springs
    blocks.forEach(function(block) {
      var anchorsStr = block.getAttribute('data-anchors');
      if(!anchorsStr || anchorsStr==='{}') return;
      try {
        var anchors = JSON.parse(anchorsStr);
        ['left', 'right'].forEach(function(edge) {
          if(anchors[edge]) {
            var t = anchors[edge].target;
            var tEl = t === 'parent' ? 'parent' : document.getElementById('block-' + t);
            if(tEl) springsX.push({ b1: block, e1: edge, b2: tEl, e2: anchors[edge].targetEdge, dist: anchors[edge].distance, stiffness: anchors[edge].stiffness });
          }
        });
        ['top', 'bottom'].forEach(function(edge) {
          if(anchors[edge]) {
            var t = anchors[edge].target;
            var tEl = t === 'parent' ? 'parent' : document.getElementById('block-' + t);
            if(tEl) springsY.push({ b1: block, e1: edge, b2: tEl, e2: anchors[edge].targetEdge, dist: anchors[edge].distance, stiffness: anchors[edge].stiffness });
          }
        });
      } catch(e){}
    });

    // Run relaxation solver (50 iterations for stable convergence)
    for(var pass=0; pass<50; pass++) {
      var nextLeft = new Map(), countLeft = new Map(), rigidLeft = new Map();
      var nextRight = new Map(), countRight = new Map(), rigidRight = new Map();
      var nextTop = new Map(), countTop = new Map(), rigidTop = new Map();
      var nextBottom = new Map(), countBottom = new Map(), rigidBottom = new Map();

      blocks.forEach(function(b) {
        nextLeft.set(b, 0); countLeft.set(b, 0); rigidLeft.set(b, 0);
        nextRight.set(b, 0); countRight.set(b, 0); rigidRight.set(b, 0);
        nextTop.set(b, 0); countTop.set(b, 0); rigidTop.set(b, 0);
        nextBottom.set(b, 0); countBottom.set(b, 0); rigidBottom.set(b, 0);
      });
      
      springsX.forEach(function(s) {
        var w1 = s.b1.offsetWidth, x1 = parseFloat(s.b1.style.left) || 0;
        var w2 = 0, x2 = 0;
        var weight = 1;
        if(s.stiffness === 'rigid') { weight = 100; }
        else if(s.stiffness === 'flex') { weight = 1; }
        else { weight = s.b2 === 'parent' ? 100 : 1; }

        if(s.b2 === 'parent') { x2 = 0; w2 = vw; }
        else { w2 = s.b2.offsetWidth; x2 = parseFloat(s.b2.style.left) || 0; }
        
        var p1 = s.e1 === 'left' ? x1 : (x1 + w1);
        var p2 = s.e2 === 'left' ? x2 : (x2 + w2);
        
        var targetP1 = p2 + (s.e1 === 'left' ? s.dist : -s.dist);
        var targetP2 = p1 + (s.e1 === 'left' ? -s.dist : s.dist);
        
        if (s.e1 === 'left') {
           nextLeft.set(s.b1, nextLeft.get(s.b1) + targetP1 * weight);
           countLeft.set(s.b1, countLeft.get(s.b1) + weight);
           if (weight >= 100) rigidLeft.set(s.b1, rigidLeft.get(s.b1) + 1);
        } else {
           nextRight.set(s.b1, nextRight.get(s.b1) + targetP1 * weight);
           countRight.set(s.b1, countRight.get(s.b1) + weight);
           if (weight >= 100) rigidRight.set(s.b1, rigidRight.get(s.b1) + 1);
        }
        
        if(s.b2 !== 'parent') {
           if (s.e2 === 'left') {
              nextLeft.set(s.b2, nextLeft.get(s.b2) + targetP2 * weight);
              countLeft.set(s.b2, countLeft.get(s.b2) + weight);
              if (weight >= 100) rigidLeft.set(s.b2, rigidLeft.get(s.b2) + 1);
           } else {
              nextRight.set(s.b2, nextRight.get(s.b2) + targetP2 * weight);
              countRight.set(s.b2, countRight.get(s.b2) + weight);
              if (weight >= 100) rigidRight.set(s.b2, rigidRight.get(s.b2) + 1);
           }
        }
      });
      
      springsY.forEach(function(s) {
        var h1 = s.b1.offsetHeight, y1 = parseFloat(s.b1.style.top) || 0;
        var h2 = 0, y2 = 0;
        var weight = 1;
        if(s.stiffness === 'rigid') { weight = 100; }
        else if(s.stiffness === 'flex') { weight = 1; }
        else { weight = s.b2 === 'parent' ? 100 : 1; }

        if(s.b2 === 'parent') { y2 = 0; h2 = vh; }
        else { h2 = s.b2.offsetHeight; y2 = parseFloat(s.b2.style.top) || 0; }
        
        var p1 = s.e1 === 'top' ? y1 : (y1 + h1);
        var p2 = s.e2 === 'top' ? y2 : (y2 + h2);
        
        var targetP1 = p2 + (s.e1 === 'top' ? s.dist : -s.dist);
        var targetP2 = p1 + (s.e1 === 'top' ? -s.dist : s.dist);
        
        if (s.e1 === 'top') {
           nextTop.set(s.b1, nextTop.get(s.b1) + targetP1 * weight);
           countTop.set(s.b1, countTop.get(s.b1) + weight);
           if (weight >= 100) rigidTop.set(s.b1, rigidTop.get(s.b1) + 1);
        } else {
           nextBottom.set(s.b1, nextBottom.get(s.b1) + targetP1 * weight);
           countBottom.set(s.b1, countBottom.get(s.b1) + weight);
           if (weight >= 100) rigidBottom.set(s.b1, rigidBottom.get(s.b1) + 1);
        }
        
        if(s.b2 !== 'parent') {
           if (s.e2 === 'top') {
              nextTop.set(s.b2, nextTop.get(s.b2) + targetP2 * weight);
              countTop.set(s.b2, countTop.get(s.b2) + weight);
              if (weight >= 100) rigidTop.set(s.b2, rigidTop.get(s.b2) + 1);
           } else {
              nextBottom.set(s.b2, nextBottom.get(s.b2) + targetP2 * weight);
              countBottom.set(s.b2, countBottom.get(s.b2) + weight);
              if (weight >= 100) rigidBottom.set(s.b2, rigidBottom.get(s.b2) + 1);
           }
        }
      });
      
      blocks.forEach(function(b) {
        var isStretchable = b.getAttribute('data-stretchable') === 'true';
        
        var cL = countLeft.get(b), cR = countRight.get(b);
        var rL = rigidLeft.get(b), rR = rigidRight.get(b);
        var origW = parseFloat(b.getAttribute('data-w')) || b.offsetWidth;
        
        if (isStretchable && rL > 0 && rR > 0) {
           var nL = nextLeft.get(b) / cL;
           var nR = nextRight.get(b) / cR;
           b.style.left = nL + 'px';
           b.style.width = Math.max(0, nR - nL) + 'px';
        } else {
           var sumLeft = 0, totalCountX = 0;
           if (cL > 0) { sumLeft += nextLeft.get(b); totalCountX += cL; }
           if (cR > 0) { sumLeft += (nextRight.get(b) - origW * cR); totalCountX += cR; }
           if (totalCountX > 0) { 
             b.style.left = (sumLeft / totalCountX) + 'px'; 
             b.style.width = origW + 'px';
           }
        }

        var cT = countTop.get(b), cB = countBottom.get(b);
        var rT = rigidTop.get(b), rB = rigidBottom.get(b);
        var origH = parseFloat(b.getAttribute('data-h')) || b.offsetHeight;
        
        if (isStretchable && rT > 0 && rB > 0) {
           var nT = nextTop.get(b) / cT;
           var nB = nextBottom.get(b) / cB;
           b.style.top = nT + 'px';
           b.style.height = Math.max(0, nB - nT) + 'px';
        } else {
           var sumTop = 0, totalCountY = 0;
           if (cT > 0) { sumTop += nextTop.get(b); totalCountY += cT; }
           if (cB > 0) { sumTop += (nextBottom.get(b) - origH * cB); totalCountY += cB; }
           if (totalCountY > 0) { 
             b.style.top = (sumTop / totalCountY) + 'px'; 
             b.style.height = origH + 'px';
           }
        }
      });
    }

    // ── Flex Chain Equalization Pass ──
    // After relaxation, find chains of blocks connected by flex wires
    // and distribute space equally among flex links
    function equalizeFlexChains(springs, blocks, totalSize, axis) {
      var isX = axis === 'x';
      var posKey = isX ? 'left' : 'top';
      var sizeKey = isX ? 'offsetWidth' : 'offsetHeight';
      
      // Build adjacency: blockId -> [{block, edge, targetBlock, targetEdge, dist, stiffness}]
      var adj = {};
      var blockById = {};
      blocks.forEach(function(b) { blockById[b.id] = b; });
      
      springs.forEach(function(s) {
        if (s.b2 === 'parent') return; // Handle parent links separately
        var id1 = s.b1.id, id2 = s.b2.id;
        if (!adj[id1]) adj[id1] = [];
        if (!adj[id2]) adj[id2] = [];
        // Determine direction: which block is "before" (left/top) and which is "after" (right/bottom)
        adj[id1].push({ target: id2, spring: s, fromBlock: s.b1, toBlock: s.b2 });
        adj[id2].push({ target: id1, spring: s, fromBlock: s.b2, toBlock: s.b1 });
      });
      
      // Find parent-anchored blocks
      var parentLeft = {}; // blockId -> spring (anchored to parent left/top)
      var parentRight = {}; // blockId -> spring (anchored to parent right/bottom)
      springs.forEach(function(s) {
        if (s.b2 !== 'parent') return;
        var e1 = s.e1, e2 = s.e2;
        var isStart = isX ? (e2 === 'left') : (e2 === 'top');
        var isEnd = isX ? (e2 === 'right') : (e2 === 'bottom');
        if (isStart) parentLeft[s.b1.id] = s;
        if (isEnd) parentRight[s.b1.id] = s;
      });
      
      // Find chains: start from blocks anchored to parent-left/top, follow links
      var visited = {};
      var allBlockIds = blocks.map(function(b) { return b.id; });
      
      allBlockIds.forEach(function(startId) {
        if (visited[startId]) return;
        if (!parentLeft[startId] && !adj[startId]) return;
        
        // Build chain by following adjacency
        var chain = [startId];
        visited[startId] = true;
        var cur = startId;
        
        // Follow forward links
        var moved = true;
        while (moved) {
          moved = false;
          var neighbors = adj[cur] || [];
          for (var i = 0; i < neighbors.length; i++) {
            if (!visited[neighbors[i].target]) {
              visited[neighbors[i].target] = true;
              chain.push(neighbors[i].target);
              cur = neighbors[i].target;
              moved = true;
              break;
            }
          }
        }
        
        if (chain.length < 2) return;
        
        // Sort chain by current position
        chain.sort(function(a, b) {
          var posA = parseFloat(blockById[a].style[posKey]) || 0;
          var posB = parseFloat(blockById[b].style[posKey]) || 0;
          return posA - posB;
        });
        
        // Collect all links in chain order
        var firstId = chain[0], lastId = chain[chain.length - 1];
        var hasParentStart = !!parentLeft[firstId];
        var hasParentEnd = !!parentRight[lastId];
        
        // Only equalize if we have at least one parent anchor
        if (!hasParentStart && !hasParentEnd) return;
        
        // Gather link info between consecutive chain blocks
        var links = []; // [{flex: bool, dist: number}]
        var totalBlockSize = 0;
        var flexCount = 0;
        var rigidSum = 0;
        
        // Parent start link
        if (hasParentStart) {
          var ps = parentLeft[firstId];
          var isFlex = ps.stiffness === 'flex';
          if (isFlex) flexCount++;
          else rigidSum += ps.dist;
          links.push({ type: 'parentStart', flex: isFlex, dist: ps.dist });
        }
        
        // Inter-block links
        for (var i = 0; i < chain.length; i++) {
          totalBlockSize += blockById[chain[i]][sizeKey];
          if (i < chain.length - 1) {
            // Find spring between chain[i] and chain[i+1]
            var found = null;
            var neighbors = adj[chain[i]] || [];
            for (var j = 0; j < neighbors.length; j++) {
              if (neighbors[j].target === chain[i + 1]) {
                found = neighbors[j].spring;
                break;
              }
            }
            if (found) {
              var isFlex = found.stiffness === 'flex' || (!found.stiffness && found.b2 !== 'parent');
              if (isFlex) flexCount++;
              else rigidSum += found.dist;
              links.push({ type: 'inter', flex: isFlex, dist: found.dist, index: i });
            }
          }
        }
        
        // Parent end link
        if (hasParentEnd) {
          var pe = parentRight[lastId];
          var isFlex = pe.stiffness === 'flex';
          if (isFlex) flexCount++;
          else rigidSum += pe.dist;
          links.push({ type: 'parentEnd', flex: isFlex, dist: pe.dist });
        }
        
        if (flexCount === 0) return; // No flex links, nothing to equalize
        
        // Calculate total span
        var spanStart = 0, spanEnd = totalSize;
        if (!hasParentStart) {
          spanStart = parseFloat(blockById[firstId].style[posKey]) || 0;
        }
        if (!hasParentEnd) {
          spanEnd = (parseFloat(blockById[lastId].style[posKey]) || 0) + blockById[lastId][sizeKey];
        }
        var totalSpan = spanEnd - spanStart;
        var remainingSpace = totalSpan - totalBlockSize - rigidSum;
        var flexGap = Math.max(0, remainingSpace / flexCount);
        
        // Position blocks
        var cursor = spanStart;
        var chainIndex = 0;
        for (var li = 0; li < links.length; li++) {
          var link = links[li];
          if (link.type === 'parentStart') {
            cursor += link.flex ? flexGap : link.dist;
          }
          if (link.type === 'parentStart' || (li === 0 && link.type === 'inter')) {
            // Position first block
            blockById[chain[0]].style[posKey] = cursor + 'px';
            cursor += blockById[chain[0]][sizeKey];
            chainIndex = 1;
          }
          if (link.type === 'inter') {
            cursor += link.flex ? flexGap : link.dist;
            blockById[chain[chainIndex]].style[posKey] = cursor + 'px';
            cursor += blockById[chain[chainIndex]][sizeKey];
            chainIndex++;
          }
        }
      });
    }
    
    equalizeFlexChains(springsX, blocks, vw, 'x');
    equalizeFlexChains(springsY, blocks, vh, 'y');
  }
  document.addEventListener('DOMContentLoaded',solveConstraints);
  window.addEventListener('resize',solveConstraints);
  solveConstraints();
})();
</script>
`
  }
}
