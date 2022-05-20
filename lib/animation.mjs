export function linear(initialValue, targetValue, duration, precision, age) {
    if (duration === 0)
        return targetValue;
    const range = Math.abs(targetValue - initialValue);
    const dir = targetValue > initialValue ? 1 : -1;
    const valuePerStep = range / duration * dir;
    const rawValue = initialValue + valuePerStep * age;
    const v = Math.floor(rawValue * 10000), p = Math.floor(precision * 10000);
    const rounded = (v - v % p) / 10000;
    return dir > 0 && rounded > targetValue ? targetValue :
        dir < 0 && rounded < targetValue ? targetValue :
            rounded;
}
export function sequence(seq, duration, loopOver) {
    const lastIx = seq.length - 1;
    let ix = 0;
    const s = { value: seq[0], step: stepFn, finished: false, age: 0 };
    function stepFn(step) {
        s.age += step;
        ix = linear(0, lastIx, duration, 1, s.age);
        s.value = seq[ix];
        if (ix === lastIx || s.age > duration) {
            if (loopOver)
                s.age = 0;
            else
                s.finished = true;
        }
    }
    return s;
}
export function frameSequence(seq, duration, loopOver, image, frameSize) {
    const valueSequence = sequence(seq, duration, loopOver);
    const framesPerRow = Math.floor(image.width / frameSize.width);
    const fs = {
        x: 0, y: 0, image, frameSize, finished: false,
        step: (step) => {
            valueSequence.step(step);
            fs.finished = valueSequence.finished;
            const frame = valueSequence.value;
            fs.x = frame % framesPerRow * frameSize.width,
                fs.y = Math.floor(frame / framesPerRow) * frameSize.height;
        }
    };
    fs.step(0);
    return fs;
}
//# sourceMappingURL=animation.mjs.map