// To avoid thinking in x and y we talk here about:
//   - distance = how many tiles we have scrolled forward (can be fraction)
//   - lane     = which row of tiles are we talking about, perpendicular to distance
import {
  b_,
  BpxSprite,
  BpxVector2d,
  spr_,
  transparent_,
  u_,
  v2d_,
  v_,
} from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { Pico8Colors } from "../pico8/Pico8Color";
import { LevelDescriptor } from "./LevelDescriptor";

export class Level {
  private readonly _levelDescriptor: LevelDescriptor;

  private _phase: "intro" | "main" | "outro" = "intro";

  private _maxVisibleDistance: number = 0;
  private _minVisibleDistance: number =
    this._maxVisibleDistance - g.gameAreaTiles[1] - 1;

  private readonly _spawnDistanceOffset: number = 2;
  private _distanceNoSpawn: number =
    this._maxVisibleDistance + this._spawnDistanceOffset;
  private _distanceNextSpawn: number = this._maxVisibleDistance;

  private _sprites: Map<number, BpxSprite> = new Map<number, BpxSprite>();

  constructor(levelDescriptor: LevelDescriptor) {
    this._levelDescriptor = levelDescriptor;

    this._levelDescriptor.structures.forEach((structuresAtDistances) => {
      structuresAtDistances.forEach((tileId) => {
        if (tileId) {
          if (!this._sprites.has(tileId)) {
            this._sprites.set(
              tileId,
              spr_(CurrentMission.m.ldtk.tilesetPng)(
                (tileId % 16) * g.tileSize[0],
                Math.floor(tileId / 16) * g.tileSize[1],
                g.tileSize[0],
                g.tileSize[1]
              )
            );
          }
        }
      });
    });
  }

  syncWithLevelScrollFractionalPart(v: BpxVector2d): BpxVector2d {
    return v2d_(
      v[0],
      Math.floor(v[1]) + ((this._maxVisibleDistance * g.tileSize[1]) % 1)
    );
  }

  enterPhaseMain(): void {
    this._phase = "main";
    b_.logDebug("intro -> MAIN");
  }

  get progressFraction(): number {
    return u_.clamp(
      0,
      (this._minVisibleDistance + g.gameAreaTiles[1]) /
        (this._levelDescriptor.maxDefinedDistance + g.gameAreaTiles[1]),
      1
    );
  }

  hasScrolledToEnd(): boolean {
    return this._phase === "outro";
    //             return phase == "main" and max_visible_distance >= max_defined_distance + 1 or phase == "outro"
  }

  enemiesToSpawn(): Array<{ id: string; xy: BpxVector2d }> {
    const result: Array<{ id: string; xy: BpxVector2d }> = [];

    if (this._phase !== "main") return result;

    while (this._distanceNextSpawn < this._distanceNoSpawn) {
      const row = this._levelDescriptor.enemies[this._distanceNextSpawn];
      if (row) {
        for (let lane = 1; lane <= 12; lane++) {
          const enemyId = row[lane];
          if (enemyId) {
            result.push({
              id: enemyId,
              xy: v_.add(
                v2d_(0, g.gameAreaSize[1]),
                v_.mul(
                  g.tileSize,
                  v2d_(lane, this._minVisibleDistance - this._distanceNextSpawn)
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
      this._minVisibleDistance >= this._levelDescriptor.maxDefinedDistance
    ) {
      this._phase = "outro";
      b_.logDebug("MAIN -> outro");
    }

    this._maxVisibleDistance =
      this._maxVisibleDistance +
      CurrentMission.m.scrollPerFrame / g.tileSize[1];

    if (this._phase === "intro") {
      this._maxVisibleDistance = this._maxVisibleDistance % 1;
    } else if (this._phase === "main") {
      this._distanceNoSpawn =
        Math.floor(this._maxVisibleDistance) + this._spawnDistanceOffset;
    } else if (this._phase === "outro") {
      this._maxVisibleDistance =
        this._levelDescriptor.maxDefinedDistance +
        1 +
        g.gameAreaTiles[1] +
        (this._maxVisibleDistance % 1);
    }

    this._minVisibleDistance =
      this._maxVisibleDistance - g.gameAreaTiles[1] - 1;

    b_.logDebug(
      "visible distance: " +
        this._minVisibleDistance.toFixed(2) +
        " : " +
        this._maxVisibleDistance.toFixed(2)
    );
  }

  draw(): void {
    CurrentMission.m.levelBgDraw();

    if (this._phase === "main") {
      const prevMapping = b_.mapSpriteColors([
        { from: Pico8Colors._0_black, to: transparent_ },
      ]);

      for (
        let distance = Math.floor(this._minVisibleDistance);
        distance <= Math.ceil(this._maxVisibleDistance);
        distance++
      ) {
        const row = this._levelDescriptor.structures[distance];
        if (row) {
          for (let lane = 1; lane <= 12; lane++) {
            const fgTileId = row[lane];
            if (fgTileId) {
              this._drawTile(fgTileId, distance, lane);
            }
          }
        }
      }

      b_.mapSpriteColors(prevMapping);
    }
  }

  private _drawTile(tileId: number, distance: number, lane: number): void {
    b_.sprite(
      this._sprites.get(tileId)!,
      v_.add(
        v_.add(g.gameAreaOffset, v2d_(0, g.gameAreaSize[1])),
        v_.mul(g.tileSize, v2d_(lane - 1, this._minVisibleDistance - distance))
      )
    );
  }
}
