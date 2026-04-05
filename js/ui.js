/* =====================================================
   QUADRATIC CATAPULT QUEST - UI CONTROLLER
   =====================================================
   Handles all DOM manipulation and user interface
   CORRECTED VERSION - Fixed screen transitions & events
   ===================================================== */

/**
 * UI Class
 * Manages all user interface elements and interactions
 */
class UI {
    constructor() {
        // Cache DOM elements
        this.elements = {};
        
        // Current screen
        this.currentScreen = null;
        
        // Animation timers
        this.timers = {};
        
        // Toast queue
        this.toastQueue = [];
        this.isShowingToast = false;
        
        // Formula panel state
        this.formulaPanelOpen = false;
        
        // Selected choice for multiple choice
        this.selectedChoice = null;
        
        // Game reference (set in init)
        this.game = null;
        
        // Initialize on construction
        this.cacheElements();
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
            hintBtn: document.getElementById('btn-hint'),
            launchBtn: document.getElementById('btn-launch'),
            skipBtn: document.getElementById('btn-skip')
        };
        
        // Get choice buttons separately
        this.elements.question.choiceBtns = document.querySelectorAll('.choice-btn');

        // Feedback elements
        this.elements.feedback = {
            area: document.getElementById('feedback-area'),
            icon: document.getElementById('feedback-icon'),
            text: document.getElementById('feedback-text'),
            explanation: document.getElementById('feedback-explanation')
        };

        // Canvas elements
        this.elements.canvas = {
            container: document.getElementById('canvas-container'),
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

        console.log('📦 UI elements cached');
    }

    /**
     * Initialize UI with game reference
     * @param {Game} game - The game instance
     */
    init(game) {
        this.game = game;
        this.bindEvents();
        this.setupInputHandlers();
        
        console.log('🖥️ UI initialized and events bound');
    }

