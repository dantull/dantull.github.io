// 10 unique pieces, some of which differ when flipped (chirality)
// and rotated (usually 4 shapes, but tetra I only has 2)
import { Runner } from "./runner.js";
import { makePointSolver } from "./solver.js";
import { bindToggleButton, makeBrowserRenderer } from "./browserui.js";
import { definitions } from "./calendar.js";
import { makePointBoard } from "./board.js";
const defs = definitions();
let render = () => { };
let solver;
const state = new Runner();
const points = [];
function makeRenderer() {
    return makeBrowserRenderer(defs.labels, defs.shapes, (p) => {
        state.stop();
        solver = undefined;
        points.push(p);
        while (points.length > 3) {
            points.shift();
        }
        render((p) => {
            if (points.find((v) => v.x === p.x && v.y === p.y)) {
                return " ";
            }
            else {
                return undefined;
            }
        });
    });
}
render = makeRenderer();
function loop() {
    if (!state.running()) {
        return;
    }
    if (!solver) {
        solver = makePointSolver(makePointBoard(defs.board), defs.shapes, (set, pi) => {
            for (let i = 0; i < points.length; i++) {
                set(points[i], " ");
            }
        });
    }
    let t = performance.now();
    for (let i = 0; i < 50000 && state.running(); i++) {
        const more = solver && solver((pi, m) => {
            if (m.kind === "solved") {
                render(pi);
                state.stop();
            }
            else {
                let nt = performance.now();
                let dt = nt - t;
                if (dt > 1000 / 120) {
                    render(pi);
                    t = nt;
                }
            }
        });
        if (!more) {
            state.stop();
        }
    }
}
function solve() {
    state.start(() => loop());
}
const toggled = bindToggleButton(() => {
    if (!state.running()) {
        solve();
    }
    else {
        state.stop();
    }
});
state.listener(toggled);
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main.js.map