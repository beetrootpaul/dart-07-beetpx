import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

export class LevelDescriptor {
  // TODO: REMOVE
  static tmpJson: any;

  readonly maxDefinedDistance: number;

  // FYI: structures[distance = 0] and  structures[distance][lane = 0] are unused.
  //   It's a leftover from the 1-indexed tables in the Lua codebase of the previous
  //   game implementation. Same for enemies.
  readonly structures: (number | null)[][];
  readonly enemies: (string | null)[][];

  // TODO: REWORK, this is temporary implementation
  constructor() {
    // TODO: delete
    console.log(LevelDescriptor.tmpJson);

    const tileMarginY = 2;
    // because enemies occupy 2 tiles in Y and their are placed on the further one, but we want to detect them on the closer one
    const enemyOffsetY = 1;

    this.maxDefinedDistance =
      LevelDescriptor.tmpJson.levels.find(
        (l: any) => l.identifier === CurrentMission.m.ldtk.level
      ).pxHei /
        g.tileSize.y -
      2 * tileMarginY;

    const tiles: Array<{ tileY: number; tileX: number; id: number }> =
      LevelDescriptor.tmpJson.levels
        .find((l: any) => l.identifier === CurrentMission.m.ldtk.level)
        .layerInstances.find(
          (li: any) => li.__identifier === CurrentMission.m.ldtk.landLayer
        )
        .autoLayerTiles.map((alt: any) => ({
          tileY: alt.px[1] / 8 - tileMarginY,
          tileX: alt.px[0] / 8,
          id: alt.t,
        }))
        .filter(
          (alt: any) => alt.tileY >= 0 && alt.tileY < this.maxDefinedDistance
        );
    const lanes = 12;

    const enemies: Array<{ tileY: number; tileX: number; id: string }> =
      LevelDescriptor.tmpJson.levels
        .find((l: any) => l.identifier === CurrentMission.m.ldtk.level)
        .layerInstances.find(
          (li: any) => li.__identifier === CurrentMission.m.ldtk.enemiesLayer
        )
        .entityInstances.map((ei: any) => ({
          id: ei.__identifier,
          tileX: ei.__grid[0],
          tileY: ei.__grid[1] - tileMarginY,
        }))
        .filter(
          (ei: any) => ei.tileY >= 0 && ei.tileY < this.maxDefinedDistance
        );

    this.structures = Array.from({ length: this.maxDefinedDistance + 1 }, () =>
      Array.from({ length: lanes + 1 }, () => null)
    );
    this.enemies = Array.from({ length: this.maxDefinedDistance + 1 }, () =>
      Array.from({ length: lanes + 1 }, () => null)
    );
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
  }
}
