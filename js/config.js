/* =====================================================
   QUADRATIC CATAPULT QUEST - CONFIGURATION
   =====================================================
   All game constants, settings, and configuration
   CORRECTED: Proper topics for each level
   
   BEGINNER (Sec 1-2):
   - Substitution (find y when x = ?)
   - Factorisation (solve when y = 0, integer roots)
   - Y-intercept (just the constant c)
   - Direction of opening (up/down)
   
   INTERMEDIATE (Sec 3):
   - Line of symmetry formula
   - Turning point
   - Max/min values
   - Discriminant basics
   
   ADVANCED (O-Level 4052):
   - Quadratic formula
   - Completing the square
   - Nature of roots
   - Line intersection
   ===================================================== */

const CONFIG = {
    // =====================================================
    // GAME INFORMATION
    // =====================================================
    game: {
        name: 'Quadratic Catapult Quest',
        version: '1.1.0',
        author: 'Educational Games',
        description: 'Master quadratic curves through interactive gameplay'
    },

    // =====================================================
    // DIFFICULTY LEVELS
    // =====================================================
    difficulty: {
        // =================================================
        // BEGINNER - Secondary 1-2
        // Only substitution, factorisation, basic concepts
        // ALL ANSWERS MUST BE INTEGERS
        // =================================================
        beginner: {
            id: 'beginner',
            name: 'Beginner',
            description: 'Sec 1-2 Level',
            icon: '🌱',
            color: '#4ECDC4',
            
            questionsPerLevel: 8,
            timePerQuestion: 0,     // No timer for beginners
            lives: 5,
            
            // Only a = 1, integer b and c for nice factorisation
            coefficients: {
                a: { min: 1, max: 1, integersOnly: true },
                b: { min: -10, max: 10, integersOnly: true },
                c: { min: -12, max: 12, integersOnly: true }
            },
            
            // MUST have integer roots for factorisation
            requireIntegerRoots: true,
            requireIntegerAnswers: true,
            
            // Topics for Sec 1-2 ONLY
            topics: [
                'find_y_given_x',           // Substitution: find y when x = 2
                'evaluate_expression',       // Same as above, different wording
                'y_intercept',              // Just identify c
                'direction_opening',         // Up or down based on sign of a
                'x_intercepts_factor',      // Solve by factorisation (integer roots)
                'find_x_given_y_basic'      // Solve when y = 0 (same as x-intercepts)
            ],
            
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: false,   // Don't show vertex form
                showHints: true,
                multipleChoice: true,       // Easier for beginners
                graphTools: false
            },
            
            scoring: {
                correct: 100,
                timeBonus: 0,
                streakMultiplier: 1.2,
                hintPenalty: 20,
                skipPenalty: 50
            }
        },
        
        // =================================================
        // INTERMEDIATE - Secondary 3
        // Line of symmetry, turning point, max/min
        // Can have simple decimals (halves)
        // =================================================
        intermediate: {
            id: 'intermediate',
            name: 'Intermediate',
            description: 'Sec 3 Level',
            icon: '🌿',
            color: '#FFE66D',
            
            questionsPerLevel: 10,
            timePerQuestion: 90,
            lives: 4,
            
            coefficients: {
                a: { min: 1, max: 2, allowNegative: true, integersOnly: true },
                b: { min: -10, max: 10, integersOnly: true },
                c: { min: -12, max: 12, integersOnly: true }
            },
            
            requireIntegerRoots: false,
            requireIntegerAnswers: false,
            preferIntegerVertex: true,      // Prefer but not required
            
            topics: [
                'find_y_given_x',           // Still useful
                'y_intercept',
                'x_intercepts_factor',      // Factorisation
                'axis_symmetry_basic',      // x = -b/(2a) with integer answer
                'axis_symmetry',            // x = -b/(2a) general
                'turning_point_basic',      // Integer vertex
                'turning_point',            // General vertex
                'max_min_value',            // Maximum or minimum y value
                'discriminant_basic'        // Calculate b² - 4ac
            ],
            
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: true,
                showHints: true,
                multipleChoice: false,
                graphTools: false
            },
            
            scoring: {
                correct: 150,
                timeBonus: 2,
                streakMultiplier: 1.3,
                hintPenalty: 30,
                skipPenalty: 75
            }
        },
        
        // =================================================
        // ADVANCED - O-Level 4052
        // Full syllabus including quadratic formula,
        // completing square, intersections
        // =================================================
        advanced: {
            id: 'advanced',
            name: 'Advanced',
            description: 'O-Level 4052',
            icon: '🌳',
            color: '#FF9F43',
            
            questionsPerLevel: 12,
            timePerQuestion: 75,
            lives: 3,
            
            coefficients: {
                a: { min: 1, max: 3, allowNegative: true, integersOnly: true },
                b: { min: -12, max: 12, integersOnly: true },
                c: { min: -15, max: 15, integersOnly: true }
            },
            
            requireIntegerRoots: false,
            requireIntegerAnswers: false,
            
            topics: [
                'axis_symmetry',
                'turning_point',
                'max_min_value',
                'x_intercepts_factor',
                'x_intercepts_quadratic_formula',
                'discriminant',
                'nature_of_roots',
                'completing_square',
                'vertex_form',
                'find_coordinates',
                'range_of_values',
                'line_intersection'
            ],
            
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: true,
                showHints: true,
                multipleChoice: false,
                graphTools: true
            },
            
            scoring: {
                correct: 200,
                timeBonus: 3,
                streakMultiplier: 1.5,
                hintPenalty: 40,
                skipPenalty: 100
            }
        },
        
        // =================================================
        // EXPERT - Challenge Mode
        // All topics with harder numbers
        // =================================================
        expert: {
            id: 'expert',
            name: 'Expert',
            description: 'Challenge Mode',
            icon: '🏆',
            color: '#A55EEA',
            
            questionsPerLevel: 15,
            timePerQuestion: 60,
            lives: 3,
            
            coefficients: {
                a: { min: 1, max: 5, allowNegative: true, integersOnly: true },
                b: { min: -15, max: 15, integersOnly: true },
                c: { min: -20, max: 20, integersOnly: true }
            },
            
            requireIntegerRoots: false,
            requireIntegerAnswers: false,
            
            topics: [
                'axis_symmetry',
                'turning_point',
                'max_min_value',
                'x_intercepts_quadratic_formula',
                'discriminant',
                'nature_of_roots',
                'completing_square',
                'vertex_form',
                'find_coordinates',
                'range_of_values',
                'line_intersection',
                'simultaneous_equations',
                'tangent_conditions'
            ],
            
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: true,
                showHints: false,           // No hints for experts
                multipleChoice: false,
                graphTools: true
            },
            
            scoring: {
                correct: 300,
                timeBonus: 5,
                streakMultiplier: 2.0,
                hintPenalty: 0,
                skipPenalty: 150
            }
        }
    },

    // =====================================================
    // QUESTION TYPES DEFINITION
    // =====================================================
    questionTypes: {
        // -------------------------------------------------
        // BEGINNER QUESTIONS (Sec 1-2)
        // -------------------------------------------------
        
        find_y_given_x: {
            id: 'find_y_given_x',
            name: 'Find y given x',
            description: 'Substitute x value to find y',
            category: 'substitution',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'If y = x² - 3x + 2, find y when x = 4'
        },
        
        evaluate_expression: {
            id: 'evaluate_expression',
            name: 'Evaluate Expression',
            description: 'Calculate y for a given x',
            category: 'substitution',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'Calculate the value of x² - 5x + 6 when x = 3'
        },
        
        y_intercept: {
            id: 'y_intercept',
            name: 'Y-Intercept',
            description: 'Find where graph crosses y-axis',
            category: 'basic',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'Find the y-intercept of y = x² + 2x - 8'
        },
        
        direction_opening: {
            id: 'direction_opening',
            name: 'Direction of Opening',
            description: 'Does the parabola open up or down?',
            category: 'basic',
            inputType: 'multiple_choice',
            difficulty: 1,
            requiresInteger: true,
            example: 'Does y = -x² + 3x open upwards or downwards?'
        },
        
        x_intercepts_factor: {
            id: 'x_intercepts_factor',
            name: 'Solve by Factorisation',
            description: 'Find x when y = 0 by factoring',
            category: 'factorisation',
            inputType: 'values',
            format: 'x = ? or x = ?',
            difficulty: 2,
            requiresInteger: true,
            example: 'Solve x² - 5x + 6 = 0'
        },
        
        find_x_given_y_basic: {
            id: 'find_x_given_y_basic',
            name: 'Solve Equation',
            description: 'Find x when y = 0',
            category: 'factorisation',
            inputType: 'values',
            format: 'x = ?',
            difficulty: 2,
            requiresInteger: true,
            example: 'Solve x² - 4 = 0'
        },
        
        // -------------------------------------------------
        // INTERMEDIATE QUESTIONS (Sec 3)
        // -------------------------------------------------
        
        axis_symmetry_basic: {
            id: 'axis_symmetry_basic',
            name: 'Line of Symmetry (Basic)',
            description: 'Find line of symmetry - integer answer',
            category: 'symmetry',
            inputType: 'equation',
            format: 'x = ?',
            difficulty: 2,
            requiresInteger: true
        },
        
        axis_symmetry: {
            id: 'axis_symmetry',
            name: 'Line of Symmetry',
            description: 'Find line of symmetry using formula',
            category: 'symmetry',
            inputType: 'equation',
            format: 'x = ?',
            difficulty: 3,
            requiresInteger: false
        },
        
        turning_point_basic: {
            id: 'turning_point_basic',
            name: 'Turning Point (Basic)',
            description: 'Find turning point - integer coordinates',
            category: 'turning_point',
            inputType: 'coordinate',
            format: '(x, y)',
            difficulty: 2,
            requiresInteger: true
        },
        
        turning_point: {
            id: 'turning_point',
            name: 'Turning Point',
            description: 'Find the vertex',
            category: 'turning_point',
            inputType: 'coordinate',
            format: '(x, y)',
            difficulty: 3,
            requiresInteger: false
        },
        
        max_min_value: {
            id: 'max_min_value',
            name: 'Maximum/Minimum Value',
            description: 'Find the max or min y value',
            category: 'optimization',
            inputType: 'value',
            difficulty: 3,
            requiresInteger: false
        },
        
        discriminant_basic: {
            id: 'discriminant_basic',
            name: 'Discriminant',
            description: 'Calculate b² - 4ac',
            category: 'roots',
            inputType: 'value',
            difficulty: 2,
            requiresInteger: true
        },
        
        // -------------------------------------------------
        // ADVANCED QUESTIONS (O-Level 4052)
        // -------------------------------------------------
        
        x_intercepts_quadratic_formula: {
            id: 'x_intercepts_quadratic_formula',
            name: 'Quadratic Formula',
            description: 'Solve using quadratic formula',
            category: 'intercepts',
            inputType: 'values',
            format: 'x = ?, ?',
            difficulty: 4,
            requiresInteger: false
        },
        
        discriminant: {
            id: 'discriminant',
            name: 'Discriminant',
            description: 'Calculate the discriminant',
            category: 'roots',
            inputType: 'value',
            difficulty: 3,
            requiresInteger: true
        },
        
        nature_of_roots: {
            id: 'nature_of_roots',
            name: 'Nature of Roots',
            description: 'Determine type of roots',
            category: 'roots',
            inputType: 'multiple_choice',
            choices: [
                'Two different real roots',
                'Two equal real roots',
                'No real roots'
            ],
            difficulty: 3
        },
        
        completing_square: {
            id: 'completing_square',
            name: 'Completing the Square',
            description: 'Write in vertex form',
            category: 'transformation',
            inputType: 'equation',
            format: 'a(x - h)² + k',
            difficulty: 4,
            requiresInteger: false
        },
        
        vertex_form: {
            id: 'vertex_form',
            name: 'Vertex Form',
            description: 'Identify vertex from completed square',
            category: 'transformation',
            inputType: 'coordinate',
            difficulty: 3,
            requiresInteger: false
        },
        
        find_coordinates: {
            id: 'find_coordinates',
            name: 'Find Coordinates',
            description: 'Find points on the curve',
            category: 'coordinates',
            inputType: 'coordinate',
            difficulty: 3,
            requiresInteger: false
        },
        
        range_of_values: {
            id: 'range_of_values',
            name: 'Range of Values',
            description: 'State the range of y',
            category: 'range',
            inputType: 'inequality',
            format: 'y ≥ ? or y ≤ ?',
            difficulty: 4,
            requiresInteger: false
        },
        
        line_intersection: {
            id: 'line_intersection',
            name: 'Line Intersection',
            description: 'Find intersection with a line',
            category: 'intersection',
            inputType: 'coordinates',
            format: '(x₁, y₁), (x₂, y₂)',
            difficulty: 5,
            requiresInteger: false
        },
        
        simultaneous_equations: {
            id: 'simultaneous_equations',
            name: 'Simultaneous Equations',
            description: 'Solve with linear equation',
            category: 'intersection',
            inputType: 'coordinates',
            difficulty: 5,
            requiresInteger: false
        },
        
        tangent_conditions: {
            id: 'tangent_conditions',
            name: 'Tangent Conditions',
            description: 'Find when line is tangent',
            category: 'advanced',
            inputType: 'value',
            difficulty: 5,
            requiresInteger: false
        }
    },

    // =====================================================
    // CANVAS SETTINGS
    // =====================================================
    canvas: {
        width: 800,
        height: 600,
        padding: 50,
        
        grid: {
            standard: {
                majorStep: 1,
                minorStep: 0.5,
                showMinor: true,
                majorColor: 'rgba(255, 255, 255, 0.2)',
                minorColor: 'rgba(255, 255, 255, 0.08)',
                majorWidth: 1,
                minorWidth: 0.5
            },
            detailed: {
                majorStep: 1,
                minorStep: 0.25,
                showMinor: true,
                majorColor: 'rgba(255, 255, 255, 0.25)',
                minorColor: 'rgba(255, 255, 255, 0.1)',
                majorWidth: 1.5,
                minorWidth: 0.5
            },
            minimal: {
                majorStep: 2,
                minorStep: 1,
                showMinor: false,
                majorColor: 'rgba(255, 255, 255, 0.15)',
                minorColor: 'rgba(255, 255, 255, 0.05)',
                majorWidth: 1,
                minorWidth: 0.5
            }
        },
        
        axis: {
            color: 'rgba(255, 255, 255, 0.6)',
            width: 2,
            arrowSize: 10,
            labelOffset: 20,
            labelFont: '14px Poppins',
            labelColor: 'rgba(255, 255, 255, 0.7)',
            tickSize: 6,
            tickWidth: 1
        },
        
        defaultView: {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10
        },
        
        curve: {
            color: '#6C63FF',
            width: 3,
            points: 200,
            glowColor: 'rgba(108, 99, 255, 0.4)',
            glowBlur: 10
        },
        
        line: {
            color: '#FF9F43',
            width: 2,
            dashPattern: [5, 5]
        },
        
        point: {
            radius: 6,
            fillColor: '#FF6B6B',
            strokeColor: '#fff',
            strokeWidth: 2,
            labelFont: '12px Poppins',
            labelOffset: 15
        },
        
        target: {
            radius: 20,
            innerRadius: 8,
            outerColor: '#FF6B6B',
            innerColor: '#FFE66D',
            strokeWidth: 3,
            pulseSpeed: 1500
        },
        
        projectile: {
            radius: 8,
            color: '#FFE66D',
            trailColor: 'rgba(255, 230, 109, 0.3)',
            trailLength: 20,
            speed: 5
        }
    },

    // =====================================================
    // ANIMATION SETTINGS
    // =====================================================
    animation: {
        projectile: {
            duration: 2000,
            easing: 'easeOutQuad',
            trailFade: 0.95
        },
        curveReveal: {
            duration: 1500,
            easing: 'easeInOutCubic'
        },
        hitEffect: {
            duration: 500,
            particles: 20,
            colors: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#6C63FF']
        },
        missEffect: {
            duration: 300,
            shake: 10
        },
        scorePopup: {
            duration: 1000,
            rise: 50
        }
    },

    // =====================================================
    // SCORING SYSTEM
    // =====================================================
    scoring: {
        baseCorrect: 100,
        
        timeBonusThresholds: [
            { time: 10, multiplier: 2.0 },
            { time: 20, multiplier: 1.5 },
            { time: 30, multiplier: 1.2 },
            { time: 60, multiplier: 1.0 }
        ],
        
        streakThresholds: [
            { streak: 3, bonus: 50 },
            { streak: 5, bonus: 100 },
            { streak: 7, bonus: 200 },
            { streak: 10, bonus: 500 }
        ],
        
        perfectBonus: 1000,
        
        starRating: {
            threeStar: 0.8,
            twoStar: 0.6,
            oneStar: 0.4
        }
    },

    // =====================================================
    // HINT SYSTEM
    // =====================================================
    hints: {
        formulas: {
            substitution: {
                title: 'Substitution',
                text: 'Replace x with the given value and calculate.',
                formula: 'y = a(value)² + b(value) + c'
            },
            factoring: {
                title: 'Factorisation',
                text: 'Find two numbers that multiply to c and add to b.',
                formula: 'x² + bx + c = (x + p)(x + q) where p×q = c and p+q = b'
            },
            y_intercept: {
                title: 'Y-Intercept',
                text: 'The y-intercept is the constant term c.',
                formula: 'When x = 0, y = c'
            },
            axis_symmetry: {
                title: 'Line of Symmetry',
                text: 'Use the formula x = -b/(2a)',
                formula: 'x = -b / (2a)'
            },
            turning_point: {
                title: 'Turning Point',
                text: 'Find x using -b/(2a), then substitute to find y.',
                formula: 'Vertex: (-b/(2a), f(-b/(2a)))'
            },
            quadratic_formula: {
                title: 'Quadratic Formula',
                text: 'Use when factorising is difficult.',
                formula: 'x = (-b ± √(b²-4ac)) / (2a)'
            },
            discriminant: {
                title: 'Discriminant',
                text: 'D = b² - 4ac tells us about the roots.',
                formula: 'D > 0: two roots, D = 0: one root, D < 0: no real roots'
            }
        },
        cooldown: 5000,
        maxHints: 3
    },

    // =====================================================
    // UI SETTINGS
    // =====================================================
    ui: {
        toast: {
            duration: 3000,
            position: 'top-right'
        },
        confirmations: {
            quit: true,
            restart: true,
            skip: false
        },
        tutorial: {
            showOnFirstPlay: true,
            stepDelay: 500
        },
        shortcuts: {
            launch: 'Enter',
            hint: 'h',
            pause: 'Escape',
            skip: 's',
            formulaPanel: 'f'
        }
    },

    // =====================================================
    // STORAGE KEYS
    // =====================================================
    storage: {
        prefix: 'quadratic_quest_',
        keys: {
            settings: 'settings',
            progress: 'progress',
            highScores: 'high_scores',
            stats: 'statistics',
            achievements: 'achievements',
            tutorialComplete: 'tutorial_complete'
        }
    },

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================
    achievements: {
        first_launch: {
            id: 'first_launch',
            name: 'First Launch',
            description: 'Complete your first question',
            icon: '🚀'
        },
        perfect_aim: {
            id: 'perfect_aim',
            name: 'Perfect Aim',
            description: 'Get 10 correct in a row',
            icon: '🎯'
        },
        factoring_master: {
            id: 'factoring_master',
            name: 'Factoring Master',
            description: 'Solve 20 factorisation questions',
            icon: '🧮'
        },
        speed_demon: {
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Answer in under 5 seconds',
            icon: '⚡'
        },
        perfectionist: {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: '100% accuracy in a level',
            icon: '💯'
        },
        level_complete: {
            id: 'level_complete',
            name: 'Level Complete',
            description: 'Complete all questions in a level',
            icon: '✅'
        }
    },

    // =====================================================
    // DEBUG SETTINGS
    // =====================================================
    debug: {
        enabled: false,
        showFPS: false,
        showCoordinates: false,
        logQuestions: false,
        skipAnimations: false,
        unlockAll: false
    }
};

