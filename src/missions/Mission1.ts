import { SolidColor, v_ } from "@beetpx/beetpx";
import { c, g } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Mission } from "./Mission";

export class Mission1 implements Mission {
  readonly missionNumber: number = 1;
  readonly missionName: string = "emerald islands";

  readonly bgColor: SolidColor = c._4_true_blue;
  readonly missionInfoColor: SolidColor = c._9_dark_orange;

  private readonly _waveTile: AnimatedSprite = new AnimatedSprite(
    g.assets.mission1SpritesheetUrl,
    8,
    8,
    [
      // TODO: replace with some smart syntax which helps to understand how much of each frame
      24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
      32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 48,
      48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
      48, 48, 48, 48, 48,
    ],
    56,
    true
  );

  private _scrollPerFrame: number = 0.5;
  private _waveTileOffsetY: number = 0;

  levelBgUpdate(): void {
    this._waveTileOffsetY =
      (this._waveTileOffsetY + this._scrollPerFrame) % g.tileSize.y;
    this._waveTile.update();
  }

  levelBgDraw(): void {
    for (let distance = 0; distance <= 16; distance++) {
      for (let lane = 1; lane <= 12; lane++) {
        this._waveTile.draw(
          v_(
            (lane - 1) * g.tileSize.x,
            Math.ceil((distance - 1) * g.tileSize.y + this._waveTileOffsetY)
          )
        );
      }
    }
  }
}
