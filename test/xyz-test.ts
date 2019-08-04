// @ts-ignore
import tap from 'tap'
import { xyz, vector2 } from './../src/xyz'

function radians(angle: number) {
  return angle * (Math.PI / 180)
}

tap.test('should add', (test: any) => {
  const a = xyz(1, 1, 1)
  const b = xyz(2, 2, 2)
  test.deepEqual(a.add(b), xyz(3, 3, 3))
  test.end()
})

tap.test('should subtract', (test: any) => {
  const a = xyz(1, 1, 1)
  const b = xyz(2, 2, 2)
  test.deepEqual(a.sub(b), xyz(-1, -1, -1))
  test.end()
})

tap.test('should be immutable', (test: any) => {
  const a = xyz(1, 1, 1)
  const b = a.add(xyz(-1, -1))
  test.deepEqual(a, xyz(1, 1, 1))
  test.deepEqual(b, xyz(0, 0, 1))
  test.end()
})

tap.test('should know angles', (test: any) => {
  test.test('0', (t: any) => {
    const a = vector2(0, 1)
    t.equal(a.x, 1)
    t.equal(a.y, 0)
    t.equal(a.angle, 0)
    t.equal(a.radian, 0)
    t.end()
  })
  test.test('45', (t: any) => {
    const a = vector2(Math.PI * 1 / 4, 1)
    t.equal(a.x, 0.7071)
    t.equal(a.y, 0.7071)
    t.equal(a.angle, 45)
    t.equal(a.radian, Math.PI / 4)
    t.end()
  })
  test.test('225', (t: any) => {
    const a = vector2(Math.PI * 5 / 4, 1)
    t.equal(a.x, -0.7071)
    t.equal(a.y, -0.7071)
    t.equal(a.angle, 225)
    t.equal(a.radian, Math.PI * 5 / 4)
    t.end()
  })
  test.test('-45', (t: any) => {
    const a = vector2(Math.PI * -1 / 4, 1)
    t.equal(a.x, 0.7071)
    t.equal(a.y, -0.7071)
    t.equal(a.angle, 315)
    t.equal(a.radian, Math.PI * 7 / 4)
    t.end()
  })
  test.end()
})
