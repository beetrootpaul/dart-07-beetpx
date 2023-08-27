import { BeetPx, Timer, v_, Vector2d } from "@beetpx/beetpx";
import { Easing, EasingFn } from "../misc/Easing";
import { Movement, MovementFactory } from "./Movement";

export class MovementToTarget implements Movement {
  static of =
    (params: {
      targetY: number;
      duration: number;
      easingFn: EasingFn;
    }): MovementFactory =>
    // TODO: migrate from Lua
    // local easing_fn = params.easing_fn or _easing_linear
    (startXy) =>
      new MovementToTarget(
        startXy,
        params.targetY,
        params.duration,
        params.easingFn
      );

  private readonly _startXy: Vector2d;
  private readonly _targetY: number;
  private readonly _timer: Timer;
  private readonly _easingFn: EasingFn;
  private _xy: Vector2d;
  private _speed: Vector2d;

  private constructor(
    startXy: Vector2d,
    targetY: number,
    duration: number,
    easingFn: EasingFn
  ) {
    this._startXy = startXy;
    this._targetY = targetY;
    // TODO: migrate from Lua
    this._timer = new Timer(duration);
    // local timer = new_timer(params.frames, params.on_finished or nil
    this._easingFn = easingFn;

    this._xy = startXy;
    this._speed = this._nextXy().sub(startXy);
  }

  private _nextXy(): Vector2d {
    // TODO: migrate from Lua
    return v_(
      this.xy.x,
      Easing.lerp(
        this._startXy.y,
        this._targetY,
        this._easingFn(this._timer.progress)
      )
    );
    //                 _easing_lerp(
    //                     start_xy.x,
    //                     params.target_x or start_xy.x,
    //                     easing_fn(timer.passed_fraction())
    //                 ),
    //                 _easing_lerp(
    //                     start_xy.y,
    //                     params.target_y or start_xy.y,
    //                     easing_fn(timer.passed_fraction())
    //                 )
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
    this._timer.update(BeetPx.dt);
    this._speed = this._nextXy().sub(this._xy);
    this._xy = this._xy.add(this._speed);
  }
}
