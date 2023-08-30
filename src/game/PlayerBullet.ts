import { Vector2d } from "@beetpx/beetpx";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export class PlayerBullet {
  private readonly _sprite: AnimatedSprite = new AnimatedSprite(4, 5, [9], 11);

  private readonly _movement: Movement;

  constructor(startXy: Vector2d) {
    // TODO
    //     local is_destroyed = false

    this._movement = MovementLine.of({
      angle: 0.75,
      angledSpeed: 2.5,
    })(startXy);
  }

  // TODO
  //     return {
  //         has_finished = function()
  //             return is_destroyed or _is_safely_outside_gameplay_area(movement.xy)
  //         end,
  //
  //         collision_circle = function()
  //             return {
  //                 xy = movement.xy.minus(0, .5),
  //                 r = 1.5,
  //             }
  //         end,
  //
  //         destroy = function()
  //             is_destroyed = true
  //         end,
  //

  update(): void {
    this._movement.update();
  }

  draw(): void {
    this._sprite.draw(this._movement.xy);
  }
}
