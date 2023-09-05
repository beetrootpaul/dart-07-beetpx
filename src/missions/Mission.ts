import { SolidColor } from "@beetpx/beetpx";

export interface Mission {
  readonly missionName: string;

  readonly bgColor: SolidColor;
  readonly missionInfoColor: SolidColor;

  readonly scrollPerFrame: number;

  readonly ldtk: {
    level: string;
    tilesetPng: string;
    landLayer: string;
    enemiesLayer: string;
  };

  levelBgUpdate(): void;
  levelBgDraw(): void;
}
