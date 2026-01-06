/**
 * Quantum Quest - Quantum Circuit Simulator
 *
 * Simulates quantum circuits by maintaining state vectors and applying gates.
 */

class QuantumCircuit {
    constructor(numQubits = 2) {
        this.numQubits = numQubits;
        this.state = new StateVector(numQubits);
        this.gates = []; // Array of gate operations
        this.currentStep = 0;
        this.measurements = {}; // Store measurement results
    }

    // Reset to initial state
    reset() {
        this.state = new StateVector(this.numQubits);
        this.currentStep = 0;
        this.measurements = {};
    }

    // Clear all gates
    clear() {
        this.gates = [];
        this.reset();
    }

    // Add a qubit
    addQubit() {
        if (this.numQubits >= 8) {
            throw new Error('Maximum 8 qubits supported for performance reasons');
        }
        this.numQubits++;
        this.reset();
    }

    // Remove a qubit
    removeQubit() {
        if (this.numQubits <= 1) {
            throw new Error('Must have at least 1 qubit');
        }
        this.numQubits--;
        // Remove gates that reference removed qubit
        this.gates = this.gates.filter(gate => {
            const maxQubit = Math.max(...gate.targets, ...(gate.controls || []));
            return maxQubit < this.numQubits;
        });
        this.reset();
    }

    // Set number of qubits
    setNumQubits(n) {
        if (n < 1 || n > 8) {
            throw new Error('Number of qubits must be between 1 and 8');
        }
        this.numQubits = n;
        this.gates = this.gates.filter(gate => {
            const maxQubit = Math.max(...gate.targets, ...(gate.controls || []));
            return maxQubit < this.numQubits;
        });
        this.reset();
    }

    // Add a gate to the circuit
    addGate(gateName, targets, controls = [], params = [], column = null) {
        const gate = {
            name: gateName,
            targets: Array.isArray(targets) ? targets : [targets],
            controls: controls,
            params: params,
            column: column !== null ? column : this.getNextColumn()
        };
        this.gates.push(gate);
        return gate;
    }

    // Remove a gate at specific position
    removeGate(column, qubit) {
        this.gates = this.gates.filter(gate => {
            if (gate.column !== column) return true;
            const allQubits = [...gate.targets, ...(gate.controls || [])];
            return !allQubits.includes(qubit);
        });
    }

    // Get the next available column
    getNextColumn() {
        if (this.gates.length === 0) return 0;
        return Math.max(...this.gates.map(g => g.column)) + 1;
    }

    // Get gate at specific position
    getGateAt(column, qubit) {
        return this.gates.find(gate => {
            if (gate.column !== column) return false;
            const allQubits = [...gate.targets, ...(gate.controls || [])];
            return allQubits.includes(qubit);
        });
    }

    // Build the full unitary matrix for a gate operation
    buildGateMatrix(gate) {
        const { name, targets, controls, params } = gate;

        // Get the base gate matrix
        let baseMatrix;
        if (typeof QuantumGates[name] === 'function') {
            baseMatrix = QuantumGates[name](...params);
        } else {
            baseMatrix = QuantumGates[name];
        }

        if (!baseMatrix) {
            throw new Error(`Unknown gate: ${name}`);
        }

        // For single-qubit gates without controls
        if (targets.length === 1 && controls.length === 0) {
            return this.embedSingleQubitGate(baseMatrix, targets[0]);
        }

        // For two-qubit gates (CNOT, CZ, SWAP)
        if (targets.length === 2 && controls.length === 0) {
            return this.embedTwoQubitGate(baseMatrix, targets[0], targets[1]);
        }

        // For controlled single-qubit gates
        if (targets.length === 1 && controls.length > 0) {
            return this.buildControlledGate(baseMatrix, targets[0], controls);
        }

        // For multi-qubit gates like CNOT with explicit control
        if (targets.length === 1 && controls.length === 1) {
            return this.embedTwoQubitGate(QuantumGates.CNOT, controls[0], targets[0]);
        }

        // For Toffoli
        if (name === 'TOFFOLI') {
            return this.embedThreeQubitGate(baseMatrix, targets[0], targets[1], targets[2]);
        }

        throw new Error(`Cannot build matrix for gate configuration: ${name}`);
    }

