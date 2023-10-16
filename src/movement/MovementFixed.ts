import { BpxTimer, BpxVector2d, timer_, v_0_0_ } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export class MovementFixed implements Movement {
  static of =
    (params: { frames?: number }): MovementFactory =>
    (startXy) =>
      new MovementFixed(startXy, params.frames);

  private readonly _timer: BpxTimer | null;
  private readonly _xy: BpxVector2d;

  private constructor(startXy: BpxVector2d, frames?: number) {
    this._timer = frames ? timer_(frames) : null;
    this._xy = startXy;
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return v_0_0_;
  }

  get hasFinished(): boolean {
    return this._timer ? this._timer.hasFinished : false;
  }

  update(): void {
    this._timer?.update();
  }
}
