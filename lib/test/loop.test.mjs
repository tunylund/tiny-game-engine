import loop from '../src/loop.mjs';
import jsdom from 'jsdom';
const window = (new jsdom.JSDOM('', { pretendToBeVisual: true })).window;
describe('loop', () => {
    it('should loop', (done) => {
        const stop = loop((step, total) => {
            stop();
            expect(step).toBeGreaterThan(0);
            expect(total).toBeGreaterThan(0);
            done();
        }, window);
    });
});
//# sourceMappingURL=loop.test.mjs.map
