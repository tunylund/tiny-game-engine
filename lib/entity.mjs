import { polygonCollidesWithPoint } from './collision.mjs';
import { position } from './position.mjs';
import { vector, xyz, sub } from './xyz.mjs';
function entity(pos = position(), dim = xyz(), dir = xyz(), rest) {
    if ('cor' in pos) {
        return Object.assign({ pos, dim, dir }, rest);
    }
    else {
        return Object.assign({
            pos: position(pos.pos),
            dim: xyz(pos.dim),
            dir: xyz(pos.dir)
        }, rest);
    }
}
export function collisionRect(ent) {
    return [
        xyz(-ent.dim.x2, -ent.dim.y2),
        xyz(+ent.dim.x2, -ent.dim.y2),
        xyz(+ent.dim.x2, +ent.dim.y2),
        xyz(-ent.dim.x2, +ent.dim.y2)
    ].map(({ x, y }) => xyz(ent.pos.cor.x + x * Math.cos(ent.dir.radian) - y * Math.sin(ent.dir.radian), ent.pos.cor.y + x * Math.sin(ent.dir.radian) + y * Math.cos(ent.dir.radian)));
}
export function collisionCircle(ent) {
    return {
        cor: ent.pos.cor,
        r: ent.dim.size / 2
    };
}
function vectorTo(from, to, size = distance(from, to)) {
    return vector(sub(to.pos.cor, from.pos.cor).radian, size);
}
function nearest(entities, cor) {
    return entities.reduce((memo, other) => !memo || (sub(cor, other.pos.cor).size > 0 &&
        sub(cor, other.pos.cor).size < sub(cor, memo.pos.cor).size) ? other : memo, null);
}
function distance(a, b) {
    return sub(a.pos.cor, b.pos.cor).size;
}
function isAt(a, cor) {
    return polygonCollidesWithPoint(collisionRect(a), cor);
}
export { entity, nearest, isAt, distance, vectorTo };
//# sourceMappingURL=entity.mjs.map