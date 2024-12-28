import { convert_to_strings } from "./stringify.js";
import { continueSolve, partialSolve } from "./parallelizer.js";
import worker from "node:worker_threads";
import { fileURLToPath } from 'url';
import { definitions } from "./calendar.js";
const defs = definitions();
function toString(pi) {
    return convert_to_strings(defs.board, (p) => pi(p) || ".").join('\n');
}
function logBoard(pi) {
    console.log(toString(pi));
}
if (worker.isMainThread) {
    const args = new Set(process.argv);
    const verbose = args.has("verbose");
    const picked = defs.labels.filter((lp) => args.has(lp.label));
    const many = args.has("many");
    if (picked.length <= 3) {
        const start = performance.now();
        console.log(`Picked: ${picked.map((lp) => lp.label).join(", ")}`);
        const stepper = partialSolve(defs.board, defs.shapes, picked.map((lp) => lp.point), (pi) => {
            console.log("Solving for:");
            -logBoard(pi);
        });
        let id = 0;
        while (stepper((sc => {
            const w = new worker.Worker(fileURLToPath(import.meta.url), {
                workerData: {
                    id: id++,
                    config: sc,
                    verbose
                }
            });
            w.on("message", (sln) => {
                console.log(`Worker: ${sln.id}\n${sln.text}\n`);
                console.log(`Elapsed: ${(performance.now() - start) / 1000}`);
                if (!many) {
                    process.exit(0); // stop after first
                }
            });
        }))) { }
        if (verbose) {
            console.log(`spawned ${id} workers`);
        }
    }
    else {
        console.log("Too many arguments (should be 3 or fewer)");
        process.exit(1);
    }
}
else {
    const task = worker.workerData;
    const solver = continueSolve(task.config, (pi) => {
        if (task.verbose) {
            console.log(`Worker ${task.id} Solving for: \n${toString(pi)}`);
        }
    });
    const callback = (pi, e) => {
        if (e.kind === "solved") {
            const board = defs.board.map((p) => { return { label: pi(p) || "", point: p }; });
            const sln = {
                id: task.id,
                text: toString(pi),
                board: board
            };
            worker.parentPort?.postMessage(sln);
        }
    };
    while (solver(callback)) { }
    if (task.verbose) {
        console.log(`Worker ${task.id} finished.`);
    }
}
//# sourceMappingURL=nodemain.js.map