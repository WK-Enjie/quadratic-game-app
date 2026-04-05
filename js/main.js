/* =====================================================
   QUADRATIC CATAPULT QUEST - MAIN ENTRY POINT
   =====================================================
   Application initialization and bootstrapping
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
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🎮 Quadratic Catapult Quest v' + CONFIG.game.version);
        console.log('📐 Initializing...');

        try {
            // Show loading screen
            this.showLoadingScreen();

            // Wait for DOM to be ready
            await this.waitForDOM();

            // Initialize components
            await this.initializeComponents();

            // Setup global error handling
            this.setupErrorHandling();

            // Hide loading screen and show menu
            await this.hideLoadingScreen();

            this.isInitialized = true;
            console.log('✅ Application initialized successfully!');

        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showErrorScreen(error);
        }
    }

    /**
     * Wait for DOM to be fully loaded
     * @returns {Promise}
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        });
    }

    /**
     * Initialize all game components
     */
    async initializeComponents() {
        // Initialize Canvas Renderer
        console.log('🎨 Initializing canvas...');
        this.canvas = new CanvasRenderer('game-canvas');
        
        // Apply initial settings
        const savedSettings = this.loadSettings();
        if (savedSettings.gridStyle) {
            this.canvas.setGridStyle(savedSettings.gridStyle);
        }

        // Initialize UI Controller
        console.log('🖥️ Initializing UI...');
        this.ui = new UI();
        this.ui.addDynamicStyles();

        // Initialize Game Engine
        console.log('🎮 Initializing game engine...');
        this.game = new Game();
        
        // Connect components
        this.game.init(this.canvas, this.ui);
        this.ui.init(this.game);

        // Load UI settings
        this.ui.loadSettingsUI();

        // Setup keyboard shortcuts info
        this.setupKeyboardShortcuts();

        // Preload assets (if any)
        await this.preloadAssets();

        // Check for first-time user
        this.checkFirstTimeUser();
    }

    /**
     * Load saved settings
     * @returns {Object}
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
            if (CONFIG.debug.enabled) {
                this.handleDebugShortcuts(e);
            }
        });
    }

    /**
     * Handle debug shortcuts
     * @param {KeyboardEvent} e
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
     * @param {Question} question
     * @returns {string}
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
     * Preload game assets
     * @returns {Promise}
     */
    async preloadAssets() {
        // Placeholder for asset preloading
        // In a full implementation, this would load images, sounds, etc.
        
        console.log('📦 Preloading assets...');
        
        // Simulate loading time for smooth UX
        await this.sleep(500);
        
        // Preload any fonts
        await document.fonts.ready;
        
        console.log('✅ Assets loaded');
    }

    /**
     * Check if this is the user's first time
     */
    checkFirstTimeUser() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.tutorialComplete;
        const tutorialComplete = localStorage.getItem(key);

        if (!tutorialComplete && CONFIG.ui.tutorial.showOnFirstPlay) {
            // Show tutorial on first visit
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 500);
        }
    }

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        this.ui.showToast('Welcome to Quadratic Catapult Quest! 🎮', 'info');
        
        setTimeout(() => {
            this.ui.showToast('Click "How to Play" to learn the basics!', 'info');
        }, 3000);
    }

    /**
     * Show help/shortcuts overlay
     */
    showHelp() {
        const shortcuts = CONFIG.ui.shortcuts;
        
        const helpContent = `
            <div class="help-overlay">
                <div class="help-content">
                    <h2>⌨️ Keyboard Shortcuts</h2>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <span class="shortcut-key">${shortcuts.launch}</span>
                            <span class="shortcut-desc">Submit Answer / Launch</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">${shortcuts.hint.toUpperCase()}</span>
                            <span class="shortcut-desc">Show Hint</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">${shortcuts.pause}</span>
                            <span class="shortcut-desc">Pause Game</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">${shortcuts.formulaPanel.toUpperCase()}</span>
                            <span class="shortcut-desc">Toggle Formula Reference</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">F1</span>
                            <span class="shortcut-desc">Show This Help</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        const helpEl = document.createElement('div');
        helpEl.innerHTML = helpContent;
        helpEl.querySelector('.help-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('help-overlay')) {
                helpEl.remove();
            }
        });
        
        document.body.appendChild(helpEl);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                animation: fadeIn 0.3s ease;
            }
            
            .help-content {
                background: linear-gradient(135deg, #16213e, #1a1a2e);
                padding: 30px 40px;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                border: 1px solid rgba(255, 255, 255, 0.1);
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
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .shortcut-key {
                background: rgba(108, 99, 255, 0.3);
                padding: 4px 12px;
                border-radius: 4px;
                font-family: monospace;
                font-weight: bold;
            }
            
            .shortcut-desc {
                color: #b8b8d1;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global error:', { message, source, lineno, colno, error });
            
            // Don't show error UI for minor issues
            if (CONFIG.debug.enabled) {
                this.ui?.showToast(`Error: ${message}`, 'error');
            }
            
            return false;
        };

        window.onunhandledrejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            if (CONFIG.debug.enabled) {
                this.ui?.showToast('An error occurred', 'error');
            }
        };
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
        }
    }

    /**
     * Hide loading screen
     * @returns {Promise}
     */
    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const menuScreen = document.getElementById('main-menu');
        
        if (loadingScreen && menuScreen) {
            // Fade out loading screen
            loadingScreen.style.opacity = '0';
            
            await this.sleep(300);
            
            loadingScreen.classList.remove('active');
            loadingScreen.style.opacity = '';
            
            // Show menu
            menuScreen.classList.add('active');
        }
    }

    /**
     * Show error screen
     * @param {Error} error
     */
    showErrorScreen(error) {
        const app = document.getElementById('app');
        
        if (app) {
            app.innerHTML = `
                <div class="error-screen">
                    <h1>😵 Oops!</h1>
                    <p>Something went wrong while loading the game.</p>
                    <div class="error-details">
                        <code>${error.message}</code>
                    </div>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            `;

            // Add error screen styles
            const style = document.createElement('style');
            style.textContent = `
                .error-screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                    text-align: center;
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                }
                
                .error-screen h1 {
                    font-size: 3rem;
                    margin-bottom: 10px;
                }
                
                .error-screen p {
                    color: #b8b8d1;
                    margin-bottom: 20px;
                }
                
                .error-details {
                    background: rgba(255, 71, 87, 0.2);
                    border: 1px solid #ff4757;
                    padding: 15px 25px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    max-width: 500px;
                }
                
                .error-details code {
                    color: #ff6b6b;
                    font-family: monospace;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Sleep utility
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get application info
     * @returns {Object}
     */
    getInfo() {
        return {
            name: CONFIG.game.name,
            version: CONFIG.game.version,
            initialized: this.isInitialized,
            state: this.game?.state,
            debug: CONFIG.debug.enabled
        };
    }
}

