import { segmentIntersects, intersects, bump, entityCollidesWithPolygon2d } from '../src/collision'
import { position, dimension } from '../src/position'
import { entity } from '../src/entity'
import { xyz, zero, one } from '../src/xyz'

describe('collision', () => {

  describe('polygon intersection', () => {
    const entityAt = (x: number, y: number) => entity(position(xyz(x, y)), one)
    const triangle = [ xyz(0, 0), xyz(1, 0), xyz(0, 1) ]
    const lOutside = entityAt(-0.51, 0)
    const tOutside = entityAt(0, -0.51)
    const rOutside = entityAt(1.51, 0)
    const bOutside = entityAt(0, 1.51)
    it('should detect when outside', () => {
      expect(entityCollidesWithPolygon2d(lOutside, triangle)).toBeFalsy()
      expect(entityCollidesWithPolygon2d(tOutside, triangle)).toBeFalsy()
      expect(entityCollidesWithPolygon2d(rOutside, triangle)).toBeFalsy()
      expect(entityCollidesWithPolygon2d(bOutside, triangle)).toBeFalsy()
    })
    const lOverlapping = entityAt(-0.5, -0)
    const tOverlapping = entityAt(0, -0.5)
    const rOverlapping = entityAt(0.5, 0)
    const bOverlapping = entityAt(0, 0.5)
    it('should detect when overlapping', () => {
      expect(entityCollidesWithPolygon2d(lOverlapping, triangle)).toBeTruthy()
      expect(entityCollidesWithPolygon2d(tOverlapping, triangle)).toBeTruthy()
      expect(entityCollidesWithPolygon2d(rOverlapping, triangle)).toBeTruthy()
      expect(entityCollidesWithPolygon2d(bOverlapping, triangle)).toBeTruthy()
    })
    const rRotated = entity(position(1, 0), one, xyz(1, 1))
    it('should detect when rotated', () => {
      expect(entityCollidesWithPolygon2d(rRotated, triangle)).toBeTruthy()
    })
  })

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
      {pos: position(0, 0, 0), dim: dimension(1, 1, 1), dir: zero},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1), dir: zero}],
      xyz(0, 0, 1),
    )).toMatchObject(position(0, 0, 0))
  })

  it('bump should fix pos and vel in output if collides', () => {
    expect(bump(
      {pos: position(0.5, 0.5, 0.75, 1, 1, 1), dim: dimension(1, 1, 1), dir: zero},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1), dir: zero}],
      xyz(0, 0, 1),
    )).toMatchObject(position(0.5, 0.5, 0, 1, 1, 0))
  })

  it('bump should fix pos and vel to the opposite direction of vel in output if collides', () => {
    expect(bump(
      {pos: position(1.5, 1.5, 1.25, 1, 1, -1), dim: dimension(1, 1, 1), dir: zero},
      [{pos: position(1, 1, 1), dim: dimension(1, 1, 1), dir: zero}],
      xyz(0, 0, 1),
    )).toMatchObject(position(1.5, 1.5, 2, 1, 1, -0))
  })

  it('bump should fix pos assuming position is the center of the object', () => {
    expect(bump(
      {pos: position(-1, -1, 0, 1, 0, 0), dim: dimension(1, 1, 1), dir: zero},
      [{pos: position(0, 0, 0), dim: dimension(10, 10, 1), dir: zero}],
      xyz(1, 0, 0),
    )).toMatchObject(position(-5.5, -1, 0, 0, 0, 0))
  })
})
