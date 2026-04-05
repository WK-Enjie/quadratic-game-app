/* =====================================================
   QUADRATIC CATAPULT QUEST - CANVAS RENDERER
   =====================================================
   All canvas drawing and animation functions
   CORRECTED VERSION - Fixed rendering issues
   ===================================================== */

/**
 * CanvasRenderer Class
 * Handles all canvas drawing operations
 */
class CanvasRenderer {
    /**
     * Create a new CanvasRenderer
     * @param {string} canvasId - The canvas element ID
     */
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        
        // View settings
        this.view = {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10
        };
        
        // Dimensions
        this.width = 800;
        this.height = 600;
        this.padding = 50;
        this.drawableWidth = 700;
        this.drawableHeight = 500;
        this.scaleX = 35;
        this.scaleY = 25;
        
        // Grid style
        this.gridStyle = 'standard';
        
        // Animation state
        this.animations = [];
        this.animationFrame = null;
        this.isAnimating = false;
        
        // Particles for effects
        this.particles = [];
        
        // Projectile trail
        this.trail = [];
        
        // User-drawn elements
        this.userPoints = [];
        this.userLines = [];
        
        // Mouse state
        this.mousePos = { x: 0, y: 0 };
        this.isMouseDown = false;
        
        // Current render state
        this.currentState = null;
        
        // Delayed initialization
        this.initCanvas();
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    /**
     * Initialize canvas - called from constructor and can be called again
     */
    initCanvas() {
        this.canvas = document.getElementById(this.canvasId);
        
        if (!this.canvas) {
            console.warn(`Canvas "${this.canvasId}" not found, will retry...`);
            setTimeout(() => this.initCanvas(), 100);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.ctx) {
            console.error('Could not get 2D context');
            return;
        }
        
        // Setup canvas
        this.setupCanvas();
        
        // Bind events
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('🎨 Canvas initialized:', this.width, 'x', this.height);
        
        // Initial render
        this.renderEmpty();
    }

