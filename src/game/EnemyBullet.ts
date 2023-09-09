import { CollisionCircle } from "../collisions/CollisionCircle";
import { h } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement } from "../movement/Movement";

export interface EnemyBulletFactory {
  (movement: Movement): EnemyBullet;
}

export class EnemyBullet {
  // TODO: param: collisionCircleR
  static factory =
    (sprite: AnimatedSprite): EnemyBulletFactory =>
    (movement: Movement) =>
      new EnemyBullet(sprite, movement);

  private readonly _sprite: AnimatedSprite;
  private readonly _movement: Movement;
  private _isDestroyed: boolean = false;

  private constructor(sprite: AnimatedSprite, movement: Movement) {
    this._sprite = sprite;
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
      // TODO
      //                     r = bullet_properties.collision_circle_r,
      r: 3,
    };
  }

  destroy(): void {
    this._isDestroyed = true;
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    this._sprite.draw(this._movement.xy);
  }
}
