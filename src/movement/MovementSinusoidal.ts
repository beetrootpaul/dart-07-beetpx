import { BpxVector2d, u_, v_ } from "@beetpx/beetpx";
import { Movement, MovementFactory } from "./Movement";

export class MovementSinusoidal implements Movement {
  static of =
    (params: {
      speedY: number;
      ageDivisor: number;
      magnitude: number;
    }): MovementFactory =>
    (startXy) =>
      new MovementSinusoidal(
        startXy,
        params.speedY,
        params.ageDivisor,
        params.magnitude,
      );

  private readonly _startXy: BpxVector2d;
  private readonly _ageDivisor: number;
  private readonly _magnitude: number;

  private _age: number = 0;
  private _speed: BpxVector2d;
  private _xy: BpxVector2d;

  private constructor(
    startXy: BpxVector2d,
    speedY: number,
    ageDivisor: number,
    magnitude: number,
  ) {
    this._startXy = startXy;
    this._ageDivisor = ageDivisor;
    this._magnitude = magnitude;

    this._xy = v_(this.x(), startXy.y);
    this._speed = v_(this.x() - startXy.x, speedY);
  }

  private x(): number {
    return (
      this._startXy.x +
      this._magnitude * u_.trigSin(this._age / this._ageDivisor + 0.5)
    );
  }

  get xy(): BpxVector2d {
    return this._xy;
  }

  get speed(): BpxVector2d {
    return this._speed;
  }

  get hasFinished(): boolean {
    return false;
  }

  pause(): void {}

  resume(): void {}

  update(): void {
    this._speed = v_(this.x() - this._xy.x, this._speed.y);
    this._xy = this._xy.add(this._speed);
    this._age += 1;
  }
}
