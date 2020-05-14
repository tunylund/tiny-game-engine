import { XYZ } from './xyz';
export interface Grid {
    matrix: number[][];
    dim: XYZ;
    dim2: XYZ;
    minXYZ: XYZ;
    maxXYZ: XYZ;
    tileSize: XYZ;
    tileSize2: XYZ;
}
export declare function buildGrid(tileSize: XYZ, containerDim: XYZ, ensureUnEven?: boolean): Grid;
export declare function snapToGridTileCenter(grid: Grid, cor: XYZ): XYZ;
export declare function snapToGridCrossSection(grid: Grid, cor: XYZ): XYZ;
export declare function gridMatrixCorAt(grid: Grid, cor: XYZ): XYZ;
export declare function gridTileCenterAt(grid: Grid, matrixCor: XYZ): XYZ;
export declare function assignOnGrid(grid: Grid, cor: XYZ, value: number, dim?: XYZ): Grid;
export declare function valueAtGrid(grid: Grid, cor: XYZ): number;
export declare function gridStep(grid: Grid, fn: (cor: XYZ, i?: number) => any): void;
