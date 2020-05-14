import { draw, isometricDraw, stopDrawLoop } from '../src/draw.js';
import jsdom from 'jsdom';
import { position } from '../src/position.js';
function prepare() {
    const { window } = new jsdom.JSDOM('', { pretendToBeVisual: true });
    const domWindow = window;
    // @ts-ignore
    window.innerWidth = 100;
    // @ts-ignore
    window.innerHeight = 100;
    return { window, domWindow };
}
describe('draw', () => {
    it('should resize with window', (done) => {
        const { window, domWindow } = prepare();
        // @ts-ignore
        window.innerHeight = 50;
        window.dispatchEvent(new window.Event('resize'));
        draw((ctx, cw, ch) => {
            stopDrawLoop();
            expect(ctx).toBeTruthy();
            expect(cw).toEqual(50);
            expect(ch).toEqual(25);
            done();
        }, position(), undefined, domWindow);
    });
    it('should draw in a loop', (done) => {
        const { domWindow } = prepare();
        draw(() => {
            draw((ctx, cw, ch) => {
                stopDrawLoop();
                done();
            }, position(), undefined, domWindow);
        }, position(), undefined, domWindow);
    });
    it('should organize drawing by their z index', (done) => {
        const { domWindow } = prepare();
        const drawOrder = [];
        draw(() => drawOrder.push(0), position(0, 0, 0), undefined, domWindow);
        draw(() => drawOrder.push(-1), position(0, 0, -1), undefined, domWindow);
        draw(() => drawOrder.push(1), position(0, 0, 0), undefined, domWindow);
        draw(() => {
            stopDrawLoop();
            expect(drawOrder).toMatchObject([-1, 0, 1]);
            done();
        }, position(0, 0, 0), undefined, domWindow);
    });
    it('should provide fn api', (done) => {
        const { domWindow } = prepare();
        draw((ctx, cw, ch) => {
            isometricDraw((ictx) => {
                stopDrawLoop();
                expect(ictx).toBeTruthy();
                done();
            }, position(), domWindow);
        }, position(), undefined, domWindow);
    });
});
//# sourceMappingURL=draw.test.js.map
