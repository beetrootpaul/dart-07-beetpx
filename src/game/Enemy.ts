import { BpxTimer, BpxVector2d, timer_, u_, v_0_0_ } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { Collisions } from "../collisions/Collisions";
import { g } from "../globals";
import { Movement } from "../movement/Movement";
import { EnemyBullet } from "./EnemyBullet";
import { EnemyProperties } from "./EnemyProperties";

export class Enemy {
  private static _nextId = 1;

  readonly id: number = Enemy._nextId++;

  private readonly _properties: EnemyProperties;

  private readonly _movement: Movement;

  private readonly _onBulletsSpawned: (
    spawnBulletsFn: (
      enemyMovement: Movement,
      playerCollisionCircle: CollisionCircle
    ) => EnemyBullet[],
    enemyMovement: Movement
  ) => void;
  private readonly _onDamaged: (mainCollisionCircle: CollisionCircle) => void;
  private readonly _onDestroyed: (
    mainCollisionCircle: CollisionCircle,
    scoreToAdd: number,
    powerupType: string
  ) => void;

  private _health: number;
  private _isDestroyed: boolean = false;
  private _flashingAfterDamageTimer: BpxTimer | null = null;

  constructor(params: {
    properties: EnemyProperties;
    startXy: BpxVector2d;
    onBulletsSpawned: (
      spawnBulletsFn: (
        enemyMovement: Movement,
        playerCollisionCircle: CollisionCircle
      ) => EnemyBullet[],
      enemyMovement: Movement
    ) => void;
    onDamaged: (mainCollisionCircle: CollisionCircle) => void;
    onDestroyed: (
      mainCollisionCircle: CollisionCircle,
      scoreToAdd: number,
      powerupType: string
    ) => void;
  }) {
    this._properties = params.properties;

    this._movement = params.properties.movementFactory(params.startXy);

    this._onBulletsSpawned = params.onBulletsSpawned;
    this._onDamaged = params.onDamaged;
    this._onDestroyed = params.onDestroyed;

    this._health = params.properties.health;
  }

  get collisionCircles(): CollisionCircle[] {
    return this._properties.collisionCirclesProps.map(({ r, offset }) => ({
      center: this._movement.xy.add(offset ?? v_0_0_),
      r,
    }));
  }

  takeDamage(damage: number): void {
    const mainCollisionCircle =
      this.collisionCircles[0] ??
      u_.throwError(`Enemy has no main collision circle`);

    this._health = Math.max(0, this._health - damage);
    if (this._health > 0) {
      this._flashingAfterDamageTimer = timer_(4);
      this._onDamaged(mainCollisionCircle);
    } else {
      this._isDestroyed = true;
      const powerupTypesToPickFrom =
        this._properties.powerupsDistribution.split(",");
      const powerupType = u_.randomElementOf(powerupTypesToPickFrom)!;
      this._onDestroyed(
        mainCollisionCircle,
        this._properties.score,
        powerupType
      );
    }
  }

  get hasFinished(): boolean {
    return (
      this._isDestroyed || this._movement.xy.y > g.gameAreaSize.y + g.tileSize.y
    );
  }

  update(): void {
    this._movement.update();

    if (this._properties.bulletFireTimer) {
      this._properties.bulletFireTimer.update();
      if (this._properties.bulletFireTimer.hasFinished) {
        if (this._properties.spawnBullets) {
          let canSpawnBullets = false;
          for (const cc of this.collisionCircles) {
            if (
              !Collisions.isCollisionCircleNearlyOutsideTopEdgeOfGameplayArea(
                cc
              )
            ) {
              canSpawnBullets ||= true;
            }
          }
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

    if (this._flashingAfterDamageTimer?.hasFinished) {
      this._flashingAfterDamageTimer = null;
    }
    this._flashingAfterDamageTimer?.update();
  }

  draw(): void {
    this._properties.spriteMain.draw(this._movement.xy);

    if (!(this._flashingAfterDamageTimer?.hasFinished ?? true)) {
      this._properties.spriteFlash.draw(this._movement.xy);
    }
  }
}
