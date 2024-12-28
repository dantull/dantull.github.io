import { describe, expect, test } from '@jest/globals';
import { partialSolve, continueSolve } from './parallelizer.js';
import { convert_to_points, convert_to_shape } from './stringify.js';
import { L, P } from './pentominoes.js';
describe("board", () => {
    test("solver", () => {
        const grid = [
            "oooo",
            "oooo",
            "oooo"
        ];
        const board = convert_to_points(grid);
        const blocked = convert_to_points(["x  x"]);
        const shapes = { L: convert_to_shape(L), P: convert_to_shape(P) };
        const inspectPartial = (pi) => {
            for (const p of blocked) {
                expect(pi(p)).toBeTruthy();
            }
        };
        const cb = partialSolve(board, shapes, blocked, inspectPartial);
        const partials = [];
        while (cb((sc) => {
            partials.push(sc);
        })) {
        }
        expect(partials.length).toBeGreaterThan(0);
        const count = 0;
        const inspectContinue = (pi) => {
            for (const p of blocked) {
                expect(pi(p)).toBeTruthy();
            }
            let count = 0;
            for (const p of board) {
                if (pi(p) !== undefined) {
                    count++;
                }
            }
            expect(count).toEqual(5 + blocked.length);
        };
        let solns = 0;
        const solvers = partials.map((sc) => continueSolve(sc, inspectContinue));
        for (const s of solvers) {
            while (s((pi, e) => {
                if (e.kind === "solved") {
                    solns++;
                    for (const p of board) {
                        expect(pi(p)).toBeTruthy();
                    }
                }
            })) {
            }
            ;
        }
        expect(solns).toBe(2);
    });
});
//# sourceMappingURL=parallelizer.test.js.map