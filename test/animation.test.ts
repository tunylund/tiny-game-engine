import { linear } from '../src/animation'

describe('animation', () => {
  describe('linear', () => {
    it('should calculate the initial value in linear scale', () => {
      expect(linear(0, 3, 3000, 1, 0)).toEqual(0)
    })
    it('should calculate the next value in linear scale', () => {
      expect(linear(0, 3, 3000, 1, 1000)).toEqual(1)
    })
    it('should calculate the next value in linear scale', () => {
      expect(linear(0, 3, 3000, 1, 2000)).toEqual(2)
    })
    it('should not go over the target value', () => {
      expect(linear(0, 3, 3000, 1, 3100)).toEqual(3)
    })
    it('should floor to defined precision', () => {
      expect(linear(0, 3, 3000, 1, 1100)).toEqual(1)
    })
  })
})