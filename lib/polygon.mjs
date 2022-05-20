import { xyz, add, sub, vector } from './xyz.mjs';
const NULLPOINT = 'NULL';
export function imageToPolygon(imageData, width, height, accuracy = 48) {
    return rayCastPolygon({ data: imageData, width, height }, accuracy);
}
export function rect(cor, dim) {
    return [
        xyz(cor.x - dim.x2, cor.y - dim.y2),
        xyz(cor.x + dim.x2, cor.y - dim.y2),
        xyz(cor.x + dim.x2, cor.y + dim.y2),
        xyz(cor.x - dim.x2, cor.y + dim.y2)
    ];
}
function alphaAt(imageData, point) {
    return imageData.data[point.x * 4 + point.y * imageData.width * 4 + 3];
}
function ray(ax, ay, bx, by, imageData) {
    const a = xyz(ax, ay), b = xyz(bx, by);
    const stepVector = vector(sub(b, a).radian, 1);
    for (let p = xyz(a); sub(p, b).size > 1; p = add(p, stepVector)) {
        const point = { x: Math.round(p.x), y: Math.round(p.y), z: 0 };
        if (alphaAt(imageData, point) !== 0)
            return xyz(point);
    }
    return NULLPOINT;
}
function rayCastPolygon(imageData, accuracy = 8) {
    const w = imageData.width - 1, h = imageData.height - 1, cx = Math.floor(w / 2), cy = Math.floor(h / 2);
    const edgeDistance = w * 2 + h * 2;
    const segmentSize = edgeDistance / accuracy;
    const rayCastPoints = [];
    for (let p = 0; p < edgeDistance; p += segmentSize) {
        const { x, y } = p <= w ? { x: p, y: 0 } :
            p >= w && p < w + h ? { x: w, y: p - w } :
                p >= w + h && p < w + h + w ? { x: w - (p - w - h), y: h } :
                    { x: 0, y: h - (p - w - h - w) };
        rayCastPoints.push({ x: Math.round(x), y: Math.round(y) });
    }
    return rayCastPoints
        .map(point => ray(point.x, point.y, cx, cy, imageData))
        .filter((point) => point !== NULLPOINT);
}
//# sourceMappingURL=polygon.mjs.map