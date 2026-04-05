/* =====================================================
   QUADRATIC CATAPULT QUEST - QUESTION GENERATOR
   =====================================================
   CORRECTED VERSION - Questions where answers are NOT
   already visible in the equation!
   
   BEGINNER (Sec 1-2) Question Types:
   1. Given x value, find y (substitution)
   2. Given y value, find x (factorisation)
   3. Given roots, find the equation
   4. Given table of values, find missing value
   5. Factorise the expression
   6. Solve equation = 0
   ===================================================== */

/**
 * Question Class
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
        this.equationDisplay = config.equationDisplay || null;
        this.showEquation = config.showEquation !== false;
        
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
        if (!this.quadratic) return { x: 0, y: 0 };
        
        const xInts = this.quadratic.getXIntercepts();
        if (xInts.length > 0) {
            return { x: xInts[0], y: 0 };
        }
        
        const vertex = this.quadratic.getTurningPoint();
        return { x: vertex.x, y: vertex.y };
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
            equation: this.showEquation ? this.equationDisplay : null,
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
 * QuadraticGenerator - Creates quadratics with integer properties
 */
const QuadraticGenerator = {
    /**
     * Generate quadratic from two integer roots
     * y = (x - r1)(x - r2) = x² - (r1+r2)x + r1*r2
     */
    fromIntegerRoots(r1, r2) {
        const a = 1;
        const b = -(r1 + r2);
        const c = r1 * r2;
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate random quadratic with integer roots for Sec 1-2
     */
    generateForBeginner() {
        // Pick two integer roots between -6 and 6
        const r1 = this.randomInt(-6, 6);
        let r2 = this.randomInt(-6, 6);
        
        // Avoid both being 0
        if (r1 === 0 && r2 === 0) r2 = this.randomInt(1, 5);
        
        return this.fromIntegerRoots(r1, r2);
    },
    
    /**
     * Generate with specific integer vertex
     */
    generateWithIntegerVertex(h, k, a = 1) {
        return Quadratic.fromVertexForm(a, h, k);
    },
    
    /**
     * Generate for intermediate level
     */
    generateForIntermediate() {
        const a = Math.random() < 0.7 ? 1 : (Math.random() < 0.5 ? -1 : 2);
        const h = this.randomInt(-4, 4);
        const k = this.randomInt(-6, 6);
        return Quadratic.fromVertexForm(a, h, k);
    },
    
    /**
     * Generate for advanced level
     */
    generateForAdvanced() {
        const a = this.randomInt(1, 3) * (Math.random() < 0.3 ? -1 : 1);
        const b = this.randomInt(-10, 10);
        const c = this.randomInt(-12, 12);
        return new Quadratic(a, b, c);
    },
    
    /**
     * Generate based on question type
     */
    generateForQuestionType(type, difficultyId) {
        switch (type) {
            case 'substitution_find_y':
            case 'substitution_find_x':
            case 'factorise_expression':
            case 'solve_equation':
            case 'find_roots_from_factors':
            case 'complete_table':
            case 'find_equation_from_roots':
                return this.generateForBeginner();
            
            case 'axis_symmetry_basic':
            case 'turning_point_basic':
                const h = this.randomInt(-4, 4);
                const k = this.randomInt(-6, 6);
                return this.generateWithIntegerVertex(h, k, 1);
            
            case 'axis_symmetry':
            case 'turning_point':
            case 'max_min_value':
                return this.generateForIntermediate();
            
            default:
                if (difficultyId === 'beginner') {
                    return this.generateForBeginner();
                } else if (difficultyId === 'intermediate') {
                    return this.generateForIntermediate();
                } else {
                    return this.generateForAdvanced();
                }
        }
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
};

/**
 * QuestionGenerator - Creates appropriate questions for each level
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
     * Generate by type
     */
    generateByType(type, quadratic, difficultyId) {
        const generators = {
            // ===== BEGINNER (Sec 1-2) =====
            'substitution_find_y': this.genSubstitutionFindY,
            'substitution_find_x': this.genSubstitutionFindX,
            'factorise_expression': this.genFactoriseExpression,
            'solve_equation': this.genSolveEquation,
            'find_equation_from_roots': this.genFindEquationFromRoots,
            'complete_table': this.genCompleteTable,
            'evaluate_at_point': this.genEvaluateAtPoint,
            
            // ===== INTERMEDIATE (Sec 3) =====
            'axis_symmetry_basic': this.genAxisSymmetryBasic,
            'axis_symmetry': this.genAxisSymmetry,
            'turning_point_basic': this.genTurningPointBasic,
            'turning_point': this.genTurningPoint,
            'max_min_value': this.genMaxMinValue,
            'discriminant_basic': this.genDiscriminantBasic,
            
            // ===== ADVANCED (O-Level) =====
            'x_intercepts_quadratic_formula': this.genXInterceptsFormula,
            'discriminant': this.genDiscriminant,
            'nature_of_roots': this.genNatureOfRoots,
            'completing_square': this.genCompletingSquare,
            'vertex_form': this.genVertexForm,
            'find_coordinates': this.genFindCoordinates,
            'range_of_values': this.genRangeOfValues,
            'line_intersection': this.genLineIntersection
        };
        
        const generator = generators[type];
        if (!generator) {
            console.warn(`No generator for: ${type}, using substitution`);
            return this.genSubstitutionFindY.call(this, quadratic, difficultyId);
        }
        
        return generator.call(this, quadratic, difficultyId);
    },

    // =========================================================
    // BEGINNER QUESTIONS (Sec 1-2)
    // Answers are NOT visible in the question!
    // =========================================================

    /**
     * SUBSTITUTION: Given equation and x, find y
     * Answer requires calculation, not just reading
     */
    genSubstitutionFindY(quadratic, difficultyId) {
        const x = QuadraticGenerator.randomInt(-5, 5);
        const y = quadratic.evaluate(x);
        
        // Show the equation, student must calculate
        return new Question({
            type: 'substitution_find_y',
            category: 'substitution',
            difficulty: 1,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Given ${quadratic.getEquation()}, find the value of y when x = ${x}.`,
            answerFormat: 'Enter a number',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Replace x with ${x} in the equation.` },
                { text: `Calculate: ${quadratic.a}×(${x})² + ${quadratic.b}×(${x}) + ${quadratic.c}` },
                { text: `Remember: (${x})² = ${x * x}` }
            ],
            explanation: `Substituting x = ${x}: y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c} = ${y}`,
            steps: [
                `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `y = ${quadratic.a} × ${x * x} + (${quadratic.b * x}) + ${quadratic.c}`,
                `y = ${quadratic.a * x * x} + (${quadratic.b * x}) + ${quadratic.c}`,
                `y = ${y}`
            ]
        });
    },

    /**
     * SUBSTITUTION: Given equation and y, find x
     * Student must solve equation
     */
    genSubstitutionFindX(quadratic, difficultyId) {
        // Pick an x that gives a nice y value
        const x1 = QuadraticGenerator.randomInt(-4, 4);
        const y = quadratic.evaluate(x1);
        
        // Find all x values that give this y
        const xValues = quadratic.findX(y);
        const roundedX = xValues.map(x => Math.round(x * 100) / 100);
        
        return new Question({
            type: 'substitution_find_x',
            category: 'substitution',
            difficulty: 2,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Given ${quadratic.getEquation()}, find the value(s) of x when y = ${y}.`,
            answerFormat: roundedX.length === 1 ? 'x = ?' : 'x = ? or x = ?',
            inputType: 'values',
            correctAnswer: roundedX,
            hints: [
                { text: `Set ${quadratic.getStandardForm()} = ${y}` },
                { text: `Rearrange to get ${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c - y} = 0` },
                { text: 'Factorise and solve.' }
            ],
            explanation: `When y = ${y}, x = ${roundedX.join(' or x = ')}`,
            steps: [
                `Set ${quadratic.getStandardForm()} = ${y}`,
                `${quadratic.a}x² + ${quadratic.b}x + ${quadratic.c - y} = 0`,
                `Solve to get x = ${roundedX.join(' or x = ')}`
            ]
        });
    },

    /**
     * FACTORISE: Given expression, write in factored form
     * Show: x² - 5x + 6, Answer: (x - 2)(x - 3)
     */
    genFactoriseExpression(quadratic, difficultyId) {
        // Ensure we have integer roots
        const roots = quadratic.getXIntercepts();
        if (roots.length !== 2 || !quadratic.hasIntegerRoots()) {
            quadratic = QuadraticGenerator.generateForBeginner();
        }
        
        const r1 = Math.round(quadratic.getXIntercepts()[0]);
        const r2 = Math.round(quadratic.getXIntercepts()[1]);
        
        // Create the factored form string
        const factor1 = r1 >= 0 ? `(x - ${r1})` : `(x + ${-r1})`;
        const factor2 = r2 >= 0 ? `(x - ${r2})` : `(x + ${-r2})`;
        const factoredForm = `${factor1}${factor2}`;
        
        return new Question({
            type: 'factorise_expression',
            category: 'factorisation',
            difficulty: 2,
            quadratic: quadratic,
            equationDisplay: quadratic.getStandardForm(),
            showEquation: true,
            questionText: `Factorise: ${quadratic.getStandardForm()}`,
            answerFormat: '(x ± ?)(x ± ?)',
            inputType: 'factored',
            correctAnswer: { r1, r2, factored: factoredForm },
            hints: [
                { text: `Find two numbers that multiply to give ${quadratic.c}` },
                { text: `Those numbers must also add to give ${quadratic.b}` },
                { text: `The numbers are ${-r1} and ${-r2}` }
            ],
            explanation: `${quadratic.getStandardForm()} = ${factoredForm}`,
            steps: [
                `Find two numbers: ? × ? = ${quadratic.c} and ? + ? = ${quadratic.b}`,
                `The numbers are ${-r1} and ${-r2}`,
                `Check: ${-r1} × ${-r2} = ${(-r1) * (-r2)} ✓`,
                `Check: ${-r1} + ${-r2} = ${-r1 + -r2} ✓`,
                `${quadratic.getStandardForm()} = ${factoredForm}`
            ]
        });
    },

    /**
     * SOLVE EQUATION: Solve quadratic = 0
     * Show: x² - 5x + 6 = 0, Answer: x = 2 or x = 3
     */
    genSolveEquation(quadratic, difficultyId) {
        // Ensure integer roots
        if (!quadratic.hasIntegerRoots()) {
            quadratic = QuadraticGenerator.generateForBeginner();
        }
        
        const roots = quadratic.getXIntercepts().map(r => Math.round(r)).sort((a, b) => a - b);
        
        if (roots.length === 0) {
            quadratic = QuadraticGenerator.generateForBeginner();
            return this.genSolveEquation(quadratic, difficultyId);
        }
        
        return new Question({
            type: 'solve_equation',
            category: 'factorisation',
            difficulty: 2,
            quadratic: quadratic,
            equationDisplay: `${quadratic.getStandardForm()} = 0`,
            showEquation: true,
            questionText: `Solve ${quadratic.getStandardForm()} = 0`,
            answerFormat: roots.length === 1 ? 'x = ?' : 'x = ? and x = ?',
            inputType: 'values',
            correctAnswer: roots,
            hints: [
                { text: 'First, factorise the left side.' },
                { text: `Find two numbers that multiply to ${quadratic.c} and add to ${quadratic.b}` },
                { text: 'Set each factor equal to 0 and solve.' }
            ],
            explanation: roots.length === 1 
                ? `x = ${roots[0]} (repeated root)`
                : `x = ${roots[0]} or x = ${roots[1]}`,
            steps: this.getFactoringSteps(quadratic, roots)
        });
    },

    /**
     * FIND EQUATION FROM ROOTS
     * "A quadratic has roots x = 2 and x = 3. Find the equation."
     * Answer is NOT visible!
     */
    genFindEquationFromRoots(quadratic, difficultyId) {
        // Get integer roots
        if (!quadratic.hasIntegerRoots()) {
            quadratic = QuadraticGenerator.generateForBeginner();
        }
        
        const roots = quadratic.getXIntercepts().map(r => Math.round(r)).sort((a, b) => a - b);
        
        if (roots.length !== 2) {
            // Regenerate with two distinct roots
            const r1 = QuadraticGenerator.randomInt(-5, 5);
            let r2 = QuadraticGenerator.randomInt(-5, 5);
            while (r2 === r1) r2 = QuadraticGenerator.randomInt(-5, 5);
            quadratic = QuadraticGenerator.fromIntegerRoots(r1, r2);
        }
        
        const r1 = Math.round(quadratic.getXIntercepts()[0]);
        const r2 = Math.round(quadratic.getXIntercepts()[1]);
        
        return new Question({
            type: 'find_equation_from_roots',
            category: 'factorisation',
            difficulty: 2,
            quadratic: quadratic,
            showEquation: false,  // DON'T show equation!
            questionText: `A quadratic equation has solutions x = ${Math.min(r1, r2)} and x = ${Math.max(r1, r2)}. Find the equation in the form x² + bx + c = 0.`,
            answerFormat: 'b = ? and c = ?',
            inputType: 'coefficients',
            correctAnswer: { b: quadratic.b, c: quadratic.c },
            hints: [
                { text: `If x = ${Math.min(r1, r2)} is a solution, then (x - ${Math.min(r1, r2)}) is a factor.` },
                { text: `If x = ${Math.max(r1, r2)} is a solution, then (x - ${Math.max(r1, r2)}) is a factor.` },
                { text: 'Expand (x - ?)(x - ?) to find the equation.' }
            ],
            explanation: `The equation is ${quadratic.getStandardForm()} = 0, so b = ${quadratic.b} and c = ${quadratic.c}`,
            steps: [
                `From x = ${Math.min(r1, r2)}: factor is (x ${Math.min(r1, r2) >= 0 ? '- ' + Math.min(r1, r2) : '+ ' + (-Math.min(r1, r2))})`,
                `From x = ${Math.max(r1, r2)}: factor is (x ${Math.max(r1, r2) >= 0 ? '- ' + Math.max(r1, r2) : '+ ' + (-Math.max(r1, r2))})`,
                `Expand: (x - ${r1})(x - ${r2})`,
                `= x² - ${r1}x - ${r2}x + ${r1 * r2}`,
                `= x² + ${quadratic.b}x + ${quadratic.c}`,
                `So b = ${quadratic.b}, c = ${quadratic.c}`
            ]
        });
    },

    /**
     * COMPLETE TABLE OF VALUES
     * Given some x and y values, find missing ones
     */
    genCompleteTable(quadratic, difficultyId) {
        // Create a table with one missing value
        const xValues = [-2, -1, 0, 1, 2, 3];
        const yValues = xValues.map(x => quadratic.evaluate(x));
        
        // Pick a random position to hide
        const hideIndex = QuadraticGenerator.randomInt(0, xValues.length - 1);
        const hiddenX = xValues[hideIndex];
        const hiddenY = yValues[hideIndex];
        
        // Create table display
        let tableDisplay = 'x | ';
        xValues.forEach((x, i) => {
            tableDisplay += x + ' | ';
        });
        tableDisplay += '\ny | ';
        yValues.forEach((y, i) => {
            if (i === hideIndex) {
                tableDisplay += '? | ';
            } else {
                tableDisplay += y + ' | ';
            }
        });
        
        return new Question({
            type: 'complete_table',
            category: 'substitution',
            difficulty: 1,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `For ${quadratic.getEquation()}, complete the table:\n\n${tableDisplay}\n\nFind y when x = ${hiddenX}`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: hiddenY,
            hints: [
                { text: `Substitute x = ${hiddenX} into the equation.` },
                { text: `y = ${quadratic.a}(${hiddenX})² + ${quadratic.b}(${hiddenX}) + ${quadratic.c}` }
            ],
            explanation: `When x = ${hiddenX}, y = ${hiddenY}`,
            steps: [
                `y = ${quadratic.a}(${hiddenX})² + ${quadratic.b}(${hiddenX}) + ${quadratic.c}`,
                `y = ${quadratic.a}(${hiddenX * hiddenX}) + (${quadratic.b * hiddenX}) + ${quadratic.c}`,
                `y = ${quadratic.a * hiddenX * hiddenX} + (${quadratic.b * hiddenX}) + ${quadratic.c}`,
                `y = ${hiddenY}`
            ]
        });
    },

    /**
     * EVALUATE AT A POINT
     * Simple calculation question
     */
    genEvaluateAtPoint(quadratic, difficultyId) {
        const x = QuadraticGenerator.randomInt(-4, 4);
        const y = quadratic.evaluate(x);
        
        return new Question({
            type: 'evaluate_at_point',
            category: 'substitution',
            difficulty: 1,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Calculate the value of ${quadratic.getStandardForm()} when x = ${x}.`,
            answerFormat: 'Answer = ?',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Replace x with ${x}` },
                { text: `(${x})² = ${x * x}` }
            ],
            explanation: `${quadratic.getStandardForm()} = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c} = ${y}`,
            steps: [
                `= ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `= ${quadratic.a}(${x * x}) + (${quadratic.b * x}) + ${quadratic.c}`,
                `= ${quadratic.a * x * x} + (${quadratic.b * x}) + ${quadratic.c}`,
                `= ${y}`
            ]
        });
    },

    /**
     * Helper: Get factoring steps
     */
    getFactoringSteps(quadratic, roots) {
        const r1 = roots[0];
        const r2 = roots.length > 1 ? roots[1] : roots[0];
        
        const factor1 = r1 >= 0 ? `(x - ${r1})` : `(x + ${-r1})`;
        const factor2 = r2 >= 0 ? `(x - ${r2})` : `(x + ${-r2})`;
        
        if (roots.length === 1) {
            return [
                `${quadratic.getStandardForm()} = 0`,
                `Factorise: ${factor1}² = 0`,
                `${factor1} = 0`,
                `x = ${r1}`
            ];
        }
        
        return [
            `${quadratic.getStandardForm()} = 0`,
            `Find: ? × ? = ${quadratic.c} and ? + ? = ${quadratic.b}`,
            `Numbers: ${-r1} and ${-r2}`,
            `Factorise: ${factor1}${factor2} = 0`,
            `${factor1} = 0 or ${factor2} = 0`,
            `x = ${r1} or x = ${r2}`
        ];
    },

    // =========================================================
    // INTERMEDIATE QUESTIONS (Sec 3)
    // =========================================================

    /**
     * Line of symmetry - integer answer
     */
    genAxisSymmetryBasic(quadratic, difficultyId) {
        // Ensure integer line of symmetry
        const los = quadratic.getLineOfSymmetry();
        if (!Number.isInteger(los)) {
            const h = QuadraticGenerator.randomInt(-4, 4);
            const k = QuadraticGenerator.randomInt(-6, 6);
            quadratic = QuadraticGenerator.generateWithIntegerVertex(h, k, 1);
        }
        
        const lineOfSym = Math.round(quadratic.getLineOfSymmetry());
        
        return new Question({
            type: 'axis_symmetry_basic',
            category: 'symmetry',
            difficulty: 2,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the line of symmetry for ${quadratic.getEquation()}.`,
            answerFormat: 'x = ?',
            inputType: 'equation',
            correctAnswer: lineOfSym,
            hints: [
                { text: 'Use the formula: x = -b ÷ (2a)', formula: 'x = -b/(2a)' },
                { text: `Here, a = ${quadratic.a} and b = ${quadratic.b}` }
            ],
            explanation: `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${lineOfSym}`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}`,
                `x = -b/(2a)`,
                `x = -(${quadratic.b})/(2×${quadratic.a})`,
                `x = ${-quadratic.b}/${2 * quadratic.a}`,
                `x = ${lineOfSym}`
            ]
        });
    },

    /**
     * Line of symmetry - can be decimal
     */
    genAxisSymmetry(quadratic, difficultyId) {
        const los = quadratic.getLineOfSymmetry();
        
        return new Question({
            type: 'axis_symmetry',
            category: 'symmetry',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the equation of the line of symmetry for ${quadratic.getEquation()}.`,
            answerFormat: 'x = ? (can be decimal)',
            inputType: 'equation',
            correctAnswer: los,
            hints: [
                { text: 'x = -b/(2a)', formula: 'x = -b/(2a)' }
            ],
            explanation: `x = -b/(2a) = ${QuadraticUtils.formatNumber(los)}`,
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}`,
                `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a})`,
                `x = ${QuadraticUtils.formatNumber(los)}`
            ]
        });
    },

    /**
     * Turning point - integer coordinates
     */
    genTurningPointBasic(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        
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
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the turning point of ${quadratic.getEquation()}.`,
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: roundedVertex,
            hints: [
                { text: 'First find x using x = -b/(2a)' },
                { text: 'Then substitute this x into the equation to find y' }
            ],
            explanation: `Turning point: (${roundedVertex.x}, ${roundedVertex.y})`,
            steps: [
                `x = -b/(2a) = -(${quadratic.b})/(2×${quadratic.a}) = ${roundedVertex.x}`,
                `y = ${quadratic.a}(${roundedVertex.x})² + ${quadratic.b}(${roundedVertex.x}) + ${quadratic.c}`,
                `y = ${roundedVertex.y}`,
                `Turning point: (${roundedVertex.x}, ${roundedVertex.y})`
            ]
        });
    },

    /**
     * Turning point - general
     */
    genTurningPoint(quadratic, difficultyId) {
        const tp = quadratic.getTurningPoint();
        const type = quadratic.getExtremumType();
        
        return new Question({
            type: 'turning_point',
            category: 'turning_point',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the ${type} point of ${quadratic.getEquation()}.`,
            answerFormat: '(x, y)',
            inputType: 'coordinate',
            correctAnswer: tp,
            hints: [
                { text: `Since a = ${quadratic.a}, this is a ${type}` },
                { text: 'x = -b/(2a)' }
            ],
            explanation: `${type.charAt(0).toUpperCase() + type.slice(1)} point: (${QuadraticUtils.formatNumber(tp.x)}, ${QuadraticUtils.formatNumber(tp.y)})`,
            steps: [
                `a = ${quadratic.a} → ${type}`,
                `x = -b/(2a) = ${QuadraticUtils.formatNumber(tp.x)}`,
                `y = f(${QuadraticUtils.formatNumber(tp.x)}) = ${QuadraticUtils.formatNumber(tp.y)}`,
                `(${QuadraticUtils.formatNumber(tp.x)}, ${QuadraticUtils.formatNumber(tp.y)})`
            ]
        });
    },

    /**
     * Maximum/Minimum value
     */
    genMaxMinValue(quadratic, difficultyId) {
        const extremum = quadratic.getExtremumValue();
        const type = quadratic.getExtremumType();
        
        return new Question({
            type: 'max_min_value',
            category: 'optimization',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the ${type} value of y for ${quadratic.getEquation()}.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: extremum,
            hints: [
                { text: `This parabola has a ${type} because a ${quadratic.a > 0 ? '> 0' : '< 0'}` },
                { text: 'The extreme value is at the turning point' }
            ],
            explanation: `${type.charAt(0).toUpperCase() + type.slice(1)} value = ${QuadraticUtils.formatNumber(extremum)}`,
            steps: [
                `a = ${quadratic.a} → ${type}`,
                `x = -b/(2a) = ${QuadraticUtils.formatNumber(quadratic.getLineOfSymmetry())}`,
                `y = ${QuadraticUtils.formatNumber(extremum)}`
            ]
        });
    },

    /**
     * Discriminant - basic
     */
    genDiscriminantBasic(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'discriminant_basic',
            category: 'roots',
            difficulty: 2,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Calculate the discriminant of ${quadratic.getEquation()}.`,
            answerFormat: 'D = ?',
            inputType: 'value',
            correctAnswer: D,
            hints: [
                { text: 'D = b² - 4ac', formula: 'D = b² - 4ac' },
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
     * Solve using quadratic formula
     */
    genXInterceptsFormula(quadratic, difficultyId) {
        const intercepts = quadratic.getXIntercepts();
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'x_intercepts_quadratic_formula',
            category: 'intercepts',
            difficulty: 4,
            quadratic: quadratic,
            equationDisplay: `${quadratic.getStandardForm()} = 0`,
            showEquation: true,
            questionText: `Solve ${quadratic.getStandardForm()} = 0 using the quadratic formula. Give answers to 2 decimal places.`,
            answerFormat: intercepts.length > 0 ? 'x = ?, ?' : 'State "no real roots"',
            inputType: 'values',
            correctAnswer: intercepts.length > 0 ? intercepts.map(x => Math.round(x * 100) / 100) : 'no real roots',
            hints: [
                { text: 'x = (-b ± √(b²-4ac))/(2a)', formula: 'x = (-b ± √D)/(2a)' },
                { text: `D = ${D}` }
            ],
            explanation: intercepts.length > 0
                ? `x = ${intercepts.map(x => QuadraticUtils.formatNumber(x)).join(' or ')}`
                : 'No real roots (D < 0)',
            steps: [
                `a = ${quadratic.a}, b = ${quadratic.b}, c = ${quadratic.c}`,
                `D = b² - 4ac = ${D}`,
                ...(D >= 0 ? [
                    `√D = ${QuadraticUtils.formatNumber(Math.sqrt(D))}`,
                    `x = (${-quadratic.b} ± ${QuadraticUtils.formatNumber(Math.sqrt(D))}) / ${2 * quadratic.a}`,
                    `x = ${intercepts.map(x => QuadraticUtils.formatNumber(x)).join(' or ')}`
                ] : ['D < 0, no real solutions'])
            ]
        });
    },

    /**
     * Discriminant
     */
    genDiscriminant(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        return new Question({
            type: 'discriminant',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find the discriminant of ${quadratic.getEquation()}.`,
            answerFormat: 'D = b² - 4ac = ?',
            inputType: 'value',
            correctAnswer: D,
            hints: [
                { text: 'D = b² - 4ac', formula: 'D = b² - 4ac' }
            ],
            explanation: `D = ${D}`,
            steps: [
                `D = b² - 4ac`,
                `D = (${quadratic.b})² - 4(${quadratic.a})(${quadratic.c})`,
                `D = ${quadratic.b * quadratic.b} - ${4 * quadratic.a * quadratic.c}`,
                `D = ${D}`
            ]
        });
    },

    /**
     * Nature of roots
     */
    genNatureOfRoots(quadratic, difficultyId) {
        const D = quadratic.getDiscriminant();
        
        const choices = [
            'Two different real roots',
            'Two equal real roots',
            'No real roots'
        ];
        
        let correctIndex = D > 0 ? 0 : (D === 0 ? 1 : 2);
        
        return new Question({
            type: 'nature_of_roots',
            category: 'roots',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Determine the nature of roots for ${quadratic.getEquation()}.`,
            inputType: 'multiple_choice',
            correctAnswer: choices[correctIndex],
            correctChoiceIndex: correctIndex,
            choices: choices,
            hints: [
                { text: 'Calculate D = b² - 4ac first' },
                { text: 'D > 0: two different, D = 0: equal, D < 0: no real' }
            ],
            explanation: `D = ${D}, so ${choices[correctIndex].toLowerCase()}`,
            steps: [
                `D = b² - 4ac = ${D}`,
                `D ${D > 0 ? '> 0' : (D === 0 ? '= 0' : '< 0')}`,
                choices[correctIndex]
            ]
        });
    },

    /**
     * Completing the square
     */
    genCompletingSquare(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexForm = quadratic.getVertexFormString();
        
        return new Question({
            type: 'completing_square',
            category: 'transformation',
            difficulty: 4,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Express ${quadratic.getEquation()} in the form a(x - h)² + k.`,
            answerFormat: 'State values of a, h, k',
            inputType: 'multiple_values',
            correctAnswer: { a, h: Math.round(h * 100) / 100, k: Math.round(k * 100) / 100 },
            hints: [
                { text: 'Complete the square on the x terms' },
                { text: 'a stays the same' }
            ],
            explanation: `${quadratic.getEquation()} = ${vertexForm}`,
            steps: [
                `y = ${quadratic.getStandardForm()}`,
                `y = ${vertexForm}`,
                `a = ${a}, h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`
            ]
        });
    },

    /**
     * Vertex form
     */
    genVertexForm(quadratic, difficultyId) {
        const { a, h, k } = quadratic.getVertexFormCoefficients();
        const vertexForm = quadratic.getVertexFormString();
        
        return new Question({
            type: 'vertex_form',
            category: 'transformation',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: `y = ${vertexForm}`,
            showEquation: true,
            questionText: `Given y = ${vertexForm}, find the vertex.`,
            answerFormat: '(h, k)',
            inputType: 'coordinate',
            correctAnswer: { x: h, y: k },
            hints: [
                { text: 'In y = a(x - h)² + k, vertex is (h, k)' },
                { text: 'Be careful with signs!' }
            ],
            explanation: `Vertex: (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)})`,
            steps: [
                `From y = a(x - h)² + k`,
                `h = ${QuadraticUtils.formatNumber(h)}, k = ${QuadraticUtils.formatNumber(k)}`,
                `Vertex: (${QuadraticUtils.formatNumber(h)}, ${QuadraticUtils.formatNumber(k)})`
            ]
        });
    },

    /**
     * Find coordinates
     */
    genFindCoordinates(quadratic, difficultyId) {
        const x = QuadraticGenerator.randomInt(-5, 5);
        const y = quadratic.evaluate(x);
        
        return new Question({
            type: 'find_coordinates',
            category: 'coordinates',
            difficulty: 3,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `For ${quadratic.getEquation()}, find y when x = ${x}.`,
            answerFormat: 'y = ?',
            inputType: 'value',
            correctAnswer: y,
            hints: [
                { text: `Substitute x = ${x}` }
            ],
            explanation: `y = ${y}`,
            steps: [
                `y = ${quadratic.a}(${x})² + ${quadratic.b}(${x}) + ${quadratic.c}`,
                `y = ${y}`
            ]
        });
    },

    /**
     * Range of values
     */
    genRangeOfValues(quadratic, difficultyId) {
        const range = quadratic.getRange();
        
        return new Question({
            type: 'range_of_values',
            category: 'range',
            difficulty: 4,
            quadratic: quadratic,
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `State the range of ${quadratic.getEquation()}.`,
            answerFormat: 'y ≥ ? or y ≤ ?',
            inputType: 'inequality',
            correctAnswer: range,
            hints: [
                { text: `Find the ${quadratic.getExtremumType()} value first` }
            ],
            explanation: range.description,
            steps: [
                `${quadratic.getExtremumType()} at y = ${QuadraticUtils.formatNumber(range.value)}`,
                `Range: ${range.description}`
            ]
        });
    },

    /**
     * Line intersection
     */
    genLineIntersection(quadratic, difficultyId) {
        const r1 = QuadraticGenerator.randomInt(-3, 3);
        const r2 = QuadraticGenerator.randomInt(-3, 3);
        
        const y1 = quadratic.evaluate(r1);
        const y2 = quadratic.evaluate(r2);
        
        let m, c;
        if (r1 !== r2) {
            m = Math.round((y2 - y1) / (r2 - r1));
            c = Math.round(y1 - m * r1);
        } else {
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
            equationDisplay: quadratic.getEquation(),
            showEquation: true,
            questionText: `Find where ${quadratic.getEquation()} intersects ${line.getEquation()}.`,
            answerFormat: '(x₁, y₁) and (x₂, y₂)',
            inputType: 'coordinates',
            correctAnswer: intersections,
            hints: [
                { text: 'Set the two equations equal' },
                { text: 'Solve the resulting quadratic' }
            ],
            explanation: `Intersections: ${intersections.map(p => `(${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`).join(' and ')}`,
            steps: [
                `${quadratic.getStandardForm()} = ${m}x + ${c}`,
                `Solve to find x values`,
                ...intersections.map((p, i) => `Point ${i + 1}: (${QuadraticUtils.formatNumber(p.x)}, ${QuadraticUtils.formatNumber(p.y)})`)
            ]
        });
    },

    // =========================================================
    // UTILITY
    // =========================================================

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

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