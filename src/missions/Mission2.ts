import { BpxSolidColor, BpxVector2d, timer_, v_ } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { b, c, g, u } from "../globals";
import { Sprite } from "../misc/Sprite";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementLine } from "../movement/MovementLine";
import { Mission } from "./Mission";

const sspr_ = Sprite.for(g.assets.mission2SpritesheetUrl).static;

const eb_ = EnemyBullet.factory(sspr_(4, 4, 124, 64), 2);

export class Mission2 implements Mission {
  readonly missionName: string = "(wip) outpost in space";
  readonly bossName: string = "cargo guardian";

  readonly bgColor: BpxSolidColor = c._1_darker_blue;
  readonly missionInfoColor: BpxSolidColor = c._6_light_grey;

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

  private _stars: Array<{
    xy: BpxVector2d;
    color: BpxSolidColor;
    speed: number;
  }> = [];

  constructor() {
    for (let y = 0; y < g.gameAreaSize.y; y++) {
      this._maybeAddStar(y);
    }
  }

  private _maybeAddStar(y: number): void {
    if (Math.random() < 0.1) {
      const speed = u.randomElementOf([0.25, 0.5, 0.75])!;
      const star = {
        xy: v_(Math.ceil(1 + Math.random() * g.gameAreaSize.x - 3), y),
        speed: speed,
        color:
          speed >= 0.75
            ? c._6_light_grey
            : speed >= 0.5
            ? c._13_lavender
            : c._14_mauve,
      };
      this._stars.push(star);
    }
  }

  levelBgUpdate(): void {
    for (const star of this._stars) {
      star.xy = star.xy.add(0, star.speed);
    }

    this._stars = this._stars.filter((s) => s.xy.y <= g.gameAreaSize.y);

    this._maybeAddStar(0);
  }

  levelBgDraw(): void {
    for (const star of this._stars) {
      b.pixel(g.gameAreaOffset.add(star.xy), star.color);
    }
  }

  enemyPropertiesFor(enemyId: string): EnemyProperties {
    switch (enemyId) {
      case "m2e_stationary":
        return {
          health: 5,
          score: 1,
          spriteMain: sspr_(28, 28, 0, 64),
          spriteFlash: sspr_(28, 28, 28, 64),
          collisionCirclesProps: [{ r: 5 }],
          powerupsDistribution: "h,m,f,t,s",
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: this.scrollPerFrame,
          }),
          bulletFireTimer: timer_(40),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
            b.playSoundOnce(g.assets.sfxEnemyMultiShoot);
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
  // _m_mission_main_music = 0
  // SEQ:
  // loop:
  //   32
  //
  // _m_mission_boss_music = 1
  // SEQ:
  // loop:
  //   33

  bossProperties(): BossProperties {
    return {
      health: 25,
      spriteMain: sspr_(56, 26, 4, 98),
      spriteFlash: sspr_(56, 26, 4, 98),
      collisionCirclesProps: [{ r: 15, offset: v_(0, -3) }],
      phases: [
        // phase 1
        {
          triggeringHealthFraction: 1,
          score: 1,
          bulletFireTimer: timer_(80),
          spawnBullets: (bossMovement, playerCollisionCircle) => {
            b.playSoundOnce(g.assets.sfxEnemyMultiShoot);
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
