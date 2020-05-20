import { intersects } from './collision'
import { position, Position } from './position'
import { vector, xyz, XYZ, sub } from './xyz'

interface Entity {
  pos: Position
  dim: XYZ
  dir: XYZ
}

function entity<T extends Entity>(pos: Entity|Position, dim = xyz(), dir = xyz(), rest?: object): T {
  if ('cor' in pos) {
    return Object.assign({ pos, dim, dir } as T, rest)
  } else {
    return Object.assign({
      pos: position(pos.pos),
      dim: xyz(pos.dim),
      dir: xyz(pos.dir)
    } as T, rest)
  }
}

function vectorTo(from: Entity, to: Entity, size = distance(from, to)) {
  return vector(sub(to.pos.cor, from.pos.cor).radian, size)
}

function nearest<T extends Entity>(entities: T[], cor: XYZ): T|null {
  return entities.reduce((memo: T|null, other) => !memo || (
    sub(cor,other.pos.cor).size > 0 &&
    sub(cor,other.pos.cor).size < sub(cor, memo.pos.cor).size
  ) ? other : memo, null)
}

function distance(a: Entity, b: Entity) {
  return sub(a.pos.cor, b.pos.cor).size
}

function isAt(a: Entity, cor: XYZ, precision: number|XYZ = 0.1) {
  const dim = typeof precision === 'number' ? xyz(precision, precision, precision) : precision
  return intersects(a, entity(position(cor), dim))
}

export { Entity, entity, nearest, isAt, distance, vectorTo }
