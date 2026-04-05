/* =====================================================
   QUADRATIC CATAPULT QUEST - CONFIGURATION
   =====================================================
   CORRECTED VERSION - Matches new question types
   
   BEGINNER (Sec 1-2):
   - Substitution (find y when x = ?)
   - Solve by factorisation (find x when y = 0)
   - Factorise expressions
   - Find equation from roots
   - Complete table of values
   
   INTERMEDIATE (Sec 3):
   - Line of symmetry
   - Turning point
   - Max/min values
   - Discriminant
   
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
        version: '1.2.0',
        author: 'Educational Games',
        description: 'Master quadratic curves through interactive gameplay'
    },

    // =====================================================
    // DIFFICULTY LEVELS
    // =====================================================
    difficulty: {
        // =================================================
        // BEGINNER - Secondary 1-2
        // Substitution, factorisation, basic solving
        // ALL INTEGER ANSWERS
        // =================================================
        beginner: {
            id: 'beginner',
            name: 'Beginner',
            description: 'Sec 1-2 Level',
            icon: '🌱',
            color: '#4ECDC4',
            
            questionsPerLevel: 8,
            timePerQuestion: 0,         // No timer for beginners
            lives: 5,
            
            // Only a = 1, integer b and c for nice factorisation
            coefficients: {
                a: { min: 1, max: 1, integersOnly: true },
                b: { min: -10, max: 10, integersOnly: true },
                c: { min: -12, max: 12, integersOnly: true }
            },
            
            requireIntegerRoots: true,
            requireIntegerAnswers: true,
            
            // BEGINNER TOPICS - Must match question generator names!
            topics: [
                'substitution_find_y',      // Given x, calculate y
                'evaluate_at_point',        // Calculate expression value
                'complete_table',           // Fill in missing table value
                'solve_equation',           // Solve quadratic = 0
                'factorise_expression',     // Write in factored form
                'substitution_find_x',      // Given y, find x
                'find_equation_from_roots'  // Given roots, find b and c
            ],
            
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: false,
                showHints: true,
                multipleChoice: false,      // Text input for practice
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
            preferIntegerVertex: true,
            
            // INTERMEDIATE TOPICS
            topics: [
                'substitution_find_y',      // Still useful
                'solve_equation',           // Solve by factorising
                'axis_symmetry_basic',      // x = -b/(2a), integer answer
                'axis_symmetry',            // x = -b/(2a), any answer
                'turning_point_basic',      // Integer vertex
                'turning_point',            // Any vertex
                'max_min_value',            // Maximum or minimum y
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
        // Full syllabus
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
            
            // ADVANCED TOPICS
            topics: [
                'axis_symmetry',
                'turning_point',
                'max_min_value',
                'solve_equation',
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
            
            // EXPERT TOPICS
            topics: [
                'turning_point',
                'max_min_value',
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
                showHints: false,
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
    // QUESTION TYPES - Must match generator function names!
    // =====================================================
    questionTypes: {
        // -------------------------------------------------
        // BEGINNER (Sec 1-2) - Substitution & Factorisation
        // -------------------------------------------------
        
        substitution_find_y: {
            id: 'substitution_find_y',
            name: 'Find y (Substitution)',
            description: 'Given x value, calculate y',
            category: 'substitution',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'y = x² - 3x + 2. Find y when x = 4.'
        },
        
        evaluate_at_point: {
            id: 'evaluate_at_point',
            name: 'Evaluate Expression',
            description: 'Calculate expression value at given x',
            category: 'substitution',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'Calculate x² - 5x + 6 when x = 3.'
        },
        
        complete_table: {
            id: 'complete_table',
            name: 'Complete Table',
            description: 'Fill in missing value in table',
            category: 'substitution',
            inputType: 'value',
            difficulty: 1,
            requiresInteger: true,
            example: 'Complete the table of values.'
        },
        
        substitution_find_x: {
            id: 'substitution_find_x',
            name: 'Find x (Substitution)',
            description: 'Given y value, find x by solving',
            category: 'substitution',
            inputType: 'values',
            difficulty: 2,
            requiresInteger: true,
            example: 'y = x² - 5x + 6. Find x when y = 0.'
        },
        
        factorise_expression: {
            id: 'factorise_expression',
            name: 'Factorise',
            description: 'Write expression in factored form',
            category: 'factorisation',
            inputType: 'factored',
            difficulty: 2,
            requiresInteger: true,
            example: 'Factorise: x² - 5x + 6'
        },
        
        solve_equation: {
            id: 'solve_equation',
            name: 'Solve Equation',
            description: 'Solve quadratic equation = 0',
            category: 'factorisation',
            inputType: 'values',
            difficulty: 2,
            requiresInteger: true,
            example: 'Solve x² - 5x + 6 = 0'
        },
        
        find_equation_from_roots: {
            id: 'find_equation_from_roots',
            name: 'Find Equation from Roots',
            description: 'Given roots, find coefficients b and c',
            category: 'factorisation',
            inputType: 'coefficients',
            difficulty: 2,
            requiresInteger: true,
            example: 'Roots are x = 2 and x = 3. Find b and c.'
        },
        
        // -------------------------------------------------
        // INTERMEDIATE (Sec 3) - Symmetry & Turning Point
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
            description: 'Find line of symmetry using x = -b/(2a)',
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
            description: 'Find the vertex coordinates',
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
            name: 'Discriminant (Basic)',
            description: 'Calculate b² - 4ac',
            category: 'roots',
            inputType: 'value',
            difficulty: 2,
            requiresInteger: true
        },
        
        // -------------------------------------------------
        // ADVANCED (O-Level 4052)
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
            description: 'Calculate and interpret discriminant',
            category: 'roots',
            inputType: 'value',
            difficulty: 3,
            requiresInteger: true
        },
        
        nature_of_roots: {
            id: 'nature_of_roots',
            name: 'Nature of Roots',
            description: 'Determine type of roots from discriminant',
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
            description: 'Write in vertex form a(x-h)² + k',
            category: 'transformation',
            inputType: 'multiple_values',
            format: 'a = ?, h = ?, k = ?',
            difficulty: 4,
            requiresInteger: false
        },
        
        vertex_form: {
            id: 'vertex_form',
            name: 'Vertex Form',
            description: 'Find vertex from completed square form',
            category: 'transformation',
            inputType: 'coordinate',
            difficulty: 3,
            requiresInteger: false
        },
        
        find_coordinates: {
            id: 'find_coordinates',
            name: 'Find Coordinates',
            description: 'Find y for given x on curve',
            category: 'coordinates',
            inputType: 'value',
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
            description: 'Find where line meets curve',
            category: 'intersection',
            inputType: 'coordinates',
            format: '(x₁, y₁) and (x₂, y₂)',
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
                text: 'Replace x with the given value and calculate step by step.',
                formula: 'y = a(x)² + b(x) + c'
            },
            factoring: {
                title: 'Factorisation',
                text: 'Find two numbers that multiply to c and add to b.',
                formula: 'x² + bx + c = (x + p)(x + q) where p×q = c and p+q = b'
            },
            axis_symmetry: {
                title: 'Line of Symmetry',
                text: 'Use the formula to find the vertical line through the turning point.',
                formula: 'x = -b ÷ (2a)'
            },
            turning_point: {
                title: 'Turning Point',
                text: 'Find x first using -b/(2a), then substitute to find y.',
                formula: 'Vertex: (-b/(2a), f(-b/(2a)))'
            },
            quadratic_formula: {
                title: 'Quadratic Formula',
                text: 'Use when factorising is difficult.',
                formula: 'x = (-b ± √(b²-4ac)) / (2a)'
            },
            discriminant: {
                title: 'Discriminant',
                text: 'Calculate b² - 4ac to determine the nature of roots.',
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
            description: 'Answer correctly in under 5 seconds',
            icon: '⚡'
        },
        perfectionist: {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: '100% accuracy in a level',
            icon: '💯'
        },
        level_master: {
            id: 'level_master',
            name: 'Level Master',
            description: 'Complete all difficulty levels',
            icon: '👑'
        }
    },

    // =====================================================
    // DEBUG SETTINGS
    // =====================================================
    debug: {
        enabled: false,
        showFPS: false,
        showCoordinates: false,
        logQuestions: true,
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
    range: 'Range'
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, MATH_CONSTANTS, EASING, COLORS, CATEGORY_NAMES };
}