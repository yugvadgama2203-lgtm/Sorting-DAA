/* ==========================================================================
   SortLab Visualizer Engine
   Supports Bar Sorting with Pointer Arrows (low, high, mid, pivot, i, j)
   & DAA Graph Visualizer Mode (Prim's, Kruskal's, Dijkstra's)
   ========================================================================== */

class VisualizerEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.array = [];
    this.steps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.animationTimer = null;
    this.speed = 50;
    this.startTime = null;
    this.elapsedTime = 0;
    this.onStepCallback = null;
    this.onCompleteCallback = null;

    this.pointerColors = {
      low: '#38bdf8',    // Cyan
      high: '#a855f7',   // Purple
      mid: '#facc15',    // Yellow
      pivot: '#f43f5e',  // Rose / Magenta
      i: '#22c55e',      // Emerald Green
      j: '#fb923c',      // Orange
      min: '#00f2fe',    // Bright Teal
      key: '#ec4899',    // Pink
      u: '#facc15',      // Yellow
      v: '#38bdf8',      // Cyan
      root: '#a855f7'    // Purple
    };

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;

    this.render();
  }

  setArray(arr) {
    this.array = [...arr];
    this.steps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.elapsedTime = 0;
    if (this.animationTimer) clearInterval(this.animationTimer);
    this.render();
  }

  loadSteps(generator) {
    this.steps = Array.from(generator);
    this.currentStepIdx = 0;
  }

  render(stepData = null) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // If stepData contains graph information, render Graph Mode
    if (stepData && stepData.graph) {
      this.renderGraph(stepData);
      return;
    }

    if (!this.array || !this.array.length) return;

    const currentArr = stepData ? stepData.array || this.array : this.array;
    const n = currentArr.length;
    const maxVal = Math.max(...currentArr, 100);

    const padding = 20;
    const pointerTopHeight = 65; // Reserved height for pointer arrows and badges
    const availableWidth = w - padding * 2;
    const gap = n > 50 ? 1 : n > 30 ? 2 : 4;
    const barWidth = Math.max(2, (availableWidth - gap * (n - 1)) / n);

    const activeIndices = stepData ? stepData.indices || [] : [];
    const stepType = stepData ? stepData.type : 'none';
    const pointers = stepData ? stepData.pointers || {} : {};

    // Group pointers by index for vertical stacking
    const pointerStackMap = {};
    for (const [ptrName, idx] of Object.entries(pointers)) {
      if (typeof idx === 'number' && idx >= 0 && idx < n) {
        if (!pointerStackMap[idx]) pointerStackMap[idx] = [];
        pointerStackMap[idx].push(ptrName);
      }
    }

    // 1. Draw Bars
    for (let i = 0; i < n; i++) {
      const val = currentArr[i];
      const barHeight = Math.max(6, (val / maxVal) * (h - pointerTopHeight - 50));
      const x = padding + i * (barWidth + gap);
      const y = h - padding - barHeight;

      let fillColor = '#38bdf8';
      let glowColor = 'rgba(56, 189, 248, 0.4)';

      if (stepType === 'all-sorted') {
        fillColor = '#22c55e';
        glowColor = 'rgba(34, 197, 94, 0.4)';
      } else if (activeIndices.includes(i)) {
        if (stepType === 'compare') {
          fillColor = '#facc15';
          glowColor = 'rgba(250, 204, 21, 0.6)';
        } else if (stepType === 'swap' || stepType === 'overwrite') {
          fillColor = '#f43f5e';
          glowColor = 'rgba(244, 63, 94, 0.6)';
        } else if (stepType === 'pivot') {
          fillColor = '#a855f7';
          glowColor = 'rgba(168, 85, 247, 0.6)';
        } else if (stepType === 'sorted') {
          fillColor = '#22c55e';
          glowColor = 'rgba(34, 197, 94, 0.4)';
        }
      }

      ctx.shadowColor = glowColor;
      ctx.shadowBlur = activeIndices.includes(i) ? 12 : 4;
      ctx.fillStyle = fillColor;

      this.drawRoundedRect(ctx, x, y, barWidth, barHeight, Math.min(barWidth / 2, 4));

      // Numerical label above bar
      if (barWidth >= 16) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val, x + barWidth / 2, y - 6);
      }

      // 2. Draw Pointer Arrows & Badges
      if (pointerStackMap[i]) {
        const stack = pointerStackMap[i];
        stack.forEach((ptrName, stackIdx) => {
          const ptrColor = this.pointerColors[ptrName] || '#00f2fe';
          const arrowX = x + barWidth / 2;
          const arrowY = y - 18 - stackIdx * 20;

          // Draw Pointer Arrow Head (Downwards)
          ctx.shadowBlur = 6;
          ctx.shadowColor = ptrColor;
          ctx.fillStyle = ptrColor;

          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY + 6);
          ctx.lineTo(arrowX - 4, arrowY - 2);
          ctx.lineTo(arrowX + 4, arrowY - 2);
          ctx.closePath();
          ctx.fill();

          // Draw Pointer Label Badge
          ctx.font = '700 9px Fira Code, monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = ptrColor;
          ctx.fillText(ptrName.toUpperCase(), arrowX, arrowY - 6);
        });
      }
    }

    ctx.shadowBlur = 0;
  }

  // Render Graph Stage for Prim's, Kruskal's, Dijkstra's
  renderGraph(stepData) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const graph = stepData.graph;

    const activeNode = stepData.activeNode;
    const targetNode = stepData.targetNode;
    const activeEdge = stepData.activeEdge;

    // Draw Edges first
    graph.edges.forEach(e => {
      const uNode = graph.nodes.find(n => n.id === e.u);
      const vNode = graph.nodes.find(n => n.id === e.v);

      if (!uNode || !vNode) return;

      const x1 = uNode.x * w;
      const y1 = uNode.y * h;
      const x2 = vNode.x * w;
      const y2 = vNode.y * h;

      let strokeColor = 'rgba(255, 255, 255, 0.15)';
      let lineWidth = 2;

      const isMSTEdge = graph.parent && (graph.parent[e.v] === e.u || graph.parent[e.u] === e.v);
      const isCurrent = activeEdge && ((activeEdge.u === e.u && activeEdge.v === e.v) || (activeEdge.u === e.v && activeEdge.v === e.u));

      if (isCurrent) {
        strokeColor = '#facc15'; // Yellow
        lineWidth = 4;
      } else if (isMSTEdge) {
        strokeColor = '#22c55e'; // Green
        lineWidth = 4;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Edge Weight Label
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      ctx.fillStyle = 'rgba(16, 24, 40, 0.85)';
      ctx.beginPath();
      ctx.arc(midX, midY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 10px Fira Code, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.w, midX, midY);
    });

    // Draw Nodes
    graph.nodes.forEach(n => {
      const x = n.x * w;
      const y = n.y * h;
      const radius = 22;

      let fillColor = '#1e293b';
      let strokeColor = '#38bdf8';

      if (n.id === activeNode) {
        fillColor = 'rgba(250, 204, 21, 0.3)';
        strokeColor = '#facc15';
      } else if (n.id === targetNode) {
        fillColor = 'rgba(244, 63, 94, 0.3)';
        strokeColor = '#f43f5e';
      } else if (graph.visited && graph.visited[n.id]) {
        fillColor = 'rgba(34, 197, 94, 0.25)';
        strokeColor = '#22c55e';
      }

      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, x, y);

      // Distance / Key Label
      if (graph.dist) {
        const dVal = graph.dist[n.id];
        const dText = dVal === Infinity ? '\u221E' : `d=${dVal}`;
        ctx.fillStyle = '#facc15';
        ctx.font = '600 11px Fira Code, monospace';
        ctx.fillText(dText, x, y - radius - 8);
      }
    });
  }

  drawRoundedRect(ctx, x, y, w, h, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  play() {
    if (this.currentStepIdx >= this.steps.length - 1) {
      this.currentStepIdx = 0;
    }
    this.isPlaying = true;
    this.startTime = performance.now() - this.elapsedTime;
    this.scheduleNextStep();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationTimer) clearTimeout(this.animationTimer);
  }

  scheduleNextStep() {
    if (!this.isPlaying) return;

    if (this.currentStepIdx >= this.steps.length) {
      this.isPlaying = false;
      if (this.onCompleteCallback) this.onCompleteCallback();
      return;
    }

    const step = this.steps[this.currentStepIdx];
    this.elapsedTime = performance.now() - this.startTime;

    this.render(step);

    if (step.indices && step.indices.length > 0 && window.soundSynth) {
      const idx = step.indices[0];
      const val = (step.array && step.array[idx]) || 50;
      window.soundSynth.playTone(val);
    }

    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentStepIdx, this.steps.length, Math.round(this.elapsedTime));
    }

    this.currentStepIdx++;

    const delay = Math.max(5, Math.floor(400 / Math.pow(this.speed, 0.9)));
    this.animationTimer = setTimeout(() => this.scheduleNextStep(), delay);
  }

  stepForward() {
    if (this.currentStepIdx < this.steps.length) {
      const step = this.steps[this.currentStepIdx];
      this.render(step);
      if (this.onStepCallback) {
        this.onStepCallback(step, this.currentStepIdx, this.steps.length, Math.round(this.elapsedTime));
      }
      this.currentStepIdx++;
    }
  }

  stepBackward() {
    if (this.currentStepIdx > 1) {
      this.currentStepIdx -= 2;
      const step = this.steps[this.currentStepIdx];
      this.render(step);
      if (this.onStepCallback) {
        this.onStepCallback(step, this.currentStepIdx, this.steps.length, Math.round(this.elapsedTime));
      }
      this.currentStepIdx++;
    }
  }

  setSpeed(speedVal) {
    this.speed = Math.max(1, Math.min(100, parseInt(speedVal)));
  }

  reset() {
    this.pause();
    this.currentStepIdx = 0;
    this.elapsedTime = 0;
    if (this.steps.length > 0) {
      this.render(this.steps[0]);
    } else {
      this.render();
    }
  }
}

window.VisualizerEngine = VisualizerEngine;
