# using rastersonance
this is a guide for using rastersonance.
## importing
right now the easiest way is probably using the built bundle from `dist/`.
### browser usage

```html
<script src="dist/rastersonance.min.js"></script>

<script>
const canvas = document.getElementById("myCanvas");

const graphics = new Rastersonance.Graphics2D(canvas);

graphics.fillRect(
    100,
    100,
    200,
    150,
    Rastersonance.Colors.RED
);
</script>
```
## source imports

if you want to mess with the source directly:
```js
import { Graphics2D } from "./src/graphics2d.js";
import { Vec2, Mat3 } from "./src/math.js";
import * as Colors from "./src/colors.js";
```
## npm

not published yet.

### eventually:
```bash
npm install rastersonance
```
## creating a graphics context
```js
import { Graphics2D } from "./src/index.js";

const canvas = document.getElementById("myCanvas");

const graphics = new Graphics2D(canvas);
```
if WebGL2 isn't supported it'll throw an error.

---
## drawing stuff

### rectangles
```js
graphics.fillRect(
    x,
    y,
    width,
    height,
    color
);

graphics.strokeRect(
    x,
    y,
    width,
    height,
    color,
    lineWidth
);
```
### circles
```js
graphics.fillCircle(
    x,
    y,
    radius,
    color
);

graphics.strokeCircle(
    x,
    y,
    radius,
    color,
    lineWidth
);
```
### lines
```js
graphics.strokeLine(
    x1,
    y1,
    x2,
    y2,
    color,
    lineWidth
);
```
### polygons
```js
graphics.fillPolygon(points, color);

graphics.strokePolygon(
    points,
    color,
    lineWidth
);
```
#### example:
```js
const points = [
    [100, 100],
    [200, 100],
    [250, 180],
    [120, 220]
];

graphics.fillPolygon(points, Colors.YELLOW);
```

---

## colors
```js
import { Color, Colors } from "./src/index.js";
```
### predefined:
```js
Colors.RED
Colors.BLUE
Colors.WHITE
Colors.BLACK
```
### rgb:
```js
Color.rgb(255, 0, 0);
Color.rgb(0, 255, 0, 128);
```
### hex:
```js
Color.fromHex("#ff0000");
Color.fromHex("#00ff00aa");
```
### random:
```js
Color.random();
Color.random(0.5);
```
### interpolation:
```js
Color.lerp(
    Colors.RED,
    Colors.BLUE,
    0.5
);
```

---

## animation loop example
```js
import {
    Graphics2D,
    Colors
} from "./src/index.js";

class App {
    constructor(canvasId) {
        const canvas =
            document.getElementById(canvasId);

        this.graphics =
            new Graphics2D(canvas);

        this.time = 0;

        this.loop();
    }

    loop = () => {
        this.time += 0.016;

        this.graphics.clear(
            Colors.BLACK
        );

        this.graphics.fillRect(
            100 + Math.sin(this.time) * 50,
            100,
            100,
            100,
            Colors.RED
        );

        requestAnimationFrame(this.loop);
    };
}

new App("myCanvas");
```

---

## math utilities

### vec2
```js
import { Vec2 } from "./src/index.js";

const a = Vec2.create(3, 4);

const b = Vec2.create(1, 2);

Vec2.add(a, b);

Vec2.sub(a, b);

Vec2.scale(a, 2);

Vec2.length(a);

Vec2.normalize(a);
```
## mat3
```js
import { Mat3 } from "./src/index.js";

const translation =
    Mat3.translation(100, 50);

const rotation =
    Mat3.rotation(Math.PI / 4);

const scale =
    Mat3.scale(2, 2);

const transform =
    Mat3.multiply(
        translation,
        rotation
    );
```

---

## resizing
```js
graphics.resize(width, height);

### example:

window.addEventListener("resize", () => {
    graphics.resize(
        window.innerWidth,
        window.innerHeight
    );
});
```

---

## particle example
```js
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.color = color;

        this.life = 1;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.life -= dt;
    }

    draw(graphics) {
        graphics.fillCircle(
            this.x,
            this.y,
            5,
            this.color,
            12
        );
    }
}
```

---

## running the demo

```bash
npx http-server
```

or:
```bash
python -m http.server 3000
```

then open:
```
http://localhost:3000/examples/
```
## misc
if the canvas is black:
- make sure you're calling `clear()`
- check canvas dimensions
- check browser console errors
requires WebGL2 support.
## examples
check:
- `examples/demo.js`
- `examples/index.html`
for actual usage examples.