    /**
     * Bind all UI events
     */
    bindEvents() {
        // ===== MAIN MENU =====
        
        // Play button
        if (this.elements.menu.playBtn) {
            this.elements.menu.playBtn.addEventListener('click', () => {
                console.log('▶️ Play button clicked');
                this.toggleDifficultySelector(true, false);
            });
        }

        // Practice button
        if (this.elements.menu.practiceBtn) {
            this.elements.menu.practiceBtn.addEventListener('click', () => {
                console.log('📚 Practice button clicked');
                this.toggleDifficultySelector(true, true);
            });
        }

        // Tutorial button
        if (this.elements.menu.tutorialBtn) {
            this.elements.menu.tutorialBtn.addEventListener('click', () => {
                console.log('❓ Tutorial button clicked');
                this.showScreen('tutorial-screen');
            });
        }

        // Settings button
        if (this.elements.menu.settingsBtn) {
            this.elements.menu.settingsBtn.addEventListener('click', () => {
                console.log('⚙️ Settings button clicked');
                this.showModal('settings');
            });
        }

        // Difficulty selection buttons
        if (this.elements.menu.difficultyBtns) {
            this.elements.menu.difficultyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = btn.dataset.level;
                    console.log(`🎮 Difficulty selected: ${level}`);
                    this.selectDifficulty(level);
                });
            });
        }

        // ===== TUTORIAL =====
        
        if (this.elements.tutorial.backBtn) {
            this.elements.tutorial.backBtn.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        }

        // ===== GAME CONTROLS =====
        
        // Pause button
        if (this.elements.header.pauseBtn) {
            this.elements.header.pauseBtn.addEventListener('click', () => {
                if (this.game) this.game.pause();
            });
        }

        // Launch button
        if (this.elements.question.launchBtn) {
            this.elements.question.launchBtn.addEventListener('click', () => {
                console.log('🚀 Launch button clicked');
                if (this.game) this.game.submitAnswer();
            });
        }

        // Skip button
        if (this.elements.question.skipBtn) {
            this.elements.question.skipBtn.addEventListener('click', () => {
                if (this.game) this.game.skipQuestion();
            });
        }

        // Hint button
        if (this.elements.question.hintBtn) {
            this.elements.question.hintBtn.addEventListener('click', () => {
                if (this.game) this.game.showHint();
            });
        }

        // Multiple choice buttons
        if (this.elements.question.choiceBtns) {
            this.elements.question.choiceBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    this.handleChoiceClick(index);
                });
            });
        }

        // ===== PAUSE MENU =====
        
        if (this.elements.pause.resumeBtn) {
            this.elements.pause.resumeBtn.addEventListener('click', () => {
                if (this.game) this.game.resume();
            });
        }

        if (this.elements.pause.restartBtn) {
            this.elements.pause.restartBtn.addEventListener('click', () => {
                this.hideModal('pause');
                if (this.game) this.game.restart();
            });
        }

        if (this.elements.pause.quitBtn) {
            this.elements.pause.quitBtn.addEventListener('click', () => {
                this.hideModal('pause');
                if (this.game) this.game.returnToMenu();
            });
        }

        // ===== SETTINGS =====
        
        if (this.elements.settings.saveBtn) {
            this.elements.settings.saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (this.elements.settings.closeBtn) {
            this.elements.settings.closeBtn.addEventListener('click', () => {
                this.hideModal('settings');
            });
        }

        // ===== HINT MODAL =====
        
        if (this.elements.hint.closeBtn) {
            this.elements.hint.closeBtn.addEventListener('click', () => {
                this.hideModal('hint');
            });
        }

        // ===== RESULTS =====
        
        if (this.elements.results.nextLevelBtn) {
            this.elements.results.nextLevelBtn.addEventListener('click', () => {
                this.handleNextLevel();
            });
        }

        if (this.elements.results.retryBtn) {
            this.elements.results.retryBtn.addEventListener('click', () => {
                if (this.game) this.game.restart();
            });
        }

        if (this.elements.results.menuBtn) {
            this.elements.results.menuBtn.addEventListener('click', () => {
                if (this.game) this.game.returnToMenu();
            });
        }

        // ===== FORMULA PANEL =====
        
        if (this.elements.formulaPanel.toggle) {
            this.elements.formulaPanel.toggle.addEventListener('click', () => {
                this.toggleFormulaPanel();
            });
        }

        // ===== GRAPH TOOLS =====
        
        if (this.elements.tools.toolBtns) {
            this.elements.tools.toolBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.selectTool(btn.dataset.tool);
                });
            });
        }

        if (this.elements.tools.drawLineBtn) {
            this.elements.tools.drawLineBtn.addEventListener('click', () => {
                this.handleDrawLine();
            });
        }

        // ===== MODAL OVERLAY CLICKS =====
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    const modalName = modal.id.replace('-modal', '').replace('-menu', '');
                    this.hideModal(modalName);
                }
            });
        });

        console.log('🔗 All events bound');
    }

    /**
     * Setup input handlers
     */
    setupInputHandlers() {
        const input = this.elements.question.answerInput;
        
        if (input) {
            // Handle input changes
            input.addEventListener('input', (e) => this.handleAnswerInput(e));
            
            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.game) this.game.submitAnswer();
                }
            });
            
            // Handle focus
            input.addEventListener('focus', () => {
                this.showInputSuggestions();
            });
            
            // Handle blur with delay
            input.addEventListener('blur', () => {
                setTimeout(() => this.hideInputSuggestions(), 200);
            });
        }
        
        // Coordinate inputs
        const coordInputs = [this.elements.question.coordX, this.elements.question.coordY];
        coordInputs.forEach(inp => {
            if (inp) {
                inp.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (this.game) this.game.submitAnswer();
                    }
                });
            }
        });
    }

    // =====================================================
    // SCREEN MANAGEMENT
    // =====================================================

    /**
     * Show a screen by ID
     * @param {string} screenId - Screen element ID
     */
    showScreen(screenId) {
        console.log(`📺 Showing screen: ${screenId}`);
        
        // Hide all screens
        Object.entries(this.elements.screens).forEach(([name, screen]) => {
            if (screen) {
                screen.classList.remove('active');
                screen.style.display = 'none';
            }
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = 'flex';
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Force canvas resize when showing game screen
            if (screenId === 'game-screen' && this.game && this.game.canvas) {
                setTimeout(() => {
                    this.game.canvas.forceResize();
                }, 100);
            }
        } else {
            console.warn(`Screen not found: ${screenId}`);
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
        console.log(`🔄 UI state change: ${previousState} → ${newState}`);
        
        switch (newState) {
            case GameState.MENU:
                this.showScreen('main-menu');
                break;
            
            case GameState.TUTORIAL:
                this.showScreen('tutorial-screen');
                break;
            
            case GameState.PLAYING:
            case GameState.ANSWERING:
                if (this.currentScreen !== 'game-screen') {
                    this.showScreen('game-screen');
                }
                this.enableInput(true);
                break;
            
            case GameState.ANIMATING:
                this.enableInput(false);
                break;
            
            case GameState.PAUSED:
                this.showPauseMenu(this.game?.session);
                break;
            
            case GameState.RESULTS:
            case GameState.GAME_OVER:
                // Results shown via showResults()
                break;
        }
    }

    // =====================================================
    // MAIN MENU
    // =====================================================

    /**
     * Toggle difficulty selector visibility
     * @param {boolean} show 
     * @param {boolean} isPractice 
     */
    toggleDifficultySelector(show, isPractice = false) {
        const selector = this.elements.menu.difficultySelector;
        
        if (!selector) {
            console.warn('Difficulty selector not found');
            return;
        }
        
        if (show) {
            selector.classList.add('active');
            selector.style.display = 'block';
            selector.dataset.practice = isPractice ? 'true' : 'false';
            
            // Update button states
            if (this.elements.menu.difficultyBtns && this.game) {
                this.elements.menu.difficultyBtns.forEach(btn => {
                    const level = btn.dataset.level;
                    const isUnlocked = this.game.isLevelUnlocked(level);
                    
                    btn.disabled = !isUnlocked && !isPractice;
                    btn.classList.toggle('locked', !isUnlocked && !isPractice);
                    
                    // Show high score
                    const highScore = this.game.getHighScore(level);
                    let scoreEl = btn.querySelector('.high-score');
                    
                    if (highScore > 0) {
                        if (!scoreEl) {
                            scoreEl = document.createElement('span');
                            scoreEl.className = 'high-score';
                            btn.appendChild(scoreEl);
                        }
                        scoreEl.textContent = `Best: ${highScore}`;
                    }
                });
            }
        } else {
            selector.classList.remove('active');
            selector.style.display = 'none';
        }
    }

    /**
     * Select a difficulty level and start game
     * @param {string} level 
     */
    selectDifficulty(level) {
        const selector = this.elements.menu.difficultySelector;
        const isPractice = selector?.dataset.practice === 'true';
        
        // Update selected state visually
        if (this.elements.menu.difficultyBtns) {
            this.elements.menu.difficultyBtns.forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.level === level);
            });
        }
        
        // Hide selector
        this.toggleDifficultySelector(false);
        
        // Start game
        if (this.game) {
            if (isPractice) {
                this.game.startPractice(level);
            } else {
                this.game.startGame(level);
            }
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
        if (!session) return;
        
        const config = session.config;
        
        // Level info
        if (this.elements.header.levelBadge) {
            this.elements.header.levelBadge.textContent = `Q ${session.questionIndex + 1}`;
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
            const showTimer = config.timePerQuestion > 0;
            this.elements.header.timerDisplay.style.display = showTimer ? 'flex' : 'none';
            
            if (showTimer && this.elements.header.timerValue) {
                this.elements.header.timerValue.textContent = config.timePerQuestion;
            }
        }
        
        // Show/hide graph tools
        if (this.elements.tools.container) {
            const showTools = config.features && config.features.graphTools;
            this.elements.tools.container.style.display = showTools ? 'block' : 'none';
        }
    }

    /**
     * Update progress display
     * @param {GameSession} session 
     */
    updateProgress(session) {
        if (!session) return;
        
        if (this.elements.header.levelBadge) {
            this.elements.header.levelBadge.textContent = 
                `${session.questionIndex + 1}/${session.questions.length}`;
        }
    }

    /**
     * Update score display
     * @param {number} score 
     * @param {Object} scoreData 
     */
    updateScore(score, scoreData = null) {
        const scoreEl = this.elements.header.scoreValue;
        if (!scoreEl) return;
        
        const currentScore = parseInt(scoreEl.textContent) || 0;
        
        if (score > currentScore) {
            this.animateNumber(scoreEl, currentScore, score, 500);
            
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
        
        container.style.position = 'relative';
        container.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1500);
    }

    /**
     * Update streak display
     * @param {number} streak 
     */
    updateStreak(streak) {
        const streakEl = this.elements.header.streakValue;
        if (!streakEl) return;
        
        streakEl.textContent = streak;
        
        const parent = streakEl.parentElement;
        if (parent) {
            if (streak >= 3) {
                parent.classList.add('hot');
            } else {
                parent.classList.remove('hot');
            }
        }
    }

    /**
     * Update lives display
     * @param {number} lives 
     */
    updateLives(lives) {
        const livesEl = this.elements.header.livesIcons;
        if (!livesEl) return;
        
        let hearts = '';
        const maxDisplay = 5;
        
        for (let i = 0; i < Math.min(lives, maxDisplay); i++) {
            hearts += '❤️';
        }
        
        if (lives < maxDisplay) {
            for (let i = lives; i < maxDisplay; i++) {
                hearts += '🖤';
            }
        }
        
        livesEl.textContent = hearts;
        
        const parent = livesEl.parentElement;
        if (parent) {
            if (lives <= 1) {
                parent.classList.add('danger');
            } else {
                parent.classList.remove('danger');
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
            timerEl.textContent = Math.max(0, Math.ceil(timeRemaining));
        }
    }

    /**
     * Set timer warning state
     * @param {string} level 
     */
    setTimerWarning(level) {
        const timerDisplay = this.elements.header.timerDisplay;
        if (!timerDisplay) return;
        
        timerDisplay.classList.remove('warning', 'danger');
        if (level) {
            timerDisplay.classList.add(level);
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
        if (!question) {
            console.warn('No question to display');
            return;
        }
        
        const data = question.getDisplayData();
        console.log('📝 Displaying question:', data.type);
        
        // Equation
        if (this.elements.question.equationBox) {
            this.elements.question.equationBox.innerHTML = this.formatEquation(data.equation);
        }
        
        // Additional forms
        if (this.elements.question.equationForms) {
            this.elements.question.equationForms.innerHTML = '';
            
            if (question.quadratic && this.game?.session?.config?.features?.showEquationForms) {
                try {
                    const vertexForm = question.quadratic.getVertexFormString();
                    if (vertexForm) {
                        this.elements.question.equationForms.innerHTML = `
                            <small style="color: #b8b8d1;">Vertex form: y = ${vertexForm}</small>
                        `;
                    }
                } catch (e) {
                    // Ignore errors
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
        
        // Setup input type
        this.setupInputType(data.inputType, data.choices);
        
        // Clear previous answer
        this.clearAnswer();
        
        // Update hint button
        if (this.elements.question.hintBtn) {
            const showHints = data.hasHints && this.game?.settings?.hints !== false;
            this.elements.question.hintBtn.style.display = showHints ? 'inline-block' : 'none';
        }
        
        // Hide feedback
        this.hideFeedback();
        
        // Focus input after short delay
        setTimeout(() => this.focusInput(), 150);
    }

    /**
     * Format equation for display
     * @param {string} equation 
     * @returns {string}
     */
    formatEquation(equation) {
        if (!equation) return '';
        
        return equation
            .replace(/\^2/g, '²')
            .replace(/x2/g, 'x²')
            .replace(/\*/g, '×')
            .replace(/sqrt\(([^)]+)\)/g, '√($1)')
            .replace(/\+-/g, '- ')
            .replace(/--/g, '+ ');
    }

    /**
     * Setup the appropriate input type
     * @param {string} inputType 
     * @param {Array} choices 
     */
    setupInputType(inputType, choices = null) {
        // Get input elements
        const textInput = this.elements.question.answerInput;
        const coordInput = this.elements.question.coordinateInput;
        const mcInput = this.elements.question.multipleChoice;
        
        // Hide all first
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
        if (!this.elements.question.choiceBtns) return;
        
        this.elements.question.choiceBtns.forEach((btn, index) => {
            if (index < choices.length) {
                btn.style.display = 'block';
                btn.textContent = choices[index];
                btn.className = 'choice-btn';
                btn.disabled = false;
            } else {
                btn.style.display = 'none';
            }
        });
        
        this.selectedChoice = null;
    }

    /**
     * Handle multiple choice selection
     * @param {number} index 
     */
    handleChoiceClick(index) {
        if (!this.elements.question.choiceBtns) return;
        
        this.elements.question.choiceBtns.forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
        
        this.selectedChoice = index;
        console.log(`📌 Selected choice: ${index}`);
    }

    /**
     * Get the current answer from input
     * @returns {string}
     */
    getAnswer() {
        const inputType = this.getCurrentInputType();
        
        switch (inputType) {
            case 'multiple_choice':
                if (this.selectedChoice !== null && this.elements.question.choiceBtns) {
                    const btn = this.elements.question.choiceBtns[this.selectedChoice];
                    return btn ? btn.textContent : '';
                }
                return '';
            
            case 'coordinate':
                const x = this.elements.question.coordX?.value;
                const y = this.elements.question.coordY?.value;
                if (x !== '' && y !== '') {
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
        const mc = this.elements.question.multipleChoice;
        const coord = this.elements.question.coordinateInput;
        
        if (mc && mc.style.display !== 'none') {
            return 'multiple_choice';
        }
        if (coord && coord.style.display !== 'none') {
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
        
        this.selectedChoice = null;
        
        if (this.elements.question.choiceBtns) {
            this.elements.question.choiceBtns.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
            });
        }
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
            if (input) input.disabled = !enabled;
        });
        
        if (this.elements.question.choiceBtns) {
            this.elements.question.choiceBtns.forEach(btn => {
                btn.disabled = !enabled;
            });
        }
    }

    // =====================================================
    // INPUT HANDLING
    // =====================================================

    /**
     * Handle answer input changes
     * @param {Event} e 
     */
    handleAnswerInput(e) {
        const value = e.target.value.toLowerCase();
        
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
            { trigger: 'no', suggestion: 'no real roots' }
        ];
        
        const matches = possibleSuggestions.filter(s => 
            s.trigger.startsWith(value) && s.trigger !== value
        );
        
        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(m => 
                `<div class="suggestion-item" data-value="${m.suggestion}">${m.suggestion}</div>`
            ).join('');
            
            suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (this.elements.question.answerInput) {
                        this.elements.question.answerInput.value = item.dataset.value;
                        this.elements.question.answerInput.focus();
                    }
                    this.hideInputSuggestions();
                });
            });
            
            suggestions.style.display = 'block';
        } else {
            this.hideInputSuggestions();
        }
    }

    /**
     * Show input suggestions
     */
    showInputSuggestions() {
        // Placeholder for initial suggestions
    }

    /**
     * Hide input suggestions
     */
    hideInputSuggestions() {
        const suggestions = this.elements.question.inputSuggestions;
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    // =====================================================
    // FEEDBACK
    // =====================================================

    /**
     * Show feedback for an answer
     * @param {Object} result 
     * @param {boolean} isCorrect 
     * @param {Object} scoreData 
     */
    showFeedback(result, isCorrect, scoreData = null) {
        const feedback = this.elements.feedback;
        if (!feedback.area) return;
        
        // Update content
        if (feedback.icon) {
            feedback.icon.textContent = isCorrect ? '✓' : '✗';
        }
        
        if (feedback.text) {
            feedback.text.textContent = result.feedback || (isCorrect ? 'Correct!' : 'Incorrect');
        }
        
        // Show explanation
        if (feedback.explanation) {
            if (result.explanation) {
                let html = `<p>${result.explanation}</p>`;
                
                if (result.steps && result.steps.length > 0) {
                    html += `
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; color: #6C63FF;">Show working</summary>
                            <ol style="margin-top: 10px; padding-left: 20px;">
                                ${result.steps.map(step => `<li style="margin: 5px 0;">${step}</li>`).join('')}
                            </ol>
                        </details>
                    `;
                }
                
                feedback.explanation.innerHTML = html;
            } else {
                feedback.explanation.innerHTML = '';
            }
        }
        
        // Update styling
        feedback.area.classList.remove('correct', 'incorrect');
        feedback.area.classList.add(isCorrect ? 'correct' : 'incorrect');
        feedback.area.classList.add('show');
        feedback.area.style.display = 'block';
        
        // Update multiple choice buttons
        if (this.getCurrentInputType() === 'multiple_choice') {
            const question = this.game?.session?.getCurrentQuestion();
            if (question && this.elements.question.choiceBtns) {
                this.elements.question.choiceBtns.forEach((btn, index) => {
                    if (index === question.correctChoiceIndex) {
                        btn.classList.add('correct');
                    } else if (index === this.selectedChoice && !isCorrect) {
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
            feedback.area.style.display = 'none';
        }
    }

    /**
     * Show hit/miss effect
     * @param {boolean} hit 
     */
    showHitEffect(hit) {
        const hitFeedback = this.elements.canvas.hitFeedback;
        if (!hitFeedback) return;
        
        const textEl = hitFeedback.querySelector('.hit-text');
        if (textEl) {
            textEl.textContent = hit ? '🎯 Perfect Hit!' : '💥 Missed!';
            textEl.style.color = hit ? '#4ECDC4' : '#FF6B6B';
        }
        
        hitFeedback.style.display = 'flex';
        hitFeedback.classList.add('show');
        
        setTimeout(() => {
            hitFeedback.classList.remove('show');
            hitFeedback.style.display = 'none';
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
        if (this.elements.hint.text) {
            this.elements.hint.text.textContent = hint.text || 'No hint available';
        }
        
        if (this.elements.hint.formula) {
            if (hint.formula) {
                this.elements.hint.formula.textContent = hint.formula;
                this.elements.hint.formula.style.display = 'block';
            } else {
                this.elements.hint.formula.style.display = 'none';
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
            modal.style.display = 'flex';
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
            modal.style.display = 'none';
        }
    }

    /**
     * Show pause menu
     * @param {GameSession} session 
     */
    showPauseMenu(session) {
        if (session) {
            if (this.elements.pause.score) {
                this.elements.pause.score.textContent = session.score;
            }
            
            if (this.elements.pause.level) {
                this.elements.pause.level.textContent = 
                    `${session.questionIndex + 1}/${session.questions.length}`;
            }
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
        if (!this.game) return;
        
        const settings = this.game.settings;
        
        if (this.elements.settings.sound) {
            this.elements.settings.sound.checked = settings.sound !== false;
        }
        
        if (this.elements.settings.music) {
            this.elements.settings.music.checked = settings.music !== false;
        }
        
        if (this.elements.settings.hints) {
            this.elements.settings.hints.checked = settings.hints !== false;
        }
        
        if (this.elements.settings.timer) {
            this.elements.settings.timer.value = settings.timer || 60;
        }
        
        if (this.elements.settings.grid) {
            this.elements.settings.grid.value = settings.gridStyle || 'standard';
        }
    }

    /**
     * Save settings from UI
     */
    saveSettings() {
        if (!this.game) return;
        
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
        if (!session) return;
        
        const summary = session.getSummary();
        
        // Title
        if (this.elements.results.title) {
            this.elements.results.title.textContent = 
                isGameOver ? '💀 Game Over' : '🎉 Level Complete!';
        }
        
        // Stars
        if (this.elements.results.stars) {
            let stars = '';
            for (let i = 0; i < 3; i++) {
                stars += i < summary.stars ? '⭐' : '☆';
            }
            this.elements.results.stars.textContent = stars;
        }
        
        // Stats with animation
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
        
        // Topic performance
        this.renderTopicBars(summary.topicPerformance);
        
        // Next level button
        if (this.elements.results.nextLevelBtn) {
            const canProgress = summary.completed && summary.stars >= 2 && !isGameOver;
            this.elements.results.nextLevelBtn.style.display = canProgress ? 'block' : 'none';
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
        
        if (!topicPerformance || Object.keys(topicPerformance).length === 0) {
            container.innerHTML = '<p style="color: #888;">No data available</p>';
            return;
        }
        
        Object.entries(topicPerformance).forEach(([topic, data]) => {
            const percent = data.total > 0 
                ? Math.round((data.correct / data.total) * 100) 
                : 0;
            
            const topicName = CATEGORY_NAMES[topic] || topic.replace(/_/g, ' ');
            
            const bar = document.createElement('div');
            bar.className = 'topic-bar';
            bar.innerHTML = `
                <span class="topic-name">${topicName}</span>
                <div class="topic-progress">
                    <div class="topic-fill" style="width: 0%; background: linear-gradient(90deg, #6C63FF, ${percent >= 70 ? '#4ECDC4' : '#FF6B6B'});"></div>
                </div>
                <span class="topic-percent" style="color: ${percent >= 70 ? '#4ECDC4' : '#FF6B6B'}">${percent}%</span>
            `;
            
            container.appendChild(bar);
            
            // Animate fill
            setTimeout(() => {
                const fill = bar.querySelector('.topic-fill');
                if (fill) fill.style.width = `${percent}%`;
            }, 100);
        });
    }

    /**
     * Handle next level button
     */
    handleNextLevel() {
        if (!this.game || !this.game.session) return;
        
        const currentLevel = this.game.session.difficultyId;
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = levels.indexOf(currentLevel);
        
        if (currentIndex < levels.length - 1) {
            this.game.startGame(levels[currentIndex + 1]);
        } else {
            this.showToast('🎉 Congratulations! You completed all levels!', 'success');
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
        if (!panel) return;
        
        this.formulaPanelOpen = !this.formulaPanelOpen;
        panel.classList.toggle('open', this.formulaPanelOpen);
    }

    // =====================================================
    // GRAPH TOOLS
    // =====================================================

    /**
     * Select a graph tool
     * @param {string} tool 
     */
    selectTool(tool) {
        if (this.elements.tools.toolBtns) {
            this.elements.tools.toolBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tool === tool);
            });
        }
        
        if (this.elements.tools.lineInput) {
            this.elements.tools.lineInput.style.display = tool === 'line' ? 'block' : 'none';
        }
        
        if (this.game?.session) {
            this.game.session.currentTool = tool;
        }
        
        if (tool === 'clear' && this.game?.canvas) {
            this.game.canvas.clearUserDrawings();
            this.game.renderCurrentState();
        }
    }

    /**
     * Handle draw line button
     */
    handleDrawLine() {
        const equation = this.elements.tools.lineEquation?.value;
        
        if (!equation) {
            this.showToast('Please enter a line equation', 'warning');
            return;
        }
        
        try {
            const parsed = QuadraticUtils.parseLineEquation(equation);
            
            if (!parsed) {
                this.showToast('Invalid format. Use: y = mx + c', 'error');
                return;
            }
            
            const line = new Line(parsed.m, parsed.c);
            
            if (this.game?.canvas) {
                this.game.canvas.addUserLine(line);
                this.game.renderCurrentState();
                this.showToast('Line drawn!', 'success');
            }
        } catch (e) {
            this.showToast('Error drawing line', 'error');
        }
    }

    // =====================================================
    // TOAST NOTIFICATIONS
    // =====================================================

    /**
     * Show a toast notification
     * @param {string} message 
     * @param {string} type 
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
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const colors = {
            success: '#00d26a',
            error: '#ff4757',
            warning: '#ffa502',
            info: '#3498db'
        };
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: ${colors[type]};
            color: white;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 1.2em;">${icons[type]}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
                this.processToastQueue();
            }, 300);
        }, 3000);
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
        notification.style.cssText = `
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
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: 'Poppins', sans-serif;
            color: white;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 2.5rem;">${achievement.icon}</span>
            <div>
                <div style="font-size: 0.8rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Achievement Unlocked!</div>
                <div style="font-size: 1.2rem; font-weight: bold;">${achievement.name}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
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
        if (!element) return;
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            
            const current = Math.round(start + (end - start) * eased);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Add dynamic CSS styles
     */
    addDynamicStyles() {
        if (document.getElementById('ui-dynamic-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ui-dynamic-styles';
        style.textContent = `
            /* Score popup */
            .score-popup {
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                animation: scoreRise 1.5s ease-out forwards;
                pointer-events: none;
                z-index: 100;
            }
            
            .score-popup .score-base {
                font-size: 1.2rem;
                font-weight: bold;
                color: #FFE66D;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            
            .score-popup .score-bonus {
                font-size: 0.85rem;
                padding: 2px 8px;
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
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
            }
            
            /* Difficulty buttons */
            .high-score {
                display: block;
                font-size: 0.7rem;
                color: #FFE66D;
                margin-top: 4px;
            }
            
            .difficulty-btn.locked {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .difficulty-btn.locked::after {
                content: '🔒';
                position: absolute;
                top: 5px;
                right: 5px;
                font-size: 1rem;
            }
            
            .difficulty-btn.selected {
                border-color: #6C63FF;
                background: rgba(108, 99, 255, 0.3);
                box-shadow: 0 0 20px rgba(108, 99, 255, 0.4);
            }
            
            /* Streak animation */
            .streak-display.hot {
                animation: hotStreak 0.5s ease infinite;
            }
            
            @keyframes hotStreak {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* Lives danger animation */
            .lives-display.danger {
                animation: dangerPulse 0.5s ease infinite;
            }
            
            @keyframes dangerPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* Choice buttons */
            .choice-btn.selected {
                background: rgba(108, 99, 255, 0.4);
                border-color: #6C63FF;
            }
            
            .choice-btn.correct {
                background: rgba(0, 210, 106, 0.4) !important;
                border-color: #00d26a !important;
            }
            
            .choice-btn.incorrect {
                background: rgba(255, 71, 87, 0.4) !important;
                border-color: #ff4757 !important;
            }
            
            /* Input suggestions */
            .input-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #16213e;
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 0 0 8px 8px;
                z-index: 100;
                display: none;
            }
            
            .suggestion-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .suggestion-item:hover {
                background: rgba(108, 99, 255, 0.3);
            }
            
            /* Hit feedback */
            .hit-feedback {
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .hit-feedback.show {
                display: flex;
                animation: hitPop 0.5s ease;
            }
            
            .hit-text {
                font-size: 2rem;
                font-weight: 700;
                text-shadow: 0 0 20px currentColor;
            }
            
            @keyframes hitPop {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            /* Feedback area */
            .feedback-area {
                display: none;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
            
            .feedback-area.show {
                display: block;
                animation: slideUp 0.3s ease;
            }
            
            .feedback-area.correct {
                background: rgba(0, 210, 106, 0.2);
                border: 1px solid #00d26a;
            }
            
            .feedback-area.incorrect {
                background: rgba(255, 71, 87, 0.2);
                border: 1px solid #ff4757;
            }
            
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Topic bars */
            .topic-bar {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .topic-name {
                flex: 0 0 120px;
                font-size: 0.85rem;
                color: #b8b8d1;
                text-transform: capitalize;
            }
            
            .topic-progress {
                flex: 1;
                height: 20px;
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
                overflow: hidden;
            }
            
            .topic-fill {
                height: 100%;
                border-radius: 10px;
                transition: width 1s ease;
            }
            
            .topic-percent {
                flex: 0 0 50px;
                font-size: 0.9rem;
                font-weight: 600;
                text-align: right;
            }
            
            /* Formula panel */
            .slide-panel {
                position: fixed;
                left: 0;
                top: 50%;
                transform: translateY(-50%) translateX(-100%);
                background: rgba(22, 33, 62, 0.98);
                border-radius: 0 12px 12px 0;
                transition: transform 0.3s ease;
                z-index: 500;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 4px 0 20px rgba(0,0,0,0.3);
            }
            
            .slide-panel.open {
                transform: translateY(-50%) translateX(0);
            }
            
            .panel-toggle {
                position: absolute;
                right: -100px;
                top: 50%;
                transform: translateY(-50%);
                background: #6C63FF;
                border: none;
                padding: 10px 15px;
                border-radius: 0 8px 8px 0;
                color: white;
                cursor: pointer;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                white-space: nowrap;
            }
            
            .panel-content {
                padding: 20px;
                width: 260px;
            }
            
            /* Timer warning states */
            .timer-display.warning .timer-value {
                color: #ffa502;
            }
            
            .timer-display.danger .timer-value {
                color: #ff4757;
                animation: timerPulse 0.5s ease infinite;
            }
            
            @keyframes timerPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Dynamic styles added');
    }
}

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI };
}