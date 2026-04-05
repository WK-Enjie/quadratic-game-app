/* =====================================================
   QUADRATIC CATAPULT QUEST - GAME ENGINE
   =====================================================
   Main game logic, state management, and flow control
   ===================================================== */

/**
 * GameState Enum
 * Represents possible game states
 */
const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    TUTORIAL: 'tutorial',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ANSWERING: 'answering',
    ANIMATING: 'animating',
    RESULTS: 'results',
    GAME_OVER: 'game_over'
};

/**
 * Game Class
 * Main game controller
 */
class Game {
    constructor() {
        // Core components
        this.canvas = null;
        this.ui = null;
        
        // Game state
        this.state = GameState.LOADING;
        this.previousState = null;
        
        // Current game session
        this.session = null;
        
        // Settings
        this.settings = this.loadSettings();
        
        // Statistics
        this.statistics = this.loadStatistics();
        
        // Event callbacks
        this.callbacks = {};
        
        // Timers
        this.gameTimer = null;
        this.questionTimer = null;
        
        // Audio (placeholder for sound system)
        this.audio = {
            enabled: this.settings.sound,
            play: (sound) => {
                // Sound implementation would go here
                if (this.audio.enabled && CONFIG.debug.enabled) {
                    console.log(`🔊 Playing sound: ${sound}`);
                }
            }
        };
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    /**
     * Initialize the game
     * @param {CanvasRenderer} canvasRenderer - The canvas renderer
     * @param {UI} uiController - The UI controller
     */
    init(canvasRenderer, uiController) {
        this.canvas = canvasRenderer;
        this.ui = uiController;
        
        // Bind UI events
        this.bindEvents();
        
        // Load progress
        this.loadProgress();
        
        // Transition to menu
        this.setState(GameState.MENU);
        
        console.log('🎮 Game initialized');
    }

    /**
     * Bind all game events
     */
    bindEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Canvas events
        if (this.canvas && this.canvas.canvas) {
            this.canvas.canvas.addEventListener('canvasClick', (e) => {
                this.handleCanvasClick(e.detail);
            });
        }
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} e 
     */
    handleKeyPress(e) {
        const shortcuts = CONFIG.ui.shortcuts;
        
        switch (e.key) {
            case shortcuts.pause:
                if (this.state === GameState.PLAYING || this.state === GameState.ANSWERING) {
                    this.pause();
                } else if (this.state === GameState.PAUSED) {
                    this.resume();
                }
                break;
            
            case shortcuts.launch:
                if (this.state === GameState.ANSWERING) {
                    this.submitAnswer();
                }
                break;
            
            case shortcuts.hint:
                if (this.state === GameState.ANSWERING && this.settings.hints) {
                    this.showHint();
                }
                break;
            
            case shortcuts.formulaPanel:
                this.ui.toggleFormulaPanel();
                break;
        }
    }

    /**
     * Handle canvas click
     * @param {Object} detail - Click details with canvas and math coordinates
     */
    handleCanvasClick(detail) {
        if (this.state !== GameState.PLAYING && this.state !== GameState.ANSWERING) {
            return;
        }
        
        // Check if using graph tools
        if (this.session && this.session.currentTool) {
            switch (this.session.currentTool) {
                case 'point':
                    this.canvas.addUserPoint(detail.math.x, detail.math.y);
                    break;
                case 'line':
                    // Handle line drawing start/end
                    break;
            }
        }
    }

    // =====================================================
    // STATE MANAGEMENT
    // =====================================================

    /**
     * Set the game state
     * @param {string} newState - New state from GameState enum
     */
    setState(newState) {
        this.previousState = this.state;
        this.state = newState;
        
        // Emit state change event
        this.emit('stateChange', { from: this.previousState, to: newState });
        
        // Update UI for new state
        if (this.ui) {
            this.ui.onStateChange(newState, this.previousState);
        }
        
        if (CONFIG.debug.enabled) {
            console.log(`📍 State: ${this.previousState} → ${newState}`);
        }
    }

