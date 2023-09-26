import { BeetPx, MappingColor, Utils, v_ } from "@beetpx/beetpx";
import { Helpers } from "./misc/Helpers";
import { Pico8Colors } from "./pico8/Pico8Color";

export const b = BeetPx;

// TODO: rework PICO-8 color names and these names here? Context: palette is "0,129,130,3,140,131,6,7,8,137,10,11,12,13,141,143"
export const c = {
  _0_black: Pico8Colors._0_black,
  _1_darker_blue: Pico8Colors._129_darkerBlue,
  _2_darker_purple: Pico8Colors._130_darkerPurple,
  _3_dark_green: Pico8Colors._3_darkGreen,
  _4_true_blue: Pico8Colors._140_trueBlue,
  _5_blue_green: Pico8Colors._131_blueGreen,
  _6_light_grey: Pico8Colors._6_lightGrey,
  _7_white: Pico8Colors._7_white,
  _8_red: Pico8Colors._8_red,
  _9_dark_orange: Pico8Colors._137_darkOrange,
  _12_blue: Pico8Colors._12_blue,
  _13_lavender: Pico8Colors._13_lavender,
  _14_mauve: Pico8Colors._141_mauve,
  _15_peach: Pico8Colors._143_peach,
};

export const u = Utils;

export const h = Helpers;

// TODO: inline
export const g = {
  // TODO: do we use it anywhere else than BeetPx config? Can we inline it?
  fps: 60 as const,

  viewportSize: v_(128, 128),
  viewportTiles: v_(16, 16),
  gameAreaSize: v_(96, 128),
  gameAreaTiles: v_(12, 16),
  gameAreaOffset: v_(16, 0),
  tileSize: v_(8, 8),

  assets: {
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
    mainSpritesheetUrl: "spritesheet_main.png",
    mission1SpritesheetUrl: "spritesheet_mission_1.png",
    mission2SpritesheetUrl: "spritesheet_mission_2.png",
    mission3SpritesheetUrl: "spritesheet_mission_3.png",
  },

  healthDefault: 3,
  healthMax: 10,
  shockwaveChargesDefault: 2,
  shockwaveChargesMax: 4,

  negativeColor: new MappingColor((canvasColor) => {
    switch (canvasColor.id) {
      case c._0_black.id:
        return c._7_white;
      case c._1_darker_blue.id:
        return c._6_light_grey;
      case c._2_darker_purple.id:
        return c._13_lavender;
      case c._3_dark_green.id:
        return c._14_mauve;
      case c._4_true_blue.id:
        return c._9_dark_orange;
      case c._5_blue_green.id:
        return c._15_peach;
      case c._6_light_grey.id:
        return c._1_darker_blue;
      case c._7_white.id:
        return c._0_black;
      case c._8_red.id:
        return c._12_blue;
      case c._9_dark_orange.id:
        return c._4_true_blue;
      case c._12_blue.id:
        return c._8_red;
      case c._13_lavender.id:
        return c._2_darker_purple;
      case c._14_mauve.id:
        return c._3_dark_green;
      case c._15_peach.id:
        return c._5_blue_green;
      default:
        return canvasColor;
    }
  }),
};
