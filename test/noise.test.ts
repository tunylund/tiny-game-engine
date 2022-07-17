import { noise } from '../src/noise'

describe('noise', () => {
  it('should generate values of decent specificity', () => {
    const n = noise()
    for (let i = 0; i < 100; i++) {
      const a = n.next().value
      expect(a * 10).toBeGreaterThan(1)
    }
  })
  it('should generate a value close to the next value', () => {
    const n = noise()
    for (let i = 0; i < 100; i++) {
      const a = n.next().value, b = n.next().value
      expect(Math.abs(a - b)).toBeLessThan(0.1)
      expect(Math.abs(a - b)).toBeGreaterThan(0)
    }
  })
})