    /**
     * Register event callback
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => callback(data));
        }
    }

    // =====================================================
    // GAME FLOW
    // =====================================================

    /**
     * Start a new game
     * @param {string} difficultyId - Selected difficulty level
     */
    startGame(difficultyId) {
        const difficultyConfig = CONFIG.difficulty[difficultyId];
        
        if (!difficultyConfig) {
            console.error(`Unknown difficulty: ${difficultyId}`);
            return;
        }
        
        // Create new session
        this.session = new GameSession(difficultyId, difficultyConfig);
        
        // Generate questions
        this.session.questions = QuestionGenerator.generateQuestionSet(
            difficultyId,
            difficultyConfig.questionsPerLevel
        );
        
        // Play start sound
        this.audio.play('launch');
        
        // Update UI
        this.ui.updateGameHeader(this.session);
        this.ui.showScreen('game-screen');
        
        // Set state
        this.setState(GameState.PLAYING);
        
        // Start the first question
        this.nextQuestion();
        
        console.log(`🚀 Game started: ${difficultyId}, ${this.session.questions.length} questions`);
    }

    /**
     * Start practice mode
     * @param {string} difficultyId - Difficulty level
     * @param {string} topic - Optional specific topic to practice
     */
    startPractice(difficultyId, topic = null) {
        const difficultyConfig = CONFIG.difficulty[difficultyId];
        
        // Create practice session (no time limit, unlimited lives)
        this.session = new GameSession(difficultyId, difficultyConfig);
        this.session.isPractice = true;
        this.session.lives = Infinity;
        
        // Generate questions (more if practicing)
        const questionCount = topic ? 10 : difficultyConfig.questionsPerLevel;
        
        if (topic) {
            // Generate questions for specific topic
            this.session.questions = [];
            for (let i = 0; i < questionCount; i++) {
                const quadratic = QuadraticGenerator.generateForQuestionType(topic, difficultyId);
                const question = QuestionGenerator.generateByType(topic, quadratic, difficultyId);
                this.session.questions.push(question);
            }
        } else {
            this.session.questions = QuestionGenerator.generateQuestionSet(
                difficultyId,
                questionCount
            );
        }
        
        // Update UI
        this.ui.updateGameHeader(this.session);
        this.ui.showScreen('game-screen');
        
        // Set state
        this.setState(GameState.PLAYING);
        
        // Start the first question
        this.nextQuestion();
        
        console.log(`📚 Practice mode started: ${difficultyId}`);
    }

    /**
     * Load the next question
     */
    nextQuestion() {
        if (!this.session || this.session.questionIndex >= this.session.questions.length) {
            this.endGame();
            return;
        }
        
        // Get current question
        const question = this.session.getCurrentQuestion();
        
        // Update session
        this.session.questionStartTime = Date.now();
        
        // Clear previous drawings
        this.canvas.clearUserDrawings();
        this.canvas.clearTrail();
        this.canvas.clearParticles();
        
        // Set appropriate view for this quadratic
        this.canvas.fitToQuadratic(question.quadratic);
        
        // Animate curve drawing
        this.setState(GameState.ANIMATING);
        
        this.canvas.animateCurve(question.quadratic, () => {
            // Animation complete, allow answering
            this.setState(GameState.ANSWERING);
            
            // Start question timer if applicable
            if (this.session.config.timePerQuestion > 0) {
                this.startQuestionTimer();
            }
        });
        
        // Update UI with question
        this.ui.displayQuestion(question);
        this.ui.updateProgress(this.session);
        
        // Show target
        this.renderCurrentState();
    }

