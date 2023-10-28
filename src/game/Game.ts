import { b_, BpxTimer, BpxVector2d, timer_, v_ } from "@beetpx/beetpx";
import { Collisions } from "../collisions/Collisions";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { Boss } from "./Boss";
import { Enemy } from "./Enemy";
import { EnemyBullet } from "./EnemyBullet";
import { Explosion } from "./Explosion";
import { Float } from "./Float";
import { Level } from "./Level";
import { LevelDescriptor } from "./LevelDescriptor";
import { Player } from "./Player";
import { PlayerBullet } from "./PlayerBullet";
import { Powerup, PowerupType } from "./Powerup";
import { Score } from "./Score";
import { Shockwave } from "./Shockwave";

export class Game {
  private _health: number;
  get health(): number {
    return this._health;
  }

  private _shockwaveCharges: number;
  get shockwaveCharges(): number {
    return this._shockwaveCharges;
  }

  private _fastMovement: boolean;
  get fastMovement(): boolean {
    return this._fastMovement;
  }

  private _fastShoot: boolean;
  get fastShoot(): boolean {
    return this._fastShoot;
  }

  private _tripleShoot: boolean;
  get tripleShoot(): boolean {
    return this._tripleShoot;
  }

  private readonly _level: Level;

  private _player: Player | null;
  private _enemies: Enemy[] = [];
  private _boss: Boss | null = null;

  private _playerBullets: PlayerBullet[] = [];
  private _enemyBullets: EnemyBullet[] = [];
  private _shockwaves: Shockwave[] = [];

  private readonly _shockwaveEnemyHits: { [combinedId: string]: number } = {};

  private _explosions: Explosion[] = [];

  private _floats: Float[] = [];

  private _powerups: Powerup[] = [];

  readonly score: Score;

  private _cameraShakeTimer: BpxTimer = timer_(0);

  constructor(params: {
    health: number;
    shockwaveCharges: number;
    fastMovement: boolean;
    fastShoot: boolean;
    tripleShoot: boolean;
    score: number;
  }) {
    this._health = params.health;
    this.score = new Score(params.score);
    this._shockwaveCharges = params.shockwaveCharges;
    this._fastMovement = params.fastMovement;
    this._fastShoot = params.fastShoot;
    this._tripleShoot = params.tripleShoot;

    this._level = new Level(
      new LevelDescriptor(b_.getJsonAsset(g.assets.levelsJson).json)
    );

    this._player = new Player({
      onBulletsSpawned: (bullets) => {
        // TODO: consider not playing a bullet sound at all
        b_.playSoundOnce(
          this._tripleShoot
            ? g.assets.sfxPlayerTripleShoot
            : g.assets.sfxPlayerShoot
        );
        this._playerBullets.push(...bullets);
      },
      onShockwaveTriggered: (shockwave) => {
        b_.playSoundOnce(g.assets.sfxPlayerShockwave);
        this._shockwaves.push(shockwave);
      },
      onDamaged: () => {
        b_.playSoundOnce(g.assets.sfxDamagePlayer);
      },
      onDestroyed: (playerCc) => {
        b_.playSoundOnce(g.assets.sfxDestroyPlayer);
        this._explosions.push(
          new Explosion({ startXy: playerCc.center, magnitude: playerCc.r }),
          new Explosion({
            startXy: playerCc.center,
            magnitude: 2 * playerCc.r,
            waitFrames: 4 + Math.random() * 8,
          }),
          new Explosion({
            startXy: playerCc.center,
            magnitude: 3 * playerCc.r,
            waitFrames: 12 + Math.random() * 8,
          })
        );
      },
    });
  }

  private _handlePlayerDamage(): void {
    this._cameraShakeTimer = timer_(12);

    this._health -= 1;
    this._fastMovement = false;
    this._fastShoot = false;
    this._tripleShoot = false;

    this._player?.takeDamage(this._health);
  }

