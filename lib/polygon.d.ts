import { XYZ } from './xyz';
export declare type Polygon = XYZ[];
export declare function imageToPolygon(imageData: Uint8ClampedArray, width: number, height: number, accuracy?: number): Polygon;
export declare function rect(cor: XYZ, dim: XYZ): Polygon;
