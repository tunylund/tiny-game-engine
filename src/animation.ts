export function linear(
  initialValue: number,
  targetValue: number,
  duration: number,
  precision: number,
  age: number) {
  const range = targetValue - initialValue
  const valuePerStep = range / duration
  const rawValue = initialValue + valuePerStep * age
  const v = Math.floor(rawValue * 10000),
        p = Math.floor(precision * 10000)
  const rounded = (v - v % p) / 10000
  return rounded > targetValue ? targetValue : rounded
}

export interface Sequence {
  value: number
  step: (step: number) => void
}
export function sequence(seq: number[], duration: number, loopOver: boolean): Sequence {
  const lastIx = seq.length - 1
  let age = 0, ix = 0
  const s = {
    value: seq[0],
    step: (step: number) => {
      age += step
      ix = linear(0, lastIx, duration, 1, age)
      if (loopOver && ix === lastIx) age = 0
    }
  }
  return s
}

export interface FrameSequence {
  x: number
  y: number
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
    x: 0, y: 0, image, frameSize,
    step: (step: number) => {
      valueSequence.step(step)
      const frame = valueSequence.value
      fs.x = frame % framesPerRow * frameSize.width,
      fs.y = Math.floor(frame / framesPerRow) * frameSize.height
    }
  }
  fs.step(0)
  return fs
}
