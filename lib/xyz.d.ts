declare class XYZ {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly x2: number;
    readonly y2: number;
    readonly z2: number;
    readonly radian: number;
    readonly angle: number;
    constructor(x?: number | XYZ, y?: number, z?: number);
    get signature(): XYZ;
    get unit(): XYZ;
    get size(): number;
    cross(v: XYZ): XYZ;
    dot(v: XYZ): number;
    add(v: XYZ): XYZ;
    sub(v: XYZ): XYZ;
    mul(v: XYZ): XYZ;
    div(v: XYZ): XYZ;
    sum(): number;
    equal(v: XYZ): boolean;
}
/**
 * @param {number} [x]
 * @param {number} [y]
 * @param {number} [z]
 */
declare function xyz(x?: number | XYZ, y?: number, z?: number): XYZ;
declare function vector2(radian: number, size?: number): XYZ;
declare function unit(v: number): XYZ;
declare const negone: XYZ;
declare const zero: XYZ;
declare const half: XYZ;
declare const one: XYZ;
declare const two: XYZ;
export { xyz, XYZ, vector2, unit, negone, zero, half, one, two };
