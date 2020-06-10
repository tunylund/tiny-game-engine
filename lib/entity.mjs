import { intersects } from './collision.mjs';
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
function isAt(a, cor, precision = 0.1) {
    const dim = typeof precision === 'number' ? xyz(precision, precision, precision) : precision;
    return intersects(a, entity(position(cor), dim));
}
export { entity, nearest, isAt, distance, vectorTo };
//# sourceMappingURL=entity.mjs.map
