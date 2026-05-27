# Quick Start Guide

Get up and running with WebGL2 2D Graphics Library in 5 minutes!

## 1. View the Demo (60 seconds)

```bash
# Using Python 3
python -m http.server 3000

# Or Node.js
npx http-server

# Then open: http://localhost:3000/examples/
```

Click "Toggle Demo" to switch between animations!

---

## 2. Use in a Simple Project (5 minutes)

### Create an HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebGL2 2D</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #222; }
        canvas { border: 2px solid #fff; }
    </style>
</head>
<body>
    <canvas id="canvas" width="800" height="600"></canvas>
    
    <script type="module">
        import { Graphics2D, Colors, Color } from './src/index.js';
        
        const graphics = new Graphics2D(document.getElementById('canvas'));
        let time = 0;
        
        function animate() {
            time += 0.016;
            graphics.clear(Colors.BLACK);
            
            // Rotating square
            graphics.fillRect(100, 100, 100, 100, Colors.RED, time);
            
            // Pulsing circle
            const r = 30 + Math.sin(time * 2) * 20;
            graphics.fillCircle(400, 300, r, Colors.BLUE, 32);
            
            // Wavy line
            const y = 500 + Math.sin(time * 3) * 30;
            graphics.strokeLine(0, 500, 800, y, Colors.GREEN, 3);
            
            requestAnimationFrame(animate);
        }
        animate();
    </script>
</body>
</html>
```

That's it! You now have:
- ✅ Rotating rectangle
- ✅ Pulsing circle  
- ✅ Animated line

---

## 3. Common Tasks

### Clear the Canvas
```javascript
graphics.clear(Colors.BLACK);
graphics.clear(Color.rgb(50, 50, 60));
```

### Draw Shapes
```javascript
// Rectangle
graphics.fillRect(100, 100, 200, 150, Colors.RED);

// Circle
graphics.fillCircle(300, 200, 50, Colors.BLUE);

// Line
graphics.strokeLine(0, 0, 800, 600, Colors.GREEN, 2);

// Triangle
graphics.fillTriangle(100, 100, 300, 100, 200, 300, Colors.YELLOW);

// Polygon
const points = [[100, 100], [200, 100], [150, 200]];
graphics.fillPolygon(points, Colors.MAGENTA);
```

### Use Colors
```javascript
// Predefined
Colors.RED, Colors.BLUE, Colors.GREEN, etc.

// From RGB (0-255)
Color.rgb(255, 100, 50)

// From hex
Color.fromHex('#FF6432')

// Random
Color.random()

// Mix two colors
Color.lerp(Colors.RED, Colors.BLUE, 0.5)
```

### Animate
```javascript
let time = 0;

function loop() {
    time += 0.016; // Delta time
    
    graphics.clear();
    
    // Use time in animations
    const x = 100 + Math.sin(time) * 50;
    const radius = 30 + Math.cos(time * 2) * 15;
    const angle = time * 2;
    
    graphics.fillRect(x, 100, 50, 50, Colors.RED, angle);
    graphics.fillCircle(400, 300, radius, Colors.BLUE);
    
    requestAnimationFrame(loop);
}
loop();
```

### Rotate Shapes
```javascript
// Rotation in radians (not degrees!)
const angleInRadians = Math.PI / 4;  // 45 degrees
graphics.fillRect(100, 100, 100, 100, Colors.RED, angleInRadians);
```

---

## 4. Math Utilities

### Vectors
```javascript
import { Vec2 } from './src/index.js';

const v1 = Vec2.create(3, 4);
const v2 = Vec2.create(1, 2);

const sum = Vec2.add(v1, v2);         // [4, 6]
const length = Vec2.length(v1);       // 5
const distance = Vec2.distance(v1, v2); // √5
const normalized = Vec2.normalize(v1); // [0.6, 0.8]
```

### Matrices
```javascript
import { Mat3 } from './src/index.js';

const identity = Mat3.identity();
const translation = Mat3.translation(100, 50);
const rotation = Mat3.rotation(Math.PI / 4);
const scale = Mat3.scale(2, 2);

// Combine
const combined = Mat3.multiply(translation, rotation);
```

---

## 5. Full Example: Game

```javascript
import { Graphics2D, Colors, Color } from './src/index.js';

class Game {
    constructor() {
        this.graphics = new Graphics2D(document.getElementById('canvas'));
        this.time = 0;
        this.enemyAngle = 0;
        this.animate();
    }

    animate = () => {
        this.time += 0.016;
        
        // Clear
        this.graphics.clear(Colors.BLACK);
        
        // Draw background
        this.graphics.fillRect(0, 0, 800, 600, Color.rgb(10, 10, 20));
        
        // Draw player (rotating square)
        this.graphics.fillRect(
            400 - 25, 500,
            50, 50,
            Colors.BLUE,
            this.time
        );
        
        // Draw enemy (circle)
        const cx = 400 + Math.sin(this.time * 2) * 100;
        const cy = 200;
        this.graphics.fillCircle(cx, cy, 30, Colors.RED, 32);
        
        // Draw projectiles (lines)
        const bullets = 8;
        for (let i = 0; i < bullets; i++) {
            const angle = (i / bullets) * Math.PI * 2 + this.time;
            const x = cx + Math.cos(angle) * 50;
            const y = cy + Math.sin(angle) * 50;
            this.graphics.strokeLine(cx, cy, x, y, Colors.YELLOW, 2);
        }
        
        // Draw score
        const hue = (this.time * 0.2) % 1;
        const color = this.hsvToRgb(hue, 0.8, 1);
        this.graphics.fillRect(10, 10, 200, 40, color);
        
        requestAnimationFrame(this.animate);
    };

    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
        const m = v - c;
        let r, g, b;
        if (h < 1/6) [r, g, b] = [c, x, 0];
        else if (h < 2/6) [r, g, b] = [x, c, 0];
        else if (h < 3/6) [r, g, b] = [0, c, x];
        else if (h < 4/6) [r, g, b] = [0, x, c];
        else if (h < 5/6) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        return [(r + m), (g + m), (b + m), 1];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
```

---

## 6. API Cheat Sheet

### Clear & Setup
```javascript
graphics.clear(color)
graphics.resize(width, height)
```

### Drawing
```javascript
graphics.fillRect(x, y, w, h, color, rotation)
graphics.strokeRect(x, y, w, h, color, lineWidth)
graphics.fillCircle(x, y, radius, color, segments)
graphics.strokeCircle(x, y, radius, color, lineWidth, segments)
graphics.fillTriangle(x1, y1, x2, y2, x3, y3, color)
graphics.strokeLine(x1, y1, x2, y2, color, lineWidth)
graphics.fillPolygon(points, color)
graphics.strokePolygon(points, color, lineWidth)
```

### Colors
```javascript
Colors.RED, Colors.BLUE, Colors.GREEN, ...
Color.rgb(r, g, b, a)
Color.fromHex('#RRGGBB')
Color.random(alpha)
Color.lerp(color1, color2, t)
```

### Math
```javascript
Vec2.create(x, y)
Vec2.add(a, b)
Vec2.sub(a, b)
Vec2.scale(v, scalar)
Vec2.length(v)
Vec2.normalize(v)
Vec2.distance(a, b)
Vec2.dot(a, b)

Mat3.identity()
Mat3.translation(x, y)
Mat3.rotation(radians)
Mat3.scale(x, y)
Mat3.multiply(a, b)
```

---

## 7. Troubleshooting

### Black Canvas
- Make sure you're calling `graphics.clear()` 
- Check canvas width/height are set
- Check browser console for errors

### WebGL2 Not Supported
- Try a different browser (Chrome, Firefox, Edge)
- Check WebGL2 support at: https://www.khronos.org/webgl/

### Slow Performance
- Use fewer segments: `graphics.fillCircle(x, y, r, color, 16)` instead of 64
- Profile with Chrome DevTools

---

## 8. Next Steps

1. ✅ Try the demo
2. ✅ Create a simple page
3. ✅ Build a game
4. 📖 Read LIBRARY_GUIDE.md for advanced patterns
5. 📚 Check README.md for full API

---

## Need Help?

- 📖 **README.md** - Full API reference
- 📚 **LIBRARY_GUIDE.md** - Advanced patterns
- 🎪 **examples/demo.js** - Working example code
- 🔍 Check browser console for errors

---

**Happy coding!** 🎨🚀
