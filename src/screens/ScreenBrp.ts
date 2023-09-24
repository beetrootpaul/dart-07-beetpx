import { spr_, Sprite, Timer } from "@beetpx/beetpx";
import { b, c, g } from "../globals";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenBrp implements GameScreen {
  private readonly _brpLogo: Sprite = spr_(g.assets.mainSpritesheetUrl)(
    99,
    114,
    29,
    14
  );

  private readonly _screenTimer: Timer;
  private readonly _fadeInTimer: Timer;
  private readonly _presentTimer: Timer;
  private readonly _fadeOutTimer: Timer;

  constructor() {
    const screenFrames = 150;
    const fadeFrames = 24;

    // TODO: make it `new Timer(framesValue)`
    this._screenTimer = new Timer({ frames: screenFrames });
    this._fadeInTimer = new Timer({ frames: fadeFrames });
    this._presentTimer = new Timer({
      frames: screenFrames - 2 * fadeFrames - 20,
    });
    this._fadeOutTimer = new Timer({ frames: fadeFrames });

    // TODO:
    //         music(0)
  }

  preUpdate(): GameScreen | undefined {
    if (this._screenTimer.hasFinished) {
      // TODO: params: 1, false, true, false
      return new ScreenTitle();
    }
  }

  update(): void {
    this._screenTimer.update();

    if (!this._fadeInTimer.hasFinished) {
      this._fadeInTimer.update();
    } else if (!this._presentTimer.hasFinished) {
      this._presentTimer.update();
    } else {
      this._fadeOutTimer.update();
    }
  }

  draw(): void {
    b.clearCanvas(c._0_black);

    let logoColor = c._15_peach;
    if (this._fadeInTimer.progress < 0.33) {
      logoColor = c._2_darker_purple;
    } else if (this._fadeInTimer.progress < 0.66) {
      logoColor = c._14_mauve;
    } else if (this._fadeInTimer.progress < 1) {
      logoColor = c._13_lavender;
    } else if (this._presentTimer.progress < 1) {
      // do nothing
    } else if (this._fadeOutTimer.progress < 0.33) {
      logoColor = c._13_lavender;
    } else if (this._fadeOutTimer.progress < 0.66) {
      logoColor = c._14_mauve;
    } else {
      logoColor = c._2_darker_purple;
    }

    if (!this._fadeOutTimer.hasFinished) {
      const prevMapping = b.mapSpriteColors([
        { from: Pico8Colors._10_yellow, to: logoColor },
      ]);
      b.sprite(
        this._brpLogo,
        g.viewportSize.sub(this._brpLogo.size().mul(2)).div(2)
        // TODO: scale x2
      );
      b.mapSpriteColors(prevMapping);
    }
  }
}
