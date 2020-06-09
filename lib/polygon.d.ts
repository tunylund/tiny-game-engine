export declare type Point = {
    x: number;
    y: number;
};
export declare type Polygon = Point[];
export declare function imageToPolygon(imageData: Uint8ClampedArray, width: number, height: number, accuracy?: number): Polygon;