  private _handlePowerup(type: PowerupType, xy: BpxVector2d): void {
    let hasEffect = false;
    if (type === PowerupType.Health) {
      if (this._health < g.healthMax) {
        hasEffect = true;
        this._health += 1;
      }
    } else if (type === PowerupType.FastMovement) {
      if (!this._fastMovement) {
        hasEffect = true;
        this._fastMovement = true;
      }
    } else if (type === PowerupType.TripleShoot) {
      if (!this._tripleShoot) {
        hasEffect = true;
        this._tripleShoot = true;
      }
    } else if (type === PowerupType.FastShoot) {
      if (!this._fastShoot) {
        hasEffect = true;
        this._fastShoot = true;
      }
    } else if (type === PowerupType.ShockwaveCharge) {
      if (this._shockwaveCharges < g.shockwaveChargesMax) {
        hasEffect = true;
        this._shockwaveCharges += 1;
      }
    }
    if (!hasEffect) {
      this.score.add(10);
      this._floats.push(new Float({ startXy: xy, score: 10 }));
    }
    b_.playSoundOnce(
      hasEffect ? g.assets.sfxPowerupPicked : g.assets.sfxPowerupNoEffect
    );
  }

  private _handleCollisions(): void {
    if (!this._player) {
      return;
    }

    //
    // player vs powerups
    //
    for (const powerup of this._powerups) {
      if (!powerup.hasFinished) {
        if (Collisions.areColliding(this._player, powerup)) {
          powerup.pick();
          this._handlePowerup(powerup.type, powerup.collisionCircle.center);
        }
      }
    }

    //
    // shockwaves vs enemies + player bullets vs enemies + player vs enemies
    //
    for (const enemy of this._enemies) {
      for (const enemyCc of enemy.collisionCircles) {
        for (const shockwave of this._shockwaves) {
          const combinedId = `${shockwave.id}-${enemy.id}`;
          this._shockwaveEnemyHits[combinedId] ??= 0;
          if (
            !enemy.hasFinished &&
            !shockwave.hasFinished &&
            this._shockwaveEnemyHits[combinedId]! < 8
          ) {
            if (
              Collisions.areColliding(shockwave, enemyCc, {
                ignoreGameplayAreaCheck: true,
              })
            ) {
              enemy.takeDamage(2);
              this._shockwaveEnemyHits[combinedId] += 1;
            }
          }
        }
        for (const playerBullet of this._playerBullets) {
          if (!enemy.hasFinished && !playerBullet.hasFinished) {
            if (Collisions.areColliding(playerBullet, enemyCc)) {
              enemy.takeDamage(1);
              playerBullet.destroy();
            }
          }
        }
        if (!enemy.hasFinished && !this._player.isInvincibleAfterDamage()) {
          if (Collisions.areColliding(this._player, enemyCc)) {
            enemy.takeDamage(1);
            this._handlePlayerDamage();
          }
        }
      }
    }

    //
    // shockwaves vs boss + player bullets vs boss + player vs boss
    //
    if (this._boss && !this._boss.invincibleDuringIntro) {
      for (const bossCc of this._boss.collisionCircles) {
        for (const shockwave of this._shockwaves) {
          const combinedId = `${shockwave.id}-boss`;
          this._shockwaveEnemyHits[combinedId] ??= 0;
          if (
            !this._boss?.hasFinished &&
            !shockwave.hasFinished &&
            this._shockwaveEnemyHits[combinedId]! < 8
          ) {
            if (
              Collisions.areColliding(shockwave, bossCc, {
                ignoreGameplayAreaCheck: true,
              })
            ) {
              this._boss?.takeDamage(2);
              this._shockwaveEnemyHits[combinedId] += 1;
            }
          }
        }
        for (const playerBullet of this._playerBullets) {
          if (!this._boss.hasFinished && !playerBullet.hasFinished) {
            if (Collisions.areColliding(playerBullet, bossCc)) {
              this._boss.takeDamage(1);
              playerBullet.destroy();
            }
          }
        }
        if (
          !this._boss.hasFinished &&
          !this._player.isInvincibleAfterDamage()
        ) {
          if (Collisions.areColliding(this._player, bossCc)) {
            this._boss.takeDamage(1);
            this._handlePlayerDamage();
          }
        }
      }
    }

    //
    // shockwaves vs enemy bullets + player vs enemy bullets
    //
    for (const enemyBullet of this._enemyBullets) {
      for (const shockwave of this._shockwaves) {
        if (!enemyBullet.hasFinished && !shockwave.hasFinished) {
          if (Collisions.areColliding(shockwave, enemyBullet)) {
            enemyBullet.destroy();
          }
        }
      }
      if (!enemyBullet.hasFinished && !this._player.isInvincibleAfterDamage()) {
        if (Collisions.areColliding(enemyBullet, this._player)) {
          this._handlePlayerDamage();
          enemyBullet.destroy();
        }
      }
    }
  }

  get missionProgressFraction(): number {
    return this._level.progressFraction;
  }

