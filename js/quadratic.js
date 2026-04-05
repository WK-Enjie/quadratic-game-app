/* =====================================================
   QUADRATIC CATAPULT QUEST - QUADRATIC MATH ENGINE
   =====================================================
   Core mathematical functions for quadratic equations
   ===================================================== */

/**
 * Quadratic Class
 * Represents a quadratic equation in the form y = ax² + bx + c
 */
class Quadratic {
    /**
     * Create a new Quadratic
     * @param {number} a - Coefficient of x²
     * @param {number} b - Coefficient of x
     * @param {number} c - Constant term
     */
    constructor(a, b, c) {
        if (a === 0) {
            throw new Error('Coefficient "a" cannot be zero for a quadratic equation');
        }
        this.a = a;
        this.b = b;
        this.c = c;
        
        // Cache computed values
        this._cache = {};
    }

    // =====================================================
    // BASIC PROPERTIES
    // =====================================================

    /**
     * Evaluate y for a given x value
     * @param {number} x - The x value
     * @returns {number} The corresponding y value
     */
    evaluate(x) {
        return this.a * x * x + this.b * x + this.c;
    }

    /**
     * Alias for evaluate
     */
    f(x) {
        return this.evaluate(x);
    }

    /**
     * Get the y-intercept (where x = 0)
     * @returns {number} The y-intercept value
     */
    getYIntercept() {
        return this.c;
    }

    /**
     * Get the y-intercept as a coordinate point
     * @returns {Object} Point object {x, y}
     */
    getYInterceptPoint() {
        return { x: 0, y: this.c };
    }

    /**
     * Determine if parabola opens upward or downward
     * @returns {string} 'upward' or 'downward'
     */
    getDirection() {
        return this.a > 0 ? 'upward' : 'downward';
    }

    /**
     * Check if the parabola has a minimum or maximum
     * @returns {string} 'minimum' or 'maximum'
     */
    getExtremumType() {
        return this.a > 0 ? 'minimum' : 'maximum';
    }

    // =====================================================
    // LINE OF SYMMETRY
    // =====================================================

    /**
     * Calculate the line of symmetry (axis of symmetry)
     * Formula: x = -b / (2a)
     * @returns {number} The x-value of the line of symmetry
     */
    getLineOfSymmetry() {
        if (this._cache.lineOfSymmetry === undefined) {
            this._cache.lineOfSymmetry = -this.b / (2 * this.a);
        }
        return this._cache.lineOfSymmetry;
    }

    /**
     * Get line of symmetry as equation string
     * @returns {string} e.g., "x = 2"
     */
    getLineOfSymmetryEquation() {
        const x = this.getLineOfSymmetry();
        return `x = ${QuadraticUtils.formatNumber(x)}`;
    }

    // =====================================================
    // TURNING POINT (VERTEX)
    // =====================================================

    /**
     * Calculate the turning point (vertex)
     * @returns {Object} Point object {x, y}
     */
    getTurningPoint() {
        if (this._cache.turningPoint === undefined) {
            const x = this.getLineOfSymmetry();
            const y = this.evaluate(x);
            this._cache.turningPoint = { x, y };
        }
        return { ...this._cache.turningPoint };
    }

    /**
     * Alias for getTurningPoint
     */
    getVertex() {
        return this.getTurningPoint();
    }

    /**
     * Get the maximum or minimum y-value
     * @returns {number} The extremum y-value
     */
    getExtremumValue() {
        return this.getTurningPoint().y;
    }

    // =====================================================
    // DISCRIMINANT AND ROOTS
    // =====================================================

    /**
     * Calculate the discriminant
     * Formula: D = b² - 4ac
     * @returns {number} The discriminant value
     */
    getDiscriminant() {
        if (this._cache.discriminant === undefined) {
            this._cache.discriminant = this.b * this.b - 4 * this.a * this.c;
        }
        return this._cache.discriminant;
    }

    /**
     * Determine the nature of roots based on discriminant
     * @returns {Object} {type: string, description: string, count: number}
     */
    getNatureOfRoots() {
        const D = this.getDiscriminant();
        
        if (D > MATH_CONSTANTS.EPSILON) {
            return {
                type: 'two_distinct',
                description: 'Two distinct real roots',
                count: 2
            };
        } else if (Math.abs(D) <= MATH_CONSTANTS.EPSILON) {
            return {
                type: 'equal',
                description: 'Two equal real roots (repeated root)',
                count: 1
            };
        } else {
            return {
                type: 'no_real',
                description: 'No real roots',
                count: 0
            };
        }
    }

