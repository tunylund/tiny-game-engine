import { Entity } from './entity'
import { position } from './position'
import { xyz, XYZ, sub, cross, equal, mul, negone, one, add, dot } from './xyz'

// glory to http://www.jeffreythompson.org/collision-detection

export function entityCollidesWithPolygon2d(entity: Entity, polygon: XYZ[]) {
  const entityPoly = [
    xyz(entity.pos.cor.x - entity.dim.x2, entity.pos.cor.y - entity.dim.y2),
    xyz(entity.pos.cor.x + entity.dim.x2, entity.pos.cor.y - entity.dim.y2),
    xyz(entity.pos.cor.x + entity.dim.x2, entity.pos.cor.y + entity.dim.y2),
    xyz(entity.pos.cor.x - entity.dim.x2, entity.pos.cor.y + entity.dim.y2)
  ].map(({x, y}) => xyz(
    x * Math.cos(entity.dir.radian) - y * Math.sin(entity.dir.radian),
    x * Math.sin(entity.dir.radian) + y * Math.cos(entity.dir.radian)
  ))

  return polyPoly(polygon, entityPoly)
}

function polyPoly(p1: XYZ[], p2: XYZ[]): boolean {
  if (p1.length < 2 || p2.length < 1) return false
  for (let current=0, next=1; current<p1.length; current++, next++) {
    if (next === p1.length) next = 0
    const vc = p1[current]
    const vn = p1[next]

    const collision = polyLine(p2, vc.x,vc.y,vn.x,vn.y)
    if (collision) return true
    const inside = polyPoint(p1, p2[0].x, p2[0].y)
    if (inside) return true
  }

  return false
}

function polyLine(vertices: XYZ[], x1: number, y1: number, x2: number, y2: number): boolean {
  for (let current=0, next=1; current<vertices.length; current++, next++) {
    if (next === vertices.length) next = 0
    const x3 = vertices[current].x
    const y3 = vertices[current].y
    const x4 = vertices[next].x
    const y4 = vertices[next].y
    const hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4)
    if (hit) return true
  }

  return false
}

function polyRect(vertices: XYZ[], rx: number, ry: number, rw: number, rh: number): boolean {
  for (let current=0, next=1; current<vertices.length; current++, next++) {
    if (next === vertices.length) next = 0
    const vc = vertices[current]
    const vn = vertices[next]
    const collision = lineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh)
    if (collision) return true
    const inside = polyPoint(vertices, rx, ry)
    if (inside) return true
  }

  return false
}

function lineRect(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean {
  const left =   lineLine(x1, y1, x2, y2, rx, ry, rx, ry+rh)
  const right =  lineLine(x1, y1, x2, y2, rx+rw, ry, rx+rw, ry+rh)
  const top =    lineLine(x1, y1, x2, y2, rx, ry, rx+rw, ry)
  const bottom = lineLine(x1, y1, x2, y2, rx, ry+rh, rx+rw, ry+rh)
  return left || right || top || bottom
}

function lineLine(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
  const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1))
  const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1))
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1
}

function polyPoint(vertices: XYZ[], px: number, py: number): boolean {
  let collision = false
  for (let current=0, next=1; current<vertices.length; current++, next++) {
    if (next === vertices.length) next = 0
    const vc = vertices[current]
    const vn = vertices[next]
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
        (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
      collision = !collision
    }
  }
  return collision
}

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

export function bump(otherEl: Entity, collidables: Entity[] = [], fixSelector: XYZ = one) {
  const biggestOverlap = collidables
    .filter((c) => intersects(otherEl, c))
    .map((c) => overlap(otherEl, c, otherEl.pos.vel.signature))
    .reduce((a, b) => a.sum > b.sum ? a : b, xyz())
  const fixVector = mul(biggestOverlap, otherEl.pos.vel.signature)
  const correction = mul(fixVector, fixSelector)

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
