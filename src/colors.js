/**
 * Color Utilities Module
 * Provides color creation, conversion, and manipulation functions
 */

/**
 * Convert RGB (0-255) to normalized (0-1)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} a - Alpha (0-255, optional)
 * @returns {number[]} Normalized color [r, g, b, a]
 */
export const rgb = (r, g, b, a = 255) => [r / 255, g / 255, b / 255, a / 255];

/**
 * Convert hex color to normalized RGBA
 * @param {string} hex - Hex color (#RGB or #RRGGBB or #RRGGBBAA)
 * @returns {number[]} Normalized color [r, g, b, a]
 */
export const fromHex = (hex) => {
    hex = hex.replace('#', '');
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b, a) => r + r + g + g + b + b + (a ? a + a : 'ff'));
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        result[4] ? parseInt(result[4], 16) / 255 : 1,
    ] : [1, 1, 1, 1];
};

/**
 * Create a random color
 * @param {number} alpha - Alpha value (0-1)
 * @returns {number[]} Random color [r, g, b, a]
 */
export const random = (alpha = 1) => [Math.random(), Math.random(), Math.random(), alpha];

/**
 * Lerp between two colors
 * @param {number[]} color1 - First color
 * @param {number[]} color2 - Second color
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number[]} Interpolated color
 */
export const lerp = (color1, color2, t) => [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t,
    color1[3] + (color2[3] - color1[3]) * t,
];

/**
 * Predefined colors
 */
export const predefined = {
    WHITE: [1, 1, 1, 1],
    BLACK: [0, 0, 0, 1],
    RED: [1, 0, 0, 1],
    GREEN: [0, 1, 0, 1],
    BLUE: [0, 0, 1, 1],
    YELLOW: [1, 1, 0, 1],
    CYAN: [0, 1, 1, 1],
    MAGENTA: [1, 0, 1, 1],
    TRANSPARENT: [0, 0, 0, 0],
};

export default {
    rgb,
    fromHex,
    random,
    lerp,
    predefined,
};
