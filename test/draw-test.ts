import { drawing, draw, isometricDraw, stopDrawLoop } from './../src/draw'
import jsdom from 'jsdom'
// @ts-ignore
import tap from 'tap'
import { position } from './../src/position'

function prepare() {
  const { window } = (new jsdom.JSDOM('', { pretendToBeVisual: true }))
  // @ts-ignore
  window.innerWidth = 100
  // @ts-ignore
  window.innerHeight = 100
  return window
}

tap.test('should resize with window', (test: any) => {
  const window = prepare()
  // @ts-ignore
  window.innerHeight = 50
  window.dispatchEvent(new window.Event('resize'))
  draw((ctx, cw, ch) => {
    stopDrawLoop()
    test.ok(ctx)
    test.equal(cw, 50)
    test.equal(ch, 25)
    test.end()
  }, position(), undefined, window)
})

tap.test('should draw in a loop', (test: any) => {
  const window = prepare()
  draw(() => {
    draw((ctx, cw, ch) => {
      stopDrawLoop()
      test.end()
    }, position(), undefined, window)
  }, position(), undefined, window)
})

tap.test('should organize drawing by their z index', (test: any) => {
  const window = prepare()
  const drawOrder: number[] = []
  draw(() => drawOrder.push(0), position(0, 0, 0), undefined, window)
  draw(() => drawOrder.push(-1), position(0, 0, -1), undefined, window)
  draw(() => drawOrder.push(1), position(0, 0, 0), undefined, window)
  draw(() => {
    stopDrawLoop()
    test.deepEqual(drawOrder, [-1, 0, 1])
    test.end()
  }, position(0, 0, 0), undefined, window)
})

tap.test('should provide fn api', (test: any) => {
  const window = prepare()
  draw((ctx, cw, ch) => {
    isometricDraw((ictx: any) => {
      stopDrawLoop()
      test.ok(ictx)
      test.end()
    }, position(), window)
  }, position(), undefined, window)
})

// tap.test('should provide an api for drawing an element on position', (test: any) => {
//   const window = prepare()
//   const img = drawing(20, 20, () => {}, window)
//   draw(img, { cor: { x: 0, y: 0, z: 0 } }, { x: 1, y: 1, z: 1 }, window)
//   isometricDraw(img, { cor: { x: 0, y: 0, z: 0 }}, { x: 1, y: 1, z: 1 }, window)
//   draw(() => {
//     stopDrawLoop()
//   }, position(), xyz(), window)
// })

tap.test('should provide an api for drawing on a canvas', (test: any) => {
  const cvs = drawing(20, 20, (ctx) => test.ok(ctx), new jsdom.JSDOM().window)
  test.ok(cvs)
  test.equal(cvs.width, 20)
  test.equal(cvs.height, 20)
  test.end()
})
