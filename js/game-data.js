/**
 * Quantum Quest - Game Data
 *
 * Contains all educational content, lessons, quizzes, and achievements.
 * Organized into 8 eras covering the complete journey of quantum computing.
 */

const GameData = {
    // ========================================
    // ERA DEFINITIONS
    // ========================================
    eras: [
        {
            id: 'era1',
            number: 1,
            title: 'Quantum Mechanics Foundations',
            description: 'Understand the fundamental principles that make quantum computing possible: superposition, entanglement, and measurement.',
            icon: '🌊',
            color: '#6366f1',
            prerequisites: [],
            lessons: ['qm-intro', 'superposition', 'measurement', 'entanglement', 'no-cloning', 'era1-quiz']
        },
        {
            id: 'era2',
            number: 2,
            title: 'Birth of Quantum Computing',
            description: 'Explore the history from Feynman\'s vision to Deutsch\'s quantum algorithms and the theoretical foundations.',
            icon: '📜',
            color: '#8b5cf6',
            prerequisites: ['era1'],
            lessons: ['history-intro', 'feynman-vision', 'deutsch-algorithm', 'quantum-parallelism', 'complexity-theory', 'era2-quiz']
        },
        {
            id: 'era3',
            number: 3,
            title: 'Quantum Gates & Circuits',
            description: 'Master the building blocks of quantum computation: single-qubit gates, multi-qubit gates, and circuit design.',
            icon: '🔧',
            color: '#a855f7',
            prerequisites: ['era2'],
            lessons: ['qubits-intro', 'single-gates', 'rotation-gates', 'multi-qubit-gates', 'universal-gates', 'circuit-design', 'era3-quiz']
        },
        {
            id: 'era4',
            number: 4,
            title: 'Quantum Algorithms',
            description: 'Learn the revolutionary algorithms that demonstrate quantum advantage: Shor\'s, Grover\'s, VQE, and QAOA.',
            icon: '⚡',
            color: '#ec4899',
            prerequisites: ['era3'],
            lessons: ['algo-intro', 'deutsch-jozsa', 'grovers', 'shors', 'vqe', 'qaoa', 'era4-quiz']
        },
        {
            id: 'era5',
            number: 5,
            title: 'Quantum Hardware',
            description: 'Discover how real quantum computers are built: superconducting qubits, ion traps, photonics, and more.',
            icon: '🔬',
            color: '#f59e0b',
            prerequisites: ['era3'],
            lessons: ['hardware-intro', 'superconducting', 'ion-traps', 'photonic', 'topological', 'neutral-atoms', 'era5-quiz']
        },
        {
            id: 'era6',
            number: 6,
            title: 'Quantum Error Correction',
            description: 'Understand decoherence, noise, and the sophisticated techniques to protect quantum information.',
            icon: '🛡️',
            color: '#10b981',
            prerequisites: ['era4', 'era5'],
            lessons: ['noise-intro', 'decoherence', 'bit-flip-code', 'phase-flip-code', 'shor-code', 'surface-codes', 'era6-quiz']
        },
        {
            id: 'era7',
            number: 7,
            title: 'Quantum Programming',
            description: 'Write real quantum code using industry frameworks: Qiskit, Cirq, Q#, and PennyLane.',
            icon: '💻',
            color: '#3b82f6',
            prerequisites: ['era4'],
            lessons: ['programming-intro', 'qiskit-basics', 'cirq-basics', 'qsharp-basics', 'pennylane-intro', 'hybrid-algorithms', 'era7-quiz']
        },
        {
            id: 'era8',
            number: 8,
            title: 'Applications & Future',
            description: 'Explore real-world applications in cryptography, optimization, simulation, and machine learning.',
            icon: '🚀',
            color: '#ef4444',
            prerequisites: ['era6', 'era7'],
            lessons: ['apps-intro', 'quantum-crypto', 'optimization', 'simulation', 'qml', 'future-outlook', 'era8-quiz']
        }
    ],

    // ========================================
    // LESSONS
    // ========================================
    lessons: {
        // ERA 1: Quantum Mechanics Foundations
        'qm-intro': {
            id: 'qm-intro',
            title: 'Introduction to Quantum Mechanics',
            duration: '15 min',
            xp: 100,
            content: `
                <div class="lesson-section">
                    <h2>Welcome to the Quantum World</h2>
                    <div class="lesson-text">
                        <p>Quantum mechanics is the physics of the very small. It describes the behavior of particles at atomic and subatomic scales, where the rules that govern our everyday experience break down in surprising ways.</p>

                        <p>In the quantum world, particles can exist in <strong>multiple states simultaneously</strong>, can be <strong>instantly correlated across vast distances</strong>, and their properties are <strong>fundamentally uncertain until measured</strong>.</p>

                        <div class="lesson-highlight">
                            <p><strong>Key Insight:</strong> Quantum computing harnesses these strange quantum properties to process information in ways impossible for classical computers.</p>
                        </div>

                        <h3>Classical vs Quantum</h3>
                        <p>In classical computing, information is stored in bits—each bit is either 0 or 1. A classical computer with n bits can represent exactly one of 2ⁿ possible states at any given moment.</p>

                        <p>In quantum computing, information is stored in <strong>qubits</strong>. Thanks to superposition, a single qubit can represent both 0 and 1 simultaneously. A quantum computer with n qubits can represent all 2ⁿ states at once!</p>

                        <h3>The Four Pillars of Quantum Mechanics</h3>
                        <ul>
                            <li><strong>Superposition:</strong> Qubits can be in multiple states at once</li>
                            <li><strong>Entanglement:</strong> Qubits can be correlated in ways impossible classically</li>
                            <li><strong>Interference:</strong> Quantum states can constructively or destructively combine</li>
                            <li><strong>Measurement:</strong> Observing a quantum system collapses it to a definite state</li>
                        </ul>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>The Mathematics of Quantum States</h2>
                    <div class="lesson-text">
                        <p>Quantum states are represented mathematically using <strong>Dirac notation</strong> (bra-ket notation), developed by physicist Paul Dirac.</p>

                        <div class="lesson-equation">
                            |ψ⟩ = α|0⟩ + β|1⟩
                        </div>

                        <p>Where:</p>
                        <ul>
                            <li>|ψ⟩ (pronounced "ket psi") represents the quantum state</li>
                            <li>|0⟩ and |1⟩ are the computational basis states</li>
                            <li>α and β are complex numbers called <strong>amplitudes</strong></li>
                            <li>|α|² + |β|² = 1 (normalization condition)</li>
                        </ul>

                        <div class="lesson-highlight">
                            <p><strong>Probability Rule:</strong> When we measure a qubit, the probability of getting 0 is |α|² and the probability of getting 1 is |β|².</p>
                        </div>
                    </div>
                </div>
            `
        },

        'superposition': {
            id: 'superposition',
            title: 'Superposition: Being in Two States at Once',
            duration: '20 min',
            xp: 150,
            content: `
                <div class="lesson-section">
                    <h2>What is Superposition?</h2>
                    <div class="lesson-text">
                        <p>Superposition is the quantum mechanical phenomenon where a quantum system can exist in multiple states simultaneously until it is measured.</p>

                        <p>Imagine a coin spinning in the air—it's neither heads nor tails but something in between. A qubit in superposition is somewhat similar, except it's not just our ignorance of the state; the qubit genuinely exists in both states at once.</p>

                        <div class="lesson-highlight">
                            <p><strong>Important:</strong> Superposition is NOT the same as classical probability. The qubit isn't secretly in one state or another—it's actually in both states simultaneously, described by complex amplitudes that can interfere with each other.</p>
                        </div>

                        <h3>Creating Superposition: The Hadamard Gate</h3>
                        <p>The Hadamard gate (H) is the most common way to create superposition. When applied to |0⟩:</p>

                        <div class="lesson-equation">
                            H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
                        </div>

                        <p>This creates an equal superposition—when measured, we get 0 with 50% probability and 1 with 50% probability.</p>

                        <p>When applied to |1⟩:</p>

                        <div class="lesson-equation">
                            H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩
                        </div>

                        <p>Notice the minus sign! This phase difference is crucial for quantum computing.</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>The Bloch Sphere</h2>
                    <div class="lesson-text">
                        <p>Any single qubit state can be visualized on the <strong>Bloch sphere</strong>, a unit sphere where:</p>

                        <ul>
                            <li>The north pole (z=1) represents |0⟩</li>
                            <li>The south pole (z=-1) represents |1⟩</li>
                            <li>The equator represents equal superpositions</li>
                            <li>|+⟩ and |-⟩ are on the x-axis</li>
                            <li>|+i⟩ and |-i⟩ are on the y-axis</li>
                        </ul>

                        <div class="lesson-equation">
                            |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
                        </div>

                        <p>Where θ is the polar angle and φ is the azimuthal angle on the Bloch sphere.</p>

                        <div class="interactive-demo" id="bloch-demo">
                            <h4>🎮 Interactive: Explore the Bloch Sphere</h4>
                            <p>Drag to rotate the sphere and see how different quantum states are represented.</p>
                            <canvas id="lesson-bloch-sphere" class="lesson-canvas"></canvas>
                        </div>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Quantum Parallelism</h2>
                    <div class="lesson-text">
                        <p>Here's where quantum computing gets powerful. With n qubits in superposition, we can represent 2ⁿ states simultaneously:</p>

                        <div class="lesson-equation">
                            |ψ⟩ = (1/√2ⁿ) Σ |x⟩ for all x from 0 to 2ⁿ-1
                        </div>

                        <p>A quantum operation on this superposition acts on ALL 2ⁿ states in parallel. This is <strong>quantum parallelism</strong>—the source of potential quantum speedups.</p>

                        <div class="lesson-highlight">
                            <p><strong>Caveat:</strong> While we can compute on all states at once, we can only extract limited information through measurement. The art of quantum algorithm design is structuring computations so that useful information survives the measurement process.</p>
                        </div>
                    </div>
                </div>
            `
        },

        'measurement': {
            id: 'measurement',
            title: 'Quantum Measurement: The Act of Observation',
            duration: '18 min',
            xp: 150,
            content: `
                <div class="lesson-section">
                    <h2>The Measurement Problem</h2>
                    <div class="lesson-text">
                        <p>Measurement in quantum mechanics is fundamentally different from classical measurement. When we measure a classical system, we're simply revealing a pre-existing state. When we measure a quantum system, we're <strong>forcing it to choose</strong> a definite state.</p>

                        <h3>Wave Function Collapse</h3>
                        <p>Before measurement, a qubit exists in superposition:</p>

                        <div class="lesson-equation">
                            |ψ⟩ = α|0⟩ + β|1⟩
                        </div>

                        <p>After measurement in the computational basis:</p>
                        <ul>
                            <li>We get result 0 with probability |α|² → state becomes |0⟩</li>
                            <li>We get result 1 with probability |β|² → state becomes |1⟩</li>
                        </ul>

                        <div class="lesson-highlight">
                            <p><strong>Key Point:</strong> Measurement is irreversible. Once a qubit is measured, its superposition is destroyed. We cannot "undo" a measurement to recover the original state.</p>
                        </div>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Measurement Bases</h2>
                    <div class="lesson-text">
                        <p>We can measure in different bases, not just the computational basis {|0⟩, |1⟩}.</p>

                        <h3>Common Measurement Bases</h3>
                        <ul>
                            <li><strong>Z-basis (computational):</strong> {|0⟩, |1⟩}</li>
                            <li><strong>X-basis (Hadamard):</strong> {|+⟩, |-⟩} where |±⟩ = (|0⟩ ± |1⟩)/√2</li>
                            <li><strong>Y-basis:</strong> {|+i⟩, |-i⟩} where |±i⟩ = (|0⟩ ± i|1⟩)/√2</li>
                        </ul>

                        <p>To measure in the X-basis, apply H before measuring in Z-basis. The choice of measurement basis affects what information we extract.</p>

                        <h3>Born Rule</h3>
                        <p>The probability of measuring outcome |m⟩ when the system is in state |ψ⟩ is:</p>

                        <div class="lesson-equation">
                            P(m) = |⟨m|ψ⟩|²
                        </div>

                        <p>This is the <strong>Born rule</strong>, named after physicist Max Born.</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Implications for Quantum Computing</h2>
                    <div class="lesson-text">
                        <p>The probabilistic nature of measurement creates challenges for quantum algorithm design:</p>

                        <ol>
                            <li><strong>Amplification:</strong> Quantum algorithms must amplify correct answers to high probability</li>
                            <li><strong>Repetition:</strong> Many quantum algorithms run multiple times to gather statistics</li>
                            <li><strong>Interference:</strong> We use constructive/destructive interference to boost correct answers</li>
                        </ol>

                        <div class="lesson-highlight">
                            <p><strong>Grover's Algorithm Example:</strong> Grover's search amplifies the probability of finding the correct item from 1/N to close to 1 using √N iterations of amplitude amplification.</p>
                        </div>
                    </div>
                </div>
            `
        },

        'entanglement': {
            id: 'entanglement',
            title: 'Entanglement: Spooky Action at a Distance',
            duration: '22 min',
            xp: 200,
            content: `
                <div class="lesson-section">
                    <h2>What is Entanglement?</h2>
                    <div class="lesson-text">
                        <p>Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently. Einstein famously called this "spooky action at a distance."</p>

                        <h3>The Bell State</h3>
                        <p>The simplest and most famous entangled state is the Bell state (also called an EPR pair):</p>

                        <div class="lesson-equation">
                            |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
                        </div>

                        <p>Key properties:</p>
                        <ul>
                            <li>Neither qubit has a definite state individually</li>
                            <li>Measuring one qubit instantly determines the other's value</li>
                            <li>This correlation holds regardless of distance between qubits</li>
                            <li>Cannot be used for faster-than-light communication</li>
                        </ul>

                        <div class="lesson-highlight">
                            <p><strong>Creating a Bell State:</strong> Apply H to the first qubit, then CNOT with first as control, second as target.</p>
                        </div>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Types of Entanglement</h2>
                    <div class="lesson-text">
                        <h3>The Four Bell States</h3>
                        <div class="lesson-equation">
                            |Φ⁺⟩ = (|00⟩ + |11⟩)/√2<br>
                            |Φ⁻⟩ = (|00⟩ - |11⟩)/√2<br>
                            |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2<br>
                            |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2
                        </div>

                        <p>These form a complete orthonormal basis for two-qubit states and are fundamental to many quantum protocols.</p>

                        <h3>GHZ State</h3>
                        <p>For three or more qubits, we have the GHZ (Greenberger-Horne-Zeilinger) state:</p>

                        <div class="lesson-equation">
                            |GHZ⟩ = (|000⟩ + |111⟩)/√2
                        </div>

                        <p>GHZ states are maximally entangled across all qubits and are used in quantum error correction and multi-party quantum protocols.</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Applications of Entanglement</h2>
                    <div class="lesson-text">
                        <h3>Quantum Teleportation</h3>
                        <p>Using a shared Bell pair and classical communication, we can transmit quantum states between parties without physically sending the particle.</p>

                        <h3>Superdense Coding</h3>
                        <p>Two classical bits can be transmitted by sending only one qubit if the parties share an entangled pair.</p>

                        <h3>Quantum Key Distribution</h3>
                        <p>Entanglement enables perfectly secure communication through protocols like E91.</p>

                        <div class="lesson-highlight">
                            <p><strong>Entanglement as a Resource:</strong> In quantum computing, entanglement is a computational resource. Without entanglement, quantum computers would be no more powerful than classical probabilistic computers.</p>
                        </div>
                    </div>
                </div>
            `
        },

        'no-cloning': {
            id: 'no-cloning',
            title: 'The No-Cloning Theorem',
            duration: '12 min',
            xp: 100,
            content: `
                <div class="lesson-section">
                    <h2>You Cannot Copy Quantum States</h2>
                    <div class="lesson-text">
                        <p>The <strong>no-cloning theorem</strong> states that it is impossible to create an exact copy of an arbitrary unknown quantum state. This is a fundamental result with profound implications.</p>

                        <h3>The Proof (Simplified)</h3>
                        <p>Suppose we had a cloning machine U that could copy any state:</p>

                        <div class="lesson-equation">
                            U|ψ⟩|0⟩ = |ψ⟩|ψ⟩
                        </div>

                        <p>For two different states |ψ⟩ and |φ⟩:</p>
                        <ul>
                            <li>U|ψ⟩|0⟩ = |ψ⟩|ψ⟩</li>
                            <li>U|φ⟩|0⟩ = |φ⟩|φ⟩</li>
                        </ul>

                        <p>Taking inner products and using linearity of quantum mechanics leads to a contradiction unless |ψ⟩ = |φ⟩. Therefore, no universal cloning machine can exist.</p>

                        <div class="lesson-highlight">
                            <p><strong>Note:</strong> We CAN copy known states or states from a specific orthogonal set. The theorem only forbids copying arbitrary unknown states.</p>
                        </div>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Implications</h2>
                    <div class="lesson-text">
                        <h3>Quantum Cryptography</h3>
                        <p>The no-cloning theorem is the foundation of quantum key distribution security. An eavesdropper cannot copy quantum states without disturbing them.</p>

                        <h3>Quantum Computing</h3>
                        <p>We cannot simply "back up" quantum computations. This affects error correction strategies—we must use entanglement and encoding rather than simple redundancy.</p>

                        <h3>Quantum Information</h3>
                        <p>Related theorems include:</p>
                        <ul>
                            <li><strong>No-deleting theorem:</strong> Cannot delete one copy of a pair</li>
                            <li><strong>No-broadcast theorem:</strong> Cannot broadcast quantum states to multiple parties</li>
                        </ul>
                    </div>
                </div>
            `
        },

        'era1-quiz': {
            id: 'era1-quiz',
            title: 'Era 1 Assessment',
            duration: '10 min',
            xp: 250,
            type: 'quiz',
            questions: [
                {
                    question: 'What does the Hadamard gate do to the |0⟩ state?',
                    options: [
                        'Leaves it unchanged',
                        'Flips it to |1⟩',
                        'Creates an equal superposition (|0⟩ + |1⟩)/√2',
                        'Rotates it 90 degrees on the Bloch sphere'
                    ],
                    correct: 2,
                    explanation: 'The Hadamard gate creates an equal superposition from a computational basis state.'
                },
                {
                    question: 'In the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, what happens when you measure the first qubit and get 0?',
                    options: [
                        'The second qubit is still in superposition',
                        'The second qubit immediately becomes |0⟩',
                        'The second qubit immediately becomes |1⟩',
                        'You cannot predict anything about the second qubit'
                    ],
                    correct: 1,
                    explanation: 'In this Bell state, the qubits are perfectly correlated—measuring 0 on one means the other is definitely 0.'
                },
                {
                    question: 'Why can\'t we use entanglement for faster-than-light communication?',
                    options: [
                        'The correlation is not strong enough',
                        'Measurement results are random; classical communication is needed to compare',
                        'Entanglement breaks at large distances',
                        'The no-cloning theorem prevents it'
                    ],
                    correct: 1,
                    explanation: 'While measurement of entangled qubits gives correlated results instantly, each individual measurement appears random. Classical communication is needed to learn the correlation.'
                },
                {
                    question: 'What is the probability of measuring |1⟩ from the state |ψ⟩ = (1/√3)|0⟩ + √(2/3)|1⟩?',
                    options: [
                        '1/3',
                        '2/3',
                        '√(2/3)',
                        '1/√3'
                    ],
                    correct: 1,
                    explanation: 'The probability is the amplitude squared: (√(2/3))² = 2/3.'
                },
                {
                    question: 'Which of the following is NOT a consequence of the no-cloning theorem?',
                    options: [
                        'Quantum cryptography can be secure',
                        'We cannot backup quantum states perfectly',
                        'Quantum computers cannot perform parallel computation',
                        'Eavesdropping on quantum communication is detectable'
                    ],
                    correct: 2,
                    explanation: 'Quantum computers CAN perform parallel computation through superposition. The no-cloning theorem is unrelated to quantum parallelism.'
                }
            ]
        },

        // ERA 2: Birth of Quantum Computing
        'history-intro': {
            id: 'history-intro',
            title: 'The Road to Quantum Computing',
            duration: '15 min',
            xp: 100,
            content: `
                <div class="lesson-section">
                    <h2>A Brief History</h2>
                    <div class="lesson-text">
                        <h3>1980: Feynman's Vision</h3>
                        <p>Richard Feynman proposed that simulating quantum systems requires quantum computers—classical computers would be exponentially slow.</p>

                        <h3>1985: Deutsch's Universal Quantum Computer</h3>
                        <p>David Deutsch formally described a universal quantum computer and proposed the first quantum algorithm.</p>

                        <h3>1994: Shor's Algorithm</h3>
                        <p>Peter Shor developed an algorithm that factors large numbers exponentially faster than any known classical algorithm—threatening RSA encryption.</p>

                        <h3>1996: Grover's Algorithm</h3>
                        <p>Lov Grover showed that quantum computers can search unsorted databases quadratically faster than classical computers.</p>

                        <h3>2019: Quantum Supremacy</h3>
                        <p>Google claimed quantum supremacy—their 53-qubit Sycamore processor completed a task in 200 seconds that would take a supercomputer 10,000 years.</p>
                    </div>
                </div>
            `
        },

        // ERA 3: Quantum Gates & Circuits
        'qubits-intro': {
            id: 'qubits-intro',
            title: 'Understanding Qubits',
            duration: '15 min',
            xp: 100,
            content: `
                <div class="lesson-section">
                    <h2>The Quantum Bit</h2>
                    <div class="lesson-text">
                        <p>A qubit is the fundamental unit of quantum information. Unlike classical bits, qubits can exist in superpositions.</p>

                        <h3>Physical Implementations</h3>
                        <ul>
                            <li><strong>Superconducting circuits:</strong> Used by IBM, Google (current leaders)</li>
                            <li><strong>Trapped ions:</strong> Used by IonQ, Quantinuum</li>
                            <li><strong>Photonic qubits:</strong> Used by Xanadu, PsiQuantum</li>
                            <li><strong>Spin qubits:</strong> Used by Intel, Silicon Quantum Computing</li>
                            <li><strong>Neutral atoms:</strong> Used by QuEra, Pasqal</li>
                        </ul>

                        <h3>Key Qubit Properties</h3>
                        <ul>
                            <li><strong>T1 (Relaxation time):</strong> How long the qubit maintains its excited state</li>
                            <li><strong>T2 (Coherence time):</strong> How long superposition survives</li>
                            <li><strong>Gate fidelity:</strong> Accuracy of quantum operations</li>
                            <li><strong>Connectivity:</strong> Which qubits can interact directly</li>
                        </ul>
                    </div>
                </div>
            `
        },

        'single-gates': {
            id: 'single-gates',
            title: 'Single-Qubit Gates',
            duration: '25 min',
            xp: 200,
            content: `
                <div class="lesson-section">
                    <h2>Pauli Gates</h2>
                    <div class="lesson-text">
                        <h3>Pauli-X (NOT Gate)</h3>
                        <div class="lesson-equation">
                            X = [0 1; 1 0]<br>
                            X|0⟩ = |1⟩, X|1⟩ = |0⟩
                        </div>
                        <p>Bit flip: rotates 180° around X-axis on Bloch sphere.</p>

                        <h3>Pauli-Y</h3>
                        <div class="lesson-equation">
                            Y = [0 -i; i 0]<br>
                            Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩
                        </div>
                        <p>Combines bit and phase flip: rotates 180° around Y-axis.</p>

                        <h3>Pauli-Z</h3>
                        <div class="lesson-equation">
                            Z = [1 0; 0 -1]<br>
                            Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩
                        </div>
                        <p>Phase flip: rotates 180° around Z-axis.</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h2>Phase Gates</h2>
                    <div class="lesson-text">
                        <h3>S Gate (√Z)</h3>
                        <div class="lesson-equation">
                            S = [1 0; 0 i]
                        </div>
                        <p>Rotates 90° around Z-axis. S² = Z.</p>

                        <h3>T Gate (π/8 Gate)</h3>
                        <div class="lesson-equation">
                            T = [1 0; 0 e^(iπ/4)]
                        </div>
                        <p>Rotates 45° around Z-axis. T² = S. Critical for universal computation.</p>
                    </div>
                </div>
            `
        },

        'multi-qubit-gates': {
            id: 'multi-qubit-gates',
            title: 'Multi-Qubit Gates',
            duration: '25 min',
            xp: 200,
            content: `
                <div class="lesson-section">
                    <h2>Controlled Operations</h2>
                    <div class="lesson-text">
                        <h3>CNOT (Controlled-X)</h3>
                        <p>The most important two-qubit gate. Flips the target qubit if the control qubit is |1⟩.</p>

                        <div class="lesson-equation">
                            CNOT|00⟩ = |00⟩<br>
                            CNOT|01⟩ = |01⟩<br>
                            CNOT|10⟩ = |11⟩<br>
                            CNOT|11⟩ = |10⟩
                        </div>

                        <h3>Creating Entanglement</h3>
                        <p>CNOT combined with Hadamard creates Bell states:</p>
                        <div class="lesson-equation">
                            CNOT(H ⊗ I)|00⟩ = (|00⟩ + |11⟩)/√2
                        </div>

                        <h3>CZ (Controlled-Z)</h3>
                        <p>Applies Z to target if control is |1⟩. Symmetric between control and target!</p>

                        <h3>SWAP Gate</h3>
                        <p>Exchanges two qubit states. Can be decomposed into 3 CNOTs.</p>

                        <h3>Toffoli (CCNOT)</h3>
                        <p>Three-qubit gate: flips target if both controls are |1⟩. Universal for classical reversible computation.</p>
                    </div>
                </div>
            `
        },

        // More lessons would continue...
        // For brevity, I'll add stub content for remaining lessons

        'feynman-vision': { id: 'feynman-vision', title: 'Feynman\'s Vision', duration: '12 min', xp: 100, content: '<div class="lesson-section"><h2>Nature isn\'t classical</h2><div class="lesson-text"><p>In 1981, Richard Feynman observed that simulating quantum systems on classical computers requires exponential resources, proposing quantum computers as the solution.</p></div></div>' },
        'deutsch-algorithm': { id: 'deutsch-algorithm', title: 'The Deutsch Algorithm', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>The First Quantum Algorithm</h2><div class="lesson-text"><p>Deutsch-Jozsa algorithm demonstrates quantum speedup by determining if a function is constant or balanced in one query instead of 2^(n-1)+1.</p></div></div>' },
        'quantum-parallelism': { id: 'quantum-parallelism', title: 'Quantum Parallelism', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>Computing on All States</h2><div class="lesson-text"><p>Quantum parallelism allows operations on all 2^n basis states simultaneously through superposition.</p></div></div>' },
        'complexity-theory': { id: 'complexity-theory', title: 'Quantum Complexity', duration: '18 min', xp: 150, content: '<div class="lesson-section"><h2>BQP and Beyond</h2><div class="lesson-text"><p>BQP (Bounded-error Quantum Polynomial time) contains problems efficiently solvable by quantum computers.</p></div></div>' },
        'era2-quiz': { id: 'era2-quiz', title: 'Era 2 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'rotation-gates': { id: 'rotation-gates', title: 'Rotation Gates', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>Rx, Ry, Rz</h2><div class="lesson-text"><p>Rotation gates rotate the qubit state around the X, Y, or Z axis by an arbitrary angle θ.</p></div></div>' },
        'universal-gates': { id: 'universal-gates', title: 'Universal Gate Sets', duration: '18 min', xp: 150, content: '<div class="lesson-section"><h2>Building Any Operation</h2><div class="lesson-text"><p>A universal gate set can approximate any unitary operation. Common sets: {H, T, CNOT} or {Rx, Ry, CNOT}.</p></div></div>' },
        'circuit-design': { id: 'circuit-design', title: 'Circuit Design Principles', duration: '22 min', xp: 200, content: '<div class="lesson-section"><h2>Building Quantum Circuits</h2><div class="lesson-text"><p>Learn to design efficient quantum circuits considering gate counts, depth, and hardware constraints.</p></div></div>' },
        'era3-quiz': { id: 'era3-quiz', title: 'Era 3 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'algo-intro': { id: 'algo-intro', title: 'Introduction to Quantum Algorithms', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>Quantum Speedups</h2><div class="lesson-text"><p>Quantum algorithms achieve speedups through superposition, interference, and entanglement.</p></div></div>' },
        'deutsch-jozsa': { id: 'deutsch-jozsa', title: 'Deutsch-Jozsa Algorithm', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Exponential Speedup</h2><div class="lesson-text"><p>Determines if a function is constant or balanced in one query vs 2^(n-1)+1 classical queries.</p></div></div>' },
        'grovers': { id: 'grovers', title: 'Grover\'s Search Algorithm', duration: '30 min', xp: 250, content: '<div class="lesson-section"><h2>Quadratic Speedup for Search</h2><div class="lesson-text"><p>Finds a marked item in an unsorted database of N items in O(√N) queries instead of O(N).</p></div></div>' },
        'shors': { id: 'shors', title: 'Shor\'s Factoring Algorithm', duration: '35 min', xp: 300, content: '<div class="lesson-section"><h2>Breaking RSA</h2><div class="lesson-text"><p>Factors integers in polynomial time using quantum Fourier transform and period finding.</p></div></div>' },
        'vqe': { id: 'vqe', title: 'Variational Quantum Eigensolver', duration: '28 min', xp: 250, content: '<div class="lesson-section"><h2>Hybrid Quantum-Classical</h2><div class="lesson-text"><p>VQE finds ground state energies of molecules using parameterized quantum circuits optimized classically.</p></div></div>' },
        'qaoa': { id: 'qaoa', title: 'QAOA: Optimization', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Solving Combinatorial Problems</h2><div class="lesson-text"><p>Quantum Approximate Optimization Algorithm tackles combinatorial optimization problems.</p></div></div>' },
        'era4-quiz': { id: 'era4-quiz', title: 'Era 4 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'hardware-intro': { id: 'hardware-intro', title: 'Quantum Hardware Overview', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>Building Quantum Computers</h2><div class="lesson-text"><p>Multiple physical systems can implement qubits, each with unique advantages and challenges.</p></div></div>' },
        'superconducting': { id: 'superconducting', title: 'Superconducting Qubits', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>IBM and Google\'s Approach</h2><div class="lesson-text"><p>Superconducting qubits use Josephson junctions cooled to ~15 millikelvin. Fast gates but short coherence.</p></div></div>' },
        'ion-traps': { id: 'ion-traps', title: 'Trapped Ion Qubits', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>IonQ and Quantinuum</h2><div class="lesson-text"><p>Individual ions trapped by electromagnetic fields. Long coherence times, all-to-all connectivity.</p></div></div>' },
        'photonic': { id: 'photonic', title: 'Photonic Quantum Computing', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>Computing with Light</h2><div class="lesson-text"><p>Photonic qubits offer room temperature operation and natural networking capabilities.</p></div></div>' },
        'topological': { id: 'topological', title: 'Topological Qubits', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>Microsoft\'s Bet</h2><div class="lesson-text"><p>Topological qubits would be inherently protected from noise through braiding of anyons.</p></div></div>' },
        'neutral-atoms': { id: 'neutral-atoms', title: 'Neutral Atom Arrays', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>QuEra and Pasqal</h2><div class="lesson-text"><p>Arrays of neutral atoms controlled by optical tweezers offer scalability and reconfigurability.</p></div></div>' },
        'era5-quiz': { id: 'era5-quiz', title: 'Era 5 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'noise-intro': { id: 'noise-intro', title: 'Quantum Noise and Errors', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>The Enemy of Quantum Computing</h2><div class="lesson-text"><p>Quantum states are fragile. Environmental interactions cause decoherence and errors.</p></div></div>' },
        'decoherence': { id: 'decoherence', title: 'Understanding Decoherence', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>Losing Quantum Properties</h2><div class="lesson-text"><p>Decoherence occurs when quantum systems interact with their environment, losing superposition and entanglement.</p></div></div>' },
        'bit-flip-code': { id: 'bit-flip-code', title: 'The Bit-Flip Code', duration: '22 min', xp: 200, content: '<div class="lesson-section"><h2>Simple Redundancy</h2><div class="lesson-text"><p>The 3-qubit bit-flip code protects against X errors using redundancy: |0⟩→|000⟩, |1⟩→|111⟩.</p></div></div>' },
        'phase-flip-code': { id: 'phase-flip-code', title: 'The Phase-Flip Code', duration: '22 min', xp: 200, content: '<div class="lesson-section"><h2>Protecting Phases</h2><div class="lesson-text"><p>The phase-flip code protects against Z errors using Hadamard-transformed redundancy.</p></div></div>' },
        'shor-code': { id: 'shor-code', title: 'Shor\'s 9-Qubit Code', duration: '25 min', xp: 250, content: '<div class="lesson-section"><h2>Full Error Correction</h2><div class="lesson-text"><p>Combines bit-flip and phase-flip codes to correct any single-qubit error.</p></div></div>' },
        'surface-codes': { id: 'surface-codes', title: 'Surface Codes', duration: '28 min', xp: 250, content: '<div class="lesson-section"><h2>The Leading Candidate</h2><div class="lesson-text"><p>Surface codes use 2D arrays of qubits with local interactions, offering high threshold error rates.</p></div></div>' },
        'era6-quiz': { id: 'era6-quiz', title: 'Era 6 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'programming-intro': { id: 'programming-intro', title: 'Quantum Programming', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>Writing Quantum Code</h2><div class="lesson-text"><p>Multiple frameworks exist for quantum programming, each with unique features and syntax.</p></div></div>' },
        'qiskit-basics': { id: 'qiskit-basics', title: 'Qiskit Fundamentals', duration: '30 min', xp: 250, content: '<div class="lesson-section"><h2>IBM\'s Quantum SDK</h2><div class="lesson-text"><p>Qiskit is Python-based, open-source, and provides access to IBM Quantum hardware.</p></div></div>' },
        'cirq-basics': { id: 'cirq-basics', title: 'Cirq Fundamentals', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Google\'s Framework</h2><div class="lesson-text"><p>Cirq is designed for NISQ algorithms and provides fine-grained control over circuits.</p></div></div>' },
        'qsharp-basics': { id: 'qsharp-basics', title: 'Q# Fundamentals', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Microsoft\'s Language</h2><div class="lesson-text"><p>Q# is a domain-specific language designed specifically for quantum computing.</p></div></div>' },
        'pennylane-intro': { id: 'pennylane-intro', title: 'PennyLane: Quantum ML', duration: '22 min', xp: 200, content: '<div class="lesson-section"><h2>Quantum Machine Learning</h2><div class="lesson-text"><p>PennyLane bridges quantum computing with machine learning frameworks like PyTorch and TensorFlow.</p></div></div>' },
        'hybrid-algorithms': { id: 'hybrid-algorithms', title: 'Hybrid Algorithms', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Classical + Quantum</h2><div class="lesson-text"><p>NISQ-era algorithms combine classical optimization with quantum circuits.</p></div></div>' },
        'era7-quiz': { id: 'era7-quiz', title: 'Era 7 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] },

        'apps-intro': { id: 'apps-intro', title: 'Quantum Applications', duration: '15 min', xp: 100, content: '<div class="lesson-section"><h2>Real-World Use Cases</h2><div class="lesson-text"><p>Quantum computing promises breakthroughs in cryptography, optimization, simulation, and ML.</p></div></div>' },
        'quantum-crypto': { id: 'quantum-crypto', title: 'Quantum Cryptography', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Secure Communication</h2><div class="lesson-text"><p>QKD provides information-theoretically secure key exchange; post-quantum crypto protects against quantum attacks.</p></div></div>' },
        'optimization': { id: 'optimization', title: 'Quantum Optimization', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Solving Hard Problems</h2><div class="lesson-text"><p>Quantum computing may accelerate solving optimization problems in logistics, finance, and scheduling.</p></div></div>' },
        'simulation': { id: 'simulation', title: 'Quantum Simulation', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>Modeling Nature</h2><div class="lesson-text"><p>Simulating molecules and materials for drug discovery, battery design, and catalyst development.</p></div></div>' },
        'qml': { id: 'qml', title: 'Quantum Machine Learning', duration: '25 min', xp: 200, content: '<div class="lesson-section"><h2>QML Potential</h2><div class="lesson-text"><p>Quantum computers may accelerate certain ML tasks through quantum feature maps and variational circuits.</p></div></div>' },
        'future-outlook': { id: 'future-outlook', title: 'The Quantum Future', duration: '20 min', xp: 150, content: '<div class="lesson-section"><h2>What\'s Next</h2><div class="lesson-text"><p>From NISQ to fault-tolerant quantum computing: the road ahead for quantum technology.</p></div></div>' },
        'era8-quiz': { id: 'era8-quiz', title: 'Era 8 Assessment', duration: '10 min', xp: 250, type: 'quiz', questions: [] }
    },

    // ========================================
    // ACHIEVEMENTS
    // ========================================
    achievements: {
        // Learning achievements
        'first-lesson': { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '📖', xp: 50, category: 'learning' },
        'era1-complete': { id: 'era1-complete', name: 'Quantum Foundations', description: 'Complete Era 1', icon: '🎓', xp: 200, category: 'learning' },
        'era2-complete': { id: 'era2-complete', name: 'History Buff', description: 'Complete Era 2', icon: '📜', xp: 200, category: 'learning' },
        'era3-complete': { id: 'era3-complete', name: 'Gate Master', description: 'Complete Era 3', icon: '🔧', xp: 200, category: 'learning' },
        'era4-complete': { id: 'era4-complete', name: 'Algorithm Expert', description: 'Complete Era 4', icon: '⚡', xp: 300, category: 'learning' },
        'era5-complete': { id: 'era5-complete', name: 'Hardware Guru', description: 'Complete Era 5', icon: '🔬', xp: 300, category: 'learning' },
        'era6-complete': { id: 'era6-complete', name: 'Error Corrector', description: 'Complete Era 6', icon: '🛡️', xp: 300, category: 'learning' },
        'era7-complete': { id: 'era7-complete', name: 'Quantum Developer', description: 'Complete Era 7', icon: '💻', xp: 300, category: 'learning' },
        'era8-complete': { id: 'era8-complete', name: 'Visionary', description: 'Complete Era 8', icon: '🚀', xp: 300, category: 'learning' },
        'all-eras': { id: 'all-eras', name: 'Quantum Master', description: 'Complete all eras', icon: '👑', xp: 1000, category: 'learning' },

        // Lab achievements
        'first-circuit': { id: 'first-circuit', name: 'Circuit Builder', description: 'Build your first circuit', icon: '🔌', xp: 50, category: 'lab' },
        'bell-state': { id: 'bell-state', name: 'Entangler', description: 'Create a Bell state', icon: '🔗', xp: 100, category: 'lab' },
        'ghz-state': { id: 'ghz-state', name: 'Multi-Entangler', description: 'Create a GHZ state', icon: '🕸️', xp: 150, category: 'lab' },
        'teleportation': { id: 'teleportation', name: 'Teleporter', description: 'Build a teleportation circuit', icon: '✨', xp: 200, category: 'lab' },
        'circuit-100': { id: 'circuit-100', name: 'Master Builder', description: 'Build 100 circuits', icon: '🏗️', xp: 300, category: 'lab' },

        // Coding achievements
        'first-challenge': { id: 'first-challenge', name: 'Code Warrior', description: 'Complete your first challenge', icon: '⚔️', xp: 50, category: 'coding' },
        'perfect-score': { id: 'perfect-score', name: 'Perfectionist', description: 'Get 100% on any quiz', icon: '💯', xp: 100, category: 'coding' },
        'streak-7': { id: 'streak-7', name: 'Dedicated', description: '7-day learning streak', icon: '🔥', xp: 200, category: 'coding' },
        'all-challenges': { id: 'all-challenges', name: 'Challenge Master', description: 'Complete all challenges', icon: '🏆', xp: 500, category: 'coding' },

        // Special achievements
        'night-owl': { id: 'night-owl', name: 'Night Owl', description: 'Study after midnight', icon: '🦉', xp: 50, category: 'special' },
        'early-bird': { id: 'early-bird', name: 'Early Bird', description: 'Study before 6 AM', icon: '🌅', xp: 50, category: 'special' },
        'speed-demon': { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a lesson in under 5 minutes', icon: '💨', xp: 100, category: 'special' }
    },

    // ========================================
    // LEVEL SYSTEM
    // ========================================
    levels: [
        { level: 1, xpRequired: 0, title: 'Quantum Curious' },
        { level: 2, xpRequired: 200, title: 'Quantum Novice' },
        { level: 3, xpRequired: 500, title: 'Quantum Apprentice' },
        { level: 4, xpRequired: 1000, title: 'Quantum Student' },
        { level: 5, xpRequired: 1800, title: 'Quantum Scholar' },
        { level: 6, xpRequired: 2800, title: 'Quantum Practitioner' },
        { level: 7, xpRequired: 4000, title: 'Quantum Developer' },
        { level: 8, xpRequired: 5500, title: 'Quantum Engineer' },
        { level: 9, xpRequired: 7500, title: 'Quantum Expert' },
        { level: 10, xpRequired: 10000, title: 'Quantum Master' },
        { level: 11, xpRequired: 13000, title: 'Quantum Architect' },
        { level: 12, xpRequired: 17000, title: 'Quantum Pioneer' },
        { level: 13, xpRequired: 22000, title: 'Quantum Visionary' },
        { level: 14, xpRequired: 28000, title: 'Quantum Sage' },
        { level: 15, xpRequired: 35000, title: 'Quantum Legend' }
    ]
};

// Export
window.GameData = GameData;
