import { BpxImageUrl, BpxSprite, BpxVector2d, spr_ } from "@beetpx/beetpx";
import { b, g } from "../globals";

// TODO: introduce StaticSprite

export class AnimatedSprite {
  static for(
    spritesheetUrl: BpxImageUrl
  ): (
    spriteW: number,
    spriteH: number,
    spriteXs: number[],
    spriteY: number,
    fromLeftTopCorner?: boolean
  ) => AnimatedSprite {
    return (spriteW, spriteH, spriteXs, spriteY, fromLeftTopCorner = false) =>
      new AnimatedSprite(
        spritesheetUrl,
        spriteW,
        spriteH,
        spriteXs,
        spriteY,
        fromLeftTopCorner
      );
  }

  private readonly _spriteFactory: (
    x1: number,
    y1: number,
    w: number,
    h: number
  ) => BpxSprite;

  private readonly _spriteW: number;
  private readonly _spriteH: number;
  private readonly _spriteXs: number[];
  private readonly _spriteY: number;

  private readonly _fromLeftTopCorner: boolean;

  private _frame: number = 0;
  private readonly _maxFrame: number;

  constructor(
    spritesheetUrl: BpxImageUrl,
    spriteW: number,
    spriteH: number,
    spriteXs: number[],
    spriteY: number,
    fromLeftTopCorner: boolean = false
  ) {
    this._spriteFactory = spr_(spritesheetUrl);

    this._spriteW = spriteW;
    this._spriteH = spriteH;
    this._spriteXs = spriteXs;
    this._spriteY = spriteY;

    this._fromLeftTopCorner = fromLeftTopCorner;

    this._maxFrame = spriteXs.length;
  }

  update(): void {
    this._frame = (this._frame + 1) % this._maxFrame;
  }

  draw(xy: BpxVector2d): void {
    xy = this._fromLeftTopCorner
      ? xy
      : xy.sub(this._spriteW / 2, this._spriteH / 2);

    b.sprite(
      // TODO: avoid a call here, pre-create all sprites in constructor
      this._spriteFactory(
        this._spriteXs[this._frame]!,
        this._spriteY,
        this._spriteW,
        this._spriteH
      ),
      xy.add(g.gameAreaOffset)
    );
  }
}
