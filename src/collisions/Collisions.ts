import { CollisionCircle } from "./CollisionCircle";

export class Collisions {
  // TODO: params: game_object_or_collision_circle_1, game_object_or_collision_circle_2, opts
  static areColliding(cc1: CollisionCircle, cc2: CollisionCircle): boolean {
    // TODO
    //     local cc1 = game_object_or_collision_circle_1.collision_circle and game_object_or_collision_circle_1.collision_circle() or game_object_or_collision_circle_1
    //     local cc2 = game_object_or_collision_circle_2.collision_circle and game_object_or_collision_circle_2.collision_circle() or game_object_or_collision_circle_2
    //     opts = opts or {}
    //
    // TODO
    //     if not opts.ignore_gameplay_area_check then
    //         if _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc1) or
    //             _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc2)
    //         then
    //             return false
    //         end
    //     end
    //
    // actual collision check
    const distance = cc2.center.sub(cc1.center);
    const r1r2 = cc1.r + cc2.r;
    return distance.x * distance.x + distance.y * distance.y <= r1r2 * r1r2;
  }
}

// TODO
// -- DEBUG:
// --function _collisions._debug_draw_collision_circle(game_object_or_collision_circle)
// --    local cc = game_object_or_collision_circle.collision_circle and game_object_or_collision_circle.collision_circle() or game_object_or_collision_circle
// --    oval(
// --        ceil(_gaox + cc.xy.x - cc.r - .5),
// --        ceil(cc.xy.y - cc.r - .5),
// --        flr(_gaox + cc.xy.x + cc.r - .5),
// --        flr(cc.xy.y + cc.r - .5),
// --        _color_3_dark_green
// --    )
// --end
