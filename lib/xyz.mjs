class XYZ {
  constructor(x = 0, y = 0, z = 0) {
    if (x instanceof XYZ) {
      this._x = x.x
      this._y = x.y
      this._z = x.z
    } else {
      this._x = x
      this._y = y
      this._z = z
    }
  }
  get x () { return this._x }
  get y () { return this._y }
  get z () { return this._z }

  get signature() { return xyz(
    this._x === 0 ? 1 : Math.abs(this._x) / this._x,
    this._y === 0 ? 1 : Math.abs(this._y) / this._y,
    this._z === 0 ? 1 : Math.abs(this._z) / this._z
  )}

  get unit() { return this.signature.mul(xyz(
    this._x === 0 ? 0 : 1,
    this._y === 0 ? 0 : 1,
    this._z === 0 ? 0 : 1
  ))}

  add (v) { return xyz(this._x + v.x, this._y + v.y, this._z + v.z) }
  sub (v) { return xyz(this._x - v.x, this._y - v.y, this._z - v.z) }
  mul (v) { return xyz(this._x * v.x, this._y * v.y, this._z * v.z) }
  sum () { return this._x + this._y + this._z }
}

function xyz (x = 0, y = 0, z = 0) { return new XYZ(x, y, z) }

export { xyz }
