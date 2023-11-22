import { b_, v_ } from "@beetpx/beetpx";
import { c, g } from "../globals";
import { CollisionCircle } from "./CollisionCircle";

export class Collisions {
  static areColliding(
    cc1: CollisionCircle | { collisionCircle: CollisionCircle },
    cc2: CollisionCircle | { collisionCircle: CollisionCircle },
    opts: {
      ignoreGameplayAreaCheck: boolean;
    } = {
      ignoreGameplayAreaCheck: false,
    },
  ): boolean {
    cc1 = "collisionCircle" in cc1 ? cc1.collisionCircle : cc1;
    cc2 = "collisionCircle" in cc2 ? cc2.collisionCircle : cc2;

    if (!opts.ignoreGameplayAreaCheck) {
      if (
        Collisions.isCollisionCircleNearlyOutsideTopEdgeOfGameplayArea(cc1) ||
        Collisions.isCollisionCircleNearlyOutsideTopEdgeOfGameplayArea(cc2)
      ) {
        return false;
      }
    }

    // actual collision check
    const distance = cc2.center.sub(cc1.center);
    const r1r2 = cc1.r + cc2.r;
    return distance.x * distance.x + distance.y * distance.y <= r1r2 * r1r2;
  }

  static isCollisionCircleNearlyOutsideTopEdgeOfGameplayArea(
    collisionCircle: CollisionCircle,
  ): boolean {
    return collisionCircle.center.y + collisionCircle.r < 3;
  }

  static debugDrawCollisionCircle(
    cc: CollisionCircle | { collisionCircle: CollisionCircle },
  ): void {
    cc = "collisionCircle" in cc ? cc.collisionCircle : cc;
    b_.ellipse(
      g.gameAreaOffset.add(cc.center).sub(cc.r),
      v_(2, 2).mul(cc.r),
      c.darkGreen,
    );
  }
}
