import { Vector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";
import { MovementFixed } from "./MovementFixed";

export class MovementSequence implements Movement {
  static of =
    (sequence: MovementFactory[]): MovementFactory =>
    (startXy) =>
      new MovementSequence(startXy, sequence);

  private readonly _sequence: MovementFactory[];
  private _sequenceIndex: number;
  private _currentSubMovement: Movement;

  private constructor(startXy: Vector2d, sequence: MovementFactory[]) {
    this._sequence = sequence.length > 0 ? sequence : [MovementFixed.of({})];
    this._sequenceIndex = 0;
    this._currentSubMovement = this._sequence[this._sequenceIndex]!(startXy);
  }

  get xy(): Vector2d {
    return this._currentSubMovement.xy;
  }

  get speed(): Vector2d {
    return this._currentSubMovement.speed;
  }

  get hasFinished(): boolean {
    // TODO: migrate from Lua
    //if loop then
    //     return false
    // end
    return (
      this._sequenceIndex >= this._sequence.length - 1 &&
      this._currentSubMovement.hasFinished
    );
  }

  update(): void {
    this._currentSubMovement.update();

    if (this._currentSubMovement.hasFinished) {
      if (this._sequenceIndex < this._sequence.length - 1) {
        this._sequenceIndex += 1;
        this._currentSubMovement = this._sequence[this._sequenceIndex]!(
          this._currentSubMovement.xy
        );
      }
      // TODO: migrate from Lua
      //     elseif loop then
      //         sequence_index = 1
      //         current_sub_movement = sequence[sequence_index](current_sub_movement.xy)
      //     end
    }
  }
}