    /**
     * Calculate the x-intercepts (roots)
     * Uses quadratic formula: x = (-b ± √(b²-4ac)) / (2a)
     * @returns {Array} Array of x-intercept values, empty if no real roots
     */
    getXIntercepts() {
        if (this._cache.xIntercepts === undefined) {
            const D = this.getDiscriminant();
            
            if (D < -MATH_CONSTANTS.EPSILON) {
                this._cache.xIntercepts = [];
            } else if (Math.abs(D) <= MATH_CONSTANTS.EPSILON) {
                const x = -this.b / (2 * this.a);
                this._cache.xIntercepts = [x];
            } else {
                const sqrtD = Math.sqrt(D);
                const x1 = (-this.b + sqrtD) / (2 * this.a);
                const x2 = (-this.b - sqrtD) / (2 * this.a);
                // Sort in ascending order
                this._cache.xIntercepts = x1 < x2 ? [x1, x2] : [x2, x1];
            }
        }
        return [...this._cache.xIntercepts];
    }

    /**
     * Get x-intercepts as coordinate points
     * @returns {Array} Array of point objects {x, y}
     */
    getXInterceptPoints() {
        return this.getXIntercepts().map(x => ({ x, y: 0 }));
    }

    /**
     * Check if the quadratic can be factored with integer roots
     * @returns {boolean}
     */
    hasIntegerRoots() {
        const roots = this.getXIntercepts();
        return roots.every(r => Number.isInteger(r) || Math.abs(r - Math.round(r)) < MATH_CONSTANTS.EPSILON);
    }

    /**
     * Get the factored form if possible
     * @returns {string|null} Factored form or null if not factorable
     */
    getFactoredForm() {
        const roots = this.getXIntercepts();
        
        if (roots.length === 0) {
            return null;
        }
        
        if (roots.length === 1) {
            const r = roots[0];
            if (this.a === 1) {
                return `(x ${QuadraticUtils.formatSignedNumber(-r)})²`;
            } else {
                return `${this.a}(x ${QuadraticUtils.formatSignedNumber(-r)})²`;
            }
        }
        
        const [r1, r2] = roots;
        
        // Check if roots are nice numbers
        if (!this.hasIntegerRoots() && !QuadraticUtils.areNiceDecimals(roots)) {
            return null;
        }
        
        if (this.a === 1) {
            return `(x ${QuadraticUtils.formatSignedNumber(-r1)})(x ${QuadraticUtils.formatSignedNumber(-r2)})`;
        } else {
            return `${this.a}(x ${QuadraticUtils.formatSignedNumber(-r1)})(x ${QuadraticUtils.formatSignedNumber(-r2)})`;
        }
    }

    // =====================================================
    // COMPLETING THE SQUARE (VERTEX FORM)
    // =====================================================

    /**
     * Convert to vertex form: a(x - h)² + k
     * @returns {Object} {a, h, k} coefficients for vertex form
     */
    getVertexFormCoefficients() {
        if (this._cache.vertexForm === undefined) {
            const h = -this.b / (2 * this.a);
            const k = this.c - (this.b * this.b) / (4 * this.a);
            this._cache.vertexForm = { a: this.a, h, k };
        }
        return { ...this._cache.vertexForm };
    }

    /**
     * Get the vertex form as a string
     * @returns {string} e.g., "2(x - 3)² + 5"
     */
    getVertexFormString() {
        const { a, h, k } = this.getVertexFormCoefficients();
        
        let str = '';
        
        // Coefficient a
        if (a === 1) {
            str = '';
        } else if (a === -1) {
            str = '-';
        } else {
            str = `${QuadraticUtils.formatNumber(a)}`;
        }
        
        // (x - h)² part
        if (Math.abs(h) < MATH_CONSTANTS.EPSILON) {
            str += 'x²';
        } else {
            str += `(x ${QuadraticUtils.formatSignedNumber(-h)})²`;
        }
        
        // + k part
        if (Math.abs(k) >= MATH_CONSTANTS.EPSILON) {
            str += ` ${QuadraticUtils.formatSignedNumber(k, true)}`;
        }
        
        return str;
    }

    // =====================================================
    // RANGE
    // =====================================================

    /**
     * Get the range of the quadratic function
     * @returns {Object} {min: number|null, max: number|null, description: string}
     */
    getRange() {
        const vertex = this.getTurningPoint();
        
        if (this.a > 0) {
            return {
                min: vertex.y,
                max: Infinity,
                description: `y ≥ ${QuadraticUtils.formatNumber(vertex.y)}`,
                inequality: 'gte',
                value: vertex.y
            };
        } else {
            return {
                min: -Infinity,
                max: vertex.y,
                description: `y ≤ ${QuadraticUtils.formatNumber(vertex.y)}`,
                inequality: 'lte',
                value: vertex.y
            };
        }
    }

    // =====================================================
    // FINDING COORDINATES
    // =====================================================

    /**
     * Find y-value(s) for a given x
     * @param {number} x - The x value
     * @returns {number} The y value
     */
    findY(x) {
        return this.evaluate(x);
    }

