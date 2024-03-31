import { CollisionCircle } from "../collisions/CollisionCircle";
import { h } from "../globals";
import { Sprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";

export interface EnemyBulletFactory {
  (movement: Movement): EnemyBullet;
}

export class EnemyBullet {
  static factory =
    (sprite: Sprite, collisionCircleR: number): EnemyBulletFactory =>
    (movement: Movement) =>
      new EnemyBullet(sprite, collisionCircleR, movement);

  private readonly _sprite: Sprite;
  private readonly _collisionCircleR: number;
  private readonly _movement: Movement;
  private _isDestroyed: boolean = false;

  private constructor(
    sprite: Sprite,
    collisionCircleR: number,
    movement: Movement,
  ) {
    this._sprite = sprite;
    this._collisionCircleR = collisionCircleR;
    this._movement = movement;
  }

  get hasFinished(): boolean {
    return (
      this._isDestroyed || h.isSafelyOutsideGameplayArea(this._movement.xy)
    );
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: this._movement.xy,
      r: this._collisionCircleR,
    };
  }

  destroy(): void {
    this._isDestroyed = true;
  }

  pause(): void {
    this._movement.pause();
  }

  resume(): void {
    this._movement.resume();
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    this._sprite.draw(this._movement.xy);
  }
}
