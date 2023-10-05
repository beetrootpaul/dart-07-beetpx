import { BpxVector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { g, h } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export class PlayerBullet {
  private readonly _sprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    4,
    5,
    9,
    11
  );

  private readonly _movement: Movement;

  private _isDestroyed: boolean = false;

  constructor(startXy: BpxVector2d) {
    this._movement = MovementLine.of({
      angle: 0.75,
      angledSpeed: 2.5,
    })(startXy);
  }

  get hasFinished(): boolean {
    return (
      this._isDestroyed || h.isSafelyOutsideGameplayArea(this._movement.xy)
    );
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: this._movement.xy.sub(0, 0.5),
      r: 2,
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