    /**
     * Find x-value(s) for a given y
     * Solves ax² + bx + (c - y) = 0
     * @param {number} y - The y value
     * @returns {Array} Array of x values
     */
    findX(y) {
        // ax² + bx + c = y
        // ax² + bx + (c - y) = 0
        const newC = this.c - y;
        const D = this.b * this.b - 4 * this.a * newC;
        
        if (D < -MATH_CONSTANTS.EPSILON) {
            return [];
        } else if (Math.abs(D) <= MATH_CONSTANTS.EPSILON) {
            return [-this.b / (2 * this.a)];
        } else {
            const sqrtD = Math.sqrt(D);
            const x1 = (-this.b + sqrtD) / (2 * this.a);
            const x2 = (-this.b - sqrtD) / (2 * this.a);
            return x1 < x2 ? [x1, x2] : [x2, x1];
        }
    }

    // =====================================================
    // LINE INTERSECTION
    // =====================================================

    /**
     * Find intersection points with a line y = mx + c
     * @param {number} m - Slope of the line
     * @param {number} c - Y-intercept of the line
     * @returns {Array} Array of intersection points {x, y}
     */
    getLineIntersection(m, lineC) {
        // ax² + bx + c = mx + lineC
        // ax² + (b - m)x + (c - lineC) = 0
        const newB = this.b - m;
        const newC = this.c - lineC;
        
        const D = newB * newB - 4 * this.a * newC;
        
        if (D < -MATH_CONSTANTS.EPSILON) {
            return [];
        } else if (Math.abs(D) <= MATH_CONSTANTS.EPSILON) {
            const x = -newB / (2 * this.a);
            const y = m * x + lineC;
            return [{ x, y }];
        } else {
            const sqrtD = Math.sqrt(D);
            const x1 = (-newB + sqrtD) / (2 * this.a);
            const x2 = (-newB - sqrtD) / (2 * this.a);
            
            const points = [
                { x: x1, y: m * x1 + lineC },
                { x: x2, y: m * x2 + lineC }
            ];
            
            // Sort by x-coordinate
            return points.sort((a, b) => a.x - b.x);
        }
    }

    /**
     * Find intersection with a vertical line x = k
     * @param {number} k - The x value
     * @returns {Object} Point {x, y}
     */
    getVerticalLineIntersection(k) {
        return { x: k, y: this.evaluate(k) };
    }

    /**
     * Find intersection with a horizontal line y = k
     * @param {number} k - The y value
     * @returns {Array} Array of points {x, y}
     */
    getHorizontalLineIntersection(k) {
        const xValues = this.findX(k);
        return xValues.map(x => ({ x, y: k }));
    }

    /**
     * Check if a line is tangent to the parabola
     * @param {number} m - Slope of the line
     * @param {number} c - Y-intercept of the line
     * @returns {boolean}
     */
    isLineTangent(m, c) {
        const newB = this.b - m;
        const newC = this.c - c;
        const D = newB * newB - 4 * this.a * newC;
        return Math.abs(D) <= MATH_CONSTANTS.EPSILON;
    }

    /**
     * Find the tangent line at a given x-value
     * @param {number} x0 - The x value
     * @returns {Object} {m: slope, c: y-intercept}
     */
    getTangentAt(x0) {
        // Derivative: dy/dx = 2ax + b
        const m = 2 * this.a * x0 + this.b;
        const y0 = this.evaluate(x0);
        // y - y0 = m(x - x0)
        // y = mx - mx0 + y0
        const c = y0 - m * x0;
        return { m, c };
    }

    // =====================================================
    // STRING REPRESENTATIONS
    // =====================================================

    /**
     * Get standard form string: ax² + bx + c
     * @returns {string}
     */
    getStandardForm() {
        let str = '';
        
        // ax² term
        if (this.a === 1) {
            str = 'x²';
        } else if (this.a === -1) {
            str = '-x²';
        } else {
            str = `${QuadraticUtils.formatNumber(this.a)}x²`;
        }
        
        // bx term
        if (this.b !== 0) {
            if (this.b === 1) {
                str += ' + x';
            } else if (this.b === -1) {
                str += ' - x';
            } else if (this.b > 0) {
                str += ` + ${QuadraticUtils.formatNumber(this.b)}x`;
            } else {
                str += ` - ${QuadraticUtils.formatNumber(Math.abs(this.b))}x`;
            }
        }
        
        // c term
        if (this.c !== 0) {
            if (this.c > 0) {
                str += ` + ${QuadraticUtils.formatNumber(this.c)}`;
            } else {
                str += ` - ${QuadraticUtils.formatNumber(Math.abs(this.c))}`;
            }
        }
        
        return str;
    }

    /**
     * Get equation string with y = prefix
     * @returns {string}
     */
    getEquation() {
        return `y = ${this.getStandardForm()}`;
    }

