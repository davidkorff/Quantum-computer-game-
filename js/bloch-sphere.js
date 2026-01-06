/**
 * Quantum Quest - Bloch Sphere Visualization
 *
 * Renders interactive 3D Bloch sphere representations of qubit states.
 */

class BlochSphere {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Options
        this.size = options.size || 150;
        this.animated = options.animated !== false;

        // State
        this.state = { x: 0, y: 0, z: 1 }; // |0⟩ state
        this.targetState = { ...this.state };

        // Animation
        this.animationProgress = 1;
        this.prevState = { ...this.state };

        // Rotation (for interactivity)
        this.rotationX = -0.4; // Tilt forward
        this.rotationY = 0.3;  // Slight side rotation
        this.autoRotate = options.autoRotate || false;
        this.autoRotateSpeed = 0.005;

        // Colors
        this.colors = {
            sphere: 'rgba(99, 102, 241, 0.1)',
            wireframe: 'rgba(99, 102, 241, 0.3)',
            axes: {
                x: '#ef4444',
                y: '#10b981',
                z: '#3b82f6'
            },
            stateVector: '#00d4ff',
            statePoint: '#ffffff',
            labels: '#a0a0c0'
        };

        // Setup
        this.resize();
        this.setupEventListeners();

        // Start animation loop
        if (this.animated) {
            this.animate();
        }
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.size * dpr;
        this.canvas.height = this.size * dpr;
        this.canvas.style.width = this.size + 'px';
        this.canvas.style.height = this.size + 'px';
        this.ctx.scale(dpr, dpr);

