import { spr_, Vector2d } from "@beetpx/beetpx";
import { b, g } from "../globals";

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
    //
    //             palt(_color_0_black, false)
    //             palt(_color_11_transparent, true)

    // TODO
    b.sprite(
      // TODO: avoid `spr_` call here, pre-create all sprite in construtor
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

    // TODO
    //             palt()
  }
}
