# tiny-game-engine
A tiny-game-engine for games in the BrowserLand

### Get Started

```
import { loop, draw, entity, position, cube, move, buildControls } from 'tiny-game-engine'

const gameState = {
  entities: [
    entity(position(10, 10), cube(20), { hue: 45, speed: 30 }),
    entity(position(-10, -10), cube(20), { hue: 85, speed: 10 })
  ]
}

const controls = buildControls(window)

const stopGameLoop = loop((step, gameTime) => {
  gameState.entities.map(entity => entity.pos = move(entity.pos, step))

  entities.map(entity => {
    entity.pos.vel = vector(controls.dir.radian, entity.speed)
  })

  draw((ctx, cw, ch) => {
    gameState.entities.map(entity => drawEntity(entity, ctx))
  })
})

function background(ctx, cw, ch) {
  ctx.fillStyle = 'hsla(120, 100%, 80%, 1)'
  ctx.fillRect(-cw, -ch, cw * 2, ch * 2)
}

function drawEntity(entity, ctx) {
  ctx.fillStyle = `hsla(${entity.hue}, 100%, 50%, 1)`
  ctx.fillRect(entity.pos.x, entity.pos.y, entity.dim.x, entity.dim.y)
}

```