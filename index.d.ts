/**
 * TypeScript type definitions for WebGL2 2D Graphics Library
 */

export type Color = [number, number, number, number];
export type Vec2Array = [number, number];
export type Point = [number, number];

// Color namespace
export namespace Color {
    function rgb(r: number, g: number, b: number, a?: number): Color;
    function fromHex(hex: string): Color;
    function random(alpha?: number): Color;
    function lerp(color1: Color, color2: Color, t: number): Color;
}

export namespace Colors {
    const WHITE: Color;
    const BLACK: Color;
    const RED: Color;
    const GREEN: Color;
    const BLUE: Color;
    const YELLOW: Color;
    const CYAN: Color;
    const MAGENTA: Color;
    const TRANSPARENT: Color;
}

// Vec2 namespace
export namespace Vec2 {
    function create(x?: number, y?: number): Vec2Array;
    function add(a: Vec2Array, b: Vec2Array): Vec2Array;
    function sub(a: Vec2Array, b: Vec2Array): Vec2Array;
    function scale(v: Vec2Array, scalar: number): Vec2Array;
    function length(v: Vec2Array): number;
    function normalize(v: Vec2Array): Vec2Array;
    function distance(a: Vec2Array, b: Vec2Array): number;
    function dot(a: Vec2Array, b: Vec2Array): number;
}

// Mat3 namespace
export namespace Mat3 {
    function identity(): Float32Array;
    function translation(x: number, y: number): Float32Array;
    function rotation(radians: number): Float32Array;
    function scale(x: number, y: number): Float32Array;
    function multiply(a: Float32Array, b: Float32Array): Float32Array;
    function orthographic(left: number, right: number, bottom: number, top: number): Float32Array;
    function transform(x: number, y: number, rotation?: number, scaleX?: number, scaleY?: number): Float32Array;
}

// Graphics2D class
export class Graphics2D {
    constructor(canvas: HTMLCanvasElement);

    /**
     * Draw a filled rectangle
     */
    fillRect(x: number, y: number, width: number, height: number, color?: Color, rotation?: number): void;

    /**
     * Draw a rectangle outline
     */
    strokeRect(x: number, y: number, width: number, height: number, color?: Color, lineWidth?: number): void;

    /**
     * Draw a filled circle
     */
    fillCircle(x: number, y: number, radius: number, color?: Color, segments?: number): void;

    /**
     * Draw a circle outline
     */
    strokeCircle(x: number, y: number, radius: number, color?: Color, lineWidth?: number, segments?: number): void;

    /**
     * Draw a filled triangle
     */
    fillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color?: Color): void;

    /**
     * Draw a line
     */
    strokeLine(x1: number, y1: number, x2: number, y2: number, color?: Color, lineWidth?: number): void;

    /**
     * Draw a filled polygon
     */
    fillPolygon(points: Point[], color?: Color): void;

    /**
     * Draw a polygon outline
     */
    strokePolygon(points: Point[], color?: Color, lineWidth?: number): void;

    /**
     * Clear the canvas
     */
    clear(color?: Color): void;

    /**
     * Resize the canvas
     */
    resize(width: number, height: number): void;

    /**
     * Get the WebGL2 context
     */
    getContext(): WebGL2RenderingContext;

    /**
     * Get the canvas element
     */
    getCanvas(): HTMLCanvasElement;
}

export const VERSION: string;
