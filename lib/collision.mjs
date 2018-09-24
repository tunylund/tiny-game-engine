import { position } from './position.mjs';
import { xyz } from './xyz.mjs';
export function intersects(a, b) {
    if (a.dim.sum() === 0) {
        return false;
    }
    if (b.dim.sum() === 0) {
        return false;
    }
    return intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'x') &&
        intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'y') &&
        intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'z');
}
function intersectsDir(acor, adim, bcor, bdim, dir) {
    const adim2 = adim[dir + '2'], bdim2 = bdim[dir + '2'];
    const acordir = acor[dir], bcordir = bcor[dir];
    return overlapDir(acordir - adim2, acordir + adim2, bcordir - bdim2, bcordir + bdim2) > 0;
}
function overlapDir(a1, a2, b1, b2, ltrrtl = 0) {
    return (
    //    ---
    // ---
    a1 >= b2 ? 0 :
        // ---
        //    ---
        a2 <= b1 ? 0 :
            //   ---
            //    ---
            a1 < b1 && a2 <= b2 ? a2 - b1 :
                //    ---
                //   ---
                a1 >= b1 && a2 > b2 ? b2 - a1 :
                    //   ---
                    //    -
                    a1 <= b1 && a2 >= b2 ? (ltrrtl > 0 ? a2 - b1 : ltrrtl < 0 ? b2 - a1 : b2 - b1) :
                        //    -
                        //   ---
                        a1 >= b1 && a2 <= b2 ? (ltrrtl > 0 ? a2 - b1 : ltrrtl < 0 ? b2 - a1 : a2 - a1) :
                            Math.min(a2, b2) - Math.max(a1, b1));
}
function overlap(a, b, velocitySignature) {
    return xyz(overlapDir(a.pos.cor.x - a.dim.x2, a.pos.cor.x + a.dim.x2, b.pos.cor.x - b.dim.x2, b.pos.cor.x + b.dim.x2, velocitySignature.x), overlapDir(a.pos.cor.y - a.dim.y2, a.pos.cor.y + a.dim.y2, b.pos.cor.y - b.dim.y2, b.pos.cor.y + b.dim.y2, velocitySignature.y), overlapDir(a.pos.cor.z - a.dim.z2, a.pos.cor.z + a.dim.z2, b.pos.cor.z - b.dim.z2, b.pos.cor.z + b.dim.z2, velocitySignature.z));
}
export function bump(otherEl, collidables = [], dir = 'z') {
    const fixSelector = xyz(dir === 'x' ? 1 : 0, dir === 'y' ? 1 : 0, dir === 'z' ? 1 : 0);
    const correction = collidables
        .filter((c) => intersects(otherEl, c))
        .map((c) => overlap(otherEl, c, otherEl.pos.vel.signature))
        .reduce((a, b) => a.sum() > b.sum() ? a : b, xyz())
        .mul(otherEl.pos.vel.signature)
        .mul(fixSelector);
    if (correction.sum() === 0) {
        return otherEl.pos;
    }
    else {
        return position(otherEl.pos.cor.sub(correction), otherEl.pos.vel.mul(fixSelector.mul(xyz(-1, -1, -1)).add(xyz(1, 1, 1))), otherEl.pos.acc);
    }
}
