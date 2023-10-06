import { BpxSolidColor, BpxTransparentColor, v_ } from "@beetpx/beetpx";
import { Helpers } from "./misc/Helpers";
import { Pico8Colors } from "./pico8/Pico8Color";

export const c = {
  black: Pico8Colors._0_black,
  darkerBlue: Pico8Colors._129_darkerBlue,
  darkerPurple: Pico8Colors._130_darkerPurple,
  darkGreen: Pico8Colors._3_darkGreen,
  trueBlue: Pico8Colors._140_trueBlue,
  blueGreen: Pico8Colors._131_blueGreen,
  lightGrey: Pico8Colors._6_lightGrey,
  white: Pico8Colors._7_white,
  red: Pico8Colors._8_red,
  darkOrange: Pico8Colors._137_darkOrange,
  blue: Pico8Colors._12_blue,
  lavender: Pico8Colors._13_lavender,
  mauve: Pico8Colors._141_mauve,
  peach: Pico8Colors._143_peach,
};

export const h = Helpers;

export const g = {
  gameVersion: "V0.4.0",

  fps: 60 as const,

  viewportSize: v_(128, 128),
  viewportTiles: v_(16, 16),
  gameAreaSize: v_(96, 128),
  gameAreaTiles: v_(12, 16),
  gameAreaOffset: v_(16, 0),
  tileSize: v_(8, 8),

  assets: {
    // PICO-8 font
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",

    // sprite sheets
    mainSpritesheetUrl: "spritesheet_main.png",
    mission1SpritesheetUrl: "spritesheet_mission_1.png",
    mission2SpritesheetUrl: "spritesheet_mission_2.png",
    mission3SpritesheetUrl: "spritesheet_mission_3.png",

    // levels
    levelsJson: "missions.json",

    // SFX
    sfxOptionsChange: "sfx_main_0.wav",
    sfxOptionsConfirm: "sfx_main_2.wav",
    sfxPowerupNoEffect: "sfx_main_5.wav",
    sfxPowerupPicked: "sfx_main_6.wav",
    sfxPlayerShoot: "sfx_main_10.wav",
    sfxPlayerTripleShoot: "sfx_main_11.wav",
    sfxPlayerShockwave: "sfx_main_12.wav",
    sfxEnemyShoot: "sfx_main_13.wav",
    sfxEnemyMultiShoot: "sfx_main_14.wav",
    sfxDamagePlayer: "sfx_main_16.wav",
    sfxDamageEnemy: "sfx_main_17.wav",
    sfxDestroyPlayer: "sfx_main_19.wav",
    sfxDestroyEnemy: "sfx_main_20.wav",
    sfxDestroyBossPhase: "sfx_main_21.wav",
    sfxDestroyBossFinal1: "sfx_main_22.wav",
    sfxDestroyBossFinal2: "sfx_main_23.wav",
    sfxDestroyBossFinal3: "sfx_main_24.wav",
    sfxGameWin: "sfx_main_25.wav",
  },

  healthDefault: 3,
  healthMax: 10,
  shockwaveChargesDefault: 2,
  shockwaveChargesMax: 4,

  negativeColorMapping: (
    canvasColor: BpxSolidColor | BpxTransparentColor
  ): BpxSolidColor | BpxTransparentColor => {
    switch (canvasColor.id) {
      case c.black.id:
        return c.white;
      case c.darkerBlue.id:
        return c.lightGrey;
      case c.darkerPurple.id:
        return c.lavender;
      case c.darkGreen.id:
        return c.mauve;
      case c.trueBlue.id:
        return c.darkOrange;
      case c.blueGreen.id:
        return c.peach;
      case c.lightGrey.id:
        return c.darkerBlue;
      case c.white.id:
        return c.black;
      case c.red.id:
        return c.blue;
      case c.darkOrange.id:
        return c.trueBlue;
      case c.blue.id:
        return c.red;
      case c.lavender.id:
        return c.darkerPurple;
      case c.mauve.id:
        return c.darkGreen;
      case c.peach.id:
        return c.blueGreen;
      default:
        return canvasColor;
    }
  },

  darkerColorMapping: (
    canvasColor: BpxSolidColor | BpxTransparentColor
  ): BpxSolidColor | BpxTransparentColor => {
    switch (canvasColor.id) {
      case c.black.id:
      case c.darkerBlue.id:
      case c.darkerPurple.id:
        return c.black;
      case c.trueBlue.id:
      case c.blueGreen.id:
      case c.mauve.id:
        return c.darkerPurple;
      case c.darkGreen.id:
      case c.red.id:
      case c.darkOrange.id:
      case c.lavender.id:
        return c.mauve;
      case c.lightGrey.id:
      case c.white.id:
      case c.blue.id:
      case c.peach.id:
        return c.lavender;
      default:
        return canvasColor;
    }
  },
};
