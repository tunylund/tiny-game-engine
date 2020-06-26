export interface Layer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    cw: number;
    ch: number;
    w: number;
    h: number;
}
export declare function buildLayer(w: number, h: number, win?: Window): Layer;
export declare function asLayer(img: ImageBitmap | HTMLImageElement | HTMLCanvasElement): Layer;
export declare function getData({ context, canvas }: Layer): ImageData;
export declare function getRow(y: number, { context, canvas }: Layer): ImageData;
export declare function getCol(x: number, { context, canvas }: Layer): ImageData;
export declare function forEachColor(data: Uint8ClampedArray, cb: (c: Uint8ClampedArray, ix: number) => void): void;
export declare function amountOfColor(data: Uint8ClampedArray): number;
export declare function colorAt(i: number, data: Uint8ClampedArray): Uint8ClampedArray;
export declare function setColor(i: number, color: Uint8ClampedArray | number[], data: Uint8ClampedArray): void;
export declare function hasColor(data: ImageData, requiredPercentage?: number): boolean;
export declare function resizeCanvas(layer: Layer, width: number, height: number): Layer;
export declare function cropToEdges(layer: Layer): Layer;
export declare function cut(x: number, y: number, w: number, h: number, src: Layer): Layer;
export declare function scale(img: HTMLCanvasElement | ImageBitmap | HTMLImageElement, width: number, height: number): Layer;
export declare function fitSize(img: ImageBitmap | HTMLImageElement, width: number, height: number): Layer;
