# rastersonance

A lightweight, high-performance 2D graphics library built with WebGL2. Provides a familiar Canvas API-like interface with GPU acceleration for modern web applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WebGL2](https://img.shields.io/badge/WebGL-2.0-blue.svg)](https://www.khronos.org/webgl/)

## Features

- 🚀 **GPU Accelerated**: Leverages WebGL2 for fast rendering
- 📦 **Easy to Use**: Familiar Canvas-like API
- 🎨 **Rich Shape Support**: Rectangles, circles, triangles, lines, polygons
- 🔄 **Transformations**: Built-in rotation, translation, and scaling
- 🌈 **Color Management**: RGB, hex, predefined colors, and interpolation
- 📐 **Math Utilities**: Ready-to-use vector and matrix operations
- 🎬 **Animation Ready**: Smooth 60 FPS animations
- 📦 **Modular**: ES6 modules for easy integration
- 🎯 **Zero Dependencies**: Standalone library with no external dependencies

## Installation

### Via npm (coming soon)

```bash
npm install webgl2-2d
```

### Local Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/webgl2-2d.git
cd webgl-2-2d
```

## Quick Start

### ES6 Modules

```javascript
import { Graphics2D, Color, Colors } from './src/index.js';

// Create a graphics context
const canvas = document.getElementById('myCanvas');
const graphics = new Graphics2D(canvas);

// Animation loop
function animate() {
    graphics.clear(Colors.BLACK);
    graphics.fillRect(100, 100, 200, 150, Color.rgb(255, 0, 0));
    graphics.fillCircle(300, 200, 50, Colors.GREEN);
    graphics.strokeLine(0, 0, 400, 300, Colors.BLUE, 2);
    requestAnimationFrame(animate);
}
animate();
```

## API Documentation

### Graphics2D Class

Main class for rendering 2D graphics.

#### Constructor

```javascript
const graphics = new Graphics2D(canvas)
```

**Parameters:**
- `canvas` (HTMLCanvasElement): The canvas element to render to

**Throws:**
- Error if WebGL2 is not supported

---

### Drawing Methods

#### fillRect(x, y, width, height, color, rotation)

Draw a filled rectangle.

```javascript
graphics.fillRect(100, 100, 200, 100, Color.rgb(255, 0, 0));
graphics.fillRect(50, 50, 100, 100, Colors.BLUE, Math.PI / 4); // Rotated
```

#### strokeRect(x, y, width, height, color, lineWidth)

Draw a rectangle outline.

```javascript
graphics.strokeRect(100, 100, 200, 100, Color.rgb(255, 255, 0), 2);
```

#### fillCircle(x, y, radius, color, segments)

Draw a filled circle.

```javascript
graphics.fillCircle(300, 200, 50, Color.rgb(0, 255, 0));
graphics.fillCircle(150, 150, 75, Colors.CYAN, 64); // Smoother circle
```

#### strokeCircle(x, y, radius, color, lineWidth, segments)

Draw a circle outline.

```javascript
graphics.strokeCircle(300, 200, 50, Color.rgb(255, 100, 100), 3);
```

#### fillTriangle(x1, y1, x2, y2, x3, y3, color)

Draw a filled triangle.

```javascript
graphics.fillTriangle(100, 100, 300, 100, 200, 300, Colors.MAGENTA);
```

#### strokeLine(x1, y1, x2, y2, color, lineWidth)

Draw a line.

```javascript
graphics.strokeLine(0, 0, 400, 300, Color.rgb(100, 100, 255), 2);
```

#### fillPolygon(points, color)

Draw a filled polygon.

```javascript
const pentagon = [
    [300, 50],
    [380, 150],
    [330, 250],
    [270, 250],
    [220, 150]
];
graphics.fillPolygon(pentagon, Colors.YELLOW);
```

#### strokePolygon(points, color, lineWidth)

Draw a polygon outline.

```javascript
graphics.strokePolygon(pentagon, Colors.RED, 2);
```

#### clear(color)

Clear the canvas with a color.

```javascript
graphics.clear(Colors.BLACK);
graphics.clear(Color.rgb(50, 50, 60));
```

#### resize(width, height)

Resize the canvas and update projection.

```javascript
graphics.resize(1024, 768);
```

---

### Color API

#### Color.rgb(r, g, b, a)

Create a color from RGB values (0-255).

```javascript
const red = Color.rgb(255, 0, 0);
const transparent = Color.rgb(0, 255, 0, 128);
```

#### Color.fromHex(hex)

Create a color from a hex string.

```javascript
const blue = Color.fromHex('#0000FF');
const cyan = Color.fromHex('#00FFFF80'); // With alpha
```

#### Color.random(alpha)

Create a random color.

```javascript
const randomColor = Color.random();
const randomWithAlpha = Color.random(0.5);
```

#### Color.lerp(color1, color2, t)

Interpolate between two colors.

```javascript
const start = Colors.RED;
const end = Colors.BLUE;
const middle = Color.lerp(start, end, 0.5);
```

### Predefined Colors

```javascript
Colors.WHITE       // [1, 1, 1, 1]
Colors.BLACK       // [0, 0, 0, 1]
Colors.RED         // [1, 0, 0, 1]
Colors.GREEN       // [0, 1, 0, 1]
Colors.BLUE        // [0, 0, 1, 1]
Colors.YELLOW      // [1, 1, 0, 1]
Colors.CYAN        // [0, 1, 1, 1]
Colors.MAGENTA     // [1, 0, 1, 1]
Colors.TRANSPARENT // [0, 0, 0, 0]
```

---

### Math Utilities

#### Vec2 - 2D Vector Operations

```javascript
import { Vec2 } from './src/math.js';

const a = Vec2.create(3, 4);
const b = Vec2.create(1, 2);

const sum = Vec2.add(a, b);           // [4, 6]
const diff = Vec2.sub(a, b);          // [2, 2]
const scaled = Vec2.scale(a, 2);      // [6, 8]
const length = Vec2.length(a);        // 5
const normalized = Vec2.normalize(a); // [0.6, 0.8]
const dist = Vec2.distance(a, b);     // √8 ≈ 2.83
const dot = Vec2.dot(a, b);           // 11
```

#### Mat3 - 3x3 Matrix Operations

```javascript
import { Mat3 } from './src/math.js';

const identity = Mat3.identity();
const translation = Mat3.translation(100, 50);
const rotation = Mat3.rotation(Math.PI / 4);
const scale = Mat3.scale(2, 2);
const orthographic = Mat3.orthographic(0, 800, 600, 0);

// Combine transformations
const transform = Mat3.multiply(translation, rotation);
```

---

## Complete Example

```javascript
import { Graphics2D, Color, Colors } from './src/index.js';

class GameEngine {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.graphics = new Graphics2D(canvas);
        this.time = 0;
        this.animate();
    }

    animate = () => {
        this.time += 0.016; // ~60 FPS

        // Clear background
        this.graphics.clear(Color.rgb(20, 20, 30));

        // Animated rectangle
        this.graphics.fillRect(
            400 + Math.sin(this.time) * 100,
            300,
            100,
            100,
            Color.rgb(100, 200, 255),
            this.time * 0.5
        );

        // Pulsing circle
        const radius = 50 + Math.sin(this.time * 2) * 20;
        this.graphics.fillCircle(200, 150, radius, Colors.RED, 32);

        // Rotating triangle
        const cx = 600, cy = 150;
        const angle = this.time;
        const r = 60;
        this.graphics.fillTriangle(
            cx + Math.cos(angle) * r,
            cy + Math.sin(angle) * r,
            cx + Math.cos(angle + 2.094) * r,
            cy + Math.sin(angle + 2.094) * r,
            cx + Math.cos(angle + 4.189) * r,
            cy + Math.sin(angle + 4.189) * r,
            Colors.GREEN
        );

        requestAnimationFrame(this.animate);
    };
}

