import {
  buildGrid,
  snapToGridTileCenter,
  snapToGridCrossSection,
  gridTileCenterAt,
  assignOnGrid } from '../src/grid'
import { xyz, constant, mul } from '../src/xyz'

const tileSize = xyz(8, 8, 8)
const grid1x1 = buildGrid(tileSize, tileSize)
const grid2x2 = buildGrid(tileSize, mul(tileSize, constant(2)))
const grid3x3 = buildGrid(tileSize, mul(tileSize, constant(3)))
const evenGrid = grid2x2
const unevenGrid = grid3x3

describe('grid', () => {
  it('should define a grid matrix of available size', () => {
    expect(buildGrid(tileSize, xyz(7, 7)).matrix.length).toBe(0)
    expect(buildGrid(tileSize, xyz(8, 8)).matrix.length).toBe(1)
    expect(buildGrid(tileSize, xyz(8, 8)).matrix[0].length).toBe(1)
    expect(buildGrid(tileSize, xyz(9, 9)).matrix.length).toBe(1)
    expect(buildGrid(tileSize, xyz(9, 9)).matrix[0].length).toBe(1)
    expect(buildGrid(tileSize, xyz(16.5, 16.5)).matrix.length).toBe(2)
    expect(buildGrid(tileSize, xyz(16.5, 16.5)).matrix[0].length).toBe(2)
  })

  it('should snap to center of grid tile', () => {
    expect(snapToGridTileCenter(evenGrid, constant(0))).toMatchObject(constant(4))
    expect(snapToGridTileCenter(evenGrid, constant(4))).toMatchObject(constant(4))
    expect(snapToGridTileCenter(evenGrid, constant(-1))).toMatchObject(constant(-4))
    expect(snapToGridTileCenter(evenGrid, constant(1))).toMatchObject(constant(4))
    expect(snapToGridTileCenter(evenGrid, constant(-5))).toMatchObject(constant(-4))
    expect(snapToGridTileCenter(evenGrid, constant(5))).toMatchObject(constant(4))

    expect(snapToGridTileCenter(unevenGrid, xyz(0, 0, 0))).toMatchObject(xyz(0, 0, 0))
    expect(snapToGridTileCenter(unevenGrid, xyz(-9, -9, -9))).toMatchObject(xyz(-8, -8, -8))
    expect(snapToGridTileCenter(unevenGrid, xyz(9, 9, 9))).toMatchObject(xyz(8, 8, 8))
    expect(snapToGridTileCenter(unevenGrid, xyz(-9, -9, -9))).toMatchObject(xyz(-8, -8, -8))
    expect(snapToGridTileCenter(unevenGrid, xyz(9, 9, 9))).toMatchObject(xyz(8, 8, 8))
  })

  it('should snap to the center of nearest corner tile when out of bounds of the grid', () => {
    const p1 = xyz(48, 48, 48), p2 = xyz(-48, -48, -48)
    expect(snapToGridTileCenter(grid1x1, p1)).toMatchObject(xyz(0, 0, 0))
    expect(snapToGridTileCenter(grid1x1, p2)).toMatchObject(xyz(0, 0, 0))
    expect(snapToGridTileCenter(grid2x2, p1)).toMatchObject(xyz(4, 4, 4))
    expect(snapToGridTileCenter(grid2x2, p2)).toMatchObject(xyz(-4, -4, -4))
    expect(snapToGridTileCenter(grid3x3, p1)).toMatchObject(xyz(8, 8, 8))
    expect(snapToGridTileCenter(grid3x3, p2)).toMatchObject(xyz(-8, -8, -8))
  })

  it('should snap to grid crossection', () => {
    expect(snapToGridCrossSection(evenGrid, xyz(0, 0, 0))).toMatchObject(xyz(0, 0, 0))
    expect(snapToGridCrossSection(evenGrid, xyz(-5, -5, -5))).toMatchObject(xyz(-8, -8, -8))
    expect(snapToGridCrossSection(evenGrid, xyz(5, 5, 5))).toMatchObject(xyz(8, 8, 8))
    expect(snapToGridCrossSection(evenGrid, xyz(-9, -9, -9))).toMatchObject(xyz(-8, -8, -8))
    expect(snapToGridCrossSection(evenGrid, xyz(9, 9, 9))).toMatchObject(xyz(8, 8, 8))

    expect(snapToGridCrossSection(unevenGrid, xyz(0, 0, 0))).toMatchObject(xyz(4, 4, 4))
    expect(snapToGridCrossSection(unevenGrid, xyz(-5, -5, -5))).toMatchObject(xyz(-4, -4, -4))
    expect(snapToGridCrossSection(unevenGrid, xyz(5, 5, 5))).toMatchObject(xyz(4, 4, 4))
    expect(snapToGridCrossSection(unevenGrid, xyz(-9, -9, -9))).toMatchObject(xyz(-12, -12, -12))
    expect(snapToGridCrossSection(unevenGrid, xyz(9, 9, 9))).toMatchObject(xyz(12, 12, 12))
  })

  it('should snap to the nearest corner tile when out of bounds of the grid', () => {
    const p1 = xyz(48, 48, 48), p2 = xyz(-48, -48, -48)
    expect(snapToGridCrossSection(grid1x1, p1)).toMatchObject(xyz(4, 4, 4))
    expect(snapToGridCrossSection(grid1x1, p2)).toMatchObject(xyz(-4, -4, -4))
    expect(snapToGridCrossSection(grid2x2, p1)).toMatchObject(xyz(8, 8, 8))
    expect(snapToGridCrossSection(grid2x2, p2)).toMatchObject(xyz(-8, -8, -8))
    expect(snapToGridCrossSection(grid3x3, p1)).toMatchObject(xyz(12, 12, 12))
    expect(snapToGridCrossSection(grid3x3, p2)).toMatchObject(xyz(-12, -12, -12))
  })

  it('should assign a value on the grid matrix', () => {
    expect(assignOnGrid(grid1x1, constant(1), 1).matrix).toMatchObject([[1]])
    expect(assignOnGrid(grid2x2, constant(1), 1).matrix).toMatchObject([[0, 0],
                                                                        [0, 1]])
    expect(assignOnGrid(grid3x3, constant(-8), 1).matrix).toMatchObject([[1, 0, 0],
                                                                         [0, 0, 0],
                                                                         [0, 0, 0]])
  })

  it('should map matrix location to grid tile center', () => {
    expect(gridTileCenterAt(grid3x3, constant(1))).toMatchObject(xyz(0))
    expect(gridTileCenterAt(grid3x3, constant(0))).toMatchObject(xyz(-8, -8, -0))
    expect(gridTileCenterAt(grid3x3, constant(2))).toMatchObject(xyz(8, 8))
  })
})