  enterEnemiesPhase(): void {
    this._level.enterPhaseMain();
  }

  isReadyToEnterBossPhase(): boolean {
    return (
      this._level.hasScrolledToEnd() &&
      this._enemies.length <= 0 &&
      this._powerups.length <= 0
    );
  }

  enterBossPhase(): void {
    this._boss = new Boss({
      onBulletsSpawned: (spawnBulletsFn, bossMovement) => {
        if (this._player) {
          this._enemyBullets.push(
            ...spawnBulletsFn(bossMovement, this._player.collisionCircle)
          );
        }
      },
      onDamaged: () => {
        b_.playSoundOnce(g.assets.sfxDamageEnemy);
      },
      onEnteredNextPhase: (collisionCircles, scoreToAdd) => {
        b_.playSoundOnce(g.assets.sfxDestroyBossPhase);

        this.score.add(scoreToAdd);
        this._floats.push(
          new Float({ startXy: collisionCircles[0]!.center, score: scoreToAdd })
        );

        for (const cc of collisionCircles) {
          this._explosions.push(
            new Explosion({ startXy: cc.center, magnitude: 0.75 * cc.r })
          );
        }
      },
      onDestroyed: (collisionCircles, scoreToAdd) => {
        b_.playSoundOnce(g.assets.sfxDestroyBossFinal1);

        this.score.add(scoreToAdd);
        this._floats.push(
          new Float({ startXy: collisionCircles[0]!.center, score: scoreToAdd })
        );

        for (const cc of collisionCircles) {
          this._explosions.push(
            new Explosion({ startXy: cc.center, magnitude: 0.8 * cc.r }),
            new Explosion({
              startXy: cc.center,
              magnitude: 1.4 * cc.r,
              waitFrames: 4 + Math.random() * 44,
              onStarted: () => {
                b_.playSoundOnce(g.assets.sfxDestroyBossFinal2);
              },
            }),
            new Explosion({
              startXy: cc.center,
              magnitude: 1.8 * cc.r,
              waitFrames: 12 + Math.random() * 36,
              onStarted: () => {
                b_.playSoundOnce(g.assets.sfxDestroyBossFinal3);
              },
            }),
            new Explosion({
              startXy: cc.center,
              magnitude: 3.5 * cc.r,
              waitFrames: 30 + Math.random() * 18,
            }),
            new Explosion({
              startXy: cc.center,
              magnitude: 5 * cc.r,
              waitFrames: 50 + Math.random() * 6,
            })
          );
        }
      },
    });
  }

  get bossHealthFraction(): number | null {
    return this._boss?.healthFraction ?? null;
  }

  startBossFight(): void {
    if (!this._boss) {
      throw Error(`Boss was not instantiated before calling the boss fight`);
    }
    this._boss.startFirstPhase();
  }

  isBossDefeated(): boolean {
    // assuming we won't call this method before boss fight has started
    return !this._boss;
  }

  preUpdate(): void {
    if (this._player?.hasFinished) {
      this._player = null;
      this._playerBullets = [];
    }

    if (this._boss && this._boss.hasFinished) {
      // We assume here there are no enemies on a screen at the same time as boss is,
      // therefore we can just remove all enemy bullets when boss is destroyed.
      this._boss = null;
      this._enemyBullets = [];
    }

    this._shockwaves = this._shockwaves.filter((s) => !s.hasFinished);
    this._playerBullets = this._playerBullets.filter((pb) => !pb.hasFinished);
    this._enemyBullets = this._enemyBullets.filter((eb) => !eb.hasFinished);
    this._enemies = this._enemies.filter((e) => !e.hasFinished);
    this._powerups = this._powerups.filter((p) => !p.hasFinished);
    this._explosions = this._explosions.filter((e) => !e.hasFinished);
    this._floats = this._floats.filter((f) => !f.hasFinished);
  }

