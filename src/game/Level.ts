// To avoid thinking in x and y we talk here about:
//   - distance = how many tiles we have scrolled forward (can be fraction)
//   - lane     = which row of tiles are we talking about, perpendicular to distance
import { spr_, transparent_, v_ } from "@beetpx/beetpx";
import { b, c, g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { LeveDescriptor } from "./LeveDescriptor";

export class Level {
  private readonly _leveDescriptor: LeveDescriptor;

  private _phase: "intro" | "main" | "outro" = "intro";

  private _maxVisibleDistance: number = 0;
  private _minVisibleDistance: number =
    this._maxVisibleDistance - g.gameAreaTiles.y - 1;

  // TODO: params: structures, enemies, max_defined_distance
  constructor(leveDescriptor: LeveDescriptor) {
    this._leveDescriptor = leveDescriptor;
    // TODO
    //     -- we draw enemy in center of block of 4 tiles, but store them in the top-left tile's position
    //     local enemy_offset = _xy(_ts / 2, _ts / 2)
    //
    // TODO
    //     local prev_spawn_distance = max_visible_distance
    //     local spawn_distance_offset = 2
    //     local spawn_distance = max_visible_distance + spawn_distance_offset
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
  //
  // TODO
  //         has_scrolled_to_end = function()
  //             return phase == "main" and max_visible_distance >= max_defined_distance + 1 or phase == "outro"
  //         end,
  //
  // TODO
  //         enemies_to_spawn = function()
  //             if phase ~= "main" then
  //                 return {}
  //             end
  //
  //             local result = {}
  //             if spawn_distance > prev_spawn_distance then
  //                 prev_spawn_distance = spawn_distance
  //                 for lane = 1, 12 do
  //                     local enemy_map_marker = enemies[spawn_distance] and enemies[spawn_distance][lane] or nil
  //                     if enemy_map_marker then
  //                         add(result, {
  //                             enemy_map_marker = enemy_map_marker,
  //                             xy = _xy(
  //                                 (lane - .5) * _ts,
  //                                 _vs - _ts - (spawn_distance - min_visible_distance + .5) * _ts
  //                             ).plus(enemy_offset),
  //                         })
  //                     end
  //                 end
  //             end
  //             return result
  //         end,
  //
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
      // TODO
      // spawn_distance = max(spawn_distance, flr(max_visible_distance) + spawn_distance_offset)
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
        for (let lane = 1; lane <= 12; lane++) {
          const row = this._leveDescriptor.structures[distance];
          if (row) {
            const fgTileId = row[lane];
            if (fgTileId && fgTileId !== LeveDescriptor.noTileId) {
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
