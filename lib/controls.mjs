import { xyz, vector2 } from './xyz.mjs'

class Controls {

  constructor (window, trackMouse = false, centerFn = () => xyz(window.innerWidth / 2, window.innerHeight / 2)) {
    this._keys = {}
    this._dir = xyz()

    const keyDownListener = ev => this._key(ev.code, true)
    const keyUpListener = ev => this._key(ev.code, false)
    const touchStartListener = ev => this._touch(ev.changedTouches[0], centerFn())
    const touchEndListener = ev => this._dir = xyz()
    const mouseListener = ev => this._mouse(ev, centerFn())

    const body = window.document.body

    body.addEventListener('keydown', keyDownListener, false)
    body.addEventListener('keyup', keyUpListener, false)
    body.addEventListener("touchstart", touchStartListener, false)
    body.addEventListener("touchend", touchEndListener, false)
    if (trackMouse) body.addEventListener("mousemove", mouseListener, false)

    this.detach = () => {
      body.removeEventListener('keydown', keyDownListener)
      body.removeEventListener('keyup', keyUpListener)
      body.removeEventListener('touchstart', touchStartListener)
      body.removeEventListener('touchend', touchEndListener)
      clearTimeout(this._clearMouseTimeout)
      if (trackMouse) body.removeEventListener('mousemove', mouseListener)
    }
  }

  _mouse (event, center) {
    const { clientX, clientY } = event
    this._dir = vector2(Math.atan2(center.y - clientY, clientX - center.x), 1)
    clearTimeout(this._clearMouseTimeout)
    this._clearMouseTimeout = setTimeout(x => this._dir = xyz())
  }

  _touch (touchPoint, center) {
    const { pageX, pageY } = touchPoint
    this._dir = vector2(Math.atan2(center.y - pageY, pageX - center.x), 1)
  }

  _key (key, isDown) {
    this._keys[key] = isDown
    const angle = this._keys.ArrowRight  ? ( this._keys.ArrowUp ? 45  : this._keys.ArrowDown ? 315 : 0 ) :
                  this._keys.ArrowLeft   ? ( this._keys.ArrowUp ? 135 : this._keys.ArrowDown ? 225 : 180 ) :
                  this._keys.ArrowUp     ? 90 :
                  this._keys.ArrowDown   ? 270 : Infinity
    this._dir = angle > 360 ? xyz() : vector2(angle * (Math.PI / 180), 1)
  }

  get dir ()      { return this._dir }
  get touch ()    { return this._dir.size > 0 && Object.values(this._keys).filter(t => t).length === 0 }

  get leftdown () { return this._dir.size > 0 && this.dir.angle >= 180 && this.dir.angle <= 270 }
  get left ()     { return this._dir.size > 0 && this.dir.angle >= 135 && this.dir.angle <= 225 }
  get leftup ()   { return this._dir.size > 0 && this.dir.angle < 180 && this.dir.angle > 90 }
  get upleft ()   { return this.leftup }
  get up ()       { return this._dir.size > 0 && this.dir.angle > 45 && this.dir.angle < 135 }
  get upright ()  { return this._dir.size > 0 && this.dir.angle <= 90 && this.dir.angle >= 0 }
  get rightup ()  { return this.upright }
  get right ()    { return this._dir.size > 0 && ((this.dir.angle >= 275 && this.dir.angle <= 360) || this.dir.angle <= 45) }
  get rightdown () { return this._dir.size > 0 && this.dir.angle <= 360 && this.dir.angle > 270 }
  get down ()     { return this._dir.size > 0 && this.dir.angle > 225 && this.dir.angle < 275 }
  get downright () { return this.rightdown }
  get downleft () { return this.leftdown }

  get x () { return this._keys.x || this._keys.KeyX }
  get space () { return this._keys.space || this._keys.Space }

}

export default Controls