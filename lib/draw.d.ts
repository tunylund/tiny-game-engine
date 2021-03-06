import { XYZ } from './xyz';
import { Layer } from './layer';
declare type Draw = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void;
declare function stopDrawLoop(): void;
declare function drawingLayer(win?: Window): Layer;
declare function draw(drawFn: Draw, offset?: XYZ, layer?: Layer, win?: Window): void;
declare function drawImage(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, layer?: Layer, win?: Window): void;
declare function isometricDraw(drawFn: Draw, offset: XYZ, win?: Window): void;
export { draw, drawImage, drawingLayer, isometricDraw, stopDrawLoop, Draw };
