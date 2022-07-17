import { dot, vector, xyz, XYZ, sub } from './xyz'

function easing(x: number): number {
  return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3)
}

function interpolate(s: number, t: number, x: number): number {
  return s + easing(x) * (t - s)
}

export function perlin(): (cor: XYZ) => number {
  const grid: XYZ[][] = []
  return (cor: XYZ) => noise(cor, grid)
}

function noise(cor: XYZ, grid: XYZ[][]): number {
  const x0 = Math.floor(cor.x)
  const y0 = Math.floor(cor.y)
  const x1 = x0 + 1
  const y1 = y0 + 1

  if (!grid[y0]) grid[y0] = []
  if (!grid[y0][x0]) grid[y0][x0] = vector(Math.PI * 2 * Math.random(), 1)
  if (!grid[y0][x1]) grid[y0][x1] = vector(Math.PI * 2 * Math.random(), 1)

  if (!grid[y1]) grid[y1] = []
  if (!grid[y1][x0]) grid[y1][x0] = vector(Math.PI * 2 * Math.random(), 1)
  if (!grid[y1][x1]) grid[y1][x1] = vector(Math.PI * 2 * Math.random(), 1)

  const s = dot(grid[y0][x0], sub(cor, xyz(x0, y0)))
  const t = dot(grid[y0][x1], sub(cor, xyz(x1, y0)))
  const a = interpolate(s, t, cor.x - x0)

  const u = dot(grid[y1][x0], sub(cor, xyz(x0, y1)))
  const v = dot(grid[y1][x1], sub(cor, xyz(x1, y1)))
  const b = interpolate(u, v, cor.x - x0)

  return interpolate(a, b, cor.y - y0)
}
