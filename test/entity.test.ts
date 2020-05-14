import { entity, distance, isAt, Entity } from '../src/entity'
import { position } from '../src/position'
import { xyz } from '../src/xyz'

const a = entity(position(0, 0, 0), xyz(1, 1, 1))
const b = entity(position(2, 2, 2), xyz(1, 1, 1))

describe('el', () => {
  it('should know distance', () => {
    expect(distance(a, b)).toEqual(xyz(2, 2, 2).size)
    expect(distance(b, a)).toEqual(distance(a, b))
  })

  it('should accept extra attributes', () => {
    interface SomeInterface extends Entity {
      foo: string
    }
    const c = entity<SomeInterface>(position(), xyz(), {foo: 'bar'})
    expect(c.foo).toBe('bar')
  })

  it('should know where it is at', () => {
    expect(isAt(a, xyz(0, 0, 0))).toBeTruthy()
    expect(isAt(a, xyz(1, 1, 1), 2)).toBeTruthy()
    expect(isAt(a, xyz(1, 1, 1), 1)).toBeFalsy()
  })
})
