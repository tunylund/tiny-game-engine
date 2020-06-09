import { Entity } from './entity';
import { XYZ } from './xyz';
import { Polygon } from './polygon';
export declare function entityCollidesWithPolygon2d(entity: Entity, polygon: Polygon): boolean;
export declare function segmentIntersects(a1: XYZ, a2: XYZ, b1: XYZ, b2: XYZ): boolean;
export declare function intersects(a: Entity, b: Entity): boolean;
export declare function bump(otherEl: Entity, collidables?: Entity[], fixSelector?: XYZ): import("./position").Position;
