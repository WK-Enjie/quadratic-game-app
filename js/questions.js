/* =====================================================
   QUADRATIC CATAPULT QUEST - QUESTION GENERATOR
   =====================================================
   Question templates and generation for all levels
   CORRECTED: Proper questions for each level
   - Beginner (Sec 1-2): Factoring, substitution only
   - Intermediate (Sec 3): Symmetry, turning point
   - Advanced (O-Level): Full syllabus
   ===================================================== */

/**
 * Question Class
 * Represents a single question in the game
 */
class Question {
    constructor(config) {
        this.id = config.id || this.generateId();
        this.type = config.type;
        this.category = config.category;
        this.difficulty = config.difficulty;
        
        this.quadratic = config.quadratic;
        this.line = config.line || null;
        
        this.questionText = config.questionText;
        this.equationDisplay = config.equationDisplay || this.quadratic.getEquation();
        
        this.correctAnswer = config.correctAnswer;
        this.answerFormat = config.answerFormat;
        this.inputType = config.inputType;
        
        this.choices = config.choices || null;
        this.correctChoiceIndex = config.correctChoiceIndex || null;
        
        this.hints = config.hints || [];
        this.hintsUsed = 0;
        
        this.explanation = config.explanation;
        this.steps = config.steps || [];
        
        this.target = config.target || this.calculateTarget();
        
        this.timeCreated = Date.now();
        this.answered = false;
        this.userAnswer = null;
        this.isCorrect = null;
        this.timeTaken = null;
    }

    generateId() {
        return 'q_' + Math.random().toString(36).substr(2, 9);
    }

    calculateTarget() {
        let targetX = 0, targetY = 0;
        
        if (this.quadratic) {
            const xInts = this.quadratic.getXIntercepts();
            if (xInts.length > 0) {
                targetX = xInts[0];
                targetY = 0;
            } else {
                const vertex = this.quadratic.getTurningPoint();
                targetX = vertex.x;
                targetY = vertex.y;
            }
        }
        
        return { x: targetX, y: targetY };
    }

    getNextHint() {
        if (this.hintsUsed >= this.hints.length) return null;
        return this.hints[this.hintsUsed++];
    }

    hasMoreHints() {
        return this.hintsUsed < this.hints.length;
    }

    validate(answer) {
        this.userAnswer = answer;
        const result = AnswerValidator.validate(answer, this.correctAnswer, this.type);
        this.isCorrect = result.isCorrect;
        this.answered = true;
        return { ...result, explanation: this.explanation, steps: this.steps };
    }

    getDisplayData() {
        return {
            id: this.id,
            type: this.type,
            category: this.category,
            equation: this.equationDisplay,
            question: this.questionText,
            inputType: this.inputType,
            answerFormat: this.answerFormat,
            choices: this.choices,
            hasHints: this.hints.length > 0,
            hintsRemaining: this.hints.length - this.hintsUsed
        };
    }
}

/**
 * QuadraticGenerator
 * Generates quadratics appropriate for each level
 */
