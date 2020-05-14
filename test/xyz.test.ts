import { xyz, vector, add, sub } from '../src/xyz'

describe('xyz', () => {
  it('should add', () => {
    const a = xyz(1, 1, 1)
    const b = xyz(2, 2, 2)
    expect(add(a, b)).toMatchObject(xyz(3, 3, 3))
  })

  it('should subtract', () => {
    const a = xyz(1, 1, 1)
    const b = xyz(2, 2, 2)
    expect(sub(a, b)).toMatchObject(xyz(-1, -1, -1))
  })

  it('should be immutable', () => {
    const a = xyz(1, 1, 1)
    const b = add(a, xyz(-1, -1))
    expect(a).toMatchObject(xyz(1, 1, 1))
    expect(b).toMatchObject(xyz(0, 0, 1))
  })

  describe('angles', () => {
    it.each([
      [0, 1, 1, 0, 0],
      [Math.PI * 1 / 4, 1, 0.7071, 0.7071, 45],
      [Math.PI * 5 / 4, 1, -0.7071, -0.7071, 225],
      [Math.PI * 7 / 4, 1, 0.7071, -0.7071, 315]
    ])('should know angles $angle', (radian, force, x, y, angle) => {
      const a = vector(radian, force)
      expect(a).toMatchObject({ x, y, angle, radian })
    })

    it('should not get confused with negative angles', () => {
      const a = vector(Math.PI * -1 / 4, 1)
      expect(a).toMatchObject({
        x: 0.7071,
        y: -0.7071,
        angle: 315,
        radian: Math.PI * 7 / 4
      })
    })
  })
})
