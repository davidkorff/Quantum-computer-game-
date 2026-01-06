/**
 * Quantum Quest - Quantum Mathematics Library
 *
 * This library provides the mathematical foundations for quantum computing simulation:
 * - Complex number arithmetic
 * - Matrix operations
 * - Tensor products
 * - Quantum gate definitions
 */

// ============================================
// Complex Number Class
// ============================================

class Complex {
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    // Addition
    add(other) {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    // Subtraction
    sub(other) {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    // Multiplication
    mul(other) {
        if (typeof other === 'number') {
            return new Complex(this.real * other, this.imag * other);
        }
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    // Division
    div(other) {
        if (typeof other === 'number') {
            return new Complex(this.real / other, this.imag / other);
        }
        const denom = other.real * other.real + other.imag * other.imag;
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / denom,
            (this.imag * other.real - this.real * other.imag) / denom
        );
    }

    // Conjugate
    conj() {
        return new Complex(this.real, -this.imag);
    }

    // Magnitude (absolute value)
    abs() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    // Magnitude squared (for probabilities)
    abs2() {
        return this.real * this.real + this.imag * this.imag;
    }

    // Phase angle
    phase() {
        return Math.atan2(this.imag, this.real);
    }

    // Exponential: e^(i*theta)
    static exp(theta) {
        return new Complex(Math.cos(theta), Math.sin(theta));
    }

    // Square root
    sqrt() {
        const r = this.abs();
        const theta = this.phase();
        return new Complex(
            Math.sqrt(r) * Math.cos(theta / 2),
            Math.sqrt(r) * Math.sin(theta / 2)
        );
    }

    // Check if approximately zero
    isZero(epsilon = 1e-10) {
        return Math.abs(this.real) < epsilon && Math.abs(this.imag) < epsilon;
    }

    // Check equality
    equals(other, epsilon = 1e-10) {
        return Math.abs(this.real - other.real) < epsilon &&
               Math.abs(this.imag - other.imag) < epsilon;
    }

    // Clone
    clone() {
        return new Complex(this.real, this.imag);
    }

    // String representation
    toString(precision = 4) {
        const r = this.real.toFixed(precision);
        const i = Math.abs(this.imag).toFixed(precision);

        if (Math.abs(this.imag) < 1e-10) {
            return r;
        }
        if (Math.abs(this.real) < 1e-10) {
            return this.imag >= 0 ? `${i}i` : `-${i}i`;
        }
        return this.imag >= 0 ? `${r}+${i}i` : `${r}-${i}i`;
    }

    // Format for display (prettier)
    toDisplayString() {
        const r = Math.abs(this.real) < 1e-10 ? 0 : this.real;
        const i = Math.abs(this.imag) < 1e-10 ? 0 : this.imag;

        if (i === 0) {
            return this.formatNumber(r);
        }
        if (r === 0) {
            if (Math.abs(i - 1) < 1e-10) return 'i';
            if (Math.abs(i + 1) < 1e-10) return '-i';
            return `${this.formatNumber(i)}i`;
        }
        const iStr = Math.abs(i - 1) < 1e-10 ? '' :
                     Math.abs(i + 1) < 1e-10 ? '-' :
                     this.formatNumber(Math.abs(i));
        return i >= 0 ? `${this.formatNumber(r)}+${iStr}i` : `${this.formatNumber(r)}-${iStr}i`;
    }

    formatNumber(n) {
        // Check for common values
        const sqrt2 = 1 / Math.sqrt(2);
        const sqrt3 = Math.sqrt(3);

        if (Math.abs(n - 1) < 1e-10) return '1';
        if (Math.abs(n + 1) < 1e-10) return '-1';
        if (Math.abs(n - 0.5) < 1e-10) return '½';
        if (Math.abs(n + 0.5) < 1e-10) return '-½';
        if (Math.abs(n - sqrt2) < 1e-10) return '1/√2';
        if (Math.abs(n + sqrt2) < 1e-10) return '-1/√2';
        if (Math.abs(n) < 1e-10) return '0';

        return n.toFixed(3).replace(/\.?0+$/, '');
    }
}

// Common complex numbers
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
Complex.MINUS_I = new Complex(0, -1);

// ============================================
// Matrix Class (for quantum operations)
// ============================================

class Matrix {
    constructor(rows, cols, data = null) {
        this.rows = rows;
        this.cols = cols;

        if (data) {
            this.data = data;
        } else {
            // Initialize with zeros
            this.data = [];
            for (let i = 0; i < rows; i++) {
                this.data[i] = [];
                for (let j = 0; j < cols; j++) {
                    this.data[i][j] = new Complex(0, 0);
                }
            }
        }
    }

    // Get element
    get(i, j) {
        return this.data[i][j];
    }

    // Set element
    set(i, j, value) {
        if (typeof value === 'number') {
            this.data[i][j] = new Complex(value, 0);
        } else {
            this.data[i][j] = value;
        }
    }

    // Create from 2D array
    static fromArray(arr) {
        const rows = arr.length;
        const cols = arr[0].length;
        const m = new Matrix(rows, cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const val = arr[i][j];
                if (typeof val === 'number') {
                    m.set(i, j, new Complex(val, 0));
                } else if (val instanceof Complex) {
                    m.set(i, j, val.clone());
                } else {
                    m.set(i, j, new Complex(val.real || 0, val.imag || 0));
                }
            }
        }
        return m;
    }

    // Identity matrix
    static identity(n) {
        const m = new Matrix(n, n);
        for (let i = 0; i < n; i++) {
            m.set(i, i, Complex.ONE);
        }
        return m;
    }

    // Matrix addition
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions must match for addition');
        }
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(i, j, this.get(i, j).add(other.get(i, j)));
            }
        }
        return result;
    }

    // Matrix multiplication
    mul(other) {
        if (other instanceof Matrix) {
            if (this.cols !== other.rows) {
                throw new Error('Matrix dimensions incompatible for multiplication');
            }
            const result = new Matrix(this.rows, other.cols);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < other.cols; j++) {
                    let sum = new Complex(0, 0);
                    for (let k = 0; k < this.cols; k++) {
                        sum = sum.add(this.get(i, k).mul(other.get(k, j)));
                    }
                    result.set(i, j, sum);
                }
            }
            return result;
        } else {
            // Scalar multiplication
            const scalar = typeof other === 'number' ? new Complex(other, 0) : other;
            const result = new Matrix(this.rows, this.cols);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    result.set(i, j, this.get(i, j).mul(scalar));
                }
            }
            return result;
        }
    }

    // Conjugate transpose (dagger)
    dagger() {
        const result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(j, i, this.get(i, j).conj());
            }
        }
        return result;
    }

    // Transpose
    transpose() {
        const result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(j, i, this.get(i, j).clone());
            }
        }
        return result;
    }

    // Tensor product (Kronecker product)
    tensor(other) {
        const result = new Matrix(this.rows * other.rows, this.cols * other.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                for (let k = 0; k < other.rows; k++) {
                    for (let l = 0; l < other.cols; l++) {
                        result.set(
                            i * other.rows + k,
                            j * other.cols + l,
                            this.get(i, j).mul(other.get(k, l))
                        );
                    }
                }
            }
        }
        return result;
    }

    // Clone
    clone() {
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(i, j, this.get(i, j).clone());
            }
        }
        return result;
    }

    // Check if unitary (U†U = I)
    isUnitary(epsilon = 1e-10) {
        if (this.rows !== this.cols) return false;
        const product = this.dagger().mul(this);
        const identity = Matrix.identity(this.rows);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!product.get(i, j).equals(identity.get(i, j), epsilon)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Trace
    trace() {
        if (this.rows !== this.cols) {
            throw new Error('Trace only defined for square matrices');
        }
        let sum = new Complex(0, 0);
        for (let i = 0; i < this.rows; i++) {
            sum = sum.add(this.get(i, i));
        }
        return sum;
    }

    // Convert to array
    toArray() {
        return this.data.map(row => row.map(c => c.clone()));
    }

    // String representation
    toString() {
        let str = '';
        for (let i = 0; i < this.rows; i++) {
            str += '[ ';
            for (let j = 0; j < this.cols; j++) {
                str += this.get(i, j).toDisplayString().padStart(10) + ' ';
            }
            str += ']\n';
        }
        return str;
    }
}

