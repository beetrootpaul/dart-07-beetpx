import { b_, BpxVector2d, spr_, u_, v2d_, v_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { c, g } from "../globals";
import { AnimatedSprite, Sprite, StaticSprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";
import { MovementToTarget } from "../movement/MovementToTarget";
import { PauseMenu } from "../PauseMenu";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenSelectMission implements GameScreen {
  private readonly _fadeOut: Fade = new Fade("out", { fadeFrames: 30 });
  private readonly _shipSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    19,
    0
  );
  private readonly _jetSprite: Sprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9
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

  // 0 = back button, 1-3 = missions from 1 to 3
  private _selectedMission: number = 1;

  private _shipMovement: Movement | null = null;
  private _proceed: boolean = false;

  // TODO: param: selected_mission
  constructor() {
    this._initShipMovement();
  }

  preUpdate(): GameScreen | undefined {
    if (this._proceed && this._selectedMission === 0) {
      // TODO: params: 1, false, false, false
      return new ScreenTitle();
    }

    if (
      this._proceed &&
      this._selectedMission > 0 &&
      this._fadeOut.hasFinished
    ) {
      return new ScreenMissionMain({
        mission: this._selectedMission,
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
    const [buttonXy, buttonWh] = this._missionButtonXyWh(this._selectedMission);
    this._shipMovement = MovementToTarget.of({
      targetY: v_.sub(buttonXy, v2d_(0, 10))[1],
      frames: 20,
    })(
      v_.add(
        v_.sub(buttonXy, g.gameAreaOffset),
        v2d_(buttonWh[0] / 2, buttonWh[1] - 6)
      )
    );
  }

  private _missionButtonXyWh(mission: number): [BpxVector2d, BpxVector2d] {
    // place missions 1..N at positions 0..N-1, then place the back button (identified as mission 0) at position N
    const position = (mission + 4 - 1) % 4;
    return [
      v_.add(g.gameAreaOffset, v2d_(0, 12 + position * 31)),
      v2d_(g.gameAreaSize[0], 16),
    ];
  }

  update(): void {
    // TODO: pressing "x" to select mission makes the first bullet shot. Fix it!

    if (b_.wasJustPressed("up")) {
      b_.playSoundOnce(g.assets.sfxOptionsChange);
      this._selectedMission = (this._selectedMission + 4 - 1) % 4;
      this._initShipMovement();
    }
    if (b_.wasJustPressed("down")) {
      b_.playSoundOnce(g.assets.sfxOptionsChange);
      this._selectedMission = (this._selectedMission + 1) % 4;
      this._initShipMovement();
    }

    if (b_.wasJustPressed("x")) {
      b_.playSoundOnce(g.assets.sfxOptionsConfirm);
      if (this._selectedMission > 0) {
        // TODO: replace this with a fade out of a music only over 500 ms
        b_.stopAllSounds();
      }
      this._proceed = true;
    }

    this._shipSprite.update();
    this._jetSprite.update();

    if (this._proceed) {
      if (this._shipMovement?.hasFinished) {
        this._fadeOut.update();
      } else {
        this._shipMovement?.update();
      }
    }
  }

  private _drawMissionButton(mission: number): void {
    const selected =
      mission === this._selectedMission && !PauseMenu.isGamePaused;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(mission);

    // draw button shape
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 38 : 39, 12, 1, 19),
      v_.sub(buttonXy1, 1),
      v2d_(buttonWh[0] + 2, 1)
    );

    // draw level sample
    const sy = 80 + (mission - 1) * 16;
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(
        0,
        selected ? sy : sy - 48,
        buttonWh[0],
        buttonWh[1]
      ),
      buttonXy1
    );

    if (mission > 1) {
      // draw WIP info
      u_.printWithOutline(
        "under development",
        v_.add(g.gameAreaOffset, v2d_(g.gameAreaSize[0] / 2, buttonXy1[1] + 2)),
        selected ? c.white : c.lightGrey,
        selected ? c.darkOrange : c.lavender,
        [true, false]
      );
    }

    // draw label
    b_.print(
      `mission ${mission}`,
      v_.add(buttonXy1, v2d_(0, buttonWh[1] + 4)),
      selected ? c.white : c.lavender
    );

    if (selected) {
      // draw "x" button press incentive and its label
      b_.print(
        "start",
        v_.add(v_.add(buttonXy1, buttonWh), v2d_(-37, 4)),
        c.white
      );
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(
        v_.sub(
          v_.add(v_.add(buttonXy1, buttonWh), v2d_(-15, 3)),
          g.gameAreaOffset
        )
      );
    }
  }

  private _drawBackButton(): void {
    const selected = 0 === this._selectedMission && !PauseMenu.isGamePaused;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(0);

    // button shape
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 35 : 36, 12, 1, 12),
      v_.sub(buttonXy1, 1),
      v2d_(buttonWh[0] + 2, 1)
    );

    // button text
    b_.print("back", v_.add(buttonXy1, v2d_(3, 2)), c.mauve);

    if (selected) {
      // draw "x" button press incentive
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(
        v_.sub(
          v_.add(v_.add(buttonXy1, v2d_(buttonWh[0], 0)), v2d_(-16, 13)),
          g.gameAreaOffset
        )
      );
    }
  }

  private _drawShip(): void {
    const [buttonXy, buttonWh] = this._missionButtonXyWh(this._selectedMission);
    b_.setClippingRegion(buttonXy, buttonWh);

    if (this._shipMovement) {
      this._shipSprite.draw(this._shipMovement.xy);
      this._jetSprite.draw(this._shipMovement.xy);
    }

    b_.removeClippingRegion();
  }

  draw(): void {
    b_.clearCanvas(c.darkerBlue);

    this._drawMissionButton(1);
    this._drawMissionButton(2);
    this._drawMissionButton(3);

    this._drawBackButton();

    if (this._selectedMission > 0) {
      this._drawShip();
    }

    this._fadeOut.draw();
  }
}
