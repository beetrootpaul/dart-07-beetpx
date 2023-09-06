import { Timer, Vector2d } from "@beetpx/beetpx";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement, MovementFactory } from "../movement/Movement";
import { EnemyBullet } from "./EnemyBullet";

export type EnemyProperties = {
  health: number;
  // TODO
  //     --   - [2] = score
  // TODO
  //     --   - [3] = sprites_props_txt = "w,h,x,y|w,h,x,y" -- where 1st set is for a ship sprite, and 2nd – for a damage flash overlay
  spriteMain: AnimatedSprite;
  // put main/center circle first, since it will be source for explosions etc.
  collisionCirclesProps: Array<{
    r: number;
    offset?: Vector2d;
  }>;
  // TODO
  //     --   - [5] = powerups_distribution
  movementFactory: MovementFactory;

  bulletFireTimer?: Timer;
  // TODO: params: player_collision_circle
  spawnBullets?: (enemyMovement: Movement) => EnemyBullet[];
};
