import {
  BpxEasing,
  BpxEasingFn,
  BpxTimer,
  BpxVector2d,
  timer_,
  u_,
  v2d_,
  v_,
} from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export class MovementToTarget implements Movement {
  static of =
    (params: {
      targetX?: number;
      targetY?: number;
      frames: number;
      easingFn?: BpxEasingFn;
      onFinished?: () => void;
    }): MovementFactory =>
    (startXy) =>
      new MovementToTarget(
        startXy,
        v2d_(params.targetX ?? startXy[0], params.targetY ?? startXy[1]),
        params.frames,
        params.easingFn ?? BpxEasing.linear,
        params.onFinished
      );

  private readonly _startXy: BpxVector2d;
  private readonly _targetXy: BpxVector2d;
  private readonly _timer: BpxTimer;
  private readonly _easingFn: BpxEasingFn;
  private _onFinished: (() => void) | undefined;
  private _xy: BpxVector2d;
  private _speed: BpxVector2d;

  private constructor(
    startXy: BpxVector2d,
    targetXy: BpxVector2d,
    frames: number,
    easingFn: BpxEasingFn,
    onFinished?: () => void
  ) {
    this._startXy = startXy;
    this._targetXy = targetXy;
    this._timer = timer_(frames);
    this._easingFn = easingFn;
    this._onFinished = onFinished;

    this._xy = startXy;
    this._speed = v_.sub(this._nextXy(), startXy);
  }

  private _nextXy(): BpxVector2d {
    // TODO: use v_.lerp(…)
    return [
      u_.lerp(
        this._startXy[0],
        this._targetXy[0],
        this._easingFn(this._timer.progress)
      ),
      u_.lerp(
        this._startXy[1],
        this._targetXy[1],
        this._easingFn(this._timer.progress)
      ),
    ];
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return this._speed;
  }

  get hasFinished(): boolean {
    return this._timer.hasFinished;
  }

  update(): void {
    this._timer.update();
    this._speed = v_.sub(this._nextXy(), this._xy);
    this._xy = v_.add(this._xy, this._speed);
    if (this._onFinished && this._timer.hasFinished) {
      this._onFinished();
      this._onFinished = undefined;
    }
  }
}
