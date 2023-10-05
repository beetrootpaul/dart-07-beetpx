import { BpxTimer, BpxVector2d, timer_ } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

// TODO: rework it and extract to BeetPx and rework. Or just remove and inline needed functionality?
export class TimerInfinite extends BpxTimer {
  constructor() {
    super({ frames: 1 });
  }
  get framesLeft(): number {
    return 1;
  }
  get progress(): number {
    return 0;
  }
  get hasFinished(): boolean {
    return false;
  }
  update(): void {}
}

export class MovementFixed implements Movement {
  static of =
    (params: { frames?: number }): MovementFactory =>
    (startXy) =>
      new MovementFixed(startXy, params.frames);

  private readonly _timer: BpxTimer;
  private readonly _xy: BpxVector2d;

  private constructor(startXy: BpxVector2d, frames?: number) {
    // TODO: do we ever use a case of no `frames`?
    this._timer = frames ? timer_(frames) : new TimerInfinite();
    this._xy = startXy;
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return BpxVector2d.zero;
  }

  get hasFinished(): boolean {
    return this._timer.hasFinished;
  }

  update(): void {
    this._timer.update();
  }
}