    /**
     * Submit the current answer
     * @param {string} answer - Optional answer override, otherwise read from input
     */
    submitAnswer(answer = null) {
        if (this.state !== GameState.ANSWERING) {
            return;
        }
        
        // Stop timer
        this.stopQuestionTimer();
        
        // Get answer from UI if not provided
        const userAnswer = answer || this.ui.getAnswer();
        
        if (!userAnswer || userAnswer.trim() === '') {
            this.ui.showFeedback({
                isCorrect: false,
                feedback: 'Please enter an answer before launching!'
            }, false);
            return;
        }
        
        // Get current question
        const question = this.session.getCurrentQuestion();
        
        // Record time taken
        question.timeTaken = Date.now() - this.session.questionStartTime;
        
        // Validate answer
        const result = question.validate(userAnswer);
        
        // Update session statistics
        this.session.questionsAnswered++;
        
        if (result.isCorrect) {
            this.handleCorrectAnswer(question, result);
        } else {
            this.handleIncorrectAnswer(question, result);
        }
    }

    /**
     * Handle correct answer
     * @param {Question} question 
     * @param {Object} result - Validation result
     */
    handleCorrectAnswer(question, result) {
        // Update statistics
        this.session.correctAnswers++;
        this.session.streak++;
        this.session.bestStreak = Math.max(this.session.bestStreak, this.session.streak);
        
        // Calculate score
        const scoreData = this.calculateScore(question, true);
        this.session.score += scoreData.total;
        
        // Track topic performance
        this.session.trackTopicPerformance(question.category, true);
        
        // Play sound
        this.audio.play('correct');
        
        // Update UI
        this.ui.showFeedback(result, true, scoreData);
        this.ui.updateScore(this.session.score, scoreData);
        this.ui.updateStreak(this.session.streak);
        
        // Animate projectile hit
        this.setState(GameState.ANIMATING);
        
        this.canvas.animateProjectile(
            question.quadratic,
            question.target,
            true,
            () => {
                // Show hit effect
                this.ui.showHitEffect(true);
                
                // Delay before next question
                setTimeout(() => {
                    this.session.questionIndex++;
                    this.nextQuestion();
                }, 1500);
            }
        );
        
        // Check achievements
        this.checkAchievements('correct', { question, scoreData });
    }

    /**
     * Handle incorrect answer
     * @param {Question} question 
     * @param {Object} result - Validation result
     */
    handleIncorrectAnswer(question, result) {
        // Reset streak
        this.session.streak = 0;
        
        // Lose a life
        if (!this.session.isPractice) {
            this.session.lives--;
        }
        
        // Track topic performance
        this.session.trackTopicPerformance(question.category, false);
        
        // Play sound
        this.audio.play('incorrect');
        
        // Update UI
        this.ui.showFeedback(result, false);
        this.ui.updateLives(this.session.lives);
        this.ui.updateStreak(0);
        
        // Shake effect
        this.canvas.shakeEffect();
        
        // Animate projectile miss
        this.setState(GameState.ANIMATING);
        
        // Create a "miss" trajectory
        const missQuadratic = Quadratic.fromVertexForm(
            question.quadratic.a,
            question.target.x + (Math.random() - 0.5) * 4,
            question.target.y + (Math.random() - 0.5) * 4
        );
        
        this.canvas.animateProjectile(
            missQuadratic,
            { x: question.target.x + 3, y: question.target.y - 2 },
            false,
            () => {
                // Show miss effect
                this.ui.showHitEffect(false);
                
                // Check for game over
                if (this.session.lives <= 0 && !this.session.isPractice) {
                    setTimeout(() => this.gameOver(), 1000);
                } else {
                    // Move to next question after delay
                    setTimeout(() => {
                        this.session.questionIndex++;
                        this.nextQuestion();
                    }, 2000);
                }
            }
        );
    }

