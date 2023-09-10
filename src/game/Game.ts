import { Vector2d } from "@beetpx/beetpx";
import { Collisions } from "../collisions/Collisions";
import { b, g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
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

  // TODO: consider poll of bullets for memory reusage
  private _playerBullets: PlayerBullet[] = [];
  private _enemyBullets: EnemyBullet[] = [];

  // TODO: consider poll of floats for memory reusage
  private _explosions: Explosion[] = [];

  // TODO: consider poll of floats for memory reusage
  private _floats: Float[] = [];

  // TODO: consider poll of floats for memory reusage
  private _powerups: Powerup[] = [];

  readonly score: Score;

  constructor(params: {
    health: number;
    shockwaveCharges: number;
    fastMovement: boolean;
    fastShoot: boolean;
    tripleShoot: boolean;
    score: number;
  }) {
    // TODO
    // local game = {
    this._health = params.health;
    this.score = new Score(params.score);
    // TODO
    // boss_health = nil,
    // boss_health_max = nil,
    this._shockwaveCharges = params.shockwaveCharges;
    this._fastMovement = params.fastMovement;
    this._fastShoot = params.fastShoot;
    this._tripleShoot = params.tripleShoot;
    // TODO
    /*
      local camera_shake_timer, boss = new_timer(0)

      local shockwaves, shockwave_enemy_hits =  {}, {}
  */

    this._player = new Player({
      // TODO
      onBulletsSpawned: (bullets) => {
        // TODO: consider not playing a bullet sound at all
        // TODO
        // _sfx_play(game.triple_shoot and _sfx_player_triple_shoot or _sfx_player_shoot, 3)
        this._playerBullets.push(...bullets);
      },
      // TODO
      // on_shockwave_triggered = function(shockwave)
      //     _sfx_play(_sfx_player_shockwave, 2)
      //     add(shockwaves, shockwave)
      // end,
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
    // TODO
    // camera_shake_timer = new_timer(12)
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

    // TODO
    //     -- shockwaves vs boss + player bullets vs boss + player vs boss
    //     if boss and not boss.invincible_during_intro then
    //         for boss_cc in all(boss.collision_circles()) do
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
    //             for player_bullet in all(player_bullets) do
    //                 if not boss.has_finished() and not player_bullet.has_finished() then
    //                     if _collisions.are_colliding(player_bullet, boss_cc) then
    //                         boss.take_damage(1)
    //                         player_bullet.destroy()
    //                     end
    //                 end
    //             end
    //             if not boss.has_finished() and not player.is_invincible_after_damage() then
    //                 if _collisions.are_colliding(player, boss_cc) then
    //                     boss.take_damage(1)
    //                     handle_player_damage()
    //                 end
    //             end
    //         end
    //     end

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

  // TODO
  // game.mission_progress_fraction = level.progress_fraction

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

  // TODO
  /*
    function game.enter_boss_phase()
        boss = new_boss {
            on_bullets_spawned = function(bullets_fn, boss_movement)
                if player then
                    for b in all(bullets_fn(boss_movement, player.collision_circle())) do
                        add(enemy_bullets, b)
                    end
                end
            end,
            on_damage = function()
                _sfx_play(_sfx_damage_enemy, 3)
            end,
            on_entered_next_phase = function(collision_circles, score_to_add)
                _sfx_play(_sfx_destroy_boss_phase)
                game.score.add(score_to_add)
                add(floats, new_float(collision_circles[1].xy, score_to_add))
                for cc in all(collision_circles) do
                    add(explosions, new_explosion(cc.xy, .75 * cc.r))
                end
            end,
            on_destroyed = function(collision_circles, score_to_add)
                _sfx_play(_sfx_destroy_boss_final_1)
                game.score.add(score_to_add)
                add(floats, new_float(collision_circles[1].xy, score_to_add))
                for cc in all(collision_circles) do
                    local xy, r = cc.xy, cc.r
                    _add_all(
                        explosions,
                        new_explosion(xy, .8 * r),
                        new_explosion(xy, 1.4 * r, 4 + flr(rnd(44)), function()
                            _sfx_play(_sfx_destroy_boss_final_2)
                        end),
                        new_explosion(xy, 1.8 * r, 12 + flr(rnd(36)), function()
                            _sfx_play(_sfx_destroy_boss_final_3)
                        end),
                        new_explosion(xy, 3.5 * r, 30 + flr(rnd(18))),
                        new_explosion(xy, 5 * r, 50 + flr(rnd(6)))
                    )
                end
            end,
        }
    end

    function game.start_boss_fight()
        -- hack to optimize tokens: we set game.boss_health_max only when boss enters
        -- fight phase, even if we update game.boss_health earlier on every frame;
        -- thanks to that we can easily detect if it's time to show boss' health bar
        game.boss_health_max = boss.health_max
        boss.start_first_phase()
    end

    function game.is_boss_defeated()
        -- assuming we won't call this method before boss fight has started
        return not boss
    end
     */

  preUpdate(): void {
    if (this._player?.hasFinished) {
      this._player = null;
      this._playerBullets = [];
    }

    // TODO
    /*
        if boss and boss.has_finished() then
            -- we assume here there are no enemies on a screen at the same time as boss is,
            -- therefore we can just remove all enemy bullets when boss is destroyed
            boss, enemy_bullets = nil, {}
        end
        */

    // TODO: shockwaves
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
      b.isPressed("down")
    );
    if (b.isPressed("x")) {
      this._player?.fire(this._fastShoot, this._tripleShoot);
    }
    // TODO
    /*
            if btnp(_button_o) then
                if game.shockwave_charges > 0 then
                    game.shockwave_charges = game.shockwave_charges - 1
                    player.trigger_shockwave()
                else
                end
            end
        */

    this._level.update();
    // TODO: shockwaves
    this._playerBullets.forEach((pb) => pb.update());
    this._enemyBullets.forEach((eb) => eb.update());
    this._player?.update();
    this._enemies.forEach((e) => e.update());
    // TODO: boss
    this._powerups.forEach((p) => p.update());
    this._explosions.forEach((e) => e.update());
    // TODO: camera_shake_timer
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
    // TODO: boss
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
    // TODO: shockwaves

    // TODO
    //   clip()

    // TODO
    if (b.debug) {
      this._enemies.forEach((e) => {
        e.collisionCircles.forEach(Collisions.debugDrawCollisionCircle);
      });
      this._playerBullets.forEach(Collisions.debugDrawCollisionCircle);
      this._enemyBullets.forEach(Collisions.debugDrawCollisionCircle);
      // TODO
      // --    boss and boss.collision_circles() or nil,
      // --        _collisions._debug_draw_collision_circle(game_object_or_collision_circle)
      if (this._player) {
        Collisions.debugDrawCollisionCircle(this._player);
      }
      this._powerups.forEach(Collisions.debugDrawCollisionCircle);
    }

    // TODO
    // if camera_shake_timer.ttl > 0 then
    //     local factor = camera_shake_timer.ttl - 1
    //     camera(
    //         rnd(factor) - .5 * factor,
    //         rnd(factor) - .5 * factor
    //     )
    // end
  }
}
