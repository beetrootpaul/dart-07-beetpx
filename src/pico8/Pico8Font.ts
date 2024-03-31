import { BpxFontPico8, BpxGlyph, spr_ } from "@beetpx/beetpx";

export class Pico8Font extends BpxFontPico8 {
  constructor() {
    super();

    this.glyphs = new Map<string, BpxGlyph>([
      ...this.glyphs,
      [" ", { type: "whitespace", advance: 2 }],
      [
        "♪",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 104, 64),
          advance: 8,
        },
      ],
    ]);
  }
}
