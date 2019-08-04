import loop from './loop.mjs';
import { position } from './position.mjs';
function setup(window) {
    const layer = drawingLayer(window);
    window.document.body.appendChild(layer.canvas);
    const i = 0;
    const stopThisDrawLoop = loop((step, total) => {
        const iteration = drawables.splice(0, drawables.length);
        while (iteration.length > 0) {
            const drawable = iteration.shift();
            if (drawable) {
                const l = drawable.layer || layer;
                if (l.context)
                    drawable.draw(l.context, l.cw, l.ch);
            }
        }
    }, window);
    return () => {
        stopThisDrawLoop();
        if (layer.canvas && layer.canvas.parentNode) {
            layer.canvas.parentNode.removeChild(layer.canvas);
        }
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
function drawing(w, h, fn, win) {
    const canvas = (win || window).document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    fn(canvas.getContext('2d'));
    return canvas;
}
function drawingLayer(win) {
    const w = win || window;
    const canvas = w.document.createElement('canvas');
    const layer = {
        cw: 0, ch: 0, canvas,
        context: canvas.getContext('2d'),
    };
    function onResize() {
        canvas.width = w.innerWidth;
        canvas.height = w.innerHeight;
        layer.cw = canvas.width / 2;
        layer.ch = canvas.height / 2;
    }
    w.addEventListener('resize', onResize);
    onResize();
    return layer;
}
function draw(drawFn, pos = position(), layer, win) {
    addDrawable(pos.cor.z, (context, cw, ch) => {
        if (!context)
            throw new Error('no context');
        context.save();
        context.translate(cw, ch);
        drawFn(context, cw, ch);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }, (win || window), layer);
}
function drawImage(img, pos = position(), layer, win) {
    draw((ctx) => {
        ctx.drawImage(img, pos.cor.x - img.width / 2, pos.cor.y - img.height / 2);
    }, pos, layer, win);
}
function isometricDraw(drawFn, pos, win) {
    draw((ctx, cw, ch) => {
        ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816);
        ctx.translate(-pos.cor.z, -pos.cor.z);
        drawFn(ctx, cw, ch);
    }, pos, undefined, (win || window));
}
export { draw, drawImage, drawing, drawingLayer, isometricDraw, stopDrawLoop };
//# sourceMappingURL=draw.js.map
