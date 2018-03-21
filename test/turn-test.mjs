import tap from 'tap'
import { timeBasedTurn, turnBasedTurn } from './../lib/turn.mjs'

tap.test('time-based turn', test => {
  test.ok(timeBasedTurn('test', 10))
  test.notOk(timeBasedTurn('test', 10))
  setTimeout(() => {
    test.ok(timeBasedTurn('test'))
    test.end()
  }, 10)
})

tap.test('turn-based turn', test => {
  test.ok(turnBasedTurn('a'))
  test.ok(turnBasedTurn('b'))
  test.notOk(turnBasedTurn('b'))
  test.ok(turnBasedTurn('a'))
  test.ok(turnBasedTurn('b', 10))
  test.notOk(turnBasedTurn('a'))
  setTimeout(() => {
    test.ok(turnBasedTurn('a'))
    test.end()
  }, 10)
})