    /**
     * Skip the current question
     */
    skipQuestion() {
        if (this.state !== GameState.ANSWERING) {
            return;
        }
        
        // Stop timer
        this.stopQuestionTimer();
        
        // Apply skip penalty
        const penalty = this.session.config.scoring.skipPenalty;
        this.session.score = Math.max(0, this.session.score - penalty);
        
        // Reset streak
        this.session.streak = 0;
        
        // Mark question as skipped
        const question = this.session.getCurrentQuestion();
        question.answered = true;
        question.isCorrect = false;
        question.userAnswer = '[SKIPPED]';
        
        // Track
        this.session.questionsAnswered++;
        this.session.trackTopicPerformance(question.category, false);
        
        // Update UI
        this.ui.showFeedback({
            isCorrect: false,
            feedback: `Skipped! The correct answer was: ${this.formatCorrectAnswer(question)}`,
            explanation: question.explanation
        }, false);
        
        this.ui.updateScore(this.session.score, { penalty: penalty });
        this.ui.updateStreak(0);
        
        // Play sound
        this.audio.play('miss');
        
        // Move to next question after delay
        setTimeout(() => {
            this.session.questionIndex++;
            this.nextQuestion();
        }, 2500);
    }

    /**
     * Format correct answer for display
     * @param {Question} question 
     * @returns {string}
     */
    formatCorrectAnswer(question) {
        const answer = question.correctAnswer;
        
        if (typeof answer === 'number') {
            return QuadraticUtils.formatNumber(answer);
        } else if (answer && typeof answer === 'object') {
            if (answer.x !== undefined && answer.y !== undefined) {
                return QuadraticUtils.formatCoordinate(answer);
            } else if (Array.isArray(answer)) {
                return answer.map(a => {
                    if (typeof a === 'number') return QuadraticUtils.formatNumber(a);
                    if (a.x !== undefined) return QuadraticUtils.formatCoordinate(a);
                    return String(a);
                }).join(', ');
            }
        }
        
        return String(answer);
    }

    /**
     * Show hint for current question
     */
    showHint() {
        if (this.state !== GameState.ANSWERING) {
            return;
        }
        
        const question = this.session.getCurrentQuestion();
        const hint = question.getNextHint();
        
        if (!hint) {
            this.ui.showToast('No more hints available!', 'warning');
            return;
        }
        
        // Apply hint penalty
        const penalty = this.session.config.scoring.hintPenalty;
        this.session.hintsUsed++;
        
        // Show hint
        this.ui.showHint(hint);
        this.audio.play('hint');
        
        console.log(`💡 Hint used: ${hint.text}`);
    }

    /**
     * Pause the game
     */
    pause() {
        if (this.state !== GameState.PLAYING && this.state !== GameState.ANSWERING) {
            return;
        }
        
        // Stop timer
        this.stopQuestionTimer();
        
        // Save time remaining
        if (this.session) {
            this.session.pausedTimeRemaining = this.session.timeRemaining;
        }
        
        this.setState(GameState.PAUSED);
        this.ui.showPauseMenu(this.session);
        
        console.log('⏸️ Game paused');
    }

    /**
     * Resume the game
     */
    resume() {
        if (this.state !== GameState.PAUSED) {
            return;
        }
        
        this.ui.hidePauseMenu();
        this.setState(GameState.ANSWERING);
        
        // Restart timer if applicable
        if (this.session && this.session.config.timePerQuestion > 0) {
            this.startQuestionTimer(this.session.pausedTimeRemaining);
        }
        
        console.log('▶️ Game resumed');
    }

    /**
     * End the game (completed all questions)
     */
    endGame() {
        this.stopQuestionTimer();
        
        // Calculate final statistics
        this.session.endTime = Date.now();
        this.session.calculateFinalStats();
        
        // Update global statistics
        this.updateStatistics(this.session);
        
        // Save progress
        this.saveProgress();
        
        // Play victory sound
        this.audio.play('levelUp');
        
        // Show results
        this.setState(GameState.RESULTS);
        this.ui.showResults(this.session);
        
        console.log(`🏁 Game ended - Score: ${this.session.score}`);
    }

