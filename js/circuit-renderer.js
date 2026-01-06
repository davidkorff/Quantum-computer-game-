/**
 * Quantum Quest - Circuit Renderer
 *
 * Renders quantum circuits on HTML5 canvas with interactive features.
 */

class CircuitRenderer {
    constructor(canvas, circuit) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.circuit = circuit;

        // Styling
        this.colors = {
            background: '#16162e',
            wire: '#4a4a6a',
            wireLabel: '#8b8bab',
            gate: '#6366f1',
            gateText: '#ffffff',
            gateHover: '#8b5cf6',
            control: '#10b981',
            measurement: '#f59e0b',
            highlight: '#00d4ff'
        };

        // Dimensions
        this.cellWidth = 60;
        this.cellHeight = 50;
        this.gateSize = 40;
        this.padding = { left: 60, top: 30, right: 40, bottom: 30 };

        // State
        this.hoveredGate = null;
        this.selectedGate = null;
        this.draggedGate = null;
        this.dragOffset = { x: 0, y: 0 };

        // Setup canvas size
        this.resize();

        // Event listeners
        this.setupEventListeners();
    }

    resize() {
        const numCols = Math.max(this.circuit.gates.length > 0
            ? Math.max(...this.circuit.gates.map(g => g.column)) + 3
            : 5, 8);
        const numRows = this.circuit.numQubits;

        const width = this.padding.left + numCols * this.cellWidth + this.padding.right;
        const height = this.padding.top + numRows * this.cellHeight + this.padding.bottom;

        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.ctx.scale(dpr, dpr);

        this.width = width;
        this.height = height;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Drag and drop from palette
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.canvas.parentElement.classList.add('drag-over');
        });

        this.canvas.addEventListener('dragleave', () => {
            this.canvas.parentElement.classList.remove('drag-over');
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.canvas.parentElement.classList.remove('drag-over');
            this.handleDrop(e);
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    getCellFromPos(pos) {
        const col = Math.floor((pos.x - this.padding.left) / this.cellWidth);
        const row = Math.floor((pos.y - this.padding.top) / this.cellHeight);
        return { col, row };
    }

    getPosFromCell(col, row) {
        return {
            x: this.padding.left + col * this.cellWidth + this.cellWidth / 2,
            y: this.padding.top + row * this.cellHeight + this.cellHeight / 2
        };
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        const cell = this.getCellFromPos(pos);

        // Check if hovering over a gate
        const gate = this.circuit.getGateAt(cell.col, cell.row);

        if (gate !== this.hoveredGate) {
            this.hoveredGate = gate;
            this.render();

            // Update gate info panel
            if (gate && window.updateGateInfo) {
                window.updateGateInfo(gate.name);
            }
        }

        // Handle dragging
        if (this.draggedGate) {
            this.render();
            this.drawDraggedGate(pos);
        }
    }

    handleClick(e) {
        const pos = this.getMousePos(e);
        const cell = this.getCellFromPos(pos);

        if (cell.col >= 0 && cell.row >= 0 && cell.row < this.circuit.numQubits) {
            const gate = this.circuit.getGateAt(cell.col, cell.row);

            if (gate) {
                this.selectedGate = gate;
            } else {
                this.selectedGate = null;
            }

            this.render();
        }
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const cell = this.getCellFromPos(pos);
        const gate = this.circuit.getGateAt(cell.col, cell.row);

        if (gate) {
            this.draggedGate = gate;
            this.dragOffset = {
                x: pos.x - this.getPosFromCell(gate.column, gate.targets[0]).x,
                y: pos.y - this.getPosFromCell(gate.column, gate.targets[0]).y
            };
        }
    }

    handleMouseUp(e) {
        if (this.draggedGate) {
            const pos = this.getMousePos(e);
            const cell = this.getCellFromPos(pos);

            if (cell.col >= 0 && cell.row >= 0 && cell.row < this.circuit.numQubits) {
                // Update gate position
                const gateInfo = GateInfo[this.draggedGate.name];
                const numQubits = gateInfo ? gateInfo.qubits : 1;

                if (numQubits === 1) {
                    this.draggedGate.targets = [cell.row];
                    this.draggedGate.column = cell.col;
                } else if (numQubits === 2 && cell.row < this.circuit.numQubits - 1) {
                    this.draggedGate.targets = [cell.row, cell.row + 1];
                    this.draggedGate.column = cell.col;
                }

                // Trigger circuit update
                if (window.onCircuitChange) {
                    window.onCircuitChange();
                }
            }

            this.draggedGate = null;
            this.render();
        }
    }

    handleMouseLeave() {
        this.hoveredGate = null;
        this.draggedGate = null;
        this.render();
    }

    handleContextMenu(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const cell = this.getCellFromPos(pos);
        const gate = this.circuit.getGateAt(cell.col, cell.row);

        if (gate) {
            // Remove gate
            this.circuit.removeGate(cell.col, cell.row);
            this.selectedGate = null;
            this.render();

            if (window.onCircuitChange) {
                window.onCircuitChange();
            }
        }
    }

    handleDrop(e) {
        const pos = this.getMousePos(e);
        const cell = this.getCellFromPos(pos);
        const gateName = e.dataTransfer.getData('gate');

        if (gateName && cell.col >= 0 && cell.row >= 0 && cell.row < this.circuit.numQubits) {
            const gateInfo = GateInfo[gateName];
            const numQubits = gateInfo ? gateInfo.qubits : 1;

            let targets;
            if (numQubits === 1) {
                targets = [cell.row];
            } else if (numQubits === 2) {
                if (cell.row >= this.circuit.numQubits - 1) {
                    targets = [cell.row - 1, cell.row];
                } else {
                    targets = [cell.row, cell.row + 1];
                }
            } else if (numQubits === 3) {
                if (cell.row >= this.circuit.numQubits - 2) {
                    targets = [this.circuit.numQubits - 3, this.circuit.numQubits - 2, this.circuit.numQubits - 1];
                } else {
                    targets = [cell.row, cell.row + 1, cell.row + 2];
                }
            }

            // Check for default rotation angle
            let params = [];
            if (['Rx', 'Ry', 'Rz'].includes(gateName)) {
                params = [Math.PI / 2]; // Default to π/2
            }

            this.circuit.addGate(gateName, targets, [], params, cell.col);
            this.render();

            if (window.onCircuitChange) {
                window.onCircuitChange();
            }
        }
    }

    render() {
        this.resize();
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw wires
        this.drawWires();

        // Draw gates
        this.drawGates();

        // Draw drop zones (subtle grid)
        this.drawDropZones();
    }

    drawWires() {
        const ctx = this.ctx;

        for (let i = 0; i < this.circuit.numQubits; i++) {
            const y = this.padding.top + i * this.cellHeight + this.cellHeight / 2;

            // Wire line
            ctx.strokeStyle = this.colors.wire;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.padding.left - 20, y);
            ctx.lineTo(this.width - this.padding.right + 20, y);
            ctx.stroke();

            // Qubit label
            ctx.fillStyle = this.colors.wireLabel;
            ctx.font = '14px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`q${i}`, this.padding.left - 25, y);

            // Initial state
            ctx.fillStyle = this.colors.wireLabel;
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.fillText('|0⟩', 5, y);
        }
    }

    drawDropZones() {
        const ctx = this.ctx;
        const numCols = Math.ceil((this.width - this.padding.left - this.padding.right) / this.cellWidth);

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;

        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < this.circuit.numQubits; row++) {
                const pos = this.getPosFromCell(col, row);
                ctx.strokeRect(
                    pos.x - this.cellWidth / 2,
                    pos.y - this.cellHeight / 2,
                    this.cellWidth,
                    this.cellHeight
                );
            }
        }
    }

    drawGates() {
        // Sort gates by column for proper rendering
        const sortedGates = [...this.circuit.gates].sort((a, b) => a.column - b.column);

        for (const gate of sortedGates) {
            this.drawGate(gate);
        }
    }

    drawGate(gate) {
        const ctx = this.ctx;
        const { name, targets, controls, column } = gate;

        const isHovered = this.hoveredGate === gate;
        const isSelected = this.selectedGate === gate;

        // Get gate info
        const gateInfo = GateInfo[name] || { symbol: name, qubits: targets.length };

        // Calculate position
        const x = this.padding.left + column * this.cellWidth + this.cellWidth / 2;

        // Draw control connections for multi-qubit gates
        if (targets.length > 1) {
            const minTarget = Math.min(...targets);
            const maxTarget = Math.max(...targets);
            const y1 = this.padding.top + minTarget * this.cellHeight + this.cellHeight / 2;
            const y2 = this.padding.top + maxTarget * this.cellHeight + this.cellHeight / 2;

            ctx.strokeStyle = this.colors.gate;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
        }

        // Draw control dots
        for (const ctrl of controls) {
            const cy = this.padding.top + ctrl * this.cellHeight + this.cellHeight / 2;
            ctx.fillStyle = this.colors.control;
            ctx.beginPath();
            ctx.arc(x, cy, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw gate based on type
        if (name === 'M') {
            // Measurement gate - special drawing
            this.drawMeasurementGate(x, targets[0], isHovered, isSelected);
        } else if (name === 'CNOT' && targets.length === 2) {
            // CNOT with control dot and target ⊕
            const controlY = this.padding.top + targets[0] * this.cellHeight + this.cellHeight / 2;
            const targetY = this.padding.top + targets[1] * this.cellHeight + this.cellHeight / 2;

            // Control dot
            ctx.fillStyle = isHovered ? this.colors.gateHover : this.colors.gate;
            ctx.beginPath();
            ctx.arc(x, controlY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Target ⊕
            ctx.strokeStyle = isHovered ? this.colors.gateHover : this.colors.gate;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, targetY, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x - 12, targetY);
            ctx.lineTo(x + 12, targetY);
            ctx.moveTo(x, targetY - 12);
            ctx.lineTo(x, targetY + 12);
            ctx.stroke();
        } else if (name === 'SWAP') {
            // SWAP gate - two X marks
            const y1 = this.padding.top + targets[0] * this.cellHeight + this.cellHeight / 2;
            const y2 = this.padding.top + targets[1] * this.cellHeight + this.cellHeight / 2;

            ctx.strokeStyle = isHovered ? this.colors.gateHover : this.colors.gate;
            ctx.lineWidth = 2;

            // Draw X at each qubit
            for (const y of [y1, y2]) {
                ctx.beginPath();
                ctx.moveTo(x - 8, y - 8);
                ctx.lineTo(x + 8, y + 8);
                ctx.moveTo(x + 8, y - 8);
                ctx.lineTo(x - 8, y + 8);
                ctx.stroke();
            }
        } else if (name === 'CZ') {
            // CZ - two control dots
            for (const target of targets) {
                const y = this.padding.top + target * this.cellHeight + this.cellHeight / 2;
                ctx.fillStyle = isHovered ? this.colors.gateHover : this.colors.gate;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Standard box gate
            for (const target of targets) {
                const y = this.padding.top + target * this.cellHeight + this.cellHeight / 2;
                this.drawBoxGate(x, y, gateInfo.symbol, isHovered, isSelected);
            }
        }

        // Draw selection highlight
        if (isSelected) {
            ctx.strokeStyle = this.colors.highlight;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            const minTarget = Math.min(...targets);
            const maxTarget = Math.max(...targets);
            const y1 = this.padding.top + minTarget * this.cellHeight + this.cellHeight / 2;
            const y2 = this.padding.top + maxTarget * this.cellHeight + this.cellHeight / 2;

            ctx.strokeRect(
                x - this.gateSize / 2 - 5,
                y1 - this.gateSize / 2 - 5,
                this.gateSize + 10,
                (maxTarget - minTarget) * this.cellHeight + this.gateSize + 10
            );

            ctx.setLineDash([]);
        }
    }

    drawBoxGate(x, y, symbol, isHovered, isSelected) {
        const ctx = this.ctx;
        const size = this.gateSize;

        // Gate box
        ctx.fillStyle = isHovered ? this.colors.gateHover : this.colors.gate;
        ctx.strokeStyle = isSelected ? this.colors.highlight : 'transparent';
        ctx.lineWidth = 2;

        // Rounded rectangle
        const radius = 6;
        ctx.beginPath();
        ctx.roundRect(x - size / 2, y - size / 2, size, size, radius);
        ctx.fill();
        if (isSelected) ctx.stroke();

        // Gate symbol
        ctx.fillStyle = this.colors.gateText;
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, x, y);
    }

    drawMeasurementGate(x, target, isHovered, isSelected) {
        const ctx = this.ctx;
        const y = this.padding.top + target * this.cellHeight + this.cellHeight / 2;
        const size = this.gateSize;

        // Gate box
        ctx.fillStyle = isHovered ? '#fbbf24' : this.colors.measurement;

        const radius = 6;
        ctx.beginPath();
        ctx.roundRect(x - size / 2, y - size / 2, size, size, radius);
        ctx.fill();

        // Meter symbol
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Arc
        ctx.beginPath();
        ctx.arc(x, y + 5, 12, Math.PI, 0);
        ctx.stroke();

        // Needle
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x + 8, y - 8);
        ctx.stroke();
    }

    drawDraggedGate(mousePos) {
        if (!this.draggedGate) return;

        const ctx = this.ctx;
        const gateInfo = GateInfo[this.draggedGate.name] || { symbol: this.draggedGate.name };

        ctx.globalAlpha = 0.7;
        this.drawBoxGate(mousePos.x, mousePos.y, gateInfo.symbol, true, false);
        ctx.globalAlpha = 1;
    }
}

// Export
window.CircuitRenderer = CircuitRenderer;
