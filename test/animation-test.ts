// @ts-ignore
import tap from 'tap'
import { valueOverTime, linear } from './../src/animation'
import jsdom from 'jsdom'

// const window = (new jsdom.JSDOM(``, { pretendToBeVisual: true })).window

// tap.test('should give a linear next value', test => {
//   tap.equal(1000, linear(0, 0, 1000, 0, 20))
//   tap.equal(250, linear(0, 0, 1000, 1000, 250))
//   tap.equal(750, linear(1000, 1000, 0, 1000, 250))
//   tap.equal(1000, linear(0, 0, 1000, 1000, 1250))
//   tap.equal(1000, linear(0, 999, 1000, 1000, 20))
//   tap.equal(0, linear(1000, 1, 0, 1000, 20))
//   test.end()
// })

// tap.test('should call fn over time', test => {
//   const targetValue = 2
//   valueOverTime(nextValue => {
//     test.equal(nextValue, targetValue)
//     test.end()
//   }, 1, 2, 0.1, 0, window)
// })

// tap.test('should snap to precision', test => {
//   const targetValue = 2
//   valueOverTime(nextValue => {
//     test.equal(nextValue, targetValue)
//     test.end()
//   }, 1, 2, 1, 1000, window)
// })
