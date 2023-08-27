// TODO
//    local function new_hud_sprite(sprite_whxy_txt)
//         return new_static_sprite(sprite_whxy_txt, true)
//     end

import { v_ } from "@beetpx/beetpx";
import { b, c, g } from "../globals";

export class Hud {
  // TODO
  //         local slide_in_offset = new_movement_sequence_factory {
  //             new_movement_fixed_factory {
  //                 frames = params.wait_frames,
  //                 -- DEBUG:
  //                 --frames = 0,
  //             },
  //             new_movement_to_target_factory {
  //                 frames = params.slide_in_frames,
  //                 target_x = 0,
  //                 easing_fn = _easing_easeoutquart,
  //                 -- DEBUG:
  //                 --frames = 0,
  //             },
  //         }(_xy(-20, 0))

  // we draw HUD area 20 px bigger on the outside in order to compensate for a player damage camera shake
  private static readonly _safetyBorder = 20;

  private static readonly _barSize = v_(16, g.viewportSize.y);
  // TODO
  // local boss_health_bar_margin = 2

  // TODO
  //         local heart, health_bar_start, health_bar_segment_full, health_bar_segment_empty = new_hud_sprite "6,5,40,24", new_hud_sprite "8,5,40,19", new_hud_sprite "8,9,40,10", new_hud_sprite "1,9,40,10"
  //         local shockwave, shockwave_bar_start, shockwave_bar_segment_full, shockwave_bar_segment_empty = new_hud_sprite "7,6,48,24", new_hud_sprite "8,1,48,23", new_hud_sprite "8,11,48,12", new_hud_sprite "2,11,54,12"
  //         local ship_indicator = new_hud_sprite "3,5,32,15"
  //         local boss_health_bar_start, boss_health_bar_end = new_hud_sprite "4,4,27,20", new_hud_sprite "4,4,31,20"
  //         -- these sprites are defined globally, because we want to access it through "_ENV"
  //         fast_movement_off, fast_movement_on, fast_shoot_off, fast_shoot_on, triple_shoot_off, triple_shoot_on = new_hud_sprite "7,4,96,24", new_hud_sprite "7,4,96,28", new_hud_sprite "7,4,104,24", new_hud_sprite "7,4,104,28", new_hud_sprite "7,4,112,24", new_hud_sprite "7,4,112,28"

  update(): void {
    // TODO
    // _update = slide_in_offset._update,
  }

  draw(): void {
    b.rectFilled(
      v_(0, 0).sub(Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c.black
    );
    b.rectFilled(
      g.viewportSize.sub(Hud._barSize).sub(0, Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c.black
    );
    if (b.debug) {
      b.rectFilled(v_(0, 0), Hud._barSize, c.blueGreen);
      b.rectFilled(g.viewportSize.sub(Hud._barSize), Hud._barSize, c.blueGreen);
    }

    // TODO
    //             _draw = function(game)
    //                 -- health bar
    //                 local xy = _xy(
    //                     ceil(-_gaox + 3 + slide_in_offset.xy.x),
    //                     ceil(_vs - 16 + slide_in_offset.xy.y)
    //                 )
    //                 heart._draw(xy.plus(1, 6))
    //                 for segment = 1, _health_max do
    //                     (game.health >= segment and health_bar_segment_full or health_bar_segment_empty)._draw(xy.minus(0, 4 + segment * 6))
    //                 end
    //                 -- we have to draw health_bar_start after health_bar_segment_full in order to cover 1st segment's joint with black pixels
    //                 health_bar_start._draw(xy.minus(0, 4))
    //
    //                 -- mission progress
    //                 local mission_progress_h, mission_progress_x = 35, _gaox + xy.x + 5
    //                 line(
    //                     mission_progress_x,
    //                     4,
    //                     mission_progress_x,
    //                     3 + mission_progress_h,
    //                     _color_13_lavender
    //                 )
    //                 ship_indicator._draw(xy.minus(
    //                     -4,
    //                     77 + game.mission_progress_fraction() * (mission_progress_h - 3)
    //                 -- DEBUG:
    //                 --    77 + .25 * (mission_progress_h - 3)
    //                 ))
    //
    //
    //                 -- shockwave charges
    //                 xy = _xy(
    //                     ceil(_gaw + 5 - slide_in_offset.xy.x),
    //                     ceil(_vs - 16 - slide_in_offset.xy.y)
    //                 )
    //                 shockwave._draw(xy.plus(0, 6))
    //                 shockwave_bar_start._draw(xy)
    //                 for segment = 1, _shockwave_charges_max do
    //                     if game.shockwave_charges >= segment then
    //                         shockwave_bar_segment_full._draw(xy.minus(0, segment * 11))
    //                     else
    //                         shockwave_bar_segment_empty._draw(xy.minus(-6, segment * 11))
    //                     end
    //                 end
    //
    //                 -- score
    //                 game.score._draw(xy.x + 17, 4, _color_6_light_grey, _color_2_darker_purple, true)
    //
    //                 -- powerups
    //                 for index, powerup in pairs { "fast_movement", "fast_shoot", "triple_shoot" } do
    //                     _ENV[powerup .. (game[powerup] and "_on" or "_off")]._draw(xy.x - 1, 40 + 6 * index)
    //                 end
    //
    //
    //                 -- boss health
    //                 -- (hack to optimize tokens: we set game.boss_health_max only when boss enters
    //                 -- fight phase, even if we update game.boss_health earlier on every frame;
    //                 -- thanks to that we can easily detect if it's time to show boss' health bar)
    //                 if game.boss_health_max then
    //                     local health_fraction = game.boss_health / game.boss_health_max
    //                     boss_health_bar_start._draw(boss_health_bar_margin, boss_health_bar_margin)
    //                     boss_health_bar_end._draw(_gaw - boss_health_bar_margin - 4, boss_health_bar_margin)
    //                     line(
    //                         _gaox + boss_health_bar_margin + 2,
    //                         boss_health_bar_margin + 2,
    //                         _gaox + _gaw - boss_health_bar_margin - 3,
    //                         boss_health_bar_margin + 2,
    //                         _color_14_mauve
    //                     )
    //                     if health_fraction > 0 then
    //                         line(
    //                             _gaox + boss_health_bar_margin + 2,
    //                             boss_health_bar_margin + 1,
    //                             _gaox + boss_health_bar_margin + 2 + flr(health_fraction * (_gaw - 2 * boss_health_bar_margin - 4)) - 1,
    //                             boss_health_bar_margin + 1,
    //                             _color_8_red
    //                         )
    //                     end
    //                 end
    //             end
  }
}
