import { Timer, Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

// TODO: rework it and extract to BeetPx and rework. Or just remove and inline needed functionality?
export class TimerInfinite extends Timer {
  constructor() {
    super({ frames: 1 });
  }
  get framesLeft(): number {
    return 1;
  }
  get progress(): number {
    return 0;
  }
  get hasFinished(): boolean {
    return false;
  }
  update(): void {}
}

export class MovementFixed implements Movement {
  static of =
    (params: { frames?: number }): MovementFactory =>
    (startXy) =>
      new MovementFixed(startXy, params.frames);

  private readonly _timer: Timer;
  private readonly _xy: Vector2d;

  private constructor(startXy: Vector2d, frames?: number) {
    // TODO: do we ever use a case of no `frames`?
    this._timer = frames ? new Timer({ frames }) : new TimerInfinite();
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
    this._timer.update();
  }
}
