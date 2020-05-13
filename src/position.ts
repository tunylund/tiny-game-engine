import { xyz, XYZ, mul, add } from './xyz'

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
  ax = 0, ay = 0, az = 0): Position {
  if (typeof x === 'number') {
    return {
      cor: xyz(x, y as number, z as number),
      vel: xyz(vx, vy, vz),
      acc: xyz(ax, ay, az)
    }
  } else if ('cor' in x) {
    return {
      cor: xyz(x.cor),
      vel: xyz(x.vel),
      acc: xyz(x.acc)
    }
  } else {
    return {
      cor: x || xyz(),
      vel: (y as XYZ) || xyz(),
      acc: (z as XYZ) || xyz()
    }
  }
}

function move(pos: Position, step: number) {
  const vel = add(pos.vel, mul(pos.acc, xyz(step, step, step)))
  const cor = add(pos.cor, mul(vel, xyz(step, step, step)))
  return position(cor, vel, pos.acc)
}

function stop(pos: Position) {
  return position(pos.cor, xyz(), xyz())
}

function gravity(pos: Position) {
  return position(pos.cor, pos.vel, add(pos.acc, xyz(0, 0, GRAVITY)))
}

const dimension = xyz

export { Position, position, dimension, move, gravity, stop }
