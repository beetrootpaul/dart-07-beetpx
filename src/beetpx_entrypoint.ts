import { b_, transparent_ } from "@beetpx/beetpx";
import { PauseMenu } from "./PauseMenu";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { c, g } from "./globals";
import { Pico8Colors } from "./pico8/Pico8Color";
import { Pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenBrp } from "./screens/ScreenBrp";

let nextScreen: GameScreen | undefined;
let currentScreen: GameScreen | undefined;
// TODO: rework pause menu
let pauseMenu: PauseMenu | undefined;

const debugGameInfo: DebugGameInfo = new DebugGameInfo();

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: g.fps,
    visibleTouchButtons: ["left", "right", "up", "down", "o", "x", "menu"],
    debugFeatures: !__BEETPX_IS_PROD__,
  },
  {
    images: [
      { url: g.assets.mainSpritesheetUrl },
      { url: g.assets.mission1SpritesheetUrl },
      { url: g.assets.mission2SpritesheetUrl },
      { url: g.assets.mission3SpritesheetUrl },
    ],
    fonts: [
      {
        font: new Pico8Font(),
        imageTextColor: c.white,
        imageBgColor: c.black,
      },
    ],
    sounds: [
      { url: g.assets.sfxOptionsChange },
      { url: g.assets.sfxOptionsConfirm },
      { url: g.assets.sfxPowerupNoEffect },
      { url: g.assets.sfxPowerupPicked },
      { url: g.assets.sfxPlayerShoot },
      { url: g.assets.sfxPlayerTripleShoot },
      { url: g.assets.sfxPlayerShockwave },
      { url: g.assets.sfxEnemyShoot },
      { url: g.assets.sfxEnemyMultiShoot },
      { url: g.assets.sfxDamagePlayer },
      { url: g.assets.sfxDamageEnemy },
      { url: g.assets.sfxDestroyPlayer },
      { url: g.assets.sfxDestroyEnemy },
      { url: g.assets.sfxDestroyBossPhase },
      { url: g.assets.sfxDestroyBossFinal1 },
      { url: g.assets.sfxDestroyBossFinal2 },
      { url: g.assets.sfxDestroyBossFinal3 },
      { url: g.assets.sfxGameWin },
      { url: g.assets.music32 },
      { url: g.assets.music33 },
      { url: g.assets.music34 },
      { url: g.assets.music35 },
      { url: g.assets.music36 },
      { url: g.assets.music37 },
    ],
    jsons: [{ url: g.assets.levelsJson }],
  }
).then(({ startGame }) => {
  b_.setOnStarted(() => {
    // TODO: rework pause menu
    PauseMenu.isGamePaused = false;
    pauseMenu = new PauseMenu();

    b_.setRepeating("left", false);
    b_.setRepeating("right", false);
    b_.setRepeating("up", false);
    b_.setRepeating("down", false);
    b_.setRepeating("x", false);
    b_.setRepeating("o", false);
    b_.setRepeating("menu", false);

    // TODO: pause menu
    // TODO: stopAllSounds

    b_.setFont(g.assets.pico8FontId);

    b_.mapSpriteColors([
      { from: Pico8Colors._0_black, to: c.black },
      { from: Pico8Colors._1_darkBlue, to: c.darkerBlue },
      { from: Pico8Colors._2_darkPurple, to: c.darkerPurple },
      { from: Pico8Colors._3_darkGreen, to: c.darkGreen },
      { from: Pico8Colors._4_brown, to: c.trueBlue },
      { from: Pico8Colors._5_darkGrey, to: c.blueGreen },
      { from: Pico8Colors._6_lightGrey, to: c.lightGrey },
      { from: Pico8Colors._7_white, to: c.white },
      { from: Pico8Colors._8_red, to: c.red },
      { from: Pico8Colors._9_orange, to: c.darkOrange },
      { from: Pico8Colors._10_yellow, to: transparent_ },
      { from: Pico8Colors._11_green, to: transparent_ },
      { from: Pico8Colors._12_blue, to: c.blue },
      { from: Pico8Colors._13_lavender, to: c.lavender },
      { from: Pico8Colors._14_pink, to: c.mauve },
      { from: Pico8Colors._15_lightPeach, to: c.peach },
    ]);

    currentScreen = new ScreenBrp();
  });

  b_.setOnUpdate(() => {
    debugGameInfo.update();

    // TODO: rework pause menu
    if (b_.wasJustPressed("menu")) {
      PauseMenu.isGamePaused = !PauseMenu.isGamePaused;
    }

    // TODO: rework pause menu
    if (PauseMenu.isGamePaused) {
      pauseMenu?.update();
    } else {
      nextScreen = currentScreen?.preUpdate();
      if (nextScreen) {
        currentScreen = nextScreen;
      }
      currentScreen?.update();
    }
  });

  b_.setOnDraw(() => {
    currentScreen?.draw();

    if (PauseMenu.isGamePaused) {
      pauseMenu?.draw();
    }

    debugGameInfo.preDraw();
    if (b_.debug) debugGameInfo.draw();
    debugGameInfo.postDraw();
  });

  startGame();
});

// TODO: performance improvements to reach ~55 FPS?

// TODO: use versioned BeetPx from npm

// TODO: polishing: music: mission 2
// TODO: polishing: music: mission 2 boss
// TODO: polishing: music: mission 3
// TODO: polishing: music: mission 3 boss
// TODO: polishing: sprites: mission 2: enemies
// TODO: polishing: sprites: mission 2: boss
// TODO: polishing: sprites: mission 3: enemies
// TODO: polishing: sprites: mission 3: boss
// TODO: balancing: powerup distributions: mission 2
// TODO: balancing: powerup distributions: mission 3
// TODO: balancing: mission 2: enemy types, health, speed, their bullets: timer, speed, amount, angles, timer, SFX or not
// TODO: balancing: mission 3: enemy types, health, speed, their bullets: timer, speed, amount, angles, timer, SFX or not

// TODO: pause menu: input tester
// TODO: pause menu: music on/off/volume
