import { SolidColor } from "@beetpx/beetpx";
import { EnemyProperties } from "../game/EnemyProperties";
import { c, g, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { MovementLine } from "../movement/MovementLine";
import { Mission } from "./Mission";

const aspr_ = AnimatedSprite.for(g.assets.mission3SpritesheetUrl);

export class Mission3 implements Mission {
  readonly missionName: string = "(wip) phoslar mine";

  readonly bgColor: SolidColor = c._2_darker_purple;
  readonly missionInfoColor: SolidColor = c._3_dark_green;

  readonly scrollPerFrame: number = 1;

  readonly ldtk: {
    level: string;
    tilesetPng: string;
    landLayer: string;
    enemiesLayer: string;
    progressionMarkersLayer: string;
  } = {
    level: "mission_3",
    tilesetPng: g.assets.mission3SpritesheetUrl,
    landLayer: "m3_land",
    enemiesLayer: "m3_enemies",
    progressionMarkersLayer: "progression_markers",
  };

  // TODO
  // local tube_tiles = split "71,72,87,88,118,118,118,118,103,104,119,120"
  // local tube_tiles_offset_y
  // local particles
  // local particle_step_counter

  constructor() {
    // TODO
    // tube_tiles_offset_y = 0
    // particles = {}
    // particle_step_counter = 0
    //
    // TODO
    // for y = 0, _gah - 1, _ts do
    //     maybe_add_particle(y)
    // end
  }

  // TODO
  // local function maybe_add_particle(y)
  //     if rnd() < .4 then
  //         local props_whxy = rnd {
  //             -- particle 1
  //             "3,4,24,56",
  //             "3,4,24,56",
  //             -- particle 2
  //             "4,3,28,56",
  //             "4,3,28,56",
  //             -- particle 3
  //             "3,3,33,56",
  //             "3,3,33,56",
  //             -- particle 4
  //             "3,3,24,61",
  //             "3,3,24,61",
  //             -- particle 5
  //             "5,4,28,60",
  //             -- particle 6
  //             "4,4,34,60",
  //         }
  //         add(particles, {
  //             xy = _xy(
  //                 flr(4 + rnd(_gaw - 2 * 4)),
  //                 y
  //             ),
  //             sprite = new_static_sprite(props_whxy)
  //         })
  //     end
  // end

  levelBgUpdate(): void {
    // TODO
    // for particle in all(particles) do
    //     if particle.xy.y >= _gah + _ts then
    //         del(particles, particle)
    //     end
    // end
    //
    // TODO
    // tube_tiles_offset_y = (tube_tiles_offset_y + .5) % _ts
    //
    // TODO
    // for particle in all(particles) do
    //     particle.xy = particle.xy.plus(0, 1.5)
    // end
    //
    // TODO
    // particle_step_counter = (particle_step_counter + 1) % 8
    // if particle_step_counter == 0 then
    //     maybe_add_particle(-_ts)
    // end
  }

  levelBgDraw(): void {
    // TODO
    // palt(_color_0_black, false)
    // palt(_color_11_transparent, true)
    // for lane = 1, 12 do
    //     local tube_tile = tube_tiles[lane]
    //     for distance = 0, 16 do
    //         spr(
    //             tube_tile,
    //             _gaox + (lane - 1) * _ts,
    //             ceil((distance - 1) * _ts + tube_tiles_offset_y)
    //         )
    //     end
    // end
    // palt()
    //
    // TODO
    // for particle in all(particles) do
    //     particle.sprite._draw(particle.xy)
    // end
  }

  // TODO
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
  enemyPropertiesFor(enemyId: string): EnemyProperties {
    switch (enemyId) {
      case "m3e_stationary":
        return {
          // TODO
          //         [79] = {
          //             5,
          //             1,
          // TODO
          //             "16,16,0,64|10,10,16,64",
          spriteMain: aspr_(16, 16, [0], 64),
          // TODO
          //             {
          //                 { 5 },
          //             },
          //             "h,m,f,t,s",
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: this.scrollPerFrame,
          }),
          // TODO
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
        };
      default:
        return u.throwError(`Unrecognized Enemy ID: "${enemyId}"`);
    }
  }
}

// TODO
//
// _m_boss_name = "? \-f? \-f?"
// _m_mission_main_music, _m_mission_boss_music = 0, 1
//
// local enemy_bullet_factory = new_enemy_bullet_factory {
//     bullet_sprite = new_static_sprite "4,4,124,64",
//     collision_circle_r = 1.5,
// }
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
//
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
