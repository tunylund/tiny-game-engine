// @ts-ignore
import tap from 'tap'
import { timeBasedTurn, turnBasedTurn } from './../src/turn'

tap.test('time-based turn', (test: any) => {
  test.ok(timeBasedTurn('test', 10))
  test.notOk(timeBasedTurn('test', 10))
  setTimeout(() => {
    test.ok(timeBasedTurn('test'))
    test.end()
  }, 10)
})

tap.test('turn-based turn', (test: any) => {
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
