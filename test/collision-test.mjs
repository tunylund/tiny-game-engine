import tap from 'tap'
import { segmentIntersects, intersects, bump } from './../lib/collision.mjs'
import { position, dimension } from './../lib/position.mjs'
import { el } from './../lib/el.mjs'
import { xyz } from './../lib/xyz.mjs'

// tap.test('should provide closest position upon collision', test => {
//   const pos = position(0.25, 0.25, 0.25, 1, 1, 1)
//   const dim = { x: 1, y: 1, z: 1 }
//   const suggestion = collide(pos, dim, [{
//     cor: { x: 1, y: 1, z: 1 },
//     dim: { x: 1, y: 1, z: 1 }
//   }])
//   test.deepEqual(suggestion, position(0, 0, 0, 1, 1, 1))
//   test.end()
// })

// tap.test('should apply inverse acceleration', test => {
//   const pos = position(0.25, 0.25, 0.25, 1, 1, 1, 1, 1, 1)
//   const dim = { x: 1, y: 1, z: 1 }
//   const suggestion = collide(pos, dim, [{
//     cor: { x: 1, y: 1, z: 1 },
//     dim: { x: 1, y: 1, z: 1 }
//   }])
//   test.deepEqual(suggestion, position(0, 0, 0, 1, 1, 1, 0, 0, 0))
//   test.end()
// })

tap.test('should not intersect', test => {
  test.notOk(segmentIntersects(xyz(), xyz(1), xyz(2), xyz(3)))
  test.notOk(segmentIntersects(xyz(), xyz(1), xyz(0, 1), xyz(1, 1)))
  test.end()
})

tap.test('should intersect', test => {
  test.ok(segmentIntersects(xyz(), xyz(2), xyz(1), xyz(3)))
  test.ok(segmentIntersects(xyz(), xyz(1), xyz(), xyz(0, 1)))
  test.ok(segmentIntersects(xyz(), xyz(1), xyz(), xyz(0, 1)))
  test.end()
})

tap.test('should not intersect', test => {
  test.notOk(intersects(
    el(position(0, 0, 0),
      dimension(1, 1, 1)),
    el(position(1, 1, 1),
      dimension(1, 1, 1))
  ))
  test.end()
})

tap.test('should not intersect if some dimension does not collide', test => {
  test.notOk(intersects(
    el(position(0, 0.5, 0.5),
      dimension(1, 1, 1)),
    el(position(1, 1, 1),
      dimension(1, 1, 1))
  ))
  test.end()
})

tap.test('should intersect if partly collides', test => {
  test.ok(intersects(
    el(position(0.5, 0.5, 0.5),
      dimension(1, 1, 1)),
    el(position(1, 1, 1),
      dimension(1, 1, 1))
  ))
  test.end()
})

tap.test('should intersect if entirely collides', test => {
  test.ok(intersects(
    el(position(1, 1, 1),
      dimension(1, 1, 1)),
    el(position(1, 1, 1),
      dimension(1, 1, 1))
  ))
  test.end()
})

tap.test('bump should not change output if no collisions', test => {
  test.deepEqual(bump(
    {pos: position(0, 0, 0), dim: dimension(1, 1, 1)},
    [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
    'z'
  ), position(0, 0, 0))
  test.end()
})

tap.test('bump should fix pos and vel in output if collides', test => {
  test.deepEqual(bump(
    {pos: position(0.5, 0.5, 0.75, 1, 1, 1), dim: dimension(1, 1, 1)},
    [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
    'z'
  ), position(0.5, 0.5, 0, 1, 1, 0))
  test.end()
})

tap.test('bump should fix pos and vel to the opposite direction of vel in output if collides', test => {
  test.deepEqual(bump(
    {pos: position(1.5, 1.5, 1.25, 1, 1, -1), dim: dimension(1, 1, 1)},
    [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
    'z'
  ), position(1.5, 1.5, 2, 1, 1, -0))
  test.end()
})

tap.test('bump should fix pos assuming position is the center of the object', test => {
  test.deepEqual(bump(
    {pos: position(-1, -1, 0, 1, 0, 0), dim: dimension(1, 1, 1)},
    [{pos: position(0, 0, 0), dim: dimension(10, 10, 1)}],
    'x'
  ), position(-5.5, -1, 0, 0, 0, 0))
  test.end()
})