    /**
     * Get equation in a specified form
     * @param {string} form - 'standard', 'vertex', 'factored'
     * @returns {string}
     */
    getEquationForm(form) {
        switch (form) {
            case 'vertex':
                return `y = ${this.getVertexFormString()}`;
            case 'factored':
                const factored = this.getFactoredForm();
                return factored ? `y = ${factored}` : null;
            case 'standard':
            default:
                return this.getEquation();
        }
    }

    /**
     * Convert to string (alias for getEquation)
     * @returns {string}
     */
    toString() {
        return this.getEquation();
    }

    // =====================================================
    // POINT GENERATION FOR GRAPHING
    // =====================================================

    /**
     * Generate points for plotting the curve
     * @param {number} xMin - Minimum x value
     * @param {number} xMax - Maximum x value
     * @param {number} numPoints - Number of points to generate
     * @returns {Array} Array of {x, y} points
     */
    generatePoints(xMin, xMax, numPoints = 200) {
        const points = [];
        const step = (xMax - xMin) / (numPoints - 1);
        
        for (let i = 0; i < numPoints; i++) {
            const x = xMin + i * step;
            const y = this.evaluate(x);
            points.push({ x, y });
        }
        
        return points;
    }

    /**
     * Get key points for graphing (intercepts, vertex)
     * @returns {Object} Object containing key points
     */
    getKeyPoints() {
        return {
            vertex: this.getTurningPoint(),
            yIntercept: this.getYInterceptPoint(),
            xIntercepts: this.getXInterceptPoints(),
            lineOfSymmetry: this.getLineOfSymmetry()
        };
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    /**
     * Check if a point lies on the parabola
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} tolerance - Allowed error
     * @returns {boolean}
     */
    containsPoint(x, y, tolerance = MATH_CONSTANTS.EPSILON) {
        const expectedY = this.evaluate(x);
        return Math.abs(y - expectedY) <= tolerance;
    }

    /**
     * Create a copy of this quadratic
     * @returns {Quadratic}
     */
    clone() {
        return new Quadratic(this.a, this.b, this.c);
    }

    // =====================================================
    // STATIC FACTORY METHODS
    // =====================================================

    /**
     * Create quadratic from vertex form: a(x - h)² + k
     * @param {number} a - Leading coefficient
     * @param {number} h - X-coordinate of vertex
     * @param {number} k - Y-coordinate of vertex
     * @returns {Quadratic}
     */
    static fromVertexForm(a, h, k) {
        // a(x - h)² + k = ax² - 2ahx + ah² + k
        const b = -2 * a * h;
        const c = a * h * h + k;
        return new Quadratic(a, b, c);
    }

    /**
     * Create quadratic from roots: a(x - r1)(x - r2)
     * @param {number} a - Leading coefficient
     * @param {number} r1 - First root
     * @param {number} r2 - Second root
     * @returns {Quadratic}
     */
    static fromRoots(a, r1, r2) {
        // a(x - r1)(x - r2) = a(x² - (r1+r2)x + r1*r2)
        const b = -a * (r1 + r2);
        const c = a * r1 * r2;
        return new Quadratic(a, b, c);
    }

    /**
     * Create quadratic from three points
     * @param {Object} p1 - Point {x, y}
     * @param {Object} p2 - Point {x, y}
     * @param {Object} p3 - Point {x, y}
     * @returns {Quadratic}
     */
    static fromThreePoints(p1, p2, p3) {
        // Solve system of equations
        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;
        const { x: x3, y: y3 } = p3;
        
        // Using Lagrange interpolation or matrix method
        const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
        
        const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
        const b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / denom;
        const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;
        
        return new Quadratic(a, b, c);
    }
}

// =====================================================
// QUADRATIC UTILITIES
// =====================================================

const QuadraticUtils = {
    /**
     * Format a number for display
     * @param {number} num - The number to format
     * @param {number} precision - Decimal places
     * @returns {string}
     */
    formatNumber(num, precision = MATH_CONSTANTS.ROUNDING_PRECISION) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        // Check if it's a nice fraction
        const fraction = this.toFraction(num);
        if (fraction) {
            return fraction;
        }
        
        // Round to precision
        const rounded = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        
        // Remove trailing zeros
        return parseFloat(rounded.toFixed(precision)).toString();
    },

    /**
     * Format a number with sign for display in equations
     * @param {number} num - The number
     * @param {boolean} showPlus - Whether to show + for positive
     * @returns {string}
     */
    formatSignedNumber(num, showPlus = false) {
        const formatted = this.formatNumber(num);
        if (num >= 0) {
            return showPlus ? `+ ${formatted}` : formatted;
        } else {
            return `- ${this.formatNumber(Math.abs(num))}`;
        }
    },

