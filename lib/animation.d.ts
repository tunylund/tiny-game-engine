export declare function linear(initialValue: number, currentValue: number, targetValue: number, duration: number, precision: number, step: number): number;
export interface FrameSequence {
    frame: number;
    stop: () => void;
}
export declare function frameSequence(frames: number[], duration: number, loopOver: boolean): FrameSequence;
export declare function valueOverTime(fn: (currentValue: number) => any, initialValue: number, targetValue: number, precision: number, duration: number, loopOver: boolean, win?: Window): () => void;
