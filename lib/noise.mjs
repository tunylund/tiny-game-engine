import { dot, vector, xyz, sub } from './xyz.mjs';
function easing(x) {
    return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);
}
function interpolate(s, t, x) {
    return s + easing(x) * (t - s);
}
export function* noise() {
    let x = 0.1;
    const y = 0.5;
    let grid = [
        vector(Math.PI * 2 * Math.random(), 1),
        vector(Math.PI * 2 * Math.random(), 1),
        vector(Math.PI * 2 * Math.random(), 1),
        vector(Math.PI * 2 * Math.random(), 1)
    ];
    while (true) {
        const s = dot(grid[0], sub(xyz(x, y), xyz(0, 0)));
        const t = dot(grid[0], sub(xyz(x, y), xyz(1, 0)));
        const a = interpolate(s, t, x);
        const u = dot(grid[2], sub(xyz(x, y), xyz(0, 1)));
        const v = dot(grid[3], sub(xyz(x, y), xyz(1, 1)));
        const b = interpolate(u, v, x);
        yield interpolate(a, b, y);
        x += 0.1;
        if (x >= 1) {
            x = 0.1;
            grid = [
                grid[2], grid[3],
                vector(Math.PI * 2 * Math.random(), 1),
                vector(Math.PI * 2 * Math.random(), 1)
            ];
        }
    }
}
//# sourceMappingURL=noise.mjs.map