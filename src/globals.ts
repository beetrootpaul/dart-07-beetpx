import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { MissionMetadata } from "./MissionMetadata";
import { AnimatedSprite } from "./misc/AnimatedSprite";
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

const tileSize = 8;

// TODO: move to a separate mission params file
let wavesTileOffsetY = 0;

// TODO: move to a separate mission params file
const m1ScrollPerFrame = 0.5;

// TODO: inline
const mainSpritesheetUrl = "spritesheet_main.png";
const mission1SpritesheetUrl = "spritesheet_mission_1.png";

// TODO: move to a separate mission params file
const m1WaveTile = new AnimatedSprite(
  mission1SpritesheetUrl,
  8,
  8,
  [
    // TODO: replace with some smart syntax which helps to understand how much of each frame
    24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
    32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 48, 48, 48, 48, 48,
    48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
  ],
  56,
  true
);

export const g = {
  // TODO: do we use it anywhere else than BeetPx config? Can we inline it?
  fps: 60 as const,

  viewportSize: v_(128, 128),
  gameAreaSize: v_(96, 128),
  gameAreaOffset: v_(16, 0),
  tileSize: v_(tileSize, tileSize),

  assets: {
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
    mainSpritesheetUrl: mainSpritesheetUrl,
    mission1SpritesheetUrl: mission1SpritesheetUrl,
  },

  healthMax: 10,
  shockwaveChargesMax: 4,

  missions: [
    // TODO: move to a separate mission params file
    {
      missionNumber: 1,
      missionName: "emerald islands",
      bgColor: c._4_true_blue,
      missionInfoColor: c._9_dark_orange,
      spritesheetUrl: mission1SpritesheetUrl,
      levelBgUpdate: () => {
        wavesTileOffsetY = (wavesTileOffsetY + m1ScrollPerFrame) % tileSize;
        m1WaveTile.update();
      },
      levelBgDraw: () => {
        for (let distance = 0; distance <= 16; distance++) {
          for (let lane = 1; lane <= 12; lane++) {
            m1WaveTile.draw(
              v_(
                (lane - 1) * tileSize,
                Math.ceil((distance - 1) * tileSize + wavesTileOffsetY)
              )
            );
          }
        }
      },
    },
  ] satisfies MissionMetadata[],
};
