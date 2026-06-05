"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Rnd } from "react-rnd"
import { type Block, categoryColors } from "./block-data"
import { Settings, X, Minus, Plus, Maximize2 } from "lucide-react"

export type AnchorTarget = 'parent' | string;
export type AnchorEdge = 'top' | 'right' | 'bottom' | 'left';

export interface BlockAnchor {
  target: AnchorTarget;
  targetEdge: AnchorEdge;
  distance: number;
  stiffness?: 'flex' | 'rigid';
}

export interface BlockAnchors {
  top?: BlockAnchor;
  right?: BlockAnchor;
  bottom?: BlockAnchor;
  left?: BlockAnchor;
}

export interface CanvasBlock extends Block {
  instanceId: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  html?: string
  anchors?: BlockAnchors
}

interface WysiwygCanvasProps {
  placedBlocks: CanvasBlock[]
  selectedBlockId: string | null
  onSelectBlock: (id: string | null) => void
  onRemoveBlock: (id: string) => void
  onConfigureBlock: (id: string) => void
  onMoveBlock: (id: string, position: { x: number; y: number }) => void
  onResizeBlock: (id: string, size: { width: number; height: number }) => void
  onUpdateAnchors?: (id: string, anchors: BlockAnchors) => void
  onDrop: (e: React.DragEvent, position: { x: number; y: number }) => void
  deviceType: "mobile" | "tablet" | "desktop"
  contractsConfig?: Record<string, any>
}

const deviceSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 }
}

