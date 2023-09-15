import { Vector2d } from "@beetpx/beetpx";
import { c, h } from "../globals";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export class Float {
  private readonly _movement: Movement;
  private readonly _scoreText: string;

  constructor(params: { startXy: Vector2d; score: number }) {
    this._movement = MovementLine.of({
      angle: 0.75,
      angledSpeed: 0.5,
      frames: 45,
    })(params.startXy);

    this._scoreText = params.score.toFixed(0) + "0";
  }

  get hasFinished(): boolean {
    return this._movement.hasFinished;
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    h.printCentered(
      this._scoreText,
      this._movement.xy.x,
      this._movement.xy.y,
      c._7_white
    );
  }
}