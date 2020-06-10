import { XYZ } from './xyz';
import { Polygon } from './polygon';
interface Point {
    x: number;
    y: number;
}
export interface Circle {
    cor: XYZ;
    r: number;
}
export declare function polygonCollidesWithPolygon(p1: Polygon, p2: Polygon): boolean;
export declare function circleCollidesWithPolygon(circle: Circle, polygon: Polygon): boolean;
export declare function polygonCollidesWithPoint(vertices: Polygon, p: Point): boolean;
export {};
