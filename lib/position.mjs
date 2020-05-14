import { xyz, mul, add } from './xyz.mjs';
const GRAVITY = -981;
function position(x = 0, y = 0, z = 0, vx = 0, vy = 0, vz = 0, ax = 0, ay = 0, az = 0) {
    if (typeof x === 'number') {
        return {
            cor: xyz(x, y, z),
            vel: xyz(vx, vy, vz),
            acc: xyz(ax, ay, az)
        };
    }
    else if ('cor' in x) {
        return {
            cor: xyz(x.cor),
            vel: xyz(x.vel),
            acc: xyz(x.acc)
        };
    }
    else {
        return {
            cor: x || xyz(),
            vel: y || xyz(),
            acc: z || xyz()
        };
    }
}
function move(pos, step) {
    const vel = add(pos.vel, mul(pos.acc, xyz(step, step, step)));
    const cor = add(pos.cor, mul(vel, xyz(step, step, step)));
    return position(cor, vel, pos.acc);
}
function stop(pos) {
    return position(pos.cor, xyz(), xyz());
}
function gravity(pos) {
    return position(pos.cor, pos.vel, add(pos.acc, xyz(0, 0, GRAVITY)));
}
const dimension = xyz;
export { position, dimension, move, gravity, stop };
//# sourceMappingURL=position.mjs.map
