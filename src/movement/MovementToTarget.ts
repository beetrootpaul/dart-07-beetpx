import {
  BpxEasing,
  BpxEasingFn,
  BpxTimer,
  BpxVector2d,
  timer_,
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
        v_(params.targetX ?? startXy.x, params.targetY ?? startXy.y),
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
    this._speed = this._nextXy().sub(startXy);
  }

  private _nextXy(): BpxVector2d {
    return BpxVector2d.lerp(
      this._startXy,
      this._targetXy,
      this._easingFn(this._timer.progress)
    );
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
    this._speed = this._nextXy().sub(this._xy);
    this._xy = this._xy.add(this._speed);
    if (this._onFinished && this._timer.hasFinished) {
      this._onFinished();
      this._onFinished = undefined;
    }
  }
}
