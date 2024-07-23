import {
  $timer,
  $v,
  BpxEasing,
  BpxEasingFn,
  BpxTimer,
  BpxVector2d,
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
      ignoreGamePause?: boolean;
    }): MovementFactory =>
    startXy =>
      new MovementToTarget(
        startXy,
        $v(params.targetX ?? startXy.x, params.targetY ?? startXy.y),
        params.frames,
        params.easingFn ?? BpxEasing.linear,
        params.onFinished,
        params.ignoreGamePause,
      );

  private readonly _startXy: BpxVector2d;
  private readonly _targetXy: BpxVector2d;
  private readonly _timer: BpxTimer;
  private readonly _easingFn: BpxEasingFn;
  private readonly _onFinished: (() => void) | undefined;
  private _xy: BpxVector2d;
  private _speed: BpxVector2d;

  private constructor(
    startXy: BpxVector2d,
    targetXy: BpxVector2d,
    frames: number,
    easingFn: BpxEasingFn,
    onFinished?: () => void,
    ignoreGamePause?: boolean,
  ) {
    this._startXy = startXy;
    this._targetXy = targetXy;
    this._timer = $timer(frames, {
      onGamePause: ignoreGamePause ? "ignore" : "pause",
    });
    this._easingFn = easingFn;
    this._onFinished = onFinished;

    this._xy = startXy;
    this._speed = this._nextXy().sub(startXy);
  }

  private _nextXy(): BpxVector2d {
    return BpxVector2d.lerp(
      this._startXy,
      this._targetXy,
      this._easingFn(this._timer.progress),
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

  pause(): void {
    this._timer.pause();
  }

  resume(): void {
    this._timer.resume();
  }

  update(): void {
    this._speed = this._nextXy().sub(this._xy);
    this._xy = this._xy.add(this._speed);
    if (this._onFinished && this._timer.hasJustFinished) {
      this._onFinished();
    }
  }
}

// TODO: tests for this movement
