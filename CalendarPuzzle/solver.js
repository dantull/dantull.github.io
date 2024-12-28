// negative 0 is weird, avoid it
const neg = (x) => x === 0 ? x : -x;
const flipPoint = ({ x, y }) => ({ y: y, x: neg(x) });
const rotate_fns = [
    ({ x, y }) => ({ x: x, y: y }), // 0 degrees
    ({ x, y }) => ({ x: neg(y), y: x }), // 90 degrees
    ({ x, y }) => ({ x: neg(x), y: neg(y) }), // 180 degrees
    ({ x, y }) => ({ x: y, y: neg(x) }) // 270 degrees
];
function noop(p) {
    return p;
}
function variants(s, rotates, flip) {
    const vs = [];
    const flips = s.chiral ? [noop, flip] : [noop];
    for (let f = 0; f < flips.length; f++) {
        const ff = flips[f];
        for (let i = 0; i <= s.rotations; i++) {
            const rf = rotates[i];
            vs.push(s.points.map(p => {
                return ff(rf(p));
            }));
        }
    }
    return vs;
}
const makePointVariants = (s) => variants(s, rotate_fns, flipPoint);
function offsetOne(p, at) {
    return { x: p.x + at.x, y: p.y + at.y };
}
export function offsetAll(ps, at) {
    return ps.map((p) => offsetOne(p, at));
}
class ShapeState {
    constructor(shape, label, baseVariants, points, translator) {
        this.shape = shape;
        this.label = label;
        this.baseVariants = baseVariants;
        this.points = points;
        this.translator = translator;
        this.pi = 0;
        this.vi = 0;
        this.remove = false;
        this.places = 0;
    }
    step(board, si, minSize) {
        if (this.remove) {
            this.remove();
            this.remove = false;
        }
        if (this.vi < this.baseVariants.length) {
            const v = this.translator(this.baseVariants[this.vi], this.points[this.pi]);
            this.remove = board.fill(v, this.label);
            if (this.remove) {
                this.places++;
            }
            this.vi++;
        }
        else if (this.vi === this.baseVariants.length) {
            const p = this.points[this.pi];
            if (board.reachable(p, minSize) < minSize) {
                this.pi = this.points.length;
            }
            else {
                this.pi++;
            }
            this.vi = 0;
        }
        return this.pi < this.points.length; // end of iteration when pi passes end of points
    }
    placed() {
        return this.remove !== false;
    }
    noplace() {
        return this.places === 0;
    }
}
export function createSolver(board, offsetAll, makeVariants, labeled_shapes, setup_callback) {
    const pi = (p) => board.at(p);
    setup_callback((p, m) => board.fill([p], m), pi);
    const shapes = [];
    for (const label in labeled_shapes) {
        const shape = labeled_shapes[label];
        shapes.push({
            label,
            shape,
            variants: makeVariants(shape)
        });
    }
    let stack = [];
    let smallestShapeSize = Math.min(...shapes.map((info) => info.shape.points.length));
    const nextShape = () => {
        const s = shapes[stack.length];
        return new ShapeState(s.shape, s.label, s.variants, board.remaining(), offsetAll);
    };
    if (shapes.length > 0) {
        stack.push(nextShape());
    }
    return (cb) => {
        let ss = stack[stack.length - 1];
        if (!ss) {
            return false;
        }
        const more = ss.step(board, stack.length - 1, smallestShapeSize);
        if (!more) {
            if (ss.noplace()) {
                cb(pi, { kind: "failed", shape: ss.shape });
            }
            stack.pop();
            return stack.length > 0;
        }
        else {
            if (ss.placed()) {
                const solved = stack.length === shapes.length;
                cb(pi, { kind: solved ? "solved" : "placed", shape: ss.shape });
                if (!solved) {
                    stack.push(nextShape());
                }
            }
            return true;
        }
    };
}
export function makePointSolver(board, labeled_shapes, setup_callback) {
    return createSolver(board, offsetAll, makePointVariants, labeled_shapes, setup_callback);
}
//# sourceMappingURL=solver.js.map