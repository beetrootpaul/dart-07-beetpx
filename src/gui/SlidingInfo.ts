import { SolidColor, v_ } from "@beetpx/beetpx";
import { b, g } from "../globals";
import { Movement } from "../movement/Movement";
import { movementFixedFactory } from "../movement/MovementFixed";

export class SlidingInfo {
  private readonly _text1: string;
  private readonly _text2: string;
  private readonly _mainColor: SolidColor;
  private readonly _movement: Movement;

  constructor(params: {
    text1: string;
    text2: string;
    presentDuration: number;
    mainColor: SolidColor;
  }) {
    this._text1 = params.text1;
    this._text2 = params.text2;

    // TODO: migrate from Lua
    //    local rounding_fn = ceil

    this._movement = movementFixedFactory({
      duration: params.presentDuration,
    })(v_(g.gameAreaOffsetX, 40));
    // TODO: migrate from Lua
    //     local movement = new_movement_sequence_factory {
    //         new_movement_fixed_factory {
    //             frames = params.wait_frames or 0,
    //         },
    //         new_movement_to_target_factory {
    //             frames = params.slide_in_frames,
    //             target_y = _gah / 2,
    //             easing_fn = _easing_easeoutquart,
    //             on_finished = function()
    //                 rounding_fn = flr
    //             end,
    //         },
    //         new_movement_fixed_factory {
    //             frames = params.present_frames,
    //         },
    //         new_movement_to_target_factory {
    //             frames = params.slide_out_frames,
    //             target_y = _gah + 18,
    //             easing_fn = _easing_easeinquart,
    //         },
    //     }(_xy(_gaox, -18))
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
