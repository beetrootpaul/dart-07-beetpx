import { Timer, Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement, MovementFactory } from "../movement/Movement";
import { EnemyBullet } from "./EnemyBullet";

export type BossProperties = {
  health: number;

  spriteMain: AnimatedSprite;
  spriteFlash: AnimatedSprite;

  // put main/center circle first, since it will be source for explosions etc.
  collisionCirclesProps: Array<{
    r: number;
    offset?: Vector2d;
  }>;

  phases: Array<{
    triggeringHealthFraction: number;

    score: number;

    bulletFireTimer: Timer;
    spawnBullets: (
      bossMovement: Movement,
      playerCollisionCircle: CollisionCircle
    ) => EnemyBullet[];

    movementFactory: MovementFactory;
  }>;
};
