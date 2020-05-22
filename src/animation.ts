import { loop } from './loop'

export function linear(
  initialValue: number,
  currentValue: number,
  targetValue: number,
  duration: number,
  precision: number,
  step: number) {
  const mainDiff = targetValue - initialValue
  const stepPartial = duration / (step * 1000)
  const nextValueDiff = mainDiff / (stepPartial < 1 ? 1 : stepPartial)
  const nextValue = currentValue + nextValueDiff
  const previousDiff = targetValue - currentValue
  const newDiff = Math.abs(targetValue - nextValue)
  return newDiff > Math.abs(previousDiff) ? targetValue :
         newDiff <= precision ? targetValue : nextValue
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
      ix = linear(0, ix, lastIx, duration, 1, age)
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

export function valueOverTime(
  fn: (currentValue: number) => any,
  initialValue: number,
  targetValue: number,
  precision: number,
  duration: number,
  loopOver: boolean,
  win?: Window) {
  let currentValue = initialValue
  const stop = loop((step, total) => {
    currentValue = linear(initialValue, currentValue, targetValue, duration, precision, step)
    if (currentValue === targetValue) {
      if (loopOver) currentValue = initialValue
      else stop()
    }
    fn(currentValue)
  }, win)
  return stop
}
