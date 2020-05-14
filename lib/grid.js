import { half, negone, xyz, mul, add, sub, div } from './xyz.js';
function makeUnEven(v, l) {
    return ((v - v % l) / l) % 2 === 0 ? (v - v % l) - l : v - v % l;
}
export function buildGrid(tileSize, containerDim, ensureUnEven = false) {
    if (ensureUnEven) {
        containerDim = xyz(makeUnEven(containerDim.x, tileSize.x), makeUnEven(containerDim.y, tileSize.y), makeUnEven(containerDim.z, tileSize.z));
    }
    const dim = xyz(tileSize.x === 0 ? 0 : Math.floor(containerDim.x / tileSize.x), tileSize.y === 0 ? 0 : Math.floor(containerDim.y / tileSize.y), tileSize.z === 0 ? 0 : Math.floor(containerDim.z / tileSize.z));
    const dim2 = mul(dim, half);
    const matrix = [];
    for (let y = 0; y < dim.y; y++) {
        matrix[y] = [];
        for (let x = 0; x < dim.x; x++) {
            matrix[y][x] = 0;
        }
    }
    return { dim, dim2, matrix, tileSize,
        tileSize2: mul(tileSize, half),
        minXYZ: mul(mul(dim2, negone), tileSize),
        maxXYZ: mul(dim2, tileSize),
    };
}
function snap(v, l, l2) {
    const signature = v < 0 ? -1 : 1;
    return l === 0 ? 0 : (v + l2) % l === 0 ? v :
        v + signature * (l2 - signature * (v % l));
}
function limit(v, min, max) {
    return Math.floor(v < min ? min : v > max ? max : v);
}
function limitXYZ(v, min, max) {
    return xyz(limit(v.x, min.x, max.x), limit(v.y, min.y, max.y), limit(v.z, min.z, max.z));
}
export function snapToGridTileCenter(grid, cor) {
    const c = limitXYZ(cor, add(grid.minXYZ, grid.tileSize2), sub(grid.maxXYZ, grid.tileSize2));
    return xyz(snap(c.x, grid.tileSize.x, grid.dim.x > 0 && grid.dim.x % 2 === 0 ? grid.tileSize.x2 : 0), snap(c.y, grid.tileSize.y, grid.dim.y > 0 && grid.dim.y % 2 === 0 ? grid.tileSize.y2 : 0), snap(c.z, grid.tileSize.z, grid.dim.z > 0 && grid.dim.z % 2 === 0 ? grid.tileSize.z2 : 0));
}
export function snapToGridCrossSection(grid, cor) {
    const c = limitXYZ(cor, grid.minXYZ, grid.maxXYZ);
    return xyz(snap(c.x, grid.tileSize.x, grid.dim.x > 0 && grid.dim.x % 2 === 1 ? grid.tileSize.x2 : grid.tileSize.x), snap(c.y, grid.tileSize.y, grid.dim.y > 0 && grid.dim.y % 2 === 1 ? grid.tileSize.y2 : grid.tileSize.y), snap(c.z, grid.tileSize.z, grid.dim.z > 0 && grid.dim.z % 2 === 1 ? grid.tileSize.z2 : grid.tileSize.z));
}
export function gridMatrixCorAt(grid, cor) {
    return add(div(sub(snapToGridTileCenter(grid, cor), grid.tileSize2), grid.tileSize), grid.dim2);
}
export function gridTileCenterAt(grid, matrixCor) {
    const cor = mul(sub(add(mul(matrixCor, grid.tileSize), grid.tileSize2), mul(grid.dim2, grid.tileSize)), xyz(1, 1, 0));
    return snapToGridTileCenter(grid, cor);
}
function _assignOnGrid(grid, cor, value, dim) {
    if (dim) {
        const min = sub(cor, mul(dim, half)), max = add(cor, mul(dim, half));
        for (let x = cor.x; x > min.x; x -= grid.tileSize.x) {
            for (let y = cor.y; y > min.y; y -= grid.tileSize.y) {
                grid = _assignOnGrid(grid, xyz(x, y), value);
            }
            for (let y = cor.y; y < max.y; y += grid.tileSize.y) {
                grid = _assignOnGrid(grid, xyz(x, y), value);
            }
        }
        for (let x = cor.x; x < max.x; x += grid.tileSize.x) {
            for (let y = cor.y; y > min.y; y -= grid.tileSize.y) {
                grid = _assignOnGrid(grid, xyz(x, y), value);
            }
            for (let y = cor.y; y < max.y; y += grid.tileSize.y) {
                grid = _assignOnGrid(grid, xyz(x, y), value);
            }
        }
        return grid;
    }
    else {
        const c = gridMatrixCorAt(grid, cor);
        grid.matrix[c.y][c.x] = value;
        return grid;
    }
}
export function assignOnGrid(grid, cor, value, dim) {
    const matrixClone = [];
    for (let i = 0; matrixClone.length < grid.matrix.length; i++) {
        matrixClone.push(grid.matrix[i].slice());
    }
    return _assignOnGrid(Object.assign(Object.assign({}, grid), { matrix: matrixClone }), cor, value, dim);
}
export function valueAtGrid(grid, cor) {
    const c = gridMatrixCorAt(grid, cor);
    return grid.matrix[c.y][c.x];
}
export function gridStep(grid, fn) {
    const min = grid.minXYZ;
    const max = grid.maxXYZ;
    for (let i = min, j = 0; i.y < max.y || i.x < max.x || i.z < max.z; i = add(i, grid.tileSize),
        j = j + 1) {
        fn(i, j);
    }
}
function gridCors(grid, min, max) {
    const step = div(sub(max, min), grid.tileSize);
    return range(step.x)
        .map((x) => range(step.y).map((y) => add(mul(xyz(x, y), grid.tileSize), min)))
        .reduce((result, col) => result.concat(col), []);
}
function range(max) {
    const result = [];
    for (let i = 0; i < max; i++) {
        result.push(i);
    }
    return result;
}
//# sourceMappingURL=grid.js.map
