import { Position } from './position';
import { XYZ } from './xyz';
interface El {
    pos: Position;
    dim: XYZ;
}
declare function el<T extends El>(pos: El | Position, dim?: XYZ, rest?: object): T;
declare function vectorTo(e: El, otherEl: El, size?: number): XYZ;
declare function nearest<T extends El>(els: T[], cor: XYZ): T | null;
declare function dist(a: El, b: El): number;
declare function isAt(a: El, cor: XYZ, precision?: number | XYZ): boolean;
export { El, el, nearest, isAt, dist, vectorTo };
