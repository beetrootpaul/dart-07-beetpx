import { Timer, Vector2d } from "@beetpx/beetpx";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement, MovementFactory } from "../movement/Movement";
import { EnemyBullet } from "./EnemyBullet";

export type EnemyProperties = {
  health: number;
  // TODO
  //     --   - [2] = score
  spriteMain: AnimatedSprite;
  spriteFlash: AnimatedSprite;
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
