import { Position } from './position';
import { XYZ } from './xyz';
interface Entity {
    pos: Position;
    dim: XYZ;
    dir: XYZ;
}
declare function entity<T extends Entity>(pos: Entity | Position, dim?: XYZ, dir?: XYZ, rest?: object): T;
declare function vectorTo(from: Entity, to: Entity, size?: number): XYZ;
declare function nearest<T extends Entity>(entities: T[], cor: XYZ): T | null;
declare function distance(a: Entity, b: Entity): number;
declare function isAt(a: Entity, cor: XYZ, precision?: number | XYZ): boolean;
export { Entity, entity, nearest, isAt, distance, vectorTo };
