import { XYZ } from './xyz';
export declare enum Direction {
    leftdown = "leftdown",
    left = "left",
    leftup = "leftup",
    upleft = "upleft",
    up = "up",
    upright = "upright",
    rightup = "rightup",
    right = "right",
    rightdown = "rightdown",
    downright = "downright",
    down = "down",
    downleft = "downleft"
}
export interface Controls {
    cor: XYZ;
    dir: XYZ;
    keys: {
        [key: string]: boolean;
    };
    direction: {
        leftdown: boolean;
        left: boolean;
        leftup: boolean;
        upleft: boolean;
        up: boolean;
        upright: boolean;
        rightup: boolean;
        right: boolean;
        rightdown: boolean;
        downright: boolean;
        down: boolean;
        downleft: boolean;
    };
    attach: () => void;
    detach: () => void;
}
export declare function buildControls(window: Window): Controls;
