import { SolidColor } from "@beetpx/beetpx";

export interface Mission {
  readonly missionNumber: number;
  readonly missionName: string;

  readonly bgColor: SolidColor;
  readonly missionInfoColor: SolidColor;

  levelBgUpdate(): void;
  levelBgDraw(): void;
}
