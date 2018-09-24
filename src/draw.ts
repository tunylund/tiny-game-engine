import loop from './loop'
import { Position } from './position'
import { XYZ } from './xyz'

type Drawing = (ctx: CanvasRenderingContext2D) => void
type Draw = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void

function setup(window: Window) {
  const canvas = window.document.createElement('canvas')
  const context = canvas.getContext('2d')

  let cw: number, ch: number
  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cw = canvas.width / 2
    ch = canvas.height / 2
  }
  onResize()
  window.addEventListener('resize', onResize)
  window.document.body.appendChild(canvas)

  const stopThisDrawLoop = loop((step, total) => {
    const iteration = drawables.splice(0, drawables.length)
    while (iteration.length > 0) {
      const drawable = iteration.shift()
      if (drawable) { drawable.draw(context as CanvasRenderingContext2D, cw, ch) }
    }
  }, window)

  return () => {
    stopThisDrawLoop()
    if (canvas && canvas.parentNode) { canvas.parentNode.removeChild(canvas) }
  }
}

interface Drawable {
  z: number,
  draw: Draw
}

const drawables: Drawable[] = []
let loopStop: (() => void)|null = null

function stopDrawLoop() {
  if (loopStop) { loopStop() }
  loopStop = null
}

function addDrawable(z: number, drawFn: Draw, win: Window) {
  if (!loopStop) { loopStop = setup(win) }
  let ix = drawables.length
  while (ix-- > 0) { if (drawables[ix].z <= z) { break } }
  drawables.splice(ix + 1, 0, { z, draw: drawFn })
}

function drawing(w: number, h: number, fn: Drawing, win?: Window) {
  const canvas = (win || window).document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  fn(canvas.getContext('2d') as CanvasRenderingContext2D)
  return canvas
}

function draw(
  fnOrEl: Draw | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  pos: Position,
  dim: XYZ,
  win?: Window) {
  addDrawable(pos.cor.z, (context, cw, ch) => {
    context.save()
    context.translate(cw, ch)
    if (typeof fnOrEl === 'function') {
      fnOrEl(context, cw, ch)
    } else {
      context.drawImage(fnOrEl, pos.cor.x - dim.x2, pos.cor.y - dim.y2)
    }
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.restore()
  }, (win || window))
}

function isometricDraw(
  fnOrEl: Draw | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  pos: Position,
  dim: XYZ,
  win?: Window) {
  draw((ctx, cw, ch) => {
    ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816)
    ctx.translate(-pos.cor.z, -pos.cor.z)
    if (typeof fnOrEl === 'function') {
      fnOrEl(ctx, cw, ch)
    } else {
      ctx.drawImage(fnOrEl, pos.cor.x - dim.x2, pos.cor.y - dim.y2)
    }
  }, pos, dim, (win || window))
}

export { draw, drawing, isometricDraw, stopDrawLoop, Draw }
