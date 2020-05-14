import { intersects } from './collision.js';
import { position } from './position.js';
import { vector, xyz, sub } from './xyz.js';
function el(pos, dim = xyz(), rest) {
    if ('cor' in pos) {
        return Object.assign({ pos, dim }, rest);
    }
    else {
        return Object.assign({
            pos: position(pos.pos),
            dim: xyz(pos.dim)
        }, rest);
    }
}
function vectorTo(e, otherEl, size = dist(e, otherEl)) {
    return vector(sub(otherEl.pos.cor, e.pos.cor).radian, size);
}
function nearest(els, cor) {
    return els.reduce((memo, otherEl) => !memo || (sub(cor, otherEl.pos.cor).size > 0 &&
        sub(cor, otherEl.pos.cor).size < sub(cor, memo.pos.cor).size) ? otherEl : memo, null);
}
function dist(a, b) {
    return sub(a.pos.cor, b.pos.cor).size;
}
function isAt(a, cor, precision = 0.1) {
    const dim = typeof precision === 'number' ? xyz(precision, precision, precision) : precision;
    return intersects(a, el(position(cor), dim));
}
export { el, nearest, isAt, dist, vectorTo };
//# sourceMappingURL=El.js.map
