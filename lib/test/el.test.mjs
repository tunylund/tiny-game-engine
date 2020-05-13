import { el, dist, isAt } from '../src/el.mjs';
import { position } from '../src/position.mjs';
import { xyz } from '../src/xyz.mjs';
const a = el(position(0, 0, 0), xyz(1, 1, 1));
const b = el(position(2, 2, 2), xyz(1, 1, 1));
describe('el', () => {
    it('should know distance', () => {
        expect(dist(a, b)).toEqual(xyz(2, 2, 2).size);
        expect(dist(b, a)).toEqual(dist(a, b));
    });
    it('should accept extra attributes', () => {
        const c = el(position(), xyz(), { foo: 'bar' });
        expect(c.foo).toBe('bar');
    });
    it('should know where it is at', () => {
        expect(isAt(a, xyz(0, 0, 0))).toBeTruthy();
        expect(isAt(a, xyz(1, 1, 1), 2)).toBeTruthy();
        expect(isAt(a, xyz(1, 1, 1), 1)).toBeFalsy();
    });
});
//# sourceMappingURL=el.test.mjs.map
