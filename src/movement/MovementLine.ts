import { Timer, v_, Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";
import { TimerInfinite } from "./MovementFixed";

export class MovementLine implements Movement {
  static of =
    (params: {
      // angle: 0 = right, .25 = down, .5 = left, .75 = up
      angle: number;
      angledSpeed: number;
    }): MovementFactory =>
    (startXy) =>
      new MovementLine(startXy, params.angle, params.angledSpeed);

  private _xy: Vector2d;
  private readonly _speed: Vector2d;
  private readonly _timer: Timer;

  private constructor(startXy: Vector2d, angle: number, angledSpeed: number) {
    this._xy = startXy;

    this._speed = v_(
      angledSpeed * Math.cos(angle * Math.PI * 2),
      angledSpeed * Math.sin(angle * Math.PI * 2)
      // TODO
      // angled_speed * sin(angle) + (params.base_speed_y or 0)
    );

    // TODO
    // local angle = params.target_xy and _angle_between(start_xy, params.target_xy) or params.angle
    // local angled_speed = params.angled_speed or 1
    // local timer = params.frames and new_timer(params.frames) or new_fake_timer()
    this._timer = new TimerInfinite();
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
