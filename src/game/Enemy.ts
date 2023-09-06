import { Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { Movement } from "../movement/Movement";
import { EnemyBullet } from "./EnemyBullet";
import { EnemyProperties } from "./EnemyProperties";

// TODO
//     local next_id = 0

export class Enemy {
  private readonly _properties: EnemyProperties;
  private readonly _movement: Movement;
  private readonly _onBulletsSpawned: (
    spawnBulletsFn: (enemyMovement: Movement) => EnemyBullet[],
    enemyMovement: Movement
  ) => void;
  // TODO: params: main_collision_circle
  private readonly _onDamaged: () => void;
  // TODO: params: main_collision_circle, powerup_type, enemy_properties[2]
  private readonly _onDestroyed: () => void;

  private _health: number;
  private _isDestroyed: boolean = false;

  constructor(params: {
    properties: EnemyProperties;
    startXy: Vector2d;
    onBulletsSpawned: (
      spawnBulletsFn: (enemyMovement: Movement) => EnemyBullet[],
      enemyMovement: Movement
    ) => void;
    // TODO: params: main_collision_circle
    onDamaged: () => void;
    // TODO: params: main_collision_circle, powerup_type, enemy_properties[2]
    onDestroyed: () => void;
  }) {
    this._properties = params.properties;
    this._movement = params.properties.movementFactory(params.startXy);
    this._onBulletsSpawned = params.onBulletsSpawned;
    this._onDamaged = params.onDamaged;
    this._onDestroyed = params.onDestroyed;

    this._health = params.properties.health;

    // TODO
    //         next_id = next_id + 1
    //
    //         local bullet_fire_timer = enemy_properties.bullet_fire_timer or new_fake_timer()
    //
    //         local ship_sprite_props_txt, flash_sprite_props_txt = _unpack_split(enemy_properties[3], "|")
    //         local ship_sprite, flash_sprite = new_static_sprite(ship_sprite_props_txt), new_static_sprite(flash_sprite_props_txt)
    //
    //         local flashing_after_damage_timer
  }

  // TODO
  //             id = next_id,

  get collisionCircles(): CollisionCircle[] {
    return this._properties.collisionCirclesProps.map(({ r, offset }) => ({
      center: this._movement.xy.add(offset ?? Vector2d.zero),
      r,
    }));
  }

  takeDamage(damage: number): void {
    // TODO
    //                 local main_collision_circle = collision_circles()[1]
    //
    this._health = Math.max(0, this._health - damage);
    if (this._health > 0) {
      // TODO
      //                     flashing_after_damage_timer = new_timer(4)
      //                     on_damaged(main_collision_circle)
      this._onDamaged();
    } else {
      this._isDestroyed = true;
      // TODO
      //                     local powerup_type = rnd(split(enemy_properties[5]))
      //                     on_destroyed(main_collision_circle, powerup_type, enemy_properties[2])
      this._onDestroyed();
    }
  }

  get hasFinished(): boolean {
    // TODO
    //                 return is_destroyed or movement.xy.y > _gah + _ts
    return this._isDestroyed;
  }

  update(): void {
    this._movement.update();

    if (this._properties.bulletFireTimer) {
      this._properties.bulletFireTimer.update();
      if (this._properties.bulletFireTimer.hasFinished) {
        if (this._properties.spawnBullets) {
          // TODO
          const canSpawnBullets = true;
          //                     local can_spawn_bullets = false
          // TODO
          //                     for cc in all(collision_circles()) do
          //                         if not _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc) then
          //                             can_spawn_bullets = can_spawn_bullets or true
          //                         end
          //                     end
          if (canSpawnBullets) {
            this._onBulletsSpawned(
              this._properties.spawnBullets,
              this._movement
            );
          }
        }
        this._properties.bulletFireTimer.restart();
      }
    }

    // TODO
    //                 if flashing_after_damage_timer then
    //                     if flashing_after_damage_timer.ttl <= 0 then
    //                         flashing_after_damage_timer = nil
    //                     else
    //                         flashing_after_damage_timer._update()
    //                     end
    //                 end
  }

  draw(): void {
    this._properties.spriteMain.draw(this._movement.xy);
    // TODO
    //                 if flashing_after_damage_timer and flashing_after_damage_timer.ttl > 0 then
    //                     flash_sprite._draw(movement.xy)
    //                 end
  }
}