    // Embed single-qubit gate into full system
    embedSingleQubitGate(gate, qubit) {
        const n = this.numQubits;
        let result = null;

        for (let i = 0; i < n; i++) {
            const current = (i === qubit) ? gate : QuantumGates.I;
            if (result === null) {
                result = current;
            } else {
                result = result.tensor(current);
            }
        }

        return result;
    }

    // Embed two-qubit gate into full system
    embedTwoQubitGate(gate, qubit1, qubit2) {
        const n = this.numQubits;
        const dim = Math.pow(2, n);
        const result = new Matrix(dim, dim);

        // Initialize to zeros
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                result.set(i, j, new Complex(0, 0));
            }
        }

        // Build the permuted matrix
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                // Extract bits for the two qubits
                const bit1_i = (i >> (n - 1 - qubit1)) & 1;
                const bit2_i = (i >> (n - 1 - qubit2)) & 1;
                const bit1_j = (j >> (n - 1 - qubit1)) & 1;
                const bit2_j = (j >> (n - 1 - qubit2)) & 1;

                // Check if other bits match
                const mask = ~((1 << (n - 1 - qubit1)) | (1 << (n - 1 - qubit2)));
                if ((i & mask) !== (j & mask)) continue;

                // Get the 2-qubit indices
                const idx_i = (bit1_i << 1) | bit2_i;
                const idx_j = (bit1_j << 1) | bit2_j;

                result.set(i, j, gate.get(idx_i, idx_j).clone());
            }
        }

        return result;
    }

    // Embed three-qubit gate into full system
    embedThreeQubitGate(gate, q0, q1, q2) {
        const n = this.numQubits;
        const dim = Math.pow(2, n);
        const result = new Matrix(dim, dim);

        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                result.set(i, j, new Complex(0, 0));
            }
        }

        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                const bit0_i = (i >> (n - 1 - q0)) & 1;
                const bit1_i = (i >> (n - 1 - q1)) & 1;
                const bit2_i = (i >> (n - 1 - q2)) & 1;
                const bit0_j = (j >> (n - 1 - q0)) & 1;
                const bit1_j = (j >> (n - 1 - q1)) & 1;
                const bit2_j = (j >> (n - 1 - q2)) & 1;

                const mask = ~((1 << (n - 1 - q0)) | (1 << (n - 1 - q1)) | (1 << (n - 1 - q2)));
                if ((i & mask) !== (j & mask)) continue;

                const idx_i = (bit0_i << 2) | (bit1_i << 1) | bit2_i;
                const idx_j = (bit0_j << 2) | (bit1_j << 1) | bit2_j;

                result.set(i, j, gate.get(idx_i, idx_j).clone());
            }
        }

        return result;
    }

    // Build controlled gate matrix
    buildControlledGate(baseGate, target, controls) {
        const n = this.numQubits;
        const dim = Math.pow(2, n);
        const result = Matrix.identity(dim);

        for (let i = 0; i < dim; i++) {
            // Check if all control qubits are |1⟩
            let allControlsOn = true;
            for (const ctrl of controls) {
                if (((i >> (n - 1 - ctrl)) & 1) === 0) {
                    allControlsOn = false;
                    break;
                }
            }

            if (allControlsOn) {
                // Apply the base gate to the target qubit
                const targetBit = (i >> (n - 1 - target)) & 1;
                for (let j = 0; j < 2; j++) {
                    const gateElement = baseGate.get(targetBit, j);
                    if (!gateElement.isZero()) {
                        // Calculate the new index by flipping the target bit
                        const newTargetBit = j;
                        const newIdx = (i & ~(1 << (n - 1 - target))) |
                                       (newTargetBit << (n - 1 - target));
                        result.set(i, newIdx, gateElement.clone());
                    }
                }
                // Clear diagonal if gate changes it
                if (!baseGate.get(targetBit, targetBit).equals(new Complex(1, 0))) {
                    result.set(i, i, baseGate.get(targetBit, targetBit).clone());
                }
            }
        }

        return result;
    }

    // Run the entire circuit
    run() {
        this.reset();

        // Sort gates by column
        const sortedGates = [...this.gates].sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            if (gate.name === 'M') {
                // Measurement
                for (const target of gate.targets) {
                    this.measurements[`q${target}_col${gate.column}`] = this.state.measureQubit(target);
                }
            } else {
                const matrix = this.buildGateMatrix(gate);
                this.state.applyMatrix(matrix);
            }
        }

        return {
            state: this.state,
            measurements: this.measurements
        };
    }

    // Step through circuit one gate at a time
    step() {
        const sortedGates = [...this.gates].sort((a, b) => a.column - b.column);

        if (this.currentStep >= sortedGates.length) {
            return null; // Circuit complete
        }

        const gate = sortedGates[this.currentStep];

        if (gate.name === 'M') {
            for (const target of gate.targets) {
                this.measurements[`q${target}_col${gate.column}`] = this.state.measureQubit(target);
            }
        } else {
            const matrix = this.buildGateMatrix(gate);
            this.state.applyMatrix(matrix);
        }

        this.currentStep++;

        return {
            gate: gate,
            state: this.state.clone(),
            step: this.currentStep,
            total: sortedGates.length
        };
    }

    // Get total unitary matrix for the circuit
    getUnitaryMatrix() {
        let result = Matrix.identity(Math.pow(2, this.numQubits));

        const sortedGates = [...this.gates]
            .filter(g => g.name !== 'M')
            .sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            const matrix = this.buildGateMatrix(gate);
            result = matrix.mul(result);
        }

        return result;
    }

    // Export circuit as Qiskit code
    toQiskit() {
        let code = `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister\n`;
        code += `from qiskit.circuit.library import *\n`;
        code += `import numpy as np\n\n`;
        code += `# Create quantum circuit\n`;
        code += `qr = QuantumRegister(${this.numQubits}, 'q')\n`;

        const hasMeasurements = this.gates.some(g => g.name === 'M');
        if (hasMeasurements) {
            code += `cr = ClassicalRegister(${this.numQubits}, 'c')\n`;
            code += `qc = QuantumCircuit(qr, cr)\n\n`;
        } else {
            code += `qc = QuantumCircuit(qr)\n\n`;
        }

        const sortedGates = [...this.gates].sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            const t = gate.targets[0];
            const t2 = gate.targets[1];
            const c = gate.controls[0];

            switch (gate.name) {
                case 'H':
                    code += `qc.h(qr[${t}])\n`;
                    break;
                case 'X':
                    code += `qc.x(qr[${t}])\n`;
                    break;
                case 'Y':
                    code += `qc.y(qr[${t}])\n`;
                    break;
                case 'Z':
                    code += `qc.z(qr[${t}])\n`;
                    break;
                case 'S':
                    code += `qc.s(qr[${t}])\n`;
                    break;
                case 'T':
                    code += `qc.t(qr[${t}])\n`;
                    break;
                case 'Rx':
                    code += `qc.rx(${gate.params[0]}, qr[${t}])\n`;
                    break;
                case 'Ry':
                    code += `qc.ry(${gate.params[0]}, qr[${t}])\n`;
                    break;
                case 'Rz':
                    code += `qc.rz(${gate.params[0]}, qr[${t}])\n`;
                    break;
                case 'CNOT':
                    if (gate.controls.length > 0) {
                        code += `qc.cx(qr[${c}], qr[${t}])\n`;
                    } else {
                        code += `qc.cx(qr[${gate.targets[0]}], qr[${gate.targets[1]}])\n`;
                    }
                    break;
                case 'CZ':
                    code += `qc.cz(qr[${gate.targets[0]}], qr[${gate.targets[1]}])\n`;
                    break;
                case 'SWAP':
                    code += `qc.swap(qr[${gate.targets[0]}], qr[${gate.targets[1]}])\n`;
                    break;
                case 'TOFFOLI':
                    code += `qc.ccx(qr[${gate.targets[0]}], qr[${gate.targets[1]}], qr[${gate.targets[2]}])\n`;
                    break;
                case 'M':
                    code += `qc.measure(qr[${t}], cr[${t}])\n`;
                    break;
            }
        }

        code += `\n# Draw or run the circuit\n`;
        code += `print(qc.draw())\n`;

        return code;
    }

    // Export circuit as Cirq code
    toCirq() {
        let code = `import cirq\n`;
        code += `import numpy as np\n\n`;
        code += `# Define qubits\n`;
        code += `qubits = [cirq.LineQubit(i) for i in range(${this.numQubits})]\n\n`;
        code += `# Create circuit\n`;
        code += `circuit = cirq.Circuit()\n\n`;

        const sortedGates = [...this.gates].sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            const t = gate.targets[0];
            const t2 = gate.targets[1];

            switch (gate.name) {
                case 'H':
                    code += `circuit.append(cirq.H(qubits[${t}]))\n`;
                    break;
                case 'X':
                    code += `circuit.append(cirq.X(qubits[${t}]))\n`;
                    break;
                case 'Y':
                    code += `circuit.append(cirq.Y(qubits[${t}]))\n`;
                    break;
                case 'Z':
                    code += `circuit.append(cirq.Z(qubits[${t}]))\n`;
                    break;
                case 'S':
                    code += `circuit.append(cirq.S(qubits[${t}]))\n`;
                    break;
                case 'T':
                    code += `circuit.append(cirq.T(qubits[${t}]))\n`;
                    break;
                case 'Rx':
                    code += `circuit.append(cirq.rx(${gate.params[0]})(qubits[${t}]))\n`;
                    break;
                case 'Ry':
                    code += `circuit.append(cirq.ry(${gate.params[0]})(qubits[${t}]))\n`;
                    break;
                case 'Rz':
                    code += `circuit.append(cirq.rz(${gate.params[0]})(qubits[${t}]))\n`;
                    break;
                case 'CNOT':
                    if (gate.controls.length > 0) {
                        code += `circuit.append(cirq.CNOT(qubits[${gate.controls[0]}], qubits[${t}]))\n`;
                    } else {
                        code += `circuit.append(cirq.CNOT(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]))\n`;
                    }
                    break;
                case 'CZ':
                    code += `circuit.append(cirq.CZ(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]))\n`;
                    break;
                case 'SWAP':
                    code += `circuit.append(cirq.SWAP(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]))\n`;
                    break;
                case 'TOFFOLI':
                    code += `circuit.append(cirq.TOFFOLI(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}], qubits[${gate.targets[2]}]))\n`;
                    break;
                case 'M':
                    code += `circuit.append(cirq.measure(qubits[${t}], key='m${t}'))\n`;
                    break;
            }
        }

        code += `\n# Print circuit\n`;
        code += `print(circuit)\n`;

        return code;
    }

    // Export circuit as Q# code
    toQSharp() {
        let code = `namespace QuantumQuest {\n`;
        code += `    open Microsoft.Quantum.Canon;\n`;
        code += `    open Microsoft.Quantum.Intrinsic;\n`;
        code += `    open Microsoft.Quantum.Measurement;\n\n`;
        code += `    @EntryPoint()\n`;
        code += `    operation RunCircuit() : Result[] {\n`;
        code += `        use qubits = Qubit[${this.numQubits}];\n`;
        code += `        mutable results = [];\n\n`;

        const sortedGates = [...this.gates].sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            const t = gate.targets[0];

            switch (gate.name) {
                case 'H':
                    code += `        H(qubits[${t}]);\n`;
                    break;
                case 'X':
                    code += `        X(qubits[${t}]);\n`;
                    break;
                case 'Y':
                    code += `        Y(qubits[${t}]);\n`;
                    break;
                case 'Z':
                    code += `        Z(qubits[${t}]);\n`;
                    break;
                case 'S':
                    code += `        S(qubits[${t}]);\n`;
                    break;
                case 'T':
                    code += `        T(qubits[${t}]);\n`;
                    break;
                case 'Rx':
                    code += `        Rx(${gate.params[0]}, qubits[${t}]);\n`;
                    break;
                case 'Ry':
                    code += `        Ry(${gate.params[0]}, qubits[${t}]);\n`;
                    break;
                case 'Rz':
                    code += `        Rz(${gate.params[0]}, qubits[${t}]);\n`;
                    break;
                case 'CNOT':
                    if (gate.controls.length > 0) {
                        code += `        CNOT(qubits[${gate.controls[0]}], qubits[${t}]);\n`;
                    } else {
                        code += `        CNOT(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]);\n`;
                    }
                    break;
                case 'CZ':
                    code += `        CZ(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]);\n`;
                    break;
                case 'SWAP':
                    code += `        SWAP(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}]);\n`;
                    break;
                case 'TOFFOLI':
                    code += `        CCNOT(qubits[${gate.targets[0]}], qubits[${gate.targets[1]}], qubits[${gate.targets[2]}]);\n`;
                    break;
                case 'M':
                    code += `        set results += [M(qubits[${t}])];\n`;
                    break;
            }
        }

        code += `\n        ResetAll(qubits);\n`;
        code += `        return results;\n`;
        code += `    }\n`;
        code += `}\n`;

        return code;
    }

    // Serialize circuit for saving
    serialize() {
        return JSON.stringify({
            numQubits: this.numQubits,
            gates: this.gates
        });
    }

    // Load circuit from serialized data
    static deserialize(data) {
        const obj = typeof data === 'string' ? JSON.parse(data) : data;
        const circuit = new QuantumCircuit(obj.numQubits);
        circuit.gates = obj.gates;
        return circuit;
    }
}

