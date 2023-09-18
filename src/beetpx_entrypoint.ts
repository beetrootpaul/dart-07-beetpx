import { transparent_ } from "@beetpx/beetpx";
import { PauseMenu } from "./PauseMenu";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { LevelDescriptor } from "./game/LevelDescriptor";
import { b, c, g } from "./globals";
import { Pico8Colors } from "./pico8/Pico8Color";
import { Pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenBrp } from "./screens/ScreenBrp";

let nextScreen: GameScreen | undefined;
let currentScreen: GameScreen | undefined;
// TODO: rework pause menu
let pauseMenu: PauseMenu | undefined;

const debugGameInfo: DebugGameInfo = new DebugGameInfo();

b.init(
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
        imageTextColor: c._7_white,
        imageBgColor: c._0_black,
      },
    ],
    sounds: [],
  }
)
  // TODO: rework, move JSON fetch to BeetPx
  .then(({ startGame }) => {
    return fetch("missions.json")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        LevelDescriptor.tmpJson = json;
      })
      .then(() => ({ startGame }));
  })
  .then(({ startGame }) => {
    b.setOnStarted(() => {
      // TODO: rework pause menu
      PauseMenu.isGamePaused = false;
      pauseMenu = new PauseMenu();

      b.setRepeating("left", false);
      b.setRepeating("right", false);
      b.setRepeating("up", false);
      b.setRepeating("down", false);
      b.setRepeating("x", false);
      b.setRepeating("o", false);
      b.setRepeating("menu", false);

      // TODO: pause menu
      // TODO: stopAllSounds

      b.setFont(g.assets.pico8FontId);

      b.mapSpriteColors([
        { from: Pico8Colors._0_black, to: c._0_black },
        { from: Pico8Colors._1_darkBlue, to: c._1_darker_blue },
        { from: Pico8Colors._2_darkPurple, to: c._2_darker_purple },
        { from: Pico8Colors._3_darkGreen, to: c._3_dark_green },
        { from: Pico8Colors._4_brown, to: c._4_true_blue },
        { from: Pico8Colors._5_darkGrey, to: c._5_blue_green },
        { from: Pico8Colors._6_lightGrey, to: c._6_light_grey },
        { from: Pico8Colors._7_white, to: c._7_white },
        { from: Pico8Colors._8_red, to: c._8_red },
        { from: Pico8Colors._9_orange, to: c._9_dark_orange },
        { from: Pico8Colors._10_yellow, to: transparent_ },
        { from: Pico8Colors._11_green, to: transparent_ },
        { from: Pico8Colors._12_blue, to: c._12_blue },
        { from: Pico8Colors._13_lavender, to: c._13_lavender },
        { from: Pico8Colors._14_pink, to: c._14_mauve },
        { from: Pico8Colors._15_lightPeach, to: c._15_peach },
      ]);

      // TODO: REVERT
      currentScreen = new ScreenBrp();
      // currentScreen = new ScreenOver({
      //   game: new Game({
      //     tripleShoot: true,
      //     fastMovement: true,
      //     score: 123,
      //     shockwaveCharges: 3,
      //     health: 4,
      //     fastShoot: true,
      //   }),
      //   isWin: true,
      // });
      // currentScreen = new ScreenMissionEnd({
      //   game: new Game({
      //     tripleShoot: true,
      //     fastMovement: true,
      //     score: 123,
      //     shockwaveCharges: 3,
      //     health: 4,
      //     fastShoot: true,
      //   }),
      //   hud: new Hud({
      //     waitFrames: 1,
      //     slideInFrames: 1,
      //   }),
      // });
    });

    b.setOnUpdate(() => {
      debugGameInfo.update();

      // TODO: rework pause menu
      if (b.wasJustPressed("menu")) {
        PauseMenu.isGamePaused = !PauseMenu.isGamePaused;
      }

      // TODO: rework pause menu
      if (PauseMenu.isGamePaused) {
        pauseMenu?.update();
      } else {
        // TODO: consider a dedicated `setOnPreUpdate` in BeetPx
        nextScreen = currentScreen?.preUpdate();
        if (nextScreen) {
          currentScreen = nextScreen;
        }
        currentScreen?.update();
      }
    });

    b.setOnDraw(() => {
      // TODO: clear canvas
      // TODO: map colors
      // TODO: print audiocontext state and FPS

      currentScreen?.draw();

      // TODO: rework pause menu
      if (PauseMenu.isGamePaused) {
        pauseMenu?.draw();
      }

      debugGameInfo.preDraw();
      if (b.debug) debugGameInfo.draw();
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

// TODO: pause menu: controls test
// TODO: pause menu: music on/off/volume
