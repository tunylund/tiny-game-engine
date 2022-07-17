import { perlin } from '../src/noise'
import { xyz } from '../src/xyz'

// describe('noise', () => {
//   it('should generate values with third decimal as a significant digit', () => {
//     const n = noise()
//     for (let i = 0; i < 100; i++) {
//       const a = n.next().value
//       expect(a * 1000).toBeGreaterThan(1)
//     }
//   })
  // it('should generate values that alternate within three significant digits', () => {
  //   const n = noise()
  //   for (let i = 0; i < 100; i++) {
  //     const a = Math.floor(n.next().value * 1000), b = Math.floor(n.next().value * 1000)
  //     const diff = Math.abs(a - b)
  //     expect(diff).toBeGreaterThan(0)
  //   }
  // })
  // it('should generate values that do not alternate too much', () => {
  //   const n = noise()
  //   for (let i = 0; i < 100; i++) {
  //     const a = Math.floor(n.next().value * 1000), b = Math.floor(n.next().value * 1000)
  //     const diff = Math.abs(a - b)
  //     expect(diff).toBeLessThan(10)
  //   }
  // })
// })

describe('noise', () => {
  const noise = perlin()
  it('should generate values with first decimal as a significant digit', () => {
    expect(noise(xyz(0.1, 0.1)) * 10).toBeGreaterThan(1)
  })
  it('should allow negative values', () => {
    expect(noise(xyz(-0.1, -0.1)) * 10).toBeGreaterThan(1)
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