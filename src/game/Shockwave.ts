// TODO
//     local next_id = 0

import { v_, Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { b, c, g, u } from "../globals";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export class Shockwave {
  private static _nextId = 1;

  private static readonly _rMin: number = 11;
  private static readonly _rMax: number = 88;
  private static readonly _rStep: number = 7;
  private static readonly _rSpeed: number = 1;

  readonly id: number = Shockwave._nextId++;

  private readonly _center: Vector2d;
  private _rProgress: Movement;

  constructor(center: Vector2d) {
    // TODO
    //         next_id = next_id + 1
    // TODO
    //             id = next_id,

    // this._center = center.add(g.gameAreaOffset);
    this._center = center;

    this._rProgress = MovementLine.of({
      // keep in sync: amount of steps to add to "_rMax" here is taken from the smallest circle drawn in "draw()"
      frames: Math.ceil(
        (Shockwave._rMax + 4 * Shockwave._rStep) / Shockwave._rSpeed
      ),
      angle: 0,
      angledSpeed: Shockwave._rSpeed,
    })(Vector2d.zero);
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: this._center,
      r: Math.min(this._rProgress.xy.x, Shockwave._rMax),
    };
  }

  get hasFinished(): boolean {
    return this._rProgress.hasFinished;
  }

  update(): void {
    this._rProgress.update();
  }

  private _drawNegativeRing(rOuter: number, rInner: number): void {
    rOuter = u.clamp(rInner, rOuter, Shockwave._rMax);
    rInner = u.clamp(Shockwave._rMin, rInner, rOuter);
    if (rInner === rOuter) return;

    for (let dy = -rOuter; dy <= rOuter; dy++) {
      const sy = this._center.y + dy;
      const dxOuter = Math.ceil(
        Math.sqrt(Math.max(0, rOuter * rOuter - dy * dy))
      );
      const dxInner = Math.ceil(
        Math.sqrt(Math.max(0, rInner * rInner - dy * dy))
      );
      // TODO: due to the way we do color mapping, overlapping pixels are negating themselves back. Do something about that overlap (vertical middle line)
      b.line(
        g.gameAreaOffset.add(v_(this._center.x - dxOuter + 1, sy)),
        v_(dxOuter - dxInner, 1),
        g.negativeColor
      );
      b.line(
        g.gameAreaOffset.add(v_(this._center.x + dxOuter - 1, sy)),
        v_(dxInner - dxOuter, 1),
        g.negativeColor
      );
    }
  }

  private _drawCircle(r: number): void {
    if (r === u.clamp(Shockwave._rMin, r, Shockwave._rMax)) {
      b.ellipse(
        g.gameAreaOffset.add(this._center).sub(r),
        v_(r, r).mul(2),
        c._6_light_grey
      );
    }
  }

  draw(): void {
    const r = Math.ceil(this._rProgress.xy.x);

    this._drawNegativeRing(r, r - 13);

    this._drawCircle(r - 3 * Shockwave._rStep);

    const rStepped = Math.floor(r / Shockwave._rStep) * Shockwave._rStep;
    this._drawCircle(rStepped - 3 * Shockwave._rStep);
    this._drawCircle(rStepped - 4 * Shockwave._rStep);
    // keep in sync: smallest circle drawn above determines amount of steps to add to "_rMax" when calculating "frames" for "_rProgress"
  }
}
