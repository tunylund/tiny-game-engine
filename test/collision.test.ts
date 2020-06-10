import { polygonCollidesWithPolygon } from '../src/collision'
import { position } from '../src/position'
import { entity, collisionRect } from '../src/entity'
import { xyz, one } from '../src/xyz'

describe('collision', () => {
  describe('polygon intersection', () => {
    const entityAt = (x: number, y: number) => collisionRect(entity(position(xyz(x, y)), one))
    const triangle = [ xyz(0, 0), xyz(1, 0), xyz(0, 1) ]
    const lOutside = entityAt(-0.51, 0)
    const tOutside = entityAt(0, -0.51)
    const rOutside = entityAt(1.51, 0)
    const bOutside = entityAt(0, 1.51)
    it('should detect when outside', () => {
      expect(polygonCollidesWithPolygon(lOutside, triangle)).toBeFalsy()
      expect(polygonCollidesWithPolygon(tOutside, triangle)).toBeFalsy()
      expect(polygonCollidesWithPolygon(rOutside, triangle)).toBeFalsy()
      expect(polygonCollidesWithPolygon(bOutside, triangle)).toBeFalsy()
    })
    const lOverlapping = entityAt(-0.5, -0)
    const tOverlapping = entityAt(0, -0.5)
    const rOverlapping = entityAt(0.5, 0)
    const bOverlapping = entityAt(0, 0.5)
    it('should detect when overlapping', () => {
      expect(polygonCollidesWithPolygon(lOverlapping, triangle)).toBeTruthy()
      expect(polygonCollidesWithPolygon(tOverlapping, triangle)).toBeTruthy()
      expect(polygonCollidesWithPolygon(rOverlapping, triangle)).toBeTruthy()
      expect(polygonCollidesWithPolygon(bOverlapping, triangle)).toBeTruthy()
    })
    const rRotated = collisionRect(entity(position(1, 0), one, xyz(1, 1)))
    it('should detect when rotated', () => {
      expect(polygonCollidesWithPolygon(rRotated, triangle)).toBeTruthy()
    })
  })
})
