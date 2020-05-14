import loop from './loop.js';
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
export function valueOverTime(fn, initialValue, targetValue, precision, duration, win) {
    let currentValue = initialValue;
    const stop = loop((step, total) => {
        currentValue = linear(initialValue, currentValue, targetValue, duration, precision, step);
        if (currentValue === targetValue) {
            stop();
        }
        fn(currentValue);
    }, win);
}
//# sourceMappingURL=animation.js.map
