import { Timer, v_, Vector2d } from "@beetpx/beetpx";
import { Easing, EasingFn } from "../misc/Easing";
import { Movement, MovementFactory } from "./Movement";

export class MovementToTarget implements Movement {
  static of =
    (params: {
      targetX?: number;
      targetY?: number;
      frames: number;
      easingFn: EasingFn;
      onFinished?: () => void;
    }): MovementFactory =>
    // TODO
    // local easing_fn = params.easing_fn or _easing_linear
    (startXy) =>
      new MovementToTarget(
        startXy,
        v_(params.targetX ?? startXy.x, params.targetY ?? startXy.y),
        params.frames,
        params.easingFn,
        params.onFinished
      );

  private readonly _startXy: Vector2d;
  private readonly _targetXy: Vector2d;
  private readonly _timer: Timer;
  private readonly _easingFn: EasingFn;
  private _onFinished: (() => void) | undefined;
  private _xy: Vector2d;
  private _speed: Vector2d;

  private constructor(
    startXy: Vector2d,
    targetXy: Vector2d,
    frames: number,
    easingFn: EasingFn,
    onFinished?: () => void
  ) {
    this._startXy = startXy;
    this._targetXy = targetXy;
    // TODO
    this._timer = new Timer({ frames });
    // local timer = new_timer(params.frames, params.on_finished or nil
    this._easingFn = easingFn;
    this._onFinished = onFinished;

    this._xy = startXy;
    this._speed = this._nextXy().sub(startXy);
  }

  private _nextXy(): Vector2d {
    return v_(
      Easing.lerp(
        this._startXy.x,
        this._targetXy.x,
        this._easingFn(this._timer.progress)
      ),
      Easing.lerp(
        this._startXy.y,
        this._targetXy.y,
        this._easingFn(this._timer.progress)
      )
    );
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
    this._speed = this._nextXy().sub(this._xy);
    this._xy = this._xy.add(this._speed);
    if (this._onFinished && this._timer.hasFinished) {
      this._onFinished();
      this._onFinished = undefined;
    }
  }
}
