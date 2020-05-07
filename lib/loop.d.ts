export default function loop(fn: (stepDuration: number, gameDuration: number) => void, win?: Window | undefined): () => void;
