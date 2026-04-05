/* =====================================================
   QUADRATIC CATAPULT QUEST - UI CONTROLLER
   =====================================================
   Handles all DOM manipulation and user interface
   ===================================================== */

/**
 * UI Class
 * Manages all user interface elements and interactions
 */
class UI {
    constructor() {
        // Cache DOM elements
        this.elements = {};
        this.cacheElements();
        
        // Current screen
        this.currentScreen = null;
        
        // Animation timers
        this.timers = {};
        
        // Toast queue
        this.toastQueue = [];
        this.isShowingToast = false;
        
        // Formula panel state
        this.formulaPanelOpen = false;
        
        // Bind methods
        this.bindMethods();
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    /**
     * Cache all DOM elements for quick access
     */
    cacheElements() {
        // Screens
        this.elements.screens = {
            loading: document.getElementById('loading-screen'),
            menu: document.getElementById('main-menu'),
            tutorial: document.getElementById('tutorial-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen')
        };

        // Main menu elements
        this.elements.menu = {
            playBtn: document.getElementById('btn-play'),
            practiceBtn: document.getElementById('btn-practice'),
            tutorialBtn: document.getElementById('btn-tutorial'),
            settingsBtn: document.getElementById('btn-settings'),
            difficultySelector: document.getElementById('difficulty-selector'),
            difficultyBtns: document.querySelectorAll('.difficulty-btn')
        };

        // Tutorial elements
        this.elements.tutorial = {
            backBtn: document.getElementById('btn-tutorial-back')
        };

        // Game header elements
        this.elements.header = {
            pauseBtn: document.getElementById('btn-pause'),
            levelBadge: document.getElementById('level-badge'),
            levelName: document.getElementById('level-name'),
            scoreValue: document.getElementById('score-value'),
            streakValue: document.getElementById('streak-value'),
            timerDisplay: document.getElementById('timer-display'),
            timerValue: document.getElementById('timer-value'),
            livesDisplay: document.getElementById('lives-display'),
            livesIcons: document.getElementById('lives-icons')
        };

        // Question panel elements
        this.elements.question = {
            equationBox: document.getElementById('equation-box'),
            equationForms: document.getElementById('equation-forms'),
            questionText: document.getElementById('question-text'),
            answerLabel: document.getElementById('answer-label'),
            answerInput: document.getElementById('answer-input'),
            inputSuggestions: document.getElementById('input-suggestions'),
            coordinateInput: document.getElementById('coordinate-input'),
            coordX: document.getElementById('coord-x'),
            coordY: document.getElementById('coord-y'),
            multipleChoice: document.getElementById('multiple-choice'),
            choiceBtns: document.querySelectorAll('.choice-btn'),
            hintBtn: document.getElementById('btn-hint'),
            launchBtn: document.getElementById('btn-launch'),
            skipBtn: document.getElementById('btn-skip')
        };

        // Feedback elements
        this.elements.feedback = {
            area: document.getElementById('feedback-area'),
            icon: document.getElementById('feedback-icon'),
            text: document.getElementById('feedback-text'),
            explanation: document.getElementById('feedback-explanation')
        };

        // Canvas elements
        this.elements.canvas = {
            container: document.querySelector('.canvas-container'),
            overlay: document.getElementById('canvas-overlay'),
            hitFeedback: document.getElementById('hit-feedback')
        };

        // Graph tools
        this.elements.tools = {
            container: document.getElementById('graph-tools'),
            toolBtns: document.querySelectorAll('.tool-btn'),
            lineInput: document.getElementById('line-input'),
            lineEquation: document.getElementById('line-equation'),
            drawLineBtn: document.getElementById('btn-draw-line')
        };

        // Modals
        this.elements.modals = {
            pause: document.getElementById('pause-menu'),
            settings: document.getElementById('settings-modal'),
            hint: document.getElementById('hint-modal')
        };

        // Pause menu elements
        this.elements.pause = {
            score: document.getElementById('pause-score'),
            level: document.getElementById('pause-level'),
            resumeBtn: document.getElementById('btn-resume'),
            restartBtn: document.getElementById('btn-restart'),
            quitBtn: document.getElementById('btn-quit')
        };

        // Settings elements
        this.elements.settings = {
            sound: document.getElementById('setting-sound'),
            music: document.getElementById('setting-music'),
            hints: document.getElementById('setting-hints'),
            timer: document.getElementById('setting-timer'),
            grid: document.getElementById('setting-grid'),
            saveBtn: document.getElementById('btn-save-settings'),
            closeBtn: document.getElementById('btn-close-settings')
        };

        // Hint modal elements
        this.elements.hint = {
            text: document.getElementById('hint-text'),
            formula: document.getElementById('hint-formula'),
            closeBtn: document.getElementById('btn-close-hint')
        };

        // Results screen elements
        this.elements.results = {
            title: document.getElementById('results-title'),
            stars: document.getElementById('results-stars'),
            finalScore: document.getElementById('final-score'),
            questionsAnswered: document.getElementById('questions-answered'),
            accuracy: document.getElementById('accuracy'),
            bestStreak: document.getElementById('best-streak'),
            topicBars: document.getElementById('topic-bars'),
            nextLevelBtn: document.getElementById('btn-next-level'),
            retryBtn: document.getElementById('btn-retry'),
            menuBtn: document.getElementById('btn-menu')
        };

        // Formula panel
        this.elements.formulaPanel = {
            panel: document.getElementById('formula-panel'),
            toggle: document.getElementById('formula-toggle')
        };
    }

    /**
     * Bind methods to preserve 'this' context
     */
    bindMethods() {
        this.handleAnswerInput = this.handleAnswerInput.bind(this);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
    }

    /**
     * Initialize UI with game reference
     * @param {Game} game - The game instance
     */
    init(game) {
        this.game = game;
        this.bindEvents();
        this.setupInputHandlers();
        
        console.log('🖥️ UI initialized');
    }

    /**
     * Bind all UI events
     */
    bindEvents() {
        // Main menu
        this.elements.menu.playBtn?.addEventListener('click', () => {
            this.toggleDifficultySelector(true);
        });

        this.elements.menu.practiceBtn?.addEventListener('click', () => {
            this.toggleDifficultySelector(true, true);
        });

        this.elements.menu.tutorialBtn?.addEventListener('click', () => {
            this.showScreen('tutorial-screen');
        });

        this.elements.menu.settingsBtn?.addEventListener('click', () => {
            this.showModal('settings');
        });

        // Difficulty selection
        this.elements.menu.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                this.selectDifficulty(level);
            });
        });

        // Tutorial
        this.elements.tutorial.backBtn?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });

        // Game controls
        this.elements.header.pauseBtn?.addEventListener('click', () => {
            this.game.pause();
        });

        this.elements.question.launchBtn?.addEventListener('click', () => {
            this.game.submitAnswer();
        });

        this.elements.question.skipBtn?.addEventListener('click', () => {
            this.game.skipQuestion();
        });

        this.elements.question.hintBtn?.addEventListener('click', () => {
            this.game.showHint();
        });

        // Multiple choice buttons
        this.elements.question.choiceBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleChoiceClick(index));
        });

        // Pause menu
        this.elements.pause.resumeBtn?.addEventListener('click', () => {
            this.game.resume();
        });

        this.elements.pause.restartBtn?.addEventListener('click', () => {
            this.hideModal('pause');
            this.game.restart();
        });

        this.elements.pause.quitBtn?.addEventListener('click', () => {
            this.hideModal('pause');
            this.game.returnToMenu();
        });

        // Settings
        this.elements.settings.saveBtn?.addEventListener('click', () => {
            this.saveSettings();
        });

        this.elements.settings.closeBtn?.addEventListener('click', () => {
            this.hideModal('settings');
        });

        // Hint modal
        this.elements.hint.closeBtn?.addEventListener('click', () => {
            this.hideModal('hint');
        });

        // Results
        this.elements.results.nextLevelBtn?.addEventListener('click', () => {
            this.handleNextLevel();
        });

        this.elements.results.retryBtn?.addEventListener('click', () => {
            this.game.restart();
        });

        this.elements.results.menuBtn?.addEventListener('click', () => {
            this.game.returnToMenu();
        });

        // Formula panel toggle
        this.elements.formulaPanel.toggle?.addEventListener('click', () => {
            this.toggleFormulaPanel();
        });

        // Graph tools
        this.elements.tools.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTool(btn.dataset.tool);
            });
        });

        this.elements.tools.drawLineBtn?.addEventListener('click', () => {
            this.handleDrawLine();
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id.replace('-modal', '').replace('-menu', ''));
                }
            });
        });
    }

    /**
     * Setup input handlers
     */
    setupInputHandlers() {
        const input = this.elements.question.answerInput;
        
        if (input) {
            // Handle input changes
            input.addEventListener('input', this.handleAnswerInput);
            
            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.game.submitAnswer();
                }
            });
            
            // Handle focus
            input.addEventListener('focus', () => {
                this.showInputSuggestions();
            });
            
            input.addEventListener('blur', () => {
                // Delay hiding to allow click on suggestion
                setTimeout(() => this.hideInputSuggestions(), 200);
            });
        }
        
        // Coordinate inputs
        const coordX = this.elements.question.coordX;
        const coordY = this.elements.question.coordY;
        
        [coordX, coordY].forEach(inp => {
            if (inp) {
                inp.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.game.submitAnswer();
                    }
                });
            }
        });
    }

    // =====================================================
    // SCREEN MANAGEMENT
    // =====================================================

    /**
     * Show a screen
     * @param {string} screenId - Screen element ID
     */
    showScreen(screenId) {
        // Hide all screens
        Object.values(this.elements.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
        
        // Reset difficulty selector when going to menu
        if (screenId === 'main-menu') {
            this.toggleDifficultySelector(false);
        }
    }

    /**
     * Handle state changes from game
     * @param {string} newState 
     * @param {string} previousState 
     */
    onStateChange(newState, previousState) {
        switch (newState) {
            case GameState.MENU:
                this.showScreen('main-menu');
                break;
            
            case GameState.TUTORIAL:
                this.showScreen('tutorial-screen');
                break;
            
            case GameState.PLAYING:
            case GameState.ANSWERING:
                this.showScreen('game-screen');
                this.enableInput(true);
                break;
            
            case GameState.ANIMATING:
                this.enableInput(false);
                break;
            
            case GameState.PAUSED:
                this.showModal('pause');
                break;
            
            case GameState.RESULTS:
            case GameState.GAME_OVER:
                this.showScreen('results-screen');
                break;
        }
    }

    // =====================================================
    // MAIN MENU
    // =====================================================

    /**
     * Toggle difficulty selector visibility
     * @param {boolean} show 
     * @param {boolean} isPractice - If true, this is practice mode
     */
    toggleDifficultySelector(show, isPractice = false) {
        const selector = this.elements.menu.difficultySelector;
        
        if (!selector) return;
        
        if (show) {
            selector.classList.add('active');
            selector.dataset.practice = isPractice;
            
            // Update button states based on unlocked levels
            this.elements.menu.difficultyBtns.forEach(btn => {
                const level = btn.dataset.level;
                const isUnlocked = this.game.isLevelUnlocked(level);
                
                btn.disabled = !isUnlocked && !isPractice;
                btn.classList.toggle('locked', !isUnlocked && !isPractice);
                
                // Show high score
                const highScore = this.game.getHighScore(level);
                if (highScore > 0) {
                    const existing = btn.querySelector('.high-score');
                    if (!existing) {
                        const scoreEl = document.createElement('span');
                        scoreEl.className = 'high-score';
                        scoreEl.textContent = `Best: ${highScore}`;
                        btn.appendChild(scoreEl);
                    }
                }
            });
        } else {
            selector.classList.remove('active');
        }
    }

    /**
     * Select a difficulty level
     * @param {string} level 
     */
    selectDifficulty(level) {
        const selector = this.elements.menu.difficultySelector;
        const isPractice = selector?.dataset.practice === 'true';
        
        // Update selected state
        this.elements.menu.difficultyBtns.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.level === level);
        });
        
        // Start game
        if (isPractice) {
            this.game.startPractice(level);
        } else {
            this.game.startGame(level);
        }
    }

    // =====================================================
    // GAME HEADER
    // =====================================================

    /**
     * Update game header with session info
     * @param {GameSession} session 
     */
    updateGameHeader(session) {
        const config = session.config;
        
        // Level info
        if (this.elements.header.levelBadge) {
            this.elements.header.levelBadge.textContent = `Level ${session.questionIndex + 1}`;
        }
        
        if (this.elements.header.levelName) {
            this.elements.header.levelName.textContent = config.name;
        }
        
        // Initial values
        this.updateScore(session.score);
        this.updateStreak(session.streak);
        this.updateLives(session.lives);
        
        // Timer visibility
        if (this.elements.header.timerDisplay) {
            this.elements.header.timerDisplay.style.display = 
                config.timePerQuestion > 0 ? 'flex' : 'none';
        }
        
        // Show/hide graph tools
        if (this.elements.tools.container) {
            this.elements.tools.container.classList.toggle(
                'active', 
                config.features.graphTools
            );
        }
    }

    /**
     * Update progress display
     * @param {GameSession} session 
     */
    updateProgress(session) {
        if (this.elements.header.levelBadge) {
            this.elements.header.levelBadge.textContent = 
                `${session.questionIndex + 1}/${session.questions.length}`;
        }
    }

    /**
     * Update score display
     * @param {number} score 
     * @param {Object} scoreData - Optional score breakdown
     */
    updateScore(score, scoreData = null) {
        const scoreEl = this.elements.header.scoreValue;
        
        if (!scoreEl) return;
        
        // Animate score change
        const currentScore = parseInt(scoreEl.textContent) || 0;
        
        if (score > currentScore) {
            this.animateNumber(scoreEl, currentScore, score, 500);
            
            // Show score popup if we have breakdown
            if (scoreData && scoreData.total > 0) {
                this.showScorePopup(scoreData);
            }
        } else {
            scoreEl.textContent = score;
        }
    }

    /**
     * Show score popup animation
     * @param {Object} scoreData 
     */
    showScorePopup(scoreData) {
        const container = this.elements.header.scoreValue?.parentElement;
        if (!container) return;
        
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.innerHTML = `
            <span class="score-base">+${scoreData.base}</span>
            ${scoreData.time > 0 ? `<span class="score-bonus time">⚡+${scoreData.time}</span>` : ''}
            ${scoreData.streak > 0 ? `<span class="score-bonus streak">🔥+${scoreData.streak}</span>` : ''}
        `;
        
        container.appendChild(popup);
        
        // Animate and remove
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 300);
        }, CONFIG.animation.scorePopup.duration);
    }

    /**
     * Update streak display
     * @param {number} streak 
     */
    updateStreak(streak) {
        const streakEl = this.elements.header.streakValue;
        
        if (streakEl) {
            streakEl.textContent = streak;
            
            // Add animation for high streaks
            if (streak >= 3) {
                streakEl.parentElement?.classList.add('hot');
            } else {
                streakEl.parentElement?.classList.remove('hot');
            }
        }
    }

    /**
     * Update lives display
     * @param {number} lives 
     */
    updateLives(lives) {
        const livesEl = this.elements.header.livesIcons;
        
        if (livesEl) {
            let hearts = '';
            for (let i = 0; i < lives; i++) {
                hearts += '❤️';
            }
            
            // Show empty hearts for lost lives (max 5)
            const maxLives = 5;
            for (let i = lives; i < Math.min(maxLives, lives + 2); i++) {
                hearts += '🖤';
            }
            
            livesEl.textContent = hearts;
            
            // Pulse animation when low
            if (lives <= 1) {
                livesEl.parentElement?.classList.add('danger');
            } else {
                livesEl.parentElement?.classList.remove('danger');
            }
        }
    }

    /**
     * Update timer display
     * @param {number} timeRemaining 
     * @param {number} totalTime 
     */
    updateTimer(timeRemaining, totalTime) {
        const timerEl = this.elements.header.timerValue;
        
        if (timerEl) {
            timerEl.textContent = timeRemaining;
        }
    }

    /**
     * Set timer warning state
     * @param {string} level - 'warning', 'danger', or ''
     */
    setTimerWarning(level) {
        const timerDisplay = this.elements.header.timerDisplay;
        
        if (timerDisplay) {
            timerDisplay.classList.remove('warning', 'danger');
            if (level) {
                timerDisplay.classList.add(level);
            }
        }
    }

    // =====================================================
    // QUESTION DISPLAY
    // =====================================================

    /**
     * Display a question
     * @param {Question} question 
     */
    displayQuestion(question) {
        const data = question.getDisplayData();
        
        // Equation
        if (this.elements.question.equationBox) {
            this.elements.question.equationBox.innerHTML = this.formatEquation(data.equation);
        }
        
        // Additional forms (for advanced levels)
        if (this.elements.question.equationForms) {
            this.elements.question.equationForms.innerHTML = '';
            
            if (question.quadratic) {
                const vertexForm = question.quadratic.getVertexFormString();
                if (vertexForm && this.game.session?.config.features.showEquationForms) {
                    this.elements.question.equationForms.innerHTML = `
                        <small>Vertex form: y = ${vertexForm}</small>
                    `;
                }
            }
        }
        
        // Question text
        if (this.elements.question.questionText) {
            this.elements.question.questionText.textContent = data.question;
        }
        
        // Answer format hint
        if (this.elements.question.answerLabel) {
            this.elements.question.answerLabel.textContent = 
                data.answerFormat ? `Answer (${data.answerFormat}):` : 'Your Answer:';
        }
        
        // Setup appropriate input type
        this.setupInputType(data.inputType, data.choices);
        
        // Clear previous answer
        this.clearAnswer();
        
        // Update hint button
        if (this.elements.question.hintBtn) {
            this.elements.question.hintBtn.style.display = 
                data.hasHints && this.game.settings.hints ? 'inline-block' : 'none';
        }
        
        // Hide feedback
        this.hideFeedback();
        
        // Focus input
        setTimeout(() => {
            this.focusInput();
        }, 100);
    }

    /**
     * Format equation for display (handle superscripts, etc.)
     * @param {string} equation 
     * @returns {string}
     */
    formatEquation(equation) {
        return equation
            .replace(/\^2/g, '²')
            .replace(/x2/g, 'x²')
            .replace(/\*/g, '×')
            .replace(/sqrt\(([^)]+)\)/g, '√($1)');
    }

    /**
     * Setup the appropriate input type for the question
     * @param {string} inputType 
     * @param {Array} choices 
     */
    setupInputType(inputType, choices = null) {
        // Hide all input types first
        const textInput = this.elements.question.answerInput;
        const coordInput = this.elements.question.coordinateInput;
        const mcInput = this.elements.question.multipleChoice;
        
        if (textInput) textInput.style.display = 'none';
        if (coordInput) coordInput.style.display = 'none';
        if (mcInput) mcInput.style.display = 'none';
        
        switch (inputType) {
            case 'multiple_choice':
                if (mcInput && choices) {
                    mcInput.style.display = 'grid';
                    this.setupMultipleChoice(choices);
                }
                break;
            
            case 'coordinate':
            case 'coordinate_single':
                if (coordInput) {
                    coordInput.style.display = 'flex';
                }
                break;
            
            default:
                if (textInput) {
                    textInput.style.display = 'block';
                    textInput.placeholder = this.getInputPlaceholder(inputType);
                }
        }
    }

    /**
     * Get placeholder text for input type
     * @param {string} inputType 
     * @returns {string}
     */
    getInputPlaceholder(inputType) {
        const placeholders = {
            'equation': 'e.g., x = 2',
            'value': 'e.g., 5 or -3',
            'values': 'e.g., 1, 3 or x = 1, 3',
            'coordinate': 'e.g., (2, -1)',
            'coordinates': 'e.g., (1, 2), (3, 4)',
            'inequality': 'e.g., y ≥ -4'
        };
        
        return placeholders[inputType] || 'Enter your answer';
    }

    /**
     * Setup multiple choice options
     * @param {Array} choices 
     */
    setupMultipleChoice(choices) {
        const buttons = this.elements.question.choiceBtns;
        
        buttons.forEach((btn, index) => {
            if (index < choices.length) {
                btn.style.display = 'block';
                btn.textContent = choices[index];
                btn.className = 'choice-btn';
                btn.disabled = false;
            } else {
                btn.style.display = 'none';
            }
        });
    }

    /**
     * Handle multiple choice selection
     * @param {number} index 
     */
    handleChoiceClick(index) {
        // Update visual selection
        this.elements.question.choiceBtns.forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
        
        // Store selection
        this.selectedChoice = index;
    }

    /**
     * Get the current answer from input
     * @returns {string}
     */
    getAnswer() {
        const inputType = this.getCurrentInputType();
        
        switch (inputType) {
            case 'multiple_choice':
                if (this.selectedChoice !== undefined) {
                    return this.elements.question.choiceBtns[this.selectedChoice]?.textContent || '';
                }
                return '';
            
            case 'coordinate':
                const x = this.elements.question.coordX?.value;
                const y = this.elements.question.coordY?.value;
                if (x && y) {
                    return `(${x}, ${y})`;
                }
                return '';
            
            default:
                return this.elements.question.answerInput?.value || '';
        }
    }

    /**
     * Get current input type
     * @returns {string}
     */
    getCurrentInputType() {
        if (this.elements.question.multipleChoice?.style.display !== 'none') {
            return 'multiple_choice';
        }
        if (this.elements.question.coordinateInput?.style.display !== 'none') {
            return 'coordinate';
        }
        return 'text';
    }

    /**
     * Clear the answer input
     */
    clearAnswer() {
        if (this.elements.question.answerInput) {
            this.elements.question.answerInput.value = '';
        }
        
        if (this.elements.question.coordX) {
            this.elements.question.coordX.value = '';
        }
        
        if (this.elements.question.coordY) {
            this.elements.question.coordY.value = '';
        }
        
        this.selectedChoice = undefined;
        
        this.elements.question.choiceBtns.forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    /**
     * Focus the appropriate input
     */
    focusInput() {
        const inputType = this.getCurrentInputType();
        
        switch (inputType) {
            case 'coordinate':
                this.elements.question.coordX?.focus();
                break;
            case 'text':
                this.elements.question.answerInput?.focus();
                break;
        }
    }

    /**
     * Enable/disable input
     * @param {boolean} enabled 
     */
    enableInput(enabled) {
        const inputs = [
            this.elements.question.answerInput,
            this.elements.question.coordX,
            this.elements.question.coordY,
            this.elements.question.launchBtn,
            this.elements.question.skipBtn,
            this.elements.question.hintBtn
        ];
        
        inputs.forEach(input => {
            if (input) {
                input.disabled = !enabled;
            }
        });
        
        this.elements.question.choiceBtns.forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    // =====================================================
    // INPUT SUGGESTIONS
    // =====================================================

    /**
     * Handle answer input changes
     * @param {Event} e 
     */
    handleAnswerInput(e) {
        const value = e.target.value.toLowerCase();
        
        // Show suggestions based on input
        if (value.length > 0) {
            this.updateInputSuggestions(value);
        } else {
            this.hideInputSuggestions();
        }
    }

    /**
     * Update input suggestions
     * @param {string} value 
     */
    updateInputSuggestions(value) {
        const suggestions = this.elements.question.inputSuggestions;
        if (!suggestions) return;
        
        const possibleSuggestions = [
            { trigger: 'x', suggestion: 'x = ' },
            { trigger: 'y', suggestion: 'y = ' },
            { trigger: '(', suggestion: '(x, y)' },
            { trigger: 'no', suggestion: 'no real roots' },
            { trigger: 'tw', suggestion: 'two distinct real roots' }
        ];
        
        const matches = possibleSuggestions.filter(s => 
            s.trigger.startsWith(value) && s.trigger !== value
        );
        
        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(m => 
                `<div class="suggestion-item" data-value="${m.suggestion}">${m.suggestion}</div>`
            ).join('');
            
            // Bind click events
            suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.elements.question.answerInput.value = item.dataset.value;
                    this.hideInputSuggestions();
                    this.elements.question.answerInput.focus();
                });
            });
            
            suggestions.classList.add('active');
        } else {
            this.hideInputSuggestions();
        }
    }

    /**
     * Show input suggestions
     */
    showInputSuggestions() {
        // Initial suggestions
    }

    /**
     * Hide input suggestions
     */
    hideInputSuggestions() {
        const suggestions = this.elements.question.inputSuggestions;
        if (suggestions) {
            suggestions.classList.remove('active');
        }
    }

    // =====================================================
    // FEEDBACK
    // =====================================================

    /**
     * Show feedback for an answer
     * @param {Object} result - Validation result
     * @param {boolean} isCorrect 
     * @param {Object} scoreData - Optional score breakdown
     */
    showFeedback(result, isCorrect, scoreData = null) {
        const feedback = this.elements.feedback;
        
        if (!feedback.area) return;
        
        // Update content
        feedback.icon.textContent = isCorrect ? '✓' : '✗';
        feedback.text.textContent = result.feedback || (isCorrect ? 'Correct!' : 'Incorrect');
        
        // Show explanation
        if (result.explanation) {
            feedback.explanation.innerHTML = `
                <p>${result.explanation}</p>
                ${result.steps ? `
                    <details>
                        <summary>Show working</summary>
                        <ol>
                            ${result.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </details>
                ` : ''}
            `;
        } else {
            feedback.explanation.innerHTML = '';
        }
        
        // Update styling
        feedback.area.classList.remove('correct', 'incorrect');
        feedback.area.classList.add(isCorrect ? 'correct' : 'incorrect');
        feedback.area.classList.add('show');
        
        // Update multiple choice buttons if applicable
        if (this.getCurrentInputType() === 'multiple_choice') {
            const question = this.game.session?.getCurrentQuestion();
            if (question) {
                this.elements.question.choiceBtns.forEach((btn, index) => {
                    if (index === question.correctChoiceIndex) {
                        btn.classList.add('correct');
                    } else if (index === this.selectedChoice) {
                        btn.classList.add('incorrect');
                    }
                    btn.disabled = true;
                });
            }
        }
    }

    /**
     * Hide feedback
     */
    hideFeedback() {
        const feedback = this.elements.feedback;
        
        if (feedback.area) {
            feedback.area.classList.remove('show', 'correct', 'incorrect');
        }
    }

    /**
     * Show hit/miss effect on canvas
     * @param {boolean} hit 
     */
    showHitEffect(hit) {
        const hitFeedback = this.elements.canvas.hitFeedback;
        
        if (!hitFeedback) return;
        
        hitFeedback.querySelector('.hit-text').textContent = 
            hit ? '🎯 Perfect Hit!' : '💥 Missed!';
        
        hitFeedback.classList.add('show');
        
        setTimeout(() => {
            hitFeedback.classList.remove('show');
        }, 1500);
    }

    // =====================================================
    // HINTS
    // =====================================================

    /**
     * Show hint modal
     * @param {Object} hint 
     */
    showHint(hint) {
        const modal = this.elements.hint;
        
        if (modal.text) {
            modal.text.textContent = hint.text;
        }
        
        if (modal.formula) {
            if (hint.formula) {
                modal.formula.textContent = hint.formula;
                modal.formula.style.display = 'block';
            } else {
                modal.formula.style.display = 'none';
            }
        }
        
        this.showModal('hint');
    }

    // =====================================================
    // MODALS
    // =====================================================

    /**
     * Show a modal
     * @param {string} modalName 
     */
    showModal(modalName) {
        const modal = this.elements.modals[modalName];
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Hide a modal
     * @param {string} modalName 
     */
    hideModal(modalName) {
        const modal = this.elements.modals[modalName];
        
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Show pause menu
     * @param {GameSession} session 
     */
    showPauseMenu(session) {
        if (this.elements.pause.score) {
            this.elements.pause.score.textContent = session.score;
        }
        
        if (this.elements.pause.level) {
            this.elements.pause.level.textContent = 
                `${session.questionIndex + 1}/${session.questions.length}`;
        }
        
        this.showModal('pause');
    }

    /**
     * Hide pause menu
     */
    hidePauseMenu() {
        this.hideModal('pause');
    }

    // =====================================================
    // SETTINGS
    // =====================================================

    /**
     * Load settings into UI
     */
    loadSettingsUI() {
        const settings = this.game.settings;
        
        if (this.elements.settings.sound) {
            this.elements.settings.sound.checked = settings.sound;
        }
        
        if (this.elements.settings.music) {
            this.elements.settings.music.checked = settings.music;
        }
        
        if (this.elements.settings.hints) {
            this.elements.settings.hints.checked = settings.hints;
        }
        
        if (this.elements.settings.timer) {
            this.elements.settings.timer.value = settings.timer;
        }
        
        if (this.elements.settings.grid) {
            this.elements.settings.grid.value = settings.gridStyle;
        }
    }

    /**
     * Save settings from UI
     */
    saveSettings() {
        this.game.updateSetting('sound', this.elements.settings.sound?.checked ?? true);
        this.game.updateSetting('music', this.elements.settings.music?.checked ?? true);
        this.game.updateSetting('hints', this.elements.settings.hints?.checked ?? true);
        this.game.updateSetting('timer', parseInt(this.elements.settings.timer?.value) || 60);
        this.game.updateSetting('gridStyle', this.elements.settings.grid?.value || 'standard');
        
        this.showToast('Settings saved!', 'success');
        this.hideModal('settings');
    }

    // =====================================================
    // RESULTS SCREEN
    // =====================================================

    /**
     * Show results screen
     * @param {GameSession} session 
     * @param {boolean} isGameOver 
     */
    showResults(session, isGameOver = false) {
        const summary = session.getSummary();
        
        // Title
        if (this.elements.results.title) {
            this.elements.results.title.textContent = 
                isGameOver ? 'Game Over' : 'Level Complete!';
        }
        
        // Stars
        if (this.elements.results.stars) {
            let stars = '';
            for (let i = 0; i < 3; i++) {
                stars += i < summary.stars ? '⭐' : '☆';
            }
            this.elements.results.stars.textContent = stars;
        }
        
        // Stats
        if (this.elements.results.finalScore) {
            this.animateNumber(this.elements.results.finalScore, 0, summary.score, 1000);
        }
        
        if (this.elements.results.questionsAnswered) {
            this.elements.results.questionsAnswered.textContent = 
                `${summary.correctAnswers}/${summary.questionsAnswered}`;
        }
        
        if (this.elements.results.accuracy) {
            this.elements.results.accuracy.textContent = `${summary.accuracy}%`;
        }
        
        if (this.elements.results.bestStreak) {
            this.elements.results.bestStreak.textContent = summary.bestStreak;
        }
        
        // Topic performance bars
        this.renderTopicBars(summary.topicPerformance);
        
        // Next level button
        if (this.elements.results.nextLevelBtn) {
            const canProgress = summary.completed && summary.stars >= 2;
            this.elements.results.nextLevelBtn.style.display = 
                canProgress && !isGameOver ? 'block' : 'none';
        }
        
        // Show screen
        this.showScreen('results-screen');
    }

    /**
     * Render topic performance bars
     * @param {Object} topicPerformance 
     */
    renderTopicBars(topicPerformance) {
        const container = this.elements.results.topicBars;
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.entries(topicPerformance).forEach(([topic, data]) => {
            const percent = data.total > 0 
                ? Math.round((data.correct / data.total) * 100) 
                : 0;
            
            const bar = document.createElement('div');
            bar.className = 'topic-bar';
            bar.innerHTML = `
                <span class="topic-name">${CATEGORY_NAMES[topic] || topic}</span>
                <div class="topic-progress">
                    <div class="topic-fill" style="width: 0%"></div>
                </div>
                <span class="topic-percent">${percent}%</span>
            `;
            
            container.appendChild(bar);
            
            // Animate fill
            setTimeout(() => {
                bar.querySelector('.topic-fill').style.width = `${percent}%`;
            }, 100);
        });
    }

    /**
     * Handle next level button click
     */
    handleNextLevel() {
        const currentLevel = this.game.session?.difficultyId;
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = levels.indexOf(currentLevel);
        
        if (currentIndex < levels.length - 1) {
            this.game.startGame(levels[currentIndex + 1]);
        } else {
            this.showToast('Congratulations! You completed all levels!', 'success');
            this.game.returnToMenu();
        }
    }

    // =====================================================
    // FORMULA PANEL
    // =====================================================

    /**
     * Toggle formula reference panel
     */
    toggleFormulaPanel() {
        const panel = this.elements.formulaPanel.panel;
        
        if (panel) {
            this.formulaPanelOpen = !this.formulaPanelOpen;
            panel.classList.toggle('open', this.formulaPanelOpen);
        }
    }

    // =====================================================
    // GRAPH TOOLS
    // =====================================================

    /**
     * Select a graph tool
     * @param {string} tool 
     */
    selectTool(tool) {
        // Update button states
        this.elements.tools.toolBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        // Show/hide line input
        if (this.elements.tools.lineInput) {
            this.elements.tools.lineInput.style.display = 
                tool === 'line' ? 'block' : 'none';
        }
        
        // Update game session
        if (this.game.session) {
            this.game.session.currentTool = tool;
        }
        
        // Clear tool
        if (tool === 'clear') {
            this.game.canvas?.clearUserDrawings();
            this.game.renderCurrentState();
        }
    }

    /**
     * Handle draw line button click
     */
    handleDrawLine() {
        const equation = this.elements.tools.lineEquation?.value;
        
        if (!equation) {
            this.showToast('Please enter a line equation', 'warning');
            return;
        }
        
        const parsed = QuadraticUtils.parseLineEquation(equation);
        
        if (!parsed) {
            this.showToast('Invalid line equation format', 'error');
            return;
        }
        
        const line = new Line(parsed.m, parsed.c);
        this.game.canvas?.addUserLine(line);
        this.game.renderCurrentState();
    }

    // =====================================================
    // TOAST NOTIFICATIONS
    // =====================================================

    /**
     * Show a toast notification
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'warning', 'info'
     */
    showToast(message, type = 'info') {
        this.toastQueue.push({ message, type });
        
        if (!this.isShowingToast) {
            this.processToastQueue();
        }
    }

    /**
     * Process toast queue
     */
    processToastQueue() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }
        
        this.isShowingToast = true;
        const { message, type } = this.toastQueue.shift();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                this.processToastQueue();
            }, 300);
        }, CONFIG.ui.toast.duration);
    }

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================

    /**
     * Show achievement notification
     * @param {Object} achievement 
     */
    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // =====================================================
    // UTILITIES
    // =====================================================

    /**
     * Animate a number change
     * @param {Element} element 
     * @param {number} start 
     * @param {number} end 
     * @param {number} duration 
     */
    animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = EASING.easeOutQuart(progress);
            
            const current = Math.round(start + (end - start) * eased);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Add CSS styles for dynamic elements
     */
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .score-popup {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                animation: scoreRise 1s ease-out forwards;
                pointer-events: none;
            }
            
            .score-popup .score-base {
                font-size: 1.2rem;
                font-weight: bold;
                color: #FFE66D;
            }
            
            .score-popup .score-bonus {
                font-size: 0.9rem;
                padding: 2px 6px;
                border-radius: 4px;
                margin-top: 2px;
            }
            
            .score-popup .score-bonus.time {
                background: rgba(78, 205, 196, 0.3);
                color: #4ECDC4;
            }
            
            .score-popup .score-bonus.streak {
                background: rgba(255, 107, 107, 0.3);
                color: #FF6B6B;
            }
            
            @keyframes scoreRise {
                to {
                    transform: translateX(-50%) translateY(-30px);
                    opacity: 0;
                }
            }
            
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 2000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .toast.show {
                transform: translateX(0);
            }
            
            .toast-success {
                background: linear-gradient(135deg, #00d26a, #00b359);
                color: white;
            }
            
            .toast-error {
                background: linear-gradient(135deg, #ff4757, #e84545);
                color: white;
            }
            
            .toast-warning {
                background: linear-gradient(135deg, #ffa502, #e69500);
                color: white;
            }
            
            .toast-info {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }
            
            .achievement-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: linear-gradient(135deg, #6C63FF, #A55EEA);
                padding: 15px 25px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 2000;
                box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .achievement-notification.show {
                transform: translateX(-50%) translateY(0);
            }
            
            .achievement-icon {
                font-size: 2.5rem;
            }
            
            .achievement-title {
                font-size: 0.8rem;
                color: rgba(255,255,255,0.7);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .achievement-name {
                font-size: 1.2rem;
                font-weight: bold;
                color: white;
            }
            
            .achievement-desc {
                font-size: 0.9rem;
                color: rgba(255,255,255,0.8);
            }
            
            .high-score {
                display: block;
                font-size: 0.7rem;
                color: #FFE66D;
                margin-top: 4px;
            }
            
            .difficulty-btn.locked {
                opacity: 0.5;
                position: relative;
            }
            
            .difficulty-btn.locked::after {
                content: '🔒';
                position: absolute;
                top: 5px;
                right: 5px;
            }
            
            .streak-display.hot {
                animation: hotStreak 0.5s ease infinite;
            }
            
            @keyframes hotStreak {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .lives-display.danger {
                animation: dangerPulse 0.5s ease infinite;
            }
            
            @keyframes dangerPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI };
}