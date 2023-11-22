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
    (startXy) =>
      new MovementLine(
        startXy,
        "angle" in params
          ? params.angle
          : params.targetXy.sub(startXy).toAngle(),
        params.angledSpeed,
        params.baseSpeedXy,
        params.frames,
      );

  private _xy: BpxVector2d;
  private readonly _speed: BpxVector2d;
  private readonly _timer: BpxTimer | null;

  private constructor(
    startXy: BpxVector2d,
    angle: number,
    angledSpeed: number,
    baseSpeedXy: BpxVector2d = v_0_0_,
    frames: number | undefined,
  ) {
    this._xy = startXy;

    this._speed = baseSpeedXy.add(
      BpxVector2d.unitFromAngle(angle).mul(angledSpeed),
    );

    this._timer = frames ? timer_(frames) : null;
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

  update(): void {
    this._timer?.update();
    if (!this._timer || !this._timer.hasFinished) {
      this._xy = this._xy.add(this._speed);
    }
  }
}
