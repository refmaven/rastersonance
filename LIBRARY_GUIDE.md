# Library Usage Guide

This document explains how to use Rastersonance (a WebGL2 2D graphics library) in your projects.

## Import Methods

Recommended: use the built UMD bundle (`dist/rastersonance.min.js`) for browser usage, or install via npm (future). Advanced users who need to work with source may import individual modules directly.

### Advanced: Source Imports

You can import specific modules from source if you want to build or modify the library yourself:

```javascript
import { Graphics2D } from './src/graphics2d.js';
import { Vec2, Mat3 } from './src/math.js';
import * as Colors from './src/colors.js';
```

### Method 3: npm Package (Future)

Once published to npm:

```bash
npm install rastersonance
```

```javascript
import { Graphics2D, Color, Colors } from 'rastersonance';
```

### UMD Bundle (When built)

For browser-only usage, include the built minified bundle:

```html
<script src="dist/rastersonance.min.js"></script>
<script>
    const graphics = new Rastersonance.Graphics2D(canvas);
    graphics.fillRect(100, 100, 200, 150, Rastersonance.Color.rgb(255, 0, 0));
</script>
```

Note: the GitHub Actions workflow uploads `dist/*` as a build artifact. Download the artifact from the workflow run and use `dist/rastersonance.min.js` for browser usage.

---

## API Overview

### Creating a Graphics Context

```javascript
import { Graphics2D } from './src/graphics2d.js';

const canvas = document.getElementById('myCanvas');
const graphics = new Graphics2D(canvas);

// Canvas will throw an error if WebGL2 is not supported
```

### Drawing Shapes

```javascript
// Rectangle
graphics.fillRect(x, y, width, height, color, rotation);
graphics.strokeRect(x, y, width, height, color, lineWidth);

// Circle
graphics.fillCircle(centerX, centerY, radius, color, segments);
graphics.strokeCircle(centerX, centerY, radius, color, lineWidth, segments);

// Triangle
graphics.fillTriangle(x1, y1, x2, y2, x3, y3, color);

// Line
graphics.strokeLine(x1, y1, x2, y2, color, lineWidth);

// Polygon
graphics.fillPolygon(points, color);
graphics.strokePolygon(points, color, lineWidth);
```

### Working with Colors

```javascript
import { Color, Colors } from './src/index.js';

// Predefined colors
Colors.RED
Colors.BLUE
Colors.WHITE

// Create from RGB
Color.rgb(255, 0, 0)       // Red
Color.rgb(0, 255, 0, 128)  // Green with 50% alpha

// Create from hex
Color.fromHex('#FF0000')       // Red
Color.fromHex('#00FF00AA')     // Green with alpha

// Random color
Color.random()           // Random opaque
Color.random(0.5)        // Random with 50% alpha

// Interpolate
Color.lerp(Colors.RED, Colors.BLUE, 0.5)  // Magenta
```

### Animation Loop

```javascript
import { Graphics2D, Colors } from './src/index.js';

class MyApp {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.graphics = new Graphics2D(canvas);
        this.time = 0;
        this.start();
    }

    start() {
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.time += 0.016; // Delta time in seconds

        // Clear
        this.graphics.clear(Colors.BLACK);

        // Draw something
        this.graphics.fillRect(
            100 + Math.sin(this.time) * 50,
            100,
            100,
            100,
            Colors.RED
        );

        // Continue loop
        requestAnimationFrame(() => this.loop());
    }
}

// Usage
new MyApp('myCanvas');
```

---

## Math Utilities

### 2D Vectors

```javascript
import { Vec2 } from './src/index.js';

const pos = Vec2.create(10, 20);
const velocity = Vec2.create(5, -3);

// Operations
const newPos = Vec2.add(pos, velocity);
const distance = Vec2.distance(pos, newPos);
const length = Vec2.length(velocity);
const normalized = Vec2.normalize(velocity);

// Utilities
const dot = Vec2.dot(vec1, vec2);
const scaled = Vec2.scale(vec1, 2);
```

### Matrices

```javascript
import { Mat3 } from './src/index.js';

const identity = Mat3.identity();
const translate = Mat3.translation(100, 50);
const rotate = Mat3.rotation(Math.PI / 4);
const scale = Mat3.scale(2, 2);

// Combine transformations
const transform = Mat3.multiply(translate, rotate);
```

---

## Common Patterns

### Creating a Sprite Class

```javascript
import { Graphics2D } from './src/graphics2d.js';
import { Color, Colors } from './src/colors.js';

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

// Usage
const sprite = new Sprite(100, 100, 50, 50, Colors.BLUE);
sprite.velocityX = 100;
sprite.velocityY = 50;
```

### Particle System

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
        this.color[3] = Math.max(0, this.life); // Fade out
    }

    draw(graphics) {
        graphics.fillCircle(this.x, this.y, 5, this.color, 12);
    }

    isAlive() {
        return this.life > 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            this.particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                Color.random()
            ));
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return p.isAlive();
        });
    }

    draw(graphics) {
        this.particles.forEach(p => p.draw(graphics));
    }
}
```

### Scene System

```javascript
import { Graphics2D, Colors } from './src/index.js';

class Scene {
    constructor(graphics) {
        this.graphics = graphics;
    }

    update(deltaTime) {}
    draw() {}
}

class GameScene extends Scene {
    constructor(graphics) {
        super(graphics);
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
    }

    draw() {
        this.graphics.clear(Colors.BLACK);
        this.graphics.fillCircle(200, 200, 50, Colors.RED);
    }
}

class SceneManager {
    constructor(graphics) {
        this.graphics = graphics;
        this.currentScene = null;
    }

    setScene(scene) {
        this.currentScene = scene;
    }

    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    draw() {
        if (this.currentScene) {
            this.currentScene.draw();
        }
    }
}
```

---

## Handling Canvas Resize

```javascript
import { Graphics2D } from './src/index.js';

class ResponsiveApp {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.graphics = new Graphics2D(this.canvas);
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
        this.onResize();
        
        this.start();
    }

    onResize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.graphics.resize(rect.width, rect.height);
    }

    start() {
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.graphics.clear();
        // Draw here
        requestAnimationFrame(() => this.loop());
    }
}
```

---

## Error Handling

```javascript
import { Graphics2D } from './src/index.js';

try {
    const canvas = document.getElementById('myCanvas');
    const graphics = new Graphics2D(canvas);
    
    // Use graphics
} catch (error) {
    if (error.message.includes('WebGL2')) {
        console.error('WebGL2 is not supported on this browser');
        // Fallback to Canvas 2D or show message to user
    } else {
        console.error('Graphics initialization failed:', error);
    }
}
```

---

## Performance Considerations

1. **Reuse Graphics Context**: Don't create multiple Graphics2D instances
2. **Batch Drawings**: Multiple draw calls are batched automatically
3. **Optimize Segments**: Use fewer segments for circles when performance matters
4. **Use requestAnimationFrame**: For smooth 60 FPS animations
5. **Profile Your Code**: Use Chrome DevTools Performance tab

---

## Testing the Library

Open `examples/index.html` in a web browser to see the interactive demo:

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js
npx http-server

# Then visit: http://localhost:3000/examples/
```

---

## Next Steps

1. Check [examples/demo.js](examples/demo.js) for a complete working example
2. Read [README.md](README.md) for detailed API documentation
3. Explore the [src/](src/) directory for implementation details
4. Experiment with the demo - toggle between full demo and minimal mode

Happy rendering! 🎨
