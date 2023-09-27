import { SolidColor, Timer, v_, Vector2d } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { b, c, g, u } from "../globals";
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

  private readonly _tubeTiles: AnimatedSprite[] = [
    aspr_(8, 8, [56], 32, true),
    aspr_(8, 8, [64], 32, true),
    aspr_(8, 8, [56], 40, true),
    aspr_(8, 8, [64], 40, true),
    aspr_(8, 8, [48], 56, true),
    aspr_(8, 8, [48], 56, true),
    aspr_(8, 8, [48], 56, true),
    aspr_(8, 8, [48], 56, true),
    aspr_(8, 8, [56], 48, true),
    aspr_(8, 8, [64], 48, true),
    aspr_(8, 8, [56], 56, true),
    aspr_(8, 8, [64], 56, true),
  ];
  private _tubeTilesOffsetY: number = 0;

  private _particles: Array<{
    xy: Vector2d;
    sprite: AnimatedSprite;
  }> = [];
  private _particleStepCounter: number = 0;

  constructor() {
    for (let y = 0; y < g.gameAreaSize.y; y += g.tileSize.y) {
      this._maybeAddParticle(y);
    }
  }

  private _maybeAddParticle(y: number): void {
    if (Math.random() < 0.4) {
      // TODO: introduce a BeetPx util to pick a random array element
      const whxy = [
        // particle 1
        [3, 4, 24, 56],
        [3, 4, 24, 56],
        // particle 2
        [4, 3, 28, 56],
        [4, 3, 28, 56],
        // particle 3
        [3, 3, 33, 56],
        [3, 3, 33, 56],
        // particle 4
        [3, 3, 24, 61],
        [3, 3, 24, 61],
        // particle 5
        [5, 4, 28, 60],
        // particle 6
        [4, 4, 34, 60],
      ][Math.floor(Math.random() * 10)]!;
      const particle = {
        xy: v_(Math.floor(4 + Math.random() * g.gameAreaSize.x - 2 * 4), y),
        sprite: aspr_(whxy[0]!, whxy[1]!, [whxy[2]!], whxy[3]!),
      };
      this._particles.push(particle);
    }
  }

  levelBgUpdate(): void {
    this._particles = this._particles.filter(
      (p) => p.xy.y <= g.gameAreaSize.y + g.tileSize.y
    );

    for (const particle of this._particles) {
      particle.xy = particle.xy.add(0, 1.5);
    }

    this._particleStepCounter = (this._particleStepCounter + 1) % 8;
    if (this._particleStepCounter === 0) {
      this._maybeAddParticle(-g.tileSize.y);
    }

    this._tubeTilesOffsetY = (this._tubeTilesOffsetY + 0.5) % g.tileSize.y;
  }

  levelBgDraw(): void {
    for (let lane = 1; lane <= 12; lane++) {
      for (let distance = 0; distance <= 16; distance++) {
        this._tubeTiles[lane - 1]?.draw(
          g.tileSize.mul(lane - 1, distance - 1).add(0, this._tubeTilesOffsetY)
        );
      }
    }

    for (const particle of this._particles) {
      particle.sprite.draw(particle.xy);
    }
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
