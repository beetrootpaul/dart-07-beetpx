import { SolidColor, Timer, v_ } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { c, g, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementLine } from "../movement/MovementLine";
import { Mission } from "./Mission";

const aspr_ = AnimatedSprite.for(g.assets.mission2SpritesheetUrl);

const eb_ = EnemyBullet.factory(aspr_(4, 4, [124], 64));
// TODO
//    local enemy_bullet_factory = new_enemy_bullet_factory {
//        bullet_sprite = new_static_sprite "4,4,124,64",
//        collision_circle_r = 1.5,
//    }

export class Mission2 implements Mission {
  readonly missionName: string = "(wip) outpost in space";
  readonly bossName: string = "cargo guardian";

  readonly bgColor: SolidColor = c._1_darker_blue;
  readonly missionInfoColor: SolidColor = c._6_light_grey;

  readonly scrollPerFrame: number = 1;

  readonly ldtk: {
    level: string;
    tilesetPng: string;
    landLayer: string;
    enemiesLayer: string;
    progressionMarkersLayer: string;
  } = {
    level: "mission_2",
    tilesetPng: g.assets.mission2SpritesheetUrl,
    landLayer: "m2_land",
    enemiesLayer: "m2_enemies",
    progressionMarkersLayer: "progression_markers",
  };

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

  enemyPropertiesFor(enemyId: string): EnemyProperties {
    switch (enemyId) {
      case "m2e_stationary":
        return {
          health: 5,
          score: 1,
          spriteMain: aspr_(28, 28, [0], 64),
          spriteFlash: aspr_(28, 28, [28], 64),
          collisionCirclesProps: [{ r: 5 }],
          powerupsDistribution: "h,m,f,t,s",
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
      // TODO: consider this left-right enemy type for mission 2
      // -- enemy: left-right
      // --[76] = {
      // --    movement_factory = new_movement_loop_factory({
      // --        new_movement_line_factory {
      // --            base_speed_y = .25,
      // --            frames = 160,
      // --            angle = 0,
      // --            angled_speed = .5,
      // --        },
      // --        new_movement_line_factory {
      // --            base_speed_y = .25,
      // --            frames = 160,
      // --            angle = .5,
      // --            angled_speed = .5,
      // --        },
      // --    }),
      // --},
      default:
        return u.throwError(`Unrecognized Enemy ID: "${enemyId}"`);
    }
  }

  // TODO
  // _m_mission_main_music, _m_mission_boss_music = 0, 1

  bossProperties(): BossProperties {
    return {
      health: 25,
      spriteMain: aspr_(56, 26, [4], 98),
      spriteFlash: aspr_(56, 26, [4], 98),
      collisionCirclesProps: [{ r: 15, offset: v_(0, -3) }],
      phases: [
        // phase 1
        {
          triggeringHealthFraction: 1,
          score: 1,
          movementFactory: MovementFixed.of({}),
          bulletFireTimer: new Timer({ frames: 80 }),
          spawnBullets: (bossMovement, playerCollisionCircle) => {
            // TODO
            // _sfx_play(_sfx_enemy_multi_shoot)
            return [
              eb_(
                MovementLine.of({
                  baseSpeedXy: v_(0, bossMovement.speed.y),
                  angle: 0.25,
                  angledSpeed: 0.5,
                })(bossMovement.xy.add(0, 3))
              ),
            ];
          },
        },
      ],
    };
  }
}
