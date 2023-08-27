import { Vector2d } from "@beetpx/beetpx";

export interface MovementFactory {
  (startXy: Vector2d): Movement;
}

export interface Movement {
  get xy(): Vector2d;

  get speed(): Vector2d;

  get hasFinished(): boolean;

  update(): void;
}
