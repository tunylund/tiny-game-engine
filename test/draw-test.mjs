import { drawing, draw, isometricDraw, stopDrawLoop } from './../lib/draw.mjs'
import jsdom from 'jsdom'
import tap from 'tap'
import td from 'testdouble'
import { position } from './../lib/position.mjs'
import { xyz } from './../lib/xyz.mjs'

return

function prepare () {
  const { window } = (new jsdom.JSDOM(``, { pretendToBeVisual: true }))
  window.innerWidth = 100
  window.innerHeight = 100
  return window
}

tap.test('should resize with window', test => {
  const window = prepare()
  window.innerHeight = 50
  window.dispatchEvent(new window.Event('resize'))
  draw((ctx, cw, ch) => {
    stopDrawLoop()
    test.ok(ctx)
    test.equal(cw, 50)
    test.equal(ch, 25)
    test.end()
  }, position(), xyz(), window)
})

tap.test('should draw in a loop', test => {
  const window = prepare()
  let drawCount = 0
  draw(() => {
    draw((ctx, cw, ch) => {
      stopDrawLoop()
      test.end()
    }, position(), xyz(), window)
  }, position(), xyz(), window)
})

tap.test('should organize drawing by their z index', test => {
  const window = prepare()
  let drawOrder = []
  draw(() => drawOrder.push(0), position(0, 0, 0), xyz(), window)
  draw(() => drawOrder.push(-1), position(0, 0, -1), xyz(), window)
  draw(() => drawOrder.push(1), position(0, 0, 0), xyz(), window)
  draw(() => {
    stopDrawLoop()
    test.deepEqual(drawOrder, [-1, 0, 1])
    test.end()
  }, position(0, 0, 0), xyz(), window)
})

tap.test('should provide fn api', test => {
  const window = prepare()
  draw((ctx, cw, ch) => {
    isometricDraw((ctx, cw, ch) => {
      stopDrawLoop()
      test.ok(ctx)
      test.end()
    }, position(), xyz(), window)
  }, position(), xyz(), window)
})

tap.test('should provide an api for drawing an element on position', test => {
  const window = prepare()
  const img = drawing(20, 20, ctx => {}, window)
  draw(img, { cor: { x: 0, y: 0, z: 0 } }, { x: 1, y: 1, z: 1 }, window)
  isometricDraw(img, { cor: { x: 0, y: 0, z: 0 }}, { x: 1, y: 1, z: 1 }, window)
  draw(() => {
    stopDrawLoop()
    test.end()
  }, position(), xyz(), window)
})

tap.test('should provide an api for drawing on a canvas', test => {
  const cvs = drawing(20, 20, ctx => test.ok(ctx), new jsdom.JSDOM().window)
  test.ok(cvs)
  test.equal(cvs.width, 20)
  test.equal(cvs.height, 20)
  test.end()
})
