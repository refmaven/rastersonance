# rastersonance

a simple 2d graphics library built on top of WebGL2.

the goal is basically:
- canvas2d-style drawing
- gpu accelerated rendering
- minimal setup
- no giant framework

still experimental. APIs may change.

## what it can do

- rectangles
- circles
- lines
- polygons
- transforms (rotation/scale/translation)
- color helpers
- simple math utilities
- animation/render loops
- WebGL2-backed rendering

## installation

not published to npm yet.

for now:

```bash
git clone <repo>
cd rastersonance
npm install
npm run build
```

then use the files from dist/.

## quick example

```html
<canvas id="c"></canvas>

<script src="dist/rastersonance.min.js"></script>
<script>
const canvas = document.getElementById("c");

const g = new Rastersonance.Graphics2D(canvas);

g.clear(Rastersonance.Colors.BLACK);

g.fillRect(
    100,
    100,
    200,
    150,
    Rastersonance.Color.rgb(255, 0, 0)
);

function loop() {
    requestAnimationFrame(loop);
}

loop();
</script>
```

## basic usage
```js
const graphics = new Graphics2D(canvas);
```
if WebGL2 isn't supported, it'll throw an error.

## drawing

## rectangles
```js
graphics.fillRect(100, 100, 200, 100, Colors.RED);

graphics.strokeRect(
    100,
    100,
    200,
    100,
    Colors.WHITE,
    2
);
```
## circles
```js
graphics.fillCircle(300, 200, 50, Colors.GREEN);

graphics.strokeCircle(
    300,
    200,
    50,
    Colors.WHITE,
    3
);
```
## lines
```js
graphics.strokeLine(
    0,
    0,
    400,
    300,
    Colors.CYAN,
    2
);
```
## polygons
```js
const points = [
    [300, 50],
    [380, 150],
    [330, 250],
    [270, 250],
    [220, 150]
];

graphics.fillPolygon(points, Colors.YELLOW);
```
## colors
```js
Color.rgb(255, 0, 0);

Color.fromHex("#ff00ff");

Color.random();
```
## predefined colors:
```js
Colors.WHITE
Colors.BLACK
Colors.RED
Colors.GREEN
Colors.BLUE
Colors.YELLOW
Colors.CYAN
Colors.MAGENTA
```
## resizing
```js
graphics.resize(width, height);
```
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

## current status

works pretty well for basic 2d rendering right now, but i'm still learning graphics programming and i might improve the architecture over time.

## browser support

requires WebGL2.

tested mainly on firefox.

## license

MIT
