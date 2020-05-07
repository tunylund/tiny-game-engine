import loop from './loop'
import { Position, position } from './position'

type Drawing = (ctx: CanvasRenderingContext2D) => void
type Draw = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void

function setup(window: Window) {
  const layer = drawingLayer(window)
  window.document.body.appendChild(layer.canvas)
  const i = 0
  const stopThisDrawLoop = loop((step, total) => {
    const iteration = drawables.splice(0, drawables.length)
    while (iteration.length > 0) {
      const drawable = iteration.shift()
      if (drawable) {
        const l = drawable.layer || layer
        if (l.context) drawable.draw(l.context, l.cw, l.ch)
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

function drawingLayer(win?: Window): Layer {
  const w = win || window
  const canvas = w.document.createElement('canvas')
  const layer = {
    cw: 0, ch: 0, canvas,
    context: canvas.getContext('2d') as CanvasRenderingContext2D,
  }
  function onResize() {
    canvas.width = w.innerWidth
    canvas.height = w.innerHeight
    layer.cw = canvas.width / 2
    layer.ch = canvas.height / 2
  }
  w.addEventListener('resize', onResize)
  onResize()
  return layer
}

function draw(
  drawFn: Draw|Drawing,
  pos: Position = position(),
  layer?: Layer,
  win?: Window) {
  addDrawable(pos.cor.z, (context, cw, ch) => {
    if (!context) throw new Error('no context')
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
  draw((ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(img, pos.cor.x - img.width / 2, pos.cor.y - img.height / 2)
  }, pos, layer, win)
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

export { draw, drawImage, drawingLayer, isometricDraw, stopDrawLoop, Draw }
