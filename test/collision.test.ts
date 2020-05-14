import { segmentIntersects, intersects, bump } from '../src/collision'
import { position, dimension } from '../src/position'
import { entity } from '../src/entity'
import { xyz } from '../src/xyz'

describe('collision', () => {
  // it('should provide closest position upon collision', () => {
  //   const pos = position(0.25, 0.25, 0.25, 1, 1, 1)
  //   const dim = { x: 1, y: 1, z: 1 }
  //   const suggestion = collide(pos, dim, [{
  //     cor: { x: 1, y: 1, z: 1 },
  //     dim: { x: 1, y: 1, z: 1 }
  //   }])
  //   test.deepEqual(suggestion, position(0, 0, 0, 1, 1, 1))
  //   test.end()
  // })

  // it('should apply inverse acceleration', () => {
  //   const pos = position(0.25, 0.25, 0.25, 1, 1, 1, 1, 1, 1)
  //   const dim = xyz(1, 1, 1)
  //   const suggestion = bump(el(pos, dim), [el(
  //     position(xyz(1, 1, 1)),
  //     xyz(1, 1, 1),
  //   )])
  //   test.deepEqual(suggestion, position(0, 0, 0, 1, 1, 1, 0, 0, 0))
  //   test.end()
  // })

  it('should not intersect', () => {
    expect(segmentIntersects(xyz(), xyz(1), xyz(2), xyz(3))).toBeFalsy()
    expect(segmentIntersects(xyz(), xyz(1), xyz(0, 1), xyz(1, 1))).toBeFalsy()
  })

  it('should intersect', () => {
    expect(segmentIntersects(xyz(), xyz(2), xyz(1), xyz(3))).toBeTruthy()
    expect(segmentIntersects(xyz(), xyz(1), xyz(), xyz(0, 1))).toBeTruthy()
    expect(segmentIntersects(xyz(), xyz(1), xyz(), xyz(0, 1))).toBeTruthy()
  })

  it('should not intersect', () => {
    expect(intersects(
      entity(position(0, 0, 0),
        dimension(1, 1, 1)),
      entity(position(1, 1, 1),
        dimension(1, 1, 1)),
    )).toBeFalsy()
  })

  it('should not intersect if some dimension does not collide', () => {
    expect(intersects(
      entity(position(0, 0.5, 0.5),
        dimension(1, 1, 1)),
      entity(position(1, 1, 1),
        dimension(1, 1, 1)),
    )).toBeFalsy()
  })

  it('should intersect if partly collides', () => {
    expect(intersects(
      entity(position(0.5, 0.5, 0.5),
        dimension(1, 1, 1)),
      entity(position(1, 1, 1),
        dimension(1, 1, 1)),
    )).toBeTruthy()
  })

  it('should intersect if entirely collides', () => {
    expect(intersects(
      entity(position(1, 1, 1),
        dimension(1, 1, 1)),
      entity(position(1, 1, 1),
        dimension(1, 1, 1)),
    )).toBeTruthy()
  })

  it('bump should not change output if no collisions', () => {
    expect(bump(
      {pos: position(0, 0, 0), dim: dimension(1, 1, 1)},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
      'z',
    )).toMatchObject(position(0, 0, 0))
  })

  it('bump should fix pos and vel in output if collides', () => {
    expect(bump(
      {pos: position(0.5, 0.5, 0.75, 1, 1, 1), dim: dimension(1, 1, 1)},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
      'z',
    )).toMatchObject(position(0.5, 0.5, 0, 1, 1, 0))
  })

  it('bump should fix pos and vel to the opposite direction of vel in output if collides', () => {
    expect(bump(
      {pos: position(1.5, 1.5, 1.25, 1, 1, -1), dim: dimension(1, 1, 1)},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1)}],
      'z',
    )).toMatchObject(position(1.5, 1.5, 2, 1, 1, -0))
  })

  it('bump should fix pos assuming position is the center of the object', () => {
    expect(bump(
      {pos: position(-1, -1, 0, 1, 0, 0), dim: dimension(1, 1, 1)},
      [{pos: position(0, 0, 0), dim: dimension(10, 10, 1)}],
      'x',
    )).toMatchObject(position(-5.5, -1, 0, 0, 0, 0))
  })
})
