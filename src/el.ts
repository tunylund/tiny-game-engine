import { intersects } from './collision'
import { position, Position } from './position'
import { vector2, xyz, XYZ, sub } from './xyz'

interface El {
  pos: Position,
  dim: XYZ
}

function el<T extends El>(pos: El|Position, dim: XYZ = xyz(), rest?: object): T {
  if ('cor' in pos) {
    return Object.assign({ pos, dim } as T, rest)
  } else {
    return Object.assign({
      pos: position(pos.pos),
      dim: xyz(pos.dim)
    } as T, rest)
  }
}

function vectorTo(e: El, otherEl: El, size = dist(e, otherEl)) {
  return vector2(sub(otherEl.pos.cor, e.pos.cor).radian, size)
}

function nearest<T extends El>(els: T[], cor: XYZ): T|null {
  return els.reduce((memo: T|null, otherEl) => !memo || (
    sub(cor,otherEl.pos.cor).size > 0 &&
    sub(cor,otherEl.pos.cor).size < sub(cor, memo.pos.cor).size
  ) ? otherEl : memo, null)
}

function dist(a: El, b: El) {
  return sub(a.pos.cor, b.pos.cor).size
}

function isAt(a: El, cor: XYZ, precision: number|XYZ = 0.1) {
  const dim = typeof precision === 'number' ? xyz(precision, precision, precision) : precision
  return intersects(a, el(position(cor), dim))
}

export { El, el, nearest, isAt, dist, vectorTo }
