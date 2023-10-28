import {
  b_,
  BpxSolidColor,
  BpxSprite,
  BpxVector2d,
  spr_,
  transparent_,
  u_,
  v_,
} from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Score } from "../game/Score";
import { c, g } from "../globals";
import { Music } from "../misc/Music";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { PauseMenu } from "../pause/PauseMenu";
import { PersistedState } from "../PersistedState";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenControls } from "./ScreenControls";
import { ScreenSelectMission } from "./ScreenSelectMission";

export class ScreenTitle implements GameScreen {
  private static readonly _gameCoverMode: boolean = false;

  private static _playSelected: boolean = true;

  private readonly _bgCoverTiles: (BpxVector2d | null)[][] = [
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(0, 6), v_(1, 6), ...u_.range(12).map(() => null), v_(2, 6), v_(3, 6)],
    [
      v_(5, 5),
      v_(1, 7),
      ...u_.range(12).map(() => v_(5, 4)),
      v_(2, 7),
      v_(5, 5),
    ],
    u_.range(16).map(() => v_(5, 5)),
    u_.range(16).map(() => v_(5, 5)),
    u_.range(16).map(() => v_(5, 5)),
    [
      v_(5, 5),
      v_(1, 4),
      ...u_.range(12).map(() => v_(5, 6)),
      v_(2, 4),
      v_(5, 5),
    ],
    [v_(0, 5), v_(1, 5), ...u_.range(12).map(() => null), v_(2, 5), v_(3, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
  ];

  private readonly _bgTiles: (BpxVector2d | null)[][] = [
    [v_(0, 6), v_(1, 6), ...u_.range(12).map(() => null), v_(2, 6), v_(3, 6)],
    [
      v_(5, 5),
      v_(1, 7),
      ...u_.range(12).map(() => v_(5, 4)),
      v_(2, 7),
      v_(5, 5),
    ],
    u_.range(16).map(() => v_(5, 5)),
    u_.range(16).map(() => v_(5, 5)),
    u_.range(16).map(() => v_(5, 5)),
    [
      v_(5, 5),
      v_(1, 4),
      ...u_.range(12).map(() => v_(5, 6)),
      v_(2, 4),
      v_(5, 5),
    ],
    [v_(0, 5), v_(1, 5), ...u_.range(12).map(() => null), v_(2, 5), v_(3, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
    [v_(6, 5), ...u_.range(14).map(() => null), v_(4, 5)],
  ];

  private readonly _brpLogo: BpxSprite = spr_(g.assets.mainSpritesheetUrl)(
    99,
    114,
    29,
    14
  );
  private readonly _xSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    0,
    true
  );
  private readonly _xSpritePressed: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    6,
    true
  );

  private readonly _fadeIn: Fade | null;

  private readonly _highScore: Score;

  private _stars: Array<{
    xy: BpxVector2d;
    color: BpxSolidColor;
    speed: number;
  }> = [];

  private _proceed: boolean = false;

  constructor(params: { startMusic: boolean; startFadeIn: boolean }) {
    if (params.startMusic) {
      Music.playTitleMusic({ withIntro: false });
    }

    this._fadeIn = params.startFadeIn
      ? new Fade("in", { fadeFrames: 30 })
      : null;

    this._highScore = new Score(
      b_.loadPersistedState<PersistedState>()?.highScore ?? 0
    );

    for (let y = 0; y < g.viewportSize.y; y++) {
      this._maybeAddStar(y);
    }
  }

  private _maybeAddStar(y: number): void {
    if (Math.random() < 0.1) {
      const speed = u_.randomElementOf([0.25, 0.5, 0.75])!;
      const star = {
        xy: v_(Math.ceil(1 + Math.random() * g.viewportSize.x - 3), y),
        speed: speed,
        color:
          speed >= 0.75 ? c.lightGrey : speed >= 0.5 ? c.lavender : c.mauve,
      };
      this._stars.push(star);
    }
  }

  preUpdate(): GameScreen | undefined {
    if (this._proceed) {
      return ScreenTitle._playSelected
        ? new ScreenSelectMission()
        : new ScreenControls();
    }
  }

  update(): void {
    if (b_.wasJustPressed("up") || b_.wasJustPressed("down")) {
      b_.playSoundOnce(g.assets.sfxOptionsChange);
      ScreenTitle._playSelected = !ScreenTitle._playSelected;
    }

    if (b_.wasJustPressed("a")) {
      b_.playSoundOnce(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }

    for (const star of this._stars) {
      star.xy = star.xy.add(0, star.speed);
    }

    this._stars = this._stars.filter((s) => s.xy.y <= g.gameAreaSize.y);

    this._maybeAddStar(0);

    this._fadeIn?.update();
  }

  private _drawBackground(): void {
    const tiles = ScreenTitle._gameCoverMode
      ? this._bgCoverTiles
      : this._bgTiles;

    const prevMapping = b_.mapSpriteColors([
      { from: Pico8Colors.black, to: transparent_ },
    ]);

    tiles.forEach((tilesRow, rowIndex) => {
      tilesRow.forEach((tile, colIndex) => {
        if (tile) {
          b_.sprite(
            spr_(g.assets.mission2SpritesheetUrl)(
              tile.x * g.tileSize.x,
              tile.y * g.tileSize.y,
              g.tileSize.x,
              g.tileSize.y
            ),
            g.tileSize.mul(colIndex, rowIndex)
          );
        }
      });
    });

    b_.mapSpriteColors(prevMapping);
  }

  private _drawVersion(baseY: number): void {
    b_.print(
      g.gameVersion,
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, baseY),
      c.mauve,
      [true, false]
    );
  }

  private _drawTitle(baseY: number): void {
    const prevMapping = b_.mapSpriteColors([
      { from: Pico8Colors.black, to: transparent_ },
    ]);
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 32, 32, 26),
      v_((g.viewportSize.x - 96) / 2, baseY)
    );
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 58, 32, 26),
      v_((g.viewportSize.x - 96) / 2 + 32, baseY)
    );
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 84, 32, 26),
      v_((g.viewportSize.x - 96) / 2 + 64, baseY)
    );
    b_.mapSpriteColors(prevMapping);
  }

  private _drawHighScore(baseY: number): void {
    b_.print(
      "high score",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, baseY),
      c.lightGrey,
      [true, false]
    );
    this._highScore.draw(v_(52, baseY + 10), c.white, c.mauve, false);
  }

  private _drawButton(
    text: string,
    w: number,
    baseX: number,
    baseY: number,
    selected: boolean
  ): void {
    // button shape
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 35 : 36, 12, 1, 12),
      v_(baseX, baseY),
      v_(w, 1)
    );

    // button text
    b_.print(text, v_(baseX + 4, baseY + 3), c.mauve);

    // "x" press incentive
    if (selected) {
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(v_(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    b_.clearCanvas(c.darkerBlue);

    for (const star of this._stars) {
      b_.pixel(star.xy, star.color);
    }

    this._drawBackground();

    if (ScreenTitle._gameCoverMode) {
      // BRP
      const prevMapping = b_.mapSpriteColors([
        { from: Pico8Colors.black, to: transparent_ },
        { from: Pico8Colors.lemon, to: c.mauve },
      ]);
      b_.sprite(
        this._brpLogo,
        v_((g.viewportSize.x - this._brpLogo.size().x * 2) / 2, 6),
        v_(2, 2)
      );
      b_.mapSpriteColors(prevMapping);

      this._drawTitle(55);

      // ship
      new StaticSprite(g.assets.mainSpritesheetUrl, 10, 10, 18, 0).draw(
        v_(g.gameAreaSize.x / 2, 110)
      );
    } else {
      this._drawVersion(1);
      this._drawTitle(15);
      this._drawHighScore(57);
      this._drawButton(
        "play",
        98,
        15,
        82,
        ScreenTitle._playSelected && !PauseMenu.isGamePaused
      );
      this._drawButton(
        "controls",
        98,
        15,
        104,
        !ScreenTitle._playSelected && !PauseMenu.isGamePaused
      );
    }

    if (!ScreenTitle._gameCoverMode) {
      this._fadeIn?.draw();
    }
  }
}
