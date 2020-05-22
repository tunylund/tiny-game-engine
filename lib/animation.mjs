import { loop } from './loop.mjs';
export function linear(initialValue, currentValue, targetValue, duration, precision, step) {
    const mainDiff = targetValue - initialValue;
    const stepPartial = duration / (step * 1000);
    const nextValueDiff = mainDiff / (stepPartial < 1 ? 1 : stepPartial);
    const nextValue = currentValue + nextValueDiff;
    const previousDiff = targetValue - currentValue;
    const newDiff = Math.abs(targetValue - nextValue);
    return newDiff > Math.abs(previousDiff) ? targetValue :
        newDiff <= precision ? targetValue : nextValue;
}
export function sequence(seq, duration, loopOver) {
    const lastIx = frames.length - 1;
    let age = 0, ix = 0;
    const s = {
        value: seq[0],
        step: (step) => {
            age += step;
            ix = linear(0, ix, lastIx, duration, 1, age);
            if (loopOver && ix === lastIx)
                age = 0;
        }
    };
    return s;
}
export function frameSequence(seq, duration, loopOver, image, tileSize) {
    const valueSequence = sequence(seq, duration, loopOver);
    const framesPerRow = Math.floor(image.width / tileSize);
    const fs = {
        x: 0, y: 0,
        step: (step) => {
            valueSequence.step(step);
            const frame = valueSequence.value;
            fs.x = frame % framesPerRow * tileSize,
                fs.y = Math.floor(frame / framesPerRow);
        }
    };
    fs.step(0);
    return fs;
}
export function valueOverTime(fn, initialValue, targetValue, precision, duration, loopOver, win) {
    let currentValue = initialValue;
    const stop = loop((step, total) => {
        currentValue = linear(initialValue, currentValue, targetValue, duration, precision, step);
        if (currentValue === targetValue) {
            if (loopOver)
                currentValue = initialValue;
            else
                stop();
        }
        fn(currentValue);
    }, win);
    return stop;
}
//# sourceMappingURL=animation.mjs.map
