/* =====================================================
   QUADRATIC CATAPULT QUEST - QUADRATIC MATH ENGINE
   =====================================================
   Core mathematical functions for quadratic equations
   CORRECTED: Flexible answer validation
   ===================================================== */

/**
 * Quadratic Class
 * Represents y = ax² + bx + c
 */
class Quadratic {
    constructor(a, b, c) {
        if (a === 0) {
            throw new Error('Coefficient "a" cannot be zero');
        }
        this.a = a;
        this.b = b;
        this.c = c;
        this._cache = {};
    }

    // =====================================================
    // EVALUATION
    // =====================================================
    
    evaluate(x) {
        return this.a * x * x + this.b * x + this.c;
    }

    f(x) {
        return this.evaluate(x);
    }

    // =====================================================
    // Y-INTERCEPT
    // =====================================================
    
    getYIntercept() {
        return this.c;
    }

    getYInterceptPoint() {
        return { x: 0, y: this.c };
    }

    // =====================================================
    // DIRECTION
    // =====================================================
    
    getDirection() {
        return this.a > 0 ? 'upward' : 'downward';
    }

    getExtremumType() {
        return this.a > 0 ? 'minimum' : 'maximum';
    }

    // =====================================================
    // LINE OF SYMMETRY
    // =====================================================
    
    getLineOfSymmetry() {
        if (this._cache.lineOfSymmetry === undefined) {
            this._cache.lineOfSymmetry = -this.b / (2 * this.a);
        }
        return this._cache.lineOfSymmetry;
    }

    getLineOfSymmetryEquation() {
        const x = this.getLineOfSymmetry();
        return `x = ${QuadraticUtils.formatNumber(x)}`;
    }

    // =====================================================
    // TURNING POINT (VERTEX)
    // =====================================================
    
    getTurningPoint() {
        if (this._cache.turningPoint === undefined) {
            const x = this.getLineOfSymmetry();
            const y = this.evaluate(x);
            this._cache.turningPoint = { x, y };
        }
        return { ...this._cache.turningPoint };
    }

    getVertex() {
        return this.getTurningPoint();
    }

    getExtremumValue() {
        return this.getTurningPoint().y;
    }

    // =====================================================
    // DISCRIMINANT AND ROOTS
    // =====================================================
    
    getDiscriminant() {
        if (this._cache.discriminant === undefined) {
            this._cache.discriminant = this.b * this.b - 4 * this.a * this.c;
        }
        return this._cache.discriminant;
    }

