import { $font, $font_pico8, BpxGlyph } from "@beetpx/beetpx";

export const pico8Font = $font($font_pico8, baseFontConfig => ({
  ...baseFontConfig,
  glyphs: new Map<string, BpxGlyph>([
    ...baseFontConfig.glyphs,
    [" ", { type: "whitespace", advance: 2 }],
  ]),
}));
