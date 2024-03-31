import { BpxVector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { g, h } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";
import { MovementLine } from "../movement/MovementLine";

export enum PowerupType {
  Health,
  FastMovement,
  TripleShoot,
  FastShoot,
  ShockwaveCharge,
}

// TODO: consider making powerups more rare and not lost on damage… or re-appearing before the player after damage
export class Powerup {
  static for(type: string, startXy: BpxVector2d): Powerup | null {
    switch (type) {
      case "-":
        return null;
      case "h":
        return new Powerup(PowerupType.Health, startXy);
      case "m":
        return new Powerup(PowerupType.FastMovement, startXy);
      case "t":
        return new Powerup(PowerupType.TripleShoot, startXy);
      case "f":
        return new Powerup(PowerupType.FastShoot, startXy);
      case "s":
        return new Powerup(PowerupType.ShockwaveCharge, startXy);
      default:
        throw Error(`Unexpected powerup type "${type}"`);
    }
  }

  readonly type: PowerupType;

  private readonly _movement: Movement;
  private readonly _sprite: Sprite;

  private _isPicked: boolean = false;

  constructor(type: PowerupType, startXy: BpxVector2d) {
    this.type = type;

    this._movement = MovementLine.of({
      angle: 0.25,
      angledSpeed: 0.5,
    })(startXy);

    switch (type) {
      case PowerupType.Health: {
        this._sprite = new StaticSprite(
          g.assets.mainSpritesheetUrl,
          9,
          8,
          18,
          16,
        );
        break;
      }
      case PowerupType.FastMovement: {
        this._sprite = new StaticSprite(
          g.assets.mainSpritesheetUrl,
          9,
          8,
          9,
          16,
        );
        break;
      }
      case PowerupType.TripleShoot: {
        this._sprite = new StaticSprite(
          g.assets.mainSpritesheetUrl,
          9,
          8,
          18,
          24,
        );
        break;
      }
      case PowerupType.FastShoot: {
        this._sprite = new StaticSprite(
          g.assets.mainSpritesheetUrl,
          9,
          8,
          9,
          24,
        );
        break;
      }
      case PowerupType.ShockwaveCharge: {
        this._sprite = new StaticSprite(
          g.assets.mainSpritesheetUrl,
          9,
          8,
          27,
          24,
        );
        break;
      }
    }
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: this._movement.xy,
      r: 7,
    };
  }

  get hasFinished(): boolean {
    return this._isPicked || h.isSafelyOutsideGameplayArea(this._movement.xy);
  }

  pick(): void {
    this._isPicked = true;
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
