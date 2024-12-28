export class Runner {
    constructor(callback = (_) => undefined, si = setInterval, ci = clearInterval) {
        this.callback = callback;
        this.si = si;
        this.ci = ci;
        this.state = { name: "paused" };
    }
    stop() {
        if (this.state.name === "running") {
            clearInterval(this.state.handle);
        }
        this.state = { name: "paused" };
        this.callback(this.running());
    }
    start(fn) {
        this.state = { name: "running", handle: setInterval(fn, 0) };
        this.callback(this.running());
    }
    running() {
        return this.state.name === "running";
    }
    listener(callback) {
        this.callback = callback;
        this.callback(this.running());
    }
}
//# sourceMappingURL=runner.js.map