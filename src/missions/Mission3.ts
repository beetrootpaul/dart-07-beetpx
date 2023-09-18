import { SolidColor, Timer, v_ } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { c, g, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementLine } from "../movement/MovementLine";
import { Mission } from "./Mission";

const aspr_ = AnimatedSprite.for(g.assets.mission3SpritesheetUrl);

const eb_ = EnemyBullet.factory(aspr_(4, 4, [124], 64), 2);

export class Mission3 implements Mission {
  readonly missionName: string = "(wip) phoslar mine";
  readonly bossName: string = "? ? ?";

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

  enemyPropertiesFor(enemyId: string): EnemyProperties {
    switch (enemyId) {
      case "m3e_stationary":
        return {
          health: 5,
          score: 1,
          powerupsDistribution: "h,m,f,t,s",
          spriteMain: aspr_(16, 16, [0], 64),
          spriteFlash: aspr_(10, 10, [16], 64),
          collisionCirclesProps: [{ r: 5 }],
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: this.scrollPerFrame,
          }),
          bulletFireTimer: new Timer({ frames: 40 }),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
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
          movementFactory: MovementFixed.of({}),
        },
      ],
    };
  }
}
