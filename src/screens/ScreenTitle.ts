import {
  $,
  $d,
  $spr,
  $u,
  $v,
  BpxRgbColor,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
} from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { PersistedState } from "../PersistedState";
import { Score } from "../game/Score";
import { c, g } from "../globals";
import { Music } from "../misc/Music";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenControls } from "./ScreenControls";
import { ScreenSelectMission } from "./ScreenSelectMission";

export class ScreenTitle implements GameScreen {
  private static readonly _gameCoverMode: boolean = false;

  private static _playSelected: boolean = true;

  private readonly _bgCoverTiles: (BpxVector2d | null)[][] = [
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(0, 6), $v(1, 6), ...$u.range(12).map(() => null), $v(2, 6), $v(3, 6)],
    [
      $v(5, 5),
      $v(1, 7),
      ...$u.range(12).map(() => $v(5, 4)),
      $v(2, 7),
      $v(5, 5),
    ],
    $u.range(16).map(() => $v(5, 5)),
    $u.range(16).map(() => $v(5, 5)),
    $u.range(16).map(() => $v(5, 5)),
    [
      $v(5, 5),
      $v(1, 4),
      ...$u.range(12).map(() => $v(5, 6)),
      $v(2, 4),
      $v(5, 5),
    ],
    [$v(0, 5), $v(1, 5), ...$u.range(12).map(() => null), $v(2, 5), $v(3, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
  ];

  private readonly _bgTiles: (BpxVector2d | null)[][] = [
    [$v(0, 6), $v(1, 6), ...$u.range(12).map(() => null), $v(2, 6), $v(3, 6)],
    [
      $v(5, 5),
      $v(1, 7),
      ...$u.range(12).map(() => $v(5, 4)),
      $v(2, 7),
      $v(5, 5),
    ],
    $u.range(16).map(() => $v(5, 5)),
    $u.range(16).map(() => $v(5, 5)),
    $u.range(16).map(() => $v(5, 5)),
    [
      $v(5, 5),
      $v(1, 4),
      ...$u.range(12).map(() => $v(5, 6)),
      $v(2, 4),
      $v(5, 5),
    ],
    [$v(0, 5), $v(1, 5), ...$u.range(12).map(() => null), $v(2, 5), $v(3, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
    [$v(6, 5), ...$u.range(14).map(() => null), $v(4, 5)],
  ];

  private readonly _brpLogo: BpxSprite = $spr(g.assets.mainSpritesheetUrl)(
    29,
    14,
    99,
    114,
  );
  private readonly _cSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    0,
    true,
  );
  private readonly _cSpritePressed: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    6,
    true,
  );

  private readonly _fadeIn: Fade | null;

  private readonly _highScore: Score;

  private _stars: Array<{
    xy: BpxVector2d;
    color: BpxRgbColor;
    speed: number;
  }> = [];

  private _proceed: boolean = false;

  constructor(params: { startMusic: boolean; startFadeIn: boolean }) {
    if (params.startMusic) {
      Music.playTitleMusic({ withIntro: false });
    }

    this._fadeIn =
      params.startFadeIn ? new Fade("in", { fadeFrames: 30 }) : null;

    this._highScore = new Score(
      $.loadPersistedState<PersistedState>()?.highScore ?? 0,
    );

    for (let y = 0; y < g.viewportSize.y; y++) {
      this._maybeAddStar(y);
    }
  }

  private _maybeAddStar(y: number): void {
    if (Math.random() < 0.1) {
      const speed = $u.randomElementOf([0.25, 0.5, 0.75])!;
      const star = {
        xy: $v(Math.ceil(1 + Math.random() * g.viewportSize.x - 3), y),
        speed: speed,
        color:
          speed >= 0.75 ? c.lightGrey
          : speed >= 0.5 ? c.lavender
          : c.mauve,
      };
      this._stars.push(star);
    }
  }

  preUpdate(): GameScreen | undefined {
    if (this._proceed) {
      return ScreenTitle._playSelected ?
          new ScreenSelectMission()
        : new ScreenControls();
    }
  }

  update(): void {
    if ($.wasButtonJustPressed("up") || $.wasButtonJustPressed("down")) {
      $.startPlayback(g.assets.sfxOptionsChange);
      ScreenTitle._playSelected = !ScreenTitle._playSelected;
    }

    if ($.wasButtonJustPressed("a")) {
      $.startPlayback(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }

    for (const star of this._stars) {
      star.xy = star.xy.add(0, star.speed);
    }

    this._stars = this._stars.filter(s => s.xy.y <= g.gameAreaSize.y);

    this._maybeAddStar(0);

    this._fadeIn?.update();
  }

  private _drawBackground(): void {
    const tiles =
      ScreenTitle._gameCoverMode ? this._bgCoverTiles : this._bgTiles;

    const prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.of((color, x, y) =>
        color?.cssHex === Pico8Colors.black.cssHex ?
          null
        : g.baseSpriteMapping.getMappedColor(color, x, y),
      ),
    );

    tiles.forEach((tilesRow, rowIndex) => {
      tilesRow.forEach((tile, colIndex) => {
        if (tile) {
          $d.sprite(
            $spr(g.assets.mission2SpritesheetUrl)(
              g.tileSize.x,
              g.tileSize.y,
              tile.x * g.tileSize.x,
              tile.y * g.tileSize.y,
            ),
            g.tileSize.mul(colIndex, rowIndex),
          );
        }
      });
    });

    $d.setSpriteColorMapping(prevMapping);
  }

  private _drawVersion(baseY: number): void {
    $d.text(
      g.gameVersion,
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, baseY),
      c.mauve,
      { centerXy: [true, false] },
    );
  }

