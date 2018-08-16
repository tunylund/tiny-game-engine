import { position, move } from './position.mjs'
import { xyz, vector2 } from './xyz.mjs'

class El {

    constructor(pos = position(), dim = xyz(), rest) {
        if (pos instanceof El) {
            this.pos = position(pos.pos)
            this.dim = xyz(pos.dim)
        } else {
            this.pos = pos
            this.dim = dim
        }
        Object.assign(this, rest)
    }

    static el (pos, dim, rest) {
        return new El(...arguments)
    }

    move (step) {
        this.pos = move(this.pos, step)
    }

    nearest(els) {
        return els.reduce((memo, el) => !memo || (this.dist(el) > 0 && this.dist(el) < this.dist(memo)) ? el : memo, null)
    }

    dist (el) {
        return this.pos.cor.sub(el.pos.cor).size
    }

    vectorTo (el, size = this.dist(el)) {
        return vector2(el.pos.cor.sub(this.pos.cor).radian, size)
    }
}

const el = El.el
export { El, el }
