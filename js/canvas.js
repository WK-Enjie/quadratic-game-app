/* =====================================================
   QUADRATIC CATAPULT QUEST - CANVAS RENDERER
   =====================================================
   All canvas drawing and animation functions
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
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // View settings
        this.view = {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10
        };
        
        // Padding from canvas edges
        this.padding = CONFIG.canvas.padding;
        
        // Grid style
        this.gridStyle = 'standard';
        
        // Animation state
        this.animations = [];
        this.animationFrame = null;
        
        // Particles for effects
        this.particles = [];
        
        // Projectile trail
        this.trail = [];
        
        // User-drawn elements
        this.userPoints = [];
        this.userLines = [];
        
        // Setup
        this.setupCanvas();
        this.bindEvents();
    }

    // =====================================================
    // SETUP & CONFIGURATION
    // =====================================================

    /**
     * Setup canvas dimensions and DPI scaling
     */
    setupCanvas() {
        this.resize();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas to container
     */
    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Account for device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        // Store display dimensions
        this.width = rect.width;
        this.height = rect.height;
        
        // Update drawable area
        this.drawableWidth = this.width - 2 * this.padding;
        this.drawableHeight = this.height - 2 * this.padding;
        
        // Recalculate scale
        this.calculateScale();
    }

    /**
     * Calculate coordinate transformation scale
     */
    calculateScale() {
        const xRange = this.view.xMax - this.view.xMin;
        const yRange = this.view.yMax - this.view.yMin;
        
        this.scaleX = this.drawableWidth / xRange;
        this.scaleY = this.drawableHeight / yRange;
        
        // Use uniform scale to maintain aspect ratio (optional)
        // this.scale = Math.min(this.scaleX, this.scaleY);
    }

    /**
     * Set the view range
     * @param {number} xMin 
     * @param {number} xMax 
     * @param {number} yMin 
     * @param {number} yMax 
     */
    setView(xMin, xMax, yMin, yMax) {
        this.view = { xMin, xMax, yMin, yMax };
        this.calculateScale();
    }

    /**
     * Set grid style
     * @param {string} style - 'standard', 'detailed', or 'minimal'
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
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    // =====================================================
    // COORDINATE TRANSFORMATION
    // =====================================================

    /**
     * Convert math coordinates to canvas coordinates
     * @param {number} x - Math x coordinate
     * @param {number} y - Math y coordinate
     * @returns {Object} Canvas coordinates {x, y}
     */
    toCanvas(x, y) {
        const canvasX = this.padding + (x - this.view.xMin) * this.scaleX;
        const canvasY = this.padding + (this.view.yMax - y) * this.scaleY;
        return { x: canvasX, y: canvasY };
    }

    /**
     * Convert canvas coordinates to math coordinates
     * @param {number} canvasX - Canvas x coordinate
     * @param {number} canvasY - Canvas y coordinate
     * @returns {Object} Math coordinates {x, y}
     */
    toMath(canvasX, canvasY) {
        const x = (canvasX - this.padding) / this.scaleX + this.view.xMin;
        const y = this.view.yMax - (canvasY - this.padding) / this.scaleY;
        return { x, y };
    }

    /**
     * Check if a point is within the drawable area
     * @param {number} canvasX 
     * @param {number} canvasY 
     * @returns {boolean}
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
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Fill the background
     * @param {string} color 
     */
    fillBackground(color = COLORS.background) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draw everything for the current state
     * @param {Object} state - Current game state
     */
    render(state) {
        this.clear();
        this.fillBackground();
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
        
        // Draw quadratic curve if present
        if (state.quadratic) {
            this.drawQuadratic(state.quadratic, state.curveProgress || 1);
        }
        
        // Draw additional line if present
        if (state.line) {
            this.drawLine(state.line);
        }
        
        // Draw key points
        if (state.showKeyPoints && state.quadratic) {
            this.drawKeyPoints(state.quadratic, state.highlightedPoints || []);
        }
        
        // Draw intersection points
        if (state.intersectionPoints) {
            state.intersectionPoints.forEach(point => {
                this.drawPoint(point.x, point.y, {
                    color: COLORS.intersection,
                    label: QuadraticUtils.formatCoordinate(point)
                });
            });
        }
        
        // Draw user points
        this.userPoints.forEach(point => {
            this.drawPoint(point.x, point.y, { color: '#fff', radius: 5 });
        });
        
        // Draw user lines
        this.userLines.forEach(line => {
            this.drawLine(line, { color: '#888' });
        });
        
        // Draw target
        if (state.target) {
            this.drawTarget(state.target);
        }
        
        // Draw catapult
        if (state.showCatapult) {
            this.drawCatapult(state.catapultAngle || 45);
        }
        
        // Draw projectile
        if (state.projectile) {
            this.drawProjectile(state.projectile);
        }
        
        // Draw particles
        this.drawParticles();
        
        // Draw trail
        this.drawTrail();
        
        // Draw coordinate display
        if (state.mousePos && CONFIG.debug.showCoordinates) {
            this.drawCoordinateDisplay(state.mousePos);
        }
    }

    // =====================================================
    // GRID DRAWING
    // =====================================================

    /**
     * Draw the coordinate grid
     */
    drawGrid() {
        const gridConfig = CONFIG.canvas.grid[this.gridStyle];
        
        // Draw minor grid lines
        if (gridConfig.showMinor) {
            this.drawGridLines(gridConfig.minorStep, gridConfig.minorColor, gridConfig.minorWidth);
        }
        
        // Draw major grid lines
        this.drawGridLines(gridConfig.majorStep, gridConfig.majorColor, gridConfig.majorWidth);
    }

    /**
     * Draw grid lines at specified intervals
     * @param {number} step - Interval between lines
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width
     */
    drawGridLines(step, color, lineWidth) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        // Vertical lines
        const xStart = Math.ceil(this.view.xMin / step) * step;
        for (let x = xStart; x <= this.view.xMax; x += step) {
            const { x: canvasX } = this.toCanvas(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, this.padding);
            this.ctx.lineTo(canvasX, this.height - this.padding);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        const yStart = Math.ceil(this.view.yMin / step) * step;
        for (let y = yStart; y <= this.view.yMax; y += step) {
            const { y: canvasY } = this.toCanvas(0, y);
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
        const axisConfig = CONFIG.canvas.axis;
        
        this.ctx.strokeStyle = axisConfig.color;
        this.ctx.lineWidth = axisConfig.width;
        this.ctx.fillStyle = axisConfig.labelColor;
        this.ctx.font = axisConfig.labelFont;
        
        // X-axis
        const xAxisY = this.toCanvas(0, 0).y;
        if (xAxisY >= this.padding && xAxisY <= this.height - this.padding) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, xAxisY);
            this.ctx.lineTo(this.width - this.padding, xAxisY);
            this.ctx.stroke();
            
            // X-axis arrow
            this.drawArrow(
                this.width - this.padding, xAxisY,
                this.width - this.padding + axisConfig.arrowSize, xAxisY,
                axisConfig.arrowSize
            );
            
            // X-axis label
            this.ctx.fillText('x', this.width - this.padding + 5, xAxisY - 10);
            
            // X-axis tick marks and labels
            this.drawAxisTicks('x', xAxisY);
        }
        
        // Y-axis
        const yAxisX = this.toCanvas(0, 0).x;
        if (yAxisX >= this.padding && yAxisX <= this.width - this.padding) {
            this.ctx.beginPath();
            this.ctx.moveTo(yAxisX, this.height - this.padding);
            this.ctx.lineTo(yAxisX, this.padding);
            this.ctx.stroke();
            
            // Y-axis arrow
            this.drawArrow(
                yAxisX, this.padding,
                yAxisX, this.padding - axisConfig.arrowSize,
                axisConfig.arrowSize
            );
            
            // Y-axis label
            this.ctx.fillText('y', yAxisX + 10, this.padding + 5);
            
            // Y-axis tick marks and labels
            this.drawAxisTicks('y', yAxisX);
        }
        
        // Origin label
        if (this.view.xMin < 0 && this.view.xMax > 0 && 
            this.view.yMin < 0 && this.view.yMax > 0) {
            const origin = this.toCanvas(0, 0);
            this.ctx.fillText('O', origin.x - 15, origin.y + 15);
        }
    }

    /**
     * Draw tick marks and labels on an axis
     * @param {string} axis - 'x' or 'y'
     * @param {number} axisPos - Canvas position of the axis
     */
    drawAxisTicks(axis, axisPos) {
        const axisConfig = CONFIG.canvas.axis;
        const step = CONFIG.canvas.grid[this.gridStyle].majorStep;
        
        this.ctx.strokeStyle = axisConfig.color;
        this.ctx.lineWidth = axisConfig.tickWidth;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        if (axis === 'x') {
            const xStart = Math.ceil(this.view.xMin / step) * step;
            for (let x = xStart; x <= this.view.xMax; x += step) {
                if (Math.abs(x) < 0.001) continue; // Skip origin
                
                const { x: canvasX } = this.toCanvas(x, 0);
                
                // Tick mark
                this.ctx.beginPath();
                this.ctx.moveTo(canvasX, axisPos - axisConfig.tickSize / 2);
                this.ctx.lineTo(canvasX, axisPos + axisConfig.tickSize / 2);
                this.ctx.stroke();
                
                // Label
                this.ctx.fillText(
                    QuadraticUtils.formatNumber(x),
                    canvasX,
                    axisPos + axisConfig.labelOffset
                );
            }
        } else {
            const yStart = Math.ceil(this.view.yMin / step) * step;
            for (let y = yStart; y <= this.view.yMax; y += step) {
                if (Math.abs(y) < 0.001) continue; // Skip origin
                
                const { y: canvasY } = this.toCanvas(0, y);
                
                // Tick mark
                this.ctx.beginPath();
                this.ctx.moveTo(axisPos - axisConfig.tickSize / 2, canvasY);
                this.ctx.lineTo(axisPos + axisConfig.tickSize / 2, canvasY);
                this.ctx.stroke();
                
                // Label
                this.ctx.textAlign = 'right';
                this.ctx.fillText(
                    QuadraticUtils.formatNumber(y),
                    axisPos - axisConfig.labelOffset / 2,
                    canvasY
                );
            }
        }
    }

    /**
     * Draw an arrow head
     */
    drawArrow(fromX, fromY, toX, toY, size) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - size * Math.cos(angle - Math.PI / 6),
            toY - size * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - size * Math.cos(angle + Math.PI / 6),
            toY - size * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    // =====================================================
    // QUADRATIC CURVE DRAWING
    // =====================================================

    /**
     * Draw a quadratic curve
     * @param {Quadratic} quadratic - The quadratic to draw
     * @param {number} progress - Animation progress (0-1)
     * @param {Object} options - Drawing options
     */
    drawQuadratic(quadratic, progress = 1, options = {}) {
        const {
            color = CONFIG.canvas.curve.color,
            lineWidth = CONFIG.canvas.curve.width,
            glow = true,
            dashPattern = null
        } = options;
        
        // Generate points
        const points = quadratic.generatePoints(this.view.xMin, this.view.xMax, CONFIG.canvas.curve.points);
        
        // Apply progress for animation
        const pointCount = Math.floor(points.length * progress);
        const visiblePoints = points.slice(0, pointCount);
        
        if (visiblePoints.length < 2) return;
        
        // Draw glow effect
        if (glow) {
            this.ctx.save();
            this.ctx.shadowColor = CONFIG.canvas.curve.glowColor;
            this.ctx.shadowBlur = CONFIG.canvas.curve.glowBlur;
        }
        
        // Draw the curve
        this.ctx.strokeStyle = quadratic.a > 0 ? color : COLORS.curveNegative;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        }
        
        this.ctx.beginPath();
        
        let started = false;
        for (const point of visiblePoints) {
            const canvas = this.toCanvas(point.x, point.y);
            
            // Only draw if within canvas bounds (with some margin)
            if (canvas.y > -50 && canvas.y < this.height + 50) {
                if (!started) {
                    this.ctx.moveTo(canvas.x, canvas.y);
                    started = true;
                } else {
                    this.ctx.lineTo(canvas.x, canvas.y);
                }
            } else {
                started = false;
            }
        }
        
        this.ctx.stroke();
        
        if (dashPattern) {
            this.ctx.setLineDash([]);
        }
        
        if (glow) {
            this.ctx.restore();
        }
    }

    /**
     * Draw key points of a quadratic (vertex, intercepts)
     * @param {Quadratic} quadratic 
     * @param {Array} highlighted - Array of point types to highlight
     */
    drawKeyPoints(quadratic, highlighted = []) {
        const keyPoints = quadratic.getKeyPoints();
        
        // Draw turning point
        const vertex = keyPoints.vertex;
        if (this.isPointVisible(vertex.x, vertex.y)) {
            this.drawPoint(vertex.x, vertex.y, {
                color: COLORS.turningPoint,
                label: highlighted.includes('vertex') ? QuadraticUtils.formatCoordinate(vertex) : null,
                pulse: highlighted.includes('vertex')
            });
        }
        
        // Draw y-intercept
        const yInt = keyPoints.yIntercept;
        if (this.isPointVisible(yInt.x, yInt.y)) {
            this.drawPoint(yInt.x, yInt.y, {
                color: COLORS.intercepts,
                label: highlighted.includes('yIntercept') ? `(0, ${QuadraticUtils.formatNumber(yInt.y)})` : null
            });
        }
        
        // Draw x-intercepts
        keyPoints.xIntercepts.forEach((point, i) => {
            if (this.isPointVisible(point.x, point.y)) {
                this.drawPoint(point.x, point.y, {
                    color: COLORS.intercepts,
                    label: highlighted.includes('xIntercepts') ? `(${QuadraticUtils.formatNumber(point.x)}, 0)` : null
                });
            }
        });
        
        // Draw line of symmetry
        if (highlighted.includes('symmetry')) {
            this.drawVerticalLine(keyPoints.lineOfSymmetry, {
                color: 'rgba(255, 230, 109, 0.5)',
                dashPattern: [5, 5],
                label: `x = ${QuadraticUtils.formatNumber(keyPoints.lineOfSymmetry)}`
            });
        }
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
     * @param {Line} line - The line to draw
     * @param {Object} options - Drawing options
     */
    drawLine(line, options = {}) {
        const {
            color = CONFIG.canvas.line.color,
            lineWidth = CONFIG.canvas.line.width,
            dashPattern = null
        } = options;
        
        // Calculate line endpoints within view
        const x1 = this.view.xMin;
        const x2 = this.view.xMax;
        const y1 = line.evaluate(x1);
        const y2 = line.evaluate(x2);
        
        const start = this.toCanvas(x1, y1);
        const end = this.toCanvas(x2, y2);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        
        if (dashPattern) {
            this.ctx.setLineDash([]);
        }
    }

    /**
     * Draw a vertical line x = k
     * @param {number} x - The x value
     * @param {Object} options 
     */
    drawVerticalLine(x, options = {}) {
        const {
            color = 'rgba(255, 255, 255, 0.5)',
            lineWidth = 2,
            dashPattern = [5, 5],
            label = null
        } = options;
        
        const canvas = this.toCanvas(x, 0);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.x, this.padding);
        this.ctx.lineTo(canvas.x, this.height - this.padding);
        this.ctx.stroke();
        
        if (dashPattern) {
            this.ctx.setLineDash([]);
        }
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, canvas.x, this.padding - 10);
        }
    }

    /**
     * Draw a horizontal line y = k
     * @param {number} y - The y value
     * @param {Object} options 
     */
    drawHorizontalLine(y, options = {}) {
        const {
            color = 'rgba(255, 255, 255, 0.5)',
            lineWidth = 2,
            dashPattern = [5, 5],
            label = null
        } = options;
        
        const canvas = this.toCanvas(0, y);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        
        if (dashPattern) {
            this.ctx.setLineDash(dashPattern);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, canvas.y);
        this.ctx.lineTo(this.width - this.padding, canvas.y);
        this.ctx.stroke();
        
        if (dashPattern) {
            this.ctx.setLineDash([]);
        }
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(label, this.width - this.padding + 10, canvas.y);
        }
    }

    // =====================================================
    // POINT DRAWING
    // =====================================================

    /**
     * Draw a point marker
     * @param {number} x - Math x coordinate
     * @param {number} y - Math y coordinate
     * @param {Object} options - Drawing options
     */
    drawPoint(x, y, options = {}) {
        const {
            radius = CONFIG.canvas.point.radius,
            color = CONFIG.canvas.point.fillColor,
            strokeColor = CONFIG.canvas.point.strokeColor,
            strokeWidth = CONFIG.canvas.point.strokeWidth,
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
        
        // Draw outer stroke
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = strokeWidth;
        this.ctx.stroke();
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = CONFIG.canvas.point.labelFont;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(label, canvas.x, canvas.y - CONFIG.canvas.point.labelOffset);
        }
    }

    // =====================================================
    // TARGET DRAWING
    // =====================================================

    /**
     * Draw a target
     * @param {Object} target - Target object {x, y}
     */
    drawTarget(target) {
        const canvas = this.toCanvas(target.x, target.y);
        const config = CONFIG.canvas.target;
        
        // Pulse animation
        const pulse = Math.sin(Date.now() / config.pulseSpeed * Math.PI * 2) * 3;
        const outerRadius = config.radius + pulse;
        
        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, outerRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = config.outerColor;
        this.ctx.lineWidth = config.strokeWidth;
        this.ctx.stroke();
        
        // Middle ring
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, outerRadius * 0.6, 0, Math.PI * 2);
        this.ctx.strokeStyle = config.outerColor;
        this.ctx.lineWidth = config.strokeWidth - 1;
        this.ctx.stroke();
        
        // Inner circle
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, config.innerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = config.innerColor;
        this.ctx.fill();
        
        // Crosshairs
        this.ctx.strokeStyle = config.outerColor;
        this.ctx.lineWidth = 2;
        
        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.x - outerRadius - 5, canvas.y);
        this.ctx.lineTo(canvas.x - config.innerRadius - 2, canvas.y);
        this.ctx.moveTo(canvas.x + config.innerRadius + 2, canvas.y);
        this.ctx.lineTo(canvas.x + outerRadius + 5, canvas.y);
        this.ctx.stroke();
        
        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.x, canvas.y - outerRadius - 5);
        this.ctx.lineTo(canvas.x, canvas.y - config.innerRadius - 2);
        this.ctx.moveTo(canvas.x, canvas.y + config.innerRadius + 2);
        this.ctx.lineTo(canvas.x, canvas.y + outerRadius + 5);
        this.ctx.stroke();
    }

    // =====================================================
    // PROJECTILE & CATAPULT
    // =====================================================

    /**
     * Draw the catapult
     * @param {number} angle - Launch angle in degrees
     */
    drawCatapult(angle = 45) {
        const config = CONFIG.canvas.catapult;
        
        // Position catapult at left side of canvas
        const baseX = this.padding + 30;
        const baseY = this.height - this.padding - 20;
        
        this.ctx.save();
        this.ctx.translate(baseX, baseY);
        
        // Draw base
        this.ctx.fillStyle = config.color;
        this.ctx.fillRect(-config.width / 2, -10, config.width, 20);
        
        // Draw arm
        this.ctx.save();
        this.ctx.rotate(-angle * Math.PI / 180);
        
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(-5, -config.armLength, 10, config.armLength);
        
        // Draw cup
        this.ctx.beginPath();
        this.ctx.arc(0, -config.armLength, 12, 0, Math.PI);
        this.ctx.fillStyle = '#654321';
        this.ctx.fill();
        
        this.ctx.restore();
        this.ctx.restore();
    }

    /**
     * Draw the projectile
     * @param {Object} projectile - {x, y, vx, vy}
     */
    drawProjectile(projectile) {
        const config = CONFIG.canvas.projectile;
        const canvas = this.toCanvas(projectile.x, projectile.y);
        
        // Add to trail
        this.trail.push({ x: canvas.x, y: canvas.y, alpha: 1 });
        
        // Limit trail length
        if (this.trail.length > config.trailLength) {
            this.trail.shift();
        }
        
        // Draw glow
        this.ctx.save();
        this.ctx.shadowColor = config.color;
        this.ctx.shadowBlur = 15;
        
        // Draw projectile
        this.ctx.beginPath();
        this.ctx.arc(canvas.x, canvas.y, config.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = config.color;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Draw the projectile trail
     */
    drawTrail() {
        const config = CONFIG.canvas.projectile;
        
        this.trail.forEach((point, i) => {
            const alpha = (i / this.trail.length) * 0.5;
            const radius = config.radius * (i / this.trail.length) * 0.8;
            
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
     * @param {number} x - Math x coordinate
     * @param {number} y - Math y coordinate
     */
    createHitParticles(x, y) {
        const canvas = this.toCanvas(x, y);
        const colors = CONFIG.animation.hitEffect.colors;
        
        for (let i = 0; i < CONFIG.animation.hitEffect.particles; i++) {
            const angle = (Math.PI * 2 / CONFIG.animation.hitEffect.particles) * i;
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
     * Create miss particles (smaller, red)
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
                color: COLORS.error,
                alpha: 1,
                decay: 0.05
            });
        }
    }

    /**
     * Update and draw particles
     */
    drawParticles() {
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
            this.ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba');
            
            // Handle hex colors
            if (p.color.startsWith('#')) {
                const r = parseInt(p.color.slice(1, 3), 16);
                const g = parseInt(p.color.slice(3, 5), 16);
                const b = parseInt(p.color.slice(5, 7), 16);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
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
     * @param {Object} pos - {x, y} canvas coordinates
     */
    drawCoordinateDisplay(pos) {
        const math = this.toMath(pos.x, pos.y);
        
        if (!this.isInDrawableArea(pos.x, pos.y)) return;
        
        const text = `(${QuadraticUtils.formatNumber(math.x)}, ${QuadraticUtils.formatNumber(math.y)})`;
        
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
        this.ctx.fillStyle = '#fff';
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
     * @param {Quadratic} quadratic 
     * @param {Function} onComplete 
     */
    animateCurve(quadratic, onComplete = null) {
        const duration = CONFIG.animation.curveReveal.duration;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = EASING.easeInOutCubic(progress);
            
            this.render({
                quadratic,
                curveProgress: eased,
                showKeyPoints: progress > 0.8
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
     * @param {Quadratic} quadratic - The trajectory
     * @param {Object} target - Target position {x, y}
     * @param {boolean} hit - Whether it hits the target
     * @param {Function} onComplete 
     */
    animateProjectile(quadratic, target, hit, onComplete = null) {
        const duration = CONFIG.animation.projectile.duration;
        const startTime = Date.now();
        
        // Starting position
        const startX = this.view.xMin + 1;
        const endX = target.x;
        
        this.clearTrail();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = EASING.easeOutQuad(progress);
            
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
                        target: hit ? null : target
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
        const intensity = CONFIG.animation.missEffect.shake;
        const duration = CONFIG.animation.missEffect.duration;
        const startTime = Date.now();
        
        const originalTransform = this.canvas.style.transform;
        
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

    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        // Emit custom event
        this.canvas.dispatchEvent(new CustomEvent('canvasMouseMove', {
            detail: {
                canvas: this.mousePos,
                math: this.toMath(this.mousePos.x, this.mousePos.y)
            }
        }));
    }

    /**
     * Handle click
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        const mathPos = this.toMath(canvasPos.x, canvasPos.y);
        
        // Emit custom event
        this.canvas.dispatchEvent(new CustomEvent('canvasClick', {
            detail: {
                canvas: canvasPos,
                math: mathPos
            }
        }));
    }

    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
        this.isMouseDown = true;
        this.mouseDownPos = {
            x: e.clientX - this.canvas.getBoundingClientRect().left,
            y: e.clientY - this.canvas.getBoundingClientRect().top
        };
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        this.isMouseDown = false;
    }

    // =====================================================
    // USER INTERACTION TOOLS
    // =====================================================

    /**
     * Add a user point
     * @param {number} x - Math x
     * @param {number} y - Math y
     */
    addUserPoint(x, y) {
        this.userPoints.push({ x, y });
    }

    /**
     * Add a user line
     * @param {Line} line 
     */
    addUserLine(line) {
        this.userLines.push(line);
    }

    /**
     * Clear user drawings
     */
    clearUserDrawings() {
        this.userPoints = [];
        this.userLines = [];
    }

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    /**
     * Take a screenshot of the canvas
     * @returns {string} Data URL of the canvas image
     */
    screenshot() {
        return this.canvas.toDataURL('image/png');
    }

    /**
     * Get the current view bounds
     * @returns {Object}
     */
    getView() {
        return { ...this.view };
    }

    /**
     * Fit view to show a quadratic nicely
     * @param {Quadratic} quadratic 
     */
    fitToQuadratic(quadratic) {
        const vertex = quadratic.getTurningPoint();
        const xIntercepts = quadratic.getXIntercepts();
        
        // Calculate appropriate bounds
        let xMin = -10, xMax = 10, yMin = -10, yMax = 10;
        
        // Adjust for vertex
        if (Math.abs(vertex.x) > 8) {
            xMin = Math.min(vertex.x - 5, xMin);
            xMax = Math.max(vertex.x + 5, xMax);
        }
        
        if (Math.abs(vertex.y) > 8) {
            yMin = Math.min(vertex.y - 3, yMin);
            yMax = Math.max(vertex.y + 3, yMax);
        }
        
        // Adjust for x-intercepts
        xIntercepts.forEach(x => {
            if (x < xMin + 2) xMin = x - 2;
            if (x > xMax - 2) xMax = x + 2;
        });
        
        this.setView(xMin, xMax, yMin, yMax);
    }
}

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CanvasRenderer };
}