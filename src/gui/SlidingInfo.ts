import { SolidColor, v_ } from "@beetpx/beetpx";
import { b, g } from "../globals";
import { Easing } from "../misc/Easing";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

export class SlidingInfo {
  private readonly _text1: string;
  private readonly _text2: string;
  private readonly _mainColor: SolidColor;
  private readonly _movement: Movement;

  constructor(params: {
    text1: string;
    text2: string;
    waitDuration: number;
    slideInDuration: number;
    presentDuration: number;
    slideOutDuration: number;
    mainColor: SolidColor;
  }) {
    this._text1 = params.text1;
    this._text2 = params.text2;

    // TODO: migrate from Lua
    //    local rounding_fn = ceil

    // TODO: migrate from Lua
    this._movement = MovementSequence.of([
      MovementFixed.of({
        // TODO: migrate from Lua
        duration: params.waitDuration,
        // frames = params.wait_frames or 0,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y / 2,
        duration: params.slideInDuration,
        easingFn: Easing.outQuartic,
        // TODO: migrate from Lua
        // on_finished = function()
        //     rounding_fn = flr
        // end,
      }),
      MovementFixed.of({
        duration: params.presentDuration,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y + 18,
        duration: params.slideOutDuration,
        easingFn: Easing.inQuartic,
      }),
    ])(v_(g.gameAreaOffsetX, -18));
    this._mainColor = params.mainColor;
  }

  // TODO: migrate from Lua
  //   has_finished = movement.has_finished,

  update(): void {
    this._movement.update();
  }

  draw(): void {
    // TODO: migrate from Lua
    const xy = this._movement.xy;
    // local x, y = rounding_fn(movement.xy.x), rounding_fn(movement.xy.y)
    // TODO: migrate from Lua
    //             if params.text_1 then
    b.print(this._text1, v_(xy.x, xy.y - 17), this._mainColor);
    //                 _centered_print(params.text_1, y - 17, _m_bg_color, params.main_color)
    //             end
    // TODO: migrate from Lua
    b.print(this._text2, v_(xy.x, xy.y - 8), this._mainColor);
    //             _centered_print(params.text_2, y - 8, _m_bg_color, params.main_color)
    b.line(xy, v_(g.gameAreaSize.x, 1), this._mainColor);
  }
}
