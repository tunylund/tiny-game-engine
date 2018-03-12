import { setup, drawing } from './../lib/draw.mjs'
import jsdom from 'jsdom'
import tap from 'tap'
import td from 'testdouble'

function prepare () {
  const { window } = new jsdom.JSDOM()
  window.innerWidth = 100
  window.innerHeight = 100
  return { ...setup(window), window }
}

tap.test('should resize with window', test => {
  const { draw, window } = prepare()
  window.innerHeight = 50
  window.dispatchEvent(new window.Event('resize'))
  draw((ctx, cw, ch) => {
    test.ok(ctx)
    test.equal(cw, 50)
    test.equal(ch, 25)
  })
  test.end()
})

tap.test('should provide fn api', test => {
  const { draw, isometricDraw } = prepare()
  draw((ctx, cw, ch) => test.ok(ctx))
  isometricDraw((ctx, cw, ch) => test.ok(ctx))
  test.end()
})

tap.test('should provide an api for drawing an element on position', test => {
  const { draw, isometricDraw, window } = prepare()
  const img = drawing(20, 20, ctx => {}, window)
  draw(img, { cor: { x: 0, y: 0, z: 0 } }, { x: 1, y: 1, z: 1 })
  isometricDraw(img, { cor: { x: 0, y: 0, z: 0 }}, { x: 1, y: 1, z: 1 })
  test.end()
})

tap.test('should provide an api for drawing on a canvas', test => {
  const cvs = drawing(20, 20, ctx => {
    test.ok(ctx)
  }, new jsdom.JSDOM().window)
  test.ok(cvs)
  test.equal(cvs.width, 20)
  test.equal(cvs.height, 20)
  test.end()
})