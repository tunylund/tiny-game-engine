import jsdom from 'jsdom';
import { buildControls, Direction } from '../src/controls.js';
import { xyz } from '../src/xyz.js';
jest.useFakeTimers();
const { window } = (new jsdom.JSDOM('', {}));
const { KeyboardEvent, TouchEvent, MouseEvent } = window;
const domWindow = window;
function key(cs, fn) {
    cs.map(c => window.document.body.dispatchEvent(new KeyboardEvent('keydown', { code: c })));
    fn();
    cs.map(c => window.document.body.dispatchEvent(new KeyboardEvent('keyup', { code: c })));
}
function touch(pageX, pageY, fn) {
    // @ts-ignore
    window.document.body.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [{ pageX, pageY }] }));
    fn();
    // @ts-ignore
    window.document.body.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ pageX, pageY }] }));
}
function mouse(clientX, clientY, fn) {
    window.document.body.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
    fn();
    window.document.body.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
}
describe('controls', () => {
    const { leftdown, left, leftup, upleft, up, upright, rightup, right, rightdown, downright, down, downleft } = Direction;
    const w2 = window.innerWidth / 2, h2 = window.innerHeight / 2;
    let controls;
    beforeEach(() => controls = buildControls(domWindow));
    afterEach(() => controls.detach());
    describe('keys', () => {
        it('should provide a map of default keys in not pressed state', () => {
            expect(controls.keys).toMatchObject({
                ArrowUp: false,
                ArrowDown: false,
                ArrowLeft: false,
                ArrowRight: false,
            });
        });
        it.each([
            ['←', ['ArrowLeft'], [left], xyz(-1, 0, 0)],
            ['↑', ['ArrowUp'], [up], xyz(0, 1, 0)],
            ['→', ['ArrowRight'], [right], xyz(1, 0, 0)],
            ['↓', ['ArrowDown'], [down], xyz(-0, -1, 0)],
            ['↖︎', ['ArrowLeft', 'ArrowUp'], [leftup, upleft], xyz(-0.7071, 0.7071)],
            ['↗', ['ArrowUp', 'ArrowRight'], [upright, rightup], xyz(0.7071, 0.7071, 0)],
            ['↘', ['ArrowRight', 'ArrowDown'], [rightdown, downright], xyz(0.7071, -0.7071, 0)],
            ['↙', ['ArrowDown', 'ArrowLeft'], [downleft, leftdown], xyz(-0.7071, -0.7071, 0)],
        ])('should change the state of the keys when pressing: "%s"', (name, keys, shorthands, dir) => {
            key(keys, () => {
                shorthands.map(shorthand => expect(controls.direction[shorthand]).toBeTruthy());
                keys.map(code => expect(controls.keys[code]).toBeTruthy());
                expect(controls.dir).toMatchObject(dir);
            });
            shorthands.map(shorthand => expect(controls.direction[shorthand]).toBeFalsy());
        });
        it('should listen to additional keys', () => {
            expect(controls.keys.x).toBeUndefined();
            expect(controls.keys.space).toBeUndefined();
            key(['x', 'space'], () => {
                expect(controls.keys.x).toBeTruthy();
                expect(controls.keys.space).toBeTruthy();
            });
            expect(controls.keys.x).toBeFalsy();
            expect(controls.keys.space).toBeFalsy();
        });
    });
    describe('touch', () => {
        it.each([
            ['←', w2 - 1, h2, [left]],
            ['↑', w2, h2 - 1, [up]],
            ['→', w2 + 1, h2, [right]],
            ['↓', w2, h2 + 1, [down]],
            ['↖︎', w2 - 1, h2 - 1, [leftup, upleft]],
            ['↗', w2 + 1, h2 - 1, [upright, rightup]],
            ['↘', w2 + 1, h2 + 1, [rightdown, downright]],
            ['↙', w2 - 1, h2 + 1, [leftdown, downleft]]
        ])('should recognize touch direction "%s"', (name, x, y, shorthands) => {
            touch(x, y, () => shorthands.map(shorthand => expect(controls.direction[shorthand]).toBeTruthy()));
        });
        it('should update co-ordinate according to where the touch happened', () => {
            touch(w2 + 10, h2 + 10, () => expect(controls.cor).toMatchObject(xyz(10, 10)));
        });
        it('should reset direction after touch ends', () => {
            touch(10, 10, () => { });
            jest.runOnlyPendingTimers();
            expect(controls.cor).toMatchObject(xyz(0, 0));
            expect(controls.direction).toMatchObject({
                leftdown: false,
                left: false,
                leftup: false,
                upleft: false,
                up: false,
                upright: false,
                rightup: false,
                right: false,
                rightdown: false,
                downright: false,
                down: false,
                downleft: false
            });
        });
    });
    // describe('mouse', () => {
    //   it('should update co-ordinate according to where the click happened', () => {
    //     mouse(w2 + 10, h2 + 10, () => expect(controls.cor).toMatchObject(xyz(10, 10)))
    //   })
    //   it('should reset coordinate after click ends', () => {
    //     mouse(w2 + 10, h2 + 10, () => {})
    //     jest.runOnlyPendingTimers()
    //     expect(controls.cor).toMatchObject(xyz(0, 0))
    //   })
    // })
});
//# sourceMappingURL=controls.test.js.map
