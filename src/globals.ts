import { BpxSolidColor, BpxTransparentColor, v_ } from "@beetpx/beetpx";
import { Helpers } from "./misc/Helpers";
import { Pico8Colors } from "./pico8/Pico8Color";

export const c = {
  black: Pico8Colors.black,
  darkerBlue: Pico8Colors.midnight,
  darkerPurple: Pico8Colors.port,
  darkGreen: Pico8Colors.moss,
  trueBlue: Pico8Colors.denim,
  blueGreen: Pico8Colors.sea,
  lightGrey: Pico8Colors.silver,
  white: Pico8Colors.white,
  red: Pico8Colors.ember,
  darkOrange: Pico8Colors.amber,
  blue: Pico8Colors.sky,
  lavender: Pico8Colors.dusk,
  mauve: Pico8Colors.aubergine,
  peach: Pico8Colors.coral,
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
    music32: "sfx_main_32.wav",
    music33: "sfx_main_33.wav",
    music34: "sfx_main_34.wav",
    music35: "sfx_main_35.wav",
    music36: "sfx_main_36.wav",
    music37: "sfx_main_37.wav",
    mission1Music40: "sfx_mission_1_40.wav",
    mission1Music41: "sfx_mission_1_41.wav",
    mission1Music42: "sfx_mission_1_42.wav",
    mission1Music43: "sfx_mission_1_43.wav",
    mission1Music44: "sfx_mission_1_44.wav",
    mission1Music45: "sfx_mission_1_45.wav",
    mission1Music48: "sfx_mission_1_48.wav",
    mission1Music49: "sfx_mission_1_49.wav",
    mission1Music50: "sfx_mission_1_50.wav",
    mission1Music51: "sfx_mission_1_51.wav",
    mission1Music52: "sfx_mission_1_52.wav",
    mission1Music53: "sfx_mission_1_53.wav",
    mission1Music54: "sfx_mission_1_54.wav",
    mission1Music55: "sfx_mission_1_55.wav",
    mission1Music56: "sfx_mission_1_56.wav",
    mission2Music32: "sfx_mission_2_32.wav",
    mission2Music33: "sfx_mission_2_33.wav",
    mission3Music32: "sfx_mission_3_32.wav",
    mission3Music33: "sfx_mission_3_33.wav",
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
