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

  private constructor(sprite: AnimatedSprite, movement: Movement) {
    this._sprite = sprite;
    this._movement = movement;

    // TODO
    //         local is_destroyed = false
  }

  // TODO
  //             has_finished = function()
  //                 return is_destroyed or _is_safely_outside_gameplay_area(movement.xy)
  //             end,
  //
  // TODO
  //             collision_circle = function()
  //                 return {
  //                     xy = movement.xy,
  //                     r = bullet_properties.collision_circle_r,
  //                 }
  //             end,
  //
  // TODO
  //             destroy = function()
  //                 is_destroyed = true
  //             end,

  update(): void {
    this._movement.update();
  }

  draw(): void {
    this._sprite.draw(this._movement.xy);
  }
}
