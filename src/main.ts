import { $d, $v_0_0, $x } from "@beetpx/beetpx";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { g } from "./globals";
import { PauseMenu } from "./pause/PauseMenu";
import { pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenBrp } from "./screens/ScreenBrp";

let nextScreen: GameScreen | undefined;
let currentScreen: GameScreen | undefined;
let pauseMenu: PauseMenu | undefined;

const debugGameInfo: DebugGameInfo = new DebugGameInfo();

$x.setOnStarted(() => {
  $d.setFont(pico8Font);

  pauseMenu = new PauseMenu();

  $d.setSpriteColorMapping(g.baseSpriteMapping);

  currentScreen = new ScreenBrp();
});

$x.setOnUpdate(() => {
  debugGameInfo.update();

  if ($x.isPaused) {
    pauseMenu?.update();
  } else {
    nextScreen = currentScreen?.preUpdate();
    if (nextScreen) {
      currentScreen = nextScreen;
    }
    currentScreen?.update();
  }
});

$x.setOnDraw(() => {
  $d.setCameraXy($v_0_0);

  currentScreen?.draw();

  if ($x.isPaused) {
    pauseMenu?.draw();
  }

  if ($x.debug) {
    debugGameInfo.preDraw();
    debugGameInfo.draw();
    debugGameInfo.postDraw();
  }
});

$x.start({
  gameId: "dart-07-beetpx",
  canvasSize: "128x128",
  fixedTimestep: "60fps",
  gamePause: {
    available: true,
  },
  screenshots: {
    available: true,
  },
  requireConfirmationOnTabClose: BEETPX__IS_PROD,
  assets: [
    // IMAGE files
    g.assets.mainSpritesheetUrl,
    g.assets.mission1SpritesheetUrl,
    g.assets.mission2SpritesheetUrl,
    g.assets.mission3SpritesheetUrl,
    // SFX files
    g.assets.sfxOptionsChange,
    g.assets.sfxOptionsConfirm,
    g.assets.sfxPowerupNoEffect,
    g.assets.sfxPowerupPicked,
    g.assets.sfxPlayerShoot,
    g.assets.sfxPlayerTripleShoot,
    g.assets.sfxPlayerShockwave,
    g.assets.sfxEnemyShoot,
    g.assets.sfxEnemyMultiShoot,
    g.assets.sfxDamagePlayer,
    g.assets.sfxDamageEnemy,
    g.assets.sfxDestroyPlayer,
    g.assets.sfxDestroyEnemy,
    g.assets.sfxDestroyBossPhase,
    g.assets.sfxDestroyBossFinal1,
    g.assets.sfxDestroyBossFinal2,
    g.assets.sfxDestroyBossFinal3,
    g.assets.sfxGameWin,
    // MUSIC files
    g.assets.music32,
    g.assets.music33,
    g.assets.music34,
    g.assets.music35,
    g.assets.music36,
    g.assets.music37,
    g.assets.mission1Music40,
    g.assets.mission1Music41,
    g.assets.mission1Music42,
    g.assets.mission1Music43,
    g.assets.mission1Music44,
    g.assets.mission1Music45,
    g.assets.mission1Music48,
    g.assets.mission1Music49,
    g.assets.mission1Music50,
    g.assets.mission1Music51,
    g.assets.mission1Music52,
    g.assets.mission1Music53,
    g.assets.mission1Music54,
    g.assets.mission1Music55,
    g.assets.mission1Music56,
    g.assets.mission2Music32,
    g.assets.mission2Music33,
    g.assets.mission3Music32,
    g.assets.mission3Music33,
    // JSON files
    g.assets.levelsJson,
  ],
  debugMode: {
    available: !window.BEETPX__IS_PROD,
  },
  frameByFrame: {
    available: !window.BEETPX__IS_PROD,
  },
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

// TODO: bullet is fired immediately on mission start if the A was pressed for a bit longer on mission select screen
