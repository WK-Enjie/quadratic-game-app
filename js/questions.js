/* =====================================================
   QUADRATIC CATAPULT QUEST - QUESTION GENERATOR
   =====================================================
   Question templates and generation for all levels
   ===================================================== */

/**
 * Question Class
 * Represents a single question in the game
 */
class Question {
    /**
     * Create a new Question
     * @param {Object} config - Question configuration
     */
    constructor(config) {
        this.id = config.id || this.generateId();
        this.type = config.type;
        this.category = config.category;
        this.difficulty = config.difficulty;
        
        // The quadratic equation
        this.quadratic = config.quadratic;
        
        // Optional line for intersection questions
        this.line = config.line || null;
        
        // Question text and display
        this.questionText = config.questionText;
        this.equationDisplay = config.equationDisplay || this.quadratic.getEquation();
        
        // Answer information
        this.correctAnswer = config.correctAnswer;
        this.answerFormat = config.answerFormat;
        this.inputType = config.inputType;
        
        // Multiple choice options (if applicable)
        this.choices = config.choices || null;
        this.correctChoiceIndex = config.correctChoiceIndex || null;
        
        // Hints
        this.hints = config.hints || [];
        this.hintsUsed = 0;
        
        // Explanation for learning
        this.explanation = config.explanation;
        this.steps = config.steps || [];
        
        // Target position for the catapult game
        this.target = config.target || this.calculateTarget();
        
        // Metadata
        this.timeCreated = Date.now();
        this.answered = false;
        this.userAnswer = null;
        this.isCorrect = null;
        this.timeTaken = null;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'q_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Calculate target position based on correct answer
     */
    calculateTarget() {
        // Place target at a point related to the answer
        let targetX, targetY;
        
        switch (this.type) {
            case 'turning_point':
            case 'turning_point_basic':
                const vertex = this.quadratic.getTurningPoint();
                targetX = vertex.x;
                targetY = vertex.y;
                break;
            
            case 'x_intercepts_factor':
            case 'x_intercepts_quadratic_formula':
                const intercepts = this.quadratic.getXIntercepts();
                if (intercepts.length > 0) {
                    targetX = intercepts[0];
                    targetY = 0;
                } else {
                    targetX = this.quadratic.getLineOfSymmetry();
                    targetY = this.quadratic.getTurningPoint().y;
                }
                break;
            
            case 'y_intercept':
                targetX = 0;
                targetY = this.quadratic.getYIntercept();
                break;
            
            case 'line_intersection':
                const intersections = this.quadratic.getLineIntersection(this.line.m, this.line.c);
                if (intersections.length > 0) {
                    targetX = intersections[0].x;
                    targetY = intersections[0].y;
                }
                break;
            
            default:
                // Default to turning point
                const tp = this.quadratic.getTurningPoint();
                targetX = tp.x;
                targetY = tp.y;
        }
        
        return { x: targetX, y: targetY };
    }

    /**
     * Get the next available hint
     * @returns {Object|null} Hint object or null if no more hints
     */
    getNextHint() {
        if (this.hintsUsed >= this.hints.length) {
            return null;
        }
        
        const hint = this.hints[this.hintsUsed];
        this.hintsUsed++;
        return hint;
    }

    /**
     * Check if more hints are available
     */
    hasMoreHints() {
        return this.hintsUsed < this.hints.length;
    }

    /**
     * Validate user answer
     * @param {string} answer - User's answer
     * @returns {Object} Validation result
     */
    validate(answer) {
        this.userAnswer = answer;
        
        const result = AnswerValidator.validate(
            answer,
            this.correctAnswer,
            this.type
        );
        
        this.isCorrect = result.isCorrect;
        this.answered = true;
        
        return {
            ...result,
            explanation: this.explanation,
            steps: this.steps
        };
    }

    /**
     * Get display data for UI
     */
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
 * QuestionGenerator
 * Generates questions based on difficulty and type
 */
const QuestionGenerator = {
    /**
     * Generate a random question for the given difficulty
     * @param {string} difficultyId - Difficulty level ID
     * @returns {Question}
     */
    generate(difficultyId) {
        const difficultyConfig = CONFIG.difficulty[difficultyId];
        
        if (!difficultyConfig) {
            throw new Error(`Unknown difficulty: ${difficultyId}`);
        }
        
        // Select random topic from available topics
        const topics = difficultyConfig.topics;
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        // Generate quadratic suitable for this question type
        const quadratic = QuadraticGenerator.generateForQuestionType(randomTopic, difficultyId);
        
        // Generate question based on type
        return this.generateByType(randomTopic, quadratic, difficultyId);
    },

    /**
     * Generate a question of a specific type
     * @param {string} type - Question type
     * @param {Quadratic} quadratic - The quadratic equation
     * @param {string} difficultyId - Difficulty level
     * @returns {Question}
     */
    generateByType(type, quadratic, difficultyId) {
        const generators = {
            // Basic questions
            'identify_parabola': this.generateIdentifyParabola,
            'direction_opening': this.generateDirectionOpening,
            'y_intercept': this.generateYIntercept,
            
            // Symmetry questions
            'axis_symmetry_basic': this.generateAxisSymmetryBasic,
            'axis_symmetry': this.generateAxisSymmetry,
            
            // Turning point questions
            'turning_point_basic': this.generateTurningPointBasic,
            'turning_point': this.generateTurningPoint,
            
            // X-intercepts
            'x_intercepts_factor': this.generateXInterceptsFactor,
            'x_intercepts_quadratic_formula': this.generateXInterceptsFormula,
            
            // Max/Min
            'max_min_value': this.generateMaxMinValue,
            
            // Vertex form
            'vertex_form': this.generateVertexForm,
            'completing_square': this.generateCompletingSquare,
            
            // Discriminant
            'discriminant': this.generateDiscriminant,
            'nature_of_roots': this.generateNatureOfRoots,
            
            // Intersection
            'line_intersection': this.generateLineIntersection,
            'find_coordinates': this.generateFindCoordinates,
            
            // Range
            'range_of_values': this.generateRangeOfValues,
            
            // Sketching
            'sketch_from_equation': this.generateSketchFromEquation,
            'sketch_from_properties': this.generateSketchFromProperties
        };
        
        const generator = generators[type];
        
        if (!generator) {
            console.warn(`No generator for type: ${type}, using default`);
            return this.generateAxisSymmetry.call(this, quadratic, difficultyId);
        }
        
        return generator.call(this, quadratic, difficultyId);
    },

    // =====================================================
    // BASIC QUESTION GENERATORS
    // =====================================================

    /**
     * Generate identify parabola question (multiple choice)
     */
    generateIdentifyParabola(quadratic, difficultyId) {
        // Generate 4 different quadratics
        const options = [quadratic];
        
        while (options.length < 4) {
            const newQuad = QuadraticGenerator.generate(CONFIG.difficulty[difficultyId]);
            // Ensure they're different enough
            if (!options.some(q => q.a === newQuad.a && q.b === newQuad.b && q.c === newQuad.c)) {
                options.push(newQuad);
            }
        }
        
        // Shuffle options
        const shuffled = this.shuffleArray([...options]);
        const correctIndex = shuffled.indexOf(quadratic);
        
        return new Question({
            type: 'identify_parabola',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: 'Which equation matches the graph shown?',
            inputType: 'multiple_choice',
            correctAnswer: quadratic.getEquation(),
            correctChoiceIndex: correctIndex,
            choices: shuffled.map(q => q.getEquation()),
            hints: [
                { text: 'Look at where the parabola crosses the y-axis (the y-intercept).' },
                { text: 'Check if the parabola opens upward (a > 0) or downward (a < 0).' }
            ],
            explanation: `The correct equation is ${quadratic.getEquation()}. ` +
                        `It opens ${quadratic.getDirection()} and has y-intercept at ${quadratic.getYIntercept()}.`
        });
    },

    /**
     * Generate direction of opening question
     */
    generateDirectionOpening(quadratic, difficultyId) {
        const direction = quadratic.getDirection();
        
        return new Question({
            type: 'direction_opening',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: 'Does this parabola open upward or downward?',
            inputType: 'multiple_choice',
            correctAnswer: direction,
            correctChoiceIndex: direction === 'upward' ? 0 : 1,
            choices: ['Upward (∪ shape)', 'Downward (∩ shape)'],
            hints: [
                { text: 'Look at the coefficient of x² (the "a" value).' },
                { text: 'If a > 0, the parabola opens upward. If a < 0, it opens downward.' }
            ],
            explanation: `The parabola opens ${direction} because the coefficient of x² is ${quadratic.a}, ` +
                        `which is ${quadratic.a > 0 ? 'positive' : 'negative'}.`,
            steps: [
                `Identify the coefficient a = ${quadratic.a}`,
                `Since a ${quadratic.a > 0 ? '> 0' : '< 0'}, the parabola opens ${direction}`
            ]
        });
    },

    /**
     * Generate y-intercept question
     */
    generateYIntercept(quadratic, difficultyId) {
        const yInt = quadratic.getYIntercept();
        
        return new Question({
            type: 'y_intercept',
            category: 'basic',
            difficulty: 1,
            quadratic: quadratic,
            questionText: 'Find the y-intercept of this quadratic.',
            answerFormat: 'Enter the y-value (e.g., 5 or -3)',
            inputType: 'value',
            correctAnswer: yInt,
            hints: [
                { text: 'The y-intercept occurs when x = 0.' },
                { text: 'In y = ax² + bx + c, the y-intercept is simply c.' }
            ],
            explanation: `The y-intercept is ${yInt}. When x = 0, y = ${quadratic.a}(0)² + ${quadratic.b}(0) + ${quadratic.c} = ${yInt}.`,
            steps: [
                'Set x = 0 in the equation',
                `y = ${quadratic.a}(0)² + ${quadratic.b}(0) + ${quadratic.c}`,
                `y = ${yInt}`
            ]
        });
    },

    // =====================================================
    // SYMMETRY QUESTION GENERATORS
    // =====================================================

    /**
     * Generate basic axis of symmetry question
     */
    generateAxisSymmetryBasic(quadratic, difficultyId) {
        const los = quadratic.getLineOfSymmetry();
        
        return new Question({
            type: 'axis_symmetry_basic',
            category: 'symmetry',
            difficulty: 2,
            quadratic: quadratic,
            questionText: 'Find the line of symmetry (axis of symmetry) of this parabola.',
            answerFormat: 'x = ?',
            inputType: 'equation',
            correctAnswer: los,
            hints: [
                { text: 'The line of symmetry is a vertical line that passes through the vertex.' },
                { text: 'Use the formula: x = -b/(2a)', formula: 'x = -b/(2a)' }
            ],
            explanation: `The line of symmetry is x = ${QuadraticUtils.formatNumber(los)}. ` +
                        `Using x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${QuadraticUtils.formatNumber(los)}.`,
            steps: [
                `Identify a = ${quadratic.a} and b = ${quadratic.b}`,
                `Apply the formula: x = -b/(2a)`,
                `x = -(${quadratic.b})/(2 × ${quadratic.a})`,
                `x = ${-quadratic.b}/${2 * quadratic.a}`,
                `x = ${QuadraticUtils.formatNumber(los)}`
            ]
        });
    },

    /**
     * Generate axis of symmetry question (intermediate)
     */
    generateAxisSymmetry(quadratic, difficultyId) {
        const los = quadratic.getLineOfSymmetry();
        
        return new Question({
            type: 'axis_symmetry',
            category: 'symmetry',
            difficulty: 3,
            quadratic: quadratic,
            questionText: 'Determine the equation of the line of symmetry.',
            answerFormat: 'x = ?',
            inputType: 'equation',
            correctAnswer: los,
            hints: [
                { text: 'The axis of symmetry has the equation x = -b/(2a).' },
                { text: `Here, a = ${quadratic.a} and b = ${quadratic.b}.` }
            ],
            explanation: `Line of symmetry: x = ${QuadraticUtils.formatNumber(los)}`,
            steps: [
                `From y = ${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c}`,
                `a = ${quadratic.a}, b = ${quadratic.b}`,
                `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a})`,
                `x = ${QuadraticUtils.formatNumber(los)}`
            ]
        });
    },

    // =====================================================
    // TURNING POINT QUESTION GENERATORS
    // =====================================================

    /**
     * Generate basic turning point question
     */
    generateTurningPointBasic(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        
        return new Question({
            type: 'turning_point_basic',
            category: 'turning_point',
            difficulty: 2,
            quadratic: quadratic,
            questionText: 'Find the coordinates of the turning point (vertex).',
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: tp,
            hints: [
                { text: 'First find the x-coordinate using x = -b/(2a).' },
                { text: 'Then substitute this x-value into the equation to find y.' }
            ],
            explanation: `The turning point is ${QuadraticUtils.formatCoordinate(tp)}. ` +
                        `This is a ${quadratic.getExtremumType()} point.`,
            steps: [
                `Find x: x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${QuadraticUtils.formatNumber(tp.x)}`,
                `Find y: Substitute x = ${QuadraticUtils.formatNumber(tp.x)} into the equation`,
                `y = ${quadratic.a}(${QuadraticUtils.formatNumber(tp.x)})² + ${quadratic.b}(${QuadraticUtils.formatNumber(tp.x)}) + ${quadratic.c}`,
                `y = ${QuadraticUtils.formatNumber(tp.y)}`,
                `Turning point: ${QuadraticUtils.formatCoordinate(tp)}`
            ]
        });
    },

    /**
     * Generate turning point question (intermediate)
     */
    generateTurningPoint(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        const extremumType = quadratic.getExtremumType();
        
        return new Question({
            type: 'turning_point',
            category: 'turning_point',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the ${extremumType} point of the quadratic function.`,
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: tp,
            hints: [
                { 
                    text: `This parabola opens ${quadratic.getDirection()}, so it has a ${extremumType}.`,
                    formula: 'x = -b/(2a)'
                },
                {
                    text: 'The turning point lies on the line of symmetry.'
                }
            ],
            explanation: `The ${extremumType} point is ${QuadraticUtils.formatCoordinate(tp)}. ` +
                        `Since a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'}, this is a ${extremumType}.`,
            steps: [
                `Since a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'}, the parabola has a ${extremumType}`,
                `x-coordinate: x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${QuadraticUtils.formatNumber(tp.x)}`,
                `y-coordinate: y = f(${QuadraticUtils.formatNumber(tp.x)}) = ${QuadraticUtils.formatNumber(tp.y)}`,
                `${extremumType.charAt(0).toUpperCase() + extremumType.slice(1)} point: ${QuadraticUtils.formatCoordinate(tp)}`
            ]
        });
    },

    // =====================================================
    // X-INTERCEPTS QUESTION GENERATORS
    // =====================================================

    /**
     * Generate x-intercepts by factoring question
     */
    generateXInterceptsFactor(quadratic, difficultyId) {
        // Ensure we have integer roots for factoring
        let q = quadratic;
        if (!quadratic.hasIntegerRoots()) {
            q = QuadraticGenerator.generateWithProperties({ hasIntegerRoots: true });
        }
        
        const intercepts = q.getXIntercepts();
        const factored = q.getFactoredForm();
        
        let questionText, answerFormat;
        
        if (intercepts.length === 0) {
            questionText = 'Find the x-intercepts of this quadratic (if any exist).';
            answerFormat = 'Enter x values separated by comma, or "none"';
        } else if (intercepts.length === 1) {
            questionText = 'Find the x-intercept(s) of this quadratic. (Hint: there is a repeated root)';
            answerFormat = 'x = ?';
        } else {
            questionText = 'Find the x-intercepts by factoring.';
            answerFormat = 'x = ?, ? (two values)';
        }
        
        return new Question({
            type: 'x_intercepts_factor',
            category: 'intercepts',
            difficulty: 3,
            quadratic: q,
            questionText: questionText,
            answerFormat: answerFormat,
            inputType: 'values',
            correctAnswer: intercepts,
            hints: [
                { text: 'Set y = 0 and solve for x.' },
                { text: 'Try to factor the quadratic as (x - r₁)(x - r₂) = 0.' },
                { text: factored ? `The factored form is: ${factored}` : 'This quadratic may not factor nicely.' }
            ],
            explanation: intercepts.length > 0 
                ? `The x-intercepts are x = ${intercepts.map(x => QuadraticUtils.formatNumber(x)).join(' and x = ')}.`
                : 'This quadratic has no real x-intercepts (the discriminant is negative).',
            steps: intercepts.length > 0 ? [
                `Set y = 0: ${q.a}x² + ${q.b}x + ${q.c} = 0`,
                factored ? `Factor: ${factored} = 0` : 'Factor the quadratic',
                intercepts.length === 1 
                    ? `x = ${QuadraticUtils.formatNumber(intercepts[0])} (repeated root)`
                    : `x = ${QuadraticUtils.formatNumber(intercepts[0])} or x = ${QuadraticUtils.formatNumber(intercepts[1])}`
            ] : [
                'Set y = 0 and check discriminant',
                `D = b² - 4ac = ${q.b}² - 4(${q.a})(${q.c}) = ${q.getDiscriminant()}`,
                'Since D < 0, there are no real x-intercepts'
            ]
        });
    },

    /**
     * Generate x-intercepts using quadratic formula
     */
    generateXInterceptsFormula(quadratic, difficultyId) {
        const intercepts = quadratic.getXIntercepts();
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'x_intercepts_quadratic_formula',
            category: 'intercepts',
            difficulty: 4,
            quadratic: quadratic,
            questionText: 'Find the x-intercepts using the quadratic formula. Give your answers to 2 decimal places if necessary.',
            answerFormat: intercepts.length > 0 ? 'x = ?, ?' : 'Enter "none" if no real roots',
            inputType: 'values',
            correctAnswer: intercepts,
            hints: [
                { 
                    text: 'Use the quadratic formula.',
                    formula: 'x = (-b ± √(b²-4ac))/(2a)'
                },
                { 
                    text: `Here: a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}` 
                },
                {
                    text: `The discriminant D = b² - 4ac = ${QuadraticUtils.formatNumber(D)}`
                }
            ],
            explanation: intercepts.length > 0
                ? `Using x = (-b ± √D)/(2a), the x-intercepts are ${intercepts.map(x => QuadraticUtils.formatNumber(x)).join(' and ')}.`
                : `Since D = ${QuadraticUtils.formatNumber(D)} < 0, there are no real x-intercepts.`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}`,
                `D = b² - 4ac = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c}) = ${QuadraticUtils.formatNumber(D)}`,
                D >= 0 ? `√D = ${QuadraticUtils.formatNumber(Math.sqrt(D))}` : 'D < 0, no real roots',
                ...(intercepts.length > 0 ? [
                    `x = (-(${quadratic.b}) ± ${QuadraticUtils.formatNumber(Math.sqrt(D))})/(2×${quadratic.a})`,
                    `x = ${QuadraticUtils.formatNumber(intercepts[0])} or x = ${intercepts.length > 1 ? QuadraticUtils.formatNumber(intercepts[1]) : QuadraticUtils.formatNumber(intercepts[0])}`
                ] : [])
            ]
        });
    },

    // =====================================================
    // MAX/MIN VALUE QUESTION GENERATOR
    // =====================================================

    /**
     * Generate maximum/minimum value question
     */
    generateMaxMinValue(quadratic, difficultyId) {
        const extremum = quadratic.getExtremumValue();
        const type = quadratic.getExtremumType();
        
        return new Question({
            type: 'max_min_value',
            category: 'optimization',
            difficulty: 3,
            quadratic: quadratic,
            questionText: `Find the ${type} value of y for this quadratic function.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: extremum,
            hints: [
                { text: `Since a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'}, the parabola has a ${type}.` },
                { text: 'The extreme value occurs at the turning point.' },
                { text: 'Find the y-coordinate of the vertex.' }
            ],
            explanation: `The ${type} value is y = ${QuadraticUtils.formatNumber(extremum)}, occurring at x = ${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}.`,
            steps: [
                `a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'} → ${type}`,
                `x = -b/(2a) = ${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}`,
                `y = f(${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}) = ${QuadraticUtils.formatNumber(extremum)}`,
                `${type.charAt(0).toUpperCase() + type.slice(1)} value: y = ${QuadraticUtils.formatNumber(extremum)}`
            ]
        });
    },

    // =====================================================
    // VERTEX FORM QUESTION GENERATORS
    // =====================================================

    /**
     * Generate vertex form identification question
     */
    generateVertexForm(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexFormStr = quadratic.getVertexFormString();
        
        return new Question({
            type: 'vertex_form',
            category: 'transformation',
            difficulty: 3,
            quadratic: quadratic,
            questionText: 'Identify the vertex (turning point) from the equation.',
            equationDisplay: `y = ${vertexFormStr}`,
            answerFormat: '(h, k)',
            inputType: 'coordinate',
            correctAnswer: { x: h, y: k },
            hints: [
                { text: 'In vertex form y = a(x - h)² + k, the vertex is at (h, k).' },
                { text: 'Be careful with signs! (x - h) means h is positive.' }
            ],
            explanation: `The vertex form is y = ${vertexFormStr}. The vertex is at (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)}).`,
            steps: [
                `Vertex form: y = a(x - h)² + k`,
                `Comparing: a = ${QuadraticUtils.formatNumber(a)}, h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`,
                `Vertex: (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)})`
            ]
        });
    },

    /**
     * Generate completing the square question
     */
    generateCompletingSquare(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexFormStr = quadratic.getVertexFormString();
        
        return new Question({
            type: 'completing_square',
            category: 'transformation',
            difficulty: 4,
            quadratic: quadratic,
            questionText: 'Complete the square to write this quadratic in vertex form y = a(x - h)² + k.',
            answerFormat: 'a(x - h)² + k',
            inputType: 'equation',
            correctAnswer: { a, h, k },
            hints: [
                { 
                    text: 'Factor out the coefficient of x² first (if not 1).',
                    formula: 'y = a(x² + (b/a)x) + c'
                },
                { 
                    text: 'Add and subtract (b/2a)² inside the bracket.',
                    formula: 'Complete: (x + b/2a)²'
                },
                {
                    text: `The vertex form should be y = ${vertexFormStr}`
                }
            ],
            explanation: `${quadratic.getEquation()} = ${vertexFormStr}`,
            steps: quadratic.a === 1 ? [
                `y = x² + ${quadratic.b}x + ${quadratic.c}`,
                `y = (x² + ${quadratic.b}x + ${(quadratic.b/2)**2}) - ${(quadratic.b/2)**2} + ${quadratic.c}`,
                `y = (x + ${quadratic.b/2})² + ${k}`,
                `y = ${vertexFormStr}`
            ] : [
                `y = ${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c}`,
                `y = ${quadratic.a}(x² + ${quadratic.b/quadratic.a}x) + ${quadratic.c}`,
                `y = ${quadratic.a}(x + ${-h})² + ${k}`,
                `y = ${vertexFormStr}`
            ]
        });
    },

    // =====================================================
    // DISCRIMINANT QUESTION GENERATORS
    // =====================================================

    /**
     * Generate discriminant calculation question
     */
    generateDiscriminant(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'discriminant',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            questionText: 'Calculate the discriminant (D = b² - 4ac) of this quadratic equation.',
            answerFormat: 'D = ?',
            inputType: 'value',
            correctAnswer: D,
            hints: [
                { 
                    text: 'The discriminant formula is D = b² - 4ac.',
                    formula: 'D = b² - 4ac'
                },
                { text: `Here: a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}` }
            ],
            explanation: `D = b² - 4ac = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c}) = ${QuadraticUtils.formatNumber(D)}`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}`,
                `D = b² - 4ac`,
                `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c})`,
                `D = ${quadratic.b * quadratic.b} - ${4 * quadratic.a * quadratic.c}`,
                `D = ${QuadraticUtils.formatNumber(D)}`
            ]
        });
    },

    /**
     * Generate nature of roots question
     */
    generateNatureOfRoots(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        const nature = quadratic.getNatureOfRoots();
        
        return new Question({
            type: 'nature_of_roots',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            questionText: 'Determine the nature of the roots of this quadratic equation.',
            inputType: 'multiple_choice',
            correctAnswer: nature.description,
            correctChoiceIndex: nature.type === 'two_distinct' ? 0 : (nature.type === 'equal' ? 1 : 2),
            choices: [
                'Two distinct real roots',
                'Two equal real roots (repeated root)',
                'No real roots'
            ],
            hints: [
                { 
                    text: 'First calculate the discriminant D = b² - 4ac.',
                    formula: 'D = b² - 4ac'
                },
                { text: 'D > 0: two distinct roots, D = 0: equal roots, D < 0: no real roots' }
            ],
            explanation: `D = ${QuadraticUtils.formatNumber(D)}. Since D ${D > 0 ? '> 0' : (D === 0 ? '= 0' : '< 0')}, there are ${nature.description.toLowerCase()}.`,
            steps: [
                `Calculate D = b² - 4ac`,
                `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c}) = ${QuadraticUtils.formatNumber(D)}`,
                `D ${D > 0 ? '> 0' : (D === 0 ? '= 0' : '< 0')}`,
                `Therefore: ${nature.description}`
            ]
        });
    },

    // =====================================================
    // INTERSECTION QUESTION GENERATORS
    // =====================================================

    /**
     * Generate line-parabola intersection question
     */
    generateLineIntersection(quadratic, difficultyId) {
        // Generate a line that intersects the parabola
        const vertex = quadratic.getTurningPoint();
        
        // Create a line that passes near the vertex
        const m = Math.floor(Math.random() * 5) - 2; // slope between -2 and 2
        const c = Math.floor(vertex.y + Math.random() * 6 - 3); // intercept near vertex y
        
        const line = new Line(m, c);
        const intersections = quadratic.getLineIntersection(m, c);
        
        // Ensure we have intersections
        let finalLine = line;
        let finalIntersections = intersections;
        
        if (intersections.length === 0) {
            // Adjust line to ensure intersection
            const newC = vertex.y - m * vertex.x;
            finalLine = new Line(m, newC);
            finalIntersections = quadratic.getLineIntersection(m, newC);
        }
        
        return new Question({
            type: 'line_intersection',
            category: 'intersection',
            difficulty: 5,
            quadratic: quadratic,
            line: finalLine,
            questionText: `Find the coordinates where the line ${finalLine.getEquation()} intersects the parabola.`,
            answerFormat: '(x₁, y₁), (x₂, y₂)',
            inputType: 'coordinates',
            correctAnswer: finalIntersections,
            hints: [
                { text: 'Set the two equations equal to each other.' },
                { text: 'Rearrange to get a quadratic equation and solve for x.' },
                { text: 'Substitute x values back to find y coordinates.' }
            ],
            explanation: finalIntersections.length > 0 
                ? `The intersection points are ${finalIntersections.map(p => QuadraticUtils.formatCoordinate(p)).join(' and ')}.`
                : 'The line does not intersect the parabola.',
            steps: [
                `Set ${quadratic.getStandardForm()} = ${finalLine.m}x + ${finalLine.c}`,
                `${quadratic.a}x² + ${quadratic.b - finalLine.m}x + ${quadratic.c - finalLine.c} = 0`,
                'Solve this quadratic for x',
                ...finalIntersections.map((p, i) => 
                    `Point ${i + 1}: (${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`
                )
            ]
        });
    },

    /**
     * Generate find coordinates question
     */
    generateFindCoordinates(quadratic, difficultyId) {
        // Random x value within reasonable range
        const x = Math.floor(Math.random() * 9) - 4;
        const y = quadratic.evaluate(x);
        
        const askForY = Math.random() < 0.5;
        
        if (askForY) {
            return new Question({
                type: 'find_coordinates',
                category: 'coordinates',
                difficulty: 3,
                quadratic: quadratic,
                questionText: `Find the y-coordinate when x = ${x}.`,
                answerFormat: 'y = ?',
                inputType: 'value',
                correctAnswer: y,
                hints: [
                    { text: `Substitute x = ${x} into the equation.` },
                    { text: `Calculate ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}` }
                ],
                explanation: `When x = ${x}, y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c} = ${QuadraticUtils.formatNumber(y)}`,
                steps: [
                    `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                    `y = ${quadratic.a * x * x} + ${quadratic.b * x} + ${quadratic.c}`,
                    `y = ${QuadraticUtils.formatNumber(y)}`
                ]
            });
        } else {
            const xValues = quadratic.findX(y);
            
            return new Question({
                type: 'find_coordinates',
                category: 'coordinates',
                difficulty: 4,
                quadratic: quadratic,
                questionText: `Find the x-coordinate(s) when y = ${QuadraticUtils.formatNumber(y)}.`,
                answerFormat: xValues.length > 1 ? 'x = ?, ?' : 'x = ?',
                inputType: 'values',
                correctAnswer: xValues,
                hints: [
                    { text: `Set ${quadratic.getStandardForm()} = ${QuadraticUtils.formatNumber(y)}` },
                    { text: 'Solve the resulting quadratic equation.' }
                ],
                explanation: `When y = ${QuadraticUtils.formatNumber(y)}, x = ${xValues.map(v => QuadraticUtils.formatNumber(v)).join(' or x = ')}`,
                steps: [
                    `${quadratic.getStandardForm()} = ${QuadraticUtils.formatNumber(y)}`,
                    `${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c - y} = 0`,
                    'Solve for x',
                    `x = ${xValues.map(v => QuadraticUtils.formatNumber(v)).join(' or x = ')}`
                ]
            });
        }
    },

    // =====================================================
    // RANGE QUESTION GENERATOR
    // =====================================================

    /**
     * Generate range of values question
     */
    generateRangeOfValues(quadratic, difficultyId) {
        const range = quadratic.getRange();
        
        return new Question({
            type: 'range_of_values',
            category: 'range',
            difficulty: 4,
            quadratic: quadratic,
            questionText: 'State the range of values of y for this quadratic function.',
            answerFormat: 'y ≥ ? or y ≤ ?',
            inputType: 'inequality',
            correctAnswer: range,
            hints: [
                { text: `This parabola opens ${quadratic.getDirection()}, so it has a ${quadratic.getExtremumType()}.` },
                { text: 'Find the y-coordinate of the turning point.' },
                { text: range.inequality === 'gte' ? 'y is greater than or equal to the minimum value.' : 'y is less than or equal to the maximum value.' }
            ],
            explanation: `Since the parabola opens ${quadratic.getDirection()}, ${range.description}.`,
            steps: [
                `a = ${quadratic.a} ${quadratic.a > 0 ? '> 0' : '< 0'} → ${quadratic.getExtremumType()}`,
                `${quadratic.getExtremumType()} value = ${QuadraticUtils.formatNumber(range.value)}`,
                `Range: ${range.description}`
            ]
        });
    },

    // =====================================================
    // SKETCHING QUESTION GENERATORS
    // =====================================================

    /**
     * Generate sketch from equation question
     */
    generateSketchFromEquation(quadratic, difficultyId) {
        const vertex = quadratic.getTurningPoint();
        const yInt = quadratic.getYIntercept();
        const xInts = quadratic.getXIntercepts();
        const direction = quadratic.getDirection();
        
        return new Question({
            type: 'sketch_from_equation',
            category: 'sketching',
            difficulty: 4,
            quadratic: quadratic,
            questionText: 'Identify all key features needed to sketch this parabola.',
            inputType: 'multiple_features',
            correctAnswer: {
                direction: direction,
                vertex: vertex,
                yIntercept: yInt,
                xIntercepts: xInts
            },
            choices: [
                `Direction: Opens ${direction}`,
                `Vertex: ${QuadraticUtils.formatCoordinate(vertex)}`,
                `Y-intercept: (0, ${QuadraticUtils.formatNumber(yInt)})`,
                `X-intercepts: ${xInts.length > 0 ? xInts.map(x => QuadraticUtils.formatNumber(x)).join(', ') : 'None'}`
            ],
            hints: [
                { text: 'Check the sign of "a" to determine direction.' },
                { text: 'Find the vertex using x = -b/(2a).' },
                { text: 'The y-intercept is the value of c.' },
                { text: 'Find x-intercepts by solving when y = 0.' }
            ],
            explanation: `Key features: Opens ${direction}, vertex at ${QuadraticUtils.formatCoordinate(vertex)}, ` +
                        `y-intercept at (0, ${yInt}), ` +
                        `${xInts.length > 0 ? `x-intercepts at x = ${xInts.join(', ')}` : 'no x-intercepts'}.`,
            steps: [
                `a = ${quadratic.a} → opens ${direction}`,
                `Vertex: (${QuadraticUtils.formatNumber(vertex.x)}, ${QuadraticUtils.formatNumber(vertex.y)})`,
                `Y-intercept: c = ${yInt}`,
                xInts.length > 0 
                    ? `X-intercepts: ${xInts.map(x => `x = ${QuadraticUtils.formatNumber(x)}`).join(', ')}`
                    : 'No real x-intercepts (D < 0)'
            ]
        });
    },

    /**
     * Generate sketch from properties question
     */
    generateSketchFromProperties(quadratic, difficultyId) {
        const vertex = quadratic.getTurningPoint();
        const direction = quadratic.getDirection();
        
        // Generate wrong options
        const options = [quadratic];
        
        // Create similar but different quadratics
        const variations = [
            new Quadratic(-quadratic.a, quadratic.b, quadratic.c), // Flipped
            new Quadratic(quadratic.a, -quadratic.b, quadratic.c), // Different symmetry
            new Quadratic(quadratic.a, quadratic.b, quadratic.c + 3) // Shifted
        ];
        
        variations.forEach(v => {
            if (options.length < 4) {
                options.push(v);
            }
        });
        
        const shuffled = this.shuffleArray([...options]);
        const correctIndex = shuffled.indexOf(quadratic);
        
        return new Question({
            type: 'sketch_from_properties',
            category: 'sketching',
            difficulty: 4,
            quadratic: quadratic,
            questionText: `Which equation has a ${quadratic.getExtremumType()} point at ${QuadraticUtils.formatCoordinate(vertex)}?`,
            inputType: 'multiple_choice',
            correctAnswer: quadratic.getEquation(),
            correctChoiceIndex: correctIndex,
            choices: shuffled.map(q => q.getEquation()),
            hints: [
                { text: `Check which parabola opens ${direction} (has a ${quadratic.getExtremumType()}).` },
                { text: 'Verify the vertex coordinates for each option.' }
            ],
            explanation: `${quadratic.getEquation()} has its ${quadratic.getExtremumType()} at ${QuadraticUtils.formatCoordinate(vertex)}.`
        });
    },

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    /**
     * Shuffle an array
     * @param {Array} array 
     * @returns {Array} Shuffled array
     */
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
     * @param {string} difficultyId - Difficulty level
     * @param {number} count - Number of questions
     * @returns {Array<Question>}
     */
    generateQuestionSet(difficultyId, count) {
        const questions = [];
        const difficultyConfig = CONFIG.difficulty[difficultyId];
        const topics = [...difficultyConfig.topics];
        
        // Ensure variety by cycling through topics
        for (let i = 0; i < count; i++) {
            const topicIndex = i % topics.length;
            const topic = topics[topicIndex];
            
            // Generate quadratic suitable for this topic
            const quadratic = QuadraticGenerator.generateForQuestionType(topic, difficultyId);
            
            // Generate question
            const question = this.generateByType(topic, quadratic, difficultyId);
            questions.push(question);
        }
        
        // Shuffle questions
        return this.shuffleArray(questions);
    }
};

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Question,
        QuestionGenerator
    };
}