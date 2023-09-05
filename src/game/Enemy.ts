import { Vector2d } from "@beetpx/beetpx";
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

  constructor(params: {
    properties: EnemyProperties;
    startXy: Vector2d;
    // TODO: params: spawned_enemy_bullets_fn, enemy_movement
    onBulletsSpawned: (
      spawnBulletsFn: (enemyMovement: Movement) => EnemyBullet[],
      enemyMovement: Movement
    ) => void;
  }) {
    this._properties = params.properties;
    this._movement = params.properties.movementFactory(params.startXy);
    this._onBulletsSpawned = params.onBulletsSpawned;

    // TODO
    //         next_id = next_id + 1
    //
    //         local on_damaged, on_destroyed = params.on_damaged, params.on_destroyed
    //
    //         local health = enemy_properties[1]
    //         local bullet_fire_timer = enemy_properties.bullet_fire_timer or new_fake_timer()
    //
    //         local ship_sprite_props_txt, flash_sprite_props_txt = _unpack_split(enemy_properties[3], "|")
    //         local ship_sprite, flash_sprite = new_static_sprite(ship_sprite_props_txt), new_static_sprite(flash_sprite_props_txt)
    //
    //         local flashing_after_damage_timer
    //
    //         local is_destroyed = false
  }

  // TODO
  //             id = next_id,
  //
  // TODO
  //             collision_circles = collision_circles,
  //
  // TODO
  //         local function collision_circles()
  //             local ccs = {}
  //             for cc_props in all(enemy_properties[4]) do
  //                 add(ccs, {
  //                     xy = movement.xy.plus(cc_props[2] or _xy_0_0),
  //                     r = cc_props[1],
  //                 })
  //             end
  //             return ccs
  //         end
  //
  // TODO
  //             take_damage = function(damage)
  //                 local main_collision_circle = collision_circles()[1]
  //
  //                 health = max(0, health - damage)
  //                 if health > 0 then
  //                     flashing_after_damage_timer = new_timer(4)
  //                     on_damaged(main_collision_circle)
  //                 else
  //                     is_destroyed = true
  //                     local powerup_type = rnd(split(enemy_properties[5]))
  //                     on_destroyed(main_collision_circle, powerup_type, enemy_properties[2])
  //                 end
  //             end,
  //
  // TODO
  //             has_finished = function()
  //                 return is_destroyed or movement.xy.y > _gah + _ts
  //             end,

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
