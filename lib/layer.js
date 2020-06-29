export function buildLayer(w, h, win) {
    const canvas = (win || window).document.createElement('canvas');
    const layer = {
        cw: 0, ch: 0, w, h, canvas,
        context: canvas.getContext('2d'),
    };
    canvas.width = w;
    canvas.height = h;
    layer.cw = canvas.width / 2;
    layer.ch = canvas.height / 2;
    return layer;
}
export function asLayer(img) {
    const layer = buildLayer(img.width, img.height);
    layer.context.drawImage(img, 0, 0);
    return layer;
}
export function getData({ context, canvas }) {
    return context.getImageData(0, 0, canvas.width, canvas.height);
}
export function getRow(y, { context, canvas }) {
    return context.getImageData(0, y, canvas.width, 1);
}
export function getCol(x, { context, canvas }) {
    return context.getImageData(x, 0, 1, canvas.height);
}
export function amountOfColor(data) {
    let result = 0;
    for (let i = 0; i < data.length / 4; i++) {
        if (data[i * 4 + 3] > 0)
            result++;
    }
    return result;
}
export function colorAt(colorIx, data) {
    return data.subarray(colorIx * 4, colorIx * 4 + 4);
}
export function setColor(color, colorIx, data) {
    data[colorIx * 4 + 0] = color[0];
    data[colorIx * 4 + 1] = color[1];
    data[colorIx * 4 + 2] = color[2];
    data[colorIx * 4 + 3] = color[3];
}
export function hasColor(data, requiredPercentage) {
    const amount = amountOfColor(data.data);
    return requiredPercentage ?
        amount > (data.data.length / 4 / 100 * requiredPercentage) :
        amount > 0;
}
export function resizeCanvas(layer, width, height) {
    const result = buildLayer(width, height);
    result.context.translate(result.cw, result.ch);
    result.context.drawImage(layer.canvas, -layer.cw, -layer.ch);
    result.context.resetTransform();
    return result;
}
export function cropToEdges(layer) {
    let x = 0, y = 0, mx = layer.canvas.width, my = layer.canvas.height;
    for (; x < mx; x++)
        if (hasColor(getCol(x, layer)))
            break;
    for (; y < my; y++)
        if (hasColor(getRow(y, layer)))
            break;
    for (; mx > x; mx--)
        if (hasColor(getCol(mx - 1, layer)))
            break;
    for (; my > y; my--)
        if (hasColor(getRow(my - 1, layer)))
            break;
    return cut(x, y, mx - x, my - y, layer);
}
export function cut(x, y, w, h, src) {
    const layer = buildLayer(w, h);
    layer.context.drawImage(src.canvas, x, y, w, h, 0, 0, w, h);
    return layer;
}
export function scale(img, width, height) {
    const layer = buildLayer(width, height);
    layer.context.drawImage(img, 0, 0, img.width, img.height, 0, 0, layer.canvas.width, layer.canvas.height);
    return layer;
}
export function fitSize(img, width, height) {
    if (img.width > width) {
        const sc = width / img.width;
        return scale(img, img.width * sc, img.height * sc);
    }
    else if (img.height > height) {
        const sc = height / img.height;
        return scale(img, img.width * sc, img.height * sc);
    }
    else {
        return asLayer(img);
    }
}
//# sourceMappingURL=layer.js.map
