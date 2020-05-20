import { linear } from '../src/animation'

describe('animation', () => {
  describe('linear', () => {
    it('should calculate the next value in linear scale', () => {
      expect(linear(0, 0, 3, 3000, 1, 1)).toEqual(1)
    })
    it('should not go over the target value', () => {
      expect(linear(0, 3, 3, 3000, 1, 1)).toEqual(3)
    })
  })
})