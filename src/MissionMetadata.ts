import { SolidColor } from "@beetpx/beetpx";

export type MissionMetadata = {
  missionNumber: number;
  missionName: string;
  bgColor: SolidColor;
  missionInfoColor: SolidColor;
  spritesheetUrl: string;
  levelBgDraw: () => void;
  levelBgUpdate: () => void;
};