// ============================================
// Quantum State Vector
// ============================================

class StateVector {
    constructor(numQubits) {
        this.numQubits = numQubits;
        this.dim = Math.pow(2, numQubits);
        this.amplitudes = new Array(this.dim);

        // Initialize to |0...0⟩
        for (let i = 0; i < this.dim; i++) {
            this.amplitudes[i] = new Complex(i === 0 ? 1 : 0, 0);
        }
    }

    // Get amplitude for basis state
    get(index) {
        return this.amplitudes[index];
    }

    // Set amplitude
    set(index, value) {
        if (typeof value === 'number') {
            this.amplitudes[index] = new Complex(value, 0);
        } else {
            this.amplitudes[index] = value;
        }
    }

    // Reset to |0...0⟩
    reset() {
        for (let i = 0; i < this.dim; i++) {
            this.amplitudes[i] = new Complex(i === 0 ? 1 : 0, 0);
        }
    }

    // Apply a matrix/gate to the state
    applyMatrix(matrix) {
        const newAmps = new Array(this.dim);
        for (let i = 0; i < this.dim; i++) {
            newAmps[i] = new Complex(0, 0);
            for (let j = 0; j < this.dim; j++) {
                newAmps[i] = newAmps[i].add(matrix.get(i, j).mul(this.amplitudes[j]));
            }
        }
        this.amplitudes = newAmps;
    }