        this.centerX = this.size / 2;
        this.centerY = this.size / 2;
        this.radius = this.size * 0.35;
    }

    setupEventListeners() {
        let isDragging = false;
        let lastX, lastY;

        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            this.rotationY += dx * 0.01;
            this.rotationX += dy * 0.01;

            // Clamp vertical rotation
            this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));

            lastX = e.clientX;
            lastY = e.clientY;

            if (!this.animated) {
                this.render();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Set state from Bloch vector coordinates
    setState(x, y, z) {
        this.prevState = { ...this.state };
        this.targetState = { x, y, z };
        this.animationProgress = 0;
    }

    // Set state from state vector amplitudes
    setFromAmplitudes(alpha, beta) {
        // |ψ⟩ = α|0⟩ + β|1⟩
        // Bloch coordinates:
        // x = 2Re(α*β)
        // y = 2Im(α*β)
        // z = |α|² - |β|²

        if (alpha instanceof Complex && beta instanceof Complex) {
            const alphaBetaConj = alpha.mul(beta.conj());
            const x = 2 * alphaBetaConj.real;
            const y = 2 * alphaBetaConj.imag;
            const z = alpha.abs2() - beta.abs2();
            this.setState(x, y, z);
        } else {
            // Assume real numbers
            const x = 2 * alpha * beta;
            const y = 0;
            const z = alpha * alpha - beta * beta;
            this.setState(x, y, z);
        }
    }

    // Project 3D point to 2D
    project(x, y, z) {
        // Apply rotations
        let px = x;
        let py = y;
        let pz = z;

        // Rotate around X axis
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        const y1 = py * cosX - pz * sinX;
        const z1 = py * sinX + pz * cosX;
        py = y1;
        pz = z1;

        // Rotate around Y axis
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        const x1 = px * cosY + pz * sinY;
        const z2 = -px * sinY + pz * cosY;
        px = x1;
        pz = z2;

        // Project to 2D (simple orthographic)
        return {
            x: this.centerX + px * this.radius,
            y: this.centerY - py * this.radius,
            z: pz  // For depth sorting
        };
    }

    animate() {
        // Update animation
        if (this.animationProgress < 1) {
            this.animationProgress += 0.05;
            if (this.animationProgress > 1) this.animationProgress = 1;

            // Interpolate state
            const t = this.easeInOutCubic(this.animationProgress);
            this.state.x = this.prevState.x + (this.targetState.x - this.prevState.x) * t;
            this.state.y = this.prevState.y + (this.targetState.y - this.prevState.y) * t;
            this.state.z = this.prevState.z + (this.targetState.z - this.prevState.z) * t;
        }

        // Auto-rotate
        if (this.autoRotate) {
            this.rotationY += this.autoRotateSpeed;
        }

        this.render();
        requestAnimationFrame(() => this.animate());
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    render() {
        const ctx = this.ctx;

        // Clear
        ctx.clearRect(0, 0, this.size, this.size);

        // Draw sphere wireframe
        this.drawSphereWireframe();

        // Draw axes (back)
        this.drawAxes(true);

        // Draw state vector
        this.drawStateVector();

        // Draw axes (front)
        this.drawAxes(false);

        // Draw axis labels
        this.drawAxisLabels();
    }

    drawSphereWireframe() {
        const ctx = this.ctx;

        // Draw latitude circles
        ctx.strokeStyle = this.colors.wireframe;
        ctx.lineWidth = 0.5;

        for (let lat = -60; lat <= 60; lat += 30) {
            const r = Math.cos(lat * Math.PI / 180);
            const z = Math.sin(lat * Math.PI / 180);

            ctx.beginPath();
            for (let lon = 0; lon <= 360; lon += 10) {
                const x = r * Math.cos(lon * Math.PI / 180);
                const y = r * Math.sin(lon * Math.PI / 180);
                const p = this.project(x, y, z);

                if (lon === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();
        }

        // Draw longitude circles
        for (let lon = 0; lon < 180; lon += 30) {
            ctx.beginPath();
            for (let lat = 0; lat <= 360; lat += 10) {
                const x = Math.cos(lat * Math.PI / 180) * Math.cos(lon * Math.PI / 180);
                const y = Math.cos(lat * Math.PI / 180) * Math.sin(lon * Math.PI / 180);
                const z = Math.sin(lat * Math.PI / 180);
                const p = this.project(x, y, z);

                if (lat === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();
        }

        // Draw equator (thicker)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 5) {
            const x = Math.cos(lon * Math.PI / 180);
            const y = Math.sin(lon * Math.PI / 180);
            const p = this.project(x, y, 0);

            if (lon === 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
    }

    drawAxes(back) {
        const ctx = this.ctx;

        const axes = [
            { dir: [1, 0, 0], color: this.colors.axes.x, label: 'X' },
            { dir: [0, 1, 0], color: this.colors.axes.y, label: 'Y' },
            { dir: [0, 0, 1], color: this.colors.axes.z, label: 'Z' }
        ];

        for (const axis of axes) {
            const p1 = this.project(-axis.dir[0], -axis.dir[1], -axis.dir[2]);
            const p2 = this.project(axis.dir[0], axis.dir[1], axis.dir[2]);

            // Only draw if in correct depth layer
            const isBack = (p1.z + p2.z) / 2 < 0;
            if (isBack !== back) continue;

            ctx.strokeStyle = axis.color;
            ctx.lineWidth = back ? 1 : 2;
            ctx.globalAlpha = back ? 0.3 : 1;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Draw arrow head on positive end
            if (!back) {
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const arrowSize = 6;

                ctx.beginPath();
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(
                    p2.x - arrowSize * Math.cos(angle - Math.PI / 6),
                    p2.y - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(
                    p2.x - arrowSize * Math.cos(angle + Math.PI / 6),
                    p2.y - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
        }
    }

    drawAxisLabels() {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.labels;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // |0⟩ and |1⟩ labels
        const p0 = this.project(0, 0, 1.2);
        const p1 = this.project(0, 0, -1.2);

        ctx.fillStyle = this.colors.axes.z;
        ctx.fillText('|0⟩', p0.x, p0.y);
        ctx.fillText('|1⟩', p1.x, p1.y);

        // |+⟩ and |-⟩ labels
        const pPlus = this.project(1.2, 0, 0);
        const pMinus = this.project(-1.2, 0, 0);

        ctx.fillStyle = this.colors.axes.x;
        ctx.fillText('|+⟩', pPlus.x, pPlus.y);
        ctx.fillText('|-⟩', pMinus.x, pMinus.y);

        // |+i⟩ and |-i⟩ labels
        const pPlusI = this.project(0, 1.2, 0);
        const pMinusI = this.project(0, -1.2, 0);

        ctx.fillStyle = this.colors.axes.y;
        ctx.fillText('|+i⟩', pPlusI.x, pPlusI.y);
        ctx.fillText('|-i⟩', pMinusI.x, pMinusI.y);
    }

    drawStateVector() {
        const ctx = this.ctx;
        const { x, y, z } = this.state;

        // Normalize (should already be normalized, but just in case)
        const len = Math.sqrt(x * x + y * y + z * z);
        const nx = len > 0 ? x / len : 0;
        const ny = len > 0 ? y / len : 0;
        const nz = len > 0 ? z / len : 1;

        const origin = this.project(0, 0, 0);
        const end = this.project(nx, ny, nz);

        // State vector line
        ctx.strokeStyle = this.colors.stateVector;
        ctx.lineWidth = 3;
        ctx.shadowColor = this.colors.stateVector;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // State point
        ctx.fillStyle = this.colors.statePoint;
        ctx.beginPath();
        ctx.arc(end.x, end.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.colors.stateVector;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw projection lines (dashed)
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        // Projection to XY plane
        const projXY = this.project(nx, ny, 0);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(projXY.x, projXY.y);
        ctx.lineTo(origin.x, origin.y);
        ctx.stroke();

        ctx.setLineDash([]);
    }
}

// Helper function to create multiple Bloch spheres for multi-qubit systems
function createBlochSpheres(container, numQubits, size = 120) {
    container.innerHTML = '';
    const spheres = [];

    for (let i = 0; i < numQubits; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'bloch-sphere-container';

        const canvas = document.createElement('canvas');
        canvas.className = 'bloch-sphere-canvas';

        const label = document.createElement('div');
        label.className = 'bloch-sphere-label';
        label.textContent = `Qubit ${i}`;

        wrapper.appendChild(canvas);
        wrapper.appendChild(label);
        container.appendChild(wrapper);

        const sphere = new BlochSphere(canvas, { size, animated: true });
        spheres.push(sphere);
    }

    return spheres;
}

// Export
window.BlochSphere = BlochSphere;
window.createBlochSpheres = createBlochSpheres;
