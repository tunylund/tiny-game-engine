
const assets = new Map<string, HTMLImageElement|AudioBufferSourceNode>()

function loadImage(url: string): Promise<HTMLImageElement> {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const image = new Image()
      image.src = URL.createObjectURL(blob)
      return image
  })
}

let audioCtx: AudioContext
export type AudioBuilder = (volume: number) => AudioBufferSourceNode
function loadSound(url: string): Promise<AudioBuilder> {
  audioCtx = audioCtx || new AudioContext()
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => audioCtx.decodeAudioData(buffer))
    .then(audioBuffer => {
      return (volume) => {
        const source = audioCtx.createBufferSource()
        const gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(volume, 0)
        source.buffer = audioBuffer
        source.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        return source
      }
    })
}

function load(key: string, url: string): Promise<any> {
  const isImage = url.endsWith('gif') || url.endsWith('png') || url.endsWith('bmp')
  const isSound = url.endsWith('wav') || url.endsWith('mp3')
  const loader = isImage ? loadImage : isSound ? loadSound : null
  if (loader) {
    // @ts-ignore
    return loader(url).then((resource: any) => assets.set(key, resource))
  }

  return Promise.reject(`unsupported resource type ${url}`)
}

function preload(assetUrls: {[key: string]: string}, onAssetReady: (ready: number, expected: number) => void) {
  let ready = 0
  const entries = Object.entries(assetUrls)
  const promises = entries.map(([key, url]) => load(key, url).then(() => onAssetReady(++ready, entries.length)))
  onAssetReady(ready, entries.length)
  return Promise.all(promises)
}

function getAsset<T extends HTMLImageElement | AudioBuilder>(asset: string): T {
  const r = assets.get(asset)
  if (r === undefined) throw new Error(`asset ${asset} is not available`)
  else return r as T
}

export { preload, getAsset }
