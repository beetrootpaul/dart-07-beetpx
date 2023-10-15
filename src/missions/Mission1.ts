import {
  b_,
  BpxEasing,
  BpxSolidColor,
  BpxSoundSequence,
  timer_,
  u_,
  v_,
} from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyBullet } from "../game/EnemyBullet";
import { EnemyProperties } from "../game/EnemyProperties";
import { c, g } from "../globals";
import { Sprite } from "../misc/Sprite";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementLine } from "../movement/MovementLine";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementSinusoidal } from "../movement/MovementSinusoidal";
import { MovementToTarget } from "../movement/MovementToTarget";
import { Mission } from "./Mission";

const aspr_ = Sprite.for(g.assets.mission1SpritesheetUrl).animated;
const sspr_ = Sprite.for(g.assets.mission1SpritesheetUrl).static;

const eb_ = EnemyBullet.factory(sspr_(4, 4, 124, 64), 2);

function t(): number {
  return b_.frameNumber / g.fps;
}

export class Mission1 implements Mission {
  readonly missionName: string = "emerald islands";
  readonly bossName: string = "sentinel zx300";

  readonly bgColor: BpxSolidColor = c.trueBlue;
  readonly missionInfoColor: BpxSolidColor = c.darkOrange;

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

  private readonly _waveTile: Sprite = aspr_(
    8,
    8,
    [
      // TODO: replace with u_.repeatN which returns an array instead of consuming a callback
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

  get audioSequenceMain(): BpxSoundSequence {
    return {
      sequence: [
        [{ url: g.assets.mission1Music43 }, { url: g.assets.mission1Music48 }],
        [{ url: g.assets.mission1Music40 }, { url: g.assets.mission1Music49 }],
        [{ url: g.assets.mission1Music40 }, { url: g.assets.mission1Music49 }],
        [{ url: g.assets.mission1Music40 }, { url: g.assets.mission1Music50 }],
      ],
      sequenceLooped: [
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music41 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music41 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music50 },
          { url: g.assets.mission1Music42 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music41 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music41 },
          { url: g.assets.mission1Music51 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music41 },
          { url: g.assets.mission1Music51 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music50 },
          { url: g.assets.mission1Music42 },
          { url: g.assets.mission1Music52 },
        ],
        [
          { url: g.assets.mission1Music40 },
          { url: g.assets.mission1Music49 },
          { url: g.assets.mission1Music51 },
        ],
      ],
    };
  }

  get audioSequenceBoss(): BpxSoundSequence {
    return {
      sequence: [[{ url: g.assets.mission1Music44 }]],
      sequenceLooped: [
        [{ url: g.assets.mission1Music45 }, { url: g.assets.mission1Music53 }],
        [{ url: g.assets.mission1Music45 }, { url: g.assets.mission1Music54 }],
        [{ url: g.assets.mission1Music45 }, { url: g.assets.mission1Music55 }],
        [{ url: g.assets.mission1Music45 }, { url: g.assets.mission1Music56 }],
      ],
    };
  }

