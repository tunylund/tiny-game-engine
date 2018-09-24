import { intersects } from './collision'
import { position, Position } from './position'
import { vector2, xyz, XYZ } from './xyz'

interface El {
  pos: Position,
  dim: XYZ
}

function el(pos: El|Position, dim: XYZ = xyz(), rest?: object) {
  const e = {} as El
  if (pos.hasOwnProperty('cor')) {
    e.pos = pos as Position
    e.dim = dim
  } else {
    e.pos = position((pos as El).pos)
    e.dim = xyz((pos as El).dim)
  }
  return Object.assign(e, rest)
}

function vectorTo(e: El, otherEl: El, size = dist(e, otherEl)) {
  return vector2(otherEl.pos.cor.sub(e.pos.cor).radian, size)
}

function nearest<T extends El>(els: T[], cor: XYZ): T|null {
  return els.reduce((memo: T|null, otherEl) => !memo || (
    cor.sub(otherEl.pos.cor).size > 0 &&
    cor.sub(otherEl.pos.cor).size < cor.sub(memo.pos.cor).size
  ) ? otherEl : memo, null)
}

function dist(a: El, b: El) {
  return a.pos.cor.sub(b.pos.cor).size
}

function isAt(a: El, cor: XYZ, precision: number|XYZ = 0.1) {
  const dim = typeof precision === 'number' ? xyz(precision, precision, precision) : precision
  return intersects(a, el(position(cor), dim))
}

export { El, el, nearest, isAt, dist, vectorTo }
