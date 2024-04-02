import { BpxTimer, BpxVector2d, timer_, v_0_0_ } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export class MovementLine implements Movement {
  static of =
    (
      params:
        | {
            baseSpeedXy?: BpxVector2d;
            // angle: 0 = right, .25 = down, .5 = left, .75 = up
            angle: number;
            angledSpeed: number;
            frames?: number;
          }
        | {
            baseSpeedXy?: BpxVector2d;
            targetXy: BpxVector2d;
            angledSpeed: number;
            frames?: number;
          },
    ): MovementFactory =>
    startXy =>
      new MovementLine(
        startXy,
        "angle" in params ?
          BpxVector2d.unitFromAngle(params.angle).mul(params.angledSpeed)
        : params.targetXy.sub(startXy).normalize().mul(params.angledSpeed),
        params.baseSpeedXy,
        params.frames,
      );

  private _xy: BpxVector2d;
  private _speed: BpxVector2d;
  private readonly _timer: BpxTimer | null;

  private constructor(
    startXy: BpxVector2d,
    angledSpeed: BpxVector2d,
    baseSpeedXy: BpxVector2d = v_0_0_,
    frames: number | undefined,
  ) {
    this._xy = startXy;

    this._timer = typeof frames === "number" ? timer_(frames) : null;

    this._speed =
      this._timer?.hasFinished ? v_0_0_ : baseSpeedXy.add(angledSpeed);
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return this._speed;
  }

  get hasFinished(): boolean {
    return this._timer ? this._timer.hasFinished : false;
  }

  pause(): void {
    this._timer?.pause();
  }

  resume(): void {
    this._timer?.resume();
  }

  update(): void {
    this._xy = this._xy.add(this._speed);
    if (this._timer?.hasJustFinished) {
      this._speed = v_0_0_;
    }
  }
}
