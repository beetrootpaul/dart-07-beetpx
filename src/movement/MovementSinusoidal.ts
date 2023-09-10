import { v_, Vector2d } from "@beetpx/beetpx";
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
        params.magnitude
      );

  private readonly _startXy: Vector2d;
  private readonly _ageDivisor: number;
  private readonly _magnitude: number;

  private _age: number = 0;
  private _speed: Vector2d;
  private _xy: Vector2d;

  private constructor(
    startXy: Vector2d,
    speedY: number,
    ageDivisor: number,
    magnitude: number
  ) {
    this._startXy = startXy;
    this._ageDivisor = ageDivisor;
    this._magnitude = magnitude;

    this._xy = v_(this.x(), startXy.y);
    // TODO
    //    speed_xy = _xy( x() - start_xy.x, params.speed_y or 1 )
    this._speed = v_(this.x() - startXy.x, speedY);
  }

  private x(): number {
    return (
      this._startXy.x +
      this._magnitude *
        Math.sin((this._age / this._ageDivisor) * Math.PI * 2 + Math.PI)
    );
  }

  get xy(): Vector2d {
    return this._xy;
  }

  get speed(): Vector2d {
    return this._speed;
  }

  get hasFinished(): boolean {
    return false;
  }

  update(): void {
    this._speed = v_(this.x() - this._xy.x, this._speed.y);
    this._xy = this._xy.add(this._speed);
    this._age += 1;
  }
}
