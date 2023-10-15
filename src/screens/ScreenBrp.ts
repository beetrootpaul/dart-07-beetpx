import { b_, BpxSprite, BpxTimer, spr_, timer_, v_ } from "@beetpx/beetpx";
import { c, g } from "../globals";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenBrp implements GameScreen {
  private readonly _brpLogo: BpxSprite = spr_(g.assets.mainSpritesheetUrl)(
    99,
    114,
    29,
    14
  );

  private readonly _screenTimer: BpxTimer;
  private readonly _fadeInTimer: BpxTimer;
  private readonly _presentTimer: BpxTimer;
  private readonly _fadeOutTimer: BpxTimer;

  private _skip: boolean = false;

  constructor() {
    const screenFrames = 150;
    const fadeFrames = 24;

    this._screenTimer = timer_(screenFrames);
    this._fadeInTimer = timer_(fadeFrames);
    this._presentTimer = timer_(screenFrames - 2 * fadeFrames - 20);
    this._fadeOutTimer = timer_(fadeFrames);

    // TODO: There are gaps between sequence entries. Would need to rework an entire
    //       audio sequence playback and make it synced with audioContext time :-(
    const halfDuration = (fullSoundDurationMs: number) =>
      (fullSoundDurationMs * 16) / 32;
    b_.playSoundSequence({
      sequence: [
        [{ url: g.assets.music32, durationMs: halfDuration }],
        [{ url: g.assets.music33, durationMs: halfDuration }],
      ],
      sequenceLooped: [
        [{ url: g.assets.music34 }, { url: g.assets.music36 }],
        [{ url: g.assets.music35 }, { url: g.assets.music37 }],
      ],
    });
  }

  preUpdate(): GameScreen | undefined {
    if (this._skip || this._screenTimer.hasFinished) {
      // TODO: params: 1, true, false
      return new ScreenTitle({ startMusic: false });
    }
  }

  update(): void {
    if (b_.wasJustPressed("x") || b_.wasJustPressed("o")) {
      this._skip = true;
    }

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
    b_.clearCanvas(c.black);

    let logoColor = c.peach;
    if (this._fadeInTimer.progress < 0.33) {
      logoColor = c.darkerPurple;
    } else if (this._fadeInTimer.progress < 0.66) {
      logoColor = c.mauve;
    } else if (this._fadeInTimer.progress < 1) {
      logoColor = c.lavender;
    } else if (this._presentTimer.progress < 1) {
      // do nothing
    } else if (this._fadeOutTimer.progress < 0.33) {
      logoColor = c.lavender;
    } else if (this._fadeOutTimer.progress < 0.66) {
      logoColor = c.mauve;
    } else {
      logoColor = c.darkerPurple;
    }

    if (!this._fadeOutTimer.hasFinished) {
      const prevMapping = b_.mapSpriteColors([
        { from: Pico8Colors.lemon, to: logoColor },
      ]);
      b_.sprite(
        this._brpLogo,
        g.viewportSize.sub(this._brpLogo.size().mul(2)).div(2),
        v_(2, 2)
      );
      b_.mapSpriteColors(prevMapping);
    }
  }
}
