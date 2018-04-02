import { xyz } from './xyz.mjs'
import { position } from './position.mjs'

export function intersects (apos, adim, bpos, bdim) {
  if (adim.sum() === 0) return false
  if (bdim.sum() === 0) return false
  return intersectsDir(apos.cor, adim, bpos.cor, bdim, 'x') && intersectsDir(apos.cor, adim, bpos.cor, bdim, 'y') && intersectsDir(apos.cor, adim, bpos.cor, bdim, 'z')
}

function intersectsDir (acor, adim, bcor, bdim, dir) {
  const adim2 = adim[dir + '2'], bdim2 = bdim[dir + '2']
  return overlapDir(acor[dir] - adim2, acor[dir] + adim2, bcor[dir] - bdim2, bcor[dir] + bdim2) > 0
}

function overlapDir(a1, a2, b1, b2, ltrrtl) {
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

function overlap(acor, adim, bcor, bdim, velocitySignature) {
  return xyz(
    overlapDir(acor.x - adim.x2, acor.x + adim.x2, bcor.x - bdim.x2, bcor.x + bdim.x2, velocitySignature.x),
    overlapDir(acor.y - adim.y2, acor.y + adim.y2, bcor.y - bdim.y2, bcor.y + bdim.y2, velocitySignature.y),
    overlapDir(acor.z - adim.z2, acor.z + adim.z2, bcor.z - bdim.z2, bcor.z + bdim.z2, velocitySignature.z)
  )
}

export function bump(a, collidables = [], dir = 'z') {
  const fixSelector = xyz(
    dir === 'x' ? 1 : 0,
    dir === 'y' ? 1 : 0,
    dir === 'z' ? 1 : 0
  )

  let correction = collidables
    .filter(c => intersects(a.pos, a.dim, c.pos, c.dim))
    .map(c => overlap(a.pos.cor, a.dim, c.pos.cor, c.dim, a.pos.vel.signature))
    .reduce((a, b) => a.sum() > b.sum() ? a : b, xyz())
    .mul(a.pos.vel.signature)
    .mul(fixSelector)

  if (correction.sum() === 0) return a.pos
  else return position(
    a.pos.cor.sub(correction),
    a.pos.vel.mul(fixSelector.mul(xyz(-1, -1, -1)).add(xyz(1, 1, 1))),
    a.pos.acc
  )
}