    // Get probabilities for each basis state
    getProbabilities() {
        return this.amplitudes.map(amp => amp.abs2());
    }

    // Normalize the state
    normalize() {
        let sum = 0;
        for (const amp of this.amplitudes) {
            sum += amp.abs2();
        }
        const norm = Math.sqrt(sum);
        if (norm > 1e-10) {
            for (let i = 0; i < this.dim; i++) {
                this.amplitudes[i] = this.amplitudes[i].div(norm);
            }
        }
    }

    // Measure the state (collapses to a basis state)
    measure() {
        const probs = this.getProbabilities();
        const r = Math.random();
        let cumulative = 0;

        for (let i = 0; i < this.dim; i++) {
            cumulative += probs[i];
            if (r < cumulative) {
                // Collapse to this state
                for (let j = 0; j < this.dim; j++) {
                    this.amplitudes[j] = new Complex(j === i ? 1 : 0, 0);
                }
                return i;
            }
        }

        // Fallback (shouldn't happen with normalized state)
        return this.dim - 1;
    }

    // Measure a single qubit (partial measurement)
    measureQubit(qubitIndex) {
        const probs = this.getProbabilities();

        // Calculate probability of measuring |0⟩ for this qubit
        let prob0 = 0;
        for (let i = 0; i < this.dim; i++) {
            if (((i >> (this.numQubits - 1 - qubitIndex)) & 1) === 0) {
                prob0 += probs[i];
            }
        }

        // Determine measurement outcome
        const outcome = Math.random() < prob0 ? 0 : 1;
        const probOutcome = outcome === 0 ? prob0 : 1 - prob0;

        // Collapse state
        const normFactor = Math.sqrt(probOutcome);
        for (let i = 0; i < this.dim; i++) {
            const qubitValue = (i >> (this.numQubits - 1 - qubitIndex)) & 1;
            if (qubitValue !== outcome) {
                this.amplitudes[i] = new Complex(0, 0);
            } else {
                this.amplitudes[i] = this.amplitudes[i].div(normFactor);
            }
        }

        return outcome;
    }

