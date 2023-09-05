// To avoid thinking in x and y we talk here about:
//   - distance = how many tiles we have scrolled forward (can be fraction)
//   - lane     = which row of tiles are we talking about, perpendicular to distance
import { spr_, transparent_, v_, Vector2d } from "@beetpx/beetpx";
import { b, c, g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { LevelDescriptor } from "./LevelDescriptor";

export class Level {
  private readonly _leveDescriptor: LevelDescriptor;

  private _phase: "intro" | "main" | "outro" = "intro";

  private _maxVisibleDistance: number = 0;
  private _minVisibleDistance: number =
    this._maxVisibleDistance - g.gameAreaTiles.y - 1;

  private readonly _spawnDistanceOffset: number = 2;
  private _distanceNoSpawn: number =
    this._maxVisibleDistance + this._spawnDistanceOffset;
  private _distanceNextSpawn: number = this._maxVisibleDistance;

  constructor(leveDescriptor: LevelDescriptor) {
    this._leveDescriptor = leveDescriptor;
  }

  enterPhaseMain(): void {
    this._phase = "main";
    b.logDebug("intro -> MAIN");
  }

  // TODO
  //         progress_fraction = function()
  //             -- We remove 17 from max_visible_distance in order to make sure progress_fraction is not above 0 during mission intro phase.
  //             -- We remove 2 from max_defined_distance in order to make sure progress_fraction is not below 1 during mission boss phase.
  //             return mid(0, (max_visible_distance - 17) / (max_defined_distance - 2), 1)
  //         end,

  hasScrolledToEnd(): boolean {
    return this._phase === "outro";
    //             return phase == "main" and max_visible_distance >= max_defined_distance + 1 or phase == "outro"
  }

  enemiesToSpawn(): Array<{ id: string; xy: Vector2d }> {
    const result: Array<{ id: string; xy: Vector2d }> = [];

    if (this._phase !== "main") return result;

    while (this._distanceNextSpawn < this._distanceNoSpawn) {
      const row = this._leveDescriptor.enemies[this._distanceNextSpawn];
      if (row) {
        for (let lane = 1; lane <= 12; lane++) {
          const enemyId = row[lane];
          if (enemyId) {
            result.push({
              id: enemyId,
              xy: v_(0, g.gameAreaSize.y).add(
                g.tileSize.mul(
                  v_(
                    lane + 2,
                    this._minVisibleDistance - this._distanceNextSpawn
                  )
                )
              ),
            });
          }
        }
      }
      this._distanceNextSpawn++;
    }

    return result;
  }

  update(): void {
    CurrentMission.m.levelBgUpdate();

    if (
      this._phase !== "outro" &&
      this._minVisibleDistance >= this._leveDescriptor.maxDefinedDistance
    ) {
      this._phase = "outro";
      b.logDebug("MAIN -> outro");
    }

    this._maxVisibleDistance =
      this._maxVisibleDistance + CurrentMission.m.scrollPerFrame / g.tileSize.y;

    if (this._phase === "intro") {
      this._maxVisibleDistance = this._maxVisibleDistance % 1;
    } else if (this._phase === "main") {
      this._distanceNoSpawn =
        Math.floor(this._maxVisibleDistance) + this._spawnDistanceOffset;
    } else if (this._phase === "outro") {
      this._maxVisibleDistance =
        this._leveDescriptor.maxDefinedDistance +
        1 +
        g.gameAreaTiles.y +
        (this._maxVisibleDistance % 1);
    }

    this._minVisibleDistance = this._maxVisibleDistance - g.gameAreaTiles.y - 1;

    b.logDebug(
      `visible distance: ${this._minVisibleDistance.toFixed(
        2
      )} : ${this._maxVisibleDistance.toFixed(2)}`
    );
  }

  draw(): void {
    CurrentMission.m.levelBgDraw();

    if (this._phase === "main") {
      const prevMapping = b.mapSpriteColors([
        { from: c._0_black, to: transparent_ },
      ]);

      for (
        let distance = Math.floor(this._minVisibleDistance);
        distance <= Math.ceil(this._maxVisibleDistance);
        distance++
      ) {
        const row = this._leveDescriptor.structures[distance];
        if (row) {
          for (let lane = 1; lane <= 12; lane++) {
            const fgTileId = row[lane];
            if (fgTileId) {
              this._drawTile(fgTileId, distance, lane);
            }
          }
        }
      }

      b.mapSpriteColors(prevMapping);
    }
  }

  private _drawTile(tileId: number, distance: number, lane: number): void {
    // TODO: rework: cache sprites, decouple from URL, read sheet tiles width from somewhere else
    b.sprite(
      spr_(g.assets.mission1SpritesheetUrl)(
        (tileId % 16) * g.tileSize.x,
        Math.floor(tileId / 16) * g.tileSize.y,
        g.tileSize.x,
        g.tileSize.y
      ),
      g.gameAreaOffset
        .add(v_(0, g.gameAreaSize.y))
        .add(g.tileSize.mul(v_(lane - 1, this._minVisibleDistance - distance)))
    );
  }
}
