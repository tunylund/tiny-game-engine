import { dot, vector, xyz, sub } from './xyz.js';
function easing(x) {
    return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);
}
function interpolate(s, t, x) {
    return s + easing(x) * (t - s);
}
export function perlin() {
    const grid = {};
    return (cor) => noise(cor, grid);
}
function getVector(grid, x, y) {
    const ix = `${x},${y}`;
    if (!grid[ix])
        grid[ix] = vector(Math.PI * 2 * Math.random(), 1);
    return grid[ix];
}
function noise(cor, grid) {
    const x0 = Math.floor(cor.x);
    const y0 = Math.floor(cor.y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const s = dot(getVector(grid, x0, y0), sub(cor, xyz(x0, y0)));
    const t = dot(getVector(grid, x1, y0), sub(cor, xyz(x1, y0)));
    const a = interpolate(s, t, cor.x - x0);
    const u = dot(getVector(grid, x0, y1), sub(cor, xyz(x0, y1)));
    const v = dot(getVector(grid, x1, y1), sub(cor, xyz(x1, y1)));
    const b = interpolate(u, v, cor.x - x0);
    return interpolate(a, b, cor.y - y0);
}
//# sourceMappingURL=noise.js.map