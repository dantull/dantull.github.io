export function encode(p) {
    return p.x * 16 + p.y;
}
const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
];
function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
export function makePointBoard(points) {
    return new Board(points, encode, add, dirs);
}
export class Board {
    constructor(ps, encoder, adder, dirs) {
        this.encoder = encoder;
        this.adder = adder;
        this.dirs = dirs;
        this.unfilled = new Set();
        for (let p of ps) {
            this.unfilled.add(this.encoder(p));
        }
        this.filled = new Map();
        this.all = ps;
    }
    spread(p, limit, accum) {
        const ep = this.encoder(p);
        if (accum.size < limit && this.unfilled.has(ep) && !accum.has(ep)) {
            accum.add(ep);
            for (const d of this.dirs) {
                this.spread(this.adder(p, d), limit, accum);
                if (accum.size === limit) {
                    break;
                }
            }
        }
    }
    reachable(p, limit) {
        const reached = new Set();
        this.spread(p, limit, reached);
        return reached.size;
    }
    fill(ps, marker) {
        const eps = [];
        for (let p of ps) {
            const ep = this.encoder(p);
            if (!this.unfilled.has(ep)) {
                return false;
            }
            else {
                eps.push(ep);
            }
        }
        for (let ep of eps) {
            this.unfilled.delete(ep);
            this.filled.set(ep, marker);
        }
        return () => {
            // function to "unplace" a piece
            for (let ep of eps) {
                this.unfilled.add(ep);
                this.filled.delete(ep);
            }
        };
    }
    at(p) {
        const ep = this.encoder(p);
        if (this.unfilled.has(ep)) {
            return undefined; // fillable square
        }
        return this.filled.get(this.encoder(p)) || ' ';
    }
    remaining() {
        return this.all.filter((p) => this.unfilled.has(this.encoder(p)));
    }
}
//# sourceMappingURL=board.js.map