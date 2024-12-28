const blank = "#cccccc";
const SCALE = 25;
class BoardRenderer {
    constructor(canvas, points, styles, drawText = false) {
        this.points = points;
        this.styles = styles;
        this.drawText = drawText;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }
    drawLabel(label, bp) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(label, (bp.x + 0.1) * SCALE, (bp.y + 0.5) * SCALE, SCALE * 0.8);
    }
    render(pi) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let entry of this.points) {
            const bp = entry.point;
            const color = this.styles.get(pi(bp) || blank);
            if (color || this.drawText) {
                this.ctx.fillStyle = color || blank;
                this.ctx.fillRect(bp.x * SCALE, bp.y * SCALE, SCALE, SCALE);
            }
            if (this.drawText) {
                this.drawLabel(entry.label, bp);
            }
        }
    }
}
const quantize = (value) => Math.floor(value / SCALE);
function board_coords(e) {
    return { x: quantize(e.offsetX), y: quantize(e.offsetY) };
}
const colors = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
    "#408840",
    "#004088"
];
export function makeBrowserRenderer(points, shapes, onClickBoard) {
    const blocks = document.getElementById("output");
    const board = document.getElementById("board");
    if (blocks && board) {
        blocks.addEventListener("click", (e) => {
            onClickBoard(board_coords(e));
        }, false);
        const styles = new Map();
        let i = 0;
        for (const k in shapes) {
            styles.set(k, colors[i++]);
            if (i >= colors.length) {
                i = 0;
            }
        }
        styles.set(" ", "#00000030");
        const renderer = new BoardRenderer(blocks, points, styles);
        const boardRenderer = new BoardRenderer(board, points, styles, true);
        boardRenderer.render((p) => undefined); // one render with all fillable squares
        return (pi) => {
            return renderer.render(pi);
        };
    }
    else {
        throw new Error("Could not find canvas for rendering!");
    }
}
export function bindToggleButton(fn) {
    const button = document.getElementById("start");
    if (button) {
        button.onclick = function () {
            fn();
        };
        return (running) => {
            button.innerText = running ? "Pause" : "Run ";
        };
    }
    else {
        throw new Error("Button not found!");
    }
}
//# sourceMappingURL=browserui.js.map