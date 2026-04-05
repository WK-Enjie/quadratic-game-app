/* =====================================================
   QUADRATIC CATAPULT QUEST - CONFIGURATION
   =====================================================
   All game constants, settings, and configuration
   ===================================================== */

const CONFIG = {
    // =====================================================
    // GAME INFORMATION
    // =====================================================
    game: {
        name: 'Quadratic Catapult Quest',
        version: '1.0.0',
        author: 'Educational Games',
        description: 'Master quadratic curves through interactive gameplay'
    },

    // =====================================================
    // DIFFICULTY LEVELS
    // =====================================================
    difficulty: {
        beginner: {
            id: 'beginner',
            name: 'Beginner',
            description: 'Sec 1-2 Level',
            icon: '🌱',
            color: '#4ECDC4',
            
            // Question settings
            questionsPerLevel: 8,
            timePerQuestion: 0, // 0 = no timer
            lives: 5,
            
            // Coefficient ranges (for generating equations)
            coefficients: {
                a: { min: 1, max: 1, allowNegative: false },      // Only a = 1
                b: { min: -6, max: 6, allowZero: true },          // Simple b values
                c: { min: -9, max: 9, allowZero: true }           // Simple c values
            },
            
            // Topics covered at this level
            topics: [
                'identify_parabola',
                'direction_opening',
                'y_intercept',
                'axis_symmetry_basic',
                'turning_point_basic'
            ],
            
            // Features enabled
            features: {
                showGrid: true,
                showAxisLabels: true,
                showEquationForms: false,
                showHints: true,
                multipleChoice: true,
                graphTools: false
            },
            
            // Scoring
            scoring: {
                correct: 100,
                timeBonus: 0,
                streakMultiplier: 1.2,
                hintPenalty: 20,
                skipPenalty: 50
            }
        },
        
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
                a: { min: 1, max: 3, allowNegative: true },
                b: { min: -8, max: 8, allowZero: true },
                c: { min: -12, max: 12, allowZero: true }
            },
            
            topics: [
                'axis_symmetry',
                'turning_point',
                'x_intercepts_factor',
                'y_intercept',
                'vertex_form',
                'max_min_value',
                'sketch_from_equation'
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
                a: { min: 1, max: 5, allowNegative: true },
                b: { min: -10, max: 10, allowZero: true },
                c: { min: -15, max: 15, allowZero: true }
            },
            
            topics: [
                'axis_symmetry',
                'turning_point',
                'x_intercepts_quadratic_formula',
                'discriminant',
                'nature_of_roots',
                'completing_square',
                'line_intersection',
                'find_coordinates',
                'range_of_values',
                'sketch_from_properties'
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
                a: { min: 1, max: 5, allowNegative: true, allowFractions: true },
                b: { min: -12, max: 12, allowZero: true },
                c: { min: -20, max: 20, allowZero: true }
            },
            
            topics: [
                'axis_symmetry',
                'turning_point',
                'x_intercepts_quadratic_formula',
                'discriminant',
                'nature_of_roots',
                'completing_square',
                'line_intersection',
                'find_coordinates',
                'range_of_values',
                'sketch_from_properties',
                'simultaneous_equations',
                'tangent_conditions',
                'parameter_problems',
                'word_problems'
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
    // QUESTION TYPES DEFINITION
    // =====================================================
    questionTypes: {
        // Basic Understanding
        identify_parabola: {
            id: 'identify_parabola',
            name: 'Identify Parabola',
            description: 'Identify which graph represents a quadratic function',
            category: 'basic',
            inputType: 'multiple_choice',
            difficulty: 1
        },
        
        direction_opening: {
            id: 'direction_opening',
            name: 'Direction of Opening',
            description: 'Determine if parabola opens upward or downward',
            category: 'basic',
            inputType: 'multiple_choice',
            difficulty: 1
        },
        
        y_intercept: {
            id: 'y_intercept',
            name: 'Y-Intercept',
            description: 'Find the y-intercept of the quadratic',
            category: 'basic',
            inputType: 'coordinate_single',
            difficulty: 1
        },
        
        // Line of Symmetry
        axis_symmetry_basic: {
            id: 'axis_symmetry_basic',
            name: 'Line of Symmetry (Basic)',
            description: 'Find the line of symmetry for simple quadratics',
            category: 'symmetry',
            inputType: 'equation',
            format: 'x = ?',
            difficulty: 2
        },
        
        axis_symmetry: {
            id: 'axis_symmetry',
            name: 'Line of Symmetry',
            description: 'Find the line of symmetry using formula',
            category: 'symmetry',
            inputType: 'equation',
            format: 'x = ?',
            difficulty: 3
        },
        
        // Turning Point
        turning_point_basic: {
            id: 'turning_point_basic',
            name: 'Turning Point (Basic)',
            description: 'Find the turning point from graph or simple equation',
            category: 'turning_point',
            inputType: 'coordinate',
            format: '(x, y)',
            difficulty: 2
        },
        
        turning_point: {
            id: 'turning_point',
            name: 'Turning Point',
            description: 'Calculate the turning point algebraically',
            category: 'turning_point',
            inputType: 'coordinate',
            format: '(x, y)',
            difficulty: 3
        },
        
        // X-Intercepts
        x_intercepts_factor: {
            id: 'x_intercepts_factor',
            name: 'X-Intercepts (Factoring)',
            description: 'Find x-intercepts by factoring',
            category: 'intercepts',
            inputType: 'values',
            format: 'x = ?, ?',
            difficulty: 3
        },
        
        x_intercepts_quadratic_formula: {
            id: 'x_intercepts_quadratic_formula',
            name: 'X-Intercepts (Formula)',
            description: 'Find x-intercepts using quadratic formula',
            category: 'intercepts',
            inputType: 'values',
            format: 'x = ?, ?',
            difficulty: 4
        },
        
        // Maximum/Minimum
        max_min_value: {
            id: 'max_min_value',
            name: 'Maximum/Minimum Value',
            description: 'Find the maximum or minimum value of the quadratic',
            category: 'optimization',
            inputType: 'value',
            difficulty: 3
        },
        
        // Completing the Square
        completing_square: {
            id: 'completing_square',
            name: 'Completing the Square',
            description: 'Convert to vertex form a(x-h)² + k',
            category: 'transformation',
            inputType: 'equation',
            format: 'a(x - h)² + k',
            difficulty: 4
        },
        
        vertex_form: {
            id: 'vertex_form',
            name: 'Vertex Form',
            description: 'Identify vertex from completed square form',
            category: 'transformation',
            inputType: 'coordinate',
            difficulty: 3
        },
        
        // Discriminant & Nature of Roots
        discriminant: {
            id: 'discriminant',
            name: 'Discriminant',
            description: 'Calculate the discriminant b² - 4ac',
            category: 'roots',
            inputType: 'value',
            difficulty: 3
        },
        
        nature_of_roots: {
            id: 'nature_of_roots',
            name: 'Nature of Roots',
            description: 'Determine the nature of roots from discriminant',
            category: 'roots',
            inputType: 'multiple_choice',
            choices: [
                'Two distinct real roots',
                'Two equal real roots',
                'No real roots'
            ],
            difficulty: 3
        },
        
        // Line Intersection
        line_intersection: {
            id: 'line_intersection',
            name: 'Line-Parabola Intersection',
            description: 'Find where a line intersects the parabola',
            category: 'intersection',
            inputType: 'coordinates',
            format: '(x₁, y₁), (x₂, y₂)',
            difficulty: 5
        },
        
        find_coordinates: {
            id: 'find_coordinates',
            name: 'Find Coordinates',
            description: 'Find coordinates of points on the curve',
            category: 'coordinates',
            inputType: 'coordinate',
            difficulty: 3
        },
        
        // Range and Domain
        range_of_values: {
            id: 'range_of_values',
            name: 'Range of Values',
            description: 'Find the range of values for y',
            category: 'range',
            inputType: 'inequality',
            format: 'y ≥ ? or y ≤ ?',
            difficulty: 4
        },
        
        // Sketching
        sketch_from_equation: {
            id: 'sketch_from_equation',
            name: 'Sketch from Equation',
            description: 'Identify key features to sketch the graph',
            category: 'sketching',
            inputType: 'multiple_features',
            difficulty: 4
        },
        
        sketch_from_properties: {
            id: 'sketch_from_properties',
            name: 'Sketch from Properties',
            description: 'Given properties, identify the correct equation',
            category: 'sketching',
            inputType: 'multiple_choice',
            difficulty: 4
        },
        
        // Advanced Topics
        simultaneous_equations: {
            id: 'simultaneous_equations',
            name: 'Simultaneous Equations',
            description: 'Solve simultaneous equations with quadratic',
            category: 'advanced',
            inputType: 'coordinates',
            difficulty: 5
        },
        
        tangent_conditions: {
            id: 'tangent_conditions',
            name: 'Tangent Conditions',
            description: 'Find conditions for line to be tangent',
            category: 'advanced',
            inputType: 'value',
            difficulty: 5
        },
        
        parameter_problems: {
            id: 'parameter_problems',
            name: 'Parameter Problems',
            description: 'Find values of unknown coefficients',
            category: 'advanced',
            inputType: 'value',
            difficulty: 5
        },
        
        word_problems: {
            id: 'word_problems',
            name: 'Word Problems',
            description: 'Apply quadratics to real-world scenarios',
            category: 'advanced',
            inputType: 'value',
            difficulty: 5
        }
    },

    // =====================================================
    // CANVAS SETTINGS
    // =====================================================
    canvas: {
        // Default dimensions
        width: 800,
        height: 600,
        
        // Padding from edges
        padding: 40,
        
        // Grid settings
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
        
        // Axis settings
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
        
        // Default view range
        defaultView: {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10
        },
        
        // Curve drawing settings
        curve: {
            color: '#6C63FF',
            width: 3,
            points: 200,      // Number of points to plot
            glowColor: 'rgba(108, 99, 255, 0.4)',
            glowBlur: 10
        },
        
        // Additional line settings
        line: {
            color: '#FF9F43',
            width: 2,
            dashPattern: [5, 5]
        },
        
        // Point markers
        point: {
            radius: 6,
            fillColor: '#FF6B6B',
            strokeColor: '#fff',
            strokeWidth: 2,
            labelFont: '12px Poppins',
            labelOffset: 15
        },
        
        // Target settings
        target: {
            radius: 20,
            innerRadius: 8,
            outerColor: '#FF6B6B',
            innerColor: '#FFE66D',
            strokeWidth: 3,
            pulseSpeed: 1500
        },
        
        // Projectile settings
        projectile: {
            radius: 8,
            color: '#FFE66D',
            trailColor: 'rgba(255, 230, 109, 0.3)',
            trailLength: 20,
            speed: 5
        },
        
        // Catapult settings
        catapult: {
            color: '#8B4513',
            width: 60,
            height: 40,
            armLength: 50
        }
    },

    // =====================================================
    // ANIMATION SETTINGS
    // =====================================================
    animation: {
        // Projectile animation
        projectile: {
            duration: 2000,      // ms
            easing: 'easeOutQuad',
            trailFade: 0.95
        },
        
        // Curve drawing animation
        curveReveal: {
            duration: 1500,
            easing: 'easeInOutCubic'
        },
        
        // Hit effect
        hitEffect: {
            duration: 500,
            particles: 20,
            colors: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#6C63FF']
        },
        
        // Miss effect
        missEffect: {
            duration: 300,
            shake: 10
        },
        
        // Score popup
        scorePopup: {
            duration: 1000,
            rise: 50
        },
        
        // Level transition
        levelTransition: {
            duration: 800
        }
    },

    // =====================================================
    // SCORING SYSTEM
    // =====================================================
    scoring: {
        // Base points (overridden by difficulty)
        baseCorrect: 100,
        
        // Time bonus calculation
        timeBonusThresholds: [
            { time: 10, multiplier: 2.0 },   // < 10 seconds
            { time: 20, multiplier: 1.5 },   // < 20 seconds
            { time: 30, multiplier: 1.2 },   // < 30 seconds
            { time: 60, multiplier: 1.0 }    // < 60 seconds
        ],
        
        // Streak bonuses
        streakThresholds: [
            { streak: 3, bonus: 50 },
            { streak: 5, bonus: 100 },
            { streak: 7, bonus: 200 },
            { streak: 10, bonus: 500 }
        ],
        
        // Perfect score bonus
        perfectBonus: 1000,
        
        // Star rating thresholds (percentage of max possible score)
        starRating: {
            threeStar: 0.8,    // 80% or above
            twoStar: 0.6,      // 60-79%
            oneStar: 0.4       // 40-59%
        }
    },

    // =====================================================
    // SOUND SETTINGS
    // =====================================================
    sounds: {
        enabled: true,
        volume: {
            master: 0.7,
            sfx: 0.8,
            music: 0.5
        },
        effects: {
            launch: 'launch.mp3',
            hit: 'hit.mp3',
            miss: 'miss.mp3',
            correct: 'correct.mp3',
            incorrect: 'incorrect.mp3',
            levelUp: 'levelup.mp3',
            streak: 'streak.mp3',
            click: 'click.mp3',
            hint: 'hint.mp3'
        },
        music: {
            menu: 'menu_music.mp3',
            game: 'game_music.mp3',
            victory: 'victory_music.mp3'
        }
    },

    // =====================================================
    // HINT SYSTEM
    // =====================================================
    hints: {
        // Hints by question type
        formulas: {
            axis_symmetry: {
                title: 'Line of Symmetry Formula',
                text: 'For y = ax² + bx + c, the line of symmetry is:',
                formula: 'x = -b / (2a)'
            },
            turning_point: {
                title: 'Turning Point',
                text: 'The turning point lies on the line of symmetry. Find x first, then substitute to find y.',
                formula: 'x = -b/(2a), then y = f(x)'
            },
            quadratic_formula: {
                title: 'Quadratic Formula',
                text: 'To find x-intercepts, use:',
                formula: 'x = (-b ± √(b²-4ac)) / (2a)'
            },
            discriminant: {
                title: 'Discriminant',
                text: 'The discriminant tells us about the roots:',
                formula: 'D = b² - 4ac'
            },
            completing_square: {
                title: 'Completing the Square',
                text: 'To convert ax² + bx + c to vertex form:',
                formula: 'a(x + b/2a)² + (c - b²/4a)'
            },
            y_intercept: {
                title: 'Y-Intercept',
                text: 'The y-intercept is found by setting x = 0:',
                formula: 'y-intercept = c'
            }
        },
        
        // Hint cooldown
        cooldown: 5000,  // ms before next hint
        maxHints: 3      // per question
    },

    // =====================================================
    // UI SETTINGS
    // =====================================================
    ui: {
        // Toast notifications
        toast: {
            duration: 3000,
            position: 'top-right'
        },
        
        // Confirmation dialogs
        confirmations: {
            quit: true,
            restart: true,
            skip: false
        },
        
        // Tutorial
        tutorial: {
            showOnFirstPlay: true,
            stepDelay: 500
        },
        
        // Keyboard shortcuts
        shortcuts: {
            launch: 'Enter',
            hint: 'h',
            pause: 'Escape',
            skip: 's',
            formulaPanel: 'f'
        }
    },

    // =====================================================
    // LOCAL STORAGE KEYS
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
            description: 'Launch your first projectile',
            icon: '🚀'
        },
        perfect_aim: {
            id: 'perfect_aim',
            name: 'Perfect Aim',
            description: 'Get 10 correct answers in a row',
            icon: '🎯'
        },
        speed_demon: {
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Answer correctly in under 5 seconds',
            icon: '⚡'
        },
        math_master: {
            id: 'math_master',
            name: 'Math Master',
            description: 'Complete all difficulty levels',
            icon: '👑'
        },
        no_hints: {
            id: 'no_hints',
            name: 'No Hints Needed',
            description: 'Complete a level without using hints',
            icon: '🧠'
        },
        perfectionist: {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Get 100% accuracy in a level',
            icon: '💯'
        },
        symmetry_expert: {
            id: 'symmetry_expert',
            name: 'Symmetry Expert',
            description: 'Answer 20 symmetry questions correctly',
            icon: '⚖️'
        },
        root_finder: {
            id: 'root_finder',
            name: 'Root Finder',
            description: 'Find 30 x-intercepts correctly',
            icon: '🔍'
        }
    },

    // =====================================================
    // DEBUG SETTINGS
    // =====================================================
    debug: {
        enabled: false,
        showFPS: false,
        showCoordinates: true,
        logQuestions: false,
        skipAnimations: false,
        unlockAll: false
    }
};