    /**
     * Try to convert a decimal to a simple fraction
     * @param {number} num - The number
     * @returns {string|null} Fraction string or null
     */
    toFraction(num, maxDenominator = 12) {
        if (Number.isInteger(num)) {
            return null;
        }
        
        for (let d = 2; d <= maxDenominator; d++) {
            const n = num * d;
            if (Math.abs(n - Math.round(n)) < MATH_CONSTANTS.EPSILON) {
                const numerator = Math.round(n);
                const gcd = this.gcd(Math.abs(numerator), d);
                const simpNum = numerator / gcd;
                const simpDen = d / gcd;
                if (simpDen === 1) return null;
                return `${simpNum}/${simpDen}`;
            }
        }
        return null;
    },

    /**
     * Greatest common divisor
     */
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    },

    /**
     * Check if numbers are "nice" decimals (0.5, 0.25, etc.)
     */
    areNiceDecimals(numbers) {
        const niceDecimals = [0, 0.25, 0.5, 0.75];
        return numbers.every(n => {
            const decimal = Math.abs(n) - Math.floor(Math.abs(n));
            return niceDecimals.some(d => Math.abs(decimal - d) < MATH_CONSTANTS.EPSILON);
        });
    },

    /**
     * Parse a coordinate string like "(2, 3)" or "2, 3"
     * @param {string} str - The coordinate string
     * @returns {Object|null} {x, y} or null if invalid
     */
    parseCoordinate(str) {
        // Remove parentheses and spaces
        const cleaned = str.replace(/[()]/g, '').trim();
        const parts = cleaned.split(/[,\s]+/).filter(p => p.length > 0);
        
        if (parts.length !== 2) return null;
        
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        
        if (isNaN(x) || isNaN(y)) return null;
        
        return { x, y };
    },

    /**
     * Parse an equation like "x = 2" or "y = 3"
     * @param {string} str - The equation string
     * @returns {Object|null} {variable, value} or null
     */
    parseSimpleEquation(str) {
        const match = str.match(/^\s*([xy])\s*=\s*(-?\d+\.?\d*(?:\/\d+)?)\s*$/i);
        if (!match) return null;
        
        let value = match[2];
        // Handle fractions
        if (value.includes('/')) {
            const [num, den] = value.split('/').map(Number);
            value = num / den;
        } else {
            value = parseFloat(value);
        }
        
        return {
            variable: match[1].toLowerCase(),
            value: value
        };
    },

    /**
     * Parse a line equation like "y = 2x + 3"
     * @param {string} str - The equation string
     * @returns {Object|null} {m, c} slope and intercept
     */
    parseLineEquation(str) {
        // Handle "y = mx + c" format
        const cleaned = str.replace(/\s/g, '').toLowerCase();
        
        // Match patterns like "y=2x+3", "y=-x-1", "y=3", "y=x"
        let match = cleaned.match(/^y=(-?\d*\.?\d*)?x?([+-]\d+\.?\d*)?$/);
        
        if (!match) return null;
        
        let m = 0;
        let c = 0;
        
        // Extract slope
        if (match[1] !== undefined) {
            if (match[1] === '' || match[1] === '+') {
                m = 1;
            } else if (match[1] === '-') {
                m = -1;
            } else {
                m = parseFloat(match[1]);
            }
        }
        
        // Extract intercept
        if (match[2] !== undefined) {
            c = parseFloat(match[2]);
        }
        
        return { m, c };
    },

    /**
     * Format a coordinate point for display
     * @param {Object} point - {x, y}
     * @returns {string}
     */
    formatCoordinate(point) {
        return `(${this.formatNumber(point.x)}, ${this.formatNumber(point.y)})`;
    },

    /**
     * Check if two numbers are approximately equal
     * @param {number} a 
     * @param {number} b 
     * @param {number} tolerance 
     * @returns {boolean}
     */
    isApproxEqual(a, b, tolerance = 0.01) {
        return Math.abs(a - b) <= tolerance;
    },

    /**
     * Check if two points are approximately equal
     */
    pointsEqual(p1, p2, tolerance = 0.01) {
        return this.isApproxEqual(p1.x, p2.x, tolerance) && 
               this.isApproxEqual(p1.y, p2.y, tolerance);
    },

    /**
     * Check if two arrays of numbers contain the same values (order independent)
     */
    arraysEqualUnordered(arr1, arr2, tolerance = 0.01) {
        if (arr1.length !== arr2.length) return false;
        
        const sorted1 = [...arr1].sort((a, b) => a - b);
        const sorted2 = [...arr2].sort((a, b) => a - b);
        
        return sorted1.every((val, i) => this.isApproxEqual(val, sorted2[i], tolerance));
    }
};

// =====================================================
// QUADRATIC GENERATOR
// =====================================================

