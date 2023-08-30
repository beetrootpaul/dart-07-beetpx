export class Throttle<Fn extends (arg: any) => any> {
  private framesSinceLastPassedThrough = Number.MAX_SAFE_INTEGER;

  constructor(private readonly throttledFn: Fn) {}

  update(): void {
    this.framesSinceLastPassedThrough = Math.min(
      this.framesSinceLastPassedThrough + 1,
      Number.MAX_SAFE_INTEGER
    );
  }

  invokeIfReady(
    throttleLengthInFrames: number,
    throttledFnParamsFactory: () => Parameters<Fn>[0]
  ): void {
    if (this.framesSinceLastPassedThrough >= throttleLengthInFrames) {
      this.framesSinceLastPassedThrough = 0;
      this.throttledFn(throttledFnParamsFactory());
    }
  }
}

// TODO: remove `_` prefixes when unnecessary
