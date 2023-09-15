import { Timer, v_, Vector2d } from "@beetpx/beetpx";
import { Collisions } from "../collisions/Collisions";
import { b, g } from "../globals";
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

  private readonly _level: Level = new Level(new LevelDescriptor());

  private _player: Player | null;
  // TODO: consider poll of enemies for memory reusage
  private _enemies: Enemy[] = [];
  private _boss: Boss | null = null;

  // TODO: consider poll of bullets for memory reusage
  private _playerBullets: PlayerBullet[] = [];
  private _enemyBullets: EnemyBullet[] = [];
  private _shockwaves: Shockwave[] = [];

  // TODO: consider poll of floats for memory reusage
  private _explosions: Explosion[] = [];

  // TODO: consider poll of floats for memory reusage
  private _floats: Float[] = [];

  // TODO: consider poll of floats for memory reusage
  private _powerups: Powerup[] = [];

  readonly score: Score;

  private _cameraShakeTimer: Timer = new Timer({ frames: 0 });

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

    // TODO
    // local shockwave_enemy_hits =  {}

    this._player = new Player({
      // TODO
      onBulletsSpawned: (bullets) => {
        // TODO: consider not playing a bullet sound at all
        // TODO
        // _sfx_play(game.triple_shoot and _sfx_player_triple_shoot or _sfx_player_shoot, 3)
        this._playerBullets.push(...bullets);
      },
      onShockwaveTriggered: (shockwave) => {
        // TODO
        //     _sfx_play(_sfx_player_shockwave, 2)
        this._shockwaves.push(shockwave);
      },
      onDamaged: () => {
        // TODO
        //    _sfx_play(_sfx_damage_player, 2)
      },
      onDestroyed: (playerCc) => {
        // TODO
        //    _sfx_play(_sfx_destroy_player, 3)
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
    this._cameraShakeTimer = new Timer({ frames: 12 });

    this._health -= 1;
    this._fastMovement = false;
    this._fastShoot = false;
    this._tripleShoot = false;

    this._player?.takeDamage(this._health);
  }

  private _handlePowerup(type: PowerupType, xy: Vector2d): void {
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
    // TODO
    // _sfx_play(
    //     has_effect and _sfx_powerup_picked or _sfx_powerup_no_effect,
    //     has_effect and 2 or nil
    // )
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
        // TODO
        //             for shockwave in all(shockwaves) do
        //                 local combined_id = shockwave.id .. "-" .. enemy.id
        //                 shockwave_enemy_hits[combined_id] = shockwave_enemy_hits[combined_id] or 0
        //                 if not enemy.has_finished() and not shockwave.has_finished() and shockwave_enemy_hits[combined_id] < 8 then
        //                     if _collisions.are_colliding(shockwave, enemy_cc, {
        //                         ignore_gameplay_area_check = true,
        //                     }) then
        //                         enemy.take_damage(2)
        //                         shockwave_enemy_hits[combined_id] = shockwave_enemy_hits[combined_id] + 1
        //                     end
        //                 end
        //             end
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
        // TODO
        //             for shockwave in all(shockwaves) do
        //                 local combined_id = shockwave.id .. "-boss"
        //                 shockwave_enemy_hits[combined_id] = shockwave_enemy_hits[combined_id] or 0
        //                 if not boss.has_finished() and not shockwave.has_finished() and shockwave_enemy_hits[combined_id] < 8 then
        //                     if _collisions.are_colliding(shockwave, boss_cc, {
        //                         ignore_gameplay_area_check = true,
        //                     }) then
        //                         boss.take_damage(2)
        //                         shockwave_enemy_hits[combined_id] = shockwave_enemy_hits[combined_id] + 1
        //                     end
        //                 end
        //             end
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
      // TODO
      //         for shockwave in all(shockwaves) do
      //             if not enemy_bullet.has_finished() and not shockwave.has_finished() then
      //                 if _collisions.are_colliding(shockwave, enemy_bullet) then
      //                     enemy_bullet.destroy()
      //                 end
      //             end
      //         end
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
      // TODO: params: bullets_fn, boss_movement
      onBulletsSpawned: () => {
        // TODO
        //             if player then
        //                 for b in all(bullets_fn(boss_movement, player.collision_circle())) do
        //                     add(enemy_bullets, b)
        //                 end
        //             end
      },
      onDamaged: () => {
        // TODO
        // _sfx_play(_sfx_damage_enemy, 3)
      },
      // TODO: params: collision_circles, score_to_add
      onEnteredNextPhase: () => {
        // TODO
        //             _sfx_play(_sfx_destroy_boss_phase)
        //             game.score.add(score_to_add)
        //             add(floats, new_float(collision_circles[1].xy, score_to_add))
        //             for cc in all(collision_circles) do
        //                 add(explosions, new_explosion(cc.xy, .75 * cc.r))
        //             end
      },
      // TODO: params: score_to_add
      onDestroyed: (collisionCircles) => {
        // TODO
        //             _sfx_play(_sfx_destroy_boss_final_1)
        //             game.score.add(score_to_add)
        //             add(floats, new_float(collision_circles[1].xy, score_to_add))

        for (const cc of collisionCircles) {
          this._explosions.push(
            new Explosion({ startXy: cc.center, magnitude: 0.8 * cc.r }),
            new Explosion({
              startXy: cc.center,
              magnitude: 1.4 * cc.r,
              waitFrames: 4 + Math.random() * 44,
              // TODO:
              //   onStarted() { _sfx_play(_sfx_destroy_boss_final_2) },
            }),
            new Explosion({
              startXy: cc.center,
              magnitude: 1.8 * cc.r,
              waitFrames: 12 + Math.random() * 36,
              // TODO:
              //   onStarted() { _sfx_play(_sfx_destroy_boss_final_3) },
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
    // TODO
    // -- hack to optimize tokens: we set game.boss_health_max only when boss enters
    // -- fight phase, even if we update game.boss_health earlier on every frame;
    // -- thanks to that we can easily detect if it's time to show boss' health bar
    // game.boss_health_max = boss.health_max

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
      b.isPressed("left"),
      b.isPressed("right"),
      b.isPressed("up"),
      b.isPressed("down"),
      this._fastMovement
    );
    // TODO: make it work for uppercase X as well
    if (b.isPressed("x")) {
      this._player?.fire(this._fastShoot, this._tripleShoot);
    }
    // TODO: make it work for uppercase Z as well
    // TODO: this implementation (combined with a throttle inside the player) can end up with incorrectly used charges
    if (b.wasJustPressed("o")) {
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
            // TODO
            //     if player then
            // TODO
            this._enemyBullets.push(...spawnBulletsFn(enemyMovement));
            //         for seb in all(spawned_enemy_bullets_fn(enemy_movement, player.collision_circle())) do
            //             add(enemy_bullets, seb)
            //         end
            //     end
          },
          onDamaged: (mainCollisionCircle) => {
            // TODO
            //     _sfx_play(_sfx_damage_enemy)
            this._explosions.push(
              new Explosion({
                startXy: mainCollisionCircle.center,
                magnitude: 0.5 * mainCollisionCircle.r,
              })
            );
          },
          onDestroyed: (mainCollisionCircle, scoreToAdd, powerupType) => {
            // TODO
            //     _sfx_play(_sfx_destroy_enemy)
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
              mainCollisionCircle.center
            );
            if (powerup) {
              this._powerups.push(powerup);
            }
          },
        })
      );
    }

    // TODO
    /*
        if boss then
            -- hack to optimize tokens: we set game.boss_health_max only when boss enters
            -- fight phase, even if we update game.boss_health earlier on every frame;
            -- thanks to that we can easily detect if it's time to show boss' health bar
            game.boss_health = boss.health
        end
     */

    // TODO: log everything that might matter
    b.logDebug(
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
      this._floats.length
    );
  }

  draw(): void {
    // TODO
    // clip(_gaox, 0, _gaw, _gah)

    // TODO: consider introduction of GameObject with update and draw managed by BeetPx. Moreover, it might need a tree structure to call screen object's update before all game objects inside it and after things like collisions and input handling
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
    this._floats.forEach((f) => f.draw());
    // Draw shockwaves on top of everything since they are supposed to affect the final game image.
    this._shockwaves.forEach((s) => s.draw());

    // TODO
    //   clip()

    if (b.debug) {
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
    }

    if (this._cameraShakeTimer.framesLeft > 0) {
      // subtracting 1 here makes the last factor always equal to 0, which makes camera reset to its neutral position
      const factor = this._cameraShakeTimer.framesLeft - 1;
      b.setCameraOffset(
        v_((Math.random() - 0.5) * factor, (Math.random() - 0.5) * factor)
      );
    }
  }
}