const QuadraticGenerator = {
    /**
     * Generate a random quadratic based on difficulty settings
     * @param {Object} settings - Difficulty settings from CONFIG
     * @returns {Quadratic}
     */
    generate(settings) {
        const { coefficients } = settings;
        
        let a = this.randomCoefficient(coefficients.a);
        let b = this.randomCoefficient(coefficients.b);
        let c = this.randomCoefficient(coefficients.c);
        
        // Ensure a is not zero
        while (a === 0) {
            a = this.randomCoefficient(coefficients.a);
        }
        
        return new Quadratic(a, b, c);
    },

    /**
     * Generate a random coefficient based on settings
     */
    randomCoefficient(settings) {
        const { min, max, allowNegative = true, allowZero = true, allowFractions = false } = settings;
        
        let value;
        
        if (allowFractions && Math.random() < 0.2) {
            // Generate a simple fraction
            const denominators = [2, 4];
            const den = denominators[Math.floor(Math.random() * denominators.length)];
            const numRange = (max - min) * den;
            const num = Math.floor(Math.random() * numRange) + min * den;
            value = num / den;
        } else {
            value = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        // Handle zero
        if (!allowZero && value === 0) {
            value = Math.random() < 0.5 ? 1 : -1;
        }
        
        // Handle negative
        if (!allowNegative && value < 0) {
            value = Math.abs(value);
        }
        
        return value;
    },

    /**
     * Generate a quadratic with specific properties
     * @param {Object} requirements
     * @returns {Quadratic}
     */
    generateWithProperties(requirements) {
        const {
            hasRealRoots = null,
            hasIntegerRoots = false,
            opensUp = null,
            yInterceptRange = null,
            vertexInRange = null
        } = requirements;
        
        let quadratic;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            // Start with integer roots if required
            if (hasIntegerRoots) {
                const a = Math.random() < 0.5 ? 1 : -1;
                const r1 = Math.floor(Math.random() * 11) - 5;
                const r2 = Math.floor(Math.random() * 11) - 5;
                quadratic = Quadratic.fromRoots(a, r1, r2);
            } else {
                quadratic = this.generate({
                    coefficients: {
                        a: { min: -3, max: 3 },
                        b: { min: -10, max: 10 },
                        c: { min: -10, max: 10 }
                    }
                });
            }
            
            attempts++;
            
            // Check requirements
            if (opensUp !== null && (quadratic.a > 0) !== opensUp) continue;
            if (hasRealRoots !== null) {
                const hasRoots = quadratic.getXIntercepts().length > 0;
                if (hasRoots !== hasRealRoots) continue;
            }
            if (yInterceptRange) {
                const yInt = quadratic.getYIntercept();
                if (yInt < yInterceptRange.min || yInt > yInterceptRange.max) continue;
            }
            if (vertexInRange) {
                const vertex = quadratic.getTurningPoint();
                if (vertex.x < vertexInRange.xMin || vertex.x > vertexInRange.xMax) continue;
                if (vertex.y < vertexInRange.yMin || vertex.y > vertexInRange.yMax) continue;
            }
            
            // All requirements met
            return quadratic;
            
        } while (attempts < maxAttempts);
        
        // Fallback
        console.warn('Could not generate quadratic with all requirements');
        return quadratic;
    },

    /**
     * Generate a quadratic suitable for a specific question type
     */
    generateForQuestionType(questionType, difficulty) {
        switch (questionType) {
            case 'x_intercepts_factor':
                return this.generateWithProperties({ hasIntegerRoots: true });
            
            case 'discriminant':
            case 'nature_of_roots':
                // Random discriminant type
                const rand = Math.random();
                if (rand < 0.33) {
                    return this.generateWithProperties({ hasRealRoots: true });
                } else if (rand < 0.66) {
                    // Generate with D = 0
                    const a = Math.random() < 0.5 ? 1 : -1;
                    const r = Math.floor(Math.random() * 9) - 4;
                    return Quadratic.fromRoots(a, r, r);
                } else {
                    return this.generateWithProperties({ hasRealRoots: false });
                }
            
            case 'turning_point':
            case 'axis_symmetry':
                // Nice vertex coordinates
                return this.generateWithProperties({
                    vertexInRange: { xMin: -5, xMax: 5, yMin: -8, yMax: 8 }
                });
            
            default:
                return this.generate(CONFIG.difficulty[difficulty]);
        }
    }
};

// =====================================================
// LINE CLASS (for intersection problems)
// =====================================================

class Line {
    /**
     * Create a line y = mx + c
     * @param {number} m - Slope
     * @param {number} c - Y-intercept
     */
    constructor(m, c) {
        this.m = m;
        this.c = c;
    }

    /**
     * Evaluate y for a given x
     */
    evaluate(x) {
        return this.m * x + this.c;
    }

