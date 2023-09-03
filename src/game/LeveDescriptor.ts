export class LeveDescriptor {
  // TODO: REMOVE
  static tmpJson: any;

  static readonly noTileId = -1;

  // FYI: structures[distance = 0] and  structures[distance][lane = 0] are unused.
  //   It's a leftover from the 1-indexed tables in the Lua codebase of the previous
  //   game implementation.
  readonly structures: number[][];

  readonly maxDefinedDistance: number;

  constructor() {
    // TODO: REWORK, this is temporary implementation
    const tiles: Array<{ tileY: number; tileX: number; id: number }> =
      LeveDescriptor.tmpJson.levels
        .find((l: any) => l.identifier === "mission_1")
        .layerInstances.find((li: any) => li.__identifier === "m1_land")
        .autoLayerTiles.map((alt: any) => ({
          tileY: alt.px[1] / 8,
          tileX: alt.px[0] / 8,
          id: alt.t,
        }));
    const lanes = 12;
    const maxTileY = tiles.reduce((acc, { tileY }) => Math.max(acc, tileY), 0);

    // TODO: is this correct? Should it be `maxTileY + 1`?
    this.maxDefinedDistance = maxTileY + 1;

    // TODO: what should be the first array size?
    this.structures = Array.from({ length: this.maxDefinedDistance + 1 }, () =>
      Array.from({ length: lanes + 1 }, () => LeveDescriptor.noTileId)
    );
    tiles.forEach(({ tileX, tileY, id }) => {
      const distance = maxTileY - tileY + 1;
      const lane = tileX + 1;
      this.structures[distance]![lane]! = id;
    });
  }
}