// Start when ready
document.addEventListener('DOMContentLoaded', () => {
    new GameEngine('myCanvas');
});
```

---

## Project Structure

```
webgl2-2d/
├── src/
│   ├── index.js         # Main entry point (exports all public APIs)
│   ├── graphics2d.js    # Graphics2D class (all drawing methods)
│   ├── math.js          # Math utilities (Vec2, Mat3)
│   └── colors.js        # Color utilities and constants
├── examples/
│   ├── index.html       # Demo HTML page
│   ├── demo.js          # Interactive demo application
│   └── style.css        # Demo styling
├── package.json         # npm package configuration
├── README.md            # This file
└── LICENSE              # MIT License
```

---

## Running the Demo

Open the demo in your browser:

```bash
# Simple HTTP server (Node.js)
npx http-server

# Or Python 3
python -m http.server 3000

# Then visit: http://localhost:3000/examples/
```

---

## Performance Tips

1. **Batch Operations**: Multiple draw calls are automatically batched
2. **Minimize Clear Calls**: Only clear when necessary
3. **Reuse Colors**: Use predefined colors to avoid allocation
4. **Optimize Segments**: Use fewer segments for circles/polygons
5. **Resize Strategically**: Only resize when viewport changes
6. **Use requestAnimationFrame**: For smooth 60 FPS animations

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 56+     |
| Firefox | 51+     |
| Safari  | 15+     |
| Edge    | 79+     |

Requires WebGL2 support.

---

## Building

### For npm distribution

```bash
npm run build
```

This creates optimized builds in the `dist/` directory.

---

## Creating a Sprite System

```javascript
class Sprite {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.rotation = 0;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.rotation += deltaTime;
    }

    draw(graphics) {
        graphics.fillRect(
            this.x,
            this.y,
            this.width,
            this.height,
            this.color,
            this.rotation
        );
    }
}
```

---

## Particle System Example

```javascript
class Particle {
    constructor(x, y, vx, vy, color, life = 1.0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = [...color];
        this.life = life;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        this.color[3] = this.life; // Fade out
    }