    /**
     * Get equation string
     */
    getEquation() {
        if (this.m === 0) {
            return `y = ${QuadraticUtils.formatNumber(this.c)}`;
        }
        
        let str = 'y = ';
        
        if (this.m === 1) {
            str += 'x';
        } else if (this.m === -1) {
            str += '-x';
        } else {
            str += `${QuadraticUtils.formatNumber(this.m)}x`;
        }
        
        if (this.c !== 0) {
            str += ` ${QuadraticUtils.formatSignedNumber(this.c, true)}`;
        }
        
        return str;
    }

    /**
     * Generate points for plotting
     */
    generatePoints(xMin, xMax, numPoints = 2) {
        const points = [];
        const step = (xMax - xMin) / (numPoints - 1);
        
        for (let i = 0; i < numPoints; i++) {
            const x = xMin + i * step;
            points.push({ x, y: this.evaluate(x) });
        }
        
        return points;
    }

    /**
     * Create a line from two points
     */
    static fromTwoPoints(p1, p2) {
        const m = (p2.y - p1.y) / (p2.x - p1.x);
        const c = p1.y - m * p1.x;
        return new Line(m, c);
    }

    /**
     * Create a horizontal line y = k
     */
    static horizontal(k) {
        return new Line(0, k);
    }

    /**
     * Generate a random line
     */
    static random(mRange = [-3, 3], cRange = [-5, 5]) {
        const m = Math.floor(Math.random() * (mRange[1] - mRange[0] + 1)) + mRange[0];
        const c = Math.floor(Math.random() * (cRange[1] - cRange[0] + 1)) + cRange[0];
        return new Line(m, c);
    }
}

// =====================================================
// ANSWER VALIDATOR
// =====================================================

