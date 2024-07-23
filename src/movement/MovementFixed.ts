import { $timer, $v_0_0, BpxTimer, BpxVector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export class MovementFixed implements Movement {
  static of =
    (params: { frames?: number; ignoreGamePause?: boolean }): MovementFactory =>
    startXy =>
      new MovementFixed(startXy, params.frames, params.ignoreGamePause);

  private readonly _timer: BpxTimer | null;
  private readonly _xy: BpxVector2d;

  private constructor(
    startXy: BpxVector2d,
    frames?: number,
    ignoreGamePause?: boolean,
  ) {
    this._timer =
      typeof frames === "number" ?
        $timer(frames, { onGamePause: ignoreGamePause ? "ignore" : "pause" })
      : null;
    this._xy = startXy;
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return $v_0_0;
  }

  get hasFinished(): boolean {
    return this._timer ? this._timer.hasFinished : false;
  }

  pause(): void {
    this._timer?.pause();
  }

  resume(): void {
    this._timer?.resume();
  }

  update(): void {}
}