    // Get single qubit reduced density matrix (for Bloch sphere)
    getReducedDensityMatrix(qubitIndex) {
        const rho = [[new Complex(0, 0), new Complex(0, 0)],
                     [new Complex(0, 0), new Complex(0, 0)]];

        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                // Check if i and j differ only in the target qubit
                const mask = ~(1 << (this.numQubits - 1 - qubitIndex));
                if ((i & mask) === (j & mask)) {
                    const qi = (i >> (this.numQubits - 1 - qubitIndex)) & 1;
                    const qj = (j >> (this.numQubits - 1 - qubitIndex)) & 1;
                    rho[qi][qj] = rho[qi][qj].add(
                        this.amplitudes[i].mul(this.amplitudes[j].conj())
                    );
                }
            }
        }

        return rho;
    }

    // Get Bloch sphere coordinates for a single qubit
    getBlochCoordinates(qubitIndex) {
        const rho = this.getReducedDensityMatrix(qubitIndex);

        // Bloch vector components from density matrix:
        // x = 2*Re(rho[0][1])
        // y = 2*Im(rho[0][1])
        // z = rho[0][0] - rho[1][1]

        const x = 2 * rho[0][1].real;
        const y = 2 * rho[0][1].imag;
        const z = rho[0][0].real - rho[1][1].real;

        return { x, y, z };
    }

    // Clone
    clone() {
        const copy = new StateVector(this.numQubits);
        for (let i = 0; i < this.dim; i++) {
            copy.amplitudes[i] = this.amplitudes[i].clone();
        }
        return copy;
    }

    // Get basis state label (e.g., "|01⟩")
    static getBasisLabel(index, numQubits) {
        return '|' + index.toString(2).padStart(numQubits, '0') + '⟩';
    }

    // String representation
    toString() {
        let str = '';
        for (let i = 0; i < this.dim; i++) {
            if (!this.amplitudes[i].isZero()) {
                if (str.length > 0) str += ' + ';
                str += `(${this.amplitudes[i].toDisplayString()})${StateVector.getBasisLabel(i, this.numQubits)}`;
            }
        }
        return str || '0';
    }
}

// ============================================
// Quantum Gate Definitions
// ============================================

const QuantumGates = {
    // Single-qubit gates

    // Identity
    I: Matrix.fromArray([
        [1, 0],
        [0, 1]
    ]),

    // Pauli-X (NOT gate)
    X: Matrix.fromArray([
        [0, 1],
        [1, 0]
    ]),

    // Pauli-Y
    Y: Matrix.fromArray([
        [new Complex(0, 0), new Complex(0, -1)],
        [new Complex(0, 1), new Complex(0, 0)]
    ]),

    // Pauli-Z
    Z: Matrix.fromArray([
        [1, 0],
        [0, -1]
    ]),

    // Hadamard
    H: Matrix.fromArray([
        [1/Math.sqrt(2), 1/Math.sqrt(2)],
        [1/Math.sqrt(2), -1/Math.sqrt(2)]
    ]),

    // S gate (phase gate, √Z)
    S: Matrix.fromArray([
        [1, 0],
        [0, new Complex(0, 1)]
    ]),

    // S-dagger
    Sdg: Matrix.fromArray([
        [1, 0],
        [0, new Complex(0, -1)]
    ]),

    // T gate (π/8 gate)
    T: Matrix.fromArray([
        [1, 0],
        [0, Complex.exp(Math.PI / 4)]
    ]),

    // T-dagger
    Tdg: Matrix.fromArray([
        [1, 0],
        [0, Complex.exp(-Math.PI / 4)]
    ]),

    // Rotation gates
    Rx: (theta) => Matrix.fromArray([
        [new Complex(Math.cos(theta/2), 0), new Complex(0, -Math.sin(theta/2))],
        [new Complex(0, -Math.sin(theta/2)), new Complex(Math.cos(theta/2), 0)]
    ]),

    Ry: (theta) => Matrix.fromArray([
        [Math.cos(theta/2), -Math.sin(theta/2)],
        [Math.sin(theta/2), Math.cos(theta/2)]
    ]),

    Rz: (theta) => Matrix.fromArray([
        [Complex.exp(-theta/2), 0],
        [0, Complex.exp(theta/2)]
    ]),

    // Phase gate
    P: (theta) => Matrix.fromArray([
        [1, 0],
        [0, Complex.exp(theta)]
    ]),

    // Two-qubit gates (4x4 matrices)

    // CNOT (Controlled-X)
    CNOT: Matrix.fromArray([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0]
    ]),

    // CZ (Controlled-Z)
    CZ: Matrix.fromArray([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, -1]
    ]),

    // SWAP
    SWAP: Matrix.fromArray([
        [1, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ]),

    // √SWAP
    SQRTSWAP: Matrix.fromArray([
        [1, 0, 0, 0],
        [0, new Complex(0.5, 0.5), new Complex(0.5, -0.5), 0],
        [0, new Complex(0.5, -0.5), new Complex(0.5, 0.5), 0],
        [0, 0, 0, 1]
    ]),

    // iSWAP
    ISWAP: Matrix.fromArray([
        [1, 0, 0, 0],
        [0, 0, new Complex(0, 1), 0],
        [0, new Complex(0, 1), 0, 0],
        [0, 0, 0, 1]
    ]),

    // Three-qubit gates (8x8 matrices)

    // Toffoli (CCNOT)
    TOFFOLI: (() => {
        const m = Matrix.identity(8);
        // Swap |110⟩ and |111⟩
        m.set(6, 6, new Complex(0, 0));
        m.set(6, 7, new Complex(1, 0));
        m.set(7, 6, new Complex(1, 0));
        m.set(7, 7, new Complex(0, 0));
        return m;
    })(),

    // Fredkin (CSWAP)
    FREDKIN: (() => {
        const m = Matrix.identity(8);
        // Swap |101⟩ and |110⟩
        m.set(5, 5, new Complex(0, 0));
        m.set(5, 6, new Complex(1, 0));
        m.set(6, 5, new Complex(1, 0));
        m.set(6, 6, new Complex(0, 0));
        return m;
    })()
};

