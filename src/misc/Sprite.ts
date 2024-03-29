import {
  b_,
  BpxImageUrl,
  BpxSprite,
  BpxVector2d,
  spr_,
  u_,
  v_,
  v_0_0_,
} from "@beetpx/beetpx";
import { g } from "../globals";

export abstract class Sprite {
  static for(spritesheetUrl: BpxImageUrl) {
    return {
      static(
        spriteW: number,
        spriteH: number,
        spriteX: number,
        spriteY: number,
        fromLeftTopCorner: boolean = false,
      ): StaticSprite {
        return new StaticSprite(
          spritesheetUrl,
          spriteW,
          spriteH,
          spriteX,
          spriteY,
          fromLeftTopCorner,
        );
      },
      animated(
        spriteW: number,
        spriteH: number,
        spriteXs: number[],
        spriteY: number,
        fromLeftTopCorner: boolean = false,
      ): AnimatedSprite {
        return new AnimatedSprite(
          spritesheetUrl,
          spriteW,
          spriteH,
          spriteXs,
          spriteY,
          fromLeftTopCorner,
        );
      },
    };
  }

  abstract update(): void;

  abstract draw(xy: BpxVector2d): void;
}

export class StaticSprite implements Sprite {
  private readonly _sprite: BpxSprite;

  private readonly _drawOffset: BpxVector2d;

  constructor(
    spritesheetUrl: BpxImageUrl,
    spriteW: number,
    spriteH: number,
    spriteX: number,
    spriteY: number,
    fromLeftTopCorner: boolean = false,
  ) {
    this._sprite = spr_(spritesheetUrl)(spriteX, spriteY, spriteW, spriteH);

    this._drawOffset = fromLeftTopCorner
      ? v_0_0_
      : v_(-spriteW / 2, -spriteH / 2);
  }

  update(): void {}

  draw(xy: BpxVector2d): void {
    b_.sprite(this._sprite, xy.add(g.gameAreaOffset).add(this._drawOffset));
  }
}

export class AnimatedSprite implements Sprite {
  private readonly _sprites: BpxSprite[];

  private readonly _drawOffset: BpxVector2d;

  private _frame: number = 0;
  private readonly _maxFrame: number;

  constructor(
    spritesheetUrl: BpxImageUrl,
    spriteW: number,
    spriteH: number,
    spriteXs: number[],
    spriteY: number,
    fromLeftTopCorner: boolean = false,
  ) {
    this._maxFrame = spriteXs.length;

    this._sprites = u_
      .range(this._maxFrame)
      .map((frame) =>
        spr_(spritesheetUrl)(spriteXs[frame]!, spriteY, spriteW, spriteH),
      );

    this._drawOffset = fromLeftTopCorner
      ? v_0_0_
      : v_(-spriteW / 2, -spriteH / 2);
  }

  update(): void {
    this._frame = (this._frame + 1) % this._maxFrame;
  }

  draw(xy: BpxVector2d): void {
    b_.sprite(
      this._sprites[this._frame]!,
      xy.add(g.gameAreaOffset).add(this._drawOffset),
    );
  }
}
