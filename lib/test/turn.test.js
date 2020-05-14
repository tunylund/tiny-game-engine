import { timeBasedTurn, turnBasedTurn } from '../src/turn.js';
describe('turn', () => {
    it('should time-based turn', (done) => {
        expect(timeBasedTurn('test', 10)).toBeTruthy();
        expect(timeBasedTurn('test', 10)).toBeFalsy();
        setTimeout(() => {
            expect(timeBasedTurn('test')).toBeTruthy();
            done();
        }, 10);
    });
    it('should turn-based turn', (done) => {
        expect(turnBasedTurn('a')).toBeTruthy();
        expect(turnBasedTurn('b')).toBeTruthy();
        expect(turnBasedTurn('b')).toBeFalsy();
        expect(turnBasedTurn('a')).toBeTruthy();
        expect(turnBasedTurn('b', 10)).toBeTruthy();
        expect(turnBasedTurn('a')).toBeFalsy();
        setTimeout(() => {
            expect(turnBasedTurn('a')).toBeTruthy();
            done();
        }, 10);
    });
});
//# sourceMappingURL=turn.test.js.map
