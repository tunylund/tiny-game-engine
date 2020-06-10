import { XYZ, sub, mul, add, dot, cube } from './xyz'
import { Polygon } from './polygon'

// all the glory to http://www.jeffreythompson.org/collision-detection


interface Point {
  x: number,
  y: number
}

export interface Circle {
  cor: XYZ,
  r: number
}

export function polygonCollidesWithPolygon(p1: Polygon, p2: Polygon): boolean {
  if (p1.length < 2 || p2.length < 1) return false
  for (let current=0, next=1; current<p1.length; current++, next++) {
    if (next === p1.length) next = 0
    const collision = polyLine(p2, p1[current], p1[next])
    if (collision) return true
    const inside = polygonCollidesWithPoint(p1, p2[0])
    if (inside) return true
  }

  return false
}

export function circleCollidesWithPolygon(circle: Circle, polygon: Polygon): boolean {
  for (let current=0, next=1; current < polygon.length; current++, next++) {
    if (next === polygon.length) next = 0
    const collision = lineCircle(polygon[current], polygon[next], circle)
    if (collision) return true
  }

  return polygonCollidesWithPoint(polygon, circle.cor)
}

function lineCircle(a: XYZ, b: XYZ, circle: Circle): boolean {
  if (pointCircle(a, circle) || pointCircle(b, circle)) return true
  const line = sub(b, a)
  const len = line.size
  const dott = cube(dot(sub(circle.cor, a), line) / Math.pow(len, 2))
  const closest = add(a, mul(dott, line))
  const onSegment = linePoint(a, b, closest)
  if (!onSegment) return false
  return sub(closest, circle.cor).size <= circle.r
}

function linePoint(a: XYZ, b: XYZ, p: XYZ): boolean {
  const d1 = sub(p, a).size
  const d2 = sub(p, b).size
  const lineLen = sub(b, a).size
  const buffer = 0.1
  return d1+d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer
}

function pointCircle(p: XYZ, circle: Circle): boolean {
  const distance = sub(p, circle.cor).size
  return distance <= circle.r
}

function polyLine(vertices: Polygon, a: Point, b: Point): boolean {
  for (let current=0, next=1; current<vertices.length; current++, next++) {
    if (next === vertices.length) next = 0
    const hit = lineLine(a, b, vertices[current], vertices[next])
    if (hit) return true
  }
  return false
}

function lineLine(a: Point, b: Point, c: Point, d: Point): boolean {
  const uA = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y))
  const uB = ((b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x)) / ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y))
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1
}

export function polygonCollidesWithPoint(vertices: Polygon, p: Point): boolean {
  let collision = false
  for (let current=0, next=1; current<vertices.length; current++, next++) {
    if (next === vertices.length) next = 0
    const vc = vertices[current]
    const vn = vertices[next]
    if (((vc.y > p.y && vn.y < p.y) || (vc.y < p.y && vn.y > p.y)) &&
        (p.x < (vn.x - vc.x) * (p.y - vc.y) / (vn.y - vc.y) + vc.x)) {
      collision = !collision
    }
  }
  return collision
}