// =====================================================
// HELPER CONSTANTS
// =====================================================

const MATH_CONSTANTS = {
    EPSILON: 0.0001,
    MAX_ITERATIONS: 100,
    ROUNDING_PRECISION: 4
};

const EASING = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutElastic: t => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
};

const COLORS = {
    primary: '#6C63FF',
    secondary: '#FF6B6B',
    success: '#00d26a',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#3498db',
    curve: '#6C63FF',
    curveNegative: '#FF6B6B',
    grid: 'rgba(255, 255, 255, 0.1)',
    axis: 'rgba(255, 255, 255, 0.5)',
    turningPoint: '#FFE66D',
    intercepts: '#4ECDC4',
    intersection: '#A55EEA',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#ffffff',
    textMuted: '#b8b8d1'
};

const CATEGORY_NAMES = {
    basic: 'Basic Concepts',
    substitution: 'Substitution',
    factorisation: 'Factorisation',
    symmetry: 'Line of Symmetry',
    turning_point: 'Turning Point',
    intercepts: 'Intercepts',
    optimization: 'Max/Min Values',
    transformation: 'Transformations',
    roots: 'Roots & Discriminant',
    intersection: 'Intersections',
    coordinates: 'Coordinates',
    range: 'Range',
    advanced: 'Advanced'
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, MATH_CONSTANTS, EASING, COLORS, CATEGORY_NAMES };
}