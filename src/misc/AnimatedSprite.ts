import { spr_, transparent_, Vector2d } from "@beetpx/beetpx";
import { b, c, g } from "../globals";

// TODO: consider renaming BeetPx's Sprite to SpriteData in order to allow totally different Sprite implementation in games

export class AnimatedSprite {
  private readonly _spriteW: number;
  private readonly _spriteH: number;
  private readonly _spriteXs: number[];
  private readonly _spriteY: number;

  private readonly _frame: number;

  // TODO
  // from_left_top_corner AS LAST PARAM
  constructor(
    spriteW: number,
    spriteH: number,
    spriteXs: number[],
    spriteY: number
  ) {
    this._spriteW = spriteW;
    this._spriteH = spriteH;
    this._spriteXs = spriteXs;
    this._spriteY = spriteY;

    this._frame = 0;
    // TODO
    // local max_frame = #sprite_xs
  }

  // TODO
  //         _update = function()
  //             frame = _tni(frame, max_frame)
  //         end,

  draw(xy: Vector2d): void {
    // TODO
    xy = xy.sub(this._spriteW / 2, this._spriteH / 2);
    //             xy = (from_left_top_corner and xy or xy.minus(sprite_w / 2, sprite_h / 2))

    // TODO: BeetPx: make previous mapping include only affected colors maybe?
    const prevMapping = b.mapSpriteColors([
      { from: c._11_transparent, to: transparent_ },
    ]);

    // TODO
    b.sprite(
      // TODO: avoid `spr_` call here, pre-create all sprite in constructor
      // TODO: parametrize which url is used
      spr_(g.assets.mainSpritesheetUrl)(
        // TODO: remove "!"
        this._spriteXs[this._frame]!,
        this._spriteY,
        this._spriteW,
        this._spriteH
      ),
      xy.add(g.gameAreaOffset)
    );

    b.mapSpriteColors(prevMapping);
  }
}
