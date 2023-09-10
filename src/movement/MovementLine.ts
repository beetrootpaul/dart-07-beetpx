import { Timer, Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";
import { TimerInfinite } from "./MovementFixed";

export class MovementLine implements Movement {
  static of =
    (params: {
      baseSpeedXy?: Vector2d;
      // angle: 0 = right, .25 = down, .5 = left, .75 = up
      angle: number;
      angledSpeed: number;
      frames?: number;
    }): MovementFactory =>
    (startXy) =>
      new MovementLine(
        startXy,
        params.angle,
        params.angledSpeed,
        params.baseSpeedXy,
        params.frames
      );

  private _xy: Vector2d;
  private readonly _speed: Vector2d;
  private readonly _timer: Timer;

  private constructor(
    startXy: Vector2d,
    angle: number,
    angledSpeed: number,
    baseSpeedXy: Vector2d = Vector2d.zero,
    frames?: number
  ) {
    this._xy = startXy;

    this._speed = baseSpeedXy.add(
      angledSpeed * Math.cos(angle * Math.PI * 2),
      angledSpeed * Math.sin(angle * Math.PI * 2)
    );

    // TODO
    // local angle = params.target_xy and _angle_between(start_xy, params.target_xy) or params.angle
    // local angled_speed = params.angled_speed or 1
    this._timer = frames ? new Timer({ frames }) : new TimerInfinite();
  }

  get xy(): Vector2d {
    return this._xy;
  }

  get speed(): Vector2d {
    return this._speed;
  }

  get hasFinished(): boolean {
    return this._timer.hasFinished;
  }

  update(): void {
    this._timer.update();
    // TODO
    // if timer.ttl > 0 or params.continue_after_finished then
    if (!this._timer.hasFinished) {
      this._xy = this._xy.add(this._speed);
    }
  }
}
