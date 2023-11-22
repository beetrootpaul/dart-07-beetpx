import { BpxVector2d } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";
import { MovementFixed } from "./MovementFixed";

export class MovementSequence implements Movement {
  static of =
    (sequence: MovementFactory[]): MovementFactory =>
    (startXy) =>
      new MovementSequence(startXy, false, sequence);

  static loopedOf =
    (sequence: MovementFactory[]): MovementFactory =>
    (startXy) =>
      new MovementSequence(startXy, true, sequence);

  private readonly _looped: boolean;
  private readonly _sequence: MovementFactory[];
  private _sequenceIndex: number;
  private _currentSubMovement: Movement;

  private constructor(
    startXy: BpxVector2d,
    looped: boolean,
    sequence: MovementFactory[],
  ) {
    this._looped = looped;
    this._sequence = sequence.length > 0 ? sequence : [MovementFixed.of({})];
    this._sequenceIndex = 0;
    this._currentSubMovement = this._sequence[this._sequenceIndex]!(startXy);
  }

  get xy(): BpxVector2d {
    return this._currentSubMovement.xy;
  }

  get speed(): BpxVector2d {
    return this._currentSubMovement.speed;
  }

  get hasFinished(): boolean {
    if (this._looped) return false;
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
          this._currentSubMovement.xy,
        );
      } else if (this._looped) {
        this._sequenceIndex = 0;
        this._currentSubMovement = this._sequence[this._sequenceIndex]!(
          this._currentSubMovement.xy,
        );
      }
    }
  }
}
