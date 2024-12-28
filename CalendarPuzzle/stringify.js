export function convert_to_points(shape, blank = " ") {
    const points = [];
    for (let y = 0; y < shape.length; y++) {
        const line = shape[y];
        for (let x = 0; x < line.length; x++) {
            if (line.charAt(x) !== blank) {
                points.push({ x, y });
            }
        }
    }
    return points;
}
export function convert_to_labeled_points(shape, width) {
    const res = [];
    for (let y = 0; y < shape.length; y++) {
        const line = shape[y];
        const row = Math.ceil(line.length / width);
        for (let x = 0; x < row; x++) {
            const label = line.substring(x * width, (x + 1) * width).trim();
            if (label.length > 0) {
                res.push({ label, point: { x: x, y: y } });
            }
        }
    }
    return res;
}
export function bounds(ps) {
    const minX = ps.reduce((m, p) => Math.min(m, p.x), Number.POSITIVE_INFINITY);
    const maxX = ps.reduce((m, p) => Math.max(m, p.x), Number.NEGATIVE_INFINITY);
    const minY = ps.reduce((m, p) => Math.min(m, p.y), Number.POSITIVE_INFINITY);
    const maxY = ps.reduce((m, p) => Math.max(m, p.y), Number.NEGATIVE_INFINITY);
    return [{ x: minX, y: minY }, { x: maxX, y: maxY }];
}
export function convert_to_strings(ps, to_char) {
    const [min, max] = bounds(ps);
    const grid = [];
    const width = max.x - min.x + 1;
    const height = max.y - min.y + 1;
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width).fill(' ');
    }
    for (let p of ps) {
        grid[p.y - min.y][p.x - min.x] = to_char(p);
    }
    return grid.map((cs) => cs.join(""));
}
// used to zero out shape coordinates so the first point is always (0, 0)
// which is important for the solver's iteration
function subtract(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}
export function convert_to_shape(vs) {
    const points = convert_to_points(vs.points);
    const first = points[0];
    return {
        chiral: vs.chiral,
        rotations: vs.rotations,
        points: points.map((p) => subtract(p, first))
    };
}
//# sourceMappingURL=stringify.js.map