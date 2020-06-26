export interface Layer {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  w: number,
  h: number
}

export function buildLayer(w: number, h: number, win?: Window): Layer {
  const canvas = (win || window).document.createElement('canvas')
  const layer = {
    cw: 0, ch: 0, w, h, canvas,
    context: canvas.getContext('2d') as CanvasRenderingContext2D,
  }
  canvas.width = w
  canvas.height = h
  layer.cw = canvas.width / 2
  layer.ch = canvas.height / 2
  return layer
}

export function asLayer(img: ImageBitmap|HTMLImageElement|HTMLCanvasElement): Layer {
  const layer = buildLayer(img.width, img.height)
  layer.context.drawImage(img, 0, 0)
  return layer
}

export function getData({context, canvas}: Layer): ImageData {
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

export function getRow(y: number, {context, canvas}: Layer): ImageData {
  return context.getImageData(0, y, canvas.width, 1)
}

export function getCol(x: number, {context, canvas}: Layer): ImageData {
  return context.getImageData(x, 0, 1, canvas.height)
}

export function forEachColor(data: Uint8ClampedArray, cb: (c: Uint8ClampedArray, ix: number) => void) {
  for(let i=0; i<data.length; i++) cb(colorAt(i, data), i)
}

export function amountOfColor(data: Uint8ClampedArray) {
  let found = 0
  forEachColor(data, c => c[3] > 0 ? found++ : null)
  return found
}

export function colorAt(i: number, data: Uint8ClampedArray): Uint8ClampedArray {
  return Uint8ClampedArray.of(data[i * 4 + 0], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3])
}

export function setColor(i: number, color: Uint8ClampedArray|number[], data: Uint8ClampedArray) {
  data[i + 0] = color[0]
  data[i + 1] = color[1]
  data[i + 2] = color[2]
  data[i + 3] = color[3]
}

export function hasColor(data: ImageData, requiredPercentage?: number) {
  const amount = amountOfColor(data.data)
  return requiredPercentage ?
    amount > (data.data.length / 4 / 100 * requiredPercentage) :
    amount > 0
}

export function resizeCanvas(layer: Layer, width: number, height: number): Layer {
  const result = buildLayer(width, height)
  result.context.translate(result.cw, result.ch)
  result.context.drawImage(layer.canvas, -layer.cw, -layer.ch)
  result.context.resetTransform()
  return result
}

export function cropToEdges(layer: Layer): Layer {
  let x = 0, y = 0, mx = layer.canvas.width, my = layer.canvas.height
  for (; x<mx; x++) if (hasColor(getCol(x, layer))) break
  for (; y<my; y++) if (hasColor(getRow(y, layer))) break
  for (; mx>x; mx--) if (hasColor(getCol(mx-1, layer))) break
  for (; my>y; my--) if (hasColor(getRow(my-1, layer))) break
  return cut(x, y, mx - x, my - y, layer)
}

export function cut(x: number, y: number, w: number, h: number, src: Layer): Layer {
  const layer = buildLayer(w, h)
  layer.context.drawImage(src.canvas, x, y, w, h, 0, 0, w, h)
  return layer
}

export function scale(img: HTMLCanvasElement|ImageBitmap|HTMLImageElement, width: number, height: number): Layer {
  const layer = buildLayer(width, height)
  layer.context.drawImage(img, 0, 0, img.width, img.height, 0, 0, layer.canvas.width, layer.canvas.height)
  return layer
}

export function fitSize(img: ImageBitmap|HTMLImageElement, width: number, height: number): Layer {
  if (img.width > width) {
    const sc = width / img.width
    return scale(img, img.width * sc, img.height * sc)
  } else if (img.height > height) {
    const sc = height / img.height
    return scale(img, img.width * sc, img.height * sc)
  } else {
    return asLayer(img)
  }
}
