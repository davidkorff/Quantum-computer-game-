/**
 * Quantum Quest - Main Application
 *
 * Orchestrates all game systems and handles UI interactions.
 */

class QuantumQuest {
    constructor() {
        // Initialize managers
        this.progress = new ProgressManager();
        this.achievements = new AchievementsManager(this.progress);

        // Current state
        this.currentScreen = 'home';
        this.currentEra = null;
        this.currentLesson = null;
        this.lessonStartTime = null;

        // Lab state
        this.circuit = new QuantumCircuit(2);
        this.circuitRenderer = null;
        this.blochSpheres = [];

        // Challenge state
        this.currentChallenge = null;
        this.challengeSimulator = new ChallengeSimulator();

        // Quiz state
        this.quizData = null;
        this.quizIndex = 0;
        this.quizScore = 0;

        // Bind methods
        this.init = this.init.bind(this);
    }

    async init() {
        console.log('Initializing Quantum Quest...');

        // Update streak
        this.progress.updateStreak();
        this.achievements.checkTimeBasedAchievements();

        // Setup event listeners
        this.setupNavigation();
        this.setupHomeScreen();
        this.setupLearnScreen();
        this.setupLabScreen();
        this.setupChallengesScreen();
        this.setupModals();

        // Initial render
        this.updateNavStats();
        this.renderHomeScreen();

        // Hide loading screen
        await this.hideLoadingScreen();

        console.log('Quantum Quest ready!');
    }

    async hideLoadingScreen() {
        return new Promise(resolve => {
            setTimeout(() => {
                const loading = document.getElementById('loading-screen');
                loading.classList.add('fade-out');
                setTimeout(() => {
                    loading.classList.add('hidden');
                    document.getElementById('main-nav').classList.remove('hidden');
                    document.getElementById('home-screen').classList.remove('hidden');
                    resolve();
                }, 500);
            }, 2000);
        });
    }

    // ================================
    // Navigation
    // ================================

