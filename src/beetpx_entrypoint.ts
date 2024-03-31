import { b_, v_0_0_ } from "@beetpx/beetpx";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { c, g } from "./globals";
import { PauseMenu } from "./pause/PauseMenu";
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
    debugFeatures: !BEETPX__IS_PROD,
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
        spriteTextColor: c.white,
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
  },
).then(async ({ startGame }) => {
  b_.setOnStarted(() => {
    // Better set font first, because other constructors might rely
    //   on it when calculating text size.
    b_.setFont(g.assets.pico8FontId);

    pauseMenu = new PauseMenu();
    PauseMenu.isGamePaused = false;

    b_.setButtonRepeating("left", false);
    b_.setButtonRepeating("right", false);
    b_.setButtonRepeating("up", false);
    b_.setButtonRepeating("down", false);
    b_.setButtonRepeating("a", false);
    b_.setButtonRepeating("b", false);
    b_.setButtonRepeating("menu", false);

    b_.setSpriteColorMapping(g.baseSpriteMapping);

    currentScreen = new ScreenBrp();
  });

  b_.setOnUpdate(() => {
    debugGameInfo.update();

    if (!PauseMenu.isGamePaused && b_.wasButtonJustPressed("menu")) {
      PauseMenu.isGamePaused = true;
      b_.pauseAudio();
    }

    b_.setCameraXy(v_0_0_);

    if (PauseMenu.isGamePaused) {
      currentScreen?.pauseAnimationsAndTimers();
      pauseMenu?.update();
    } else {
      nextScreen = currentScreen?.preUpdate();
      if (nextScreen) {
        currentScreen = nextScreen;
      }
      currentScreen?.resumeAnimationsAndTimers();
      currentScreen?.update();
    }
  });

  b_.setOnDraw(() => {
    currentScreen?.draw();

    if (PauseMenu.isGamePaused) {
      pauseMenu?.draw();
    }

    if (b_.debug) {
      debugGameInfo.preDraw();
      debugGameInfo.draw();
      debugGameInfo.postDraw();
    }
  });

  await startGame();
});

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

// TODO: adapt button images to whatever input method was used last

// TODO: input tester on first start, then from the menu
