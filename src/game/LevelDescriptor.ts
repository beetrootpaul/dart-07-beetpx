import { $u } from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

type LevelsJson = {
  jsonVersion: string;
  externalLevels: boolean;
  simplifiedExport: boolean;
  levels: Array<{
    identifier: string;
    pxHei: number;
    layerInstances: Array<{
      __identifier: string;
      autoLayerTiles: Array<{
        px: [number, number];
        t: number;
      }>;
      entityInstances: Array<{
        __identifier: string;
        __grid: [number, number];
      }>;
    }>;
  }>;
};

export class LevelDescriptor {
  readonly maxDefinedDistance: number;

  // FYI: structures[distance = 0] and  structures[distance][lane = 0] are unused.
  //   It's a leftover from the 1-indexed tables in the Lua codebase of the previous
  //   game implementation. Same for enemies.
  readonly structures: (number | null)[][];
  readonly enemies: (string | null)[][];

  constructor(levelsJson: LevelsJson) {
    const tileMarginY = 2;
    // because enemies occupy 2 tiles in Y and their are placed on the further one, but we want to detect them on the closer one
    const enemyOffsetY = 1;

    const expectedVersion = "1.4.0";
    if (levelsJson.jsonVersion !== expectedVersion) {
      throw Error(
        `Levels JSON generated from unexpected Ldtk version: "${levelsJson.jsonVersion}" (expected: "${expectedVersion}").`,
      );
    }
    if (levelsJson.externalLevels) {
      throw Error(
        `Levels JSON has "externalLevels" set to "true", which is unsupported in this game`,
      );
    }
    if (levelsJson.simplifiedExport) {
      throw Error(
        `Levels JSON has "simplifiedExport" set to "true", which is unsupported in this game`,
      );
    }

    this.maxDefinedDistance =
      levelsJson.levels.find(
        (l: any) => l.identifier === CurrentMission.m.ldtk.level,
      )!.pxHei /
        g.tileSize.y -
      2 * tileMarginY;

    const tiles: Array<{ tileY: number; tileX: number; id: number }> =
      levelsJson.levels
        .find((l: any) => l.identifier === CurrentMission.m.ldtk.level)!
        .layerInstances.find(
          (li: any) => li.__identifier === CurrentMission.m.ldtk.landLayer,
        )!
        .autoLayerTiles.map((alt: any) => ({
          tileY: alt.px[1] / 8 - tileMarginY,
          tileX: alt.px[0] / 8,
          id: alt.t,
        }))
        .filter(
          (alt: any) => alt.tileY >= 0 && alt.tileY < this.maxDefinedDistance,
        );
    const lanes = 12;

    const enemies: Array<{ tileY: number; tileX: number; id: string }> =
      levelsJson.levels
        .find((l: any) => l.identifier === CurrentMission.m.ldtk.level)!
        .layerInstances.find(
          (li: any) => li.__identifier === CurrentMission.m.ldtk.enemiesLayer,
        )!
        .entityInstances.map((ei: any) => ({
          id: ei.__identifier,
          tileX: ei.__grid[0],
          tileY: ei.__grid[1] - tileMarginY,
        }))
        .filter(
          (ei: any) => ei.tileY >= 0 && ei.tileY < this.maxDefinedDistance,
        );

    this.structures = $u
      .range(this.maxDefinedDistance + 1)
      .map(() => $u.range(lanes + 1).map(() => null));
    this.enemies = $u
      .range(this.maxDefinedDistance + 1)
      .map(() => $u.range(lanes + 1).map(() => null));
    tiles.forEach(({ tileX, tileY, id }) => {
      const distance = this.maxDefinedDistance - tileY;
      const lane = tileX + 1;
      this.structures[distance]![lane]! = id;
    });
    enemies.forEach(({ tileX, tileY, id }) => {
      const distance = this.maxDefinedDistance - tileY - enemyOffsetY;
      const lane = tileX + 1;
      this.enemies[distance]![lane]! = id;
    });

    const markerOffsetY = 2;
    const levelEndMarkerTileY: number = levelsJson.levels
      .find((l: any) => l.identifier === CurrentMission.m.ldtk.level)!
      .layerInstances.find(
        (li: any) =>
          li.__identifier === CurrentMission.m.ldtk.progressionMarkersLayer,
      )!
      .entityInstances.filter((ei: any) => ei.__identifier === "level_end")
      .map((ei: any) => ({
        tileY: ei.__grid[1] - tileMarginY,
      }))
      .filter((ei: any) => ei.tileY >= 0 && ei.tileY < this.maxDefinedDistance)
      .reduce(
        (maxTileY: number, nextEi: any) => Math.max(maxTileY, nextEi.tileY),
        -markerOffsetY,
      );
    this.maxDefinedDistance =
      this.maxDefinedDistance - levelEndMarkerTileY - markerOffsetY;
    for (
      let distance = this.maxDefinedDistance + 1;
      distance < this.enemies.length;
      distance++
    ) {
      for (let lane = 0; lane < this.enemies[distance]!.length; lane++) {
        this.enemies[distance]![lane] = null;
      }
    }
    for (
      let distance = this.maxDefinedDistance + 1;
      distance < this.structures.length;
      distance++
    ) {
      for (let lane = 0; lane < this.structures[distance]!.length; lane++) {
        this.structures[distance]![lane] = null;
      }
    }
  }
}
