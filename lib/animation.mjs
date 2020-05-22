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
export function frameSequence(frames, duration, loopOver) {
    let frame = frames[0];
    const stop = valueOverTime(index => {
        frame = frames[index];
    }, 0, frames.length, 1, duration, loopOver);
    return { frame, stop };
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
