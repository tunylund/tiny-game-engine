import { noise } from '../src/noise'

describe('noise', () => {
  it('should generate values with third decimal as a significant digit', () => {
    const n = noise()
    for (let i = 0; i < 100; i++) {
      const a = n.next().value
      expect(a * 1000).toBeGreaterThan(1)
    }
  })
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
})

// describe('perlin', () => {
//   it('should generate values with first decimal as a significant digit', () => {
//     expect(perlin(0, 0) * 10).toBeGreaterThan(1)
//   })
//   it('should generate values that alternate within two significant digits', () => {
//     const a = Math.floor(perlin(0, 0) * 100), b = Math.floor(perlin(1, 1) * 100)
//     const diff = Math.abs(a - b)
//     expect(diff).toBeGreaterThan(1)
//   })
//   it('should generate values that do not alternate too much', () => {
//     const a = Math.floor(perlin(0, 0) * 100), b = Math.floor(perlin(1, 1) * 100)
//     const diff = Math.abs(a - b)
//     expect(diff).toBeLessThan(2)
//   })
// })