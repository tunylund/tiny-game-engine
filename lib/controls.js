import { vector, xyz, zero } from './xyz.js';
export var Direction;
(function (Direction) {
    Direction["leftdown"] = "leftdown";
    Direction["left"] = "left";
    Direction["leftup"] = "leftup";
    Direction["upleft"] = "upleft";
    Direction["up"] = "up";
    Direction["upright"] = "upright";
    Direction["rightup"] = "rightup";
    Direction["right"] = "right";
    Direction["rightdown"] = "rightdown";
    Direction["downright"] = "downright";
    Direction["down"] = "down";
    Direction["downleft"] = "downleft";
})(Direction || (Direction = {}));
function handleKey(key, isDown, controls) {
    controls.keys[key] = isDown;
    const angle = controls.keys.ArrowRight ? (controls.keys.ArrowUp ? 45 : controls.keys.ArrowDown ? 315 : 0) :
        controls.keys.ArrowLeft ? (controls.keys.ArrowUp ? 135 : controls.keys.ArrowDown ? 225 : 180) :
            controls.keys.ArrowUp ? 90 :
                controls.keys.ArrowDown ? 270 : Infinity;
    controls.dir = angle > 360 ? xyz() : vector(angle * (Math.PI / 180), 1);
    updateDirection(controls);
}
function handleTouch(touchPoint, center, controls, resetTimeout) {
    const { pageX, pageY } = touchPoint;
    controls.cor = xyz(pageX - center.x, pageY - center.y);
    controls.dir = vector(Math.atan2(center.y - pageY, pageX - center.x), 1);
    updateDirection(controls);
    clearTimeout(resetTimeout);
    return setTimeout(() => {
        controls.dir = zero;
        updateDirection(controls);
    });
}
// function handleMouse(event: MouseEvent, center: XYZ, controls: Controls, clearMouseTimeout: number) {
//   const { clientX, clientY } = event
//   controls.cor = xyz(clientX - center.x, clientY - center.y)
//   controls.dir = vector(Math.atan2(center.y - clientY, clientX - center.x), 1)
//   updateDirection(controls)
//   clearTimeout(clearMouseTimeout)
//   return setTimeout(() => {
//     controls.dir = zero
//     controls.cor = zero
//     updateDirection(controls)
//   })
// }
function updateDirection(controls) {
    const { dir: { size, angle }, direction } = controls;
    direction.downleft =
        direction.leftdown = size > 0 && angle >= 180 && angle <= 270;
    direction.left = size > 0 && angle >= 135 && angle <= 225;
    direction.leftup =
        direction.upleft = size > 0 && angle < 180 && angle > 90;
    direction.up = size > 0 && angle > 45 && angle < 135;
    direction.rightup =
        direction.upright = size > 0 && angle <= 90 && angle >= 0;
    direction.right = size > 0 && ((angle >= 275 && angle <= 360) || angle <= 45);
    direction.downright =
        direction.rightdown = size > 0 && angle <= 360 && angle > 270;
    direction.down = size > 0 && angle > 225 && angle < 275;
}
export function buildControls(window) {
    let resetTimeout;
    const center = () => xyz(window.innerWidth / 2, window.innerHeight / 2);
    const keyDown = (e) => handleKey(e.code, true, controls);
    const keyUp = (e) => handleKey(e.code, false, controls);
    const touchStart = (ev) => resetTimeout = handleTouch(ev.changedTouches[0], center(), controls, resetTimeout);
    const touchEnd = () => controls.dir = controls.cor = zero;
    // const mouse = (ev: MouseEvent) => resetTimeout = handleMouse(ev, center(), controls, resetTimeout)
    const attach = () => {
        window.document.body.addEventListener('keydown', keyDown, false);
        window.document.body.addEventListener('keyup', keyUp, false);
        window.document.body.addEventListener('touchstart', touchStart, false);
        window.document.body.addEventListener('touchend', touchEnd, false);
        // window.document.body.addEventListener('click', mouse, false)
    };
    const detach = () => {
        window.document.body.removeEventListener('keydown', keyDown, false);
        window.document.body.removeEventListener('keyup', keyUp, false);
        window.document.body.removeEventListener('touchstart', touchStart, false);
        window.document.body.removeEventListener('touchend', touchEnd, false);
        // window.document.body.removeEventListener('click', mouse, false)
        clearTimeout(resetTimeout);
    };
    const controls = {
        direction: {
            leftdown: false,
            left: false,
            leftup: false,
            upleft: false,
            up: false,
            upright: false,
            rightup: false,
            right: false,
            downright: false,
            rightdown: false,
            down: false,
            downleft: false,
        },
        cor: zero,
        dir: zero,
        keys: {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        },
        attach, detach
    };
    attach();
    return controls;
}
//# sourceMappingURL=controls.js.map
