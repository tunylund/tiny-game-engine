import { intersects } from './collision'
import { xyz, XYZ } from './xyz'

const GRAVITY = -981

interface Position {
  cor: XYZ,
  vel: XYZ,
  acc: XYZ
}

function position(
  x: number|XYZ|Position = 0,
  y: number|XYZ = 0,
  z: number|XYZ = 0,
  vx = 0, vy = 0, vz = 0,
  ax = 0, ay = 0, az = 0) {
  const p = {} as Position
  if (x instanceof XYZ) {
    p.cor = x || xyz()
    p.vel = (y as XYZ) || xyz()
    p.acc = (z as XYZ) || xyz()
  } else if (typeof x === 'number') {
    p.cor = xyz(x, y as number, z as number)
    p.vel = xyz(vx, vy, vz)
    p.acc = xyz(ax, ay, az)
  } else {
    p.cor = xyz(x.cor)
    p.vel = xyz(x.vel)
    p.acc = xyz(x.acc)
  }
  return p
}

function move(pos: Position, step: number) {
  const vel = pos.vel.add(pos.acc.mul(xyz(step, step, step)))
  const cor = pos.cor.add(vel.mul(xyz(step, step, step)))
  return position(cor, vel, pos.acc)
}

function stop(pos: Position) {
  return position(pos.cor, xyz(), xyz())
}

function gravity(pos: Position) {
  return position(pos.cor, pos.vel, pos.acc.add(xyz(0, 0, GRAVITY)))
}

const dimension = xyz

export { Position, position, dimension, move, gravity, stop }
