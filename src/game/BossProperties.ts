import { Vector2d } from "@beetpx/beetpx";
import { AnimatedSprite } from "../misc/AnimatedSprite";

export type BossProperties = {
  health: number;

  spriteMain: AnimatedSprite;
  spriteFlash: AnimatedSprite;

  // put main/center circle first, since it will be source for explosions etc.
  collisionCirclesProps: Array<{
    r: number;
    offset?: Vector2d;
  }>;

  // TODO
  //     --   - phases = {
  //     --       - [1] = triggering_health_fraction
  //     --       - [2] = score
  //     --       - [3] = bullet_fire_timer
  //     --       - [4] = spawn_bullets = function(boss_movement, player_collision_circle)
  //     --                                 return bullets_table
  //     --                               end
  //     --       - [5] = movement_factory
  //     --     }
};
