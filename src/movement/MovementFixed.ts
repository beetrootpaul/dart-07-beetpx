import { BeetPx, Timer, Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

// TODO: extract to BeetPx and rework
class TimerInfinite extends Timer {
  get left(): number {
    return 1;
  }
  get progress(): number {
    return 0;
  }
  get hasFinished(): boolean {
    return false;
  }
  update(secondsPassed: number): void {}
}

export class MovementFixed implements Movement {
  static of =
    (params: { duration?: number }): MovementFactory =>
    (startXy) =>
      new MovementFixed(startXy, params.duration);

  private readonly _timer: Timer;
  private readonly _xy: Vector2d;

  private constructor(startXy: Vector2d, duration: number | undefined) {
    this._timer = duration ? new Timer(duration) : new TimerInfinite(123);
    this._xy = startXy;
  }

  get xy(): Vector2d {
    return this._xy;
  }

  get speed(): Vector2d {
    return Vector2d.zero;
  }

  get hasFinished(): boolean {
    return this._timer.hasFinished;
  }

  update(): void {
    this._timer.update(BeetPx.dt);
  }
}
