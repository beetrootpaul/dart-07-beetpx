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
      { url: g.assets.mission1Music40 },
      { url: g.assets.mission1Music41 },
      { url: g.assets.mission1Music42 },
      { url: g.assets.mission1Music43 },
      { url: g.assets.mission1Music44 },
      { url: g.assets.mission1Music45 },
      { url: g.assets.mission1Music48 },
      { url: g.assets.mission1Music49 },
      { url: g.assets.mission1Music50 },
      { url: g.assets.mission1Music51 },
      { url: g.assets.mission1Music52 },
      { url: g.assets.mission1Music53 },
      { url: g.assets.mission1Music54 },
      { url: g.assets.mission1Music55 },
      { url: g.assets.mission1Music56 },
      { url: g.assets.mission2Music32 },
      { url: g.assets.mission2Music33 },
      { url: g.assets.mission3Music32 },
      { url: g.assets.mission3Music33 },
    ],
    jsons: [{ url: g.assets.levelsJson }],
  }
).then(({ startGame }) => {
  b_.setOnStarted(() => {
    PauseMenu.isGamePaused = false;
    pauseMenu = new PauseMenu();

    b_.setRepeating("left", false);
    b_.setRepeating("right", false);
    b_.setRepeating("up", false);
    b_.setRepeating("down", false);
    b_.setRepeating("x", false);
    b_.setRepeating("o", false);
    b_.setRepeating("menu", false);

    // TODO: unify naming: sounds vs audio
    b_.stopAllSounds();

    b_.setFont(g.assets.pico8FontId);

    b_.mapSpriteColors([
      { from: Pico8Colors.black, to: c.black },
      { from: Pico8Colors.storm, to: c.darkerBlue },
      { from: Pico8Colors.wine, to: c.darkerPurple },
      { from: Pico8Colors.moss, to: c.darkGreen },
      { from: Pico8Colors.tan, to: c.trueBlue },
      { from: Pico8Colors.slate, to: c.blueGreen },
      { from: Pico8Colors.silver, to: c.lightGrey },
      { from: Pico8Colors.white, to: c.white },
      { from: Pico8Colors.ember, to: c.red },
      { from: Pico8Colors.orange, to: c.darkOrange },
      { from: Pico8Colors.lemon, to: transparent_ },
      { from: Pico8Colors.lime, to: transparent_ },
      { from: Pico8Colors.sky, to: c.blue },
      { from: Pico8Colors.dusk, to: c.lavender },
      { from: Pico8Colors.pink, to: c.mauve },
      { from: Pico8Colors.peach, to: c.peach },
    ]);

    currentScreen = new ScreenBrp();
  });

  b_.setOnUpdate(() => {
    debugGameInfo.update();

    if (b_.wasJustPressed("menu")) {
      PauseMenu.isGamePaused = !PauseMenu.isGamePaused;
    }

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
