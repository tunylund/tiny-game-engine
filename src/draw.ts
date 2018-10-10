import { El } from './el'
import loop from './loop'
import { Position, position } from './position'
import { XYZ } from './xyz'

type Drawing = (ctx: CanvasRenderingContext2D) => void
type Draw = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void

function setup(window: Window) {
  const layer = drawingLayer(window)
  window.document.body.appendChild(layer.canvas)

  const stopThisDrawLoop = loop((step, total) => {
    const iteration = drawables.splice(0, drawables.length)
    while (iteration.length > 0) {
      const drawable = iteration.shift()
      if (drawable) {
        const l = drawable.layer || layer
        drawable.draw(l.context, l.cw, l.ch)
      }
    }
  }, window)

  return () => {
    stopThisDrawLoop()
    if (layer.canvas && layer.canvas.parentNode) {
      layer.canvas.parentNode.removeChild(layer.canvas)
    }
  }
}

interface Drawable {
  z: number,
  draw: Draw,
  layer?: Layer
}

interface Layer {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  cw: number,
  ch: number
}

const drawables: Drawable[] = []
let loopStop: (() => void)|null = null

function stopDrawLoop() {
  if (loopStop) { loopStop() }
  loopStop = null
}

function addDrawable(z: number, drawFn: Draw, win: Window, layer?: Layer) {
  if (!loopStop) { loopStop = setup(win) }
  let ix = drawables.length
  while (ix-- > 0) { if (drawables[ix].z <= z) { break } }
  drawables.splice(ix + 1, 0, { z, draw: drawFn, layer })
}

function drawing(w: number, h: number, fn: Drawing, win?: Window) {
  const canvas = (win || window).document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  fn(canvas.getContext('2d') as CanvasRenderingContext2D)
  return canvas
}

function drawingLayer(win?: Window): Layer {
  const canvas = (win || window).document.createElement('canvas')
  const layer = {
    cw: 0, ch: 0, canvas,
    context: canvas.getContext('2d') as CanvasRenderingContext2D,
  }
  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    layer.cw = canvas.width / 2
    layer.ch = canvas.height / 2
  }
  window.addEventListener('resize', onResize)
  onResize()
  return layer
}

function draw(
  drawFn: Draw,
  pos: Position = position(),
  layer?: Layer,
  win?: Window) {
  addDrawable(pos.cor.z, (context, cw, ch) => {
    context.save()
    context.translate(cw, ch)
    drawFn(context, cw, ch)
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.restore()
  }, (win || window), layer)
}

function drawImage(
  img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  pos: Position = position(),
  layer?: Layer,
  win?: Window) {
  draw((ctx) => ctx.drawImage(img, pos.cor.x - img.width / 2, pos.cor.y - img.height / 2), pos, layer, win)
}

function isometricDraw(
  drawFn: Draw,
  pos: Position,
  win?: Window) {
  draw((ctx, cw, ch) => {
    ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816)
    ctx.translate(-pos.cor.z, -pos.cor.z)
    drawFn(ctx, cw, ch)
  }, pos, undefined, (win || window))
}

export { draw, drawImage, drawing, drawingLayer, isometricDraw, stopDrawLoop, Draw }
