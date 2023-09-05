export class Throttle<Fn extends (arg: any) => any> {
  private readonly _throttledFn: Fn;

  private _framesSinceLastPassedThrough = Number.MAX_SAFE_INTEGER;

  constructor(throttledFn: Fn) {
    this._throttledFn = throttledFn;
  }

  update(): void {
    this._framesSinceLastPassedThrough = Math.min(
      this._framesSinceLastPassedThrough + 1,
      Number.MAX_SAFE_INTEGER
    );
  }

  invokeIfReady(
    throttleLengthInFrames: number,
    throttledFnParamsFactory: () => Parameters<Fn>[0]
  ): void {
    if (this._framesSinceLastPassedThrough >= throttleLengthInFrames) {
      this._framesSinceLastPassedThrough = 0;
      this._throttledFn(throttledFnParamsFactory());
    }
  }
}
