import { polygonCollidesWithPoint, Circle } from './collision'
import { position, Position } from './position'
import { vector, xyz, XYZ, sub } from './xyz'
import { Polygon } from './polygon'
import { Layer } from './layer'
import { draw } from './draw'

interface Entity {
  pos: Position
  dim: XYZ
  dir: XYZ
}

function entity<T extends Entity>(pos: Entity|Position = position(), dim = xyz(), dir = xyz(), rest?: object): T {
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

export function collisionRect(ent: Entity): Polygon {
  return [
    xyz(- ent.dim.x2, - ent.dim.y2),
    xyz(+ ent.dim.x2, - ent.dim.y2),
    xyz(+ ent.dim.x2, + ent.dim.y2),
    xyz(- ent.dim.x2, + ent.dim.y2)
  ].map(({x, y}) => xyz(
    ent.pos.cor.x + x * Math.cos(ent.dir.radian) - y * Math.sin(ent.dir.radian),
    ent.pos.cor.y + x * Math.sin(ent.dir.radian) + y * Math.cos(ent.dir.radian)
  ))
}

export function collisionCircle(ent: Entity): Circle {
  return {
    cor: ent.pos.cor,
    r: ent.dim.size/2
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

function isAt(a: Entity, cor: XYZ) {
  return polygonCollidesWithPoint(collisionRect(a), cor)
}

function drawEntityLayer(el: Entity, layer: Layer) {
  draw(ctx => ctx.drawImage(layer.canvas, el.pos.cor.x, el.pos.cor.y), el.dim)
}

export { Entity, entity, nearest, isAt, distance, vectorTo, drawEntityLayer }
