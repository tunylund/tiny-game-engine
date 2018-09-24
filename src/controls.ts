import { vector2, xyz, XYZ } from './xyz'

class Controls {

  get touch()    { return this.dir.size > 0 && Object.values(this.keys).filter((t) => t).length === 0 }

  get leftdown() { return this.dir.size > 0 && this.dir.angle >= 180 && this.dir.angle <= 270 }
  get left()     { return this.dir.size > 0 && this.dir.angle >= 135 && this.dir.angle <= 225 }
  get leftup()   { return this.dir.size > 0 && this.dir.angle < 180 && this.dir.angle > 90 }
  get upleft()   { return this.leftup }
  get up()       { return this.dir.size > 0 && this.dir.angle > 45 && this.dir.angle < 135 }
  get upright()  { return this.dir.size > 0 && this.dir.angle <= 90 && this.dir.angle >= 0 }
  get rightup()  { return this.upright }
  get right()    {
    return this.dir.size > 0 &&
      ((this.dir.angle >= 275 && this.dir.angle <= 360) ||
      this.dir.angle <= 45)
  }
  get rightdown() { return this.dir.size > 0 && this.dir.angle <= 360 && this.dir.angle > 270 }
  get down()     { return this.dir.size > 0 && this.dir.angle > 225 && this.dir.angle < 275 }
  get downright() { return this.rightdown }
  get downleft() { return this.leftdown }

  get x() { return this.keys.x || this.keys.KeyX }
  get space() { return this.keys.space || this.keys.Space }
  public readonly detach: () => void

  public keys: { [index: string]: boolean } = {}
  public cor: XYZ = xyz()
  private dir: XYZ = xyz()
  private clearMouseTimeout: number = -1
  private keyDownListeners = [] as any[]
  private keyUpListeners = [] as any[]

  constructor(window: Window, trackMouse = false, centerFn = () => xyz(window.innerWidth / 2, window.innerHeight / 2)) {
    const keyDownListener = (ev: KeyboardEvent) => this._key(ev.code, true)
    const keyUpListener = (ev: KeyboardEvent) => this._key(ev.code, false)
    const touchStartListener = (ev: TouchEvent) => this._touch(ev.changedTouches[0], centerFn())
    const touchEndListener = (ev: Event) => this.dir = this.cor = xyz()
    const mouseListener = (ev: MouseEvent) => this._mouse(ev, centerFn())

    const body = window.document.body

    body.addEventListener('keydown', keyDownListener, false)
    body.addEventListener('keyup', keyUpListener, false)
    body.addEventListener('touchstart', touchStartListener, false)
    body.addEventListener('touchend', touchEndListener, false)
    body.addEventListener('click', mouseListener, false)
    if (trackMouse) { body.addEventListener('mousemove', mouseListener, false) }

    this.detach = () => {
      body.removeEventListener('keydown', keyDownListener)
      body.removeEventListener('keyup', keyUpListener)
      body.removeEventListener('touchstart', touchStartListener)
      body.removeEventListener('touchend', touchEndListener)
      body.removeEventListener('click', mouseListener, false)
      clearTimeout(this.clearMouseTimeout)
      if (trackMouse) { body.removeEventListener('mousemove', mouseListener) }
    }
  }

  public _mouse(event: MouseEvent, center: XYZ) {
    const { clientX, clientY } = event
    this.cor = xyz(clientX - center.x, clientY - center.y)
    this.dir = vector2(Math.atan2(center.y - clientY, clientX - center.x), 1)
    clearTimeout(this.clearMouseTimeout)
    this.clearMouseTimeout = setTimeout(() => this.dir = xyz())
  }

  public _touch(touchPoint: Touch, center: XYZ) {
    const { pageX, pageY } = touchPoint
    this.cor = xyz(pageX - center.x, pageY - center.y)
    this.dir = vector2(Math.atan2(center.y - pageY, pageX - center.x), 1)
  }

  public _key(key: string, isDown: boolean) {
    const isRepeat = this.keys[key] && isDown
    this.keys[key] = isDown
    const angle = this.keys.ArrowRight  ? ( this.keys.ArrowUp ? 45  : this.keys.ArrowDown ? 315 : 0 ) :
                  this.keys.ArrowLeft   ? ( this.keys.ArrowUp ? 135 : this.keys.ArrowDown ? 225 : 180 ) :
                  this.keys.ArrowUp     ? 90 :
                  this.keys.ArrowDown   ? 270 : Infinity
    this.dir = angle > 360 ? xyz() : vector2(angle * (Math.PI / 180), 1)
    if (isDown) {
      this.keyDownListeners.map((fn) => fn(key, isRepeat))
    } else {
      this.keyUpListeners.map((fn) => fn(key))
    }
  }

  public onKeyDown(fn: (key: string, isRepeat: boolean) => void) {
    this.keyDownListeners.push(fn)
  }

  public onKeyUp(fn: (key: string) => void) {
    this.keyUpListeners.push(fn)
  }

}

export default Controls
