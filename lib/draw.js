import { loop } from './loop.js';
import { zero, xyz } from './xyz.js';
function setup(window) {
    const layer = drawingLayer(window);
    window.document.body.appendChild(layer.canvas);
    const i = 0;
    const stopThisDrawLoop = loop(() => drawStep(layer), window);
    return () => {
        stopThisDrawLoop();
        layer.canvas.remove();
    };
}
const drawables = [];
let loopStop = null;
function stopDrawLoop() {
    if (loopStop) {
        loopStop();
    }
    loopStop = null;
}
function drawStep(defaultLayer) {
    const iteration = drawables.splice(0, drawables.length);
    while (iteration.length > 0) {
        const drawable = iteration.shift();
        if (drawable) {
            const l = drawable.layer || defaultLayer;
            if (l.context)
                drawable.draw(l.context, l.cw, l.ch);
        }
    }
}
function addDrawable(z, drawFn, win, layer) {
    if (!loopStop) {
        loopStop = setup(win);
    }
    let ix = drawables.length;
    while (ix-- > 0) {
        if (drawables[ix].z <= z) {
            break;
        }
    }
    drawables.splice(ix + 1, 0, { z, draw: drawFn, layer });
}
function fixedSizeDrawingLayer(w, h, win) {
    const canvas = (win || window).document.createElement('canvas');
    const layer = {
        cw: 0, ch: 0, canvas,
        context: canvas.getContext('2d'),
    };
    canvas.width = w;
    canvas.height = h;
    layer.cw = canvas.width / 2;
    layer.ch = canvas.height / 2;
    return layer;
}
function drawingLayer(win) {
    const w = win || window;
    const layer = fixedSizeDrawingLayer(w.innerWidth, w.innerHeight, win);
    w.addEventListener('resize', () => {
        layer.canvas.width = w.innerWidth;
        layer.canvas.height = w.innerHeight;
        layer.cw = layer.canvas.width / 2;
        layer.ch = layer.canvas.height / 2;
    });
    return layer;
}
function draw(drawFn, offset = zero, layer, win) {
    addDrawable(offset.z, (context, cw, ch) => {
        context.save();
        context.translate(cw - offset.x2, ch - offset.y2);
        drawFn(context, cw, ch);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }, (win || window), layer);
}
function drawImage(img, layer, win) {
    draw((ctx) => {
        ctx.drawImage(img, 0, 0);
    }, xyz(img.width, img.height), layer, win);
}
function isometricDraw(drawFn, offset, win) {
    draw((ctx, cw, ch) => {
        ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816);
        ctx.translate(-offset.z, -offset.z);
        drawFn(ctx, cw, ch);
    }, offset, undefined, (win || window));
}
export { draw, drawImage, drawingLayer, fixedSizeDrawingLayer, isometricDraw, stopDrawLoop };
//# sourceMappingURL=draw.js.map
