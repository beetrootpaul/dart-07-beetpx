import { v_ } from "@beetpx/beetpx";
import { b, c, g } from "../globals";
import { CollisionCircle } from "./CollisionCircle";

export class Collisions {
  // TODO: params: game_object_or_collision_circle_1, game_object_or_collision_circle_2, opts
  static areColliding(
    cc1: CollisionCircle | { collisionCircle: CollisionCircle },
    cc2: CollisionCircle | { collisionCircle: CollisionCircle }
  ): boolean {
    cc1 = "collisionCircle" in cc1 ? cc1.collisionCircle : cc1;
    cc2 = "collisionCircle" in cc2 ? cc2.collisionCircle : cc2;

    // TODO
    //     if not opts.ignore_gameplay_area_check then
    //         if _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc1) or
    //             _is_collision_circle_nearly_outside_top_edge_of_gameplay_area(cc2)
    //         then
    //             return false
    //         end
    //     end

    // actual collision check
    const distance = cc2.center.sub(cc1.center);
    const r1r2 = cc1.r + cc2.r;
    return distance.x * distance.x + distance.y * distance.y <= r1r2 * r1r2;
  }

  static debugDrawCollisionCircle(
    cc: CollisionCircle | { collisionCircle: CollisionCircle }
  ): void {
    cc = "collisionCircle" in cc ? cc.collisionCircle : cc;
    b.ellipse(
      g.gameAreaOffset.add(cc.center).sub(cc.r),
      v_(2, 2).mul(cc.r),
      c._3_dark_green
    );
  }
}