  enemyPropertiesFor(enemyId: string): EnemyProperties {
    switch (enemyId) {
      case "m1e_fast_and_small":
        return {
          health: 1,
          score: 2,
          powerupsDistribution:
            "-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,h,m,m,f,f,t,s",
          spriteMain: sspr_(8, 8, 0, 88),
          spriteFlash: sspr_(6, 6, 22, 79),
          collisionCirclesProps: [{ r: 3, offset: v_(0, 1) }],
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: 1.5,
          }),
        };
      case "m1e_sinusoidal":
        return {
          health: 2,
          score: 5,
          powerupsDistribution:
            "-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,h,m,m,m,f,f,t,t,s",
          spriteMain: sspr_(10, 10, 22, 86),
          spriteFlash: sspr_(8, 8, 13, 88),
          collisionCirclesProps: [{ r: 4 }],
          movementFactory: MovementSinusoidal.of({
            speedY: 0.75,
            ageDivisor: 120,
            magnitude: 14,
          }),
          bulletFireTimer: timer_(40),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxEnemyShoot);
            return [
              eb_(
                MovementLine.of({
                  baseSpeedXy: v_(0, enemyMovement.speed.y),
                  angle: 0.25,
                  angledSpeed: 1,
                })(enemyMovement.xy)
              ),
            ];
          },
        };
      case "m1e_wait_and_charge":
        return {
          health: 7,
          score: 20,
          powerupsDistribution: "-,-,-,-,-,-,-,-,-,-,h,h,m,f,t,s,s",
          spriteMain: sspr_(16, 14, 22, 64),
          spriteFlash: sspr_(14, 12, 32, 84),
          collisionCirclesProps: [{ r: 7 }],
          movementFactory: MovementSequence.of([
            MovementLine.of({
              frames: 80,
              angle: 0.25,
              angledSpeed: 0.5,
            }),
            MovementLine.of({
              angle: 0.25,
              angledSpeed: 1,
            }),
          ]),
        };
      case "m1e_big":
        return {
          health: 40,
          score: 100,
          powerupsDistribution: "h,s",
          spriteMain: sspr_(24, 20, 64, 64),
          spriteFlash: sspr_(22, 18, 88, 65),
          collisionCirclesProps: [
            { r: 10, offset: v_(0, 1) },
            { r: 5, offset: v_(-7, 0) },
            { r: 5, offset: v_(7, 0) },
            { r: 5, offset: v_(0, -4) },
          ],
          movementFactory: MovementSequence.of([
            MovementToTarget.of({
              targetY: 32,
              frames: 120,
              easingFn: BpxEasing.outQuartic,
            }),
            MovementFixed.of({
              frames: 480,
            }),
            MovementToTarget.of({
              targetY: 140,
              frames: 120,
              easingFn: BpxEasing.inQuartic,
            }),
          ]),
          bulletFireTimer: timer_(33),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxEnemyMultiShoot);
            const bullets: EnemyBullet[] = [];
            for (let i = 1; i <= 8; i++) {
              bullets.push(
                eb_(
                  MovementLine.of({
                    baseSpeedXy: enemyMovement.speed,
                    angle: (t() % 1) + i / 8,
                    angledSpeed: 1,
                  })(enemyMovement.xy)
                )
              );
            }
            return bullets;
          },
        };
      case "m1e_aimed_triple_shot":
        return {
          health: 4,
          score: 40,
          powerupsDistribution: "-,-,-,-,-,-,h,m,m,f,f,f,t,t,s",
          spriteMain: sspr_(8, 22, 50, 64),
          spriteFlash: sspr_(6, 20, 58, 65),
          collisionCirclesProps: [
            { r: 4 },
            { r: 4, offset: v_(0, 7) },
            { r: 4, offset: v_(0, -7) },
          ],
          movementFactory: MovementSequence.of([
            MovementToTarget.of({
              targetY: 80,
              frames: 150,
              easingFn: BpxEasing.outQuadratic,
            }),
            MovementToTarget.of({
              targetY: 30,
              frames: 80,
            }),
            MovementToTarget.of({
              targetY: 180,
              frames: 150,
              easingFn: BpxEasing.inQuadratic,
            }),
          ]),
          bulletFireTimer: timer_(60),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxEnemyShoot);
            const enemyXy = enemyMovement.xy;
            const playerXy = playerCollisionCircle.center;
            return [
              eb_(
                MovementLine.of({
                  targetXy: playerXy,
                  angledSpeed: 1,
                })(enemyXy.sub(0, 7))
              ),
              eb_(
                MovementLine.of({
                  targetXy: playerXy,
                  angledSpeed: 1,
                })(enemyXy.sub(0, 1))
              ),
              eb_(
                MovementLine.of({
                  targetXy: playerXy,
                  angledSpeed: 1,
                })(enemyXy.add(0, 5))
              ),
            ];
          },
        };
      case "m1e_stationary":
        return {
          health: 10,
          score: 50,
          powerupsDistribution: "-,-,-,h,h,m,f,t,t,s,s,s",
          spriteMain: sspr_(22, 24, 0, 64),
          spriteFlash: sspr_(12, 12, 38, 64),
          collisionCirclesProps: [{ r: 6 }],
          movementFactory: MovementLine.of({
            angle: 0.25,
            angledSpeed: this.scrollPerFrame,
          }),
          bulletFireTimer: timer_(60),
          spawnBullets: (enemyMovement, playerCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxEnemyMultiShoot);
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
        return u_.throwError(`Unrecognized Enemy ID: "${enemyId}"`);
    }
  }

  bossProperties(): BossProperties {
    return {
      health: 130,
      spriteMain: sspr_(54, 20, 0, 96),
      spriteFlash: sspr_(52, 18, 54, 97),
      collisionCirclesProps: [
        { r: 11 },
        { r: 6, offset: v_(20, -3) },
        { r: 6, offset: v_(-20, -3) },
      ],
      phases: [
        // phase 1
        {
          triggeringHealthFraction: 1,
          score: 50,
          bulletFireTimer: timer_(8),
          spawnBullets: (bossMovement, playerCollisionCircle) => {
            if (t() % 2 < 1) return [];

            b_.playSoundOnce(g.assets.sfxEnemyShoot);

            return [
              eb_(
                MovementLine.of({
                  angle: 0.25,
                  angledSpeed: 1.5,
                })(bossMovement.xy.add(0, 3))
              ),
            ];
          },
          movementFactory: MovementFixed.of({}),
        },
        // phase 2
        {
          triggeringHealthFraction: 0.8,
          score: 300,
          bulletFireTimer: timer_(28),
          spawnBullets: (bossMovement, playerCollisionCircle) => {
            const bullets: EnemyBullet[] = [];
            if (t() > 0.6) {
              b_.playSoundOnce(g.assets.sfxEnemyMultiShoot);
              for (let i = 1; i <= 8; i++) {
                bullets.push(
                  eb_(
                    MovementLine.of({
                      baseSpeedXy: v_(0, bossMovement.speed.y),
                      angle: (t() % 1) + i / 8,
                      angledSpeed: 1,
                    })(bossMovement.xy)
                  )
                );
              }
            }
            return bullets;
          },
          movementFactory: MovementSequence.of([
            MovementToTarget.of({
              targetX: 30,
              frames: 40,
              easingFn: BpxEasing.outQuadratic,
            }),
            MovementSequence.loopedOf([
              MovementToTarget.of({
                targetX: g.gameAreaSize.x - 30,
                frames: 80,
                easingFn: BpxEasing.outQuadratic,
              }),
              MovementToTarget.of({
                targetX: 30,
                frames: 80,
                easingFn: BpxEasing.outQuadratic,
              }),
            ]),
          ]),
        },
        // phase 3
        {
          triggeringHealthFraction: 0.4,
          score: 650,
          bulletFireTimer: timer_(8),
          spawnBullets: (bossMovement, playerCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxEnemyShoot);
            if (t() % 2 > 1.5) {
              // side bullets
              return [
                eb_(
                  MovementLine.of({
                    angle: 0.25,
                    angledSpeed: 1.5,
                  })(bossMovement.xy.add(-20, -3))
                ),
                eb_(
                  MovementLine.of({
                    angle: 0.25,
                    angledSpeed: 1.5,
                  })(bossMovement.xy.add(20, -3))
                ),
              ];
            }

            if (t() % 2 < 0.9) {
              // sinusoidal central bullets
              return [
                eb_(
                  MovementSinusoidal.of({
                    speedY: 1.5,
                    ageDivisor: 60,
                    magnitude: 9,
                  })(bossMovement.xy.add(0, 3))
                ),
              ];
            }

            return [];
          },
          movementFactory: MovementSequence.loopedOf([
            // center it
            MovementToTarget.of({
              targetX: g.gameAreaSize.x / 2,
              targetY: 20,
              frames: 60,
              easingFn: BpxEasing.outQuadratic,
            }),
            // wait …
            MovementFixed.of({
              frames: 30,
            }),
            // … and charge!
            MovementToTarget.of({
              targetY: g.gameAreaSize.y - 20,
              frames: 40,
              easingFn: BpxEasing.inQuadratic,
            }),
            // then revert
            MovementToTarget.of({
              targetY: 20,
              frames: 120,
              easingFn: BpxEasing.linear,
            }),
            // go left and right
            MovementToTarget.of({
              targetX: g.gameAreaSize.x - 30,
              frames: 80,
              easingFn: BpxEasing.outQuadratic,
            }),
            MovementToTarget.of({
              targetX: 30,
              frames: 80,
              easingFn: BpxEasing.outQuadratic,
            }),
          ]),
        },
      ],
    };
  }
}
