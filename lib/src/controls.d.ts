import { XYZ } from './xyz';
declare class Controls {
    get touch(): boolean;
    get leftdown(): boolean;
    get left(): boolean;
    get leftup(): boolean;
    get upleft(): boolean;
    get up(): boolean;
    get upright(): boolean;
    get rightup(): boolean;
    get right(): boolean;
    get rightdown(): boolean;
    get down(): boolean;
    get downright(): boolean;
    get downleft(): boolean;
    get x(): boolean;
    get space(): boolean;
    readonly detach: () => void;
    keys: {
        [index: string]: boolean;
    };
    cor: XYZ;
    private dir;
    private clearMouseTimeout;
    private keyDownListeners;
    private keyUpListeners;
    constructor(window: Window, trackMouse?: boolean, centerFn?: () => XYZ);
    _mouse(event: MouseEvent, center: XYZ): void;
    _touch(touchPoint: Touch, center: XYZ): void;
    _key(key: string, isDown: boolean): void;
    onKeyDown(fn: (key: string, isRepeat: boolean) => void): void;
    onKeyUp(fn: (key: string) => void): void;
}
export default Controls;
