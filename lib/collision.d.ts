import { Entity } from './entity';
import { XYZ } from './xyz';
export declare function segmentIntersects(a1: XYZ, a2: XYZ, b1: XYZ, b2: XYZ): boolean;
export declare function intersects(a: Entity, b: Entity): boolean;
export declare function bump(otherEl: Entity, collidables?: Entity[], dir?: string): import("./position").Position;
