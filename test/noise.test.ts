import { perlin } from '../src/noise'
import { xyz } from '../src/xyz'

describe('noise', () => {
  const noise = perlin()
  it('should generate values with first decimal as a significant digit', () => {
    expect(noise(xyz(0.1, 0.1)) * 10).toBeGreaterThan(1)
  })
  it('should allow negative values', () => {
    expect(noise(xyz(-0.1, -0.1))).toBeLessThan(0)
  })
  it('should produce same value every time', () => {
    expect(noise(xyz(-0.1, -0.1))).toEqual(noise(xyz(-0.1, -0.1)))
  })
  it('should generate values that alternate within two significant digits', () => {
    const a = Math.floor(noise(xyz(0.1, 0.1)) * 100), b = Math.floor(noise(xyz(0.2, 0.2)) * 100)
    const diff = Math.abs(a - b)
    expect(diff).toBeGreaterThan(1)
  })
  it('should generate values that do not alternate too much', () => {
    const a = noise(xyz(0.1, 0.1)), b = noise(xyz(0.2, 0.2))
    const diff = Math.abs(a - b)
    expect(diff).toBeLessThan(0.2)
  })
})