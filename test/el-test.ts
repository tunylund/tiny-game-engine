// @ts-ignore
import tap from 'tap'
import { el, dist, isAt } from './../src/el'
import { position } from './../src/position'
import { xyz } from './../src/xyz'

const a = el(position(0, 0, 0), xyz(1, 1, 1))
const b = el(position(2, 2, 2), xyz(1, 1, 1))

tap.test('should know distance', (test: any) => {
  test.deepEqual(dist(a, b), xyz(2, 2, 2).size)
  test.deepEqual(dist(b, a), dist(a, b))
  test.end()
})

tap.test('should accept extra attributes', (test: any) => {
  const c = el(position(), xyz(), {foo: 'bar'})
  // @ts-ignore
  test.deepEqual(c.foo, 'bar')
  test.end()
})

tap.test('should be at', (test: any) => {
  test.ok(isAt(a, xyz(0, 0, 0)))
  test.ok(isAt(a, xyz(1, 1, 1), 2))
  test.notOk(isAt(a, xyz(1, 1, 1), 1))
  test.end()
})
