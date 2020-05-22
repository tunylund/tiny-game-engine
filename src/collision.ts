import { Entity } from './entity'
import { position } from './position'
import { xyz, XYZ, sub, cross, equal, mul, negone, one, add } from './xyz'

// glory to https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
// not box, segment
export function segmentIntersects(a1: XYZ, a2: XYZ, b1: XYZ, b2: XYZ) {
  const r = sub(a2, a1)
  const s = sub(b2, b1)
  const uNumerator = cross(sub(b1, a1), r).z
  const denominator = cross(r, s).z

  // co-linear
  if (uNumerator === 0 && denominator === 0) {
    if (equal(a1, b1) || equal(a1, b2) || equal(a2, b1) || equal(a2, b2)) {
      return true
    }
    return  !((b1.x - a1.x < 0) ===
              (b1.x - a2.x < 0) ===
              (b2.x - a1.x < 0) ===
              (b2.x - a2.x < 0)) ||
            !((b1.y - a1.y < 0) ===
              (b1.y - a2.y < 0) ===
              (b2.y - a1.y < 0) ===
              (b2.y - a2.y < 0)) ||
            !((b1.z - a1.z < 0) ===
              (b1.z - a2.z < 0) ===
              (b2.z - a1.z < 0) ===
              (b2.z - a2.z < 0))
  }

  // parallel
  if (denominator === 0) {
    return false
  }

  const u = uNumerator / denominator
  const t = cross(sub(b1, a1), s).z / denominator
  return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)
}
export function intersects(a: Entity, b: Entity) {
  if (a.dim.sum === 0) { return false }
  if (b.dim.sum === 0) { return false }
  return intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'x') &&
    intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'y') &&
    intersectsDir(a.pos.cor, a.dim, b.pos.cor, b.dim, 'z')
}

function intersectsDir(acor: XYZ, adim: XYZ, bcor: XYZ, bdim: XYZ, dir: 'x'|'y'|'z') {
  const adim2 = (adim as any)[dir + '2'], bdim2 = (bdim as any)[dir + '2']
  const acordir = acor[dir], bcordir = bcor[dir]
  return overlapDir(acordir - adim2, acordir + adim2, bcordir - bdim2, bcordir + bdim2) > 0
}

function overlapDir(a1: number, a2: number, b1: number, b2: number, ltrrtl = 0) {
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
    a1 >= b1 && a2 <= b2 ? (ltrrtl > 0 ? a2 - b1 : ltrrtl < 0 ? b2 - a1 : a2 - a1 ) :

    Math.min(a2, b2) - Math.max(a1, b1)
  )
}

function overlap(a: Entity, b: Entity, velocitySignature: XYZ) {
  return xyz(
    overlapDir(
      a.pos.cor.x - a.dim.x2,
      a.pos.cor.x + a.dim.x2,
      b.pos.cor.x - b.dim.x2,
      b.pos.cor.x + b.dim.x2, velocitySignature.x),
    overlapDir(
      a.pos.cor.y - a.dim.y2,
      a.pos.cor.y + a.dim.y2,
      b.pos.cor.y - b.dim.y2,
      b.pos.cor.y + b.dim.y2, velocitySignature.y),
    overlapDir(
      a.pos.cor.z - a.dim.z2,
      a.pos.cor.z + a.dim.z2,
      b.pos.cor.z - b.dim.z2,
      b.pos.cor.z + b.dim.z2, velocitySignature.z),
  )
}

export function bump(otherEl: Entity, collidables: Entity[] = [], dir = 'z') {
  const fixSelector = xyz(
    dir === 'x' ? 1 : 0,
    dir === 'y' ? 1 : 0,
    dir === 'z' ? 1 : 0,
  )

  const sumOfIntersections = collidables
    .filter((c) => intersects(otherEl, c))
    .map((c) => overlap(otherEl, c, otherEl.pos.vel.signature))
    .reduce((a, b) => a.sum > b.sum ? a : b, xyz())
  const whatever = mul(sumOfIntersections, otherEl.pos.vel.signature)
  const correction = mul(whatever, fixSelector)

  if (correction.sum === 0) {
    return otherEl.pos
  } else {
    return position(
      sub(otherEl.pos.cor, correction),
      mul(otherEl.pos.vel, add(mul(fixSelector, negone), one)),
      otherEl.pos.acc,
    )
  }
}
