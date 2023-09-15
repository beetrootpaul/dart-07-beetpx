// TODO
//     local next_id = 0

import { v_, Vector2d } from "@beetpx/beetpx";
import { b, c, g, u } from "../globals";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export class Shockwave {
  private static readonly _rMin: number = 11;
  private static readonly _rMax: number = 88;
  private static readonly _rStep: number = 7;
  private static readonly _rSpeed: number = 1;

  private _xy: Vector2d;

  private _rProgress: Movement;

  constructor(center: Vector2d) {
    // TODO
    //         next_id = next_id + 1
    // TODO
    //             id = next_id,

    this._xy = center.add(g.gameAreaOffset);

    this._rProgress = MovementLine.of({
      // keep in sync: amount of steps to add to "_rMax" here is taken from the smallest circle drawn in "draw()"
      frames: Math.ceil(
        (Shockwave._rMax + 4 * Shockwave._rStep) / Shockwave._rSpeed
      ),
      angle: 0,
      angledSpeed: Shockwave._rSpeed,
    })(Vector2d.zero);
  }

  // TODO
  //             collision_circle = function()
  //                 return {
  //                     xy = center_xy,
  //                     r = min(r_progress.xy.x, r_max),
  //                 }
  //             end,

  get hasFinished(): boolean {
    return this._rProgress.hasFinished;
  }

  update(): void {
    this._rProgress.update();
  }

  private _drawNegativeRing(rOuter: number, rInner: number): void {
    // TODO
    //             r_outer = mid(r_inner, r_outer, r_max)
    //             r_inner = mid(r_min, r_inner, r_outer)
    //             if r_inner == r_outer then return end
    //
    //             -- Negative ring implementation below is based on:
    //             --   - a code snippet from user FReDs72
    //             --   - a [Circular Clipping Masks article by Krystman](https://www.lexaloffle.com/bbs/?tid=46286)
    //
    //             -- use screen memory as if it was a sprite sheet (needed for "sspr" and "pal" used below)
    //             poke(0x5f54, 0x60)
    //             pal(_palette_negative)
    //
    //             for dy = -r_outer, r_outer do
    //                 local sy, dx_outer, dx_inner = y + dy, ceil(sqrt(r_outer * r_outer - dy * dy)), ceil(sqrt(r_inner * r_inner - dy * dy))
    //                 sspr(
    //                     x - dx_outer, sy,
    //                     dx_outer - dx_inner, 1,
    //                     x - dx_outer, sy
    //                 )
    //                 sspr(
    //                     x + dx_inner, sy,
    //                     dx_outer - dx_inner, 1,
    //                     x + dx_inner, sy
    //                 )
    //             end
    //
    //             pal()
    //             -- reset screen memory usage to its normal state
    //             poke(0x5f54, 0x0)
  }

  private _drawCircle(r: number): void {
    if (r === u.clamp(Shockwave._rMin, r, Shockwave._rMax)) {
      b.ellipse(this._xy.sub(r), v_(r, r).mul(2), c._6_light_grey);
    }
  }

  draw(): void {
    const r = Math.ceil(this._rProgress.xy.x);

    // this._drawNegativeRing(r, r - 13);

    this._drawCircle(r - 3 * Shockwave._rStep);

    const rStepped = Math.floor(r / Shockwave._rStep) * Shockwave._rStep;
    this._drawCircle(rStepped - 3 * Shockwave._rStep);
    this._drawCircle(rStepped - 4 * Shockwave._rStep);
    // keep in sync: smallest circle drawn above determines amount of steps to add to "_rMax" when calculating "frames" for "_rProgress"
  }
}
