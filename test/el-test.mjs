import tap from 'tap'
import { el } from './../lib/el.mjs'
import { position } from './../lib/position.mjs'
import { xyz } from './../lib/xyz.mjs'

const a = el(position(0, 0, 0))
const b = el(position(2, 2, 2))

tap.test('should know distance', test => {
  test.deepEqual(a.dist(b), xyz(2, 2, 2).size)
  test.deepEqual(b.dist(a), a.dist(b))
  test.end()
})

tap.test('should accept extra attributes', test => {
  const c = el(position(), xyz(), {foo: 'bar'})
  test.deepEqual(c.foo, 'bar')
  test.end()
})
