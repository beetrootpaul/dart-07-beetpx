import { b, c } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";

export class ScreenSelectMission implements GameScreen {
  // TODO: remove this temporary code
  private _next: boolean = false;

  preUpdate(): GameScreen | undefined {
    // TODO: remove this temporary code
    if (this._next) {
      return new ScreenMissionMain({
        mission: CurrentMission.first + 2,
        health: 10,
        shockwaveCharges: 4,
        fastMovement: true,
        fastShoot: true,
        tripleShoot: true,
        score: 0,
      });
    }

    // TODO
    //         if proceed and selected_mission == 0 then
    //             return new_screen_title(1, false, false, false)
    //         end
    //
    //         if fade_out.has_finished() then
    //             _copy_shared_assets_from_transferable_ram()
    //             _load_mission_cart(
    //                 selected_mission,
    //                 _health_default,
    //                 _shockwave_charges_default,
    //                 false,
    //                 false,
    //                 false,
    //                 0
    //             )
    //         end
  }

  update(): void {
    // TODO: pressing "x" to select mission makes the first bullet shot. Fix it!

    // TODO: remove this temporary code
    if (b.wasJustPressed("x")) {
      this._next = true;
    }

    // TODO
    //         if btnp(_button_up) then
    //             _sfx_play(_sfx_options_change)
    //             selected_mission = (selected_mission - 1) % 4
    //             init_ship_movement()
    //         end
    //         if btnp(_button_down) then
    //             _sfx_play(_sfx_options_change)
    //             selected_mission = (selected_mission + 1) % 4
    //             init_ship_movement()
    //         end
    //
    //         if btnp(_button_x) then
    //             _sfx_play(_sfx_options_confirm)
    //             if selected_mission > 0 then
    //                 _music_fade_out()
    //             end
    //             proceed = true
    //         end
    //
    //         ship_sprite._update()
    //         jet_sprite._update()
    //
    //         if proceed then
    //             if ship_movement.has_finished() then
    //                 fade_out._update()
    //             else
    //                 ship_movement._update()
    //             end
    //         end
  }

  draw(): void {
    b.clearCanvas(c._1_darker_blue);

    // TODO: remove this temporary code
    //         for i = 1, 3 do
    //             draw_mission_button(i)
    //         end
    //         draw_back_button()
    //         if selected_mission > 0 then
    //             draw_ship()
    //         end
    //
    //         fade_out._draw()
  }
}

// TODO
// function new_screen_select_mission(selected_mission)
//     local fade_out = new_fade("out", 30)
//     local ship_movement
//
//     local proceed = false
//
//     local x_sprite = new_static_sprite("15,6,56,0", true)
//     local x_pressed_sprite = new_static_sprite("15,6,56,6", true)
//
//     local ship_sprite = new_static_sprite "10,10,19,0"
//     local jet_sprite = new_animated_sprite(
//         4,
//         4,
//         split("0,0,0,0,4,4,4,4"),
//         8
//     )
//
//     local function mission_button_xy_wh(mission_number)
//         -- place missions 1..N at positions 0..N-1, then place back button (identified as mission 0) at position N
//         local position = (mission_number - 1) % 4
//         return _xy(_gaox, 12 + position * 31), _xy(_gaw, 16)
//     end
//
//     local function draw_back_button()
//         local selected = selected_mission == 0
//
//         local button_xy1, button_wh = mission_button_xy_wh(0)
//
//         -- button shape
//         sspr(
//             selected and 35 or 36, 12,
//             1, 12,
//             button_xy1.x - 1, button_xy1.y - 1,
//             button_wh.x + 2, 12
//         )
//
//         -- button text
//         print("back", button_xy1.x + 3, button_xy1.y + 2, _color_14_mauve)
//
//         -- "x" press incentive
//         if selected then
//             local sprite = _alternating_0_and_1() == 0 and x_sprite or x_pressed_sprite
//             sprite._draw(-_gaox + button_xy1.x + button_wh.x - 16, button_xy1.y + 13)
//         end
//     end
//
//     local function draw_mission_button(mission_number)
//         local selected = selected_mission == mission_number
//
//         local button_xy1, button_wh = mission_button_xy_wh(mission_number)
//         local button_xy2 = button_xy1.plus(button_wh)
//
//         -- draw button shape
//         sspr(
//             selected and 38 or 39, 12,
//             1, 19,
//             button_xy1.x - 1, button_xy1.y - 1,
//             button_wh.x + 2, 19
//         )
//
//         -- draw level sample
//         local sy = 80 + (mission_number - 1) * 16
//         sspr(
//             0, selected and sy or (sy - 48),
//             button_wh.x, button_wh.y,
//             button_xy1.x, button_xy1.y
//         )
//
//         if mission_number > 1 then
//             -- draw WIP info
//             _centered_print(
//                 "under \-fdevelopment",
//                 button_xy1.y + 2,
//                 selected and _color_7_white or _color_6_light_grey,
//                 selected and _color_9_dark_orange or _color_13_lavender
//             )
//         end
//
//         -- draw label
//         print(
//             "mission " .. mission_number,
//             button_xy1.x, button_xy2.y + 4,
//             selected and _color_7_white or _color_13_lavender
//         )
//
//         -- draw "x" button press incentive and its label
//         if selected then
//             print(
//                 "start",
//                 button_xy2.x - 37, button_xy2.y + 4,
//                 _color_7_white
//             )
//             local sprite = _alternating_0_and_1() == 0 and x_sprite or x_pressed_sprite
//             sprite._draw(-_gaox + button_xy2.x - 15, button_xy2.y + 3)
//         end
//     end
//
//     local function draw_ship()
//         local button_xy, button_wh = mission_button_xy_wh(selected_mission)
//         clip(button_xy.x, button_xy.y, button_wh.x, button_wh.y)
//
//         ship_sprite._draw(ship_movement.xy)
//         jet_sprite._draw(ship_movement.xy.plus(0, 8))
//
//         clip()
//     end
//
//     local function init_ship_movement()
//         local button_xy, button_wh = mission_button_xy_wh(selected_mission)
//         ship_movement = new_movement_to_target_factory {
//             target_y = button_xy.minus(0, 10).y,
//             frames = 20,
//         }(button_xy.plus(-_gaox + button_wh.x / 2, button_wh.y - 6))
//     end
//
//     --
//
//     local screen = {}
//
//     function screen._init()
//         init_ship_movement()
//     end
//
//     return screen
// end
