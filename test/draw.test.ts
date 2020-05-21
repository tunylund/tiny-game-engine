import { draw, isometricDraw, stopDrawLoop, drawImage } from '../src/draw'
import jsdom from 'jsdom'
import { position } from '../src/position'
import { xyz } from '../src/xyz'

function prepare() {
  const { window } = new jsdom.JSDOM('', { pretendToBeVisual: true })
  const domWindow = window as unknown as Window
  // @ts-ignore
  window.innerWidth = 100
  // @ts-ignore
  window.innerHeight = 100
  return {window, domWindow}
}

describe('draw', () => {
  it('should resize with window', (done) => {
    const {window, domWindow} = prepare()
    // @ts-ignore
    window.innerHeight = 50
    window.dispatchEvent(new window.Event('resize'))
    draw((ctx, cw, ch) => {
      stopDrawLoop()
      expect(ctx).toBeTruthy()
      expect(cw).toEqual(50)
      expect(ch).toEqual(25)
      done()
    }, xyz(), undefined, domWindow)
  })

  it('should draw in a loop', (done) => {
    const {domWindow} = prepare()
    draw(() => {
      draw((ctx, cw, ch) => {
        stopDrawLoop()
        done()
      }, xyz(), undefined, domWindow)
    }, xyz(), undefined, domWindow)
  })

  it('should organize drawing by their z index', (done) => {
    const {domWindow} = prepare()
    const drawOrder: number[] = []
    draw(() => drawOrder.push(0), xyz(0, 0, 0), undefined, domWindow)
    draw(() => drawOrder.push(-1), xyz(0, 0, -1), undefined, domWindow)
    draw(() => drawOrder.push(1), xyz(0, 0, 0), undefined, domWindow)
    draw(() => {
      stopDrawLoop()
      expect(drawOrder).toMatchObject([-1, 0, 1])
      done()
    }, xyz(0, 0, 0), undefined, domWindow)
  })

  it('should provide fn api', (done) => {
    const {domWindow} = prepare()
    draw((ctx, cw, ch) => {
      isometricDraw((ictx: any) => {
        stopDrawLoop()
        expect(ictx).toBeTruthy()
        done()
      }, xyz(), domWindow)
    }, xyz(), undefined, domWindow)
  })
})
