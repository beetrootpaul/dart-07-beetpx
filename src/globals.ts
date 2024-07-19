import {
  $v,
  BpxCanvasSnapshotColorMapping,
  BpxRgbColor,
  BpxSpriteColorMapping,
} from "@beetpx/beetpx";
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

  viewportSize: $v(128),
  viewportTiles: $v(16),
  gameAreaSize: $v(96, 128),
  gameAreaTiles: $v(12, 16),
  gameAreaOffset: $v(16, 0),
  tileSize: $v(8),

  assets: {
    // sprite sheets
    mainSpritesheetUrl: "spritesheet_main.png",
    mission1SpritesheetUrl: "spritesheet_mission_1.png",
    mission2SpritesheetUrl: "spritesheet_mission_2.png",
    mission3SpritesheetUrl: "spritesheet_mission_3.png",

    // levels
    levelsJson: "missions.json",

    // SFX
    sfxOptionsChange: "sfx_main_0.flac",
    sfxOptionsConfirm: "sfx_main_2.flac",
    sfxPowerupNoEffect: "sfx_main_5.flac",
    sfxPowerupPicked: "sfx_main_6.flac",
    sfxPlayerShoot: "sfx_main_10.flac",
    sfxPlayerTripleShoot: "sfx_main_11.flac",
    sfxPlayerShockwave: "sfx_main_12.flac",
    sfxEnemyShoot: "sfx_main_13.flac",
    sfxEnemyMultiShoot: "sfx_main_14.flac",
    sfxDamagePlayer: "sfx_main_16.flac",
    sfxDamageEnemy: "sfx_main_17.flac",
    sfxDestroyPlayer: "sfx_main_19.flac",
    sfxDestroyEnemy: "sfx_main_20.flac",
    sfxDestroyBossPhase: "sfx_main_21.flac",
    sfxDestroyBossFinal1: "sfx_main_22.flac",
    sfxDestroyBossFinal2: "sfx_main_23.flac",
    sfxDestroyBossFinal3: "sfx_main_24.flac",
    sfxGameWin: "sfx_main_25.flac",
    music32: "sfx_main_32.flac",
    music33: "sfx_main_33.flac",
    music34: "sfx_main_34.flac",
    music35: "sfx_main_35.flac",
    music36: "sfx_main_36.flac",
    music37: "sfx_main_37.flac",
    mission1Music40: "sfx_mission_1_40.flac",
    mission1Music41: "sfx_mission_1_41.flac",
    mission1Music42: "sfx_mission_1_42.flac",
    mission1Music43: "sfx_mission_1_43.flac",
    mission1Music44: "sfx_mission_1_44.flac",
    mission1Music45: "sfx_mission_1_45.flac",
    mission1Music48: "sfx_mission_1_48.flac",
    mission1Music49: "sfx_mission_1_49.flac",
    mission1Music50: "sfx_mission_1_50.flac",
    mission1Music51: "sfx_mission_1_51.flac",
    mission1Music52: "sfx_mission_1_52.flac",
    mission1Music53: "sfx_mission_1_53.flac",
    mission1Music54: "sfx_mission_1_54.flac",
    mission1Music55: "sfx_mission_1_55.flac",
    mission1Music56: "sfx_mission_1_56.flac",
    mission2Music32: "sfx_mission_2_32.flac",
    mission2Music33: "sfx_mission_2_33.flac",
    mission3Music32: "sfx_mission_3_32.flac",
    mission3Music33: "sfx_mission_3_33.flac",
  },

  healthDefault: 3,
  healthMax: 10,
  shockwaveChargesDefault: 2,
  shockwaveChargesMax: 4,

  baseSpriteMapping: BpxSpriteColorMapping.from([
    [Pico8Colors.black, c.black],
    [Pico8Colors.storm, c.darkerBlue],
    [Pico8Colors.wine, c.darkerPurple],
    [Pico8Colors.moss, c.darkGreen],
    [Pico8Colors.tan, c.trueBlue],
    [Pico8Colors.slate, c.blueGreen],
    [Pico8Colors.silver, c.lightGrey],
    [Pico8Colors.white, c.white],
    [Pico8Colors.ember, c.red],
    [Pico8Colors.orange, c.darkOrange],
    [Pico8Colors.lemon, null],
    [Pico8Colors.lime, null],
    [Pico8Colors.sky, c.blue],
    [Pico8Colors.dusk, c.lavender],
    [Pico8Colors.pink, c.mauve],
    [Pico8Colors.peach, c.peach],
  ]),

  snapshotNegative: BpxCanvasSnapshotColorMapping.of(
    (canvasColor: BpxRgbColor | null): BpxRgbColor | null => {
      switch (canvasColor?.cssHex) {
        case c.black.cssHex:
          return c.white;
        case c.darkerBlue.cssHex:
          return c.lightGrey;
        case c.darkerPurple.cssHex:
          return c.lavender;
        case c.darkGreen.cssHex:
          return c.mauve;
        case c.trueBlue.cssHex:
          return c.darkOrange;
        case c.blueGreen.cssHex:
          return c.peach;
        case c.lightGrey.cssHex:
          return c.darkerBlue;
        case c.white.cssHex:
          return c.black;
        case c.red.cssHex:
          return c.blue;
        case c.darkOrange.cssHex:
          return c.trueBlue;
        case c.blue.cssHex:
          return c.red;
        case c.lavender.cssHex:
          return c.darkerPurple;
        case c.mauve.cssHex:
          return c.darkGreen;
        case c.peach.cssHex:
          return c.blueGreen;
        default:
          return canvasColor;
      }
    },
  ),

  snapshotDarker: BpxCanvasSnapshotColorMapping.of(
    (canvasColor: BpxRgbColor | null): BpxRgbColor | null => {
      switch (canvasColor?.cssHex) {
        case c.black.cssHex:
        case c.darkerBlue.cssHex:
        case c.darkerPurple.cssHex:
          return c.black;
        case c.trueBlue.cssHex:
        case c.blueGreen.cssHex:
        case c.mauve.cssHex:
          return c.darkerPurple;
        case c.darkGreen.cssHex:
        case c.red.cssHex:
        case c.darkOrange.cssHex:
        case c.lavender.cssHex:
          return c.mauve;
        case c.lightGrey.cssHex:
        case c.white.cssHex:
        case c.blue.cssHex:
        case c.peach.cssHex:
          return c.lavender;
        default:
          return canvasColor;
      }
    },
  ),
};
