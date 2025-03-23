import { $d, $spr, $u, $v, $x, BpxVector2d } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { c, g } from "../globals";
import { Music } from "../misc/Music";
import { AnimatedSprite, Sprite, StaticSprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";
import { MovementToTarget } from "../movement/MovementToTarget";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenTitle } from "./ScreenTitle";

// TODO: it is possible to change selection after it is confirmed. Fix it

export class ScreenSelectMission implements GameScreen {
  // 0 = back button, 1-3 = missions from 1 to 3
  private static _selectedMission: number = 1;

  private readonly _fadeOut: Fade = new Fade("out", { fadeFrames: 30 });
  private readonly _shipSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    19,
    0,
  );
  private readonly _jetSprite: Sprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9,
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

  private _shipMovement: Movement | null = null;
  private _proceed: boolean = false;

  constructor() {
    this._initShipMovement();
  }

  preUpdate(): GameScreen | undefined {
    if (this._proceed && ScreenSelectMission._selectedMission === 0) {
      ScreenSelectMission._selectedMission = 1;
      return new ScreenTitle({ startMusic: false, startFadeIn: false });
    }

    if (
      this._proceed &&
      ScreenSelectMission._selectedMission > 0 &&
      this._fadeOut.hasFinished
    ) {
      return new ScreenMissionMain({
        mission: ScreenSelectMission._selectedMission,
        health: g.healthDefault,
        shockwaveCharges: g.shockwaveChargesDefault,
        fastMovement: false,
        fastShoot: false,
        tripleShoot: false,
        score: 0,
      });
    }
  }

  private _initShipMovement(): void {
    const [buttonXy, buttonWh] = this._missionButtonXyWh(
      ScreenSelectMission._selectedMission,
    );
    this._shipMovement = MovementToTarget.of({
      targetY: buttonXy.sub(0, 10).y,
      frames: 20,
    })(buttonXy.sub(g.gameAreaOffset).add(buttonWh.x / 2, buttonWh.y - 6));
  }

  private _missionButtonXyWh(mission: number): [BpxVector2d, BpxVector2d] {
    // place missions 1..N at positions 0..N-1, then place the back button (identified as mission 0) at position N
    const position = (mission + 4 - 1) % 4;
    return [
      g.gameAreaOffset.add(0, 12 + position * 31),
      $v(g.gameAreaSize.x, 16),
    ];
  }

  update(): void {
    if ($x.wasButtonJustPressed("up")) {
      $x.startPlayback(g.assets.sfxOptionsChange);
      ScreenSelectMission._selectedMission =
        (ScreenSelectMission._selectedMission + 4 - 1) % 4;
      this._initShipMovement();
    }
    if ($x.wasButtonJustPressed("down")) {
      $x.startPlayback(g.assets.sfxOptionsChange);
      ScreenSelectMission._selectedMission =
        (ScreenSelectMission._selectedMission + 1) % 4;
      this._initShipMovement();
    }

    if ($x.wasButtonJustPressed("O")) {
      $x.startPlayback(g.assets.sfxOptionsConfirm);
      if (ScreenSelectMission._selectedMission > 0) {
        Music.fadeOutCurrentMusic();
      }
      this._proceed = true;
    }

    if (this._proceed) {
      if (this._shipMovement?.hasFinished) {
        this._shipMovement?.pause();
        this._fadeOut.resume();
        this._fadeOut.update();
      } else {
        this._fadeOut.pause();
        this._shipMovement?.resume();
        this._shipMovement?.update();
      }
    } else {
      this._fadeOut.pause();
      this._shipMovement?.pause();
    }
  }

  private _drawMissionButton(mission: number): void {
    const selected =
      mission === ScreenSelectMission._selectedMission && !$x.isPaused;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(mission);

    // draw button shape
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(1, 19, selected ? 38 : 39, 12),
      buttonXy1.sub(1),
      { scaleXy: $v(buttonWh.x + 2, 1) },
    );

    // draw level sample
    const sy = 80 + (mission - 1) * 16;
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(
        buttonWh.x,
        buttonWh.y,
        0,
        selected ? sy : sy - 48,
      ),
      buttonXy1,
    );

    if (mission > 1) {
      // draw WIP info
      $u.drawTextWithOutline(
        "under development",
        g.gameAreaOffset.add(g.gameAreaSize.x / 2, buttonXy1.y + 2),
        selected ? c.white : c.lightGrey,
        selected ? c.darkOrange : c.lavender,
        { centerXy: [true, false] },
      );
    }

    // draw label
    $d.text(
      `mission ${mission}`,
      buttonXy1.add(0, buttonWh.y + 4),
      selected ? c.white : c.lavender,
    );

    if (selected) {
      // draw "x" button press incentive and its label
      $d.text("start", buttonXy1.add(buttonWh).add(-37, 4), c.white);
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3) ?
          this._cSprite
        : this._cSpritePressed;
      sprite.draw(buttonXy1.add(buttonWh.add(-15, 3)).sub(g.gameAreaOffset));
    }
  }

  private _drawBackButton(): void {
    const selected = 0 === ScreenSelectMission._selectedMission && !$x.isPaused;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(0);

    // button shape
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(1, 12, selected ? 35 : 36, 12),
      buttonXy1.sub(1),
      { scaleXy: $v(buttonWh.x + 2, 1) },
    );

    // button text
    $d.text("back", buttonXy1.add(3, 2), c.mauve);

    if (selected) {
      // draw "x" button press incentive
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3) ?
          this._cSprite
        : this._cSpritePressed;
      sprite.draw(
        buttonXy1.add(buttonWh.x, 0).add(-16, 13).sub(g.gameAreaOffset),
      );
    }
  }

  private _drawShip(): void {
    const [buttonXy, buttonWh] = this._missionButtonXyWh(
      ScreenSelectMission._selectedMission,
    );
    $d.setClippingRegion(buttonXy, buttonWh);

    if (this._shipMovement) {
      this._shipSprite.draw(this._shipMovement.xy);
      this._jetSprite.draw(this._shipMovement.xy);
    }

    $d.removeClippingRegion();
  }

  draw(): void {
    $d.clearCanvas(c.darkerBlue);

    this._drawMissionButton(1);
    this._drawMissionButton(2);
    this._drawMissionButton(3);

    this._drawBackButton();

    if (ScreenSelectMission._selectedMission > 0) {
      this._drawShip();
    }

    this._fadeOut.draw();
  }
}
