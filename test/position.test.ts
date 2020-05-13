import { xyz } from '../src/xyz'
import { position, move, gravity } from '../src/position'

describe('position', () => {
  it('should build an empty position', () => {
    const pos = position()
    expect(pos.cor).toMatchObject(xyz(0, 0, 0))
    expect(pos.vel).toMatchObject(xyz(0, 0, 0))
    expect(pos.acc).toMatchObject(xyz(0, 0, 0))
  })

  it('should build a position', () => {
    const pos = position(1, 2, 3, 11, 22, 33, 111, 222, 333)
    expect(pos.cor).toMatchObject(xyz(1, 2, 3))
    expect(pos.vel).toMatchObject(xyz(11, 22, 33))
    expect(pos.acc).toMatchObject(xyz(111, 222, 333))
  })

  it('should build a position from xyzs', () => {
    const pos = position(xyz(1, 2, 3), xyz(11, 22, 33), xyz(111, 222, 333))
    expect(pos.cor).toMatchObject(xyz(1, 2, 3))
    expect(pos.vel).toMatchObject(xyz(11, 22, 33))
    expect(pos.acc).toMatchObject(xyz(111, 222, 333))
  })

  it('should move position according to velocity', () => {
    const nextPos = move(position(0, 0, 0, 1, 1, 1), 2)
    expect(nextPos.cor).toMatchObject(xyz(2, 2, 2))
  })

  it('should move velocity according to acceleration', () => {
    const nextPos = move(position(0, 0, 0, 0, 0, 0, 1, 1, 1), 2)
    expect(nextPos.vel).toMatchObject(xyz(2, 2, 2))
  })

  it('should apply gravity', () => {
    const nextPos = gravity(position(0, 0, 0, 0, 0, 0, 1, 1, 1))
    expect(nextPos.acc).toMatchObject(xyz(1, 1, -980))
  })
})