  update(): void {
    this._player?.setMovement(
      b_.isPressed("left"),
      b_.isPressed("right"),
      b_.isPressed("up"),
      b_.isPressed("down"),
      this._fastMovement
    );
    if (b_.isPressed("a")) {
      this._player?.fire(this._fastShoot, this._tripleShoot);
    }
    // TODO: this implementation (combined with a throttle inside the player) can end up with incorrectly used charges
    if (b_.wasJustPressed("b")) {
      if (this._shockwaveCharges > 0 && this._player) {
        this._shockwaveCharges -= 1;
        this._player.triggerShockwave();
      }
    }

    this._level.update();
    this._shockwaves.forEach((s) => s.update());
    this._playerBullets.forEach((pb) => pb.update());
    this._enemyBullets.forEach((eb) => eb.update());
    this._player?.update();
    this._enemies.forEach((e) => e.update());
    this._boss?.update();
    this._powerups.forEach((p) => p.update());
    this._explosions.forEach((e) => e.update());
    this._cameraShakeTimer.update();
    this._floats.forEach((f) => f.update());

    this._handleCollisions();

    for (const enemyToSpawn of this._level.enemiesToSpawn()) {
      this._enemies.push(
        new Enemy({
          properties: CurrentMission.m.enemyPropertiesFor(enemyToSpawn.id),
          startXy: enemyToSpawn.xy,
          onBulletsSpawned: (spawnBulletsFn, enemyMovement) => {
            if (this._player) {
              this._enemyBullets.push(
                ...spawnBulletsFn(enemyMovement, this._player.collisionCircle)
              );
            }
          },
          onDamaged: (mainCollisionCircle) => {
            b_.playSoundOnce(g.assets.sfxDamagePlayer);
            this._explosions.push(
              new Explosion({
                startXy: mainCollisionCircle.center,
                magnitude: 0.5 * mainCollisionCircle.r,
              })
            );
          },
          onDestroyed: (mainCollisionCircle, scoreToAdd, powerupType) => {
            b_.playSoundOnce(g.assets.sfxDestroyEnemy);
            this.score.add(scoreToAdd);
            this._floats.push(
              new Float({
                startXy: mainCollisionCircle.center,
                score: scoreToAdd,
              })
            );
            this._explosions.push(
              new Explosion({
                startXy: mainCollisionCircle.center,
                magnitude: 2.5 * mainCollisionCircle.r,
              })
            );
            const powerup = Powerup.for(
              powerupType,
              this._level.syncWithLevelScrollFractionalPart(
                mainCollisionCircle.center
              )
            );
            if (powerup) {
              this._powerups.push(powerup);
            }
          },
        })
      );
    }

    if (this._cameraShakeTimer.framesLeft > 0) {
      // subtracting 1 here makes the last factor always equal to 0, which makes camera reset to its neutral position
      // const factor = this._cameraShakeTimer.framesLeft - 1;
      const factor = this._cameraShakeTimer.framesLeft - 1;
      b_.setCameraOffset(
        v_((Math.random() - 0.5) * factor, (Math.random() - 0.5) * factor)
      );
    }

    b_.logDebug(
      "e:",
      this._enemies.length,
      "pb:",
      this._playerBullets.length,
      "eb:",
      this._enemyBullets.length,
      "ex:",
      this._explosions.length,
      "p:",
      this._powerups.length,
      "f:",
      this._floats.length,
      "s:",
      this._shockwaves.length
    );
  }

  draw(): void {
    b_.setClippingRegion(g.gameAreaOffset, g.gameAreaSize);

    this._level.draw();
    this._boss?.draw();
    // Some enemies are placed on a ground and have collision circle smaller than a sprite,
    //   therefore have to be drawn before a player and bullets.
    this._enemies.forEach((e) => e.draw());
    this._playerBullets.forEach((pb) => pb.draw());
    this._enemyBullets.forEach((eb) => eb.draw());
    this._player?.draw();
    this._powerups.forEach((p) => p.draw());
    this._explosions.forEach((e) => e.draw());
    // Draw shockwaves on top of all in-world objects, since they are supposed to affect what is seen.
    this._shockwaves.forEach((s) => s.draw());
    // But keep GUI elements (floats) on top of shockwaves.
    this._floats.forEach((f) => f.draw());

    b_.removeClippingRegion();

    if (b_.debug) {
      this._enemies.forEach((e) => {
        e.collisionCircles.forEach(Collisions.debugDrawCollisionCircle);
      });
      this._playerBullets.forEach(Collisions.debugDrawCollisionCircle);
      this._enemyBullets.forEach(Collisions.debugDrawCollisionCircle);
      this._boss?.collisionCircles.forEach(Collisions.debugDrawCollisionCircle);
      if (this._player) {
        Collisions.debugDrawCollisionCircle(this._player);
      }
      this._powerups.forEach(Collisions.debugDrawCollisionCircle);
      this._shockwaves.forEach(Collisions.debugDrawCollisionCircle);
    }
  }
}
