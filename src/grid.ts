import { half, negone, xyz, XYZ, mul, add, sub, div } from './xyz'

export interface Grid {
  matrix: number[][],
  dim: XYZ,
  dim2: XYZ,
  minXYZ: XYZ,
  maxXYZ: XYZ,
  tileSize: XYZ
  tileSize2: XYZ
}

function makeUnEven(v: number, l: number) {
  return ((v - v % l) / l) % 2 === 0 ? (v - v % l) - l : v - v % l
}

export function buildGrid(tileSize: XYZ, containerDim: XYZ, ensureUnEven = false): Grid {
  if (ensureUnEven) {
    containerDim = xyz(
      makeUnEven(containerDim.x, tileSize.x),
      makeUnEven(containerDim.y, tileSize.y),
      makeUnEven(containerDim.z, tileSize.z),
    )
  }
  const dim = xyz(
    tileSize.x === 0 ? 0 : Math.floor(containerDim.x / tileSize.x),
    tileSize.y === 0 ? 0 : Math.floor(containerDim.y / tileSize.y),
    tileSize.z === 0 ? 0 : Math.floor(containerDim.z / tileSize.z))
  const dim2 = mul(dim, half)
  const matrix = []

  for (let y = 0; y < dim.y; y++) {
    matrix[y] = [] as number[]
    for (let x = 0; x < dim.x; x++) {
      matrix[y][x] = 0
    }
  }

  return { dim, dim2, matrix, tileSize,
    tileSize2: mul(tileSize, half),
    minXYZ: mul(mul(dim2, negone), tileSize),
    maxXYZ: mul(dim2, tileSize),
  }
}

function snap(v: number, l: number, l2: number) {
  const signature = v < 0 ? -1 : 1
  return l === 0 ? 0 : (v + l2) % l === 0 ? v :
    v + signature * (l2 - signature * (v % l))
}

function limit(v: number, min: number, max: number) {
  return Math.floor(v < min ? min : v > max ? max : v)
}

function limitXYZ(v: XYZ, min: XYZ, max: XYZ) {
  return xyz(
    limit(v.x, min.x, max.x),
    limit(v.y, min.y, max.y),
    limit(v.z, min.z, max.z),
  )
}

export function snapToGridTileCenter(grid: Grid, cor: XYZ): XYZ {
  const c = limitXYZ(cor,
    add(grid.minXYZ, grid.tileSize2),
    sub(grid.maxXYZ, grid.tileSize2))
  return xyz(
    snap(c.x, grid.tileSize.x, grid.dim.x > 0 && grid.dim.x % 2 === 0 ? grid.tileSize.x2 : 0),
    snap(c.y, grid.tileSize.y, grid.dim.y > 0 && grid.dim.y % 2 === 0 ? grid.tileSize.y2 : 0),
    snap(c.z, grid.tileSize.z, grid.dim.z > 0 && grid.dim.z % 2 === 0 ? grid.tileSize.z2 : 0),
  )
}

export function snapToGridCrossSection(grid: Grid, cor: XYZ): XYZ {
  const c = limitXYZ(cor, grid.minXYZ, grid.maxXYZ)
  return xyz(
    snap(c.x, grid.tileSize.x, grid.dim.x > 0 && grid.dim.x % 2 === 1 ? grid.tileSize.x2 : grid.tileSize.x),
    snap(c.y, grid.tileSize.y, grid.dim.y > 0 && grid.dim.y % 2 === 1 ? grid.tileSize.y2 : grid.tileSize.y),
    snap(c.z, grid.tileSize.z, grid.dim.z > 0 && grid.dim.z % 2 === 1 ? grid.tileSize.z2 : grid.tileSize.z),
  )
}

export function gridMatrixCorAt(grid: Grid, cor: XYZ): XYZ {
  return add(div(sub(snapToGridTileCenter(grid, cor), grid.tileSize2), grid.tileSize), grid.dim2)
}

export function gridTileCenterAt(grid: Grid, matrixCor: XYZ): XYZ {
  const cor = mul(sub(add(mul(matrixCor, grid.tileSize), grid.tileSize2), mul(grid.dim2, grid.tileSize)), xyz(1, 1, 0))
  return snapToGridTileCenter(grid, cor)
}

function _assignOnGrid(grid: Grid, cor: XYZ, value: number, dim?: XYZ): Grid {
  if (dim) {
    const min = sub(cor, mul(dim, half)),
          max = add(cor, mul(dim, half))
    for (let x = cor.x; x > min.x; x -= grid.tileSize.x) {
      for (let y = cor.y; y > min.y; y -= grid.tileSize.y) { grid = _assignOnGrid(grid, xyz(x, y), value) }
      for (let y = cor.y; y < max.y; y += grid.tileSize.y) { grid = _assignOnGrid(grid, xyz(x, y), value) }
    }
    for (let x = cor.x; x < max.x; x += grid.tileSize.x) {
      for (let y = cor.y; y > min.y; y -= grid.tileSize.y) { grid = _assignOnGrid(grid, xyz(x, y), value) }
      for (let y = cor.y; y < max.y; y += grid.tileSize.y) { grid = _assignOnGrid(grid, xyz(x, y), value) }
    }
    return grid
  } else {
    const c = gridMatrixCorAt(grid, cor)
    grid.matrix[c.y][c.x] = value
    return grid
  }
}

export function assignOnGrid(grid: Grid, cor: XYZ, value: number, dim?: XYZ): Grid {
  const matrixClone = []
  for (let i = 0; matrixClone.length < grid.matrix.length; i++) {
    matrixClone.push(grid.matrix[i].slice())
  }
  return _assignOnGrid({ ...grid, matrix: matrixClone }, cor, value, dim)
}

export function valueAtGrid(grid: Grid, cor: XYZ): number {
  const c = gridMatrixCorAt(grid, cor)
  return grid.matrix[c.y][c.x]
}

export function gridStep(grid: Grid, fn: (cor: XYZ, i?: number) => any) {
  const min = grid.minXYZ
  const max = grid.maxXYZ
  for (let i = min, j = 0;
    i.y < max.y || i.x < max.x || i.z < max.z;
    i = add(i, grid.tileSize),
    j = j + 1) {
    fn(i, j)
  }
}

function gridCors(grid: Grid, min: XYZ, max: XYZ): XYZ[] {
  const step = div(sub(max, min), grid.tileSize)
  return range(step.x)
    .map((x) => range(step.y).map((y) => add(mul(xyz(x, y), grid.tileSize), min)))
    .reduce((result, col) => result.concat(col), [])
}

function range(max: number): number[] {
  const result = []
  for (let i = 0; i < max; i++) { result.push(i) }
  return result
}
