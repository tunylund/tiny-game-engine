import { dot, vector, xyz, sub } from './xyz.js';
function smootherStep(v) {
    return 6 * v ** 5 - 15 * v ** 4 + 10 * v ** 3;
}
function interpolate(v, a, b) {
    return a + smootherStep(v) * (b - a);
}
export function* noise() {
    const pos = xyz();
    let prev = [
        vector(Math.PI * 2 * Math.random(), 1),
        vector(Math.PI * 2 * Math.random(), 1)
    ];
    while (true) {
        const next = [
            vector(Math.PI * 2 * Math.random(), 1),
            vector(Math.PI * 2 * Math.random(), 1)
        ];
        const tl = dot(sub(pos, prev[0]), prev[0]);
        const tr = dot(sub(pos, prev[1]), prev[1]);
        const bl = dot(sub(pos, next[0]), next[0]);
        const br = dot(sub(pos, next[1]), next[1]);
        const xt = interpolate(pos.x, tl, tr);
        const xb = interpolate(pos.x, bl, br);
        const v = interpolate(pos.y, xt, xb);
        yield v;
        prev = next;
    }
}
//# sourceMappingURL=noise.js.map