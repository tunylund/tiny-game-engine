interface XYZ {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly x2: number
  readonly y2: number
  readonly z2: number
  readonly radian: number
  readonly angle: number
  readonly size: number
  readonly sum: number
  readonly signature: XYZ
  readonly unit: XYZ
}

export function cross(a: XYZ, v: XYZ) { return xyz(a.y * v.z - a.z * v.y, a.x * v.z - a.z * v.x, a.x * v.y - a.y * v.x)}
export function dot(a: XYZ, v: XYZ) { return mul(a, v).sum }
export function add(a: XYZ, v: XYZ) { return xyz(a.x + v.x, a.y + v.y, a.z + v.z) }
export function sub(a: XYZ, v: XYZ) { return xyz(a.x - v.x, a.y - v.y, a.z - v.z) }
export function mul(a: XYZ, v: XYZ) { return xyz(a.x * v.x, a.y * v.y, a.z * v.z) }
export function div(a: XYZ, v: XYZ) { return xyz(a.x / v.x, a.y / v.y, a.z / v.z) }
export function equal(a: XYZ, v: XYZ) { return a.x === v.x && a.y === v.y && a.z === v.z }

export function xyz(x: number|XYZ = 0, y = 0, z = 0): XYZ {
  if (typeof x === 'number') {
    const radian = (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2)
    const angle = (radian * 180 / Math.PI + 360) % 360
    const size = Math.sqrt(x * x + y * y + z * z)
    const sum = Math.abs(x) + Math.abs(y) + Math.abs(z)
    const signature = {
      x: x === 0 ? 1 : Math.abs(x) / x,
      y: y === 0 ? 1 : Math.abs(y) / y,
      z: z === 0 ? 1 : Math.abs(z) / z,
    } as XYZ
    const unit = {
      x: x === 0 ? 0 : 1 * signature.x,
      y: y === 0 ? 0 : 1 * signature.y,
      z: z === 0 ? 0 : 1 * signature.z,
    } as XYZ
    return {
      x, y, z,
      x2: x / 2,
      y2: y / 2,
      z2: z / 2,
      radian, angle, size, sum, signature, unit
    }
  } else {
    return xyz(x.x, x.y, x.z)
  }
}

export function vector(radian: number, force = 1) { return xyz(
  Math.round(force * Math.cos(radian) * 10000) / 10000,
  Math.round(force * Math.sin(radian) * 10000) / 10000,
)}

export function cube(v: number) { return xyz(v, v, v) }

const negone = xyz(-1, -1, -1)
const zero = xyz(0, 0, 0)
const half = xyz(0.5, 0.5, 0.5)
const one = xyz(1, 1, 1)
const two = xyz(2, 2, 2)

export { XYZ, negone, zero, half, one, two }