    /**
     * Setup canvas dimensions and scaling
     */
    setupCanvas() {
        const container = this.canvas.parentElement;
        
        if (!container) {
            console.warn('Canvas container not found');
            this.width = 800;
            this.height = 600;
        } else {
            // Get container dimensions
            const rect = container.getBoundingClientRect();
            this.width = rect.width || 800;
            this.height = rect.height || 600;
        }
        
        // Ensure minimum dimensions
        this.width = Math.max(this.width, 400);
        this.height = Math.max(this.height, 300);
        
        // Handle device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        // Set display size
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        
        // Scale context
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        // Update drawable area
        this.padding = Math.min(50, this.width * 0.05);
        this.drawableWidth = this.width - 2 * this.padding;
        this.drawableHeight = this.height - 2 * this.padding;
        
        // Calculate scale
        this.calculateScale();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resize(), 150);
        });
    }

    /**
     * Resize handler
     */
    resize() {
        if (!this.canvas || !this.canvas.parentElement) return;
        
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        if (rect.width < 10 || rect.height < 10) {
            // Container not visible, skip resize
            return;
        }
        
        this.width = rect.width;
        this.height = rect.height;
        
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        this.padding = Math.min(50, this.width * 0.05);
        this.drawableWidth = this.width - 2 * this.padding;
        this.drawableHeight = this.height - 2 * this.padding;
        
        this.calculateScale();
        
        // Re-render current state
        if (this.currentState) {
            this.render(this.currentState);
        } else {
            this.renderEmpty();
        }
    }

    /**
     * Force resize - call when canvas becomes visible
     */
    forceResize() {
        setTimeout(() => {
            this.resize();
        }, 50);
    }

    /**
     * Calculate coordinate transformation scale
     */
    calculateScale() {
        const xRange = this.view.xMax - this.view.xMin;
        const yRange = this.view.yMax - this.view.yMin;
        
        this.scaleX = this.drawableWidth / xRange;
        this.scaleY = this.drawableHeight / yRange;
    }

    /**
     * Set the view range
     */
    setView(xMin, xMax, yMin, yMax) {
        this.view = { xMin, xMax, yMin, yMax };
        this.calculateScale();
    }

    /**
     * Set grid style
     */
    setGridStyle(style) {
        if (CONFIG.canvas.grid[style]) {
            this.gridStyle = style;
        }
    }

    /**
     * Bind canvas events
     */
    bindEvents() {
        if (!this.canvas) return;
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.mousePos = null;
        });
    }

    // =====================================================
    // COORDINATE TRANSFORMATION
    // =====================================================

    /**
     * Convert math coordinates to canvas coordinates
     */
    toCanvas(x, y) {
        const canvasX = this.padding + (x - this.view.xMin) * this.scaleX;
        const canvasY = this.padding + (this.view.yMax - y) * this.scaleY;
        return { x: canvasX, y: canvasY };
    }

    /**
     * Convert canvas coordinates to math coordinates
     */
    toMath(canvasX, canvasY) {
        const x = (canvasX - this.padding) / this.scaleX + this.view.xMin;
        const y = this.view.yMax - (canvasY - this.padding) / this.scaleY;
        return { x, y };
    }

    /**
     * Check if a point is within the drawable area
     */
    isInDrawableArea(canvasX, canvasY) {
        return canvasX >= this.padding && 
               canvasX <= this.width - this.padding &&
               canvasY >= this.padding && 
               canvasY <= this.height - this.padding;
    }

    // =====================================================
    // BASIC DRAWING OPERATIONS
    // =====================================================

    /**
     * Clear the entire canvas
     */
    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Fill the background
     */
    fillBackground(color = '#0a0a1a') {
        if (!this.ctx) return;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Render empty state (grid and axes only)
     */
    renderEmpty() {
        if (!this.ctx) return;
        
        this.clear();
        this.fillBackground();
        this.drawGrid();
        this.drawAxes();
    }

    /**
     * Main render function
     * @param {Object} state - Current game state
     */
    render(state) {
        if (!this.ctx) {
            console.warn('Canvas context not ready');
            return;
        }
        
        // Store current state for re-renders
        this.currentState = state;
        
        // Clear and fill background
        this.clear();
        this.fillBackground();
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
        
        // Draw quadratic curve if present
        if (state && state.quadratic) {
            const progress = state.curveProgress !== undefined ? state.curveProgress : 1;
            this.drawQuadratic(state.quadratic, progress);
        }
        
        // Draw additional line if present
        if (state && state.line) {
            this.drawLine(state.line);
        }
        
        // Draw key points
        if (state && state.showKeyPoints && state.quadratic) {
            this.drawKeyPoints(state.quadratic, state.highlightedPoints || []);
        }
        
        // Draw intersection points
        if (state && state.intersectionPoints) {
            state.intersectionPoints.forEach(point => {
                this.drawPoint(point.x, point.y, {
                    color: '#A55EEA',
                    label: `(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`
                });
            });
        }
        
        // Draw user points
        this.userPoints.forEach(point => {
            this.drawPoint(point.x, point.y, { color: '#ffffff', radius: 5 });
        });
        
        // Draw user lines
        this.userLines.forEach(line => {
            this.drawLine(line, { color: '#888888' });
        });
        
        // Draw target
        if (state && state.target) {
            this.drawTarget(state.target);
        }
        
        // Draw catapult
        if (state && state.showCatapult) {
            this.drawCatapult(state.catapultAngle || 45);
        }
        
        // Draw projectile
        if (state && state.projectile) {
            this.drawProjectile(state.projectile);
        }
        
        // Draw particles
        this.drawParticles();
        
        // Draw trail
        this.drawTrail();
        
        // Draw coordinate display on mouse hover
        if (this.mousePos && CONFIG.debug && CONFIG.debug.showCoordinates) {
            this.drawCoordinateDisplay(this.mousePos);
        }
    }

    // =====================================================
    // GRID DRAWING
    // =====================================================

    /**
     * Draw the coordinate grid
     */
    drawGrid() {
        if (!this.ctx) return;
        
        const gridConfig = CONFIG.canvas.grid[this.gridStyle] || CONFIG.canvas.grid.standard;
        
        // Draw minor grid lines
        if (gridConfig.showMinor) {
            this.drawGridLines(
                gridConfig.minorStep, 
                gridConfig.minorColor || 'rgba(255, 255, 255, 0.05)', 
                gridConfig.minorWidth || 0.5
            );
        }
        
        // Draw major grid lines
        this.drawGridLines(
            gridConfig.majorStep || 1, 
            gridConfig.majorColor || 'rgba(255, 255, 255, 0.15)', 
            gridConfig.majorWidth || 1
        );
    }

    /**
     * Draw grid lines at specified intervals
     */
    drawGridLines(step, color, lineWidth) {
        if (!this.ctx) return;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        // Vertical lines
        const xStart = Math.ceil(this.view.xMin / step) * step;
        for (let x = xStart; x <= this.view.xMax; x += step) {
            const canvasX = this.toCanvas(x, 0).x;
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, this.padding);
            this.ctx.lineTo(canvasX, this.height - this.padding);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        const yStart = Math.ceil(this.view.yMin / step) * step;
        for (let y = yStart; y <= this.view.yMax; y += step) {
            const canvasY = this.toCanvas(0, y).y;
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, canvasY);
            this.ctx.lineTo(this.width - this.padding, canvasY);
            this.ctx.stroke();
        }
    }

    // =====================================================
    // AXIS DRAWING
    // =====================================================

    /**
     * Draw the x and y axes
     */
    drawAxes() {
        if (!this.ctx) return;
        
        const axisColor = 'rgba(255, 255, 255, 0.6)';
        const axisWidth = 2;
        const tickSize = 6;
        const labelColor = 'rgba(255, 255, 255, 0.8)';
        
        this.ctx.strokeStyle = axisColor;
        this.ctx.lineWidth = axisWidth;
        this.ctx.fillStyle = labelColor;
        this.ctx.font = '12px Poppins, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Calculate axis positions
        const origin = this.toCanvas(0, 0);
        
        // X-axis
        if (origin.y >= this.padding && origin.y <= this.height - this.padding) {
            // Draw x-axis line
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, origin.y);
            this.ctx.lineTo(this.width - this.padding, origin.y);
            this.ctx.stroke();
            
            // Draw arrow
            this.ctx.beginPath();
            this.ctx.moveTo(this.width - this.padding, origin.y);
            this.ctx.lineTo(this.width - this.padding - 10, origin.y - 5);
            this.ctx.moveTo(this.width - this.padding, origin.y);
            this.ctx.lineTo(this.width - this.padding - 10, origin.y + 5);
            this.ctx.stroke();
            
            // X label
            this.ctx.fillText('x', this.width - this.padding + 15, origin.y);
            
            // X-axis tick marks and labels
            for (let x = Math.ceil(this.view.xMin); x <= Math.floor(this.view.xMax); x++) {
                if (x === 0) continue;
                
                const pos = this.toCanvas(x, 0);
                
                // Tick mark
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, origin.y - tickSize / 2);
                this.ctx.lineTo(pos.x, origin.y + tickSize / 2);
                this.ctx.stroke();
                
                // Label
                this.ctx.fillText(x.toString(), pos.x, origin.y + 18);
            }
        }
        
        // Y-axis
        if (origin.x >= this.padding && origin.x <= this.width - this.padding) {
            // Draw y-axis line
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, this.height - this.padding);
            this.ctx.lineTo(origin.x, this.padding);
            this.ctx.stroke();
            
            // Draw arrow
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, this.padding);
            this.ctx.lineTo(origin.x - 5, this.padding + 10);
            this.ctx.moveTo(origin.x, this.padding);
            this.ctx.lineTo(origin.x + 5, this.padding + 10);
            this.ctx.stroke();
            
            // Y label
            this.ctx.fillText('y', origin.x, this.padding - 15);
            
            // Y-axis tick marks and labels
            this.ctx.textAlign = 'right';
            for (let y = Math.ceil(this.view.yMin); y <= Math.floor(this.view.yMax); y++) {
                if (y === 0) continue;
                
                const pos = this.toCanvas(0, y);
                
                // Tick mark
                this.ctx.beginPath();
                this.ctx.moveTo(origin.x - tickSize / 2, pos.y);
                this.ctx.lineTo(origin.x + tickSize / 2, pos.y);
                this.ctx.stroke();
                
                // Label
                this.ctx.fillText(y.toString(), origin.x - 12, pos.y);
            }
        }
        
        // Origin label
        if (this.view.xMin < 0 && this.view.xMax > 0 && 
            this.view.yMin < 0 && this.view.yMax > 0) {
            this.ctx.textAlign = 'right';
            this.ctx.fillText('O', origin.x - 10, origin.y + 15);
        }
    }

    // =====================================================
    // QUADRATIC CURVE DRAWING
    // =====================================================

    /**
     * Draw a quadratic curve
     */
    drawQuadratic(quadratic, progress = 1, options = {}) {
        if (!this.ctx || !quadratic) return;
        
        const {
            color = '#6C63FF',
            lineWidth = 3,
            glow = true
        } = options;
        
        // Determine curve color based on direction
        const curveColor = quadratic.a > 0 ? color : '#FF6B6B';
        
        // Generate points
        const numPoints = 200;
        const points = [];
        const xStep = (this.view.xMax - this.view.xMin) / (numPoints - 1);
        
        for (let i = 0; i < numPoints; i++) {
            const x = this.view.xMin + i * xStep;
            const y = quadratic.evaluate(x);
            points.push({ x, y });
        }
        
        // Apply progress for animation
        const pointCount = Math.floor(points.length * progress);
        const visiblePoints = points.slice(0, Math.max(pointCount, 2));
        
        // Draw glow effect
        if (glow) {
            this.ctx.save();
            this.ctx.shadowColor = curveColor;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        
        // Draw the curve
        this.ctx.strokeStyle = curveColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        
        let started = false;
        let lastInBounds = false;
        
        for (const point of visiblePoints) {
            const canvas = this.toCanvas(point.x, point.y);
            
            // Check if point is within visible area (with margin)
            const inBounds = canvas.y > -100 && canvas.y < this.height + 100;
            
            if (inBounds) {
                if (!started || !lastInBounds) {
                    this.ctx.moveTo(canvas.x, canvas.y);
                    started = true;
                } else {
                    this.ctx.lineTo(canvas.x, canvas.y);
                }
            }
            
            lastInBounds = inBounds;
        }
        
        this.ctx.stroke();
        
        if (glow) {
            this.ctx.restore();
        }
    }

    /**
     * Draw key points of a quadratic
     */
    drawKeyPoints(quadratic, highlighted = []) {
        if (!quadratic) return;
        
        // Get key points
        const vertex = quadratic.getTurningPoint();
        const yIntercept = quadratic.getYInterceptPoint();
        const xIntercepts = quadratic.getXInterceptPoints();
        const lineOfSymmetry = quadratic.getLineOfSymmetry();
        
        // Draw line of symmetry if highlighted
        if (highlighted.includes('symmetry')) {
            this.drawVerticalLine(lineOfSymmetry, {
                color: 'rgba(255, 230, 109, 0.5)',
                dashPattern: [5, 5],
                label: `x = ${lineOfSymmetry.toFixed(1)}`
            });
        }
        
        // Draw turning point
        if (this.isPointVisible(vertex.x, vertex.y)) {
            const showLabel = highlighted.includes('vertex');
            this.drawPoint(vertex.x, vertex.y, {
                color: '#FFE66D',
                radius: 8,
                label: showLabel ? `(${vertex.x.toFixed(1)}, ${vertex.y.toFixed(1)})` : null,
                pulse: showLabel
            });
        }
        
        // Draw y-intercept
        if (this.isPointVisible(yIntercept.x, yIntercept.y)) {
            const showLabel = highlighted.includes('yIntercept');
            this.drawPoint(yIntercept.x, yIntercept.y, {
                color: '#4ECDC4',
                radius: 6,
                label: showLabel ? `(0, ${yIntercept.y.toFixed(1)})` : null
            });
        }
        
        // Draw x-intercepts
        xIntercepts.forEach(point => {
            if (this.isPointVisible(point.x, point.y)) {
                const showLabel = highlighted.includes('xIntercepts');
                this.drawPoint(point.x, point.y, {
                    color: '#4ECDC4',
                    radius: 6,
                    label: showLabel ? `(${point.x.toFixed(1)}, 0)` : null
                });
            }
        });
    }

    /**
     * Check if a point is within the visible view
     */
    isPointVisible(x, y) {
        return x >= this.view.xMin && x <= this.view.xMax &&
               y >= this.view.yMin && y <= this.view.yMax;
    }

    // =====================================================
    // LINE DRAWING
    // =====================================================

    /**
     * Draw a linear function
     */
    drawLine(line, options = {}) {
        if (!this.ctx || !line) return;
        
        const {
            color = '#FF9F43',
            lineWidth = 2,
            dashPattern = null
        } = options;
        
        // Calculate line endpoints within view
        const x1 = this.view.xMin;
        const x2 = this.view.xMax;
        const y1 = line.evaluate ? line.evaluate(x1) : line.m * x1 + line.c;
        const y2 = line.evaluate ? line.evaluate(x2) : line.m * x2 + line.c;
        
        const start = this.toCanvas(x1, y1);
        const end = this.toCanvas(x2, y2);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        } else {
            this.ctx.setLineDash([]);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    /**
     * Draw a vertical line x = k
     */
    drawVerticalLine(x, options = {}) {
        if (!this.ctx) return;
        
        const {
            color = 'rgba(255, 255, 255, 0.5)',
            lineWidth = 2,
            dashPattern = [5, 5],
            label = null
        } = options;
        
        const canvasX = this.toCanvas(x, 0).x;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(canvasX, this.padding);
        this.ctx.lineTo(canvasX, this.height - this.padding);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = '12px Poppins, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, canvasX, this.padding - 10);
        }
    }

    // =====================================================
    // POINT DRAWING
    // =====================================================

    /**
     * Draw a point marker
     */
    drawPoint(x, y, options = {}) {
        if (!this.ctx) return;
        
        const {
            radius = 6,
            color = '#FF6B6B',
            strokeColor = '#ffffff',
            strokeWidth = 2,
            label = null,
            pulse = false
        } = options;
        
        const canvas = this.toCanvas(x, y);
        
        // Pulse animation
        let currentRadius = radius;
        if (pulse) {
            const pulseAmount = Math.sin(Date.now() / 200) * 2;
            currentRadius += pulseAmount;
        }
        
        // Draw point
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = strokeWidth;
        this.ctx.stroke();
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Poppins, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(label, canvas.x, canvas.y - radius - 8);
        }
    }

    // =====================================================
    // TARGET DRAWING
    // =====================================================

    /**
     * Draw a target
     */
    drawTarget(target) {
        if (!this.ctx || !target) return;
        
        const canvas = this.toCanvas(target.x, target.y);
        const outerRadius = 25;
        const innerRadius = 8;
        
        // Pulse animation
        const pulse = Math.sin(Date.now() / 500 * Math.PI) * 3;
        const animRadius = outerRadius + pulse;
        
        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, animRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Middle ring
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, animRadius * 0.6, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Inner circle
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, innerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.fill();
        
        // Crosshairs
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 2;
        
        // Horizontal
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.x - animRadius - 5, canvas.y);
        this.ctx.lineTo(canvas.x - innerRadius - 3, canvas.y);
        this.ctx.moveTo(canvas.x + innerRadius + 3, canvas.y);
        this.ctx.lineTo(canvas.x + animRadius + 5, canvas.y);
        this.ctx.stroke();
        
        // Vertical
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.x, canvas.y - animRadius - 5);
        this.ctx.lineTo(canvas.x, canvas.y - innerRadius - 3);
        this.ctx.moveTo(canvas.x, canvas.y + innerRadius + 3);
        this.ctx.lineTo(canvas.x, canvas.y + animRadius + 5);
        this.ctx.stroke();
    }

    // =====================================================
    // PROJECTILE & CATAPULT
    // =====================================================

    /**
     * Draw the catapult
     */
    drawCatapult(angle = 45) {
        if (!this.ctx) return;
        
        // Position catapult at left side
        const baseX = this.padding + 40;
        const baseY = this.height - this.padding - 20;
        
        this.ctx.save();
        this.ctx.translate(baseX, baseY);
        
        // Draw base
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-30, -10, 60, 20);
        
        // Draw arm
        this.ctx.save();
        this.ctx.rotate(-angle * Math.PI / 180);
        
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(-5, -50, 10, 50);
        
        // Draw cup
        this.ctx.beginPath();
        this.ctx.arc(0, -50, 12, 0, Math.PI);
        this.ctx.fillStyle = '#654321';
        this.ctx.fill();
        
        this.ctx.restore();
        this.ctx.restore();
    }

    /**
     * Draw the projectile
     */
    drawProjectile(projectile) {
        if (!this.ctx || !projectile) return;
        
        const canvas = this.toCanvas(projectile.x, projectile.y);
        
        // Add to trail
        this.trail.push({ x: canvas.x, y: canvas.y, alpha: 1 });
        
        // Limit trail length
        if (this.trail.length > 20) {
            this.trail.shift();
        }
        
        // Draw glow
        this.ctx.save();
        this.ctx.shadowColor = '#FFE66D';
        this.ctx.shadowBlur = 15;
        
        // Draw projectile
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Draw the projectile trail
     */
    drawTrail() {
        if (!this.ctx) return;
        
        this.trail.forEach((point, i) => {
            const alpha = (i / this.trail.length) * 0.5;
            const radius = 8 * (i / this.trail.length) * 0.8;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, Math.max(radius, 2), 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 230, 109, ${alpha})`;
            this.ctx.fill();
        });
    }

    /**
     * Clear the trail
     */
    clearTrail() {
        this.trail = [];
    }

    // =====================================================
    // PARTICLE EFFECTS
    // =====================================================

    /**
     * Create hit particles
     */
    createHitParticles(x, y) {
        const canvas = this.toCanvas(x, y);
        const colors = ['#FFE66D', '#FF6B6B', '#4ECDC4', '#6C63FF'];
        
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const speed = 2 + Math.random() * 4;
            
            this.particles.push({
                x: canvas.x,
                y: canvas.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02
            });
        }
    }

    /**
     * Create miss particles
     */
    createMissParticles(x, y) {
        const canvas = this.toCanvas(x, y);
        
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            
            this.particles.push({
                x: canvas.x,
                y: canvas.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 2 + Math.random() * 3,
                color: '#ff4757',
                alpha: 1,
                decay: 0.05
            });
        }
    }

    /**
     * Update and draw particles
     */
    drawParticles() {
        if (!this.ctx) return;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.alpha -= p.decay;
            
            // Remove dead particles
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
            
            // Parse color for alpha
            if (p.color.startsWith('#')) {
                const r = parseInt(p.color.slice(1, 3), 16);
                const g = parseInt(p.color.slice(3, 5), 16);
                const b = parseInt(p.color.slice(5, 7), 16);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
            } else {
                this.ctx.fillStyle = p.color;
            }
            
            this.ctx.fill();
        }
    }

    /**
     * Clear all particles
     */
    clearParticles() {
        this.particles = [];
    }

    // =====================================================
    // COORDINATE DISPLAY
    // =====================================================

    /**
     * Draw coordinate display at mouse position
     */
    drawCoordinateDisplay(pos) {
        if (!this.ctx || !pos) return;
        
        const math = this.toMath(pos.x, pos.y);
        
        if (!this.isInDrawableArea(pos.x, pos.y)) return;
        
        const text = `(${math.x.toFixed(1)}, ${math.y.toFixed(1)})`;
        
        this.ctx.save();
        
        // Background
        this.ctx.font = '12px Courier New';
        const metrics = this.ctx.measureText(text);
        const padding = 4;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(
            pos.x + 10,
            pos.y - 20,
            metrics.width + padding * 2,
            16 + padding
        );
        
        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(text, pos.x + 10 + padding, pos.y - 8);
        
        // Crosshair
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, this.padding);
        this.ctx.lineTo(pos.x, this.height - this.padding);
        this.ctx.moveTo(this.padding, pos.y);
        this.ctx.lineTo(this.width - this.padding, pos.y);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    // =====================================================
    // ANIMATION SYSTEM
    // =====================================================

    /**
     * Animate curve drawing
     */
    animateCurve(quadratic, onComplete = null) {
        if (!quadratic) {
            if (onComplete) onComplete();
            return;
        }
        
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.render({
                quadratic,
                curveProgress: eased,
                showKeyPoints: progress > 0.8,
                showCatapult: true
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        animate();
    }

    /**
     * Animate projectile along curve
     */
    animateProjectile(quadratic, target, hit, onComplete = null) {
        if (!quadratic || !target) {
            if (onComplete) onComplete();
            return;
        }
        
        const duration = 2000;
        const startTime = Date.now();
        
        // Starting position
        const startX = this.view.xMin + 1;
        const endX = target.x;
        
        this.clearTrail();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const eased = 1 - Math.pow(1 - progress, 2);
            
            // Current position along curve
            const currentX = startX + (endX - startX) * eased;
            const currentY = quadratic.evaluate(currentX);
            
            this.render({
                quadratic,
                curveProgress: 1,
                target,
                showCatapult: true,
                projectile: { x: currentX, y: currentY }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Hit or miss effect
                if (hit) {
                    this.createHitParticles(target.x, target.y);
                } else {
                    this.createMissParticles(currentX, currentY);
                }
                
                // Continue rendering particles
                const particleAnimate = () => {
                    this.render({
                        quadratic,
                        curveProgress: 1,
                        target: hit ? null : target,
                        showCatapult: true
                    });
                    
                    if (this.particles.length > 0) {
                        requestAnimationFrame(particleAnimate);
                    } else if (onComplete) {
                        onComplete();
                    }
                };
                
                particleAnimate();
            }
        };
        
        animate();
    }

    /**
     * Shake effect for wrong answer
     */
    shakeEffect() {
        if (!this.canvas) return;
        
        const intensity = 10;
        const duration = 300;
        const startTime = Date.now();
        
        const originalTransform = this.canvas.style.transform || '';
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const x = (Math.random() - 0.5) * intensity * (1 - progress);
                const y = (Math.random() - 0.5) * intensity * (1 - progress);
                this.canvas.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                this.canvas.style.transform = originalTransform;
            }
        };
        
        shake();
    }

    // =====================================================
    // EVENT HANDLERS
    // =====================================================

    handleMouseMove(e) {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleClick(e) {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        const mathPos = this.toMath(canvasPos.x, canvasPos.y);
        
        // Emit custom event
        this.canvas.dispatchEvent(new CustomEvent('canvasClick', {
            detail: { canvas: canvasPos, math: mathPos }
        }));
    }

    handleMouseDown(e) {
        this.isMouseDown = true;
    }

    handleMouseUp(e) {
        this.isMouseDown = false;
    }

    // =====================================================
    // USER INTERACTION TOOLS
    // =====================================================

    addUserPoint(x, y) {
        this.userPoints.push({ x, y });
    }

    addUserLine(line) {
        this.userLines.push(line);
    }

    clearUserDrawings() {
        this.userPoints = [];
        this.userLines = [];
    }

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    /**
     * Fit view to show a quadratic nicely
     */
    fitToQuadratic(quadratic) {
        if (!quadratic) return;
        
        const vertex = quadratic.getTurningPoint();
        const xIntercepts = quadratic.getXIntercepts();
        
        // Calculate appropriate bounds
        let xMin = -10, xMax = 10, yMin = -10, yMax = 10;
        
        // Adjust for vertex
        if (Math.abs(vertex.x) > 8) {
            xMin = Math.min(vertex.x - 5, -10);
            xMax = Math.max(vertex.x + 5, 10);
        }
        
        if (vertex.y < -8) {
            yMin = vertex.y - 3;
        } else if (vertex.y > 8) {
            yMax = vertex.y + 3;
        }
        
        // Adjust for x-intercepts
        xIntercepts.forEach(x => {
            if (x < xMin + 2) xMin = x - 2;
            if (x > xMax - 2) xMax = x + 2;
        });
        
        this.setView(xMin, xMax, yMin, yMax);
    }

    /**
     * Get the current view bounds
     */
    getView() {
        return { ...this.view };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CanvasRenderer };
}