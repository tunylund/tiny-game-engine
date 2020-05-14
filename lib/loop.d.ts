interface TimerContainer {
    requestAnimationFrame: (step: () => void) => any;
    cancelAnimationFrame: (token: any) => any;
}
export declare function loop(fn: (stepDuration: number, gameDuration: number) => void, win?: TimerContainer | undefined): () => void;
export {};