const QuadraticGenerator = {
    /**
     * Generate quadratic for beginner level
     * MUST have integer roots for factorization
     */
    generateForBeginner() {
        // Generate from integer roots to ensure factorability
        // y = (x - r1)(x - r2) = x² - (r1+r2)x + r1*r2
        
        const r1 = this.randomInt(-6, 6);
        const r2 = this.randomInt(-6, 6);
        
        // a = 1 for beginners
        const a = 1;
        const b = -(r1 + r2);
        const c = r1 * r2;
        
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate quadratic with specific integer roots
     */
    generateWithIntegerRoots(r1, r2, a = 1) {
        const b = -a * (r1 + r2);
        const c = a * r1 * r2;
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate quadratic with integer vertex
     */
    generateWithIntegerVertex(h, k, a = 1) {
        // y = a(x - h)² + k = ax² - 2ahx + ah² + k
        const b = -2 * a * h;
        const c = a * h * h + k;
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate quadratic for intermediate level
     */
    generateForIntermediate() {
        // Can have non-integer vertex but prefer nice numbers
        const a = Math.random() < 0.7 ? 1 : (Math.random() < 0.5 ? -1 : 2);
        const h = this.randomInt(-5, 5);
        const k = this.randomInt(-8, 8);
        
        return Quadratic.fromVertexForm(a, h, k);
    },
    
    /**
     * Generate quadratic for advanced level
     */
    generateForAdvanced() {
        const a = this.randomInt(1, 3) * (Math.random() < 0.3 ? -1 : 1);
        const b = this.randomInt(-10, 10);
        const c = this.randomInt(-15, 15);
        
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate based on difficulty
     */
    generate(difficultyConfig) {
        const difficulty = difficultyConfig.id || 'beginner';
        
        switch (difficulty) {
            case 'beginner':
                return this.generateForBeginner();
            case 'intermediate':
                return this.generateForIntermediate();
            case 'advanced':
            case 'expert':
                return this.generateForAdvanced();
            default:
                return this.generateForBeginner();
        }
    },
    
    /**
     * Generate for specific question type
     */
    generateForQuestionType(questionType, difficultyId) {
        switch (questionType) {
            // Beginner types - must have integer roots
            case 'x_intercepts_factor':
            case 'find_x_given_y_basic':
            case 'find_y_given_x':
            case 'y_intercept':
            case 'direction_opening':
                return this.generateForBeginner();
            
            // Intermediate - integer vertex preferred
            case 'axis_symmetry_basic':
            case 'turning_point_basic':
                const h = this.randomInt(-4, 4);
                const k = this.randomInt(-6, 6);
                return this.generateWithIntegerVertex(h, k, 1);
            
            // Intermediate - can have decimal answers
            case 'axis_symmetry':
            case 'turning_point':
            case 'max_min_value':
                return this.generateForIntermediate();
            
            // Advanced
            case 'discriminant':
            case 'nature_of_roots':
                // Generate variety of discriminant cases
                const rand = Math.random();
                if (rand < 0.4) {
                    // Two distinct roots
                    return this.generateForBeginner();
                } else if (rand < 0.7) {
                    // Equal roots (perfect square)
                    const r = this.randomInt(-5, 5);
                    return this.generateWithIntegerRoots(r, r);
                } else {
                    // No real roots
                    const a = 1;
                    const b = this.randomInt(-4, 4);
                    const c = Math.floor(b * b / 4) + this.randomInt(1, 5);
                    return new Quadratic(a, b, c);
                }
            
            default:
                return this.generate(CONFIG.difficulty[difficultyId] || CONFIG.difficulty.beginner);
        }
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

/**
 * QuestionGenerator
 * Creates questions appropriate for each level
 */
const QuestionGenerator = {
    /**
     * Generate question based on difficulty
     */
    generate(difficultyId) {
        const config = CONFIG.difficulty[difficultyId];
        if (!config) {
            console.error(`Unknown difficulty: ${difficultyId}`);
            return null;
        }
        
        const topics = config.topics;
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const quadratic = QuadraticGenerator.generateForQuestionType(randomTopic, difficultyId);
        
        return this.generateByType(randomTopic, quadratic, difficultyId);
    },

    /**
     * Generate question by type
     */
    generateByType(type, quadratic, difficultyId) {
        const generators = {
            // ============ BEGINNER (Sec 1-2) ============
            'direction_opening': this.generateDirectionOpening,
            'y_intercept': this.generateYIntercept,
            'x_intercepts_factor': this.generateXInterceptsFactor,
            'find_y_given_x': this.generateFindYGivenX,
            'find_x_given_y_basic': this.generateFindXGivenYBasic,
            'evaluate_expression': this.generateEvaluateExpression,
            
            // ============ INTERMEDIATE (Sec 3) ============
            'axis_symmetry_basic': this.generateAxisSymmetryBasic,
            'axis_symmetry': this.generateAxisSymmetry,
            'turning_point_basic': this.generateTurningPointBasic,
            'turning_point': this.generateTurningPoint,
            'max_min_value': this.generateMaxMinValue,
            'vertex_form': this.generateVertexForm,
            'discriminant_basic': this.generateDiscriminantBasic,
            
            // ============ ADVANCED (O-Level) ============
            'x_intercepts_quadratic_formula': this.generateXInterceptsFormula,
            'discriminant': this.generateDiscriminant,
            'nature_of_roots': this.generateNatureOfRoots,
            'completing_square': this.generateCompletingSquare,
            'line_intersection': this.generateLineIntersection,
            'find_coordinates': this.generateFindCoordinates,
            'range_of_values': this.generateRangeOfValues
        };
        
        const generator = generators[type];
        if (!generator) {
            console.warn(`No generator for type: ${type}, using default`);
            return this.generateFindYGivenX.call(this, quadratic, difficultyId);
        }
        
        return generator.call(this, quadratic, difficultyId);
    },

    // =========================================================
    // BEGINNER QUESTIONS (Sec 1-2)
    // Only: substitution, factoring, basic evaluation
    // =========================================================

    /**
     * Direction of opening - Multiple choice
     */
    generateDirectionOpening(quadratic, difficultyId) {
        const direction = quadratic.getDirection();
        const a = quadratic.a;
        
        return new Question({
            type: 'direction_opening',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: `For the equation ${quadratic.getEquation()}, does the graph open upwards or downwards?`,
            inputType: 'multiple_choice',
            correctAnswer: direction,
            correctChoiceIndex: direction === 'upward' ? 0 : 1,
            choices: ['Upwards (U-shape)', 'Downwards (n-shape)'],
            hints: [
                { text: 'Look at the number in front of x².' },
                { text: 'If the number is positive, it opens upwards. If negative, it opens downwards.' }
            ],
            explanation: `The coefficient of x² is ${a}. Since ${a} is ${a > 0 ? 'positive' : 'negative'}, the graph opens ${direction}.`,
            steps: [
                `Look at the coefficient of x²: ${a}`,
                `${a} is ${a > 0 ? 'positive (> 0)' : 'negative (< 0)'}`,
                `Therefore, the graph opens ${direction}`
            ]
        });
    },

    /**
     * Y-intercept - Just find the constant c
     */
    generateYIntercept(quadratic, difficultyId) {
        const yInt = quadratic.getYIntercept();
        
        return new Question({
            type: 'y_intercept',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: `For ${quadratic.getEquation()}, find the y-intercept.`,
            answerFormat: 'Enter a number',
            inputType: 'value',
            correctAnswer: yInt,
            choices: null,
            hints: [
                { text: 'The y-intercept is where the graph crosses the y-axis.' },
                { text: 'At the y-axis, x = 0. What is y when x = 0?' }
            ],
            explanation: `When x = 0, y = ${quadratic.a}(0)² + ${quadratic.b}(0) + ${quadratic.c} = ${yInt}. The y-intercept is ${yInt}.`,
            steps: [
                'The y-intercept is where x = 0',
                `y = ${quadratic.a}(0)² + ${quadratic.b}(0) + ${quadratic.c}`,
                `y = 0 + 0 + ${quadratic.c}`,
                `y = ${yInt}`
            ]
        });
    },

    /**
     * Find y given x - Basic substitution
     */
    generateFindYGivenX(quadratic, difficultyId) {
        // Choose a simple integer x value
        const x = QuadraticGenerator.randomInt(-5, 5);
        const y = quadratic.evaluate(x);
        
        return new Question({
            type: 'find_y_given_x',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: `For ${quadratic.getEquation()}, find the value of y when x = ${x}.`,
            answerFormat: 'Enter a number',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Substitute x = ${x} into the equation.` },
                { text: `Calculate ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}` }
            ],
            explanation: `When x = ${x}: y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c} = ${y}`,
            steps: [
                `Substitute x = ${x} into y = ${quadratic.getStandardForm()}`,
                `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `y = ${quadratic.a}(${x * x}) + ${quadratic.b * x} + ${quadratic.c}`,
                `y = ${quadratic.a * x * x} + ${quadratic.b * x} + ${quadratic.c}`,
                `y = ${y}`
            ]
        });
    },

    /**
     * Find x given y - Requires solving/factoring
     * For beginners, use y = 0 (x-intercepts) or simple values
     */
    generateFindXGivenYBasic(quadratic, difficultyId) {
        // For beginners, ask for x-intercepts (y = 0)
        const xIntercepts = quadratic.getXIntercepts();
        
        if (xIntercepts.length === 0) {
            // No real roots, regenerate
            const newQuad = QuadraticGenerator.generateForBeginner();
            return this.generateFindXGivenYBasic(newQuad, difficultyId);
        }
        
        // Round to integers
        const roots = xIntercepts.map(x => Math.round(x));
        
        return new Question({
            type: 'find_x_given_y_basic',
            category: 'basic',
            difficulty: 2,
            quadratic: quadratic,
            questionText: `For ${quadratic.getEquation()}, find the value(s) of x when y = 0.`,
            answerFormat: roots.length === 1 ? 'x = ?' : 'x = ? or x = ?',
            inputType: 'values',
            correctAnswer: roots,
            hints: [
                { text: 'Set the equation equal to 0 and solve.' },
                { text: 'Try to factorise the expression.' },
                { text: `Look for two numbers that multiply to give ${quadratic.c} and add to give ${quadratic.b}.` }
            ],
            explanation: roots.length === 1 
                ? `Solving ${quadratic.getStandardForm()} = 0 gives x = ${roots[0]} (repeated root)`
                : `Solving ${quadratic.getStandardForm()} = 0 gives x = ${roots[0]} or x = ${roots[1]}`,
            steps: this.getFactoringSteps(quadratic, roots)
        });
    },

    /**
     * Get factoring steps for explanation
     */
    getFactoringSteps(quadratic, roots) {
        if (roots.length === 1) {
            const r = roots[0];
            return [
                `Set ${quadratic.getStandardForm()} = 0`,
                `Factorise: (x ${r >= 0 ? '- ' + r : '+ ' + (-r)})² = 0`,
                `x ${r >= 0 ? '- ' + r : '+ ' + (-r)} = 0`,
                `x = ${r}`
            ];
        } else {
            const r1 = roots[0];
            const r2 = roots[1];
            return [
                `Set ${quadratic.getStandardForm()} = 0`,
                `Find two numbers that multiply to ${quadratic.c} and add to ${quadratic.b}`,
                `The numbers are ${-r1} and ${-r2}`,
                `Factorise: (x ${r1 >= 0 ? '- ' + r1 : '+ ' + (-r1)})(x ${r2 >= 0 ? '- ' + r2 : '+ ' + (-r2)}) = 0`,
                `x = ${r1} or x = ${r2}`
            ];
        }
    },

    /**
     * X-intercepts by factoring
     */
    generateXInterceptsFactor(quadratic, difficultyId) {
        // Ensure we have integer roots
        if (!quadratic.hasIntegerRoots()) {
            quadratic = QuadraticGenerator.generateForBeginner();
        }
        
        const intercepts = quadratic.getXIntercepts();
        
        if (intercepts.length === 0) {
            // Regenerate with roots
            quadratic = QuadraticGenerator.generateForBeginner();
            return this.generateXInterceptsFactor(quadratic, difficultyId);
        }
        
        const roots = intercepts.map(x => Math.round(x));
        const factored = quadratic.getFactoredForm();
        
        return new Question({
            type: 'x_intercepts_factor',
            category: 'intercepts',
            difficulty: 2,
            quadratic: quadratic,
            questionText: `Solve ${quadratic.getStandardForm()} = 0 by factorisation.`,
            answerFormat: roots.length === 1 ? 'x = ?' : 'x = ?, ?',
            inputType: 'values',
            correctAnswer: roots,
            hints: [
                { text: `Find two numbers that multiply to give ${quadratic.c}.` },
                { text: `Those numbers should also add to give ${quadratic.b}.` },
                { text: factored ? `The factorised form is ${factored}` : 'Keep trying!' }
            ],
            explanation: `${quadratic.getStandardForm()} = ${factored} = 0, so ${roots.length === 1 ? `x = ${roots[0]}` : `x = ${roots[0]} or x = ${roots[1]}`}`,
            steps: this.getFactoringSteps(quadratic, roots)
        });
    },

    /**
     * Evaluate expression - Basic calculation
     */
    generateEvaluateExpression(quadratic, difficultyId) {
        const x = QuadraticGenerator.randomInt(-4, 4);
        const y = quadratic.evaluate(x);
        
        return new Question({
            type: 'evaluate_expression',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: `If y = ${quadratic.getStandardForm()}, calculate y when x = ${x}.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Replace every x with ${x}.` },
                { text: `Remember: (${x})² = ${x * x}` }
            ],
            explanation: `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c} = ${y}`,
            steps: [
                `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `y = ${quadratic.a} × ${x * x} + ${quadratic.b * x} + ${quadratic.c}`,
                `y = ${quadratic.a * x * x} + ${quadratic.b * x} + ${quadratic.c}`,
                `y = ${y}`
            ]
        });
    },

    // =========================================================
    // INTERMEDIATE QUESTIONS (Sec 3)
    // Line of symmetry, turning point, max/min
    // =========================================================

    /**
     * Line of symmetry - Basic (integer answer)
     */
    generateAxisSymmetryBasic(quadratic, difficultyId) {
        // Ensure integer line of symmetry
        const los = quadratic.getLineOfSymmetry();
        
        if (!Number.isInteger(los)) {
            // Regenerate with integer symmetry
            const h = QuadraticGenerator.randomInt(-5, 5);
            const k = QuadraticGenerator.randomInt(-8, 8);
            quadratic = QuadraticGenerator.generateWithIntegerVertex(h, k, 1);
        }
        
        const lineOfSym = Math.round(quadratic.getLineOfSymmetry());
        
        return new Question({
            type: 'axis_symmetry_basic',
            category: 'symmetry',
            difficulty: 2,
            quadratic: quadratic,
            questionText: `Find the equation of the line of symmetry for ${quadratic.getEquation()}.`,
            answerFormat: 'x = ?',
            inputType: 'equation',
            correctAnswer: lineOfSym,
            hints: [
                { text: 'The line of symmetry passes through the turning point.' },
                { text: 'Use the formula: x = -b ÷ (2a)', formula: 'x = -b/(2a)' },
                { text: `Here, a = ${quadratic.a} and b = ${quadratic.b}` }
            ],
            explanation: `Using x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${lineOfSym}`,
            steps: [
                `From y = ${quadratic.getStandardForm()}: a = ${quadratic.a}, b = ${quadratic.b}`,
                `Line of symmetry: x = -b/(2a)`,
                `x = -(${quadratic.b}) ÷ (2 × ${quadratic.a})`,
                `x = ${-quadratic.b} ÷ ${2 * quadratic.a}`,
                `x = ${lineOfSym}`
            ]
        });
    },

    /**
     * Line of symmetry - Can have decimal
     */
    generateAxisSymmetry(quadratic, difficultyId) {
        const los = quadratic.getLineOfSymmetry();
        
        return new Question({
            type: 'axis_symmetry',
            category: 'symmetry',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the line of symmetry for ${quadratic.getEquation()}.`,
            answerFormat: 'x = ? (can be decimal)',
            inputType: 'equation',
            correctAnswer: los,
            hints: [
                { text: 'Use the formula x = -b/(2a)', formula: 'x = -b/(2a)' }
            ],
            explanation: `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${los}`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}`,
                `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a})`,
                `x = ${-quadratic.b}/${2 * quadratic.a}`,
                `x = ${QuadraticUtils.formatNumber(los)}`
            ]
        });
    },

    /**
     * Turning point - Basic (integer coordinates)
     */
    generateTurningPointBasic(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        
        // Check if integer
        if (!Number.isInteger(tp.x) || !Number.isInteger(tp.y)) {
            const h = QuadraticGenerator.randomInt(-4, 4);
            const k = QuadraticGenerator.randomInt(-6, 6);
            quadratic = QuadraticGenerator.generateWithIntegerVertex(h, k, 1);
        }
        
        const vertex = quadratic.getTurningPoint();
        const roundedVertex = {
            x: Math.round(vertex.x),
            y: Math.round(vertex.y)
        };
        
        return new Question({
            type: 'turning_point_basic',
            category: 'turning_point',
            difficulty: 2,
            quadratic: quadratic,
            questionText: `Find the coordinates of the turning point for ${quadratic.getEquation()}.`,
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: roundedVertex,
            hints: [
                { text: 'First find the x-coordinate using x = -b/(2a).' },
                { text: 'Then substitute this x value back into the equation to find y.' }
            ],
            explanation: `Turning point: (${roundedVertex.x}, ${roundedVertex.y})`,
            steps: [
                `x-coordinate: x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${roundedVertex.x}`,
                `y-coordinate: substitute x = ${roundedVertex.x}`,
                `y = ${quadratic.a}(${roundedVertex.x})² + ${quadratic.b}(${roundedVertex.x}) + ${quadratic.c}`,
                `y = ${roundedVertex.y}`,
                `Turning point: (${roundedVertex.x}, ${roundedVertex.y})`
            ]
        });
    },

    /**
     * Turning point - General
     */
    generateTurningPoint(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        const type = quadratic.getExtremumType();
        
        return new Question({
            type: 'turning_point',
            category: 'turning_point',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the ${type} point of ${quadratic.getEquation()}.`,
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: tp,
            hints: [
                { text: `Since a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'}, this is a ${type}.` },
                { text: 'Use x = -b/(2a) to find the x-coordinate.' }
            ],
            explanation: `The ${type} point is (${QuadraticUtils.formatNumber(tp.x)}, ${QuadraticUtils.formatNumber(tp.y)})`,
            steps: [
                `a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'} → ${type}`,
                `x = -b/(2a) = ${QuadraticUtils.formatNumber(tp.x)}`,
                `y = f(${QuadraticUtils.formatNumber(tp.x)}) = ${QuadraticUtils.formatNumber(tp.y)}`,
                `${type.charAt(0).toUpperCase() + type.slice(1)} point: (${QuadraticUtils.formatNumber(tp.x)}, ${QuadraticUtils.formatNumber(tp.y)})`
            ]
        });
    },

    /**
     * Maximum/Minimum value
     */
    generateMaxMinValue(quadratic, difficultyId) {
        const extremum = quadratic.getExtremumValue();
        const type = quadratic.getExtremumType();
        
        return new Question({
            type: 'max_min_value',
            category: 'optimization',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the ${type} value of y for ${quadratic.getEquation()}.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: extremum,
            hints: [
                { text: `This parabola opens ${quadratic.getDirection()}, so it has a ${type}.` },
                { text: 'Find the y-coordinate of the turning point.' }
            ],
            explanation: `The ${type} value is y = ${QuadraticUtils.formatNumber(extremum)}`,
            steps: [
                `a = ${quadratic.a} → parabola has a ${type}`,
                `x = -b/(2a) = ${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}`,
                `${type} y = f(${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}) = ${QuadraticUtils.formatNumber(extremum)}`
            ]
        });
    },

    /**
     * Vertex form identification
     */
    generateVertexForm(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexFormStr = quadratic.getVertexFormString();
        
        return new Question({
            type: 'vertex_form',
            category: 'transformation',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: `y = ${vertexFormStr}`,
            questionText: `Given y = ${vertexFormStr}, find the coordinates of the vertex.`,
            answerFormat: '(h, k)',
            inputType: 'coordinate',
            correctAnswer: { x: h, y: k },
            hints: [
                { text: 'In y = a(x - h)² + k, the vertex is at (h, k).' },
                { text: 'Be careful with signs!' }
            ],
            explanation: `From y = ${vertexFormStr}, the vertex is (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)})`,
            steps: [
                `Compare with y = a(x - h)² + k`,
                `h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`,
                `Vertex: (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)})`
            ]
        });
    },

    /**
     * Discriminant - Basic
     */
    generateDiscriminantBasic(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'discriminant_basic',
            category: 'roots',
            difficulty: 2,
            quadratic: quadratic,
            questionText: `Calculate the discriminant of ${quadratic.getEquation()}.`,
            answerFormat: 'D = ?',
            inputType: 'value',
            correctAnswer: D,
            hints: [
                { text: 'The discriminant formula is D = b² - 4ac', formula: 'D = b² - 4ac' },
                { text: `a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}` }
            ],
            explanation: `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c}) = ${D}`,
            steps: [
                `D = b² - 4ac`,
                `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c})`,
                `D = ${quadratic.b * quadratic.b} - ${4 * quadratic.a * quadratic.c}`,
                `D = ${D}`
            ]
        });
    },

    // =========================================================
    // ADVANCED QUESTIONS (O-Level)
    // =========================================================

    /**
     * X-intercepts using quadratic formula
     */
    generateXInterceptsFormula(quadratic, difficultyId) {
        const intercepts = quadratic.getXIntercepts();
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'x_intercepts_quadratic_formula',
            category: 'intercepts',
            difficulty: 4,
            quadratic: quadratic,
            questionText: `Solve ${quadratic.getStandardForm()} = 0 using the quadratic formula. Give answers to 2 d.p. if needed.`,
            answerFormat: intercepts.length > 0 ? 'x = ?, ?' : 'No real roots',
            inputType: 'values',
            correctAnswer: intercepts.length > 0 ? intercepts.map(x => Math.round(x * 100) / 100) : [],
            hints: [
                { text: 'Use x = (-b ± √(b²-4ac))/(2a)', formula: 'x = (-b ± √D)/(2a)' },
                { text: `D = ${D}` }
            ],
            explanation: intercepts.length > 0
                ? `x = ${intercepts.map(x => QuadraticUtils.formatNumber(x)).join(' or x = ')}`
                : 'No real roots (D < 0)',
            steps: [
                `D = b² - 4ac = ${D}`,
                ...(D >= 0 ? [
                    `√D = ${QuadraticUtils.formatNumber(Math.sqrt(D))}`,
                    `x = (${-quadratic.b} ± ${QuadraticUtils.formatNumber(Math.sqrt(D))})/${2 * quadratic.a}`,
                    intercepts.map(x => `x = ${QuadraticUtils.formatNumber(x)}`).join(' or ')
                ] : ['D < 0, no real solutions'])
            ]
        });
    },

    /**
     * Discriminant calculation
     */
    generateDiscriminant(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'discriminant',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the discriminant of ${quadratic.getEquation()}.`,
            answerFormat: 'D = b² - 4ac',
            inputType: 'value',
            correctAnswer: D,
            hints: [
                { text: 'D = b² - 4ac', formula: 'D = b² - 4ac' }
            ],
            explanation: `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c}) = ${D}`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}`,
                `D = b² - 4ac`,
                `D = ${quadratic.b * quadratic.b} - ${4 * quadratic.a * quadratic.c}`,
                `D = ${D}`
            ]
        });
    },

    /**
     * Nature of roots
     */
    generateNatureOfRoots(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        const nature = quadratic.getNatureOfRoots();
        
        const choices = [
            'Two different real roots',
            'Two equal real roots',
            'No real roots'
        ];
        
        let correctIndex = 0;
        if (D === 0) correctIndex = 1;
        else if (D < 0) correctIndex = 2;
        
        return new Question({
            type: 'nature_of_roots',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Determine the nature of the roots of ${quadratic.getEquation()}.`,
            inputType: 'multiple_choice',
            correctAnswer: choices[correctIndex],
            correctChoiceIndex: correctIndex,
            choices: choices,
            hints: [
                { text: 'First calculate D = b² - 4ac' },
                { text: 'D > 0: two different roots, D = 0: equal roots, D < 0: no real roots' }
            ],
            explanation: `D = ${D}. Since D ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}, there are ${choices[correctIndex].toLowerCase()}.`,
            steps: [
                `D = b² - 4ac = ${D}`,
                `D ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}`,
                `Therefore: ${choices[correctIndex]}`
            ]
        });
    },

    /**
     * Completing the square
     */
    generateCompletingSquare(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexFormStr = quadratic.getVertexFormString();
        
        return new Question({
            type: 'completing_square',
            category: 'transformation',
            difficulty: 4,
            quadratic: quadratic,
            questionText: `Write ${quadratic.getEquation()} in the form a(x - h)² + k.`,
            answerFormat: 'State the values of a, h and k',
            inputType: 'multiple_values',
            correctAnswer: { a, h, k },
            hints: [
                { text: 'Complete the square by halving the coefficient of x.' },
                { text: 'y = a(x² + (b/a)x) + c, then complete the square inside.' }
            ],
            explanation: `${quadratic.getEquation()} = ${vertexFormStr}. So a = ${a}, h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`,
            steps: [
                `y = ${quadratic.getStandardForm()}`,
                `y = ${vertexFormStr}`,
                `a = ${a}, h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`
            ]
        });
    },

    /**
     * Line intersection
     */
    generateLineIntersection(quadratic, difficultyId) {
        // Create a line that intersects the parabola at nice points
        const r1 = QuadraticGenerator.randomInt(-3, 3);
        const r2 = QuadraticGenerator.randomInt(-3, 3);
        
        const y1 = quadratic.evaluate(r1);
        const y2 = quadratic.evaluate(r2);
        
        // Line through (r1, y1) and (r2, y2)
        let m, c;
        if (r1 !== r2) {
            m = (y2 - y1) / (r2 - r1);
            c = y1 - m * r1;
        } else {
            // Horizontal line
            m = 0;
            c = y1;
        }
        
        const line = new Line(m, c);
        const intersections = quadratic.getLineIntersection(m, c);
        
        return new Question({
            type: 'line_intersection',
            category: 'intersection',
            difficulty: 5,
            quadratic: quadratic,
            line: line,
            questionText: `Find where ${quadratic.getEquation()} meets the line ${line.getEquation()}.`,
            answerFormat: '(x₁, y₁) and (x₂, y₂)',
            inputType: 'coordinates',
            correctAnswer: intersections,
            hints: [
                { text: 'Set the two equations equal to each other.' },
                { text: 'Rearrange to form a quadratic and solve.' }
            ],
            explanation: `Intersection points: ${intersections.map(p => `(${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`).join(' and ')}`,
            steps: [
                `Set ${quadratic.getStandardForm()} = ${m}x + ${c}`,
                `Solve the resulting equation`,
                ...intersections.map((p, i) => `Point ${i + 1}: (${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`)
            ]
        });
    },

    /**
     * Find coordinates on curve
     */
    generateFindCoordinates(quadratic, difficultyId) {
        const x = QuadraticGenerator.randomInt(-5, 5);
        const y = quadratic.evaluate(x);
        
        return new Question({
            type: 'find_coordinates',
            category: 'coordinates',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the y-coordinate when x = ${x} for ${quadratic.getEquation()}.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Substitute x = ${x} into the equation.` }
            ],
            explanation: `When x = ${x}, y = ${y}`,
            steps: [
                `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `y = ${quadratic.a * x * x} + ${quadratic.b * x} + ${quadratic.c}`,
                `y = ${y}`
            ]
        });
    },

    /**
     * Range of values
     */
    generateRangeOfValues(quadratic, difficultyId) {
        const range = quadratic.getRange();
        
        return new Question({
            type: 'range_of_values',
            category: 'range',
            difficulty: 4,
            quadratic: quadratic,
            questionText: `State the range of ${quadratic.getEquation()}.`,
            answerFormat: 'y ≥ ? or y ≤ ?',
            inputType: 'inequality',
            correctAnswer: range,
            hints: [
                { text: 'Find the turning point first.' },
                { text: `This parabola has a ${quadratic.getExtremumType()}.` }
            ],
            explanation: range.description,
            steps: [
                `The parabola has a ${quadratic.getExtremumType()} at y = ${QuadraticUtils.formatNumber(range.value)}`,
                `Range: ${range.description}`
            ]
        });
    },

    // =========================================================
    // UTILITY METHODS
    // =========================================================

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Generate a set of questions for a level
     */
    generateQuestionSet(difficultyId, count) {
        const config = CONFIG.difficulty[difficultyId];
        if (!config) return [];
        
        const questions = [];
        const topics = [...config.topics];
        
        for (let i = 0; i < count; i++) {
            const topicIndex = i % topics.length;
            const topic = topics[topicIndex];
            
            const quadratic = QuadraticGenerator.generateForQuestionType(topic, difficultyId);
            const question = this.generateByType(topic, quadratic, difficultyId);
            
            if (question) {
                questions.push(question);
            }
        }
        
        return this.shuffleArray(questions);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Question, QuestionGenerator, QuadraticGenerator };
}