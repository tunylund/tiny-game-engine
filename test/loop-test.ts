// @ts-ignore
import tap from 'tap'
import loop from './../src/loop'
import jsdom from 'jsdom'

const window = (new jsdom.JSDOM('', { pretendToBeVisual: true })).window as unknown as Window

tap.test('should loop', (test: any) => {
  const stop = loop((step, total) => {
    stop()
    test.ok(step > 0)
    test.ok(total > 0)
    test.end()
  }, window)
})