// =====================================================
// HELPER CONSTANTS
// =====================================================

// Mathematical constants
const MATH_CONSTANTS = {
    EPSILON: 0.0001,          // For floating point comparisons
    MAX_ITERATIONS: 100,      // For numerical methods
    ROUNDING_PRECISION: 4     // Decimal places for display
};

// Easing functions for animations
const EASING = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeOutElastic: t => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    easeOutBounce: t => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
};

// Color palette for various uses
const COLORS = {
    primary: '#6C63FF',
    secondary: '#FF6B6B',
    success: '#00d26a',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#3498db',
    
    // Graph colors
    curve: '#6C63FF',
    curveNegative: '#FF6B6B',
    grid: 'rgba(255, 255, 255, 0.1)',
    axis: 'rgba(255, 255, 255, 0.5)',
    
    // Point colors
    turningPoint: '#FFE66D',
    intercepts: '#4ECDC4',
    intersection: '#A55EEA',
    
    // UI colors
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#ffffff',
    textMuted: '#b8b8d1'
};

// Question category names for display
const CATEGORY_NAMES = {
    basic: 'Basic Understanding',
    symmetry: 'Line of Symmetry',
    turning_point: 'Turning Point',
    intercepts: 'Intercepts',
    optimization: 'Maximum/Minimum',
    transformation: 'Forms & Transformations',
    roots: 'Roots & Discriminant',
    intersection: 'Intersections',
    coordinates: 'Coordinates',
    range: 'Range & Domain',
    sketching: 'Graph Sketching',
    advanced: 'Advanced Problems'
};

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        MATH_CONSTANTS,
        EASING,
        COLORS,
        CATEGORY_NAMES
    };
}