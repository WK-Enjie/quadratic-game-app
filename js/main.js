/* =====================================================
   QUADRATIC CATAPULT QUEST - MAIN ENTRY POINT
   =====================================================
   Application initialization and bootstrapping
   CORRECTED VERSION - Fixed initialization issues
   ===================================================== */

/**
 * Application Class
 * Main application controller that bootstraps the game
 */
class Application {
    constructor() {
        this.game = null;
        this.canvas = null;
        this.ui = null;
        this.isInitialized = false;
        this.initAttempts = 0;
        this.maxInitAttempts = 10;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🎮 Quadratic Catapult Quest v' + CONFIG.game.version);
        console.log('📐 Initializing...');

        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Small delay to ensure styles are applied
            await this.sleep(100);

            // Initialize components
            await this.initializeComponents();

            // Setup global error handling
            this.setupErrorHandling();

            // Hide loading screen and show menu
            this.hideLoadingScreen();

            this.isInitialized = true;
            console.log('✅ Application initialized successfully!');

        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showErrorScreen(error);
        }
    }

    /**
     * Wait for DOM to be fully loaded
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else if (document.readyState === 'interactive') {
                // DOM is ready but resources might still be loading
                setTimeout(resolve, 50);
            } else {
                window.addEventListener('load', () => resolve());
            }
        });
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initialize all game components
     */
    async initializeComponents() {
        console.log('🔧 Initializing components...');

        // Initialize UI Controller first (doesn't need canvas)
        console.log('🖥️ Initializing UI...');
        this.ui = new UI();
        this.ui.addDynamicStyles();

        // Initialize Game Engine
        console.log('🎮 Initializing game engine...');
        this.game = new Game();

        // Initialize Canvas Renderer
        console.log('🎨 Initializing canvas...');
        await this.initializeCanvas();

        // Connect components
        this.game.init(this.canvas, this.ui);
        this.ui.init(this.game);

        // Load UI settings
        this.ui.loadSettingsUI();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Check for first-time user
        this.checkFirstTimeUser();

        console.log('✅ All components initialized');
    }

    /**
     * Initialize canvas with retry logic
     */
    async initializeCanvas() {
        const canvasElement = document.getElementById('game-canvas');
        
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }

        // Create canvas renderer
        this.canvas = new CanvasRenderer('game-canvas');

        // Wait for canvas to be ready
        let attempts = 0;
        while (!this.canvas.isInitialized && attempts < 20) {
            await this.sleep(100);
            attempts++;
        }

        if (!this.canvas.isInitialized) {
            console.warn('Canvas initialization timeout, forcing init...');
            this.canvas.initCanvas();
        }

        // Apply saved settings
        const savedSettings = this.loadSettings();
        if (savedSettings.gridStyle) {
            this.canvas.setGridStyle(savedSettings.gridStyle);
        }

        console.log('🎨 Canvas ready');
    }

    /**
     * Load saved settings
     */
    loadSettings() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.settings;
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Hide loading screen and show main menu
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const menuScreen = document.getElementById('main-menu');

        console.log('📺 Transitioning to main menu...');

        if (loadingScreen) {
            // Fade out effect
            loadingScreen.style.transition = 'opacity 0.3s ease';
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingScreen.style.display = 'none';
            }, 300);
        }

        if (menuScreen) {
            menuScreen.classList.add('active');
            menuScreen.style.display = 'flex';
        }

        console.log('✅ Main menu visible');
    }

    /**
     * Setup global keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for game shortcuts when playing
            if (this.game && 
                (this.game.state === GameState.PLAYING || 
                 this.game.state === GameState.ANSWERING)) {
                
                const shortcuts = CONFIG.ui.shortcuts;
                
                if (e.key === shortcuts.pause || 
                    e.key === shortcuts.hint ||
                    e.key === shortcuts.formulaPanel) {
                    e.preventDefault();
                }
            }

            // Global shortcuts
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelp();
            }

            // Debug shortcuts (only in debug mode)
            if (CONFIG.debug && CONFIG.debug.enabled) {
                this.handleDebugShortcuts(e);
            }
        });
    }

    /**
     * Handle debug shortcuts
     */
    handleDebugShortcuts(e) {
        if (!e.ctrlKey) return;

        switch (e.key) {
            case 'd':
                e.preventDefault();
                this.toggleDebugMode();
                break;
            case 's':
                e.preventDefault();
                this.skipCurrentQuestion();
                break;
            case 'w':
                e.preventDefault();
                this.winCurrentQuestion();
                break;
            case 'r':
                e.preventDefault();
                this.resetProgress();
                break;
        }
    }

    /**
     * Toggle debug mode
     */
    toggleDebugMode() {
        CONFIG.debug.enabled = !CONFIG.debug.enabled;
        CONFIG.debug.showCoordinates = CONFIG.debug.enabled;
        console.log(`🐛 Debug mode: ${CONFIG.debug.enabled ? 'ON' : 'OFF'}`);
        
        if (this.ui) {
            this.ui.showToast(`Debug mode: ${CONFIG.debug.enabled ? 'ON' : 'OFF'}`, 'info');
        }
    }

    /**
     * Skip current question (debug)
     */
    skipCurrentQuestion() {
        if (this.game && this.game.session) {
            console.log('⏭️ Debug: Skipping question');
            this.game.session.questionIndex++;
            this.game.nextQuestion();
        }
    }

    /**
     * Auto-win current question (debug)
     */
    winCurrentQuestion() {
        if (this.game && this.game.session) {
            const question = this.game.session.getCurrentQuestion();
            if (question) {
                console.log('🏆 Debug: Auto-winning question');
                const correctAnswer = this.formatCorrectAnswerForInput(question);
                this.game.submitAnswer(correctAnswer);
            }
        }
    }

    /**
     * Format correct answer for auto-submit
     */
    formatCorrectAnswerForInput(question) {
        const answer = question.correctAnswer;
        
        if (typeof answer === 'number') {
            return String(answer);
        } else if (answer && typeof answer === 'object') {
            if (answer.x !== undefined && answer.y !== undefined) {
                return `(${answer.x}, ${answer.y})`;
            } else if (Array.isArray(answer)) {
                return answer.join(', ');
            }
        }
        
        return String(answer);
    }

    /**
     * Reset all progress (debug)
     */
    resetProgress() {
        if (confirm('Reset all progress? This cannot be undone.')) {
            const prefix = CONFIG.storage.prefix;
            Object.values(CONFIG.storage.keys).forEach(key => {
                localStorage.removeItem(prefix + key);
            });
            console.log('🔄 Progress reset');
            location.reload();
        }
    }

    /**
     * Check if this is the user's first time
     */
    checkFirstTimeUser() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.tutorialComplete;
        const tutorialComplete = localStorage.getItem(key);

        if (!tutorialComplete && CONFIG.ui.tutorial.showOnFirstPlay) {
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 1000);
        }
    }

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        if (this.ui) {
            this.ui.showToast('Welcome to Quadratic Catapult Quest! 🎮', 'info');
            
            setTimeout(() => {
                this.ui.showToast('Click "How to Play" to learn the basics!', 'info');
            }, 3000);
        }
    }

    /**
     * Show help overlay
     */
    showHelp() {
        const shortcuts = CONFIG.ui.shortcuts;
        
        // Remove existing help if present
        const existingHelp = document.querySelector('.help-overlay');
        if (existingHelp) {
            existingHelp.remove();
            return;
        }
        
        const helpEl = document.createElement('div');
        helpEl.className = 'help-overlay';
        helpEl.innerHTML = `
            <div class="help-content">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <div class="shortcut-list">
                    <div class="shortcut-item">
                        <span class="shortcut-key">Enter</span>
                        <span class="shortcut-desc">Submit Answer / Launch</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">H</span>
                        <span class="shortcut-desc">Show Hint</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Esc</span>
                        <span class="shortcut-desc">Pause Game</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">F</span>
                        <span class="shortcut-desc">Toggle Formula Reference</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">F1</span>
                        <span class="shortcut-desc">Show/Hide This Help</span>
                    </div>
                </div>
                <button class="btn btn-primary" id="help-close-btn">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(helpEl);
        
        // Close handlers
        helpEl.addEventListener('click', (e) => {
            if (e.target === helpEl || e.target.id === 'help-close-btn') {
                helpEl.remove();
            }
        });

        // Add styles if not present
        if (!document.getElementById('help-styles')) {
            const style = document.createElement('style');
            style.id = 'help-styles';
            style.textContent = `
                .help-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .help-content {
                    background: linear-gradient(135deg, #16213e, #1a1a2e);
                    padding: 30px 40px;
                    border-radius: 16px;
                    text-align: center;
                    max-width: 400px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                .help-content h2 {
                    margin-bottom: 20px;
                    color: #6C63FF;
                }
                
                .shortcut-list {
                    text-align: left;
                    margin-bottom: 20px;
                }
                
                .shortcut-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .shortcut-key {
                    background: rgba(108, 99, 255, 0.3);
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-weight: bold;
                    color: #fff;
                }
                
                .shortcut-desc {
                    color: #b8b8d1;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global error:', { message, source, lineno, colno, error });
            return false;
        };

        window.onunhandledrejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        };
    }

    /**
     * Show error screen
     */
    showErrorScreen(error) {
        const app = document.getElementById('app');
        
        if (app) {
            app.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                    text-align: center;
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    color: white;
                    font-family: 'Poppins', sans-serif;
                ">
                    <h1 style="font-size: 3rem; margin-bottom: 10px;">😵 Oops!</h1>
                    <p style="color: #b8b8d1; margin-bottom: 20px;">
                        Something went wrong while loading the game.
                    </p>
                    <div style="
                        background: rgba(255, 71, 87, 0.2);
                        border: 1px solid #ff4757;
                        padding: 15px 25px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        max-width: 500px;
                    ">
                        <code style="color: #ff6b6b;">${error.message}</code>
                    </div>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #6C63FF, #5a52d5);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        font-family: 'Poppins', sans-serif;
                    ">
                        🔄 Try Again
                    </button>
                </div>
            `;
        }
    }

    /**
     * Get application info
     */
    getInfo() {
        return {
            name: CONFIG.game.name,
            version: CONFIG.game.version,
            initialized: this.isInitialized,
            state: this.game?.state,
            debug: CONFIG.debug?.enabled
        };
    }
}

// =====================================================
// UTILITY FUNCTIONS (Global)
// =====================================================

/**
 * Format number for display
 */
function formatNumber(num, decimals = 2) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return parseFloat(num.toFixed(decimals)).toString();
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =====================================================
// POLYFILLS
// =====================================================

// Array.prototype.at polyfill
if (!Array.prototype.at) {
    Array.prototype.at = function(index) {
        const length = this.length;
        const relativeIndex = index >= 0 ? index : length + index;
        return relativeIndex >= 0 && relativeIndex < length ? this[relativeIndex] : undefined;
    };
}

// Object.hasOwn polyfill
if (!Object.hasOwn) {
    Object.hasOwn = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
}

// =====================================================
// APPLICATION INITIALIZATION
// =====================================================

// Create global application instance
const app = new Application();

// Initialize when ready
function startApp() {
    app.init().catch(error => {
        console.error('Failed to start application:', error);
    });
}

// Multiple initialization triggers for reliability
if (document.readyState === 'complete') {
    startApp();
} else if (document.readyState === 'interactive') {
    setTimeout(startApp, 50);
} else {
    document.addEventListener('DOMContentLoaded', startApp);
    window.addEventListener('load', () => {
        if (!app.isInitialized) {
            startApp();
        }
    });
}

// =====================================================
// GLOBAL API FOR DEBUGGING
// =====================================================

window.QuadraticQuest = {
    app,
    get game() { return app.game; },
    get canvas() { return app.canvas; },
    get ui() { return app.ui; },
    get CONFIG() { return CONFIG; },
    get COLORS() { return COLORS; },
    get EASING() { return EASING; },
    
    // Debug utilities
    debug: {
        enable: () => { 
            CONFIG.debug.enabled = true;
            CONFIG.debug.showCoordinates = true;
            console.log('🐛 Debug mode enabled');
        },
        disable: () => { 
            CONFIG.debug.enabled = false;
            CONFIG.debug.showCoordinates = false;
            console.log('🐛 Debug mode disabled');
        },
        unlockAll: () => { 
            CONFIG.debug.unlockAll = true;
            console.log('🔓 All levels unlocked (refresh to apply)');
        },
        resetAll: () => {
            if (confirm('Reset all game data?')) {
                const prefix = CONFIG.storage.prefix;
                Object.values(CONFIG.storage.keys).forEach(key => {
                    localStorage.removeItem(prefix + key);
                });
                location.reload();
            }
        },
        getStats: () => {
            console.log('📊 Statistics:', app.game?.statistics);
            return app.game?.statistics;
        },
        getSession: () => {
            console.log('🎮 Session:', app.game?.session?.getSummary());
            return app.game?.session?.getSummary();
        }
    },

    // Quick test functions
    test: {
        quadratic: (a = 1, b = -4, c = 3) => {
            const q = new Quadratic(a, b, c);
            console.log('📐 Quadratic:', q.getEquation());
            console.log('   Vertex:', q.getTurningPoint());
            console.log('   X-intercepts:', q.getXIntercepts());
            console.log('   Y-intercept:', q.getYIntercept());
            console.log('   Discriminant:', q.getDiscriminant());
            console.log('   Line of symmetry:', q.getLineOfSymmetry());
            return q;
        },
        
        randomQuadratic: () => {
            const q = QuadraticGenerator.generate(CONFIG.difficulty.intermediate);
            console.log('🎲 Random Quadratic:', q.getEquation());
            console.log('   Vertex:', q.getTurningPoint());
            console.log('   X-intercepts:', q.getXIntercepts());
            return q;
        },
        
        question: (type = 'turning_point', difficulty = 'intermediate') => {
            const q = QuadraticGenerator.generateForQuestionType(type, difficulty);
            const question = QuestionGenerator.generateByType(type, q, difficulty);
            console.log('❓ Question:', question.questionText);
            console.log('   Equation:', question.equationDisplay);
            console.log('   Answer:', question.correctAnswer);
            console.log('   Hints:', question.hints.map(h => h.text));
            return question;
        },
        
        validate: (answer, correctAnswer, type) => {
            const result = AnswerValidator.validate(answer, correctAnswer, type);
            console.log('✅ Validation result:', result);
            return result;
        },
        
        startGame: (difficulty = 'beginner') => {
            if (app.game) {
                app.game.startGame(difficulty);
                console.log(`🚀 Started ${difficulty} game`);
            }
        },
        
        startPractice: (difficulty = 'beginner', topic = null) => {
            if (app.game) {
                app.game.startPractice(difficulty, topic);
                console.log(`📚 Started practice mode: ${difficulty}`);
            }
        },
        
        drawQuadratic: (a = 1, b = -4, c = 3) => {
            const q = new Quadratic(a, b, c);
            if (app.canvas) {
                app.canvas.fitToQuadratic(q);
                app.canvas.render({
                    quadratic: q,
                    curveProgress: 1,
                    showKeyPoints: true,
                    highlightedPoints: ['vertex', 'xIntercepts', 'yIntercept'],
                    showCatapult: true,
                    target: q.getTurningPoint()
                });
                console.log('🎨 Drew quadratic:', q.getEquation());
            }
            return q;
        },
        
        animateCurve: (a = 1, b = -4, c = 3) => {
            const q = new Quadratic(a, b, c);
            if (app.canvas) {
                app.canvas.fitToQuadratic(q);
                app.canvas.animateCurve(q, () => {
                    console.log('✨ Animation complete');
                });
            }
            return q;
        }
    },
    
    // Force reinitialize canvas (useful after DOM changes)
    reinitCanvas: () => {
        if (app.canvas) {
            app.canvas.forceResize();
            console.log('🎨 Canvas reinitialized');
        }
    }
};

// =====================================================
// CONSOLE WELCOME MESSAGE
// =====================================================

console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   📐 QUADRATIC CATAPULT QUEST 🎯                          ║
║                                                           ║
║   Version: ${CONFIG.game.version}                                      ║
║   Ready to play!                                          ║
║                                                           ║
║   Console Commands:                                       ║
║   • QuadraticQuest.test.quadratic()    - Test math       ║
║   • QuadraticQuest.test.drawQuadratic() - Draw curve     ║
║   • QuadraticQuest.test.question()     - Generate Q      ║
║   • QuadraticQuest.test.startGame()    - Quick start     ║
║   • QuadraticQuest.debug.enable()      - Debug mode      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'color: #6C63FF; font-family: monospace;');

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Application,
        app,
        formatNumber,
        randomInt,
        shuffleArray,
        clamp,
        lerp,
        isMobile,
        isTouchDevice,
        debounce,
        throttle
    };
}