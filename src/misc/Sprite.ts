import {
  $aspr,
  $d,
  $spr,
  $v,
  $v_0_0,
  BpxAnimatedSprite,
  BpxImageUrl,
  BpxSprite,
  BpxVector2d,
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
    this._sprite = $spr(spritesheetUrl)(spriteW, spriteH, spriteX, spriteY);

    this._drawOffset =
      fromLeftTopCorner ? $v_0_0 : $v(-spriteW / 2, -spriteH / 2);
  }

  draw(xy: BpxVector2d): void {
    $d.sprite(this._sprite, xy.add(g.gameAreaOffset).add(this._drawOffset));
  }
}

export class AnimatedSprite implements Sprite {
  private readonly _animatedSprite: BpxAnimatedSprite;

  private readonly _drawOffset: BpxVector2d;

  constructor(
    spritesheetUrl: BpxImageUrl,
    spriteW: number,
    spriteH: number,
    spriteXs: number[],
    spriteY: number,
    fromLeftTopCorner: boolean = false,
  ) {
    this._animatedSprite = $aspr(spritesheetUrl)(
      spriteW,
      spriteH,
      spriteXs.map(x => [x, spriteY]),
    );

    this._drawOffset =
      fromLeftTopCorner ? $v_0_0 : $v(-spriteW / 2, -spriteH / 2);
  }

  draw(xy: BpxVector2d): void {
    $d.sprite(
      this._animatedSprite.current,
      xy.add(g.gameAreaOffset).add(this._drawOffset),
    );
  }
}
