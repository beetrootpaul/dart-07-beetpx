import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
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
  // TODO: do we need this one?
  _10_unused: Pico8Colors._10_yellow,
  _11_transparent: Pico8Colors._11_green,
  _12_blue: Pico8Colors._12_blue,
  _13_lavender: Pico8Colors._13_lavender,
  _14_mauve: Pico8Colors._141_mauve,
  _15_peach: Pico8Colors._143_peach,
};

export const u = Utils;

// TODO: inline
export const g = {
  // TODO: do we use it anywhere else than BeetPx config? Can we inline it?
  fps: 60 as const,

  viewportSize: v_(128, 128),
  gameAreaSize: v_(96, 128),
  gameAreaOffset: v_(16, 0),
  tileSize: v_(8, 8),

  assets: {
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
    mainSpritesheetUrl: "spritesheet_main.png",
    mission1SpritesheetUrl: "spritesheet_mission_1.png",
  },

  healthMax: 10,
  shockwaveChargesMax: 4,
};
