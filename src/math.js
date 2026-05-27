/**
 * Math Utilities Module
 * Provides vector and matrix operations for 2D transformations
 */

// ============================================================================
// Vector2 Operations
// ============================================================================

export const Vec2 = {
    /**
     * Create a 2D vector
     * @param {number} x - X component
     * @param {number} y - Y component
     * @returns {number[]} Vector [x, y]
     */
    create: (x = 0, y = 0) => [x, y],

    /**
     * Add two vectors
     * @param {number[]} a - First vector
     * @param {number[]} b - Second vector
     * @returns {number[]} Result vector
     */
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],

    /**
     * Subtract two vectors
     * @param {number[]} a - First vector
     * @param {number[]} b - Second vector
     * @returns {number[]} Result vector
     */
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],

    /**
     * Scale a vector
     * @param {number[]} v - Vector
     * @param {number} scalar - Scale factor
     * @returns {number[]} Scaled vector
     */
    scale: (v, scalar) => [v[0] * scalar, v[1] * scalar],

    /**
     * Get vector length/magnitude
     * @param {number[]} v - Vector
     * @returns {number} Length
     */
    length: (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]),

    /**
     * Normalize a vector
     * @param {number[]} v - Vector
     * @returns {number[]} Normalized vector
     */
    normalize: (v) => {
        const len = Vec2.length(v);
        return len > 0 ? Vec2.scale(v, 1 / len) : [0, 0];
    },

    /**
     * Distance between two points
     * @param {number[]} a - First point
     * @param {number[]} b - Second point
     * @returns {number} Distance
     */
    distance: (a, b) => Vec2.length(Vec2.sub(b, a)),

    /**
     * Dot product
     * @param {number[]} a - First vector
     * @param {number[]} b - Second vector
     * @returns {number} Dot product
     */
    dot: (a, b) => a[0] * b[0] + a[1] * b[1],
};

// ============================================================================
// Matrix3 Operations (2D transformations use 3x3 matrices)
// ============================================================================

export const Mat3 = {
    /**
     * Create an identity matrix
     * @returns {Float32Array} 3x3 identity matrix
     */
    identity: () => new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]),

    /**
     * Create a translation matrix
     * @param {number} x - X translation
     * @param {number} y - Y translation
     * @returns {Float32Array} Translation matrix
     */
    translation: (x, y) => new Float32Array([
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
    ]),

    /**
     * Create a rotation matrix (2D rotation around origin)
     * @param {number} radians - Rotation angle in radians
     * @returns {Float32Array} Rotation matrix
     */
    rotation: (radians) => {
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        return new Float32Array([
            c, s, 0,
            -s, c, 0,
            0, 0, 1,
        ]);
    },

    /**
     * Create a scale matrix
     * @param {number} x - X scale
     * @param {number} y - Y scale
     * @returns {Float32Array} Scale matrix
     */
    scale: (x, y) => new Float32Array([
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
    ]),

    /**
     * Multiply two matrices
     * @param {Float32Array} a - First matrix
     * @param {Float32Array} b - Second matrix
     * @returns {Float32Array} Result matrix
     */
    multiply: (a, b) => {
        const result = new Float32Array(9);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i * 3 + j] = 0;
                for (let k = 0; k < 3; k++) {
                    result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
                }
            }
        }
        return result;
    },

    /**
     * Create an orthographic projection matrix
     * @param {number} left - Left bound
     * @param {number} right - Right bound
     * @param {number} bottom - Bottom bound
     * @param {number} top - Top bound
     * @returns {Float32Array} Projection matrix
     */
    orthographic: (left, right, bottom, top) => {
        const result = Mat3.identity();
        result[0] = 2 / (right - left);
        result[4] = 2 / (top - bottom);
        result[6] = -(right + left) / (right - left);
        result[7] = -(top + bottom) / (top - bottom);
        return result;
    },

    /**
     * Create a transformation matrix (translation, rotation, scale)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} rotation - Rotation in radians
     * @param {number} scaleX - X scale
     * @param {number} scaleY - Y scale
     * @returns {Float32Array} Transformation matrix
     */
    transform: (x, y, rotation = 0, scaleX = 1, scaleY = 1) => {
        const t = Mat3.translation(x, y);
        const r = Mat3.rotation(rotation);
        const s = Mat3.scale(scaleX, scaleY);
        return Mat3.multiply(Mat3.multiply(t, r), s);
    },
};

export default {
    Vec2,
    Mat3,
};
