import { BeetPx, Timer, Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export function movementFixedFactory(params: {
  duration: number;
}): MovementFactory {
  return (startXy) => {
    return new MovementFixed(startXy, params.duration);
  };
}

class MovementFixed implements Movement {
  private readonly _timer: Timer;
  private readonly _xy: Vector2d;

  constructor(startXy: Vector2d, duration: number) {
    // TODO: migrate from Lua
    this._timer = new Timer(duration);
    // local timer = params.frames and new_timer(params.frames) or new_fake_timer()
    this._xy = startXy;
    // TODO: migrate from Lua
    //     speed_xy = _xy_0_0,
  }

  get xy(): Vector2d {
    return this._xy;
  }

  get hasFinished(): boolean {
    return this._timer.hasFinished;
  }

  update(): void {
    this._timer.update(BeetPx.dt);
  }
}
