import tap from 'tap'
import loop from './../lib/loop.mjs'
import jsdom from 'jsdom'

const window = (new jsdom.JSDOM(``, { pretendToBeVisual: true })).window

tap.test('should loop', test => {
  const stop = loop((step, total) => {
    stop()
    test.ok(step > 0)
    test.ok(total > 0)
    test.end()
  }, window)
})
