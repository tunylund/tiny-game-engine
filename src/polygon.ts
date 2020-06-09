import { xyz, add, sub, vector } from './xyz'

export type Point = { x: number, y: number }
export type Polygon = Point[]

export function imageToPolygon(imageData: Uint8ClampedArray, width: number, height: number, accuracy = 48): Polygon {
  return rayCastPolygon({data: imageData, width, height}, accuracy)
}

function alphaAt(imageData: ImageData, point: Point): number {
  return imageData.data[point.x * 4 + point.y * imageData.width * 4 + 3]
}

function ray(ax: number, ay: number, bx: number, by: number, imageData: ImageData) {
  const a = xyz(ax, ay), b = xyz(bx, by)
  const stepVector = vector(sub(b, a).radian, 1)
  for (let p=xyz(a); sub(p, b).size > 1; p=add(p, stepVector)) {
    const point = { x: Math.round(p.x), y: Math.round(p.y) }
    if (alphaAt(imageData, point) !== 0) return point
  }
  return {x: -1, y: -1}
}

function rayCastPolygon(imageData: ImageData, accuracy = 8): Point[] {
  const w = imageData.width-1, h = imageData.height-1,
        cx = Math.floor(w/2), cy = Math.floor(h/2)
  const edgeDistance = w * 2 + h * 2
  const segmentSize = edgeDistance / accuracy
  const rayCastPoints = []
  for (let p = 0; p < edgeDistance; p+=segmentSize) {
    const {x, y} = p <= w ? {x: p, y: 0} :
                  p >= w && p < w+h ? {x: w, y: p-w} :
                  p >= w + h && p < w+h+w ? {x: w-(p-w-h), y: h} :
                  {x: 0, y: h-(p-w-h-w)}
    rayCastPoints.push({x: Math.round(x), y: Math.round(y)})
  }

  return rayCastPoints
    .map(point => ray(point.x, point.y, cx, cy, imageData))
    .filter(({x, y}) => x > -1 && y > -1)
}