    /**
     * Game over (lost all lives)
     */
    gameOver() {
        this.stopQuestionTimer();
        
        // Calculate statistics
        this.session.endTime = Date.now();
        this.session.calculateFinalStats();
        this.session.completed = false;
        
        // Update global statistics
        this.updateStatistics(this.session);
        
        // Save progress
        this.saveProgress();
        
        // Play game over sound
        this.audio.play('miss');
        
        // Show results
        this.setState(GameState.GAME_OVER);
        this.ui.showResults(this.session, true);
        
        console.log(`💀 Game over - Score: ${this.session.score}`);
    }

    /**
     * Restart the current game
     */
    restart() {
        if (!this.session) {
            return;
        }
        
        this.startGame(this.session.difficultyId);
    }

    /**
     * Return to main menu
     */
    returnToMenu() {
        this.stopQuestionTimer();
        this.session = null;
        this.setState(GameState.MENU);
        this.ui.showScreen('main-menu');
        
        console.log('🏠 Returned to menu');
    }

    // =====================================================
    // TIMER MANAGEMENT
    // =====================================================

    /**
     * Start the question timer
     * @param {number} startTime - Optional starting time in seconds
     */
    startQuestionTimer(startTime = null) {
        const timeLimit = startTime || this.session.config.timePerQuestion;
        
        if (timeLimit <= 0) {
            return;
        }
        
        this.session.timeRemaining = timeLimit;
        
        this.questionTimer = setInterval(() => {
            this.session.timeRemaining--;
            
            // Update UI
            this.ui.updateTimer(this.session.timeRemaining, timeLimit);
            
            // Warning states
            if (this.session.timeRemaining <= 10) {
                this.ui.setTimerWarning('danger');
            } else if (this.session.timeRemaining <= 20) {
                this.ui.setTimerWarning('warning');
            }
            
            // Time's up
            if (this.session.timeRemaining <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    /**
     * Stop the question timer
     */
    stopQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    /**
     * Handle time running out
     */
    handleTimeUp() {
        this.stopQuestionTimer();
        
        // Auto-submit empty answer (wrong)
        const question = this.session.getCurrentQuestion();
        question.timeTaken = this.session.config.timePerQuestion * 1000;
        
        this.ui.showFeedback({
            isCorrect: false,
            feedback: `Time's up! The correct answer was: ${this.formatCorrectAnswer(question)}`,
            explanation: question.explanation
        }, false);
        
        // Handle as incorrect
        this.session.streak = 0;
        this.session.lives--;
        this.session.questionsAnswered++;
        this.session.trackTopicPerformance(question.category, false);
        
        this.ui.updateLives(this.session.lives);
        this.ui.updateStreak(0);
        
        // Play sound
        this.audio.play('miss');
        
        // Check for game over
        if (this.session.lives <= 0) {
            setTimeout(() => this.gameOver(), 1500);
        } else {
            setTimeout(() => {
                this.session.questionIndex++;
                this.nextQuestion();
            }, 2000);
        }
    }

    // =====================================================
    // SCORING
    // =====================================================

    /**
     * Calculate score for a question
     * @param {Question} question 
     * @param {boolean} correct 
     * @returns {Object} Score breakdown
     */
    calculateScore(question, correct) {
        if (!correct) {
            return { base: 0, time: 0, streak: 0, total: 0 };
        }
        
        const scoring = this.session.config.scoring;
        
        // Base score
        let base = scoring.correct;
        
        // Time bonus
        let timeBonus = 0;
        if (question.timeTaken && scoring.timeBonus > 0) {
            const seconds = question.timeTaken / 1000;
            
            for (const threshold of CONFIG.scoring.timeBonusThresholds) {
                if (seconds < threshold.time) {
                    timeBonus = Math.floor(base * (threshold.multiplier - 1));
                    break;
                }
            }
        }
        
        // Streak bonus
        let streakBonus = 0;
        if (this.session.streak > 1) {
            const multiplier = Math.pow(scoring.streakMultiplier, this.session.streak - 1);
            streakBonus = Math.floor(base * (multiplier - 1));
            
            // Cap streak bonus
            streakBonus = Math.min(streakBonus, base * 2);
        }
        
        // Hint penalty
        const hintPenalty = question.hintsUsed * scoring.hintPenalty;
        
        // Calculate total
        const total = Math.max(0, base + timeBonus + streakBonus - hintPenalty);
        
        return {
            base,
            time: timeBonus,
            streak: streakBonus,
            hintPenalty,
            total
        };
    }

    // =====================================================
    // RENDERING
    // =====================================================

    /**
     * Render the current game state
     */
    renderCurrentState() {
        if (!this.session) {
            return;
        }
        
        const question = this.session.getCurrentQuestion();
        
        const renderState = {
            quadratic: question.quadratic,
            curveProgress: 1,
            showKeyPoints: this.session.config.features.showGrid,
            target: question.target,
            showCatapult: true,
            line: question.line,
            highlightedPoints: this.getHighlightedPoints(question.type)
        };
        
        this.canvas.render(renderState);
    }

    /**
     * Get which points to highlight based on question type
     * @param {string} questionType 
     * @returns {Array}
     */
    getHighlightedPoints(questionType) {
        switch (questionType) {
            case 'turning_point':
            case 'turning_point_basic':
            case 'max_min_value':
                return ['vertex'];
            
            case 'axis_symmetry':
            case 'axis_symmetry_basic':
                return ['symmetry', 'vertex'];
            
            case 'x_intercepts_factor':
            case 'x_intercepts_quadratic_formula':
                return ['xIntercepts'];
            
            case 'y_intercept':
                return ['yIntercept'];
            
            default:
                return [];
        }
    }

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================

    /**
     * Check for achievements
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    checkAchievements(event, data) {
        const achievements = this.statistics.achievements || {};
        const newAchievements = [];
        
        switch (event) {
            case 'correct':
                // First launch
                if (!achievements.first_launch) {
                    achievements.first_launch = true;
                    newAchievements.push(CONFIG.achievements.first_launch);
                }
                
                // Perfect aim (10 streak)
                if (this.session.streak >= 10 && !achievements.perfect_aim) {
                    achievements.perfect_aim = true;
                    newAchievements.push(CONFIG.achievements.perfect_aim);
                }
                
                // Speed demon (< 5 seconds)
                if (data.question.timeTaken < 5000 && !achievements.speed_demon) {
                    achievements.speed_demon = true;
                    newAchievements.push(CONFIG.achievements.speed_demon);
                }
                break;
            
            case 'levelComplete':
                // Perfectionist (100% accuracy)
                if (this.session.accuracy >= 100 && !achievements.perfectionist) {
                    achievements.perfectionist = true;
                    newAchievements.push(CONFIG.achievements.perfectionist);
                }
                
                // No hints needed
                if (this.session.hintsUsed === 0 && !achievements.no_hints) {
                    achievements.no_hints = true;
                    newAchievements.push(CONFIG.achievements.no_hints);
                }
                break;
        }
        
        // Show new achievements
        newAchievements.forEach(achievement => {
            this.ui.showAchievement(achievement);
            this.audio.play('levelUp');
        });
        
        // Save
        this.statistics.achievements = achievements;
        this.saveStatistics();
    }

    // =====================================================
    // PERSISTENCE
    // =====================================================

    /**
     * Load settings from storage
     * @returns {Object}
     */
    loadSettings() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.settings;
        const stored = localStorage.getItem(key);
        
        const defaults = {
            sound: true,
            music: true,
            hints: true,
            timer: 60,
            gridStyle: 'standard'
        };
        
        if (stored) {
            try {
                return { ...defaults, ...JSON.parse(stored) };
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }
        
        return defaults;
    }

    /**
     * Save settings to storage
     */
    saveSettings() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.settings;
        localStorage.setItem(key, JSON.stringify(this.settings));
    }

    /**
     * Update a setting
     * @param {string} name - Setting name
     * @param {*} value - Setting value
     */
    updateSetting(name, value) {
        this.settings[name] = value;
        this.saveSettings();
        
        // Apply setting
        switch (name) {
            case 'sound':
                this.audio.enabled = value;
                break;
            case 'gridStyle':
                if (this.canvas) {
                    this.canvas.setGridStyle(value);
                }
                break;
        }
    }

    /**
     * Load statistics from storage
     * @returns {Object}
     */
    loadStatistics() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.stats;
        const stored = localStorage.getItem(key);
        
        const defaults = {
            totalGames: 0,
            totalScore: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            bestStreak: 0,
            timePlayedMs: 0,
            levelStats: {},
            topicStats: {},
            achievements: {}
        };
        
        if (stored) {
            try {
                return { ...defaults, ...JSON.parse(stored) };
            } catch (e) {
                console.warn('Failed to load statistics:', e);
            }
        }
        
        return defaults;
    }

    /**
     * Save statistics to storage
     */
    saveStatistics() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.stats;
        localStorage.setItem(key, JSON.stringify(this.statistics));
    }

    /**
     * Update statistics with session data
     * @param {GameSession} session 
     */
    updateStatistics(session) {
        this.statistics.totalGames++;
        this.statistics.totalScore += session.score;
        this.statistics.totalQuestions += session.questionsAnswered;
        this.statistics.totalCorrect += session.correctAnswers;
        this.statistics.bestStreak = Math.max(this.statistics.bestStreak, session.bestStreak);
        this.statistics.timePlayedMs += session.endTime - session.startTime;
        
        // Level stats
        if (!this.statistics.levelStats[session.difficultyId]) {
            this.statistics.levelStats[session.difficultyId] = {
                played: 0,
                completed: 0,
                highScore: 0,
                bestAccuracy: 0
            };
        }
        
        const levelStats = this.statistics.levelStats[session.difficultyId];
        levelStats.played++;
        if (session.completed) levelStats.completed++;
        levelStats.highScore = Math.max(levelStats.highScore, session.score);
        levelStats.bestAccuracy = Math.max(levelStats.bestAccuracy, session.accuracy);
        
        // Topic stats
        Object.entries(session.topicPerformance).forEach(([topic, data]) => {
            if (!this.statistics.topicStats[topic]) {
                this.statistics.topicStats[topic] = { correct: 0, total: 0 };
            }
            this.statistics.topicStats[topic].correct += data.correct;
            this.statistics.topicStats[topic].total += data.total;
        });
        
        this.saveStatistics();
    }

    /**
     * Load progress from storage
     */
    loadProgress() {
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.progress;
        const stored = localStorage.getItem(key);
        
        if (stored) {
            try {
                this.progress = JSON.parse(stored);
            } catch (e) {
                this.progress = { unlockedLevels: ['beginner'] };
            }
        } else {
            this.progress = { unlockedLevels: ['beginner'] };
        }
    }

    /**
     * Save progress to storage
     */
    saveProgress() {
        // Unlock next level if completed with good score
        if (this.session && this.session.completed && this.session.stars >= 2) {
            const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
            const currentIndex = levels.indexOf(this.session.difficultyId);
            
            if (currentIndex < levels.length - 1) {
                const nextLevel = levels[currentIndex + 1];
                if (!this.progress.unlockedLevels.includes(nextLevel)) {
                    this.progress.unlockedLevels.push(nextLevel);
                }
            }
        }
        
        const key = CONFIG.storage.prefix + CONFIG.storage.keys.progress;
        localStorage.setItem(key, JSON.stringify(this.progress));
    }

    /**
     * Check if a level is unlocked
     * @param {string} levelId 
     * @returns {boolean}
     */
    isLevelUnlocked(levelId) {
        // Debug mode unlocks all
        if (CONFIG.debug.unlockAll) {
            return true;
        }
        
        return this.progress.unlockedLevels.includes(levelId);
    }

    /**
     * Get high score for a level
     * @param {string} levelId 
     * @returns {number}
     */
    getHighScore(levelId) {
        if (this.statistics.levelStats[levelId]) {
            return this.statistics.levelStats[levelId].highScore;
        }
        return 0;
    }
}

/**
 * GameSession Class
 * Represents a single game session
 */
class GameSession {
    /**
     * Create a new game session
     * @param {string} difficultyId - Difficulty level ID
     * @param {Object} config - Difficulty configuration
     */
    constructor(difficultyId, config) {
        this.difficultyId = difficultyId;
        this.config = config;
        
        // Questions
        this.questions = [];
        this.questionIndex = 0;
        
        // Timing
        this.startTime = Date.now();
        this.endTime = null;
        this.questionStartTime = null;
        this.timeRemaining = config.timePerQuestion;
        this.pausedTimeRemaining = 0;
        
        // Lives and scoring
        this.lives = config.lives;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        
        // Statistics
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.hintsUsed = 0;
        
        // Performance tracking
        this.topicPerformance = {};
        
        // Completion
        this.completed = false;
        this.accuracy = 0;
        this.stars = 0;
        
        // Mode flags
        this.isPractice = false;
        
        // Tools
        this.currentTool = 'select';
    }

