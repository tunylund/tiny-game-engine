// @ts-ignore
import tap from 'tap';
import { buildGrid, snapToGridTileCenter, snapToGridCrossSection, gridTileCenterAt, assignOnGrid } from './../src/grid.mjs';
import { xyz, unit } from './../src/xyz.mjs';
const tileSize = xyz(8, 8, 8);
const grid1x1 = buildGrid(tileSize, tileSize);
const grid2x2 = buildGrid(tileSize, tileSize.mul(unit(2)));
const grid3x3 = buildGrid(tileSize, tileSize.mul(unit(3)));
const evenGrid = grid2x2;
const unevenGrid = grid3x3;
tap.test('should define a grid matrix of available size', (test) => {
    test.equal(buildGrid(tileSize, xyz(7, 7)).matrix.length, 0);
    test.equal(buildGrid(tileSize, xyz(8, 8)).matrix.length, 1);
    test.equal(buildGrid(tileSize, xyz(8, 8)).matrix[0].length, 1);
    test.equal(buildGrid(tileSize, xyz(9, 9)).matrix.length, 1);
    test.equal(buildGrid(tileSize, xyz(9, 9)).matrix[0].length, 1);
    test.equal(buildGrid(tileSize, xyz(16.5, 16.5)).matrix.length, 2);
    test.equal(buildGrid(tileSize, xyz(16.5, 16.5)).matrix[0].length, 2);
    test.end();
});
tap.test('should snap to center of grid tile', (test) => {
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(0)), unit(4));
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(4)), unit(4));
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(-1)), unit(-4));
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(1)), unit(4));
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(-5)), unit(-4));
    test.deepEqual(snapToGridTileCenter(evenGrid, unit(5)), unit(4));
    test.deepEqual(snapToGridTileCenter(unevenGrid, xyz(0, 0, 0)), xyz(0, 0, 0));
    test.deepEqual(snapToGridTileCenter(unevenGrid, xyz(-9, -9, -9)), xyz(-8, -8, -8));
    test.deepEqual(snapToGridTileCenter(unevenGrid, xyz(9, 9, 9)), xyz(8, 8, 8));
    test.deepEqual(snapToGridTileCenter(unevenGrid, xyz(-9, -9, -9)), xyz(-8, -8, -8));
    test.deepEqual(snapToGridTileCenter(unevenGrid, xyz(9, 9, 9)), xyz(8, 8, 8));
    test.end();
});
tap.test('should snap to the center of nearest corner tile when out of bounds of the grid', (test) => {
    const p1 = xyz(48, 48, 48), p2 = xyz(-48, -48, -48);
    test.deepEqual(snapToGridTileCenter(grid1x1, p1), xyz(0, 0, 0));
    test.deepEqual(snapToGridTileCenter(grid1x1, p2), xyz(0, 0, 0));
    test.deepEqual(snapToGridTileCenter(grid2x2, p1), xyz(4, 4, 4));
    test.deepEqual(snapToGridTileCenter(grid2x2, p2), xyz(-4, -4, -4));
    test.deepEqual(snapToGridTileCenter(grid3x3, p1), xyz(8, 8, 8));
    test.deepEqual(snapToGridTileCenter(grid3x3, p2), xyz(-8, -8, -8));
    test.end();
});
tap.test('should snap to grid crossection', (test) => {
    test.deepEqual(snapToGridCrossSection(evenGrid, xyz(0, 0, 0)), xyz(0, 0, 0));
    test.deepEqual(snapToGridCrossSection(evenGrid, xyz(-5, -5, -5)), xyz(-8, -8, -8));
    test.deepEqual(snapToGridCrossSection(evenGrid, xyz(5, 5, 5)), xyz(8, 8, 8));
    test.deepEqual(snapToGridCrossSection(evenGrid, xyz(-9, -9, -9)), xyz(-8, -8, -8));
    test.deepEqual(snapToGridCrossSection(evenGrid, xyz(9, 9, 9)), xyz(8, 8, 8));
    test.deepEqual(snapToGridCrossSection(unevenGrid, xyz(0, 0, 0)), xyz(4, 4, 4));
    test.deepEqual(snapToGridCrossSection(unevenGrid, xyz(-5, -5, -5)), xyz(-4, -4, -4));
    test.deepEqual(snapToGridCrossSection(unevenGrid, xyz(5, 5, 5)), xyz(4, 4, 4));
    test.deepEqual(snapToGridCrossSection(unevenGrid, xyz(-9, -9, -9)), xyz(-12, -12, -12));
    test.deepEqual(snapToGridCrossSection(unevenGrid, xyz(9, 9, 9)), xyz(12, 12, 12));
    test.end();
});
tap.test('should snap to the nearest corner tile when out of bounds of the grid', (test) => {
    const p1 = xyz(48, 48, 48), p2 = xyz(-48, -48, -48);
    test.deepEqual(snapToGridCrossSection(grid1x1, p1), xyz(4, 4, 4));
    test.deepEqual(snapToGridCrossSection(grid1x1, p2), xyz(-4, -4, -4));
    test.deepEqual(snapToGridCrossSection(grid2x2, p1), xyz(8, 8, 8));
    test.deepEqual(snapToGridCrossSection(grid2x2, p2), xyz(-8, -8, -8));
    test.deepEqual(snapToGridCrossSection(grid3x3, p1), xyz(12, 12, 12));
    test.deepEqual(snapToGridCrossSection(grid3x3, p2), xyz(-12, -12, -12));
    test.end();
});
tap.test('should assign a value on the grid matrix', (test) => {
    test.deepEqual(assignOnGrid(grid1x1, unit(1), 1).matrix, [[1]]);
    test.deepEqual(assignOnGrid(grid2x2, unit(1), 1).matrix, [[0, 0],
        [0, 1]]);
    test.deepEqual(assignOnGrid(grid3x3, unit(-8), 1).matrix, [[1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]]);
    test.end();
});
tap.test('should map matrix location to grid tile center', (test) => {
    test.deepEqual(gridTileCenterAt(grid3x3, unit(1)), xyz(0));
    test.deepEqual(gridTileCenterAt(grid3x3, unit(0)), xyz(-8, -8));
    test.deepEqual(gridTileCenterAt(grid3x3, unit(2)), xyz(8, 8));
    test.end();
});
//# sourceMappingURL=grid-test.mjs.map