// Gate metadata for UI
const GateInfo = {
    I: {
        name: 'Identity',
        symbol: 'I',
        description: 'Does nothing to the qubit. Useful as a placeholder.',
        qubits: 1
    },
    H: {
        name: 'Hadamard',
        symbol: 'H',
        description: 'Creates superposition. Transforms |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2.',
        qubits: 1
    },
    X: {
        name: 'Pauli-X (NOT)',
        symbol: 'X',
        description: 'Quantum NOT gate. Flips |0⟩ to |1⟩ and vice versa. Rotation by π around X-axis.',
        qubits: 1
    },
    Y: {
        name: 'Pauli-Y',
        symbol: 'Y',
        description: 'Rotation by π around Y-axis. Applies both bit-flip and phase-flip.',
        qubits: 1
    },
    Z: {
        name: 'Pauli-Z',
        symbol: 'Z',
        description: 'Phase-flip gate. Leaves |0⟩ unchanged, maps |1⟩ to -|1⟩.',
        qubits: 1
    },
    S: {
        name: 'S Gate (√Z)',
        symbol: 'S',
        description: 'Phase gate. Applies phase of π/2 to |1⟩. Square root of Z.',
        qubits: 1
    },
    T: {
        name: 'T Gate (π/8)',
        symbol: 'T',
        description: 'Applies phase of π/4 to |1⟩. Important for universal quantum computation.',
        qubits: 1
    },
    Rx: {
        name: 'Rotation-X',
        symbol: 'Rx',
        description: 'Rotation around X-axis by angle θ.',
        qubits: 1,
        params: ['θ']
    },
    Ry: {
        name: 'Rotation-Y',
        symbol: 'Ry',
        description: 'Rotation around Y-axis by angle θ.',
        qubits: 1,
        params: ['θ']
    },
    Rz: {
        name: 'Rotation-Z',
        symbol: 'Rz',
        description: 'Rotation around Z-axis by angle θ.',
        qubits: 1,
        params: ['θ']
    },
    CNOT: {
        name: 'CNOT (Controlled-X)',
        symbol: '⊕',
        description: 'Controlled-NOT gate. Flips target qubit if control qubit is |1⟩. Creates entanglement.',
        qubits: 2
    },
    CZ: {
        name: 'Controlled-Z',
        symbol: 'CZ',
        description: 'Applies Z gate to target if control is |1⟩. Symmetric between control and target.',
        qubits: 2
    },
    SWAP: {
        name: 'SWAP',
        symbol: '×',
        description: 'Exchanges the states of two qubits.',
        qubits: 2
    },
    TOFFOLI: {
        name: 'Toffoli (CCNOT)',
        symbol: '⊕',
        description: 'Controlled-Controlled-NOT. Flips target if both controls are |1⟩. Universal for classical computation.',
        qubits: 3
    },
    M: {
        name: 'Measurement',
        symbol: '📏',
        description: 'Measures the qubit in computational basis, collapsing superposition.',
        qubits: 1
    }
};

// Export for use in other modules
window.Complex = Complex;
window.Matrix = Matrix;
window.StateVector = StateVector;
window.QuantumGates = QuantumGates;
window.GateInfo = GateInfo;
