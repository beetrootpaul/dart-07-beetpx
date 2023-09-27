import { Vector2d, spr_, v_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { b, c, g, h, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Movement } from "../movement/Movement";
import { MovementToTarget } from "../movement/MovementToTarget";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenSelectMission implements GameScreen {
  private readonly _fadeOut: Fade = new Fade("out", { fadeFrames: 30 });
  private readonly _shipSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    [19],
    0
  );
  private readonly _jetSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9
  );
  private readonly _xSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [56],
    0,
    true
  );
  private readonly _xSpritePressed: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [56],
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
      targetY: buttonXy.sub(0, 10).y,
      frames: 20,
    })(buttonXy.sub(g.gameAreaOffset).add(buttonWh.x / 2, buttonWh.y - 6));
  }

  private _missionButtonXyWh(mission: number): [Vector2d, Vector2d] {
    // place missions 1..N at positions 0..N-1, then place the back button (identified as mission 0) at position N
    const position = (mission + 4 - 1) % 4;
    return [
      g.gameAreaOffset.add(0, 12 + position * 31),
      v_(g.gameAreaSize.x, 16),
    ];
  }

  update(): void {
    // TODO: pressing "x" to select mission makes the first bullet shot. Fix it!

    // TODO: something doesn't work here
    if (b.wasJustPressed("up")) {
      // TODO
      //  _sfx_play(_sfx_options_change)
      this._selectedMission = (this._selectedMission + 4 - 1) % 4;
      this._initShipMovement();
    }
    // TODO: something doesn't work here
    if (b.wasJustPressed("down")) {
      // TODO
      //  _sfx_play(_sfx_options_change)
      this._selectedMission = (this._selectedMission + 1) % 4;
      this._initShipMovement();
    }

    if (b.wasJustPressed("x")) {
      // TODO
      // _sfx_play(_sfx_options_confirm)
      if (this._selectedMission > 0) {
        // TODO
        // _music_fade_out()
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
    const selected = mission === this._selectedMission;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(mission);
    // TODO: used?
    const buttonXy2 = buttonXy1.add(buttonWh);

    // draw button shape
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 38 : 39, 12, 1, 19),
      buttonXy1.sub(1)
      // TODO: stretch the sprite to the width of `buttonWh.x + 2`
    );

    // draw level sample
    const sy = 80 + (mission - 1) * 16;
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(
        0,
        selected ? sy : sy - 48,
        buttonWh.x,
        buttonWh.y
      ),
      buttonXy1
    );

    if (mission > 1) {
      // draw WIP info
      h.printCentered(
        "under development",
        g.gameAreaSize.x / 2,
        buttonXy1.y + 2,
        selected ? c._7_white : c._6_light_grey,
        selected ? c._9_dark_orange : c._13_lavender
      );
    }

    // draw label
    b.print(
      `mission ${mission}`,
      buttonXy1.add(0, buttonWh.y + 4),
      selected ? c._7_white : c._13_lavender
    );

    if (selected) {
      // draw "x" button press incentive and its label
      b.print("start", buttonXy1.add(buttonWh).add(-37, 4), c._7_white);
      const sprite = u.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(buttonXy1.add(buttonWh.add(-15, 3)).sub(g.gameAreaOffset));
    }
  }

  private _drawBackButton(): void {
    const selected = 0 === this._selectedMission;

    const [buttonXy1, buttonWh] = this._missionButtonXyWh(0);

    // button shape
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 35 : 36, 12, 1, 12),
      buttonXy1.sub(1)
      // TODO: stretch it to `button_wh.x + 2
    );

    // button text
    b.print("back", buttonXy1.add(3, 2), c._14_mauve);

    if (selected) {
      // draw "x" button press incentive
      const sprite = u.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(
        buttonXy1.add(buttonWh.x, 0).add(-16, 13).sub(g.gameAreaOffset)
      );
    }
  }

  private _drawShip(): void {
    const [buttonXy, buttonWh] = this._missionButtonXyWh(this._selectedMission);
    b.setClippingRegion(buttonXy, buttonWh);

    if (this._shipMovement) {
      this._shipSprite.draw(this._shipMovement.xy);
      this._jetSprite.draw(this._shipMovement.xy);
    }

    b.removeClippingRegion();
  }

  draw(): void {
    b.clearCanvas(c._1_darker_blue);

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
