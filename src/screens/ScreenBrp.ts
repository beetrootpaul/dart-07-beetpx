import {
  $,
  $d,
  $spr,
  $timer,
  $timerSeq,
  $v,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxTimer,
  BpxTimerSequence,
} from "@beetpx/beetpx";
import { c, g } from "../globals";
import { Music } from "../misc/Music";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenBrp implements GameScreen {
  private readonly _brpLogo: BpxSprite = $spr(g.assets.mainSpritesheetUrl)(
    29,
    14,
    99,
    114,
  );

  private readonly _screenTimer: BpxTimer;
  private readonly _brpPresentingTimer: BpxTimerSequence<
    "fade_in" | "present" | "fade_out"
  >;

  private _skip: boolean = false;

  constructor() {
    const screenFrames = 150;
    const fadeFrames = 24;

    this._screenTimer = $timer(screenFrames);
    this._brpPresentingTimer = $timerSeq({
      intro: [
        ["fade_in", fadeFrames],
        ["present", screenFrames - 2 * fadeFrames - 20],
        ["fade_out", fadeFrames],
      ],
    });

    Music.playTitleMusic({ withIntro: true });
  }

  preUpdate(): GameScreen | undefined {
    if (this._skip || this._screenTimer.hasFinished) {
      return new ScreenTitle({ startMusic: false, startFadeIn: true });
    }
  }

  update(): void {
    if ($.wasButtonJustPressed("a") || $.wasButtonJustPressed("b")) {
      this._skip = true;
    }
  }

  draw(): void {
    $d.clearCanvas(c.black);

    let logoColor = c.peach;
    if (this._brpPresentingTimer.currentPhase === "fade_in") {
      if (this._brpPresentingTimer.progress < 0.33) {
        logoColor = c.darkerPurple;
      } else if (this._brpPresentingTimer.progress < 0.66) {
        logoColor = c.mauve;
      } else {
        logoColor = c.lavender;
      }
    } else if (this._brpPresentingTimer.currentPhase === "present") {
      // do nothing
    } else {
      if (this._brpPresentingTimer.progress < 0.33) {
        logoColor = c.lavender;
      } else if (this._brpPresentingTimer.progress < 0.33) {
        logoColor = c.mauve;
      } else {
        logoColor = c.darkerPurple;
      }
    }

    if (!this._brpPresentingTimer.hasFinishedOverall) {
      const prevMapping = $d.setSpriteColorMapping(
        BpxSpriteColorMapping.of(color =>
          color?.cssHex === Pico8Colors.lemon.cssHex ?
            logoColor
          : g.baseSpriteMapping.getMappedColor(color),
        ),
      );
      $d.sprite(
        this._brpLogo,
        g.viewportSize.sub(this._brpLogo.size.mul(2)).div(2),
        { scaleXy: $v(2, 2) },
      );
      $d.setSpriteColorMapping(prevMapping);
    }
  }
}
