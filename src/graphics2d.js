/**
 * Graphics2D - WebGL2 2D Graphics Engine
 * High-level 2D rendering API using WebGL2
 */

import { Mat3 } from './math.js';
import * as Colors from './colors.js';

/**
 * Graphics2D - Main rendering engine
 * Provides high-level 2D drawing functions with WebGL2 backend
 */
export class Graphics2D {
    /**
     * Initialize the Graphics2D engine
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @throws {Error} If WebGL2 is not supported
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            antialias: true,
            alpha: false,
        });

        if (!this.gl) {
            throw new Error('WebGL2 not supported');
        }

        this.program = null;
        this.vao = null;
        this.vertices = [];
        this.colors = [];
        this.vertexBuffer = null;
        this.colorBuffer = null;
        this.projectionMatrix = Mat3.identity();

        this.setupShaders();
        this.setupBuffers();
        this.setProjection(0, canvas.width, canvas.height, 0);

        // Enable blending for transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    /**
     * Setup vertex and fragment shaders
     */
    setupShaders() {
        const vertexShaderSource = `#version 300 es
            precision highp float;

            in vec2 position;
            in vec4 color;

            uniform mat3 projection;
            uniform mat3 transform;

            out vec4 fragColor;

            void main() {
                vec3 pos = transform * vec3(position, 1.0);
                pos = projection * pos;
                gl_Position = vec4(pos.xy, 0.0, 1.0);
                fragColor = color;
            }
        `;

        const fragmentShaderSource = `#version 300 es
            precision highp float;

            in vec4 fragColor;
            out vec4 outColor;

            void main() {
                outColor = fragColor;
            }
        `;

        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Program linking failed: ' + this.gl.getProgramInfoLog(this.program));
        }

