export class Timer {
    private timer: number | null = null;
    private startTime: number | null = null;
    private elapsedTime: number = 0;
    private timerDisplay: HTMLDivElement;

    public constructor(timerDisplay: HTMLDivElement) {
        this.timerDisplay = timerDisplay;
    }

    public start() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timerDisplay.innerText = `Time: 0s`;
        }
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime!) / 1000);
            this.timerDisplay.innerText = `Time: ${this.elapsedTime}s`;
        }, 1000);
    }

    public stop() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timerDisplay.innerText = `Time: 0s`;
        }
    }
}