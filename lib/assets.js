const assets = new Map();
function loadImage(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        return image;
    });
}
let audioCtx;
function loadSound(url) {
    audioCtx = audioCtx || new AudioContext();
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => audioCtx.decodeAudioData(buffer))
        .then(audioBuffer => {
        return (volume) => {
            const source = audioCtx.createBufferSource();
            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(volume, 0);
            source.buffer = audioBuffer;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            return source;
        };
    });
}
function load(key, url) {
    const isImage = url.endsWith('gif') || url.endsWith('png') || url.endsWith('bmp');
    const isSound = url.endsWith('wav') || url.endsWith('mp3');
    const loader = isImage ? loadImage : isSound ? loadSound : null;
    if (loader) {
        // @ts-ignore
        return loader(url).then((resource) => assets.set(key, resource));
    }
    return Promise.reject(`unsupported resource type ${url}`);
}
function preload(assetUrls, onAssetReady) {
    let ready = 0;
    const entries = Object.entries(assetUrls);
    const promises = entries.map(([key, url]) => load(key, url).then(() => onAssetReady(++ready, entries.length)));
    onAssetReady(ready, entries.length);
    return Promise.all(promises);
}
function getAsset(asset) {
    const r = assets.get(asset);
    if (r === undefined)
        throw new Error(`asset ${asset} is not available`);
    else
        return r;
}
export { preload, getAsset };
//# sourceMappingURL=assets.js.map