  private _drawTitle(baseY: number): void {
    const prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.of((color, x, y) =>
        color?.cssHex === Pico8Colors.black.cssHex ?
          null
        : g.baseSpriteMapping.getMappedColor(color, x, y),
      ),
    );
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(32, 26, 96, 32),
      $v((g.viewportSize.x - 96) / 2, baseY),
    );
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(32, 26, 96, 58),
      $v((g.viewportSize.x - 96) / 2 + 32, baseY),
    );
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(32, 26, 96, 84),
      $v((g.viewportSize.x - 96) / 2 + 64, baseY),
    );
    $d.setSpriteColorMapping(prevMapping);
  }

  private _drawHighScore(baseY: number): void {
    $d.text(
      "high score",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, baseY),
      c.lightGrey,
      { centerXy: [true, false] },
    );
    this._highScore.draw($v(52, baseY + 10), c.white, c.mauve, false);
  }

  private _drawButton(
    text: string,
    w: number,
    baseX: number,
    baseY: number,
    selected: boolean,
  ): void {
    // button shape
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(1, 12, selected ? 35 : 36, 12),
      $v(baseX, baseY),
      { scaleXy: $v(w, 1) },
    );

    // button text
    $d.text(text, $v(baseX + 4, baseY + 3), c.mauve);

    // "x" press incentive
    if (selected) {
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3) ?
          this._cSprite
        : this._cSpritePressed;
      sprite.draw($v(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    $d.clearCanvas(c.darkerBlue);

    for (const star of this._stars) {
      $d.pixel(star.xy, star.color);
    }

    this._drawBackground();

    if (ScreenTitle._gameCoverMode) {
      // BRP
      const prevMapping = $d.setSpriteColorMapping(
        BpxSpriteColorMapping.of((color, x, y) =>
          color?.cssHex === Pico8Colors.black.cssHex ? null
          : color?.cssHex === Pico8Colors.lemon.cssHex ? c.mauve
          : g.baseSpriteMapping.getMappedColor(color, x, y),
        ),
      );
      $d.sprite(
        this._brpLogo,
        $v((g.viewportSize.x - this._brpLogo.size.x * 2) / 2, 6),
        { scaleXy: $v(2) },
      );
      $d.setSpriteColorMapping(prevMapping);

      this._drawTitle(55);

      // ship
      new StaticSprite(g.assets.mainSpritesheetUrl, 10, 10, 18, 0).draw(
        $v(g.gameAreaSize.x / 2, 110),
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
        ScreenTitle._playSelected && !$.isPaused,
      );
      this._drawButton(
        "controls",
        98,
        15,
        104,
        !ScreenTitle._playSelected && !$.isPaused,
      );
    }

    if (!ScreenTitle._gameCoverMode) {
      this._fadeIn?.draw();
    }
  }
}
