export default function setup (window) {

  const canvas = window.document.createElement('canvas')
  const context = canvas.getContext('2d')

  let cw, ch
  function onResize () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cw = canvas.width / 2
    ch = canvas.height / 2
  }
  onResize()
  window.addEventListener('resize', onResize)
  window.document.body.appendChild(canvas)

  function draw (fnOrEl, pos, dim) {
    context.save()
    context.translate(cw, ch)
    if (typeof fnOrEl === 'function') {
      fnOrEl(context, cw, ch)
    } else {
      context.drawImage(fnOrEl, pos.cor.x - dim.x / 2, pos.cor.y - dim.y / 2)
    }
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.restore()
  }

  function isometricDraw (fnOrEl, pos, dim) {
    draw((ctx, cw, ch) => {
      ctx.transform(0.707, 0.409, -0.707, 0.409, 0, -0.816)
      if (typeof fnOrEl === 'function') {
        fnOrEl(ctx, cw, ch)
      } else {
        ctx.translate(-pos.cor.z, -pos.cor.z)
        ctx.drawImage(fnOrEl, pos.cor.x - dim.x / 2, pos.cor.y - dim.y / 2)
      }
    })
  }
  
  return { draw, isometricDraw }
}

function drawing (w, h, fn, win) {
  const canvas = (win || window).document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = 
  fn(canvas.getContext('2d'))
  return canvas
}

export { setup, drawing }