// Preset circuits for learning
const CircuitPresets = {
    bell: {
        name: 'Bell State',
        description: 'Creates maximally entangled state (|00⟩ + |11⟩)/√2',
        qubits: 2,
        gates: [
            { name: 'H', targets: [0], controls: [], params: [], column: 0 },
            { name: 'CNOT', targets: [0, 1], controls: [], params: [], column: 1 }
        ]
    },

    ghz: {
        name: 'GHZ State',
        description: 'Creates 3-qubit GHZ state (|000⟩ + |111⟩)/√2',
        qubits: 3,
        gates: [
            { name: 'H', targets: [0], controls: [], params: [], column: 0 },
            { name: 'CNOT', targets: [0, 1], controls: [], params: [], column: 1 },
            { name: 'CNOT', targets: [1, 2], controls: [], params: [], column: 2 }
        ]
    },

    teleport: {
        name: 'Quantum Teleportation',
        description: 'Circuit for teleporting quantum state from qubit 0 to qubit 2',
        qubits: 3,
        gates: [
            // Prepare Bell pair between q1 and q2
            { name: 'H', targets: [1], controls: [], params: [], column: 0 },
            { name: 'CNOT', targets: [1, 2], controls: [], params: [], column: 1 },
            // Alice's operations
            { name: 'CNOT', targets: [0, 1], controls: [], params: [], column: 2 },
            { name: 'H', targets: [0], controls: [], params: [], column: 3 },
            // Measurements would go here in real teleportation
        ]
    },

    grover2: {
        name: 'Grover\'s Algorithm (2-qubit)',
        description: 'Searches for |11⟩ in 2-qubit space',
        qubits: 2,
        gates: [
            // Initialize superposition
            { name: 'H', targets: [0], controls: [], params: [], column: 0 },
            { name: 'H', targets: [1], controls: [], params: [], column: 0 },
            // Oracle for |11⟩
            { name: 'CZ', targets: [0, 1], controls: [], params: [], column: 1 },
            // Diffusion operator
            { name: 'H', targets: [0], controls: [], params: [], column: 2 },
            { name: 'H', targets: [1], controls: [], params: [], column: 2 },
            { name: 'X', targets: [0], controls: [], params: [], column: 3 },
            { name: 'X', targets: [1], controls: [], params: [], column: 3 },
            { name: 'CZ', targets: [0, 1], controls: [], params: [], column: 4 },
            { name: 'X', targets: [0], controls: [], params: [], column: 5 },
            { name: 'X', targets: [1], controls: [], params: [], column: 5 },
            { name: 'H', targets: [0], controls: [], params: [], column: 6 },
            { name: 'H', targets: [1], controls: [], params: [], column: 6 },
        ]
    },

    qft: {
        name: 'Quantum Fourier Transform',
        description: '3-qubit QFT circuit',
        qubits: 3,
        gates: [
            { name: 'H', targets: [0], controls: [], params: [], column: 0 },
            { name: 'S', targets: [0], controls: [], params: [], column: 1 },
            { name: 'T', targets: [0], controls: [], params: [], column: 2 },
            { name: 'H', targets: [1], controls: [], params: [], column: 3 },
            { name: 'S', targets: [1], controls: [], params: [], column: 4 },
            { name: 'H', targets: [2], controls: [], params: [], column: 5 },
            { name: 'SWAP', targets: [0, 2], controls: [], params: [], column: 6 },
        ]
    }
};

// Export
window.QuantumCircuit = QuantumCircuit;
window.CircuitPresets = CircuitPresets;
