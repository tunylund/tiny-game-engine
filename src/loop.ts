const STOP = -1

interface TimerContainer {
  requestAnimationFrame: (step: () => void) => any
  cancelAnimationFrame: (token: any) => any
}

export function loop(fn: (stepDuration: number, gameDuration: number) => void, win?: TimerContainer|undefined) {
  const raf = (win || window).requestAnimationFrame
  const caf = (win || window).cancelAnimationFrame

  const start = Date.now()
  const maxStepDiff = 100
  let previousStepTime = start
  let frmToken = raf(step)

  function step() {
    const now = Date.now()
    const stepDuration = Math.min(now - previousStepTime, maxStepDiff)
    const gameDuration = now - start
    fn(stepDuration, gameDuration)
    previousStepTime = now
    if (frmToken !== STOP) { frmToken = raf(step) }
  }

  return () => {
    if (frmToken !== STOP) caf(frmToken)
    frmToken = STOP
  }
}
