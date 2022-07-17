import { Circle } from './collision';
import { Position } from './position';
import { XYZ } from './xyz';
import { Polygon } from './polygon';
import { Layer } from './layer';
interface Entity {
    pos: Position;
    dim: XYZ;
    dir: XYZ;
}
declare function entity<T extends Entity>(pos?: Entity | Position, dim?: XYZ, dir?: XYZ, rest?: object): T;
export declare function collisionRect(ent: Entity): Polygon;
export declare function collisionCircle(ent: Entity): Circle;
declare function vectorTo(from: Entity, to: Entity, size?: number): XYZ;
declare function nearest<T extends Entity>(entities: T[], cor: XYZ): T | null;
declare function distance(a: Entity, b: Entity): number;
declare function isAt(a: Entity, cor: XYZ): boolean;
declare function drawEntityLayer(el: Entity, layer: Layer): void;
export { Entity, entity, nearest, isAt, distance, vectorTo, drawEntityLayer };
