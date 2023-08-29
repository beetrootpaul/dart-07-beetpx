import {
  CharSprite,
  FontId,
  ImageUrl,
  Sprite,
  Vector2d,
  spr_,
  type Font,
} from "@beetpx/beetpx";
import { g } from "../globals";

function glyph(
  tileX1: number,
  tileY1: number,
  pxW: number = 3,
  pxH: number = 5
): Sprite {
  return spr_(g.assets.pico8FontImage)(tileX1 * 8, tileY1 * 8, pxW, pxH);
}

export class Pico8Font implements Font {
  readonly id: FontId = g.assets.pico8FontId;

  readonly imageUrl: ImageUrl = g.assets.pico8FontImage;

  // in PICO-8 the space takes 3 px wide, but in this game we want it to be a 1 px shorter
  static #spaceW = 2;

  static #sprites: Record<string, Sprite> = {
    // TODO: uncomment or delete
    // ["⬅️"]: glyph(11, 8, 7),
    // ["⬆️"]: glyph(4, 9, 7),
    // ["➡️"]: glyph(1, 9, 7),
    // ["⬇️"]: glyph(3, 8, 7),
    ["♪"]: glyph(13, 8, 7),
    //
    ["0"]: glyph(0, 3),
    ["1"]: glyph(1, 3),
    ["2"]: glyph(2, 3),
    ["3"]: glyph(3, 3),
    ["4"]: glyph(4, 3),
    ["5"]: glyph(5, 3),
    ["6"]: glyph(6, 3),
    ["7"]: glyph(7, 3),
    ["8"]: glyph(8, 3),
    ["9"]: glyph(9, 3),
    //
    ["@"]: glyph(0, 4),
    //
    ["a"]: glyph(1, 6),
    ["b"]: glyph(2, 6),
    ["c"]: glyph(3, 6),
    ["d"]: glyph(4, 6),
    ["e"]: glyph(5, 6),
    ["f"]: glyph(6, 6),
    ["g"]: glyph(7, 6),
    ["h"]: glyph(8, 6),
    ["i"]: glyph(9, 6),
    ["j"]: glyph(10, 6),
    ["k"]: glyph(11, 6),
    ["l"]: glyph(12, 6),
    ["m"]: glyph(13, 6),
    ["n"]: glyph(14, 6),
    ["o"]: glyph(15, 6),
    ["p"]: glyph(0, 7),
    ["q"]: glyph(1, 7),
    ["r"]: glyph(2, 7),
    ["s"]: glyph(3, 7),
    ["t"]: glyph(4, 7),
    ["u"]: glyph(5, 7),
    ["v"]: glyph(6, 7),
    ["w"]: glyph(7, 7),
    ["x"]: glyph(8, 7),
    ["y"]: glyph(9, 7),
    ["z"]: glyph(10, 7),
  };

  spritesFor(text: string): CharSprite[] {
    const charSprites: CharSprite[] = [];
    let positionInText: Vector2d = Vector2d.zero;

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]!.toLowerCase();
      let sprite = Pico8Font.#sprites[char] ?? null;

      // TODO: rework?
      // Maybe it's a 2-chars long emoji?
      if (!sprite && i + 1 < text.length) {
        char += text[i + 1];
        sprite = Pico8Font.#sprites[char] ?? null;
      }

      if (sprite) {
        charSprites.push({ positionInText, sprite, char });
      }
      const jumpX = (sprite?.size().x ?? Pico8Font.#spaceW) + 1;
      positionInText = positionInText.add(jumpX, 0);
    }

    return charSprites;
  }
}
