import { loop } from '../src/loop'

describe('loop', () => {
  const timers = {
    requestAnimationFrame: setImmediate,
    cancelAnimationFrame: clearImmediate
  }

  it('should loop once', (done) => {
    const stop = loop((step, total) => {
      expect(step).toBeGreaterThanOrEqual(0)
      expect(total).toBeGreaterThanOrEqual(0)
      stop()
      done()
    }, timers)
  })

  it('should loop twice', (done) => {
    let count = 0
    const stop = loop((step, total) => {
      count++
      if (count === 1) {
        stop()
        done()
      }
    }, timers)
  })
})