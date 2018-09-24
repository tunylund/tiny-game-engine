import loop from './loop.mjs';
function setup(window) {
    const canvas = window.document.createElement('canvas');
    const context = canvas.getContext('2d');
    let cw, ch;
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cw = canvas.width / 2;
        ch = canvas.height / 2;
    }
    onResize();
    window.addEventListener('resize', onResize);
    window.document.body.appendChild(canvas);
    const stopThisDrawLoop = loop((step, total) => {
        const iteration = drawables.splice(0, drawables.length);
        while (iteration.length > 0) {
            const drawable = iteration.shift();
            if (drawable) {
                drawable.draw(context, cw, ch);
            }
        }
    }, window);
    return () => {
        stopThisDrawLoop();
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
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
function addDrawable(z, drawFn, win) {
    if (!loopStop) {
        loopStop = setup(win);
    }
    let ix = drawables.length;
    while (ix-- > 0) {
        if (drawables[ix].z <= z) {
            break;
        }
    }
    drawables.splice(ix + 1, 0, { z, draw: drawFn });
}
function drawing(w, h, fn, win) {
    const canvas = (win || window).document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    fn(canvas.getContext('2d'));
    return canvas;
}
function draw(fnOrEl, pos, dim, win) {
    addDrawable(pos.cor.z, (context, cw, ch) => {
        context.save();
        context.translate(cw, ch);
        if (typeof fnOrEl === 'function') {
            fnOrEl(context, cw, ch);
        }
        else {
            context.drawImage(fnOrEl, pos.cor.x - dim.x2, pos.cor.y - dim.y2);
        }
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }, (win || window));
}
function isometricDraw(fnOrEl, pos, dim, win) {
    draw((ctx, cw, ch) => {
        ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816);
        ctx.translate(-pos.cor.z, -pos.cor.z);
        if (typeof fnOrEl === 'function') {
            fnOrEl(ctx, cw, ch);
        }
        else {
            ctx.drawImage(fnOrEl, pos.cor.x - dim.x2, pos.cor.y - dim.y2);
        }
    }, pos, dim, (win || window));
}
export { draw, drawing, isometricDraw, stopDrawLoop };
