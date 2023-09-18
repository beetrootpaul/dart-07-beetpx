import { Timer, v_, Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { g, u } from "../globals";
import { Easing } from "../misc/Easing";
import { CurrentMission } from "../missions/CurrentMission";
import { Movement } from "../movement/Movement";
import { MovementToTarget } from "../movement/MovementToTarget";
import { BossProperties } from "./BossProperties";
import { EnemyBullet } from "./EnemyBullet";

export class Boss {
  private readonly _properties: BossProperties =
    CurrentMission.m.bossProperties();

  private _movement: Movement;

  private readonly _onBulletsSpawned: (
    spawnBulletsFn: (
      bossMovement: Movement,
      playerCollisionCircle: CollisionCircle
    ) => EnemyBullet[],
    bossMovement: Movement
  ) => void;
  private readonly _onDamaged: () => void;
  private readonly _onEnteredNextPhase: (
    collisionCircles: CollisionCircle[],
    scoreToAdd: number
  ) => void;
  private readonly _onDestroyed: (
    collisionCircles: CollisionCircle[],
    scoreToAdd: number
  ) => void;

  private _invincibleDuringIntro: boolean = true;
  get invincibleDuringIntro(): boolean {
    return this._invincibleDuringIntro;
  }

  private _health: number;
  private _isDestroyed: boolean = false;
  private _flashingAfterDamageTimer: Timer | null = null;

  private _currentPhaseNumber: number = -1;

  constructor(params: {
    onBulletsSpawned: (
      spawnBulletsFn: (
        bossMovement: Movement,
        playerCollisionCircle: CollisionCircle
      ) => EnemyBullet[],
      bossMovement: Movement
    ) => void;
    onDamaged: () => void;
    onEnteredNextPhase: (
      collisionCircles: CollisionCircle[],
      scoreToAdd: number
    ) => void;
    onDestroyed: (
      collisionCircles: CollisionCircle[],
      scoreToAdd: number
    ) => void;
  }) {
    this._movement = MovementToTarget.of({
      targetX: g.gameAreaSize.x / 2,
      targetY: 20,
      frames: 180,
      easingFn: Easing.outQuartic,
    })(v_(g.gameAreaSize.x / 2, -120));

    this._onBulletsSpawned = params.onBulletsSpawned;
    this._onDamaged = params.onDamaged;
    this._onEnteredNextPhase = params.onEnteredNextPhase;
    this._onDestroyed = params.onDestroyed;

    this._health = this._properties.health;
  }

  get healthFraction(): number | null {
    return this._invincibleDuringIntro
      ? null
      : this._health / this._properties.health;
  }

  get hasFinished(): boolean {
    return this._isDestroyed;
  }

  private get _currentPhase(): BossProperties["phases"][0] {
    return (
      this._properties.phases[this._currentPhaseNumber] ??
      u.throwError(
        `Tried to access non-existent boss phase at index ${this._currentPhaseNumber}`
      )
    );
  }

  private get _nextPhase(): BossProperties["phases"][0] {
    return (
      this._properties.phases[this._currentPhaseNumber + 1] ??
      u.throwError(
        `Tried to access non-existent boss phase at index ${
          this._currentPhaseNumber + 1
        }`
      )
    );
  }

  startFirstPhase(): void {
    this._currentPhaseNumber = 0;
    this._movement = this._currentPhase.movementFactory(this._movement.xy);
    this._invincibleDuringIntro = false;
  }

  get collisionCircles(): CollisionCircle[] {
    return this._properties.collisionCirclesProps.map(({ r, offset }) => ({
      center: this._movement.xy.add(offset ?? Vector2d.zero),
      r,
    }));
  }

  takeDamage(damage: number): void {
    this._health = Math.max(0, this._health - damage);
    if (this._health > 0) {
      this._flashingAfterDamageTimer = new Timer({ frames: 4 });
      this._onDamaged();
    } else {
      this._isDestroyed = true;
      this._onDestroyed(
        this.collisionCircles,
        this._properties.phases[this._properties.phases.length - 1]!.score
      );
    }
  }

  update(): void {
    if (
      this._currentPhaseNumber >= 0 &&
      this._currentPhaseNumber < this._properties.phases.length - 1
    ) {
      if (
        this._nextPhase.triggeringHealthFraction >=
        this._health / this._properties.health
      ) {
        this._onEnteredNextPhase(
          this.collisionCircles,
          this._currentPhase.score
        );
        this._currentPhaseNumber += 1;
        this._movement = this._currentPhase.movementFactory(this._movement.xy);
      }
    }

    this._movement.update();

    if (this._currentPhaseNumber >= 0) {
      this._currentPhase.bulletFireTimer.update();
      if (this._currentPhase.bulletFireTimer.hasFinished) {
        this._onBulletsSpawned(this._currentPhase.spawnBullets, this._movement);
        this._currentPhase.bulletFireTimer.restart();
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
