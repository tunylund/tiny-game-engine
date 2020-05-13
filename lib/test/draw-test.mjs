import { draw, isometricDraw, stopDrawLoop } from './../src/draw.mjs';
import jsdom from 'jsdom';
// @ts-ignore
import tap from 'tap';
import { position } from './../src/position.mjs';
function prepare() {
    const { window } = new jsdom.JSDOM('', { pretendToBeVisual: true });
    const domWindow = window;
    // @ts-ignore
    window.innerWidth = 100;
    // @ts-ignore
    window.innerHeight = 100;
    return { window, domWindow };
}
tap.test('should resize with window', (test) => {
    const { window, domWindow } = prepare();
    // @ts-ignore
    window.innerHeight = 50;
    window.dispatchEvent(new window.Event('resize'));
    draw((ctx, cw, ch) => {
        stopDrawLoop();
        test.ok(ctx);
        test.equal(cw, 50);
        test.equal(ch, 25);
        test.end();
    }, position(), undefined, domWindow);
});
tap.test('should draw in a loop', (test) => {
    const { domWindow } = prepare();
    draw(() => {
        draw((ctx, cw, ch) => {
            stopDrawLoop();
            test.end();
        }, position(), undefined, domWindow);
    }, position(), undefined, domWindow);
});
tap.test('should organize drawing by their z index', (test) => {
    const { domWindow } = prepare();
    const drawOrder = [];
    draw(() => drawOrder.push(0), position(0, 0, 0), undefined, domWindow);
    draw(() => drawOrder.push(-1), position(0, 0, -1), undefined, domWindow);
    draw(() => drawOrder.push(1), position(0, 0, 0), undefined, domWindow);
    draw(() => {
        stopDrawLoop();
        test.deepEqual(drawOrder, [-1, 0, 1]);
        test.end();
    }, position(0, 0, 0), undefined, domWindow);
});
tap.test('should provide fn api', (test) => {
    const { domWindow } = prepare();
    draw((ctx, cw, ch) => {
        isometricDraw((ictx) => {
            stopDrawLoop();
            test.ok(ictx);
            test.end();
        }, position(), domWindow);
    }, position(), undefined, domWindow);
});
// tap.test('should provide an api for drawing an element on position', (test: any) => {
//   const window = prepare()
//   const img = drawing(20, 20, () => {}, window)
//   draw(img, { cor: { x: 0, y: 0, z: 0 } }, { x: 1, y: 1, z: 1 }, window)
//   isometricDraw(img, { cor: { x: 0, y: 0, z: 0 }}, { x: 1, y: 1, z: 1 }, window)
//   draw(() => {
//     stopDrawLoop()
//   }, position(), xyz(), window)
// })
//# sourceMappingURL=draw-test.mjs.map
