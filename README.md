# tiny-game-engine
A tiny-game-engine duh

### Get Started

```
import loop from 'tiny-game-engine/lib/loop'
import draw from 'tiny-game-engine/lib/draw'
const stopGameLoop = loop((step, gameTime) => {
  draw((ctx, cw, ch) => backgroundDrawing(ctx, cw, ch))
})

function backgroundDrawing(ctx, cw, ch) {
  const bgGradient = ctx.createLinearGradient(0, 0, 0, ch)
  bgGradient.addColorStop(0, 'hsla(120, 100%, 50%, 0.3)')
  bgGradient.addColorStop(1, 'hsla(120, 100%, 75%, 0.3)')
  ctx.fillStyle = bgGradient
  ctx.fillRect(-cw, -ch, cw * 2, ch * 2)
}

```