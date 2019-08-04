// @ts-ignore
import tap from 'tap'
import { xyz } from './../src/xyz'
import { position, move, gravity } from './../src/position'

tap.test('should build an empty position', (test: any) => {
  const pos = position()
  test.deepEqual(pos.cor, xyz(0, 0, 0))
  test.deepEqual(pos.vel, xyz(0, 0, 0))
  test.deepEqual(pos.acc, xyz(0, 0, 0))
  test.end()
})

tap.test('should build a position', (test: any) => {
  const pos = position(1, 2, 3, 11, 22, 33, 111, 222, 333)
  test.deepEqual(pos.cor, xyz(1, 2, 3))
  test.deepEqual(pos.vel, xyz(11, 22, 33))
  test.deepEqual(pos.acc, xyz(111, 222, 333))
  test.end()
})

tap.test('should build a position from xyzs', (test: any) => {
  const pos = position(xyz(1, 2, 3), xyz(11, 22, 33), xyz(111, 222, 333))
  test.deepEqual(pos.cor, xyz(1, 2, 3))
  test.deepEqual(pos.vel, xyz(11, 22, 33))
  test.deepEqual(pos.acc, xyz(111, 222, 333))
  test.end()
})

tap.test('should move position according to velocity', (test: any) => {
  const nextPos = move(position(0, 0, 0, 1, 1, 1), 2)
  test.deepEqual(nextPos.cor, xyz(2, 2, 2))
  test.end()
})

tap.test('should move velocity according to acceleration', (test: any) => {
  const nextPos = move(position(0, 0, 0, 0, 0, 0, 1, 1, 1), 2)
  test.deepEqual(nextPos.vel, xyz(2, 2, 2))
  test.end()
})

tap.test('should apply gravity', (test: any) => {
  const nextPos = gravity(position(0, 0, 0, 0, 0, 0, 1, 1, 1))
  test.deepEqual(nextPos.acc, xyz(1, 1, -980))
  test.end()
})