    setupNavigation() {
        // Nav buttons
        document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Mobile menu toggle
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });

        // Back buttons
        document.getElementById('back-to-learn')?.addEventListener('click', () => {
            this.showScreen('learn');
        });

        document.getElementById('back-to-era')?.addEventListener('click', () => {
            this.showEraScreen(this.currentEra);
        });

        document.getElementById('back-to-challenges')?.addEventListener('click', () => {
            this.showScreen('challenges');
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

        // Show target screen
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.remove('hidden');
        }

        // Update nav
        document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.screen === screenName);
        });

        // Hide mobile menu
        document.getElementById('mobile-menu')?.classList.add('hidden');

        this.currentScreen = screenName;

        // Screen-specific initialization
        switch (screenName) {
            case 'home':
                this.renderHomeScreen();
                break;
            case 'learn':
                this.renderLearnScreen();
                break;
            case 'lab':
                this.initLab();
                break;
            case 'challenges':
                this.renderChallengesScreen();
                break;
            case 'achievements':
                this.achievements.renderAchievementsScreen();
                break;
        }
    }

    updateNavStats() {
        const stats = this.progress.getStats();
        document.getElementById('nav-xp').textContent = `${stats.xp.toLocaleString()} XP`;
        document.getElementById('nav-level').textContent = `Level ${stats.level}`;
        document.getElementById('nav-achievements').textContent = stats.achievementsEarned;
    }

    // ================================
    // Home Screen
    // ================================

    setupHomeScreen() {
        document.getElementById('start-journey-btn')?.addEventListener('click', () => {
            this.showScreen('learn');
        });

        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.showScreen('learn');
        });

        // Initialize hero Bloch sphere
        const heroCanvas = document.getElementById('bloch-sphere-hero');
        if (heroCanvas) {
            const heroSphere = new BlochSphere(heroCanvas, {
                size: Math.min(400, window.innerWidth * 0.8),
                autoRotate: true,
                animated: true
            });
            // Set to a nice superposition state
            heroSphere.setState(0.7, 0, 0.7);
        }
    }

    renderHomeScreen() {
        const stats = this.progress.getStats();

        // Update progress overview
        document.getElementById('lessons-completed').textContent = stats.lessonsCompleted;
        document.getElementById('challenges-solved').textContent = stats.challengesCompleted;
        document.getElementById('circuits-built').textContent = stats.circuitsBuilt;

        // Update progress circle
        const progressCircle = document.getElementById('overall-progress-circle');
        if (progressCircle) {
            const percent = stats.progressPercent;
            progressCircle.style.background =
                `conic-gradient(var(--accent-primary) ${percent}%, var(--bg-tertiary) ${percent}%)`;
            progressCircle.querySelector('.progress-value').textContent = `${percent}%`;
        }

        // Show/hide continue button
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.classList.toggle('hidden', stats.lessonsCompleted === 0);
        }
    }

    // ================================
    // Learn Screen
    // ================================

    setupLearnScreen() {
        // Event delegation for era cards
        document.getElementById('eras-timeline')?.addEventListener('click', (e) => {
            const card = e.target.closest('.era-card');
            if (card && !card.classList.contains('locked')) {
                const eraId = card.dataset.eraId;
                this.showEraScreen(eraId);
            }
        });
    }

    renderLearnScreen() {
        const container = document.getElementById('eras-timeline');
        if (!container) return;

        container.innerHTML = '';

        for (const era of GameData.eras) {
            const progress = this.progress.getEraProgress(era.id);
            const isUnlocked = this.progress.isEraUnlocked(era.id);
            const isCompleted = this.progress.data.completedEras.includes(era.id);

            const card = document.createElement('div');
            card.className = `era-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.dataset.eraId = era.id;

            card.innerHTML = `
                <span class="era-number">Era ${era.number}</span>
                <h3>${era.icon} ${era.title}</h3>
                <p>${era.description}</p>
                <div class="era-meta">
                    <span class="era-lessons">${era.lessons.length} lessons</span>
                    ${isCompleted ?
                        '<span class="era-status completed">✓ Completed</span>' :
                        isUnlocked ?
                            `<span class="era-progress">${progress.percent}% complete</span>` :
                            '<span class="era-status locked">🔒 Locked</span>'
                    }
                </div>
            `;

            container.appendChild(card);
        }
    }

    showEraScreen(eraId) {
        this.currentEra = eraId;
        const era = GameData.eras.find(e => e.id === eraId);
        if (!era) return;

        // Update header
        document.getElementById('era-number').textContent = `Era ${era.number}`;
        document.getElementById('era-title').textContent = era.title;
        document.getElementById('era-description').textContent = era.description;

        // Update progress bar
        const progress = this.progress.getEraProgress(eraId);
        document.getElementById('era-progress-fill').style.width = `${progress.percent}%`;

        // Render lessons
        const container = document.getElementById('lessons-list');
        container.innerHTML = '';

        let lessonIndex = 0;
        for (const lessonId of era.lessons) {
            const lesson = GameData.lessons[lessonId];
            if (!lesson) continue;

            const isCompleted = this.progress.isLessonComplete(lessonId);
            const isLocked = lessonIndex > 0 &&
                !this.progress.isLessonComplete(era.lessons[lessonIndex - 1]);

            const card = document.createElement('div');
            card.className = `lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
            card.dataset.lessonId = lessonId;

            const icon = lesson.type === 'quiz' ? '📝' :
                         isCompleted ? '✓' : (lessonIndex + 1).toString();

            card.innerHTML = `
                <div class="lesson-icon">${icon}</div>
                <div class="lesson-info">
                    <h4>${lesson.title}</h4>
                    <p>${lesson.type === 'quiz' ? 'Test your knowledge' : `Learn about ${lesson.title.toLowerCase()}`}</p>
                    <div class="lesson-meta">
                        <span>⏱️ ${lesson.duration}</span>
                        <span>⚡ ${lesson.xp} XP</span>
                    </div>
                </div>
                <span class="lesson-arrow">${isLocked ? '🔒' : '→'}</span>
            `;

            card.addEventListener('click', () => {
                if (!isLocked) {
                    this.showLessonScreen(lessonId);
                }
            });

            container.appendChild(card);
            lessonIndex++;
        }

        // Show era screen
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('era-screen').classList.remove('hidden');
    }

    // ================================
    // Lesson Screen
    // ================================

    showLessonScreen(lessonId) {
        this.currentLesson = lessonId;
        this.lessonStartTime = Date.now();
        const lesson = GameData.lessons[lessonId];
        if (!lesson) return;

        // Check if it's a quiz
        if (lesson.type === 'quiz') {
            this.startQuiz(lesson);
            return;
        }

        // Update progress indicator
        const era = GameData.eras.find(e => e.lessons.includes(lessonId));
        if (era) {
            const index = era.lessons.indexOf(lessonId) + 1;
            document.getElementById('lesson-progress-text').textContent =
                `${index} / ${era.lessons.length}`;
            document.getElementById('lesson-progress-fill').style.width =
                `${(index / era.lessons.length) * 100}%`;
        }

        // Render content
        document.getElementById('lesson-content').innerHTML = lesson.content;

        // Setup navigation buttons
        const prevBtn = document.getElementById('prev-lesson-btn');
        const nextBtn = document.getElementById('next-lesson-btn');

        prevBtn.onclick = () => this.navigateLesson(-1);
        nextBtn.onclick = () => this.navigateLesson(1);

        // Update button states
        if (era) {
            const index = era.lessons.indexOf(lessonId);
            prevBtn.disabled = index === 0;
            nextBtn.textContent = index === era.lessons.length - 1 ? 'Complete Era →' : 'Next →';
        }

        // Show screen
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('lesson-screen').classList.remove('hidden');

        // Initialize any interactive demos in the lesson
        this.initLessonDemos();

        // Mark as started (for achievements)
        this.progress.checkTimeAchievements();
    }

    navigateLesson(direction) {
        // Complete current lesson
        if (direction > 0 && this.currentLesson) {
            const result = this.progress.completeLesson(this.currentLesson);
            if (result?.leveledUp) {
                this.showLevelUp(result.newLevel, result.title);
            }
            this.achievements.checkLessonSpeed(this.lessonStartTime);
            this.updateNavStats();
        }

        // Navigate
        const era = GameData.eras.find(e => e.lessons.includes(this.currentLesson));
        if (era) {
            const currentIndex = era.lessons.indexOf(this.currentLesson);
            const newIndex = currentIndex + direction;

            if (newIndex >= 0 && newIndex < era.lessons.length) {
                this.showLessonScreen(era.lessons[newIndex]);
            } else if (newIndex >= era.lessons.length) {
                // Era complete
                this.showEraScreen(this.currentEra);
            }
        }
    }

    initLessonDemos() {
        // Initialize Bloch sphere demo if present
        const blochCanvas = document.getElementById('lesson-bloch-sphere');
        if (blochCanvas) {
            new BlochSphere(blochCanvas, {
                size: 250,
                animated: true
            });
        }
    }

    // ================================
    // Quiz System
    // ================================

    startQuiz(lesson) {
        this.quizData = lesson;
        this.quizIndex = 0;
        this.quizScore = 0;

        document.getElementById('quiz-title').textContent = lesson.title;
        this.renderQuizQuestion();

        document.getElementById('quiz-modal').classList.remove('hidden');
    }

    renderQuizQuestion() {
        const questions = this.quizData.questions;
        if (this.quizIndex >= questions.length) {
            this.finishQuiz();
            return;
        }

        const q = questions[this.quizIndex];

        document.getElementById('quiz-progress').textContent =
            `${this.quizIndex + 1} / ${questions.length}`;

        document.getElementById('quiz-question').textContent = q.question;

        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';

        q.options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = option;
            btn.addEventListener('click', () => this.selectQuizOption(i));
            optionsContainer.appendChild(btn);
        });

        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-next-btn').textContent = 'Check';
        document.getElementById('quiz-next-btn').onclick = () => this.checkQuizAnswer();
    }

    selectQuizOption(index) {
        document.querySelectorAll('.quiz-option').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
    }

    checkQuizAnswer() {
        const q = this.quizData.questions[this.quizIndex];
        const selected = document.querySelector('.quiz-option.selected');
        if (!selected) return;

        const selectedIndex = Array.from(document.querySelectorAll('.quiz-option')).indexOf(selected);
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) this.quizScore++;

        // Show feedback
        document.querySelectorAll('.quiz-option').forEach((btn, i) => {
            btn.classList.add(i === q.correct ? 'correct' : '');
            if (i === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        });

        const feedback = document.getElementById('quiz-feedback');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
            <p>${q.explanation || ''}</p>
        `;
        feedback.classList.remove('hidden');

        document.getElementById('quiz-next-btn').textContent =
            this.quizIndex < this.quizData.questions.length - 1 ? 'Next Question' : 'See Results';
        document.getElementById('quiz-next-btn').onclick = () => {
            this.quizIndex++;
            this.renderQuizQuestion();
        };
    }

    finishQuiz() {
        const total = this.quizData.questions.length;
        const percent = Math.round((this.quizScore / total) * 100);

        // Save score
        this.progress.saveQuizScore(this.quizData.id, this.quizScore, total);

        // Show results
        document.getElementById('quiz-question').innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 3rem; margin-bottom: 1rem;">
                    ${percent >= 80 ? '🎉' : percent >= 60 ? '👍' : '📚'}
                </h2>
                <h3>Quiz Complete!</h3>
                <p style="font-size: 1.5rem; color: var(--quantum-blue);">
                    ${this.quizScore} / ${total} (${percent}%)
                </p>
                <p style="color: var(--text-secondary);">
                    ${percent >= 80 ? 'Excellent work!' :
                      percent >= 60 ? 'Good job! Keep learning.' :
                      'Review the material and try again.'}
                </p>
            </div>
        `;
        document.getElementById('quiz-options').innerHTML = '';
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-progress').textContent = 'Complete';

        // Complete lesson
        const result = this.progress.completeLesson(this.quizData.id);
        if (result?.leveledUp) {
            setTimeout(() => this.showLevelUp(result.newLevel, result.title), 500);
        }
        this.updateNavStats();

        document.getElementById('quiz-next-btn').textContent = 'Continue';
        document.getElementById('quiz-next-btn').onclick = () => {
            document.getElementById('quiz-modal').classList.add('hidden');
            this.showEraScreen(this.currentEra);
        };
    }

    // ================================
    // Lab Screen
    // ================================

    setupLabScreen() {
        // Toolbar buttons
        document.getElementById('add-qubit-btn')?.addEventListener('click', () => {
            if (this.circuit.numQubits < 8) {
                this.circuit.addQubit();
                this.updateLab();
            }
        });

        document.getElementById('remove-qubit-btn')?.addEventListener('click', () => {
            if (this.circuit.numQubits > 1) {
                this.circuit.removeQubit();
                this.updateLab();
            }
        });

        document.getElementById('clear-circuit-btn')?.addEventListener('click', () => {
            this.circuit.clear();
            this.updateLab();
        });

        document.getElementById('reset-circuit-btn')?.addEventListener('click', () => {
            this.circuit.reset();
            this.updateLab();
        });

        document.getElementById('run-circuit-btn')?.addEventListener('click', () => {
            this.runCircuit();
        });

        document.getElementById('step-circuit-btn')?.addEventListener('click', () => {
            this.stepCircuit();
        });

        // Gate palette drag
        document.querySelectorAll('.gate-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('gate', item.dataset.gate);
            });
        });

        // Circuit presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadPreset(btn.dataset.preset);
            });
        });

        // Results tabs
        document.querySelectorAll('.results-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
            });
        });

        // Export tabs
        document.querySelectorAll('.export-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.export-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.updateCodeExport(tab.dataset.lang);
            });
        });

        document.getElementById('copy-code-btn')?.addEventListener('click', () => {
            const code = document.getElementById('code-output').textContent;
            navigator.clipboard.writeText(code);
        });

        // Gate info callback
        window.updateGateInfo = (gateName) => {
            const info = GateInfo[gateName];
            if (info) {
                document.getElementById('gate-info-name').textContent = info.name;
                document.getElementById('gate-info-description').textContent = info.description;

                // Show matrix for single-qubit gates
                const gate = QuantumGates[gateName];
                if (gate && gate.rows === 2) {
                    document.getElementById('gate-info-matrix').textContent = gate.toString();
                } else {
                    document.getElementById('gate-info-matrix').textContent = '';
                }

                document.querySelector('.info-placeholder').classList.add('hidden');
                document.getElementById('gate-details').classList.remove('hidden');
            }
        };

        // Circuit change callback
        window.onCircuitChange = () => {
            this.progress.incrementCircuitsBuilt();
            this.achievements.checkCircuitAchievements(this.circuit);
            this.updateLab();
        };
    }

    initLab() {
        const canvas = document.getElementById('circuit-canvas');
        if (canvas && !this.circuitRenderer) {
            this.circuitRenderer = new CircuitRenderer(canvas, this.circuit);
        }
        this.updateLab();
    }

    updateLab() {
        // Update qubit count
        document.getElementById('qubit-count').textContent = this.circuit.numQubits;

        // Render circuit
        if (this.circuitRenderer) {
            this.circuitRenderer.circuit = this.circuit;
            this.circuitRenderer.render();
        }

        // Run and update results
        this.runCircuit();

        // Update code export
        this.updateCodeExport('qiskit');
    }

    runCircuit() {
        const result = this.circuit.run();
        this.updateResults(result);
        this.updateBlochSpheres();
    }

    stepCircuit() {
        const result = this.circuit.step();
        if (result) {
            this.updateResults({ state: result.state, measurements: {} });
            this.updateBlochSpheres();
        }
    }

    updateResults(result) {
        const state = result.state;
        const n = this.circuit.numQubits;

        // State vector
        const svDisplay = document.getElementById('statevector-display');
        svDisplay.innerHTML = '';
        for (let i = 0; i < state.dim; i++) {
            const amp = state.get(i);
            if (!amp.isZero(0.001)) {
                const term = document.createElement('span');
                term.className = 'state-term';
                term.innerHTML = `
                    <span class="state-amplitude">${amp.toDisplayString()}</span>
                    <span class="state-basis">|${i.toString(2).padStart(n, '0')}⟩</span>
                `;
                svDisplay.appendChild(term);
            }
        }

        // Probabilities
        const probs = state.getProbabilities();
        const probChart = document.getElementById('probability-chart');
        probChart.innerHTML = '';
        for (let i = 0; i < probs.length; i++) {
            const prob = probs[i];
            if (prob > 0.001) {
                const bar = document.createElement('div');
                bar.className = 'prob-bar-container';
                bar.innerHTML = `
                    <span class="prob-label">|${i.toString(2).padStart(n, '0')}⟩</span>
                    <div class="prob-bar">
                        <div class="prob-bar-fill" style="width: ${prob * 100}%"></div>
                    </div>
                    <span class="prob-value">${(prob * 100).toFixed(1)}%</span>
                `;
                probChart.appendChild(bar);
            }
        }

        // Current state display
        document.getElementById('current-state-display').textContent = state.toString();

        // Unitary matrix
        const matrix = this.circuit.getUnitaryMatrix();
        const matrixDisplay = document.getElementById('matrix-display');
        if (matrix.rows <= 8) {
            let html = '<table class="matrix-table">';
            for (let i = 0; i < matrix.rows; i++) {
                html += '<tr>';
                for (let j = 0; j < matrix.cols; j++) {
                    const val = matrix.get(i, j);
                    html += `<td>${val.toDisplayString()}</td>`;
                }
                html += '</tr>';
            }
            html += '</table>';
            matrixDisplay.innerHTML = html;
        } else {
            matrixDisplay.innerHTML = '<p>Matrix too large to display</p>';
        }
    }

    updateBlochSpheres() {
        const container = document.getElementById('bloch-spheres');
        container.innerHTML = '';

        this.blochSpheres = createBlochSpheres(container, this.circuit.numQubits, 100);

        for (let i = 0; i < this.circuit.numQubits; i++) {
            const coords = this.circuit.state.getBlochCoordinates(i);
            this.blochSpheres[i].setState(coords.x, coords.y, coords.z);
        }
    }

    loadPreset(presetName) {
        const preset = CircuitPresets[presetName];
        if (preset) {
            this.circuit = new QuantumCircuit(preset.qubits);
            this.circuit.gates = JSON.parse(JSON.stringify(preset.gates));
            this.updateLab();
        }
    }

    updateCodeExport(language) {
        const codeOutput = document.getElementById('code-output');
        switch (language) {
            case 'qiskit':
                codeOutput.textContent = this.circuit.toQiskit();
                break;
            case 'cirq':
                codeOutput.textContent = this.circuit.toCirq();
                break;
            case 'qsharp':
                codeOutput.textContent = this.circuit.toQSharp();
                break;
        }
    }

    // ================================
    // Challenges Screen
    // ================================

    setupChallengesScreen() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderChallengesScreen(btn.dataset.difficulty);
            });
        });

        // Code editor buttons
        document.getElementById('run-code-btn')?.addEventListener('click', () => this.runChallengeCode());
        document.getElementById('submit-code-btn')?.addEventListener('click', () => this.submitChallengeCode());
        document.getElementById('reset-code-btn')?.addEventListener('click', () => this.resetChallengeCode());
        document.getElementById('clear-output-btn')?.addEventListener('click', () => {
            document.getElementById('output-content').innerHTML =
                '<p class="output-placeholder">Run your code to see output...</p>';
        });

        // Hint toggles
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('hint-toggle')) {
                e.target.closest('.hint-item').classList.toggle('open');
            }
        });
    }

    renderChallengesScreen(difficulty = 'all') {
        const container = document.getElementById('challenges-grid');
        if (!container) return;

        container.innerHTML = '';

        const challenges = difficulty === 'all'
            ? ChallengesData
            : ChallengesData.filter(c => c.difficulty === difficulty);

        for (const challenge of challenges) {
            const isCompleted = this.progress.isChallengeComplete(challenge.id);

            const card = document.createElement('div');
            card.className = `challenge-card ${isCompleted ? 'completed' : ''}`;

            card.innerHTML = `
                <div class="challenge-card-header">
                    <span class="challenge-difficulty ${challenge.difficulty}">${challenge.difficulty}</span>
                    <span class="challenge-xp">+${challenge.xp} XP</span>
                </div>
                <h3>${challenge.title}</h3>
                <p>${challenge.tags.join(', ')}</p>
                <div class="challenge-tags">
                    ${challenge.tags.map(t => `<span class="challenge-tag">${t}</span>`).join('')}
                </div>
            `;

            card.addEventListener('click', () => this.showChallengeScreen(challenge));
            container.appendChild(card);
        }
    }

    showChallengeScreen(challenge) {
        this.currentChallenge = challenge;

        // Update header
        document.getElementById('challenge-title').textContent = challenge.title;
        document.getElementById('challenge-difficulty').textContent = challenge.difficulty;
        document.getElementById('challenge-difficulty').className =
            `challenge-difficulty ${challenge.difficulty}`;
        document.getElementById('challenge-xp').textContent = `+${challenge.xp} XP`;

        // Update content
        document.getElementById('challenge-content').innerHTML = challenge.description;

        // Setup hints
        const hintsContainer = document.getElementById('challenge-hints');
        hintsContainer.querySelector('.hints-list').innerHTML = challenge.hints
            .map((hint, i) => `
                <div class="hint-item">
                    <button class="hint-toggle">Hint ${i + 1}</button>
                    <div class="hint-content">${hint}</div>
                </div>
            `).join('');

        // Setup code editor
        document.getElementById('code-editor').value = challenge.starterCode;

        // Clear output and tests
        document.getElementById('output-content').innerHTML =
            '<p class="output-placeholder">Run your code to see output...</p>';
        document.getElementById('tests-list').innerHTML = challenge.tests
            .map(t => `
                <div class="test-item">
                    <span class="test-status pending">○</span>
                    <span class="test-name">${t.name}</span>
                </div>
            `).join('');

        // Show screen
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('challenge-screen').classList.remove('hidden');
    }

    runChallengeCode() {
        const code = document.getElementById('code-editor').value;
        const result = this.challengeSimulator.execute(code);

        const output = document.getElementById('output-content');
        output.innerHTML = '';

        if (result.success) {
            for (const line of result.output) {
                const p = document.createElement('p');
                p.className = 'output-line';
                p.textContent = line;
                output.appendChild(p);
            }
        } else {
            const p = document.createElement('p');
            p.className = 'output-line error';
            p.textContent = `Error: ${result.error}`;
            output.appendChild(p);
        }
    }

    submitChallengeCode() {
        const code = document.getElementById('code-editor').value;
        const result = this.challengeSimulator.execute(code);

        const testItems = document.querySelectorAll('.test-item');
        let allPassed = true;

        this.currentChallenge.tests.forEach((test, i) => {
            const item = testItems[i];
            const status = item.querySelector('.test-status');

            let passed = false;
            if (test.check) {
                passed = test.check(code);
            } else if (test.validate && result.success) {
                passed = test.validate(result.state);
            }

            status.className = `test-status ${passed ? 'passed' : 'failed'}`;
            status.textContent = passed ? '✓' : '✗';

            if (!passed) allPassed = false;
        });

        if (allPassed) {
            // Challenge completed!
            this.progress.completeChallenge(this.currentChallenge.id);
            const xpResult = this.progress.addXP(this.currentChallenge.xp, 'challenge');
            this.updateNavStats();

            const output = document.getElementById('output-content');
            const success = document.createElement('p');
            success.className = 'output-line success';
            success.textContent = `🎉 Challenge completed! +${this.currentChallenge.xp} XP`;
            output.appendChild(success);

            if (xpResult.leveledUp) {
                this.showLevelUp(xpResult.newLevel, xpResult.title);
            }
        }
    }

    resetChallengeCode() {
        document.getElementById('code-editor').value = this.currentChallenge.starterCode;
    }

    // ================================
    // Modals and Popups
    // ================================

    setupModals() {
        // Close quiz modal
        document.getElementById('quiz-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'quiz-modal') {
                document.getElementById('quiz-modal').classList.add('hidden');
            }
        });

        // Level up popup
        document.getElementById('close-levelup-btn')?.addEventListener('click', () => {
            document.getElementById('levelup-popup').classList.add('hidden');
        });
    }

    showLevelUp(level, title) {
        document.getElementById('new-level-number').textContent = level;
        document.getElementById('levelup-message').textContent = `You are now a ${title}!`;
        document.getElementById('levelup-popup').classList.remove('hidden');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new QuantumQuest();
    window.game.init();
});
