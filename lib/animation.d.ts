export declare function linear(initialValue: number, currentValue: number, targetValue: number, duration: number, precision: number, step: number): number;
export interface Sequence {
    value: number;
    step: (step: number) => void;
}
export declare function sequence(seq: number[], duration: number, loopOver: boolean): Sequence;
export interface FrameSequence {
    x: number;
    y: number;
    step: (step: number) => void;
}
export declare function frameSequence(seq: number[], duration: number, loopOver: boolean, image: {
    width: number;
    height: number;
}, tileSize: number): FrameSequence;
export declare function valueOverTime(fn: (currentValue: number) => any, initialValue: number, targetValue: number, precision: number, duration: number, loopOver: boolean, win?: Window): () => void;
