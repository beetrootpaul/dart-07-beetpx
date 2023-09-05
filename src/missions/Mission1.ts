import { SolidColor, Timer, v_ } from "@beetpx/beetpx";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { c, g, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";
import { Mission } from "./Mission";

const aspr_ = AnimatedSprite.for(g.assets.mission1SpritesheetUrl);

const eb_ = EnemyBullet.factory(aspr_(4, 4, [124], 64));

export class Mission1 implements Mission {
  readonly missionName: string = "emerald islands";

  readonly bgColor: SolidColor = c._4_true_blue;
  readonly missionInfoColor: SolidColor = c._9_dark_orange;

  readonly scrollPerFrame: number = 0.5;

  readonly ldtk: {
    level: string;
    tilesetPng: string;
    landLayer: string;
    enemiesLayer: string;
    progressionMarkersLayer: string;
  } = {
    level: "mission_1",
    tilesetPng: g.assets.mission1SpritesheetUrl,
    landLayer: "m1_land",
    enemiesLayer: "m1_enemies",
    progressionMarkersLayer: "progression_markers",
  };

  private readonly _waveTile: AnimatedSprite = aspr_(
    8,
    8,
    [
      ...Array.from({ length: 24 }, () => 24),
      ...Array.from({ length: 24 }, () => 32),
      ...Array.from({ length: 24 }, () => 40),
      ...Array.from({ length: 24 }, () => 48),
    ],
    56,
    true
  );

  private _waveTileOffsetY: number = 0;

  levelBgUpdate(): void {
    this._waveTileOffsetY =
      (this._waveTileOffsetY + this.scrollPerFrame) % g.tileSize.y;
    this._waveTile.update();
  }

  levelBgDraw(): void {
    for (let distance = 0; distance <= 16; distance++) {
      for (let lane = 1; lane <= 12; lane++) {
        this._waveTile.draw(
          v_(
            (lane - 1) * g.tileSize.x,
            Math.ceil((distance - 1) * g.tileSize.y + this._waveTileOffsetY)
          )
        );
      }
    }
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
      case "m1e_fast_and_small":
        return {
          // TODO:
          //             -- enemy: fast and small
          //             [74] = {
          //                 1,
          //                 2,
          // TODO
          //                 "8,8,0,88|6,6,22,79",
          spriteMain: aspr_(8, 8, [0], 88),
          // TODO
          //                 {
          //                     { 3, _xy(0, 1) },
          //                 },
          //                 "-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,h,m,m,f,f,t,s",
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
        };
      case "m1e_sinusoidal":
        return {
          // TODO
          //             [75] = {
          //                 2,
          //                 5,
          // TODO
          //                 "10,10,22,86|8,8,13,88",
          spriteMain: aspr_(10, 10, [22], 86),
          // Taspr_/                 {
          //                 },
          //                 "-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,h,m,m,m,f,f,t,t,s",
          // TODO: TMP
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
          //                 new_movement_sinusoidal_factory {
          //                     speed_y = .75,
          //                     age_divisor = 120,
          //                     magnitude = 14,
          //                 },
          // TODO
          //                 bullet_fire_timer = new_timer "40",
          //                 spawn_bullets = function(enemy_movement)
          //                     _sfx_play(_sfx_enemy_shoot)
          //                     return {
          //                         enemy_bullet_factory(
          //                             new_movement_line_factory({
          //                                 base_speed_y = enemy_movement.speed_xy.y,
          //                                 angle = .75,
          //                             })(enemy_movement.xy)
          //                         )
          //                     }
          //                 end,
          //             },
        };
      case "m1e_wait_and_charge":
        return {
          // TODO
          //             [76] = {
          //                 7,
          //                 20,
          // TODO
          //                 "16,14,22,64|14,12,32,84",
          spriteMain: aspr_(16, 14, [22], 64),
          // Taspr_/
          //                     { 7 },
          //                 },
          //                 "-,-,-,-,-,-,-,-,-,-,h,h,m,f,t,s,s",
          // TODO: TMP
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
          //                 new_movement_sequence_factory {
          //                     new_movement_line_factory {
          //                         frames = 80,
          //                         angle = .75,
          //                         angled_speed = .5,
          //                     },
          //                     new_movement_line_factory {
          //                         angle = .75,
          //                     },
          //                 },
          //             },
        };
      case "m1e_big":
        return {
          // TODO
          //             [77] = {
          //                 40,
          //                 100,
          // TODO
          //                 "24,20,64,64|22,18,88,65",
          spriteMain: aspr_(24, 20, [64], 64),
          // TODO
          //                 {
          //                     { 10, _xy(0, 1) },
          //                     { 5, _xy(-7, 0) },
          //                     { 5, _xy(7, 0) },
          //                     { 5, _xy(0, -4) },
          //                 },
          //                 "h,s",
          // TODO: TMP
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
          //                 new_movement_sequence_factory {
          //                     new_movement_to_target_factory {
          //                         target_y = 32,
          //                         frames = 120,
          //                         easing_fn = _easing_easeoutquart,
          //                     },
          //                     new_movement_fixed_factory {
          //                         target_y = 32,
          //                         frames = 480,
          //                     },
          //                     new_movement_to_target_factory {
          //                         target_y = 140,
          //                         frames = 120,
          //                         easing_fn = _easing_easeinquart,
          //                     },
          //                 },
          // TODO
          //                 bullet_fire_timer = new_timer "33",
          //                 spawn_bullets = function(enemy_movement)
          //                     _sfx_play(_sfx_enemy_multi_shoot)
          //                     local bullets = {}
          //                     for i = 1, 8 do
          //                         add(bullets, enemy_bullet_factory(
          //                             new_movement_line_factory {
          //                                 base_speed_y = enemy_movement.speed_xy.y,
          //                                 angle = t() % 1 + i / 8,
          //                             }(enemy_movement.xy)
          //                         ))
          //                     end
          //                     return bullets
          //                 end,
          //             },
        };
      case "m1e_aimed_triple_shot":
        return {
          // TODO
          //             [78] = {
          //                 4,
          //                 40,
          // TODO
          //                 "8,22,50,64|6,20,58,65",
          spriteMain: aspr_(8, 22, [50], 64),
          // TODO
          //                 {
          //                     { 4 },
          //                     { 4, _xy(0, 7) },
          //                     { 4, _xy(0, -7) },
          //                 },
          //                 "-,-,-,-,-,-,h,m,m,f,f,f,t,t,s",
          // TODO: TMP
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
          //                 new_movement_sequence_factory({
          //                     new_movement_to_target_factory {
          //                         target_y = 80,
          //                         frames = 150,
          //                         easing_fn = _easing_easeoutquad,
          //                     },
          //                     new_movement_to_target_factory {
          //                         target_y = 30,
          //                         frames = 80,
          //                     },
          //                     new_movement_to_target_factory {
          //                         target_y = 160,
          //                         frames = 150,
          //                         easing_fn = _easing_easeinquad,
          //                     },
          //                 }),
          // TODO
          //                 bullet_fire_timer = new_timer "60",
          //                 spawn_bullets = function(enemy_movement, player_collision_circle)
          //                     _sfx_play(_sfx_enemy_shoot)
          //                     local enemy_xy = enemy_movement.xy
          //                     local player_xy = player_collision_circle.xy
          //                     return {
          //                         enemy_bullet_factory(
          //                             new_movement_line_factory {
          //                                 target_xy = player_xy,
          //                             }(enemy_xy.minus(0, 7))
          //                         ),
          //                         enemy_bullet_factory(
          //                             new_movement_line_factory {
          //                                 target_xy = player_xy,
          //                             }(enemy_xy.minus(0, 1))
          //                         ),
          //                         enemy_bullet_factory(
          //                             new_movement_line_factory {
          //                                 target_xy = player_xy,
          //                             }(enemy_xy.plus(0, 5))
          //                         ),
          //                     }
          //                 end,
          //             },
        };
      case "m1e_stationary":
        return {
          // TODO
          //             [79] = {
          //                 10,
          //                 50,
          // TODO
          //                 "22,24,0,64|12,12,38,64",
          spriteMain: aspr_(22, 24, [0], 64),
          // TODO
          //                 {
          //                     { 6 },
          //                 },
          //                 "-,-,-,h,h,m,f,t,t,s,s,s",
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: this.scrollPerFrame,
          }),
          bulletFireTimer: new Timer({ frames: 60 }),
          spawnBullets: (enemyMovement: Movement) => {
            // TODO
            //                     _sfx_play(_sfx_enemy_multi_shoot)
            const bullets: EnemyBullet[] = [];
            for (let i = 1; i <= 8; i++) {
              bullets.push(
                eb_(
                  MovementLine.of({
                    baseSpeedXy: enemyMovement.speed,
                    angle: 1 / 16 + i / 8,
                    angledSpeed: 1,
                  })(enemyMovement.xy)
                )
              );
            }
            return bullets;
          },
        };
      default:
        return u.throwError(`Unrecognized Enemy ID: "${enemyId}"`);
    }
  }
}