    /**
     * Get the current question
     * @returns {Question}
     */
    getCurrentQuestion() {
        return this.questions[this.questionIndex];
    }

    /**
     * Track performance by topic
     * @param {string} topic 
     * @param {boolean} correct 
     */
    trackTopicPerformance(topic, correct) {
        if (!this.topicPerformance[topic]) {
            this.topicPerformance[topic] = { correct: 0, total: 0 };
        }
        
        this.topicPerformance[topic].total++;
        if (correct) {
            this.topicPerformance[topic].correct++;
        }
    }

    /**
     * Calculate final statistics
     */
    calculateFinalStats() {
        // Calculate accuracy
        this.accuracy = this.questionsAnswered > 0 
            ? Math.round((this.correctAnswers / this.questionsAnswered) * 100)
            : 0;
        
        // Determine if completed
        this.completed = this.questionIndex >= this.questions.length;
        
        // Calculate stars based on score and accuracy
        const maxPossibleScore = this.questions.length * this.config.scoring.correct * 2; // Approximate
        const scorePercent = this.score / maxPossibleScore;
        
        if (this.accuracy >= 80 && scorePercent >= CONFIG.scoring.starRating.threeStar) {
            this.stars = 3;
        } else if (this.accuracy >= 60 && scorePercent >= CONFIG.scoring.starRating.twoStar) {
            this.stars = 2;
        } else if (this.accuracy >= 40 && scorePercent >= CONFIG.scoring.starRating.oneStar) {
            this.stars = 1;
        } else {
            this.stars = 0;
        }
        
        // Perfect bonus
        if (this.accuracy === 100 && this.completed) {
            this.score += CONFIG.scoring.perfectBonus;
        }
    }

    /**
     * Get session summary
     * @returns {Object}
     */
    getSummary() {
        return {
            difficulty: this.difficultyId,
            score: this.score,
            accuracy: this.accuracy,
            questionsAnswered: this.questionsAnswered,
            correctAnswers: this.correctAnswers,
            totalQuestions: this.questions.length,
            bestStreak: this.bestStreak,
            hintsUsed: this.hintsUsed,
            timeMs: this.endTime - this.startTime,
            topicPerformance: this.topicPerformance,
            completed: this.completed,
            stars: this.stars,
            isPractice: this.isPractice
        };
    }
}

// =====================================================
// EXPORT
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Game,
        GameSession,
        GameState
    };
}