export function WysiwygCanvas({
  placedBlocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onConfigureBlock,
  onMoveBlock,
  onResizeBlock,
  onUpdateAnchors,
  onDrop,
  deviceType,
  contractsConfig
}: WysiwygCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [autoFitScale, setAutoFitScale] = useState(1)
  const [isManualZoom, setIsManualZoom] = useState(false)
  // Measured natural heights per block instance (prevents shrinking below content)
  const [blockNaturalHeights, setBlockNaturalHeights] = useState<Record<string, number>>({})

  // Active wire state for anchoring
  const [activeWire, setActiveWire] = useState<ActiveWire | null>(null)
  const [activeTargetEdge, setActiveTargetEdge] = useState<AnchorEdge | null>(null)
  const [activeTargetSibling, setActiveTargetSibling] = useState<string | null>(null)
  // Editing state for anchor distance labels
  const [editingAnchor, setEditingAnchor] = useState<{ blockId: string, edge: string, value: string } | null>(null)
  
  // Panning state
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })

  const device = deviceSizes[deviceType]

  const [canvasActualWidth, setCanvasActualWidth] = useState(device.width);

  useEffect(() => {
    if (deviceType === 'desktop' && canvasRef.current) {
      const observer = new ResizeObserver((entries) => {
        setCanvasActualWidth(entries[0].contentRect.width);
      });
      observer.observe(canvasRef.current);
      setCanvasActualWidth(canvasRef.current.clientWidth);
      return () => observer.disconnect();
    } else {
      setCanvasActualWidth(device.width);
    }
  }, [deviceType, device.width]);

  // Zoom to fit logic - calculate scale to fit device frame in container
  useEffect(() => {
    const calculateScale = () => {
      if (isManualZoom) return
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const padding = 80
      const frameExtraWidth = 24
      const frameExtraHeight = deviceType === "mobile" ? 48 : 24

      const availableWidth = containerRect.width - padding * 2
      const availableHeight = containerRect.height - padding * 2

      const deviceTotalWidth = canvasActualWidth + frameExtraWidth
      const deviceTotalHeight = device.height + frameExtraHeight

      const scaleX = availableWidth / deviceTotalWidth
      const scaleY = availableHeight / deviceTotalHeight

      const newAutoFitScale = Math.min(scaleX, scaleY, 1)
      setAutoFitScale(newAutoFitScale)

      if (!isManualZoom) {
        setScale(newAutoFitScale)
      }
    }

    calculateScale()
    window.addEventListener("resize", calculateScale)
    return () => window.removeEventListener("resize", calculateScale)
  }, [device.width, device.height, deviceType, isManualZoom])

  // Measure natural content height of logic blocks after each render
  useEffect(() => {
    const newHeights: Record<string, number> = {}

    placedBlocks.forEach(block => {
      if (block.html && !blockNaturalHeights[block.instanceId]) {
        // Use a hidden probe div to measure content height WITHOUT height:100% constraint
        const probe = document.createElement('div')
        probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px;width:320px;'
        probe.innerHTML = block.html
        // Override .khoi height constraint so it sizes to content
        const khoi = probe.querySelector('.khoi') as HTMLElement | null
        if (khoi) khoi.style.height = 'auto'
        document.body.appendChild(probe)
        const natural = probe.scrollHeight
        document.body.removeChild(probe)
        if (natural > 50) {
          newHeights[block.instanceId] = natural
        }
      }
    })

    if (Object.keys(newHeights).length > 0) {
      setBlockNaturalHeights(prev => ({ ...prev, ...newHeights }))
    }
  }, [placedBlocks])

  useEffect(() => {
    setIsManualZoom(false)
  }, [deviceType])

  const handleZoomIn = useCallback(() => {
    setIsManualZoom(true)
    setScale(prev => Math.min(prev + 0.1, 1.5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setIsManualZoom(true)
    setScale(prev => Math.max(prev - 0.1, 0.3))
  }, [])

  const handleZoomToFit = useCallback(() => {
    setIsManualZoom(false)
    setScale(autoFitScale)
  }, [autoFitScale])

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = (e.clientX - canvasRect.left) / scale
    const y = (e.clientY - canvasRect.top) / scale
    onDrop(e, { x: Math.max(0, x - 70), y: Math.max(0, y - 24) })
  }

  // Helper to recalculate existing anchors when block is moved or resized
  const recalculateAnchors = useCallback((block: CanvasBlock, newPos: { x: number, y: number }, newSize: { width: number, height: number }) => {
    if (!block.anchors || Object.keys(block.anchors).length === 0 || !onUpdateAnchors) return;

    const anchors = { ...block.anchors };
    let changed = false;

    (['top', 'right', 'bottom', 'left'] as AnchorEdge[]).forEach(edge => {
      const anchor = anchors[edge];
      if (!anchor) return;

      if (anchor.target === 'parent') {
        let newDist = anchor.distance;
        if (edge === 'left') {
          if (anchor.targetEdge === 'left') newDist = newPos.x;
          if (anchor.targetEdge === 'right') newDist = device.width - newPos.x;
        } else if (edge === 'right') {
          if (anchor.targetEdge === 'right') newDist = device.width - (newPos.x + newSize.width);
          if (anchor.targetEdge === 'left') newDist = -(newPos.x + newSize.width);
        } else if (edge === 'top') {
          if (anchor.targetEdge === 'top') newDist = newPos.y;
          if (anchor.targetEdge === 'bottom') newDist = device.height - newPos.y;
        } else if (edge === 'bottom') {
          if (anchor.targetEdge === 'bottom') newDist = device.height - (newPos.y + newSize.height);
          if (anchor.targetEdge === 'top') newDist = -(newPos.y + newSize.height);
        }
        const roundedDist = Math.round(newDist);
        if (roundedDist !== anchor.distance) {
          anchors[edge] = { ...anchor, distance: roundedDist };
          changed = true;
        }
      } else {
        // Sibling target - recalculate based on current sibling position
        const targetBlock = placedBlocks.find(b => b.instanceId === anchor.target);
        if (targetBlock) {
          const tLeft = targetBlock.position.x;
          const tRight = targetBlock.position.x + targetBlock.size.width;
          const tTop = targetBlock.position.y;
          const tBottom = targetBlock.position.y + targetBlock.size.height;

          let newDist = anchor.distance;
          if (edge === 'left') {
            if (anchor.targetEdge === 'left') newDist = newPos.x - tLeft;
            if (anchor.targetEdge === 'right') newDist = newPos.x - tRight;
          } else if (edge === 'right') {
            if (anchor.targetEdge === 'right') newDist = tRight - (newPos.x + newSize.width);
            if (anchor.targetEdge === 'left') newDist = tLeft - (newPos.x + newSize.width);
          } else if (edge === 'top') {
            if (anchor.targetEdge === 'top') newDist = newPos.y - tTop;
            if (anchor.targetEdge === 'bottom') newDist = newPos.y - tBottom;
          } else if (edge === 'bottom') {
            if (anchor.targetEdge === 'bottom') newDist = tBottom - (newPos.y + newSize.height);
            if (anchor.targetEdge === 'top') newDist = tTop - (newPos.y + newSize.height);
          }
          const roundedDist = Math.round(newDist);
          if (roundedDist !== anchor.distance) {
            anchors[edge] = { ...anchor, distance: roundedDist };
            changed = true;
          }
        }
      }
    });

    if (changed) {
      onUpdateAnchors(block.instanceId, anchors);
    }
  }, [device.width, device.height, onUpdateAnchors, placedBlocks]);

  const handlePanStart = (e: React.PointerEvent) => {
    // Left or middle mouse click to pan
    if (e.button === 0 || e.button === 1) {
      // Ignore if clicking on a block or wire label
      if ((e.target as HTMLElement).closest('.react-draggable, .wire-label')) return;
      
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: containerRef.current?.scrollLeft || 0,
        scrollTop: containerRef.current?.scrollTop || 0
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePanMove = (e: React.PointerEvent) => {
    if (!isPanning || !containerRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    containerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
  };

  const handlePanEnd = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeWire || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setActiveWire(prev => prev ? {
      ...prev,
      currentX: x,
      currentY: y
    } : null)

    const threshold = 120
    let targetEdge: AnchorEdge | null = null
    let targetSibling: string | null = null

    // Check sibling blocks
    const hitThreshold = 30
    for (const b of placedBlocks) {
      if (b.instanceId === activeWire.sourceId) continue;

      const bLeft = b.position.x;
      const bRight = b.position.x + b.size.width;
      const bTop = b.position.y;
      const bBottom = b.position.y + b.size.height;

      const isHorizontal = activeWire.sourceEdge === 'left' || activeWire.sourceEdge === 'right';
      const isVertical = activeWire.sourceEdge === 'top' || activeWire.sourceEdge === 'bottom';

      const padding = 40;
      if (x >= bLeft - padding && x <= bRight + padding && y >= bTop - padding && y <= bBottom + padding) {
        targetSibling = b.instanceId;
        // Pick target edge based on source edge direction (natural connection)
        if (isHorizontal) {
          targetEdge = activeWire.sourceEdge === 'right' ? 'left' : 'right';
        } else if (isVertical) {
          targetEdge = activeWire.sourceEdge === 'bottom' ? 'top' : 'bottom';
        }
        break;
      }
    }

    if (!targetSibling) {
      if (activeWire.sourceEdge === 'left' && x < threshold) targetEdge = 'left'
      else if (activeWire.sourceEdge === 'right' && x > device.width - threshold) targetEdge = 'right'
      else if (activeWire.sourceEdge === 'top' && y < threshold) targetEdge = 'top'
      else if (activeWire.sourceEdge === 'bottom' && y > device.height - threshold) targetEdge = 'bottom'
    }

    setActiveTargetEdge(targetEdge)
    setActiveTargetSibling(targetSibling)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeWire || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale



    // Check hit test for canvas edges (parent anchors)
    const threshold = 120
    let target: AnchorTarget | null = null
    let targetEdge: AnchorEdge | null = null

    // Check sibling blocks
    for (const b of placedBlocks) {
      if (b.instanceId === activeWire.sourceId) continue;

      const bLeft = b.position.x;
      const bRight = b.position.x + b.size.width;
      const bTop = b.position.y;
      const bBottom = b.position.y + b.size.height;

      const isHorizontal = activeWire.sourceEdge === 'left' || activeWire.sourceEdge === 'right';
      const isVertical = activeWire.sourceEdge === 'top' || activeWire.sourceEdge === 'bottom';

      const padding = 40;
      if (x >= bLeft - padding && x <= bRight + padding && y >= bTop - padding && y <= bBottom + padding) {
        target = b.instanceId;
        // Pick target edge based on source edge direction (natural connection)
        if (isHorizontal) {
          targetEdge = activeWire.sourceEdge === 'right' ? 'left' : 'right';
        } else if (isVertical) {
          targetEdge = activeWire.sourceEdge === 'bottom' ? 'top' : 'bottom';
        }
        break;
      }
    }

    if (!target) {
      if (activeWire.sourceEdge === 'left' && x < threshold) { target = 'parent'; targetEdge = 'left'; }
      else if (activeWire.sourceEdge === 'right' && x > device.width - threshold) { target = 'parent'; targetEdge = 'right'; }
      else if (activeWire.sourceEdge === 'top' && y < threshold) { target = 'parent'; targetEdge = 'top'; }
      else if (activeWire.sourceEdge === 'bottom' && y > device.height - threshold) { target = 'parent'; targetEdge = 'bottom'; }
    }

    if (target && targetEdge && onUpdateAnchors) {
      const block = placedBlocks.find(b => b.instanceId === activeWire.sourceId)
      if (block) {
        let distance = 0;
        if (target === 'parent') {
          if (activeWire.sourceEdge === 'left') {
            if (targetEdge === 'left') distance = block.position.x;
            if (targetEdge === 'right') distance = device.width - block.position.x;
          } else if (activeWire.sourceEdge === 'right') {
            if (targetEdge === 'right') distance = device.width - (block.position.x + block.size.width);
            if (targetEdge === 'left') distance = -(block.position.x + block.size.width);
          } else if (activeWire.sourceEdge === 'top') {
            if (targetEdge === 'top') distance = block.position.y;
            if (targetEdge === 'bottom') distance = device.height - block.position.y;
          } else if (activeWire.sourceEdge === 'bottom') {
            if (targetEdge === 'bottom') distance = device.height - (block.position.y + block.size.height);
            if (targetEdge === 'top') distance = -(block.position.y + block.size.height);
          }
        } else {
          // Sibling target
          const targetBlock = placedBlocks.find(b => b.instanceId === target);
          if (targetBlock) {
            const tLeft = targetBlock.position.x;
            const tRight = targetBlock.position.x + targetBlock.size.width;
            const tTop = targetBlock.position.y;
            const tBottom = targetBlock.position.y + targetBlock.size.height;

            if (activeWire.sourceEdge === 'left') {
              if (targetEdge === 'left') distance = block.position.x - tLeft;
              if (targetEdge === 'right') distance = block.position.x - tRight;
            } else if (activeWire.sourceEdge === 'right') {
              if (targetEdge === 'right') distance = tRight - (block.position.x + block.size.width);
              if (targetEdge === 'left') distance = tLeft - (block.position.x + block.size.width);
            } else if (activeWire.sourceEdge === 'top') {
              if (targetEdge === 'top') distance = block.position.y - tTop;
              if (targetEdge === 'bottom') distance = block.position.y - tBottom;
            } else if (activeWire.sourceEdge === 'bottom') {
              if (targetEdge === 'bottom') distance = tBottom - (block.position.y + block.size.height);
              if (targetEdge === 'top') distance = tTop - (block.position.y + block.size.height);
            }
          }
        }

        const anchors = { ...(block.anchors || {}) }
        anchors[activeWire.sourceEdge] = { target, targetEdge, distance: Math.round(distance) }
        onUpdateAnchors(activeWire.sourceId, anchors)
      }
    } else if (onUpdateAnchors) {
      // Clear anchor if dropped in empty space
      const block = placedBlocks.find(b => b.instanceId === activeWire.sourceId)
      if (block && block.anchors && block.anchors[activeWire.sourceEdge]) {
        const anchors = { ...block.anchors }
        delete anchors[activeWire.sourceEdge]
        onUpdateAnchors(activeWire.sourceId, anchors)
      }
    }

    setActiveWire(null)
    setActiveTargetEdge(null)
    setActiveTargetSibling(null)
  }

  // Custom resize handlers removed in favor of react-rnd

  // Check for over-constrained horizontal chains
  const overconstrainedEdges = new Set<string>();
  let hasOverconstrained = false;
  
  if (placedBlocks.length > 0) {
    // Separate graphs for X and Y axes to avoid false positives
    const adjX: Record<string, { target: string, blockId: string, edge: AnchorEdge }[]> = {};
    const adjY: Record<string, { target: string, blockId: string, edge: AnchorEdge }[]> = {};
    const addEdge = (adj: Record<string, { target: string, blockId: string, edge: AnchorEdge }[]>, u: string, v: string, blockId: string, edge: AnchorEdge) => {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push({ target: v, blockId, edge });
      adj[v].push({ target: u, blockId, edge });
    };

    placedBlocks.forEach(block => {
      if (!block.anchors) return;
      const isStretchable = block.category === "Decorative" || block.category === "Layout/Navigation";

      (['left', 'right'] as AnchorEdge[]).forEach(edge => {
        const anchor = block.anchors![edge];
        if (anchor) {
          const isRigid = anchor.stiffness === 'rigid' || (!anchor.stiffness && anchor.target === 'parent');
          if (isRigid && !isStretchable) {
            const u = block.instanceId;
            const v = anchor.target === 'parent' ? `parent_${anchor.targetEdge}` : anchor.target;
            addEdge(adjX, u, v, block.instanceId, edge);
          }
        }
      });

      (['top', 'bottom'] as AnchorEdge[]).forEach(edge => {
        const anchor = block.anchors![edge];
        if (anchor) {
          const isRigid = anchor.stiffness === 'rigid' || (!anchor.stiffness && anchor.target === 'parent');
          if (isRigid && !isStretchable) {
            const u = block.instanceId;
            const v = anchor.target === 'parent' ? `parent_${anchor.targetEdge}` : anchor.target;
            addEdge(adjY, u, v, block.instanceId, edge);
          }
        }
      });
    });

    // Check X-axis: parent_left → parent_right
    if (adjX['parent_left']) {
      const visited = new Set<string>();
      const queue = ['parent_left'];
      visited.add('parent_left');
      const parentMap: Record<string, { from: string, edgeData: any }> = {};

      while (queue.length > 0) {
        const cur = queue.shift()!;
        if (cur === 'parent_right') {
          hasOverconstrained = true;
          let currNode = 'parent_right';
          while (currNode !== 'parent_left') {
            const p = parentMap[currNode];
            overconstrainedEdges.add(`${p.edgeData.blockId}-${p.edgeData.edge}`);
            currNode = p.from;
          }
          break; 
        }
        for (const neighbor of (adjX[cur] || [])) {
          if (!visited.has(neighbor.target)) {
            visited.add(neighbor.target);
            parentMap[neighbor.target] = { from: cur, edgeData: neighbor };
            queue.push(neighbor.target);
          }
        }
      }
    }

    // Check Y-axis: parent_top → parent_bottom
    if (adjY['parent_top']) {
      const visited = new Set<string>();
      const queue = ['parent_top'];
      visited.add('parent_top');
      const parentMap: Record<string, { from: string, edgeData: any }> = {};

      while (queue.length > 0) {
        const cur = queue.shift()!;
        if (cur === 'parent_bottom') {
          hasOverconstrained = true;
          let currNode = 'parent_bottom';
          while (currNode !== 'parent_top') {
            const p = parentMap[currNode];
            overconstrainedEdges.add(`${p.edgeData.blockId}-${p.edgeData.edge}`);
            currNode = p.from;
          }
          break; 
        }
        for (const neighbor of (adjY[cur] || [])) {
          if (!visited.has(neighbor.target)) {
            visited.add(neighbor.target);
            parentMap[neighbor.target] = { from: cur, edgeData: neighbor };
            queue.push(neighbor.target);
          }
        }
      }
    }
  }

  // ── Distribute helpers ──
  const distributeHorizontal = (onlySelected: boolean) => {
    if (!onUpdateAnchors || placedBlocks.length < 2) return;
    const rightToLeft: Record<string, string> = {};
    placedBlocks.forEach(block => {
      if (!block.anchors) return;
      const r = block.anchors['right'];
      if (r && r.target !== 'parent' && (r.targetEdge === 'left' || r.targetEdge === 'right')) {
        rightToLeft[block.instanceId] = r.target as string;
      }
      const l = block.anchors['left'];
      if (l && l.target !== 'parent' && (l.targetEdge === 'left' || l.targetEdge === 'right')) {
        rightToLeft[l.target as string] = block.instanceId;
      }
    });
    const targeted = new Set(Object.values(rightToLeft));
    const allChainStarts = placedBlocks
      .filter(b => !targeted.has(b.instanceId) && rightToLeft[b.instanceId])
      .map(b => b.instanceId);

    // Build all chains
    const allChains: string[][] = [];
    allChainStarts.forEach(startId => {
      const chain: string[] = [startId];
      let cur = startId;
      while (rightToLeft[cur]) { cur = rightToLeft[cur]; chain.push(cur); }
      if (chain.length >= 2) allChains.push(chain);
    });

    // Filter to selected chain if needed
    const chainsToProcess = onlySelected && selectedBlockId
      ? allChains.filter(chain => chain.includes(selectedBlockId))
      : allChains;

    chainsToProcess.forEach(chain => {
      const chainBlocks = chain.map(id => placedBlocks.find(b => b.instanceId === id)!).filter(Boolean);
      const firstBlock = chainBlocks[0];
      const lastBlock = chainBlocks[chainBlocks.length - 1];
      let sumRigidDistances = 0;
      let flexCount = 0;
      const linkGaps: number[] = [];

      let hasParentLeft = false, parentLeftGap = 0;
      if (firstBlock.anchors?.left?.target === 'parent') {
        hasParentLeft = true;
        const isRigid = firstBlock.anchors.left.stiffness === 'rigid' || !firstBlock.anchors.left.stiffness;
        if (isRigid) { sumRigidDistances += firstBlock.anchors.left.distance; parentLeftGap = firstBlock.anchors.left.distance; }
        else { flexCount++; parentLeftGap = -1; }
      }
      for (let i = 0; i < chainBlocks.length - 1; i++) {
        const cb = chainBlocks[i], nb = chainBlocks[i + 1];
        let isRigid = false, dist = 0;
        if (cb.anchors?.right?.target === nb.instanceId) { isRigid = cb.anchors.right.stiffness === 'rigid'; dist = cb.anchors.right.distance; }
        else if (nb.anchors?.left?.target === cb.instanceId) { isRigid = nb.anchors.left.stiffness === 'rigid'; dist = nb.anchors.left.distance; }
        if (isRigid) { sumRigidDistances += dist; linkGaps.push(dist); }
        else { flexCount++; linkGaps.push(-1); }
      }
      let hasParentRight = false, parentRightGap = 0;
      if (lastBlock.anchors?.right?.target === 'parent') {
        hasParentRight = true;
        const isRigid = lastBlock.anchors.right.stiffness === 'rigid' || !lastBlock.anchors.right.stiffness;
        if (isRigid) { sumRigidDistances += lastBlock.anchors.right.distance; parentRightGap = lastBlock.anchors.right.distance; }
        else { flexCount++; parentRightGap = -1; }
      }
      let totalSpan = 0, startX = 0;
      if (hasParentLeft && hasParentRight) { totalSpan = device.width; startX = 0; }
      else if (hasParentLeft) { totalSpan = lastBlock.position.x + lastBlock.size.width; startX = 0; }
      else if (hasParentRight) { totalSpan = device.width - firstBlock.position.x; startX = firstBlock.position.x; }
      else { totalSpan = (lastBlock.position.x + lastBlock.size.width) - firstBlock.position.x; startX = firstBlock.position.x; }

      const totalBlockWidth = chainBlocks.reduce((sum, b) => sum + b.size.width, 0);
      const remainingSpace = totalSpan - totalBlockWidth - sumRigidDistances;
      const equalFlexGap = flexCount > 0 ? Math.max(0, Math.round(remainingSpace / flexCount)) : 0;

      if (hasParentLeft && parentLeftGap === -1) parentLeftGap = equalFlexGap;
      if (hasParentRight && parentRightGap === -1) parentRightGap = equalFlexGap;
      for (let i = 0; i < linkGaps.length; i++) { if (linkGaps[i] === -1) linkGaps[i] = equalFlexGap; }

      const updatesByBlock: Record<string, any> = {};
      if (hasParentLeft) {
        const isFlex = firstBlock.anchors!.left!.stiffness === 'flex';
        if (isFlex) updatesByBlock[firstBlock.instanceId] = { ...(updatesByBlock[firstBlock.instanceId] || firstBlock.anchors), left: { ...firstBlock.anchors!.left!, distance: parentLeftGap } };
      }
      if (hasParentRight) {
        const isFlex = lastBlock.anchors!.right!.stiffness === 'flex';
        if (isFlex) updatesByBlock[lastBlock.instanceId] = { ...(updatesByBlock[lastBlock.instanceId] || lastBlock.anchors), right: { ...lastBlock.anchors!.right!, distance: parentRightGap } };
      }
      let currentX = startX + (hasParentLeft ? parentLeftGap : 0);
      chainBlocks.forEach((block, i) => {
        if ((i > 0 || (i === 0 && hasParentLeft)) && onMoveBlock) {
          onMoveBlock(block.instanceId, { x: currentX, y: block.position.y });
        }
        if (i < chainBlocks.length - 1) currentX += block.size.width + linkGaps[i];
        if (i === chainBlocks.length - 1) return;
        const cb = block, nb = chainBlocks[i + 1], gap = linkGaps[i];
        if (cb.anchors?.right?.target === nb.instanceId) {
          if (cb.anchors.right.stiffness !== 'rigid') updatesByBlock[cb.instanceId] = { ...(updatesByBlock[cb.instanceId] || cb.anchors), right: { ...cb.anchors.right!, distance: gap } };
        } else if (nb.anchors?.left?.target === cb.instanceId) {
          if (nb.anchors.left.stiffness !== 'rigid') updatesByBlock[nb.instanceId] = { ...(updatesByBlock[nb.instanceId] || nb.anchors), left: { ...nb.anchors.left!, distance: gap } };
        }
      });
      Object.entries(updatesByBlock).forEach(([id, anchors]) => onUpdateAnchors(id, anchors));
    });
  };

  const distributeVertical = (onlySelected: boolean) => {
    if (!onUpdateAnchors || placedBlocks.length < 2) return;
    const bottomToTop: Record<string, string> = {};
    placedBlocks.forEach(block => {
      if (!block.anchors) return;
      const b = block.anchors['bottom'];
      if (b && b.target !== 'parent' && (b.targetEdge === 'top' || b.targetEdge === 'bottom')) {
        bottomToTop[block.instanceId] = b.target as string;
      }
      const t = block.anchors['top'];
      if (t && t.target !== 'parent' && (t.targetEdge === 'top' || t.targetEdge === 'bottom')) {
        bottomToTop[t.target as string] = block.instanceId;
      }
    });
    const targeted = new Set(Object.values(bottomToTop));
    const allChainStarts = placedBlocks
      .filter(b => !targeted.has(b.instanceId) && bottomToTop[b.instanceId])
      .map(b => b.instanceId);

    const allChains: string[][] = [];
    allChainStarts.forEach(startId => {
      const chain: string[] = [startId];
      let cur = startId;
      while (bottomToTop[cur]) { cur = bottomToTop[cur]; chain.push(cur); }
      if (chain.length >= 2) allChains.push(chain);
    });

    const chainsToProcess = onlySelected && selectedBlockId
      ? allChains.filter(chain => chain.includes(selectedBlockId))
      : allChains;

    chainsToProcess.forEach(chain => {
      const chainBlocks = chain.map(id => placedBlocks.find(b => b.instanceId === id)!).filter(Boolean);
      const firstBlock = chainBlocks[0];
      const lastBlock = chainBlocks[chainBlocks.length - 1];
      let sumRigidDistances = 0;
      let flexCount = 0;
      const linkGaps: number[] = [];

      let hasParentTop = false, parentTopGap = 0;
      if (firstBlock.anchors?.top?.target === 'parent') {
        hasParentTop = true;
        const isRigid = firstBlock.anchors.top.stiffness === 'rigid' || !firstBlock.anchors.top.stiffness;
        if (isRigid) { sumRigidDistances += firstBlock.anchors.top.distance; parentTopGap = firstBlock.anchors.top.distance; }
        else { flexCount++; parentTopGap = -1; }
      }
      for (let i = 0; i < chainBlocks.length - 1; i++) {
        const cb = chainBlocks[i], nb = chainBlocks[i + 1];
        let isRigid = false, dist = 0;
        if (cb.anchors?.bottom?.target === nb.instanceId) { isRigid = cb.anchors.bottom.stiffness === 'rigid'; dist = cb.anchors.bottom.distance; }
        else if (nb.anchors?.top?.target === cb.instanceId) { isRigid = nb.anchors.top.stiffness === 'rigid'; dist = nb.anchors.top.distance; }
        if (isRigid) { sumRigidDistances += dist; linkGaps.push(dist); }
        else { flexCount++; linkGaps.push(-1); }
      }
      let hasParentBottom = false, parentBottomGap = 0;
      if (lastBlock.anchors?.bottom?.target === 'parent') {
        hasParentBottom = true;
        const isRigid = lastBlock.anchors.bottom.stiffness === 'rigid' || !lastBlock.anchors.bottom.stiffness;
        if (isRigid) { sumRigidDistances += lastBlock.anchors.bottom.distance; parentBottomGap = lastBlock.anchors.bottom.distance; }
        else { flexCount++; parentBottomGap = -1; }
      }
      let totalSpan = 0, startY = 0;
      if (hasParentTop && hasParentBottom) { totalSpan = device.height; startY = 0; }
      else if (hasParentTop) { totalSpan = lastBlock.position.y + lastBlock.size.height; startY = 0; }
      else if (hasParentBottom) { totalSpan = device.height - firstBlock.position.y; startY = firstBlock.position.y; }
      else { totalSpan = (lastBlock.position.y + lastBlock.size.height) - firstBlock.position.y; startY = firstBlock.position.y; }

      const totalBlockHeight = chainBlocks.reduce((sum, b) => sum + b.size.height, 0);
      const remainingSpace = totalSpan - totalBlockHeight - sumRigidDistances;
      const equalFlexGap = flexCount > 0 ? Math.max(0, Math.round(remainingSpace / flexCount)) : 0;

      if (hasParentTop && parentTopGap === -1) parentTopGap = equalFlexGap;
      if (hasParentBottom && parentBottomGap === -1) parentBottomGap = equalFlexGap;
      for (let i = 0; i < linkGaps.length; i++) { if (linkGaps[i] === -1) linkGaps[i] = equalFlexGap; }

      const updatesByBlock: Record<string, any> = {};
      if (hasParentTop) {
        const isFlex = firstBlock.anchors!.top!.stiffness === 'flex';
        if (isFlex) updatesByBlock[firstBlock.instanceId] = { ...(updatesByBlock[firstBlock.instanceId] || firstBlock.anchors), top: { ...firstBlock.anchors!.top!, distance: parentTopGap } };
      }
      if (hasParentBottom) {
        const isFlex = lastBlock.anchors!.bottom!.stiffness === 'flex';
        if (isFlex) updatesByBlock[lastBlock.instanceId] = { ...(updatesByBlock[lastBlock.instanceId] || lastBlock.anchors), bottom: { ...lastBlock.anchors!.bottom!, distance: parentBottomGap } };
      }
      let currentY = startY + (hasParentTop ? parentTopGap : 0);
      chainBlocks.forEach((block, i) => {
        if ((i > 0 || (i === 0 && hasParentTop)) && onMoveBlock) {
          onMoveBlock(block.instanceId, { x: block.position.x, y: currentY });
        }
        if (i < chainBlocks.length - 1) currentY += block.size.height + linkGaps[i];
        if (i === chainBlocks.length - 1) return;
        const cb = block, nb = chainBlocks[i + 1], gap = linkGaps[i];
        if (cb.anchors?.bottom?.target === nb.instanceId) {
          if (cb.anchors.bottom.stiffness !== 'rigid') updatesByBlock[cb.instanceId] = { ...(updatesByBlock[cb.instanceId] || cb.anchors), bottom: { ...cb.anchors.bottom!, distance: gap } };
        } else if (nb.anchors?.top?.target === cb.instanceId) {
          if (nb.anchors.top.stiffness !== 'rigid') updatesByBlock[nb.instanceId] = { ...(updatesByBlock[nb.instanceId] || nb.anchors), top: { ...nb.anchors.top!, distance: gap } };
        }
      });
      Object.entries(updatesByBlock).forEach(([id, anchors]) => onUpdateAnchors(id, anchors));
    });
  };

  return (
    <div className="flex-1 relative bg-[#0f172a] overflow-hidden">
      {/* Cảnh báo Over-constrained */}
      {hasOverconstrained && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 shadow-lg backdrop-blur-md z-50 max-w-xl pointer-events-none transition-all duration-300 animate-in slide-in-from-top-4">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-bold text-red-400 mb-1">Cảnh báo Lực kéo: Quá tải Dây Thép</p>
            <p className="text-xs text-red-200 leading-relaxed">Có một chuỗi khối bị khóa cứng lề 2 bên bằng Dây Thép (màu đỏ)! Hãy click vào biểu tượng <b className="text-blue-400 font-mono bg-blue-900/50 px-1 rounded">[—]</b> trên dây để đổi ít nhất 1 sợi thành Dây Thun <b className="text-emerald-400 font-mono bg-emerald-900/50 px-1 rounded">[≈]</b> nhằm tạo vùng co dãn.</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full h-full overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerLeave={handlePanEnd}
      >
        <div 
          className="flex items-center justify-center min-w-full min-h-full p-8"
          style={{
            minWidth: `${(device.width + 48) * scale + 100}px`,
            minHeight: `${(device.height + 96) * scale + 100}px`
          }}
        >
        {/* Device Frame with Zoom to Fit */}
        <div
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center"
          }}
        >
        {/* iPhone-style frame */}
        <div
          className="relative rounded-[40px] p-3 shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #1e293b, #0f172a)",
            boxShadow: "0 0 0 2px #334155, 0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          {/* Notch for mobile */}
          {deviceType === "mobile" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10 flex items-center justify-center">
              <div className="w-16 h-4 bg-[#1a1a1a] rounded-full" />
            </div>
          )}

          {/* Screen bezel */}
          <div
            className="rounded-[28px]"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)"
            }}
          >
            {/* Canvas area */}
            <div
              ref={canvasRef}
              className="relative bg-[#0a0a0a] cursor-crosshair"
              style={{ width: device.width, height: device.height }}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              onClick={() => onSelectBlock(null)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #334155 1px, transparent 1px),
                    linear-gradient(to bottom, #334155 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px"
                }}
              />

              {/* Wire SVG Overlay */}
              <svg className="absolute inset-0 pointer-events-none z-40 overflow-visible">
                {/* Visual feedback for target edge */}
                {(() => {
                  if (!activeTargetEdge) return null;
                  if (activeTargetSibling) {
                    const sibling = placedBlocks.find(b => b.instanceId === activeTargetSibling);
                    if (!sibling) return null;
                    const x = sibling.position.x;
                    const y = sibling.position.y;
                    const w = sibling.size.width;
                    const h = sibling.size.height;
                    if (activeTargetEdge === 'left') return <rect x={x - 3} y={y} width={6} height={h} fill="#10b981" />;
                    if (activeTargetEdge === 'right') return <rect x={x + w - 3} y={y} width={6} height={h} fill="#10b981" />;
                    if (activeTargetEdge === 'top') return <rect x={x} y={y - 3} width={w} height={6} fill="#10b981" />;
                    if (activeTargetEdge === 'bottom') return <rect x={x} y={y + h - 3} width={w} height={6} fill="#10b981" />;
                  } else {
                    if (activeTargetEdge === 'left') return <rect x={0} y={0} width={6} height={device.height} fill="#10b981" />;
                    if (activeTargetEdge === 'right') return <rect x={device.width - 6} y={0} width={6} height={device.height} fill="#10b981" />;
                    if (activeTargetEdge === 'top') return <rect x={0} y={0} width={device.width} height={6} fill="#10b981" />;
                    if (activeTargetEdge === 'bottom') return <rect x={0} y={device.height - 6} width={device.width} height={6} fill="#10b981" />;
                  }
                  return null;
                })()}

                {/* Active drawing wire */}
                {activeWire && (
                  <path
                    d={(() => {
                      const x1 = activeWire.startX, y1 = activeWire.startY;
                      const x2 = activeWire.currentX, y2 = activeWire.currentY;
                      const mx = (x1 + x2) / 2;
                      return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
                    })()}
                    stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 3" fill="none"
                  />
                )}

                {/* Established wires */}
                {placedBlocks.map(block => {
                  if (!block.anchors) return null;
                  const res = [];
                  const w = block.size.width;
                  const h = block.size.height;
                  const x = block.position.x;
                  const y = block.position.y;

                  const getHandlePos = (edge: AnchorEdge) => {
                    if (edge === 'top') return { px: x + w / 2, py: y };
                    if (edge === 'right') return { px: x + w, py: y + h / 2 };
                    if (edge === 'bottom') return { px: x + w / 2, py: y + h };
                    return { px: x, py: y + h / 2 }; // left
                  }

                  (['top', 'right', 'bottom', 'left'] as AnchorEdge[]).forEach(edge => {
                    const anchor = block.anchors![edge];
                    if (!anchor) return;
                    const start = getHandlePos(edge);
                    let endX = start.px, endY = start.py;

                    if (anchor.target === 'parent') {
                      if (anchor.targetEdge === 'left') endX = 0;
                      if (anchor.targetEdge === 'right') endX = device.width;
                      if (anchor.targetEdge === 'top') endY = 0;
                      if (anchor.targetEdge === 'bottom') endY = device.height;
                    } else {
                      // Sibling
                      const siblingBlock = placedBlocks.find(b => b.instanceId === anchor.target);
                      if (siblingBlock) {
                        const sw = siblingBlock.size.width;
                        const sh = siblingBlock.size.height;
                        const sx = siblingBlock.position.x;
                        const sy = siblingBlock.position.y;
                        if (anchor.targetEdge === 'left') { endX = sx; endY = sy + sh / 2; }
                        if (anchor.targetEdge === 'right') { endX = sx + sw; endY = sy + sh / 2; }
                        if (anchor.targetEdge === 'top') { endX = sx + sw / 2; endY = sy; }
                        if (anchor.targetEdge === 'bottom') { endX = sx + sw / 2; endY = sy + sh; }
                      }
                    }

                    let midX = (start.px + endX) / 2;
                    let midY = (start.py + endY) / 2;
                    // Clamp label position so it stays visible within canvas
                    const labelW = 80, labelH = 28;
                    midX = Math.max(labelW / 2, Math.min(device.width - labelW / 2, midX));
                    midY = Math.max(labelH / 2, Math.min(device.height - labelH / 2, midY));
                    const isEditing = editingAnchor?.blockId === block.instanceId && editingAnchor?.edge === edge;
                    const isFlex = anchor.stiffness === 'flex' || (!anchor.stiffness && anchor.target !== 'parent');
                    const isOverconstrained = overconstrainedEdges.has(`${block.instanceId}-${edge}`);
                    const wireColor = isOverconstrained ? '#ef4444' : (isFlex ? '#10b981' : '#3b82f6');
                    
                    res.push(
                      <g key={`${block.instanceId}-${edge}`}>
                        <path
                          d={(() => {
                            const x1 = start.px, y1 = start.py;
                            const x2 = endX, y2 = endY;
                            const mx = (x1 + x2) / 2;
                            const my = (y1 + y2) / 2;
                            if (edge === 'left' || edge === 'right') {
                              return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
                            } else {
                              return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
                            }
                          })()}
                          stroke={wireColor} strokeWidth="2" strokeOpacity="0.7" strokeDasharray={isFlex ? "6 3" : "none"} fill="none"
                        />
                        {/* Editable distance label & stiffness toggle */}
                        <foreignObject x={midX - labelW / 2} y={midY - labelH / 2} width={labelW} height={labelH} style={{ pointerEvents: 'all', overflow: 'visible' }}>
                          <div className="wire-label group flex items-center justify-center gap-0.5 w-full h-full rounded-md text-[10px] font-mono cursor-pointer shadow-sm transition-colors"
                               style={{ 
                                 backgroundColor: isEditing ? (isFlex ? '#0f766e' : '#1e3a8a') : '#0f172a',
                                 border: `1px solid ${isEditing ? wireColor : wireColor + '60'}`,
                                 color: wireColor
                               }}>
                             {/* Delete wire button */}
                             <span
                               className="opacity-0 group-hover:opacity-100 px-1 py-0.5 hover:bg-red-500/30 rounded transition-all text-red-400 hover:text-red-300 text-[10px] leading-none"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (onUpdateAnchors) {
                                   const newAnchors = { ...(block.anchors || {}) };
                                   delete newAnchors[edge as AnchorEdge];
                                   onUpdateAnchors(block.instanceId, newAnchors);
                                 }
                               }}
                               title="Xóa dây"
                             >
                               ✕
                             </span>
                             <span 
                               className="px-0.5 py-0.5 hover:bg-white/10 rounded transition-colors"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (onUpdateAnchors) {
                                   const newAnchors = { ...(block.anchors || {}) };
                                   newAnchors[edge as AnchorEdge] = { ...anchor, stiffness: isFlex ? 'rigid' : 'flex' };
                                   onUpdateAnchors(block.instanceId, newAnchors);
                                 }
                               }}
                               title={isFlex ? "Dây thun (Co dãn) - Click để đổi thành Dây thép" : "Dây thép (Cố định) - Click để đổi thành Dây thun"}
                             >
                               {isFlex ? '≈' : '—'}
                             </span>
                             {isEditing ? (
                               <input
                                 style={{ width: '40px', height: '100%', background: 'transparent', border: 'none', outline: 'none', color: wireColor, fontSize: '11px', fontFamily: 'monospace', textAlign: 'center', padding: 0 }}
                                 value={editingAnchor!.value}
                                 autoFocus
                                 onFocus={(e) => e.target.select()}
                                 onChange={(e) => setEditingAnchor(prev => prev ? { ...prev, value: e.target.value } : null)}
                                 onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                     const newDist = parseInt(editingAnchor!.value, 10);
                                     if (!isNaN(newDist) && onUpdateAnchors) {
                                       const newAnchors = { ...(block.anchors || {}) };
                                       newAnchors[edge as AnchorEdge] = { ...anchor, distance: newDist };
                                       onUpdateAnchors(block.instanceId, newAnchors);
                                       let newX = block.position.x, newY = block.position.y;
                                       if (anchor.target === 'parent') {
                                         if (edge === 'left') newX = newDist;
                                         if (edge === 'top') newY = newDist;
                                         if (edge === 'right') newX = device.width - newDist - block.size.width;
                                         if (edge === 'bottom') newY = device.height - newDist - block.size.height;
                                       } else {
                                         const sibling = placedBlocks.find(b => b.instanceId === anchor.target);
                                         if (sibling) {
                                           if (edge === 'left' && anchor.targetEdge === 'right') newX = sibling.position.x + sibling.size.width + newDist;
                                           if (edge === 'right' && anchor.targetEdge === 'left') newX = sibling.position.x - newDist - block.size.width;
                                           if (edge === 'top' && anchor.targetEdge === 'bottom') newY = sibling.position.y + sibling.size.height + newDist;
                                           if (edge === 'bottom' && anchor.targetEdge === 'top') newY = sibling.position.y - newDist - block.size.height;
                                         }
                                       }
                                       if (onMoveBlock && (newX !== block.position.x || newY !== block.position.y)) {
                                         onMoveBlock(block.instanceId, { x: newX, y: newY });
                                       }
                                     }
                                     setEditingAnchor(null);
                                   }
                                   if (e.key === 'Escape') setEditingAnchor(null);
                                 }}
                                 onBlur={() => {
                                   const newDist = parseInt(editingAnchor!.value, 10);
                                   if (!isNaN(newDist) && onUpdateAnchors) {
                                     const newAnchors = { ...(block.anchors || {}) };
                                     newAnchors[edge as AnchorEdge] = { ...anchor, distance: newDist };
                                     onUpdateAnchors(block.instanceId, newAnchors);
                                     let newX = block.position.x, newY = block.position.y;
                                     if (anchor.target === 'parent') {
                                       if (edge === 'left') newX = newDist;
                                       if (edge === 'top') newY = newDist;
                                       if (edge === 'right') newX = device.width - newDist - block.size.width;
                                       if (edge === 'bottom') newY = device.height - newDist - block.size.height;
                                     } else {
                                       const sibling = placedBlocks.find(b => b.instanceId === anchor.target);
                                       if (sibling) {
                                         if (edge === 'left' && anchor.targetEdge === 'right') newX = sibling.position.x + sibling.size.width + newDist;
                                         if (edge === 'right' && anchor.targetEdge === 'left') newX = sibling.position.x - newDist - block.size.width;
                                         if (edge === 'top' && anchor.targetEdge === 'bottom') newY = sibling.position.y + sibling.size.height + newDist;
                                         if (edge === 'bottom' && anchor.targetEdge === 'top') newY = sibling.position.y - newDist - block.size.height;
                                       }
                                     }
                                     if (onMoveBlock && (newX !== block.position.x || newY !== block.position.y)) {
                                       onMoveBlock(block.instanceId, { x: newX, y: newY });
                                     }
                                   }
                                   setEditingAnchor(null);
                                 }}
                               />
                             ) : (
                               <span onClick={(e) => {
                                 e.stopPropagation();
                                 setEditingAnchor({ blockId: block.instanceId, edge, value: String(anchor.distance) });
                               }} className="px-1 py-0.5 hover:bg-white/10 rounded transition-colors" title="Click để sửa số">
                                 {anchor.distance}
                               </span>
                             )}
                          </div>
                        </foreignObject>
                      </g>
                    )
                  })
                  return res;
                })}
              </svg>

              {/* Placed blocks with framer-motion drag */}
              {placedBlocks.map((block) => {
                const isSelected = selectedBlockId === block.instanceId
                const color = categoryColors[block.category]
                const Icon = block.icon
                const isDecorative = block.blockType === "decorative"
                const blockWidth = block.size.width

                return (
                  <Rnd
                    key={block.instanceId}
                    scale={scale}
                    size={{ width: blockWidth, height: block.size.height }}
                    position={{ x: block.position.x, y: block.position.y }}
                    onDragStop={(e, d) => {
                      const newX = Math.max(0, Math.min(d.x, device.width - blockWidth))
                      const newY = Math.max(0, Math.min(d.y, device.height - block.size.height))
                      const newPos = { x: newX, y: newY }
                      onMoveBlock(block.instanceId, newPos)
                      recalculateAnchors(block, newPos, { width: blockWidth, height: block.size.height })
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      const newWidth = Math.min(parseInt(ref.style.width, 10), device.width)
                      let newHeight = Math.min(parseInt(ref.style.height, 10), device.height)

                      // If block has HTML, measure if content fits at new width
                      if (block.html) {
                        const probe = document.createElement('div')
                        probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px;width:${newWidth}px;`
                        probe.innerHTML = block.html
                        const khoi = probe.querySelector('.khoi') as HTMLElement | null
                        if (khoi) khoi.style.height = 'auto'
                        document.body.appendChild(probe)
                        const naturalH = probe.scrollHeight
                        document.body.removeChild(probe)

                        if (naturalH > 50) {
                          // Update measured minHeight for this block at new width
                          setBlockNaturalHeights(prev => ({ ...prev, [block.instanceId]: naturalH }))
                          // Auto-expand height if content overflows
                          if (newHeight < naturalH) newHeight = naturalH
                        }
                      }

                      onResizeBlock(block.instanceId, { width: newWidth, height: newHeight })
                      const clampedX = Math.max(0, Math.min(position.x, device.width - newWidth))
                      const clampedY = Math.max(0, Math.min(position.y, device.height - newHeight))
                      const newPos = { x: clampedX, y: clampedY }
                      onMoveBlock(block.instanceId, newPos)
                      recalculateAnchors(block, newPos, { width: newWidth, height: newHeight })
                    }}
                    enableResizing={true}
                    minWidth={block.blockType === "decorative" ? 50 : block.defaultSize.width}
                    minHeight={block.blockType === "logic"
                      ? (blockNaturalHeights[block.instanceId] || block.defaultSize.height)
                      : block.blockType === "decorative" ? 20 : 40}
                    bounds="parent"
                    cancel=".anchor-handle"
                    className={`
                      absolute group
                      ${isSelected ? "z-20" : "z-10"}
                      cursor-grab active:cursor-grabbing
                    `}
                    onClick={(e: any) => {
                      e.stopPropagation()
                      onSelectBlock(block.instanceId)
                    }}
                    resizeHandleStyles={{
                      bottomRight: { width: 16, height: 16, background: '#22d3ee', borderRadius: 2, right: -4, bottom: -4, zIndex: 30, display: isSelected ? 'block' : 'none' },
                      right: { width: 8, height: '100%', background: 'rgba(34,211,238,0.5)', right: -4, zIndex: 30, display: isSelected ? 'block' : 'none' },
                      bottom: { width: '100%', height: 8, background: 'rgba(34,211,238,0.5)', bottom: -4, zIndex: 30, display: isSelected ? 'block' : 'none' }
                    }}
                  >
                    {/* Block content */}
                    <div
                      className={`
                        w-full h-full rounded-lg border-2 transition-all
                        flex flex-col items-center justify-center gap-1
                        ${isSelected
                          ? "border-white shadow-lg"
                          : "border-transparent hover:border-white/50"
                        }
                      `}
                      style={{
                        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        boxShadow: isSelected ? `0 0 20px ${color}40` : undefined
                      }}
                    >
                      {(() => {
                        const config = contractsConfig?.[block.instanceId] || {}

                        if (block.id.startsWith("link-")) {
                          const layout = config.buttonLayout || "icon-left"
                          return (
                            <div
                              className={`w-full h-full flex items-center justify-center gap-2 p-2 pointer-events-none ${layout === "icon-right" ? "flex-row-reverse" :
                                layout === "icon-top" ? "flex-col" :
                                  layout === "icon-bottom" ? "flex-col-reverse" : "flex-row"
                                }`}
                              style={{
                                background: layout === "bg-image" && config.buttonImage
                                  ? `url(${config.buttonImage}) center/cover no-repeat`
                                  : config.buttonColor || `linear-gradient(135deg, ${color}80, ${color}40)`,
                                borderRadius: "8px"
                              }}
                            >
                              {layout !== "bg-image" && config.buttonImage && (
                                <img src={config.buttonImage} alt="" className="w-6 h-6 object-contain" />
                              )}
                              {!config.buttonImage && layout !== "bg-image" && (
                                <Icon className="w-5 h-5" style={{ color: config.buttonColor ? '#fff' : color }} />
                              )}
                              <span
                                className="text-sm font-bold text-white text-center px-2 z-10"
                                style={{ textShadow: layout === "bg-image" ? "0 2px 4px rgba(0,0,0,0.8)" : "none" }}
                              >
                                {config.buttonText || block.title}
                              </span>
                            </div>
                          )
                        }

                        if (block.html) {
                          // Rough preview injection for logic blocks
                          let html = block.html
                          if (config.buttonColor) {
                            html = html.replace(/background:[^;]+;/g, `background:${config.buttonColor} !important;`)
                          }
                          if (config.buttonText) {
                            html = html.replace(/<button[^>]*>([^<]*)<\/button>/, (match, p1) => match.replace(p1, config.buttonText))
                            html = html.replace(/<div class="pv-btn"[^>]*>([^<]*)<\/div>/, (match, p1) => match.replace(p1, config.buttonText))
                          }
                          return (
                            <div
                              className="absolute inset-0 overflow-hidden [&>div]:w-full [&>div]:h-full pointer-events-none"
                              data-instance={block.instanceId}
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          )
                        }

                        return (
                          <div
                            className="flex items-center justify-center w-[90%] h-[70%] gap-2 rounded-xl shadow-sm"
                            style={{ background: config.buttonColor || color }}
                          >
                            <Icon className="w-5 h-5 text-white/90" />
                            <span className="text-sm font-bold text-white text-center px-1">
                              {config.buttonText || block.title}
                            </span>
                          </div>
                        )
                      })()}

                      {/* Block type indicator - hide if it's a logic block WITH html so it looks authentic */}
                      {!(block.blockType === "logic" && block.html) && (
                        <span
                          className="absolute top-1 right-1 text-[9px] font-mono px-1 rounded z-20"
                          style={{
                            background: `${color}30`,
                            color: color
                          }}
                        >
                          {block.blockType === "logic" ? "LOGIC" : "UI"}
                        </span>
                      )}
                    </div>

                    {/* Bounding box on hover/select */}
                    <div
                      className={`
                        absolute inset-0 rounded-lg border-2 border-dashed pointer-events-none
                        transition-opacity
                        ${isSelected ? "opacity-100 border-cyan-400" : "opacity-0 group-hover:opacity-100 border-white/30"}
                      `}
                    />

                    {/* Action buttons - show on select */}
                    {isSelected && (
                      <div className="absolute -top-8 left-0 flex gap-1">
                        <button
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white/80 pointer-events-auto"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation()
                            onConfigureBlock(block.instanceId)
                          }}
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white pointer-events-auto"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveBlock(block.instanceId)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Anchor Handles */}
                    {isSelected && (['top', 'right', 'bottom', 'left'] as AnchorEdge[]).map(edge => {
                      const positionClass = {
                        top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
                        bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                        left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      }[edge];

                      return (
                        <div
                          key={edge}
                          className={`anchor-handle absolute ${positionClass} w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center cursor-crosshair hover:scale-125 transition-transform shadow-lg pointer-events-auto`}
                          style={{ zIndex: 60 }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.currentTarget.setPointerCapture(e.pointerId);
                            const rect = canvasRef.current?.getBoundingClientRect();
                            if (!rect) return;
                            const sx = (e.clientX - rect.left) / scale;
                            const sy = (e.clientY - rect.top) / scale;
                            setActiveWire({
                              sourceId: block.instanceId,
                              sourceEdge: edge,
                              startX: sx,
                              startY: sy,
                              currentX: sx,
                              currentY: sy
                            });
                          }}
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                      )
                    })}
                  </Rnd>
                )
              })}

              {/* Empty state */}
              {placedBlocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/30">
                    <div className="text-4xl mb-2">+</div>
                    <p className="text-sm">Drag blocks here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device label */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono whitespace-nowrap">
          {device.width} x {device.height}
        </div>
      </div>
      </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border shadow-lg">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="min-w-[50px] text-center text-sm font-mono text-foreground">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={handleZoomToFit}
          className={`p-1.5 rounded-md transition-colors ${!isManualZoom
            ? "bg-primary/20 text-primary"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          title="Zoom to fit"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* Distribute selected chain horizontally */}
        <button
          onClick={() => distributeHorizontal(true)}
          className={`p-1.5 rounded-md transition-colors ${selectedBlockId
            ? 'hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300'
            : 'text-muted-foreground/30 cursor-not-allowed'}`}
          title="Căng ngang hàng đang chọn"
          disabled={!selectedBlockId}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="4" width="6" height="8" rx="1" />
            <line x1="1" y1="8" x2="5" y2="8" strokeDasharray="1.5 1" />
            <line x1="11" y1="8" x2="15" y2="8" strokeDasharray="1.5 1" />
          </svg>
        </button>

        {/* Distribute all chains horizontally */}
        <button
          onClick={() => distributeHorizontal(false)}
          className="p-1.5 rounded-md hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors"
          title="Căng ngang tất cả hàng"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="2" x2="1" y2="14" />
            <rect x="3" y="5" width="3" height="6" rx="1" />
            <rect x="10" y="5" width="3" height="6" rx="1" />
            <line x1="15" y1="2" x2="15" y2="14" />
            <line x1="6" y1="8" x2="10" y2="8" strokeDasharray="1 1" />
          </svg>
        </button>

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* Distribute selected chain vertically */}
        <button
          onClick={() => distributeVertical(true)}
          className={`p-1.5 rounded-md transition-colors ${selectedBlockId
            ? 'hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300'
            : 'text-muted-foreground/30 cursor-not-allowed'}`}
          title="Căng dọc cột đang chọn"
          disabled={!selectedBlockId}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: 'rotate(90deg)' }}>
            <rect x="5" y="4" width="6" height="8" rx="1" />
            <line x1="1" y1="8" x2="5" y2="8" strokeDasharray="1.5 1" />
            <line x1="11" y1="8" x2="15" y2="8" strokeDasharray="1.5 1" />
          </svg>
        </button>

        {/* Distribute all chains vertically */}
        <button
          onClick={() => distributeVertical(false)}
          className="p-1.5 rounded-md hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors"
          title="Căng dọc tất cả cột"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: 'rotate(90deg)' }}>
            <line x1="1" y1="2" x2="1" y2="14" />
            <rect x="3" y="5" width="3" height="6" rx="1" />
            <rect x="10" y="5" width="3" height="6" rx="1" />
            <line x1="15" y1="2" x2="15" y2="14" />
            <line x1="6" y1="8" x2="10" y2="8" strokeDasharray="1 1" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export type { CanvasBlock }
