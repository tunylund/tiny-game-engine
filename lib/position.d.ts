import { xyz, XYZ } from './xyz';
interface Position {
    cor: XYZ;
    vel: XYZ;
    acc: XYZ;
}
declare function position(x?: number | XYZ | Position, y?: number | XYZ, z?: number | XYZ, vx?: number, vy?: number, vz?: number, ax?: number, ay?: number, az?: number): Position;
declare function move(pos: Position, step: number): Position;
declare function stop(pos: Position): Position;
declare function gravity(pos: Position): Position;
declare const dimension: typeof xyz;
export { Position, position, dimension, move, gravity, stop };
