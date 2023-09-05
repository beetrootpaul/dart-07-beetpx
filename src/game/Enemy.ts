import { v_, Vector2d } from "@beetpx/beetpx";
import { b, c } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

export class Enemy {
  // TODO: tmp
  private _xy: Vector2d;

  // TODO: tmp
  constructor(params: { startXy: Vector2d }) {
    this._xy = params.startXy;
  }

  // TODO: tmp
  update(): void {
    this._xy = this._xy.add(v_(0, CurrentMission.m.scrollPerFrame));
  }

  // TODO: tmp
  draw(): void {
    b.rectFilled(this._xy.sub(3), v_(7, 7), c._7_white);
    b.pixel(this._xy, c._8_red);
  }
}

// TODO
// do
//     local next_id = 0
//
//     function new_enemy(params)
//         next_id = next_id + 1
//
//         local enemy_properties, start_xy = params.enemy_properties, params.start_xy
//         local on_bullets_spawned, on_damaged, on_destroyed = params.on_bullets_spawned, params.on_damaged, params.on_destroyed
//
//         local health, movement = enemy_properties[1], enemy_properties[6](start_xy)
//         local bullet_fire_timer = enemy_properties.bullet_fire_timer or new_fake_timer()
//
//         local ship_sprite_props_txt, flash_sprite_props_txt = _unpack_split(enemy_properties[3], "|")
//         local ship_sprite, flash_sprite = new_static_sprite(ship_sprite_props_txt), new_static_sprite(flash_sprite_props_txt)
//
//         local flashing_after_damage_timer
//
//         local is_destroyed = false
//
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
//         return {
//             id = next_id,
//
//             has_finished = function()
//                 return is_destroyed or movement.xy.y > _gah + _ts
//             end,
//
//             collision_circles = collision_circles,
//
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
//             _update = function()
//                 movement._update()
//
//                 bullet_fire_timer._update()
//                 if bullet_fire_timer.ttl <= 0 then
//                     local can_spawn_bullets = false
//                     for cc in all(collision_circles()) do
//                         if not _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc) then
//                             can_spawn_bullets = can_spawn_bullets or true
//                         end
//                     end
//                     if can_spawn_bullets then
//                         on_bullets_spawned(enemy_properties.spawn_bullets, movement)
//                     end
//                     bullet_fire_timer.restart()
//                 end
//
//                 if flashing_after_damage_timer then
//                     if flashing_after_damage_timer.ttl <= 0 then
//                         flashing_after_damage_timer = nil
//                     else
//                         flashing_after_damage_timer._update()
//                     end
//                 end
//             end,
//
//             _draw = function()
//                 ship_sprite._draw(movement.xy)
//                 -- DEBUG:
//                 --if t() * 2 % 2 < 1 then
//                 if flashing_after_damage_timer and flashing_after_damage_timer.ttl > 0 then
//                     flash_sprite._draw(movement.xy)
//                 end
//             end,
//         }
//     end
//
// end
