export function linear(
  initialValue: number,
  targetValue: number,
  duration: number,
  precision: number,
  age: number) {
  if (duration === 0) return targetValue
  const range = Math.abs(targetValue - initialValue)
  const dir = targetValue > initialValue ? 1 : -1
  const valuePerStep = range / duration * dir
  const rawValue = initialValue + valuePerStep * age
  const v = Math.floor(rawValue * 10000),
        p = Math.floor(precision * 10000)
  const rounded = (v - v % p) / 10000
  return dir > 0 && rounded > targetValue ? targetValue :
         dir < 0 && rounded < targetValue ? targetValue :
         rounded
}

export interface Sequence {
  value: any
  finished: boolean
  age: number
  step: (step: number) => void
}
export function sequence(seq: any[], duration: number, loopOver: boolean): Sequence {
  const lastIx = seq.length - 1
  let ix = 0
  const s = { value: seq[0], step: stepFn, finished: false, age: 0 }
  function stepFn(step: number) {
    s.age += step
    ix = linear(0, lastIx, duration, 1, s.age)
    s.value = seq[ix]
    if (ix === lastIx || s.age > duration) {
      if (loopOver) s.age = 0
      else s.finished = true
    }
  }
  return s
}

export interface FrameSequence {
  x: number
  y: number
  finished: boolean
  image: { width: number, height: number }
  frameSize: { width: number, height: number }
  step: (step: number) => void
}
export function frameSequence(
  seq: number[],
  duration: number,
  loopOver: boolean,
  image: {width: number, height: number},
  frameSize: {width: number, height: number}): FrameSequence {
  const valueSequence = sequence(seq, duration, loopOver)
  const framesPerRow = Math.floor(image.width / frameSize.width)
  const fs = {
    x: 0, y: 0, image, frameSize, finished: false,
    step: (step: number) => {
      valueSequence.step(step)
      fs.finished = valueSequence.finished
      const frame = valueSequence.value
      fs.x = frame % framesPerRow * frameSize.width,
      fs.y = Math.floor(frame / framesPerRow) * frameSize.height
    }
  }
  fs.step(0)
  return fs
}
