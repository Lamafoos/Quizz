type timerConfig = {
  tickInterval: number;
  decimalsToShow: number;
};

const defaultConfig = <timerConfig>{
  tickInterval: 100,
  decimalsToShow: 2,
};

export class Timer {
  private config: timerConfig;
  private intervalTimer: number = 0;
  private duration: number;
  private startTime: number = 0;
  private stopTime: number = 0;
  private endsAt: number = 0;
  public running: boolean = false;
  public timeLeft: number = 0;
  public timeOut: boolean = false;

  get startToStopTime(): number {
    return (this.stopTime - this.startTime) / 1000;
  }

  constructor(
    seconds: number,
    minutes?: number,
    hours?: number,
    config?: timerConfig,
  ) {
    const minutesAsSeconds = minutes ? minutes * 60 : 0;
    const hoursAsSeconds = hours ? hours * 3600 : 0;

    this.duration = seconds + minutesAsSeconds + hoursAsSeconds;

    this.config = config || defaultConfig;
  }

  private tick(): void {
    if (this.running) {
      const currentTime = performance.now();
      this.timeLeft = Math.ceil((this.endsAt - currentTime) / 1000);

      if (currentTime >= this.endsAt) {
        window.clearInterval(this.intervalTimer);
        this.stopTime = this.endsAt;
        this.timeOut = true;
        this.running = false;
      }
    }
  }

  public start(): void {
    this.timeOut = false;
    this.running = true;
    this.startTime = performance.now();
    this.endsAt = performance.now() + this.duration * 1000;
    this.timeLeft = this.duration;

    this.intervalTimer = window.setInterval(
      this.tick.bind(this),
      this.config.tickInterval,
    );
  }

  public stop(): void {
    this.stopTime = performance.now();
    window.clearInterval(this.intervalTimer);
    this.running = false;
  }

  public addTime(seconds: number): void {
    this.endsAt += seconds * 1000;
  }
}
