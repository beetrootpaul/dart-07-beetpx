import { BeetPx } from "@beetpx/beetpx";
import { DebugGameInfo } from "./debug/DebugGameInfo";
import { c, g } from "./globals";
import { Pico8Font } from "./pico8/Pico8Font";
import { GameScreen } from "./screens/GameScreen";
import { ScreenMainMenuSelectMission } from "./screens/ScreenMainMenuSelectMission";

export class Game {
  private _nextScreen: GameScreen | undefined;
  private _currentScreen: GameScreen | undefined;

  start(): void {
    BeetPx.init(
      {
        gameCanvasSize: "128x128",
        desiredFps: g.fps,
        visibleTouchButtons: ["left", "right", "up", "down", "o", "x", "menu"],
        logActualFps: !__BEETPX_IS_PROD__,
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
      BeetPx.setOnStarted(() => {
        // TODO: set repeating?
        // TODO: pause menu
        // TODO: stopAllSounds

        BeetPx.setFont(g.assets.pico8FontId);

        // TODO: make it start with a real first screen (BRP)
        this._nextScreen = new ScreenMainMenuSelectMission();
      });

      BeetPx.setOnUpdate(() => {
        this._currentScreen = this._nextScreen;
        this._nextScreen = this._currentScreen?.update();
      });

      BeetPx.setOnDraw(() => {
        // TODO: clear canvas
        // TODO: map colors
        // TODO: print audiocontext state and FPS

        this._currentScreen?.draw();

        if (BeetPx.debug) DebugGameInfo.draw();
      });

      startGame();
    });
  }
}
