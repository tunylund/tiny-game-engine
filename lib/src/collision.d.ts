import { El } from './El';
import { XYZ } from './xyz';
export declare function segmentIntersects(a1: XYZ, a2: XYZ, b1: XYZ, b2: XYZ): boolean;
export declare function intersects(a: El, b: El): boolean;
export declare function bump(otherEl: El, collidables?: El[], dir?: string): import("./position").Position;