const AnswerValidator = {
    /**
     * Validate an answer based on question type
     * @param {string} userAnswer - The user's answer
     * @param {*} correctAnswer - The correct answer
     * @param {string} questionType - Type of question
     * @param {number} tolerance - Allowed error
     * @returns {Object} {isCorrect, feedback}
     */
    validate(userAnswer, correctAnswer, questionType, tolerance = 0.05) {
        const normalized = userAnswer.trim().toLowerCase();
        
        switch (questionType) {
            case 'axis_symmetry':
            case 'axis_symmetry_basic':
                return this.validateLineOfSymmetry(normalized, correctAnswer);
            
            case 'turning_point':
            case 'turning_point_basic':
            case 'find_coordinates':
                return this.validateCoordinate(normalized, correctAnswer, tolerance);
            
            case 'x_intercepts_factor':
            case 'x_intercepts_quadratic_formula':
                return this.validateXIntercepts(normalized, correctAnswer, tolerance);
            
            case 'y_intercept':
                return this.validateYIntercept(normalized, correctAnswer, tolerance);
            
            case 'discriminant':
            case 'max_min_value':
                return this.validateNumericValue(normalized, correctAnswer, tolerance);
            
            case 'direction_opening':
            case 'nature_of_roots':
                return this.validateMultipleChoice(normalized, correctAnswer);
            
            case 'line_intersection':
                return this.validateIntersectionPoints(normalized, correctAnswer, tolerance);
            
            case 'completing_square':
            case 'vertex_form':
                return this.validateVertexForm(normalized, correctAnswer);
            
            case 'range_of_values':
                return this.validateRange(normalized, correctAnswer, tolerance);
            
            default:
                return this.validateGeneric(normalized, correctAnswer, tolerance);
        }
    },

    validateLineOfSymmetry(answer, correct) {
        // Parse "x = 2" format
        const parsed = QuadraticUtils.parseSimpleEquation(answer);
        
        if (!parsed || parsed.variable !== 'x') {
            return {
                isCorrect: false,
                feedback: 'Please enter your answer in the format "x = value"'
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(parsed.value, correct, 0.01);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Incorrect. The line of symmetry is x = ${QuadraticUtils.formatNumber(correct)}`
        };
    },

    validateCoordinate(answer, correct, tolerance) {
        const parsed = QuadraticUtils.parseCoordinate(answer);
        
        if (!parsed) {
            return {
                isCorrect: false,
                feedback: 'Please enter your answer in the format "(x, y)"'
            };
        }
        
        const isCorrect = QuadraticUtils.pointsEqual(parsed, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Incorrect. The correct answer is ${QuadraticUtils.formatCoordinate(correct)}`
        };
    },

    validateXIntercepts(answer, correct, tolerance) {
        // Parse various formats: "x = 1, 3" or "1 and 3" or "1, 3"
        const cleaned = answer.replace(/x\s*=/gi, '').replace(/and/gi, ',');
        const parts = cleaned.split(/[,\s]+/).filter(p => p.length > 0);
        
        const values = parts.map(p => parseFloat(p)).filter(n => !isNaN(n));
        
        if (values.length !== correct.length) {
            if (correct.length === 0) {
                const isNoRoots = answer.includes('no') || answer.includes('none');
                return {
                    isCorrect: isNoRoots,
                    feedback: isNoRoots ? 'Correct!' : 'This quadratic has no real roots'
                };
            }
            return {
                isCorrect: false,
                feedback: `Expected ${correct.length} x-intercept(s)`
            };
        }
        
        const isCorrect = QuadraticUtils.arraysEqualUnordered(values, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Incorrect. The x-intercepts are x = ${correct.map(v => QuadraticUtils.formatNumber(v)).join(', ')}`
        };
    },

    validateYIntercept(answer, correct, tolerance) {
        // Accept "5", "y = 5", "(0, 5)"
        let value;
        
        const coordParsed = QuadraticUtils.parseCoordinate(answer);
        if (coordParsed) {
            value = coordParsed.y;
        } else {
            const eqParsed = QuadraticUtils.parseSimpleEquation(answer);
            if (eqParsed && eqParsed.variable === 'y') {
                value = eqParsed.value;
            } else {
                value = parseFloat(answer);
            }
        }
        
        if (isNaN(value)) {
            return {
                isCorrect: false,
                feedback: 'Please enter a valid number'
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(value, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Incorrect. The y-intercept is ${QuadraticUtils.formatNumber(correct)}`
        };
    },

    validateNumericValue(answer, correct, tolerance) {
        const value = parseFloat(answer);
        
        if (isNaN(value)) {
            return {
                isCorrect: false,
                feedback: 'Please enter a valid number'
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(value, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Incorrect. The correct answer is ${QuadraticUtils.formatNumber(correct)}`
        };
    },

    validateMultipleChoice(answer, correct) {
        // Normalize both answers
        const normalizedAnswer = answer.toLowerCase().trim();
        const normalizedCorrect = correct.toLowerCase().trim();
        
        // Check for keyword matches
        const isCorrect = normalizedAnswer.includes(normalizedCorrect) || 
                         normalizedCorrect.includes(normalizedAnswer);
        
        return {
            isCorrect,
            feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is "${correct}"`
        };
    },

    validateIntersectionPoints(answer, correct, tolerance) {
        // Parse multiple coordinates
        const coordPattern = /\(([^)]+)\)/g;
        const matches = answer.match(coordPattern) || [];
        
        const parsed = matches.map(m => QuadraticUtils.parseCoordinate(m)).filter(p => p);
        
        if (parsed.length !== correct.length) {
            return {
                isCorrect: false,
                feedback: `Expected ${correct.length} intersection point(s)`
            };
        }
        
        // Check if all points match (order independent)
        const allMatch = parsed.every(p => 
            correct.some(c => QuadraticUtils.pointsEqual(p, c, tolerance))
        );
        
        return {
            isCorrect: allMatch,
            feedback: allMatch 
                ? 'Correct!' 
                : `Incorrect. The intersection points are ${correct.map(p => QuadraticUtils.formatCoordinate(p)).join(' and ')}`
        };
    },

    validateVertexForm(answer, correct) {
        // This is complex - simplified check for now
        const { a, h, k } = correct;
        
        // Check if answer contains the key values
        const hasA = answer.includes(QuadraticUtils.formatNumber(a));
        const hasH = answer.includes(QuadraticUtils.formatNumber(h));
        const hasK = answer.includes(QuadraticUtils.formatNumber(k));
        
        const isCorrect = hasA && hasH && hasK;
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? 'Correct!' 
                : `Check your answer. The vertex form is ${a}(x ${QuadraticUtils.formatSignedNumber(-h)})² ${QuadraticUtils.formatSignedNumber(k, true)}`
        };
    },

    validateRange(answer, correct, tolerance) {
        const { inequality, value } = correct;
        
        // Check for inequality symbol and value
        const hasGte = answer.includes('≥') || answer.includes('>=');
        const hasLte = answer.includes('≤') || answer.includes('<=');
        
        const correctSymbol = (inequality === 'gte' && hasGte) || (inequality === 'lte' && hasLte);
        
        // Extract number from answer
        const numMatch = answer.match(/-?\d+\.?\d*/);
        const answerValue = numMatch ? parseFloat(numMatch[0]) : NaN;
        
        const correctValue = !isNaN(answerValue) && 
                            QuadraticUtils.isApproxEqual(answerValue, value, tolerance);
        
        const isCorrect = correctSymbol && correctValue;
        
        return {
            isCorrect,
            feedback: isCorrect ? 'Correct!' : `Incorrect. ${correct.description}`
        };
    },

    validateGeneric(answer, correct, tolerance) {
        if (typeof correct === 'number') {
            return this.validateNumericValue(answer, correct, tolerance);
        }
        
        return {
            isCorrect: answer === correct.toString().toLowerCase(),
            feedback: `The correct answer is ${correct}`
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Quadratic,
        QuadraticUtils,
        QuadraticGenerator,
        Line,
        AnswerValidator
    };
}