import jsdom from 'jsdom'
import { buildLayer, resizeCanvas, colorAt, getRow } from '../src/layer'

describe('layer', () => {

  beforeAll(() => {
    const { window } = new jsdom.JSDOM('', { pretendToBeVisual: true })
    // @ts-ignore
    window.innerWidth = 100
    // @ts-ignore
    window.innerHeight = 100
    // @ts-ignore
    global.window = window
  })

  afterAll(() => {
    // @ts-ignore
    delete global.window
  })

  it('should resize canvas', () => {
    const layer = buildLayer(10, 10)
    layer.context.fillStyle = 'black'
    layer.context.fillRect(0, 0, layer.w, layer.h)
    const result = resizeCanvas(layer, 12, 12)
    expect(colorAt(0, getRow(0, result).data)[3]).toBe(0)
    expect(colorAt(1, getRow(1, result).data)[3]).toBe(255)
  })
})