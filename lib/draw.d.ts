import { Position } from './position';
declare type Drawing = (ctx: CanvasRenderingContext2D) => void;
declare type Draw = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void;
interface Layer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    cw: number;
    ch: number;
}
declare function stopDrawLoop(): void;
declare function drawing(w: number, h: number, fn: Drawing, win?: Window): HTMLCanvasElement;
declare function drawingLayer(win?: Window): Layer;
declare function draw(drawFn: Draw | Drawing, pos?: Position, layer?: Layer, win?: Window): void;
declare function drawImage(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, pos?: Position, layer?: Layer, win?: Window): void;
declare function isometricDraw(drawFn: Draw, pos: Position, win?: Window): void;
export { draw, drawImage, drawing, drawingLayer, isometricDraw, stopDrawLoop, Draw };
