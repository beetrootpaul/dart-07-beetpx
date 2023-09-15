// TODO
//     local next_id = 0

import { MappingColor, SolidColor, v_, Vector2d } from "@beetpx/beetpx";
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
    rOuter = u.clamp(rInner, rOuter, Shockwave._rMax);
    rInner = u.clamp(Shockwave._rMin, rInner, rOuter);
    if (rInner === rOuter) return;

    // TODO: this approach moves us out of the palette :-/
    const negativeColorMapping = new MappingColor(({ r, g, b, a }) =>
      a >= 0xff / 2
        ? new SolidColor(0xff - r, 0xff - g, 0xff - b)
        : new SolidColor(r, g, b)
    );

    // TODO
    //             -- use screen memory as if it was a sprite sheet (needed for "sspr" and "pal" used below)
    //             poke(0x5f54, 0x60)
    //             pal(_palette_negative)

    for (let dy = -rOuter; dy <= rOuter; dy++) {
      const sy = this._xy.y + dy;
      const dxOuter = Math.ceil(
        Math.sqrt(Math.max(0, rOuter * rOuter - dy * dy))
      );
      const dxInner = Math.ceil(
        Math.sqrt(Math.max(0, rInner * rInner - dy * dy))
      );
      // TODO: due to the way we do color mapping, overlapping pixels are negating themselves back. Do something about that overlap (vertical middle line)
      b.line(
        v_(this._xy.x - dxOuter + 1, sy),
        v_(dxOuter - dxInner, 1),
        negativeColorMapping
      );
      b.line(
        v_(this._xy.x + dxOuter - 1, sy),
        v_(dxInner - dxOuter, 1),
        negativeColorMapping
      );
    }

    // TODO
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

    this._drawNegativeRing(r, r - 13);

    this._drawCircle(r - 3 * Shockwave._rStep);

    const rStepped = Math.floor(r / Shockwave._rStep) * Shockwave._rStep;
    this._drawCircle(rStepped - 3 * Shockwave._rStep);
    this._drawCircle(rStepped - 4 * Shockwave._rStep);
    // keep in sync: smallest circle drawn above determines amount of steps to add to "_rMax" when calculating "frames" for "_rProgress"
  }
}
