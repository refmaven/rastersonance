/**
 * WebGL2 2D Graphics Library - Interactive Demo
 * Demonstrates all features of the library
 */

import { Graphics2D, Vec2, Mat3, Color, Colors } from '../src/index.js';

class DemoApplication {
    constructor() {
        const canvas = document.getElementById('glCanvas');
        this.graphics = new Graphics2D(canvas);
        this.canvas = canvas;

        this.time = 0;
        this.demoMode = true;
        this.showFPS = false;
        this.frameCount = 0;
        this.lastTime = Date.now();

        // Setup event listeners
        document.getElementById('toggleDemo').addEventListener('click', () => {
            this.demoMode = !this.demoMode;
            console.log(this.demoMode ? 'Switched to full demo' : 'Switched to minimal demo');
        });

        document.getElementById('toggleFPS').addEventListener('click', () => {
            this.showFPS = !this.showFPS;
            document.getElementById('fps-counter').style.display = this.showFPS ? 'block' : 'none';
        });

        // Create FPS counter element
        const fpsCounter = document.createElement('div');
        fpsCounter.id = 'fps-counter';
        document.body.appendChild(fpsCounter);

        // Handle canvas resize on window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    /**
     * Animation loop
     */
    animate = () => {
        this.time += 0.016; // Approximately 60 FPS

        // Clear canvas
        this.graphics.clear(Color.rgb(20, 20, 30));

        if (this.demoMode) {
            this.drawFullDemo();
        } else {
            this.drawMinimalDemo();
        }

        // Update FPS
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastTime >= 1000) {
            const fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
            
            const counter = document.getElementById('fps-counter');
            if (counter) counter.textContent = `FPS: ${fps}`;
        }

        requestAnimationFrame(this.animate);
    };

    /**
     * Draw comprehensive demo showing all features
     */
    drawFullDemo() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // ====== Animated Rectangles ======
        this.graphics.fillRect(
            50 + Math.sin(this.time) * 30,
            50,
            80,
            60,
            Color.rgb(100, 200, 255),
            this.time * 0.5
        );

        // Stroked rectangle
        this.graphics.strokeRect(
            200,
            50,
            100,
            80,
            Color.rgb(255, 100, 100),
            2
        );

        // ====== Animated Circles ======
        this.graphics.fillCircle(
            width / 2,
            100,
            40 + Math.sin(this.time * 2) * 20,
            Color.rgb(255, 200, 0),
            48
        );

        // Circle outline
        this.graphics.strokeCircle(
            width / 2 + 150,
            100,
            50,
            Color.rgb(100, 255, 200),
            3,
            64
        );

        // ====== Triangle ======
        this.graphics.fillTriangle(
            100, 250,
            150, 350,
            50, 350,
            Color.rgb(255, 100, 200)
        );

        // ====== Animated Ray Pattern ======
        const centerX = width / 2;
        const centerY = height / 2;
        const rays = 12;
        const radius = 80;

        for (let i = 0; i < rays; i++) {
            const angle = (i / rays) * Math.PI * 2;
            const x1 = centerX + Math.cos(angle) * 30;
            const y1 = centerY + Math.sin(angle) * 30;
            const x2 = centerX + Math.cos(angle) * (radius + Math.sin(this.time) * 20);
            const y2 = centerY + Math.sin(angle) * (radius + Math.sin(this.time) * 20);

            const hue = (i / rays + this.time * 0.3) % 1;
            const color = this.hsvToRgb(hue, 0.8, 0.9);

            this.graphics.strokeLine(x1, y1, x2, y2, color, 2);
        }

        // ====== Animated Star Polygon ======
        const points = [];
        const sides = 8;
        const innerRadius = 30;
        const outerRadius = 60;

        for (let i = 0; i < sides * 2; i++) {
            const angle = (i / (sides * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            points.push([
                width - 100 + Math.cos(angle) * r,
                250 + Math.sin(angle) * r,
            ]);
        }

        this.graphics.fillPolygon(
            points,
            Color.rgb(200, 100, 255)
        );

        this.graphics.strokePolygon(
            points,
            Color.rgb(255, 255, 100),
            2
        );

        // ====== Grid of Pulsing Circles ======
        const gridSize = 8;
        const cellSize = 40;
        const gridY = height - 150;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < 2; y++) {
                const posX = 50 + x * cellSize;
                const posY = gridY + y * cellSize;
                const dist = Math.sqrt(
                    Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2)
                );
                const pulse = Math.sin(this.time * 3 - dist * 0.01) * 0.5 + 0.5;

                this.graphics.fillCircle(
                    posX,
                    posY,
                    10 * pulse,
                    this.hsvToRgb(
                        (x / gridSize + this.time * 0.2) % 1,
                        0.7,
                        0.8 + pulse * 0.2
                    ),
                    24
                );
            }
        }

        // ====== Info Text (Simple) ======
        this.graphics.fillRect(10, 10, 180, 50, Color.rgb(0, 0, 0, 150));
        this.graphics.fillRect(15, 15, 170, 40, Color.rgb(50, 50, 60));
    }

    /**
     * Draw minimal example
     */
    drawMinimalDemo() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Simple rectangle
        this.graphics.fillRect(
            width / 2 - 100,
            height / 2 - 50,
            200,
            100,
            Color.rgb(100, 150, 255)
        );

        // Circle
        this.graphics.fillCircle(
            100,
            100,
            50,
            Color.rgb(255, 100, 100),
            32
        );

        // Diagonal line
        this.graphics.strokeLine(
            0, 0,
            width, height,
            Color.rgb(100, 255, 100),
            2
        );

        // Animated pattern
        const numLines = 20;
        for (let i = 0; i < numLines; i++) {
            const t = (i / numLines + this.time * 0.2) % 1;
            const x = width * t;
            const y = Math.sin(t * Math.PI * 2 + this.time) * 100 + height / 2;
            
            this.graphics.fillCircle(x, y, 5, this.hsvToRgb(t, 0.8, 0.9), 16);
        }
    }

    /**
     * Convert HSV color to RGB
     * @param {number} h - Hue (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {number[]} RGB color [r, g, b, a]
     */
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
        const m = v - c;

        let r, g, b;
        if (h < 1 / 6) [r, g, b] = [c, x, 0];
        else if (h < 2 / 6) [r, g, b] = [x, c, 0];
        else if (h < 3 / 6) [r, g, b] = [0, c, x];
        else if (h < 4 / 6) [r, g, b] = [0, x, c];
        else if (h < 5 / 6) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];

        return [(r + m), (g + m), (b + m), 1];
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const width = Math.max(400, Math.min(rect.width - 40, 800));
        const height = Math.max(300, Math.min(rect.height - 40, 600));
        this.graphics.resize(width, height);
    }
}

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const demo = new DemoApplication();
    console.log('WebGL2 2D Graphics Demo Started');
});
