import { SolidColor } from "@beetpx/beetpx";

export interface Mission {
  readonly missionNumber: number;
  readonly missionName: string;

  readonly bgColor: SolidColor;
  readonly missionInfoColor: SolidColor;

  readonly scrollPerFrame: number;

  levelBgUpdate(): void;
  levelBgDraw(): void;
}
