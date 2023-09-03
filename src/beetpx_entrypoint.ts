import { PauseMenu } from "./PauseMenu";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { LeveDescriptor } from "./game/LeveDescriptor";
import { b, c, g } from "./globals";
import { Mission1 } from "./missions/Mission1";
import { Pico8Colors } from "./pico8/Pico8Color";
import { Pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenMissionMain } from "./screens/ScreenMissionMain";

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
        LeveDescriptor.tmpJson = json;
      })
      .then(() => ({ startGame }));
  })
  .then(({ startGame }) => {
    b.setOnStarted(() => {
      // TODO: rework pause menu
      PauseMenu.isGamePaused = false;
      pauseMenu = new PauseMenu();

      // TODO: set repeating?
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
        { from: Pico8Colors._10_yellow, to: c._10_unused },
        { from: Pico8Colors._11_green, to: c._11_transparent },
        { from: Pico8Colors._12_blue, to: c._12_blue },
        { from: Pico8Colors._13_lavender, to: c._13_lavender },
        { from: Pico8Colors._14_pink, to: c._14_mauve },
        { from: Pico8Colors._15_lightPeach, to: c._15_peach },
      ]);

      // TODO: make it start with a real first screen (BRP)
      currentScreen = new ScreenMissionMain({
        mission: new Mission1(),
        health: 3,
        shockwaveCharges: 3,
        fastMovement: false,
        fastShoot: false,
        tripleShoot: false,
        score: 3,
      });
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
