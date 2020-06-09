export declare type AudioBuilder = () => AudioBufferSourceNode;
declare function preload(assetUrls: {
    [key: string]: string;
}, onAssetReady: (ready: number, expected: number) => void): Promise<void[]>;
declare function getAsset<T extends HTMLImageElement | AudioBuilder>(asset: string): T;
export { preload, getAsset };
