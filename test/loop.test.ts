import { loop } from '../src/loop'
import jsdom from 'jsdom'

const window = (new jsdom.JSDOM('', { pretendToBeVisual: true })).window as unknown as Window

describe('loop', () => {
  it('should loop', (done) => {
    const stop = loop((step, total) => {
      stop()
      expect(step).toBeGreaterThan(0)
      expect(total).toBeGreaterThan(0)
      done()
    }, window)
  })
})