    getNatureOfRoots() {
        const D = this.getDiscriminant();
        const epsilon = 0.0001;
        
        if (D > epsilon) {
            return {
                type: 'two_distinct',
                description: 'Two different real roots',
                count: 2
            };
        } else if (Math.abs(D) <= epsilon) {
            return {
                type: 'equal',
                description: 'Two equal real roots',
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

    getXIntercepts() {
        if (this._cache.xIntercepts === undefined) {
            const D = this.getDiscriminant();
            const epsilon = 0.0001;
            
            if (D < -epsilon) {
                this._cache.xIntercepts = [];
            } else if (Math.abs(D) <= epsilon) {
                const x = -this.b / (2 * this.a);
                this._cache.xIntercepts = [x];
            } else {
                const sqrtD = Math.sqrt(D);
                const x1 = (-this.b + sqrtD) / (2 * this.a);
                const x2 = (-this.b - sqrtD) / (2 * this.a);
                this._cache.xIntercepts = x1 < x2 ? [x1, x2] : [x2, x1];
            }
        }
        return [...this._cache.xIntercepts];
    }

    getXInterceptPoints() {
        return this.getXIntercepts().map(x => ({ x, y: 0 }));
    }

    hasIntegerRoots() {
        const roots = this.getXIntercepts();
        if (roots.length === 0) return false;
        return roots.every(r => Math.abs(r - Math.round(r)) < 0.0001);
    }

    getFactoredForm() {
        const roots = this.getXIntercepts();
        if (roots.length === 0) return null;
        if (!this.hasIntegerRoots()) return null;
        
        const r1 = Math.round(roots[0]);
        const r2 = roots.length > 1 ? Math.round(roots[1]) : r1;
        
        const f1 = r1 >= 0 ? `(x - ${r1})` : `(x + ${-r1})`;
        const f2 = r2 >= 0 ? `(x - ${r2})` : `(x + ${-r2})`;
        
        if (roots.length === 1) {
            return this.a === 1 ? `${f1}²` : `${this.a}${f1}²`;
        }
        
        return this.a === 1 ? `${f1}${f2}` : `${this.a}${f1}${f2}`;
    }

    // =====================================================
    // VERTEX FORM
    // =====================================================
    
    getVertexFormCoefficients() {
        if (this._cache.vertexForm === undefined) {
            const h = -this.b / (2 * this.a);
            const k = this.c - (this.b * this.b) / (4 * this.a);
            this._cache.vertexForm = { a: this.a, h, k };
        }
        return { ...this._cache.vertexForm };
    }

    getVertexFormString() {
        const { a, h, k } = this.getVertexFormCoefficients();
        
        let str = '';
        
        if (a === 1) str = '';
        else if (a === -1) str = '-';
        else str = `${QuadraticUtils.formatNumber(a)}`;
        
        if (Math.abs(h) < 0.0001) {
            str += 'x²';
        } else if (h > 0) {
            str += `(x - ${QuadraticUtils.formatNumber(h)})²`;
        } else {
            str += `(x + ${QuadraticUtils.formatNumber(-h)})²`;
        }
        
        if (Math.abs(k) >= 0.0001) {
            if (k > 0) {
                str += ` + ${QuadraticUtils.formatNumber(k)}`;
            } else {
                str += ` - ${QuadraticUtils.formatNumber(-k)}`;
            }
        }
        
        return str;
    }

    // =====================================================
    // RANGE
    // =====================================================
    
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
    // FIND X GIVEN Y
    // =====================================================
    
    findX(y) {
        const newC = this.c - y;
        const D = this.b * this.b - 4 * this.a * newC;
        
        if (D < -0.0001) {
            return [];
        } else if (Math.abs(D) <= 0.0001) {
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
    
    getLineIntersection(m, lineC) {
        const newB = this.b - m;
        const newC = this.c - lineC;
        const D = newB * newB - 4 * this.a * newC;
        
        if (D < -0.0001) {
            return [];
        } else if (Math.abs(D) <= 0.0001) {
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
            
            return points.sort((a, b) => a.x - b.x);
        }
    }

    // =====================================================
    // STRING REPRESENTATIONS
    // =====================================================
    
    getStandardForm() {
        let str = '';
        
        // ax² term
        if (this.a === 1) str = 'x²';
        else if (this.a === -1) str = '-x²';
        else str = `${this.a}x²`;
        
        // bx term
        if (this.b !== 0) {
            if (this.b === 1) str += ' + x';
            else if (this.b === -1) str += ' - x';
            else if (this.b > 0) str += ` + ${this.b}x`;
            else str += ` - ${-this.b}x`;
        }
        
        // c term
        if (this.c !== 0) {
            if (this.c > 0) str += ` + ${this.c}`;
            else str += ` - ${-this.c}`;
        }
        
        return str;
    }

    getEquation() {
        return `y = ${this.getStandardForm()}`;
    }

    toString() {
        return this.getEquation();
    }

    // =====================================================
    // STATIC FACTORY METHODS
    // =====================================================
    
    static fromVertexForm(a, h, k) {
        const b = -2 * a * h;
        const c = a * h * h + k;
        return new Quadratic(a, b, c);
    }

    static fromRoots(a, r1, r2) {
        const b = -a * (r1 + r2);
        const c = a * r1 * r2;
        return new Quadratic(a, b, c);
    }
}

// =====================================================
// QUADRATIC UTILITIES
// =====================================================

const QuadraticUtils = {
    formatNumber(num, precision = 2) {
        if (num === undefined || num === null || isNaN(num)) return '0';
        
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        const rounded = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        return parseFloat(rounded.toFixed(precision)).toString();
    },

    formatSignedNumber(num, showPlus = false) {
        const formatted = this.formatNumber(num);
        if (num >= 0) {
            return showPlus ? `+ ${formatted}` : formatted;
        } else {
            return `- ${this.formatNumber(Math.abs(num))}`;
        }
    },

    /**
     * Parse coordinate string - VERY FLEXIBLE
     * Accepts: "(2, 3)", "(2,3)", "2, 3", "2,3", "2 3", etc.
     */
    parseCoordinate(str) {
        if (!str || typeof str !== 'string') return null;
        
        // Remove parentheses, brackets, spaces around commas
        let cleaned = str.trim()
            .replace(/[()[\]{}]/g, '')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s+/g, ',')
            .trim();
        
        const parts = cleaned.split(',').filter(p => p.length > 0);
        
        if (parts.length !== 2) return null;
        
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        
        if (isNaN(x) || isNaN(y)) return null;
        
        return { x, y };
    },

    /**
     * Parse simple equation like "x = 2" or "y = 3"
     * VERY FLEXIBLE
     */
    parseSimpleEquation(str) {
        if (!str || typeof str !== 'string') return null;
        
        const cleaned = str.toLowerCase().replace(/\s+/g, '');
        
        // Match "x=2", "x=-3", "x=2.5", "x=-2.5", etc.
        const match = cleaned.match(/^([xy])=(-?\d+\.?\d*)$/);
        
        if (match) {
            return {
                variable: match[1],
                value: parseFloat(match[2])
            };
        }
        
        // Try just a number (assume they mean the value)
        const numOnly = parseFloat(cleaned);
        if (!isNaN(numOnly)) {
            return { variable: 'x', value: numOnly };
        }
        
        return null;
    },

    /**
     * Parse multiple values - VERY FLEXIBLE
     * Accepts: "2, 3", "2 and 3", "x=2, x=3", "2 3", "2;3", etc.
     */
    parseMultipleValues(str) {
        if (!str || typeof str !== 'string') return [];
        
        let cleaned = str.toLowerCase()
            .replace(/x\s*=/gi, '')
            .replace(/y\s*=/gi, '')
            .replace(/and/gi, ',')
            .replace(/or/gi, ',')
            .replace(/;/g, ',')
            .replace(/\s+/g, ',')
            .replace(/,+/g, ',')
            .trim();
        
        if (cleaned.startsWith(',')) cleaned = cleaned.substring(1);
        if (cleaned.endsWith(',')) cleaned = cleaned.slice(0, -1);
        
        const parts = cleaned.split(',').filter(p => p.length > 0);
        const values = parts.map(p => parseFloat(p.trim())).filter(n => !isNaN(n));
        
        return values;
    },

    /**
     * Parse factored form - VERY FLEXIBLE
     * Accepts: "(x-2)(x-3)", "(x - 2)(x - 3)", "(x+2)(x+3)", etc.
     */
    parseFactoredForm(str) {
        if (!str || typeof str !== 'string') return null;
        
        const cleaned = str.toLowerCase().replace(/\s+/g, '');
        
        // Match (x±a)(x±b) pattern
        const pattern = /\(x([+-])(\d+)\)\(x([+-])(\d+)\)/;
        const match = cleaned.match(pattern);
        
        if (match) {
            const sign1 = match[1] === '+' ? 1 : -1;
            const val1 = parseInt(match[2]) * sign1;
            const sign2 = match[3] === '+' ? 1 : -1;
            const val2 = parseInt(match[4]) * sign2;
            
            // Roots are the opposite of what's in the factor
            return { r1: -val1, r2: -val2 };
        }
        
        // Try alternative patterns
        const pattern2 = /\(x([+-]\d+)\)\(x([+-]\d+)\)/;
        const match2 = cleaned.match(pattern2);
        
        if (match2) {
            const val1 = parseInt(match2[1]);
            const val2 = parseInt(match2[2]);
            return { r1: -val1, r2: -val2 };
        }
        
        return null;
    },

    parseLineEquation(str) {
        if (!str || typeof str !== 'string') return null;
        
        const cleaned = str.replace(/\s/g, '').toLowerCase();
        
        // y=mx+c, y=mx-c, y=-mx+c, y=x+c, y=c, etc.
        const patterns = [
            /^y=(-?\d*\.?\d*)x([+-]\d+\.?\d*)$/,  // y=2x+3
            /^y=(-?\d*\.?\d*)x$/,                  // y=2x
            /^y=([+-]?\d+\.?\d*)$/                 // y=3
        ];
        
        for (const pattern of patterns) {
            const match = cleaned.match(pattern);
            if (match) {
                let m = 0, c = 0;
                
                if (pattern === patterns[0]) {
                    m = match[1] === '' || match[1] === '+' ? 1 : (match[1] === '-' ? -1 : parseFloat(match[1]));
                    c = parseFloat(match[2]);
                } else if (pattern === patterns[1]) {
                    m = match[1] === '' || match[1] === '+' ? 1 : (match[1] === '-' ? -1 : parseFloat(match[1]));
                    c = 0;
                } else if (pattern === patterns[2]) {
                    m = 0;
                    c = parseFloat(match[1]);
                }
                
                return { m, c };
            }
        }
        
        return null;
    },

    formatCoordinate(point) {
        if (!point) return '(?, ?)';
        return `(${this.formatNumber(point.x)}, ${this.formatNumber(point.y)})`;
    },

    /**
     * Check if two numbers are approximately equal
     * GENEROUS tolerance for student answers
     */
    isApproxEqual(a, b, tolerance = 0.1) {
        if (a === undefined || b === undefined) return false;
        if (isNaN(a) || isNaN(b)) return false;
        return Math.abs(a - b) <= tolerance;
    },

    /**
     * Check if two points are approximately equal
     */
    pointsEqual(p1, p2, tolerance = 0.1) {
        if (!p1 || !p2) return false;
        return this.isApproxEqual(p1.x, p2.x, tolerance) && 
               this.isApproxEqual(p1.y, p2.y, tolerance);
    },

    /**
     * Check if arrays contain same values (order independent)
     */
    arraysEqualUnordered(arr1, arr2, tolerance = 0.1) {
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length) return false;
        
        const sorted1 = [...arr1].sort((a, b) => a - b);
        const sorted2 = [...arr2].sort((a, b) => a - b);
        
        return sorted1.every((val, i) => this.isApproxEqual(val, sorted2[i], tolerance));
    }
};

// =====================================================
// LINE CLASS
// =====================================================

class Line {
    constructor(m, c) {
        this.m = m;
        this.c = c;
    }

    evaluate(x) {
        return this.m * x + this.c;
    }

    getEquation() {
        if (this.m === 0) {
            return `y = ${QuadraticUtils.formatNumber(this.c)}`;
        }
        
        let str = 'y = ';
        
        if (this.m === 1) str += 'x';
        else if (this.m === -1) str += '-x';
        else str += `${QuadraticUtils.formatNumber(this.m)}x`;
        
        if (this.c !== 0) {
            if (this.c > 0) str += ` + ${QuadraticUtils.formatNumber(this.c)}`;
            else str += ` - ${QuadraticUtils.formatNumber(-this.c)}`;
        }
        
        return str;
    }

    static random(mRange = [-3, 3], cRange = [-5, 5]) {
        const m = Math.floor(Math.random() * (mRange[1] - mRange[0] + 1)) + mRange[0];
        const c = Math.floor(Math.random() * (cRange[1] - cRange[0] + 1)) + cRange[0];
        return new Line(m, c);
    }
}

// =====================================================
// ANSWER VALIDATOR - VERY FLEXIBLE!
// =====================================================

const AnswerValidator = {
    /**
     * Main validation function
     * Tries to be as flexible as possible with student input
     */
    validate(userAnswer, correctAnswer, questionType, tolerance = 0.1) {
        // Handle empty or null answers
        if (userAnswer === null || userAnswer === undefined) {
            return { isCorrect: false, feedback: 'Please enter an answer.' };
        }
        
        const answer = String(userAnswer).trim();
        
        if (answer === '') {
            return { isCorrect: false, feedback: 'Please enter an answer.' };
        }
        
        // Route to appropriate validator
        switch (questionType) {
            case 'substitution_find_y':
            case 'evaluate_at_point':
            case 'complete_table':
            case 'find_coordinates':
            case 'y_intercept':
            case 'max_min_value':
            case 'discriminant':
            case 'discriminant_basic':
                return this.validateNumber(answer, correctAnswer, tolerance);
            
            case 'substitution_find_x':
            case 'solve_equation':
            case 'x_intercepts_factor':
            case 'x_intercepts_quadratic_formula':
                return this.validateRoots(answer, correctAnswer, tolerance);
            
            case 'factorise_expression':
                return this.validateFactored(answer, correctAnswer);
            
            case 'find_equation_from_roots':
            case 'coefficients':
                return this.validateCoefficients(answer, correctAnswer);
            
            case 'axis_symmetry':
            case 'axis_symmetry_basic':
            case 'equation':
                return this.validateEquation(answer, correctAnswer, tolerance);
            
            case 'turning_point':
            case 'turning_point_basic':
            case 'vertex_form':
            case 'coordinate':
                return this.validateCoordinate(answer, correctAnswer, tolerance);
            
            case 'direction_opening':
            case 'nature_of_roots':
            case 'multiple_choice':
                return this.validateChoice(answer, correctAnswer);
            
            case 'completing_square':
            case 'multiple_values':
                return this.validateCompletingSquare(answer, correctAnswer, tolerance);
            
            case 'range_of_values':
            case 'inequality':
                return this.validateRange(answer, correctAnswer, tolerance);
            
            case 'line_intersection':
            case 'coordinates':
                return this.validateMultiplePoints(answer, correctAnswer, tolerance);
            
            default:
                return this.validateGeneric(answer, correctAnswer, tolerance);
        }
    },

    /**
     * Validate single number answer
     * Very flexible - accepts many formats
     */
    validateNumber(answer, correct, tolerance) {
        // Try to extract a number from the answer
        let value;
        
        // Remove common prefixes
        const cleaned = answer.toLowerCase()
            .replace(/^y\s*=\s*/, '')
            .replace(/^x\s*=\s*/, '')
            .replace(/^answer\s*[:=]?\s*/, '')
            .replace(/^=\s*/, '')
            .trim();
        
        value = parseFloat(cleaned);
        
        if (isNaN(value)) {
            return {
                isCorrect: false,
                feedback: `I couldn't understand "${answer}". Please enter a number.`
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(value, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. The answer is ${QuadraticUtils.formatNumber(correct)}`
        };
    },

    /**
     * Validate roots/solutions
     * Accepts many formats, order doesn't matter
     */
    validateRoots(answer, correct, tolerance) {
        // Handle "no real roots" case
        if (!Array.isArray(correct) || correct.length === 0 || correct === 'no real roots') {
            const noRootsPatterns = ['no', 'none', 'no real', 'no solution', 'no roots', 'impossible'];
            const hasNoRoots = noRootsPatterns.some(p => answer.toLowerCase().includes(p));
            
            return {
                isCorrect: hasNoRoots,
                feedback: hasNoRoots 
                    ? '✓ Correct! There are no real roots.' 
                    : '✗ Incorrect. This equation has no real roots.'
            };
        }
        
        // Parse user's answer
        const userValues = QuadraticUtils.parseMultipleValues(answer);
        
        if (userValues.length === 0) {
            return {
                isCorrect: false,
                feedback: `I couldn't understand "${answer}". Enter values like: 2, 3 or x = 2, 3`
            };
        }
        
        // Check if correct
        const isCorrect = QuadraticUtils.arraysEqualUnordered(userValues, correct, tolerance);
        
        const correctStr = correct.map(v => QuadraticUtils.formatNumber(v)).join(' or x = ');
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. The solutions are x = ${correctStr}`
        };
    },

    /**
     * Validate factored form
     * Very flexible - accepts many formats
     */
    validateFactored(answer, correct) {
        if (!correct || typeof correct !== 'object') {
            return { isCorrect: false, feedback: 'Error in question.' };
        }
        
        const { r1, r2 } = correct;
        
        // Try to parse user's factored form
        const parsed = QuadraticUtils.parseFactoredForm(answer);
        
        if (parsed) {
            // Check if roots match (order doesn't matter)
            const userRoots = [parsed.r1, parsed.r2].sort((a, b) => a - b);
            const correctRoots = [r1, r2].sort((a, b) => a - b);
            
            const isCorrect = userRoots[0] === correctRoots[0] && userRoots[1] === correctRoots[1];
            
            if (isCorrect) {
                return { isCorrect: true, feedback: '✓ Correct!' };
            }
        }
        
        // Maybe they entered just the roots?
        const userValues = QuadraticUtils.parseMultipleValues(answer);
        if (userValues.length === 2) {
            const userRoots = [...userValues].sort((a, b) => a - b);
            const correctRoots = [r1, r2].sort((a, b) => a - b);
            
            if (QuadraticUtils.isApproxEqual(userRoots[0], correctRoots[0], 0.01) &&
                QuadraticUtils.isApproxEqual(userRoots[1], correctRoots[1], 0.01)) {
                return { 
                    isCorrect: true, 
                    feedback: '✓ Correct! (The factored form would be written with brackets)' 
                };
            }
        }
        
        // Build correct factored form for feedback
        const f1 = r1 >= 0 ? `(x - ${r1})` : `(x + ${-r1})`;
        const f2 = r2 >= 0 ? `(x - ${r2})` : `(x + ${-r2})`;
        
        return {
            isCorrect: false,
            feedback: `✗ Incorrect. The factored form is ${f1}${f2}`
        };
    },

    /**
     * Validate coefficients (b and c)
     */
    validateCoefficients(answer, correct) {
        if (!correct || typeof correct !== 'object') {
            return { isCorrect: false, feedback: 'Error in question.' };
        }
        
        const { b, c } = correct;
        
        // Try to parse two values from the answer
        const values = QuadraticUtils.parseMultipleValues(answer);
        
        // Also try to find "b = X" and "c = Y" patterns
        const bMatch = answer.toLowerCase().match(/b\s*=\s*(-?\d+)/);
        const cMatch = answer.toLowerCase().match(/c\s*=\s*(-?\d+)/);
        
        let userB, userC;
        
        if (bMatch && cMatch) {
            userB = parseInt(bMatch[1]);
            userC = parseInt(cMatch[1]);
        } else if (values.length >= 2) {
            userB = values[0];
            userC = values[1];
        } else if (values.length === 1) {
            return {
                isCorrect: false,
                feedback: 'Please enter both b and c values.'
            };
        } else {
            return {
                isCorrect: false,
                feedback: `I couldn't understand "${answer}". Enter like: b = -5, c = 6`
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(userB, b, 0.01) && 
                         QuadraticUtils.isApproxEqual(userC, c, 0.01);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. b = ${b} and c = ${c}`
        };
    },

    /**
     * Validate equation like x = 2
     */
    validateEquation(answer, correct, tolerance) {
        // Try to parse as equation
        const parsed = QuadraticUtils.parseSimpleEquation(answer);
        
        if (parsed && parsed.variable === 'x') {
            const isCorrect = QuadraticUtils.isApproxEqual(parsed.value, correct, tolerance);
            return {
                isCorrect,
                feedback: isCorrect 
                    ? '✓ Correct!' 
                    : `✗ Incorrect. x = ${QuadraticUtils.formatNumber(correct)}`
            };
        }
        
        // Try just a number
        const num = parseFloat(answer.replace(/[^0-9.-]/g, ''));
        if (!isNaN(num)) {
            const isCorrect = QuadraticUtils.isApproxEqual(num, correct, tolerance);
            return {
                isCorrect,
                feedback: isCorrect 
                    ? '✓ Correct!' 
                    : `✗ Incorrect. x = ${QuadraticUtils.formatNumber(correct)}`
            };
        }
        
        return {
            isCorrect: false,
            feedback: `Please enter like: x = ${QuadraticUtils.formatNumber(correct)}`
        };
    },

    /**
     * Validate coordinate point
     */
    validateCoordinate(answer, correct, tolerance) {
        const parsed = QuadraticUtils.parseCoordinate(answer);
        
        if (!parsed) {
            // Try to extract two numbers
            const nums = QuadraticUtils.parseMultipleValues(answer);
            if (nums.length === 2) {
                const isCorrect = QuadraticUtils.isApproxEqual(nums[0], correct.x, tolerance) &&
                                 QuadraticUtils.isApproxEqual(nums[1], correct.y, tolerance);
                return {
                    isCorrect,
                    feedback: isCorrect 
                        ? '✓ Correct!' 
                        : `✗ Incorrect. The answer is (${QuadraticUtils.formatNumber(correct.x)}, ${QuadraticUtils.formatNumber(correct.y)})`
                };
            }
            
            return {
                isCorrect: false,
                feedback: 'Please enter as (x, y), for example: (2, -3)'
            };
        }
        
        const isCorrect = QuadraticUtils.pointsEqual(parsed, correct, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. The answer is (${QuadraticUtils.formatNumber(correct.x)}, ${QuadraticUtils.formatNumber(correct.y)})`
        };
    },

    /**
     * Validate multiple choice / text choice
     */
    validateChoice(answer, correct) {
        const userLower = answer.toLowerCase().trim();
        const correctLower = correct.toLowerCase().trim();
        
        // Check for exact match or contains
        const isCorrect = userLower === correctLower || 
                         userLower.includes(correctLower) ||
                         correctLower.includes(userLower);
        
        // Also check for keywords
        if (!isCorrect) {
            if (correctLower.includes('upward') || correctLower.includes('up')) {
                if (userLower.includes('up')) {
                    return { isCorrect: true, feedback: '✓ Correct!' };
                }
            }
            if (correctLower.includes('downward') || correctLower.includes('down')) {
                if (userLower.includes('down')) {
                    return { isCorrect: true, feedback: '✓ Correct!' };
                }
            }
            if (correctLower.includes('two different')) {
                if (userLower.includes('two') && (userLower.includes('different') || userLower.includes('distinct'))) {
                    return { isCorrect: true, feedback: '✓ Correct!' };
                }
            }
            if (correctLower.includes('equal')) {
                if (userLower.includes('equal') || userLower.includes('repeated') || userLower.includes('same')) {
                    return { isCorrect: true, feedback: '✓ Correct!' };
                }
            }
            if (correctLower.includes('no real')) {
                if (userLower.includes('no') || userLower.includes('none') || userLower.includes('imaginary')) {
                    return { isCorrect: true, feedback: '✓ Correct!' };
                }
            }
        }
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. The answer is: ${correct}`
        };
    },

    /**
     * Validate completing the square (a, h, k values)
     */
    validateCompletingSquare(answer, correct, tolerance) {
        if (!correct || typeof correct !== 'object') {
            return { isCorrect: false, feedback: 'Error in question.' };
        }
        
        const { a, h, k } = correct;
        const values = QuadraticUtils.parseMultipleValues(answer);
        
        // Try to find a=, h=, k= patterns
        const aMatch = answer.toLowerCase().match(/a\s*=\s*(-?\d+\.?\d*)/);
        const hMatch = answer.toLowerCase().match(/h\s*=\s*(-?\d+\.?\d*)/);
        const kMatch = answer.toLowerCase().match(/k\s*=\s*(-?\d+\.?\d*)/);
        
        let userA, userH, userK;
        
        if (aMatch && hMatch && kMatch) {
            userA = parseFloat(aMatch[1]);
            userH = parseFloat(hMatch[1]);
            userK = parseFloat(kMatch[1]);
        } else if (values.length >= 3) {
            userA = values[0];
            userH = values[1];
            userK = values[2];
        } else {
            return {
                isCorrect: false,
                feedback: 'Please enter a, h, and k values. Example: a = 1, h = 2, k = -3'
            };
        }
        
        const isCorrect = QuadraticUtils.isApproxEqual(userA, a, tolerance) &&
                         QuadraticUtils.isApproxEqual(userH, h, tolerance) &&
                         QuadraticUtils.isApproxEqual(userK, k, tolerance);
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. a = ${QuadraticUtils.formatNumber(a)}, h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`
        };
    },

    /**
     * Validate range/inequality
     */
    validateRange(answer, correct, tolerance) {
        if (!correct || typeof correct !== 'object') {
            return { isCorrect: false, feedback: 'Error in question.' };
        }
        
        const { inequality, value, description } = correct;
        
        // Extract number from answer
        const numMatch = answer.match(/-?\d+\.?\d*/);
        if (!numMatch) {
            return {
                isCorrect: false,
                feedback: `Please enter like: ${description}`
            };
        }
        
        const userValue = parseFloat(numMatch[0]);
        const valueCorrect = QuadraticUtils.isApproxEqual(userValue, value, tolerance);
        
        // Check inequality direction
        const hasGte = answer.includes('≥') || answer.includes('>=') || answer.includes('greater');
        const hasLte = answer.includes('≤') || answer.includes('<=') || answer.includes('less');
        
        const inequalityCorrect = (inequality === 'gte' && hasGte) || 
                                  (inequality === 'lte' && hasLte) ||
                                  (!hasGte && !hasLte); // Accept if they just give the number
        
        const isCorrect = valueCorrect && inequalityCorrect;
        
        return {
            isCorrect,
            feedback: isCorrect 
                ? '✓ Correct!' 
                : `✗ Incorrect. ${description}`
        };
    },

    /**
     * Validate multiple points (intersections)
     */
    validateMultiplePoints(answer, correct, tolerance) {
        if (!Array.isArray(correct)) {
            return { isCorrect: false, feedback: 'Error in question.' };
        }
        
        // Try to extract coordinate pairs
        const coordPattern = /\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?/g;
        const matches = [...answer.matchAll(coordPattern)];
        
        const userPoints = matches.map(m => ({
            x: parseFloat(m[1]),
            y: parseFloat(m[2])
        }));
        
        if (userPoints.length !== correct.length) {
            return {
                isCorrect: false,
                feedback: `Expected ${correct.length} point(s). Found ${userPoints.length}.`
            };
        }
        
        // Check if all points match (order doesn't matter)
        const allMatch = correct.every(cp => 
            userPoints.some(up => QuadraticUtils.pointsEqual(up, cp, tolerance))
        );
        
        const correctStr = correct.map(p => `(${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`).join(' and ');
        
        return {
            isCorrect: allMatch,
            feedback: allMatch 
                ? '✓ Correct!' 
                : `✗ Incorrect. The points are: ${correctStr}`
        };
    },

    /**
     * Generic validator - try everything
     */
    validateGeneric(answer, correct, tolerance) {
        // Try as number
        const num = parseFloat(answer.replace(/[^0-9.-]/g, ''));
        if (!isNaN(num) && typeof correct === 'number') {
            const isCorrect = QuadraticUtils.isApproxEqual(num, correct, tolerance);
            return {
                isCorrect,
                feedback: isCorrect ? '✓ Correct!' : `✗ Incorrect. Answer: ${correct}`
            };
        }
        
        // Try as string match
        if (typeof correct === 'string') {
            const isCorrect = answer.toLowerCase().trim() === correct.toLowerCase().trim();
            return {
                isCorrect,
                feedback: isCorrect ? '✓ Correct!' : `✗ Incorrect. Answer: ${correct}`
            };
        }
        
        return {
            isCorrect: false,
            feedback: `Could not validate answer. Expected: ${JSON.stringify(correct)}`
        };
    }
};

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Quadratic,
        QuadraticUtils,
        Line,
        AnswerValidator
    };
}