        this.gl.useProgram(this.program);
    }

    /**
     * Compile a shader
     * @private
     * @param {string} source - Shader source code
     * @param {number} type - Shader type (VERTEX_SHADER or FRAGMENT_SHADER)
     * @returns {WebGLShader} Compiled shader
     */
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Shader compilation failed: ' + this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    /**
     * Setup vertex and color buffers
     * @private
     */
    setupBuffers() {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        // Vertex buffer
        this.vertexBuffer = this.gl.createBuffer();
        const positionLoc = this.gl.getAttribLocation(this.program, 'position');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

        // Color buffer
        this.colorBuffer = this.gl.createBuffer();
        const colorLoc = this.gl.getAttribLocation(this.program, 'color');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.enableVertexAttribArray(colorLoc);
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, 0, 0);
    }

    /**
     * Set orthographic projection
     * @param {number} left - Left bound
     * @param {number} right - Right bound
     * @param {number} bottom - Bottom bound
     * @param {number} top - Top bound
     */
    setProjection(left, right, bottom, top) {
        this.projectionMatrix = Mat3.orthographic(left, right, bottom, top);
        const projLoc = this.gl.getUniformLocation(this.program, 'projection');
        this.gl.uniformMatrix3fv(projLoc, false, this.projectionMatrix);
    }

    /**
     * Set transform matrix
     * @param {Float32Array} matrix - Transform matrix
     */
    setTransform(matrix) {
        const transformLoc = this.gl.getUniformLocation(this.program, 'transform');
        this.gl.uniformMatrix3fv(transformLoc, false, matrix);
    }

    /**
     * Clear canvas
     * @param {number[]} color - Clear color [r, g, b, a]
     */
    clear(color = Colors.predefined.BLACK) {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    /**
     * Flush and draw all vertices
     * @private
     */
    flush() {
        if (this.vertices.length === 0) return;

        // Update buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.DYNAMIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.DYNAMIC_DRAW);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);

        this.vertices = [];
        this.colors = [];
    }

    /**
     * Draw a rectangle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} rotation - Rotation in radians (optional)
     */
    fillRect(x, y, width, height, color = Colors.predefined.WHITE, rotation = 0) {
        const halfW = width / 2;
        const halfH = height / 2;

        const transform = Mat3.transform(x + halfW, y + halfH, rotation, 1, 1);
        this.setTransform(transform);

        this.addTriangle(
            [-halfW, -halfH],
            [halfW, -halfH],
            [halfW, halfH],
            color
        );
        this.addTriangle(
            [-halfW, -halfH],
            [halfW, halfH],
            [-halfW, halfH],
            color
        );

        this.flush();
    }

    /**
     * Draw a rectangle outline
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} lineWidth - Line width (optional)
     */
    strokeRect(x, y, width, height, color = Colors.predefined.WHITE, lineWidth = 1) {
        this.strokeLine(x, y, x + width, y, color, lineWidth);
        this.strokeLine(x + width, y, x + width, y + height, color, lineWidth);
        this.strokeLine(x + width, y + height, x, y + height, color, lineWidth);
        this.strokeLine(x, y + height, x, y, color, lineWidth);
    }

    /**
     * Draw a circle
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} radius - Radius
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} segments - Number of segments (optional)
     */
    fillCircle(x, y, radius, color = Colors.predefined.WHITE, segments = 32) {
        const angleStep = (Math.PI * 2) / segments;

        for (let i = 0; i < segments; i++) {
            const angle1 = angleStep * i;
            const angle2 = angleStep * (i + 1);

            const x1 = Math.cos(angle1) * radius;
            const y1 = Math.sin(angle1) * radius;
            const x2 = Math.cos(angle2) * radius;
            const y2 = Math.sin(angle2) * radius;

            this.addVertex(x, y, color);
            this.addVertex(x + x1, y + y1, color);
            this.addVertex(x + x2, y + y2, color);
        }

        this.flush();
    }

    /**
     * Draw a circle outline
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} radius - Radius
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} lineWidth - Line width (optional)
     * @param {number} segments - Number of segments (optional)
     */
    strokeCircle(x, y, radius, color = Colors.predefined.WHITE, lineWidth = 1, segments = 32) {
        const angleStep = (Math.PI * 2) / segments;

        for (let i = 0; i < segments; i++) {
            const angle1 = angleStep * i;
            const angle2 = angleStep * (i + 1);

            const x1 = Math.cos(angle1) * radius + x;
            const y1 = Math.sin(angle1) * radius + y;
            const x2 = Math.cos(angle2) * radius + x;
            const y2 = Math.sin(angle2) * radius + y;

            this.strokeLine(x1, y1, x2, y2, color, lineWidth);
        }
    }

    /**
     * Draw a triangle
     * @param {number} x1 - First vertex X
     * @param {number} y1 - First vertex Y
     * @param {number} x2 - Second vertex X
     * @param {number} y2 - Second vertex Y
     * @param {number} x3 - Third vertex X
     * @param {number} y3 - Third vertex Y
     * @param {number[]} color - Color [r, g, b, a]
     */
    fillTriangle(x1, y1, x2, y2, x3, y3, color = Colors.predefined.WHITE) {
        this.setTransform(Mat3.identity());
        this.addVertex(x1, y1, color);
        this.addVertex(x2, y2, color);
        this.addVertex(x3, y3, color);
        this.flush();
    }

    /**
     * Draw a line
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} lineWidth - Line width (optional)
     */
    strokeLine(x1, y1, x2, y2, color = Colors.predefined.WHITE, lineWidth = 1) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return;

        const perpX = (-dy / length) * (lineWidth / 2);
        const perpY = (dx / length) * (lineWidth / 2);

        this.setTransform(Mat3.identity());

        this.addVertex(x1 + perpX, y1 + perpY, color);
        this.addVertex(x1 - perpX, y1 - perpY, color);
        this.addVertex(x2 + perpX, y2 + perpY, color);

        this.addVertex(x1 - perpX, y1 - perpY, color);
        this.addVertex(x2 - perpX, y2 - perpY, color);
        this.addVertex(x2 + perpX, y2 + perpY, color);

        this.flush();
    }

    /**
     * Draw a polygon
     * @param {number[][]} points - Array of [x, y] points
     * @param {number[]} color - Color [r, g, b, a]
     */
    fillPolygon(points, color = Colors.predefined.WHITE) {
        if (points.length < 3) return;

        this.setTransform(Mat3.identity());

        for (let i = 1; i < points.length - 1; i++) {
            this.addVertex(points[0][0], points[0][1], color);
            this.addVertex(points[i][0], points[i][1], color);
            this.addVertex(points[i + 1][0], points[i + 1][1], color);
        }

        this.flush();
    }

    /**
     * Draw a polygon outline
     * @param {number[][]} points - Array of [x, y] points
     * @param {number[]} color - Color [r, g, b, a]
     * @param {number} lineWidth - Line width (optional)
     */
    strokePolygon(points, color = Colors.predefined.WHITE, lineWidth = 1) {
        if (points.length < 2) return;

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            this.strokeLine(p1[0], p1[1], p2[0], p2[1], color, lineWidth);
        }
    }

    /**
     * Add a vertex to the batch
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number[]} color - Color [r, g, b, a]
     */
    addVertex(x, y, color) {
        this.vertices.push(x, y);
        this.colors.push(color[0], color[1], color[2], color[3]);
    }

    /**
     * Add a triangle to the batch
     * @private
     * @param {number[]} p1 - First point [x, y]
     * @param {number[]} p2 - Second point [x, y]
     * @param {number[]} p3 - Third point [x, y]
     * @param {number[]} color - Color [r, g, b, a]
     */
    addTriangle(p1, p2, p3, color) {
        this.addVertex(p1[0], p1[1], color);
        this.addVertex(p2[0], p2[1], color);
        this.addVertex(p3[0], p3[1], color);
    }

    /**
     * Set canvas size and update projection
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        this.setProjection(0, width, height, 0);
    }

    /**
     * Get the underlying WebGL2 context
     * @returns {WebGL2RenderingContext} The WebGL2 rendering context
     */
    getContext() {
        return this.gl;
    }

    /**
     * Get canvas element
     * @returns {HTMLCanvasElement} The canvas element
     */
    getCanvas() {
        return this.canvas;
    }
}

export default Graphics2D;
