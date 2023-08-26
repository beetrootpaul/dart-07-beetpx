import { DebugGameInfo } from "./debug/DebugGameInfo";
import { b, c, g } from "./globals";
import { Pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenMissionMain } from "./screens/ScreenMissionMain";

let nextScreen: GameScreen | undefined;
let currentScreen: GameScreen | undefined;

b.init(
  {
    gameCanvasSize: "128x128",
    visibleTouchButtons: ["left", "right", "up", "down", "o", "x", "menu"],
    debug: {
      available: !__BEETPX_IS_PROD__,
      toggleKey: ";",
      frameByFrame: {
        activateKey: ",",
        stepKey: ".",
      },
    },
  },
  {
    images: [],
    fonts: [
      {
        font: new Pico8Font(),
        imageTextColor: c.white,
        imageBgColor: c.black,
      },
    ],
    sounds: [],
  }
).then(({ startGame }) => {
  b.setOnStarted(() => {
    // TODO: set repeating?
    // TODO: pause menu
    // TODO: stopAllSounds

    b.setFont(g.assets.pico8FontId);

    // TODO: make it start with a real first screen (BRP)
    currentScreen = new ScreenMissionMain({
      metadata: g.missions[0]!,
      health: 3,
      shockwaveCharges: 3,
      fastMovement: false,
      fastShoot: false,
      tripleShoot: false,
      score: 3,
    });
  });

  b.setOnUpdate(() => {
    nextScreen = currentScreen?.conclude();
    if (nextScreen) {
      currentScreen = nextScreen;
    }
    currentScreen?.update();
  });

  b.setOnDraw(() => {
    // TODO: clear canvas
    // TODO: map colors
    // TODO: print audiocontext state and FPS

    currentScreen?.draw();

    if (b.debug) DebugGameInfo.draw();
  });

  startGame();
});
