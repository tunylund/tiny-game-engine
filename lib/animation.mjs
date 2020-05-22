export function linear(initialValue, targetValue, duration, precision, age) {
    const range = targetValue - initialValue;
    const valuePerStep = range / duration;
    const rawValue = initialValue + valuePerStep * age;
    const v = Math.floor(rawValue * 10000), p = Math.floor(precision * 10000);
    const rounded = (v - v % p) / 10000;
    return rounded > targetValue ? targetValue : rounded;
}
export function sequence(seq, duration, loopOver) {
    const lastIx = seq.length - 1;
    let age = 0, ix = 0;
    const s = { value: seq[0], step: stepFn };
    function stepFn(step) {
        age += step;
        ix = linear(0, lastIx, duration, 1, age);
        s.value = seq[ix];
        if (loopOver && ix === lastIx)
            age = 0;
    }
    return s;
}
export function frameSequence(seq, duration, loopOver, image, frameSize) {
    const valueSequence = sequence(seq, duration, loopOver);
    const framesPerRow = Math.floor(image.width / frameSize.width);
    const fs = {
        x: 0, y: 0, image, frameSize,
        step: (step) => {
            valueSequence.step(step);
            const frame = valueSequence.value;
            fs.x = frame % framesPerRow * frameSize.width,
                fs.y = Math.floor(frame / framesPerRow) * frameSize.height;
        }
    };
    fs.step(0);
    return fs;
}
//# sourceMappingURL=animation.mjs.map
