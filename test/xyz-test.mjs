import tap from 'tap'
import { xyz } from './../lib/xyz.mjs'

const a = xyz(1, 1, 1)
const b = xyz(2, 2, 2)

tap.test('should add', test => {
  test.deepEqual(a.add(b), xyz(3, 3, 3))
  test.end()
})

tap.test('should subtract', test => {
  test.deepEqual(a.sub(b), xyz(-1, -1, -1))
  test.end()
})

tap.test('should be immutable', test => {
  const a = xyz(1, 1, 1)
  const b = a.add(xyz(-1, -1))
  test.deepEqual(a, xyz(1, 1, 1))
  test.deepEqual(b, xyz(0, 0, 1))
  test.end()
})
