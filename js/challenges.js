/**
 * Quantum Quest - Coding Challenges
 *
 * Interactive quantum programming challenges with a simulated Python/Qiskit environment.
 */

const ChallengesData = [
    // BEGINNER CHALLENGES
    {
        id: 'challenge-1',
        title: 'Hello Quantum World',
        difficulty: 'beginner',
        xp: 100,
        tags: ['basics', 'superposition'],
        description: `
            <h3>Your First Quantum Program</h3>
            <p>Welcome to quantum programming! In this challenge, you'll create your first quantum state.</p>

            <p>Your task: Create an equal superposition state on a single qubit using the Hadamard gate.</p>

            <h3>Expected Output</h3>
            <p>After applying H to |0⟩, the state should be:</p>
            <pre>|+⟩ = (|0⟩ + |1⟩)/√2</pre>

            <h3>Requirements</h3>
            <ul>
                <li>Create a quantum circuit with 1 qubit</li>
                <li>Apply a Hadamard gate to qubit 0</li>
                <li>The final state should have 50% probability for both |0⟩ and |1⟩</li>
            </ul>
        `,
        starterCode: `# Create a quantum circuit with 1 qubit
qc = QuantumCircuit(1)

# TODO: Apply Hadamard gate to qubit 0


# Run and check the result
result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(1)
qc.h(0)
result = simulate(qc)
print(result)`,
        hints: [
            'The Hadamard gate is applied using qc.h(qubit_index)',
            'Qubit indices start at 0',
            'The state |+⟩ has equal probability for |0⟩ and |1⟩'
        ],
        tests: [
            {
                name: 'Circuit has 1 qubit',
                check: (code) => code.includes('QuantumCircuit(1)')
            },
            {
                name: 'Hadamard gate applied',
                check: (code) => code.includes('.h(0)') || code.includes('.h( 0 )')
            },
            {
                name: 'Creates superposition',
                validate: (state) => {
                    const prob0 = state.probabilities[0];
                    return Math.abs(prob0 - 0.5) < 0.01;
                }
            }
        ]
    },
    {
        id: 'challenge-2',
        title: 'Quantum NOT Gate',
        difficulty: 'beginner',
        xp: 100,
        tags: ['basics', 'gates'],
        description: `
            <h3>Flip That Qubit!</h3>
            <p>The Pauli-X gate is the quantum equivalent of the classical NOT gate.</p>

            <p>Your task: Start with |0⟩ and flip it to |1⟩ using the X gate.</p>

            <h3>Expected Output</h3>
            <pre>|1⟩ with 100% probability</pre>
        `,
        starterCode: `qc = QuantumCircuit(1)

# TODO: Apply X gate to flip |0⟩ to |1⟩


result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(1)
qc.x(0)
result = simulate(qc)
print(result)`,
        hints: [
            'The X gate is applied using qc.x(qubit_index)',
            'X|0⟩ = |1⟩'
        ],
        tests: [
            {
                name: 'X gate applied',
                check: (code) => code.includes('.x(0)')
            },
            {
                name: 'State is |1⟩',
                validate: (state) => state.probabilities[1] > 0.99
            }
        ]
    },
    {
        id: 'challenge-3',
        title: 'Create a Bell State',
        difficulty: 'beginner',
        xp: 150,
        tags: ['entanglement', 'multi-qubit'],
        description: `
            <h3>Quantum Entanglement</h3>
            <p>The Bell state is the simplest example of quantum entanglement. When measured, both qubits always give the same result!</p>

            <p>Your task: Create the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2</p>

            <h3>Recipe</h3>
            <ol>
                <li>Apply H to qubit 0 (creates superposition)</li>
                <li>Apply CNOT with control=0, target=1 (creates entanglement)</li>
            </ol>
        `,
        starterCode: `qc = QuantumCircuit(2)

# Step 1: Apply Hadamard to qubit 0

# Step 2: Apply CNOT with control=0, target=1


result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
result = simulate(qc)
print(result)`,
        hints: [
            'First apply H to create superposition',
            'CNOT is applied using qc.cx(control, target)',
            'The Bell state has 50% probability for |00⟩ and 50% for |11⟩'
        ],
        tests: [
            {
                name: 'Circuit has 2 qubits',
                check: (code) => code.includes('QuantumCircuit(2)')
            },
            {
                name: 'Hadamard applied',
                check: (code) => code.includes('.h(0)')
            },
            {
                name: 'CNOT applied',
                check: (code) => code.includes('.cx(0') || code.includes('.cnot(0')
            },
            {
                name: 'Creates Bell state',
                validate: (state) => {
                    const p00 = state.probabilities[0];
                    const p11 = state.probabilities[3];
                    return Math.abs(p00 - 0.5) < 0.01 && Math.abs(p11 - 0.5) < 0.01;
                }
            }
        ]
    },

    // INTERMEDIATE CHALLENGES
    {
        id: 'challenge-4',
        title: 'GHZ State',
        difficulty: 'intermediate',
        xp: 200,
        tags: ['entanglement', 'multi-qubit'],
        description: `
            <h3>Three-Qubit Entanglement</h3>
            <p>The GHZ state extends entanglement to 3 qubits: |GHZ⟩ = (|000⟩ + |111⟩)/√2</p>

            <p>All three qubits are maximally entangled - measuring any one determines all others!</p>

            <h3>Your Task</h3>
            <p>Create the 3-qubit GHZ state.</p>
        `,
        starterCode: `qc = QuantumCircuit(3)

# Create GHZ state: (|000⟩ + |111⟩)/√2
# Hint: Start with H on qubit 0, then cascade CNOTs


result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
result = simulate(qc)
print(result)`,
        hints: [
            'Start with H on qubit 0',
            'Use cascading CNOTs: 0→1, then 1→2',
            'Final state should only have |000⟩ and |111⟩'
        ],
        tests: [
            {
                name: 'Creates GHZ state',
                validate: (state) => {
                    const p000 = state.probabilities[0];
                    const p111 = state.probabilities[7];
                    const others = state.probabilities.slice(1, 7).reduce((a, b) => a + b, 0);
                    return Math.abs(p000 - 0.5) < 0.01 && Math.abs(p111 - 0.5) < 0.01 && others < 0.01;
                }
            }
        ]
    },
    {
        id: 'challenge-5',
        title: 'Phase Kickback',
        difficulty: 'intermediate',
        xp: 200,
        tags: ['algorithms', 'phase'],
        description: `
            <h3>The Power of Phase Kickback</h3>
            <p>Phase kickback is a crucial concept in quantum algorithms. When a controlled gate acts on an eigenstate of the target gate, the phase "kicks back" to the control qubit!</p>

            <h3>Your Task</h3>
            <p>Demonstrate phase kickback with CZ gate:</p>
            <ol>
                <li>Put qubit 0 in |+⟩ state (H|0⟩)</li>
                <li>Put qubit 1 in |1⟩ state (X|0⟩)</li>
                <li>Apply CZ gate</li>
            </ol>
            <p>The result shows phase kickback: qubit 0 changes from |+⟩ to |-⟩!</p>
        `,
        starterCode: `qc = QuantumCircuit(2)

# Setup: qubit 0 in |+⟩, qubit 1 in |1⟩


# Apply CZ gate


result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(2)
qc.h(0)
qc.x(1)
qc.cz(0, 1)
result = simulate(qc)
print(result)`,
        hints: [
            'Use H to create |+⟩',
            'Use X to create |1⟩',
            'CZ is applied with qc.cz(control, target)'
        ],
        tests: [
            {
                name: 'Correct setup',
                check: (code) => code.includes('.h(0)') && code.includes('.x(1)')
            },
            {
                name: 'CZ applied',
                check: (code) => code.includes('.cz(')
            }
        ]
    },
    {
        id: 'challenge-6',
        title: 'Quantum Coin Flip',
        difficulty: 'intermediate',
        xp: 150,
        tags: ['measurement', 'basics'],
        description: `
            <h3>True Randomness</h3>
            <p>Unlike classical random number generators (which are actually pseudo-random), quantum measurements provide TRUE randomness!</p>

            <h3>Your Task</h3>
            <p>Create a fair quantum coin flip that measures |+⟩ and returns 0 or 1 with equal probability.</p>
        `,
        starterCode: `qc = QuantumCircuit(1)

# Create superposition


# Measure the qubit
qc.measure(0)

result = simulate(qc, shots=1000)
print(result)`,
        solution: `qc = QuantumCircuit(1)
qc.h(0)
qc.measure(0)
result = simulate(qc, shots=1000)
print(result)`,
        hints: [
            'H gate creates equal superposition',
            'Measurement collapses to 0 or 1'
        ],
        tests: [
            {
                name: 'Superposition created',
                check: (code) => code.includes('.h(0)')
            },
            {
                name: 'Measurement included',
                check: (code) => code.includes('.measure(')
            }
        ]
    },

    // ADVANCED CHALLENGES
    {
        id: 'challenge-7',
        title: 'Deutsch Algorithm',
        difficulty: 'advanced',
        xp: 300,
        tags: ['algorithms', 'oracles'],
        description: `
            <h3>The First Quantum Algorithm</h3>
            <p>Deutsch's algorithm determines if a function f:{0,1}→{0,1} is constant or balanced in ONE query (vs 2 classically).</p>

            <h3>Algorithm Steps</h3>
            <ol>
                <li>Initialize qubits to |0⟩|1⟩</li>
                <li>Apply H to both qubits</li>
                <li>Apply the oracle U_f</li>
                <li>Apply H to first qubit</li>
                <li>Measure first qubit: 0 = constant, 1 = balanced</li>
            </ol>

            <h3>Your Task</h3>
            <p>Implement Deutsch's algorithm. The oracle for f(x) = x (balanced) is already provided.</p>
        `,
        starterCode: `qc = QuantumCircuit(2)

# Initialize |01⟩
qc.x(1)

# Apply H to both qubits


# Oracle for f(x) = x (balanced function)
qc.cx(0, 1)

# Apply H to qubit 0


# Measure qubit 0
qc.measure(0)

result = simulate(qc)
print(result)  # Should be 1 (balanced)`,
        solution: `qc = QuantumCircuit(2)
qc.x(1)
qc.h(0)
qc.h(1)
qc.cx(0, 1)
qc.h(0)
qc.measure(0)
result = simulate(qc)
print(result)`,
        hints: [
            'Apply H to both qubits before the oracle',
            'Apply H only to qubit 0 after the oracle',
            'For balanced f(x)=x, result should be 1'
        ],
        tests: [
            {
                name: 'Correct structure',
                check: (code) => {
                    const hasInit = code.includes('.x(1)');
                    const hasH0 = (code.match(/\.h\(0\)/g) || []).length >= 2;
                    const hasH1 = code.includes('.h(1)');
                    return hasInit && hasH0 && hasH1;
                }
            }
        ]
    },
    {
        id: 'challenge-8',
        title: 'Grover\'s Search (2 qubits)',
        difficulty: 'advanced',
        xp: 400,
        tags: ['algorithms', 'search'],
        description: `
            <h3>Quantum Search</h3>
            <p>Grover's algorithm finds a marked item in an unsorted database with quadratic speedup!</p>

            <h3>For 2 qubits (4 items)</h3>
            <p>One iteration is enough to find the marked state with high probability.</p>

            <h3>Algorithm</h3>
            <ol>
                <li>Initialize: H⊗H to create uniform superposition</li>
                <li>Oracle: Mark the target state |11⟩ with phase flip (CZ)</li>
                <li>Diffusion: Amplify the marked state's amplitude</li>
            </ol>

            <h3>Your Task</h3>
            <p>Implement Grover's algorithm to find |11⟩.</p>
        `,
        starterCode: `qc = QuantumCircuit(2)

# Step 1: Create uniform superposition
qc.h(0)
qc.h(1)

# Step 2: Oracle - mark |11⟩ with phase flip


# Step 3: Diffusion operator
# H on both qubits


# X on both qubits


# CZ (multi-controlled Z)


# X on both qubits


# H on both qubits


result = simulate(qc)
print(result)  # Should show |11⟩ with high probability`,
        solution: `qc = QuantumCircuit(2)
qc.h(0)
qc.h(1)
qc.cz(0, 1)
qc.h(0)
qc.h(1)
qc.x(0)
qc.x(1)
qc.cz(0, 1)
qc.x(0)
qc.x(1)
qc.h(0)
qc.h(1)
result = simulate(qc)
print(result)`,
        hints: [
            'The oracle for |11⟩ is just CZ',
            'Diffusion: H-X-CZ-X-H on both qubits',
            'After one iteration, |11⟩ should have ~100% probability'
        ],
        tests: [
            {
                name: 'Finds |11⟩',
                validate: (state) => state.probabilities[3] > 0.9
            }
        ]
    },

    // EXPERT CHALLENGES
    {
        id: 'challenge-9',
        title: 'Quantum Teleportation',
        difficulty: 'expert',
        xp: 500,
        tags: ['protocols', 'entanglement'],
        description: `
            <h3>Teleport a Quantum State</h3>
            <p>Quantum teleportation transfers a quantum state from Alice to Bob using entanglement and classical communication.</p>

            <h3>Protocol</h3>
            <ol>
                <li>Alice has qubit 0 (state to teleport)</li>
                <li>Create Bell pair between qubits 1 and 2</li>
                <li>Alice performs Bell measurement on qubits 0 and 1</li>
                <li>Bob applies corrections based on measurements</li>
            </ol>

            <h3>Your Task</h3>
            <p>Implement the teleportation circuit to teleport |+⟩ from qubit 0 to qubit 2.</p>
        `,
        starterCode: `qc = QuantumCircuit(3)

# Prepare state to teleport: |+⟩ on qubit 0
qc.h(0)

# Create Bell pair between qubits 1 and 2


# Bell measurement on qubits 0 and 1
# CNOT followed by H


# Measurements would go here in real implementation
# For simulation, we'll skip measurements

result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(3)
qc.h(0)
qc.h(1)
qc.cx(1, 2)
qc.cx(0, 1)
qc.h(0)
result = simulate(qc)
print(result)`,
        hints: [
            'Bell pair: H on qubit 1, then CNOT(1,2)',
            'Bell measurement: CNOT(0,1) then H(0)',
            'In full protocol, Bob applies X and Z based on measurements'
        ],
        tests: [
            {
                name: 'Correct structure',
                check: (code) => {
                    return code.includes('.cx(1, 2)') &&
                           code.includes('.cx(0, 1)') &&
                           (code.match(/\.h\(/g) || []).length >= 2;
                }
            }
        ]
    },
    {
        id: 'challenge-10',
        title: 'Quantum Fourier Transform',
        difficulty: 'expert',
        xp: 500,
        tags: ['algorithms', 'qft'],
        description: `
            <h3>The Quantum Fourier Transform</h3>
            <p>QFT is the quantum analog of the discrete Fourier transform and is crucial for many quantum algorithms including Shor's.</p>

            <h3>2-Qubit QFT Circuit</h3>
            <ol>
                <li>H on qubit 0</li>
                <li>Controlled-S (CR(π/2)) on qubit 0, controlled by qubit 1</li>
                <li>H on qubit 1</li>
                <li>SWAP qubits 0 and 1</li>
            </ol>

            <h3>Your Task</h3>
            <p>Implement the 2-qubit QFT.</p>
        `,
        starterCode: `qc = QuantumCircuit(2)

# Initialize in state |01⟩ for testing
qc.x(1)

# QFT implementation
# Step 1: H on qubit 0


# Step 2: Controlled-S (can use cphase or decompose)
# Controlled rotation by π/2


# Step 3: H on qubit 1


# Step 4: SWAP


result = simulate(qc)
print(result)`,
        solution: `qc = QuantumCircuit(2)
qc.x(1)
qc.h(0)
qc.cp(Math.PI/2, 1, 0)
qc.h(1)
qc.swap(0, 1)
result = simulate(qc)
print(result)`,
        hints: [
            'Controlled phase can be done with qc.cp(angle, control, target)',
            'The SWAP at the end reverses bit order',
            'QFT of |01⟩ should give a specific superposition'
        ],
        tests: [
            {
                name: 'QFT structure',
                check: (code) => {
                    return (code.match(/\.h\(/g) || []).length >= 2 &&
                           code.includes('.swap(');
                }
            }
        ]
    }
];

// Simple quantum circuit simulation environment for challenges
class ChallengeSimulator {
    constructor() {
        this.circuit = null;
        this.output = [];
    }

    // Parse and execute challenge code
    execute(code) {
        this.output = [];
        this.circuit = null;

        try {
            // Create execution context
            const context = {
                QuantumCircuit: (n) => {
                    this.circuit = new QuantumCircuit(n);
                    return this.createCircuitProxy(this.circuit);
                },
                simulate: (qc, options = {}) => this.simulate(options),
                print: (...args) => this.output.push(args.join(' ')),
                console: { log: (...args) => this.output.push(args.join(' ')) },
                Math: Math
            };

            // Execute code in context
            const func = new Function(...Object.keys(context), code);
            func(...Object.values(context));

            return {
                success: true,
                output: this.output,
                circuit: this.circuit,
                state: this.circuit ? this.circuit.run() : null
            };
        } catch (e) {
            return {
                success: false,
                error: e.message,
                output: this.output
            };
        }
    }

    createCircuitProxy(circuit) {
        return {
            h: (q) => circuit.addGate('H', [q], [], [], null),
            x: (q) => circuit.addGate('X', [q], [], [], null),
            y: (q) => circuit.addGate('Y', [q], [], [], null),
            z: (q) => circuit.addGate('Z', [q], [], [], null),
            s: (q) => circuit.addGate('S', [q], [], [], null),
            t: (q) => circuit.addGate('T', [q], [], [], null),
            rx: (theta, q) => circuit.addGate('Rx', [q], [], [theta], null),
            ry: (theta, q) => circuit.addGate('Ry', [q], [], [theta], null),
            rz: (theta, q) => circuit.addGate('Rz', [q], [], [theta], null),
            cx: (c, t) => circuit.addGate('CNOT', [c, t], [], [], null),
            cnot: (c, t) => circuit.addGate('CNOT', [c, t], [], [], null),
            cz: (c, t) => circuit.addGate('CZ', [c, t], [], [], null),
            swap: (a, b) => circuit.addGate('SWAP', [a, b], [], [], null),
            cp: (theta, c, t) => {
                // Controlled phase - decompose to native gates
                circuit.addGate('Rz', [t], [], [theta/2], null);
                circuit.addGate('CNOT', [c, t], [], [], null);
                circuit.addGate('Rz', [t], [], [-theta/2], null);
                circuit.addGate('CNOT', [c, t], [], [], null);
                circuit.addGate('Rz', [c], [], [theta/2], null);
            },
            measure: (q) => circuit.addGate('M', [q], [], [], null)
        };
    }

    simulate(options = {}) {
        if (!this.circuit) {
            throw new Error('No circuit to simulate');
        }

        const result = this.circuit.run();
        const probs = result.state.getProbabilities();

        // Format result
        const n = this.circuit.numQubits;
        const stateStr = [];
        for (let i = 0; i < probs.length; i++) {
            if (probs[i] > 0.001) {
                const label = i.toString(2).padStart(n, '0');
                stateStr.push(`|${label}⟩: ${(probs[i] * 100).toFixed(1)}%`);
            }
        }

        return {
            probabilities: probs,
            stateVector: result.state.toString(),
            formatted: stateStr.join(', ')
        };
    }
}

// Export
window.ChallengesData = ChallengesData;
window.ChallengeSimulator = ChallengeSimulator;
