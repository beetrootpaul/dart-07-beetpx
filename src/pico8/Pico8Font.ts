import {
  BpxCharSprite,
  BpxFontId,
  BpxImageUrl,
  BpxVector2d,
  v_,
  v_0_0_,
  type BpxFont,
} from "@beetpx/beetpx";
import { g } from "../globals";

function glyph(
  tileX1: number,
  tileY1: number,
  pxW: number = 3,
  pxH: number = 5,
): [BpxVector2d, BpxVector2d] {
  return [v_(tileX1 * 8, tileY1 * 8), v_(pxW, pxH)];
}

export class Pico8Font implements BpxFont {
  readonly id: BpxFontId = g.assets.pico8FontId;

  readonly imageUrl: BpxImageUrl = g.assets.pico8FontImage;

  // in PICO-8 the space takes 3 px wide, but in this game we want it to be a 1 px shorter
  static #spaceW = 2;

  static #sprites: Record<string, [BpxVector2d, BpxVector2d]> = {
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
    ["?"]: glyph(15, 3),
    ["&"]: glyph(6, 2),
    ["/"]: glyph(15, 2),
    ["."]: glyph(14, 2),
    [":"]: glyph(10, 3),
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

  spritesFor(text: string): BpxCharSprite[] {
    const charSprites: BpxCharSprite[] = [];
    let positionInText: BpxVector2d = v_0_0_;

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]!.toLowerCase();
      let sprite = Pico8Font.#sprites[char] ?? null;

      if (!sprite && i + 1 < text.length) {
        char += text[i + 1];
        sprite = Pico8Font.#sprites[char] ?? null;
      }

      if (sprite) {
        charSprites.push({
          char,
          positionInText,
          type: "image",
          spriteXyWh: sprite,
        });
      }
      const jumpX = (sprite?.[1].x ?? Pico8Font.#spaceW) + 1;
      positionInText = positionInText.add(jumpX, 0);
    }

    return charSprites;
  }
}
