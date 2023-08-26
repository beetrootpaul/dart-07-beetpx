import { SolidColor, v_ } from "@beetpx/beetpx";
import { b, g } from "../globals";

export class SlidingInfo {
  private readonly _mainColor: SolidColor;

  constructor(params: { mainColor: SolidColor }) {
    // TODO: migrate from Lua
    //    local rounding_fn = ceil
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
    // TODO: migrate from Lua
    // _update = movement._update,
  }

  draw(): void {
    // TODO: migrate from Lua
    const xy = v_(g.gameAreaOffsetX, 40);
    //             local x, y = rounding_fn(movement.xy.x), rounding_fn(movement.xy.y)
    // TODO: migrate from Lua
    //             if params.text_1 then
    //                 _centered_print(params.text_1, y - 17, _m_bg_color, params.main_color)
    //             end
    //             _centered_print(params.text_2, y - 8, _m_bg_color, params.main_color)
    b.line(xy, v_(g.gameAreaSize.x, 1), this._mainColor);
  }
}
