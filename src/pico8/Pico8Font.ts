import { BpxGlyph, font_, font_pico8_ } from "@beetpx/beetpx";

export const pico8Font = font_(font_pico8_, baseFontConfig => ({
  ...baseFontConfig,
  glyphs: new Map<string, BpxGlyph>([
    ...baseFontConfig.glyphs,
    [" ", { type: "whitespace", advance: 2 }],
  ]),
}));
