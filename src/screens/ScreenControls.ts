import { b, c } from "../globals";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenControls implements GameScreen {
  // TODO: remove this temporary code
  private _next: boolean = false;

  preUpdate(): GameScreen | undefined {
    // TODO: remove this temporary code
    if (this._next) {
      return new ScreenTitle();
    }

    // TODO
    //         if proceed then
    //             return new_screen_title(preselected_mission, false, false, true)
    //         end
  }

  update(): void {
    // TODO: remove this temporary code
    if (b.wasJustPressed("x")) {
      this._next = true;
    }

    // TODO
    //         if btnp(_button_x) then
    //             _sfx_play(_sfx_options_confirm)
    //             proceed = true
    //         end
  }

  draw(): void {
    b.clearCanvas(c._1_darker_blue);

    // TODO
    //         draw_controls(15, 12)
    //         draw_back_button(15, 104)
  }
}

// TODO
// function new_screen_controls(preselected_mission)
//     local x_sprite = new_static_sprite("15,6,56,0", true)
//     local x_pressed_sprite = new_static_sprite("15,6,56,6", true)
//     local c_o_sprite = new_static_sprite("15,6,56,24", true)
//     local pause_sprite = new_static_sprite("15,6,41,0", true)
//
//     local proceed = false
//
//     local function draw_controls(base_x, base_y)
//         local y = base_y
//
//         print("in \-fgame:", base_x, y, _color_15_peach)
//         y = y + 10
//
//         print("use \-farrows \-fto \-fmove", base_x, y, _color_6_light_grey)
//         y = y + 10
//
//         print("press \-f& \-fhold", base_x, y, _color_6_light_grey)
//         x_sprite._draw(-_gaox + base_x + 49, y - 1)
//         print("to \-ffire", base_x + 67, y, _color_6_light_grey)
//         y = y + 10
//
//         print("press", base_x, y, _color_6_light_grey)
//         c_o_sprite._draw(-_gaox + base_x + 23, y - 1)
//         print("to \-ftrigger", base_x + 41, y, _color_6_light_grey)
//         print("a \-fshockwave", base_x, y + 7, _color_6_light_grey)
//         y = y + 20
//
//         print("other:", base_x, y, _color_15_peach)
//         y = y + 10
//
//         print("press", base_x, y, _color_6_light_grey)
//         pause_sprite._draw(-_gaox + base_x + 23, y - 1)
//         print("to \-fopen", base_x + 41, y, _color_6_light_grey)
//         print("the \-fpause \-fmenu", base_x, y + 6, _color_6_light_grey)
//         y = y + 16
//
//         print("press", base_x, y, _color_6_light_grey)
//         x_sprite._draw(-_gaox + base_x + 23, y - 1)
//         print("to \-fconfirm", base_x + 41, y, _color_6_light_grey)
//     end
//
//     local function draw_back_button(base_x, base_y)
//         local w = _vs - 2 * base_x
//
//         -- button shape
//         sspr(35, 12, 1, 12, base_x, base_y, w, 12)
//
//         -- button text
//         print("back", base_x + 4, base_y + 3, _color_14_mauve)
//
//         -- "x" press incentive
//         local sprite = _alternating_0_and_1() == 0 and x_sprite or x_pressed_sprite
//         sprite._draw(-_gaox + base_x + w - 16, base_y + 13)
//     end
//
//     --
//
//     local screen = {
//         _init = _noop,
//     }
//
//     return screen
// end
