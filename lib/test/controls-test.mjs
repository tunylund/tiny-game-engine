import jsdom from 'jsdom';
import Controls from './../src/controls.mjs';
// @ts-ignore
import tap from 'tap';
import { xyz } from './../src/xyz.mjs';
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
tap.test('controls', (tests) => {
    const controls = new Controls(domWindow);
    tap.notOk(controls.left);
    tap.notOk(controls.up);
    tap.notOk(controls.right);
    tap.notOk(controls.down);
    tests.test('←', (t) => {
        key(['ArrowLeft'], () => {
            t.ok(controls.left);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(-1, 0, 0));
        });
        t.notOk(controls.left);
        t.end();
    });
    tests.test('↖︎', (t) => {
        key(['ArrowLeft', 'ArrowUp'], () => {
            t.ok(controls.leftup && controls.upleft);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(-0.7071, 0.7071));
        });
        t.notOk(controls.leftup && controls.upleft);
        t.end();
    });
    tests.test('↑', (t) => {
        key(['ArrowUp'], () => {
            t.ok(controls.up);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(0, 1, 0));
        });
        t.notOk(controls.up);
        t.end();
    });
    tests.test('↗', (t) => {
        key(['ArrowUp', 'ArrowRight'], () => {
            t.ok(controls.upright && controls.rightup);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(0.7071, 0.7071, 0));
        });
        t.notOk(controls.upright && controls.rightup);
        t.end();
    });
    tests.test('→', (t) => {
        key(['ArrowRight'], () => {
            t.ok(controls.right);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(1, 0, 0));
        });
        t.notOk(controls.right);
        t.end();
    });
    tests.test('↘', (t) => {
        key(['ArrowRight', 'ArrowDown'], () => {
            t.ok(controls.rightdown && controls.downright);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(0.7071, -0.7071, 0));
        });
        t.notOk(controls.rightdown && controls.downright);
        t.end();
    });
    tests.test('↓', (t) => {
        key(['ArrowDown'], () => {
            t.ok(controls.down);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(0, -1, 0));
        });
        t.notOk(controls.down);
        t.end();
    });
    tests.test('↙', (t) => {
        key(['ArrowDown', 'ArrowLeft'], () => {
            t.ok(controls.downleft && controls.leftdown);
            // @ts-ignore
            t.deepEqual(controls.dir, xyz(-0.7071, -0.7071, 0));
        });
        t.notOk(controls.downleft && controls.leftdown);
        t.end();
    });
    tests.test('x', (t) => {
        key(['x', 'space'], () => {
            t.ok(controls.x);
            t.ok(controls.space);
        });
        t.notOk(controls.x);
        t.notOk(controls.space);
        t.end();
    });
    controls.detach();
    tests.end();
});
tap.test('touch', (tests) => {
    const controls = new Controls(domWindow);
    const w2 = window.innerWidth / 2, h2 = window.innerHeight / 2;
    tests.test('←', (t) => {
        touch(w2 - 1, h2, () => t.ok(controls.left));
        t.notOk(controls.left);
        t.end();
    });
    tests.test('↖︎', (t) => {
        touch(w2 - 1, h2 - 1, () => t.ok(controls.leftup && controls.upleft));
        t.notOk(controls.leftup && controls.upleft);
        t.end();
    });
    tests.test('↑', (t) => {
        touch(w2, h2 - 1, () => t.ok(controls.up));
        t.notOk(controls.up);
        t.end();
    });
    tests.test('↗', (t) => {
        touch(w2 + 1, h2 - 1, () => t.ok(controls.upright && controls.rightup));
        t.notOk(controls.upright && controls.rightup);
        t.end();
    });
    tests.test('→', (t) => {
        touch(w2 + 1, h2, () => t.ok(controls.right));
        t.notOk(controls.right);
        t.end();
    });
    tests.test('↘', (t) => {
        touch(w2 + 1, h2 + 1, () => t.ok(controls.rightdown && controls.downright));
        t.notOk(controls.rightdown && controls.downright);
        t.end();
    });
    tests.test('↓', (t) => {
        touch(w2, h2 + 1, () => t.ok(controls.down));
        t.notOk(controls.down);
        t.end();
    });
    tests.test('↙', (t) => {
        touch(w2 - 1, h2 + 1, () => t.ok(controls.downleft && controls.leftdown));
        t.notOk(controls.downleft && controls.leftdown);
        t.end();
    });
    controls.detach();
    tests.end();
});
tap.test('mouse', (tests) => {
    const controls = new Controls(domWindow, true);
    const w2 = window.innerWidth / 2, h2 = window.innerHeight / 2;
    tests.test('←', (t) => {
        mouse(w2 - 1, h2, () => t.ok(controls.left));
        t.end();
    });
    tests.test('↖︎', (t) => {
        mouse(w2 - 1, h2 - 1, () => t.ok(controls.leftup && controls.upleft));
        t.end();
    });
    tests.test('↑', (t) => {
        mouse(w2, h2 - 1, () => t.ok(controls.up));
        t.end();
    });
    tests.test('↗', (t) => {
        mouse(w2 + 1, h2 - 1, () => t.ok(controls.upright && controls.rightup));
        t.end();
    });
    tests.test('→', (t) => {
        mouse(w2 + 1, h2, () => t.ok(controls.right));
        t.end();
    });
    tests.test('↘', (t) => {
        mouse(w2 + 1, h2 + 1, () => t.ok(controls.rightdown && controls.downright));
        t.end();
    });
    tests.test('↓', (t) => {
        mouse(w2, h2 + 1, () => t.ok(controls.down));
        t.end();
    });
    tests.test('↙', (t) => {
        mouse(w2 - 1, h2 + 1, () => t.ok(controls.downleft && controls.leftdown));
        t.end();
    });
    controls.detach();
    tests.end();
});
//# sourceMappingURL=controls-test.mjs.map