// =====================================================
// UTILITY FUNCTIONS (Global)
// =====================================================

/**
 * Format number for display (global helper)
 * @param {number} num
 * @param {number} decimals
 * @returns {string}
 */
function formatNumber(num, decimals = 2) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array (Fisher-Yates)
 * @param {Array} array
 * @returns {Array}
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
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Progress (0-1)
 * @returns {number}
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Check if device is mobile
 * @returns {boolean}
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
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
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
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

// Array.prototype.at polyfill (for older browsers)
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Expose to global scope for debugging
window.QuadraticQuest = {
    app,
    get game() { return app.game; },
    get canvas() { return app.canvas; },
    get ui() { return app.ui; },
    CONFIG,
    COLORS,
    EASING,
    
    // Debug utilities
    debug: {
        enable: () => { CONFIG.debug.enabled = true; },
        disable: () => { CONFIG.debug.enabled = false; },
        showCoords: () => { CONFIG.debug.showCoordinates = true; },
        hideCoords: () => { CONFIG.debug.showCoordinates = false; },
        unlockAll: () => { 
            CONFIG.debug.unlockAll = true;
            location.reload();
        },
        resetAll: () => {
            const prefix = CONFIG.storage.prefix;
            Object.values(CONFIG.storage.keys).forEach(key => {
                localStorage.removeItem(prefix + key);
            });
            location.reload();
        },
        getStats: () => app.game?.statistics,
        getSession: () => app.game?.session?.getSummary()
    },

    // Quick test functions
    test: {
        // Generate and log a random quadratic
        quadratic: () => {
            const q = QuadraticGenerator.generate(CONFIG.difficulty.intermediate);
            console.log('Quadratic:', q.getEquation());
            console.log('Vertex:', q.getTurningPoint());
            console.log('X-intercepts:', q.getXIntercepts());
            console.log('Discriminant:', q.getDiscriminant());
            return q;
        },
        
        // Generate and log a question
        question: (type = 'turning_point', difficulty = 'intermediate') => {
            const q = QuadraticGenerator.generateForQuestionType(type, difficulty);
            const question = QuestionGenerator.generateByType(type, q, difficulty);
            console.log('Question:', question.questionText);
            console.log('Equation:', question.equationDisplay);
            console.log('Answer:', question.correctAnswer);
            console.log('Hints:', question.hints);
            return question;
        },
        
        // Test answer validation
        validate: (answer, correctAnswer, type) => {
            const result = AnswerValidator.validate(answer, correctAnswer, type);
            console.log('Validation result:', result);
            return result;
        },
        
        // Quick start a game
        startGame: (difficulty = 'beginner') => {
            app.game?.startGame(difficulty);
        },
        
        // Quick start practice
        startPractice: (difficulty = 'beginner', topic = null) => {
            app.game?.startPractice(difficulty, topic);
        }
    }
};

// Log ready message
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   📐 QUADRATIC CATAPULT QUEST 🎯                          ║
║                                                           ║
║   Version: ${CONFIG.game.version}                                      ║
║   Ready to play!                                          ║
║                                                           ║
║   Open console and type:                                  ║
║   • QuadraticQuest.test.quadratic() - Test math          ║
║   • QuadraticQuest.test.question() - Test questions      ║
║   • QuadraticQuest.debug.enable() - Enable debug mode    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// =====================================================
// SERVICE WORKER (Optional - for offline support)
// =====================================================

// Register service worker for offline capability (uncomment if needed)
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
*/

// =====================================================
// EXPORT FOR MODULES
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