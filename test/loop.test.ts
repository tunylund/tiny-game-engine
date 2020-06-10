import { loop } from '../src/loop'

describe('loop', () => {
  const timers = {
    requestAnimationFrame: setImmediate,
    cancelAnimationFrame: clearImmediate
  }

  it('should loop', (done) => {
    const stop = loop((step, total) => {
      stop()
      expect(step).toBeGreaterThanOrEqual(0)
      expect(total).toBeGreaterThanOrEqual(0)
      done()
    }, timers)
  })

  it('should loop async steps', (done) => {
    let count = 0
    const stop = loop((step, total) => {
      count++
      return new Promise((resolve) => setTimeout(() => {
        resolve()
        stop()
        done()
      }, 10))
    }, {
      requestAnimationFrame: (cb) => {
        expect(count).toBe(0)
        return setImmediate(cb)
      },
      cancelAnimationFrame: clearImmediate
    })
  })
})