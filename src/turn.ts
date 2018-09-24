const timeBasedTurns: { [index: string]: boolean } = {}
export function timeBasedTurn(name: string, timing = 250) {
  if (!timeBasedTurns.hasOwnProperty(name) || timeBasedTurns[name]) {
    timeBasedTurns[name] = false
    setTimeout((x) => timeBasedTurns[name] = true, timing)
    return true
  }
  return false
}

const turnBasedTurns: any[] = []
export function turnBasedTurn(name: string, timeBetweenTurns = 0) {
  if (!turnBasedTurns.includes(name)) { turnBasedTurns.splice(0, 0, name) }
  if (turnBasedTurns[0] === name) {
    turnBasedTurns.push(turnBasedTurns.shift())
    if (timeBetweenTurns > 0) {
      turnBasedTurns.splice(0, 0, Symbol('wait'))
      setTimeout(() => turnBasedTurns.shift(), timeBetweenTurns)
    }
    return true
  }
  return false
}