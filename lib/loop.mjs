const STOP = -1;
export function loop(fn, win) {
    const raf = (win || window).requestAnimationFrame;
    const caf = (win || window).cancelAnimationFrame;
    const start = Date.now();
    const maxStepDiff = 100;
    let previousStepTime = start;
    let frmToken = raf(step);
    async function step() {
        const now = Date.now();
        const stepDuration = Math.min(now - previousStepTime, maxStepDiff) / 1000;
        const gameDuration = now - start;
        await fn(stepDuration, gameDuration);
        previousStepTime = now;
        if (frmToken !== STOP) {
            frmToken = raf(step);
        }
    }
    return () => {
        if (frmToken !== STOP)
            caf(frmToken);
        frmToken = STOP;
    };
}
//# sourceMappingURL=loop.mjs.map
