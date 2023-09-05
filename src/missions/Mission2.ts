import { SolidColor } from "@beetpx/beetpx";
import { c } from "../globals";
import { Mission } from "./Mission";

export class Mission2 implements Mission {
  readonly missionName: string = "(wip) outpost in space";

  readonly bgColor: SolidColor = c._1_darker_blue;
  readonly missionInfoColor: SolidColor = c._6_light_grey;

  readonly scrollPerFrame: number = 1;

  // TODO
  // local function maybe_add_star(y)
  //     if rnd() < .1 then
  //         local star = {
  //             x = ceil(1 + rnd(_gaw - 3)),
  //             y = y,
  //             speed = rnd { .25, .5, .75 }
  //         }
  //         star.color = star.speed == .75 and _color_6_light_grey or (star.speed == .5 and _color_13_lavender or _color_14_mauve)
  //         add(stars, star)
  //     end
  // end

  constructor() {
    // TODO
    // stars = {}
    //
    // TODO
    // for y = 0, _gah - 1 do
    //   maybe_add_star(y)
    // end
  }

  levelBgUpdate(): void {
    // TODO
    // for star in all(stars) do
    //     star.y = star.y + star.speed
    //     if star.y >= _gah then
    //         del(stars, star)
    //     end
    // end
    //
    // TODO
    // maybe_add_star(0)
  }

  levelBgDraw(): void {
    // TODO
    // for star in all(stars) do
    //     pset(
    //         _gaox + star.x,
    //         star.y,
    //         star.color
    //     )
    // end
  }
}

// TODO
//
// _m_boss_name = "cargo \-fguardian"
// _m_mission_main_music, _m_mission_boss_music = 0, 1
//
// do
//    local enemy_bullet_factory = new_enemy_bullet_factory {
//        bullet_sprite = new_static_sprite "4,4,124,64",
//        collision_circle_r = 1.5,
//    }
//
// -- enemy properties:
// --   - [1] = health
// --   - [2] = score
// --   - [3] = sprites_props_txt = "w,h,x,y|w,h,x,y" -- where 1st set is for a ship sprite, and 2nd – for a damage flash overlay
// --   - [4] = collision_circles_props = {
// --                    { r, optional_xy_offset }, -- put main/center circle first, since it will be source for explosions etc.
// --                    { r, optional_xy_offset },
// --                    { r },
// --                },
// --   - [5] = powerups_distribution
// --   - [6] = movement_factory
// --   - spawn_bullets = function(enemy_movement, player_collision_circle)
// --                       return bullets_table
// --                     end
// function _m_enemy_properties_for(enemy_map_marker)
//     return ({
//
//         -- enemy: stationary
//         [79] = {
//             5,
//             1,
//             "28,28,0,64|28,28,28,64",
//             {
//                 { 5 },
//             },
//             "h,m,f,t,s",
//             new_movement_line_factory {
//                 angle = .75,
//                 angled_speed = _m_scroll_per_frame,
//                 -- DEBUG:
//                 --frames = 89,
//             },
//             bullet_fire_timer = new_timer "40",
//             spawn_bullets = function(enemy_movement, player_collision_circle)
//                 _sfx_play(_sfx_enemy_multi_shoot)
//                 local bullets = {}
//                 for i = 1, 8 do
//                     add(bullets, enemy_bullet_factory(
//                         new_movement_line_factory {
//                             base_speed_y = enemy_movement.speed_xy.y,
//                             angle = .0625 + i / 8,
//                         }(enemy_movement.xy)
//                     ))
//                 end
//                 return bullets
//             end,
//         },
//
//     })[enemy_map_marker]
// end
//
// -- boss properties:
// --   - sprites_props_txt = "w,h,x,y|w,h,x,y" -- where 1st set is for a ship sprite, and 2nd – for a damage flash overlay
// --   - collision_circles_props = {
// --                    { r, optional_xy_offset }, -- put main/center circle first, since it will be source for explosions etc.
// --                    { r, optional_xy_offset },
// --                    { r },
// --                },
// --   - phases = {
// --       - [1] = triggering_health_fraction
// --       - [2] = score
// --       - [3] = bullet_fire_timer
// --       - [4] = spawn_bullets = function(boss_movement, player_collision_circle)
// --                                 return bullets_table
// --                               end
// --       - [5] = movement_factory
// --     }
// function _m_boss_properties()
//     return {
//         health = 25,
//         sprites_props_txt = "56,26,4,98|56,26,4,98",
//         collision_circles_props = {
//             { 15, _xy(0, -3) },
//         },
//         phases = {
//             -- phase 1:
//             {
//                 1,
//                 1,
//                 -- DEBUG:
//                 --32767,
//                 new_timer "80",
//                 function(enemy_movement, player_collision_circle)
//                     _sfx_play(_sfx_enemy_multi_shoot)
//                     return {
//                         enemy_bullet_factory(
//                             new_movement_line_factory {
//                                 base_speed_y = enemy_movement.speed_xy.y,
//                                 angle = .75,
//                                 angled_speed = .5,
//                             }(enemy_movement.xy.plus(0, 3))
//                         ),
//                     }
//                 end,
//                 new_movement_fixed_factory(),
//             },
//         },
//     }
// end