    draw(graphics) {
        graphics.fillCircle(this.x, this.y, 5, this.color, 16);
    }

    isAlive() {
        return this.life > 0;
    }
}
```

---

## Troubleshooting

### WebGL2 Not Supported

```javascript
try {
    const graphics = new Graphics2D(canvas);
} catch (error) {
    console.error('WebGL2 not available. Fallback to Canvas 2D.');
}
```

### Black Canvas

- Ensure `clear()` is called before drawing
- Check canvas dimensions are set correctly
- Open browser DevTools for console errors

### Low Performance

- Profile with Chrome DevTools Performance tab
- Reduce circle segments (higher = slower)
- Minimize polygon point counts
- Check for memory leaks

---

## Extending the Library

You can extend Graphics2D with custom drawing methods:

```javascript
import { Graphics2D } from './src/graphics2d.js';
import { Mat3 } from './src/math.js';

class ExtendedGraphics extends Graphics2D {
    fillRoundRect(x, y, width, height, radius, color) {
        // Custom implementation
        this.fillRect(x + radius, y, width - radius * 2, height, color);
        this.fillRect(x, y + radius, width, height - radius * 2, color);
        this.fillCircle(x + radius, y + radius, radius, color, 16);
        // ... etc
    }
}
```

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions welcome! Please feel free to submit pull requests or open issues.

---

## Changelog

### 1.0.0 (Initial Release)

- ✨ Core Graphics2D class with all drawing methods
- 🎨 Complete color management system
- 📐 Full math utilities (Vec2, Mat3)
- 🎬 Animation-ready architecture
- 📚 Comprehensive documentation
- 🎪 Interactive demo application

---

## Support

For questions or issues, please open a GitHub issue or contact the maintainer.

---

Happy rendering! 🎨🚀
