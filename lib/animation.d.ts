export declare function linear(initialValue: number, targetValue: number, duration: number, precision: number, age: number): number;
export interface Sequence {
    value: number;
    step: (step: number) => void;
}
export declare function sequence(seq: number[], duration: number, loopOver: boolean): Sequence;
export interface FrameSequence {
    x: number;
    y: number;
    image: {
        width: number;
        height: number;
    };
    frameSize: {
        width: number;
        height: number;
    };
    step: (step: number) => void;
}
export declare function frameSequence(seq: number[], duration: number, loopOver: boolean, image: {
    width: number;
    height: number;
}, frameSize: {
    width: number;
    height: number;
}): FrameSequence;