// TODO
//
// _m_boss_name = "sentinel \-fzx300"
// _m_mission_main_music, _m_mission_boss_music = 0, 13
//
// do
//     local enemy_bullet_factory = new_enemy_bullet_factory {
//         bullet_sprite = new_static_sprite "4,4,124,64",
//         collision_circle_r = 1.5,
//     }
//
//     local function t_mod_2()
//         return t() % 2
//     end
//
//     -- boss properties:
//     --   - sprites_props_txt = "w,h,x,y|w,h,x,y" -- where 1st set is for a ship sprite, and 2nd – for a damage flash overlay
//     --   - collision_circles_props = {
//     --                    { r, optional_xy_offset }, -- put main/center circle first, since it will be source for explosions etc.
//     --                    { r, optional_xy_offset },
//     --                    { r },
//     --                },
//     --   - phases = {
//     --       - [1] = triggering_health_fraction
//     --       - [2] = score
//     --       - [3] = bullet_fire_timer
//     --       - [4] = spawn_bullets = function(boss_movement, player_collision_circle)
//     --                                 return bullets_table
//     --                               end
//     --       - [5] = movement_factory
//     --     }
//     function _m_boss_properties()
//         return {
//             health = 130,
//             sprites_props_txt = "54,20,0,96|52,18,54,97",
//             collision_circles_props = {
//                 { 11 },
//                 { 6, _xy(20, -3) },
//                 { 6, _xy(-20, -3) },
//             },
//             phases = {
//                 -- phase 1:
//                 {
//                     1,
//                     50,
//                     new_timer "8",
//                     function(boss_movement)
//                         if t_mod_2() < 1 then return {} end
//                         _sfx_play(_sfx_enemy_shoot)
//                         return {
//                             enemy_bullet_factory(
//                                 new_movement_line_factory {
//                                     angle = .75,
//                                     angled_speed = 1.5,
//                                 }(boss_movement.xy.plus(0, 3))
//                             ),
//                         }
//                     end,
//                     new_movement_fixed_factory(),
//                 },
//                 -- phase 2:
//                 {
//                     .8,
//                     300,
//                     new_timer "28",
//                     function(enemy_movement)
//                         local bullets = {}
//                         if t_mod_2() > .6 then
//                             _sfx_play(_sfx_enemy_multi_shoot)
//                             for i = 1, 8 do
//                                 add(bullets, enemy_bullet_factory(
//                                     new_movement_line_factory {
//                                         base_speed_y = enemy_movement.speed_xy.y,
//                                         angle = t() % 1 + i / 8,
//                                     }(enemy_movement.xy)
//                                 ))
//                             end
//                         end
//                         return bullets
//                     end,
//                     new_movement_sequence_factory {
//                         new_movement_to_target_factory {
//                             target_x = 30,
//                             frames = 40,
//                             easing_fn = _easing_easeoutquad,
//                         },
//                         new_movement_loop_factory {
//                             new_movement_to_target_factory {
//                                 target_x = _gaw - 30,
//                                 frames = 80,
//                                 easing_fn = _easing_easeoutquad,
//                             },
//                             new_movement_to_target_factory {
//                                 target_x = 30,
//                                 frames = 80,
//                                 easing_fn = _easing_easeoutquad,
//                             },
//                         },
//                     },
//                 },
//                 -- phase 3:
//                 {
//                     .4,
//                     650,
//                     new_timer "8",
//                     function(boss_movement)
//                         _sfx_play(_sfx_enemy_shoot)
//                         if t_mod_2() > 1.5 then
//                             -- side bullets
//                             return {
//                                 enemy_bullet_factory(
//                                     new_movement_line_factory {
//                                         angle = .75,
//                                         angled_speed = 1.5,
//                                     }(boss_movement.xy.plus(-20, -3))
//                                 ),
//                                 enemy_bullet_factory(
//                                     new_movement_line_factory {
//                                         angle = .75,
//                                         angled_speed = 1.5,
//                                     }(boss_movement.xy.plus(20, -3))
//                                 ),
//                             }
//                         elseif t_mod_2() < .9 then
//                             -- sinusoidal central bullets
//                             return {
//                                 enemy_bullet_factory(
//                                     new_movement_sinusoidal_factory {
//                                         speed_y = 1.5,
//                                         age_divisor = 60,
//                                         magnitude = 9,
//                                     }(boss_movement.xy.plus(0, 3))
//                                 ),
//                             }
//                         end
//                     end,
//                     new_movement_loop_factory {
//                         -- center it
//                         new_movement_to_target_factory {
//                             target_x = _gawdb2,
//                             target_y = 20,
//                             frames = 60,
//                             easing_fn = _easing_easeoutquad,
//                         },
//                         -- wait …
//                         new_movement_fixed_factory {
//                             frames = 30,
//                         },
//                         -- … and charge!
//                         new_movement_to_target_factory {
//                             target_y = _gah - 20,
//                             frames = 40,
//                             easing_fn = _easing_easeinquad,
//                         },
//                         -- then revert
//                         new_movement_to_target_factory {
//                             target_y = 20,
//                             frames = 120,
//                             easing_fn = _easing_linear,
//                         },
//                         -- go left and right
//                         new_movement_to_target_factory {
//                             target_x = _gaw - 30,
//                             frames = 80,
//                             easing_fn = _easing_easeoutquad,
//                         },
//                         new_movement_to_target_factory {
//                             target_x = 30,
//                             frames = 80,
//                             easing_fn = _easing_easeoutquad,
//                         },
//                     },
//                 }
//             },
//         }
//     end
//
// end
