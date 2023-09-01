import { SolidColor } from "@beetpx/beetpx";
import { MissionMetadata } from "./MissionMetadata";
import { g } from "./globals";

// TODO: rework this

export class CurrentMission {
  static setFrom(metadata: MissionMetadata): void {
    CurrentMission.missionNumber = metadata.missionNumber;
    CurrentMission.missionName = metadata.missionName;
    CurrentMission.bgColor = metadata.bgColor;
    CurrentMission.missionInfoColor = metadata.missionInfoColor;
    CurrentMission.levelBgDraw = metadata.levelBgDraw;
    CurrentMission.levelBgUpdate = metadata.levelBgUpdate;
  }

  static missionNumber: number = g.missions[0]!.missionNumber;
  static missionName: string = g.missions[0]!.missionName;
  static bgColor: SolidColor = g.missions[0]!.bgColor;
  static missionInfoColor: SolidColor = g.missions[0]!.missionInfoColor;
  static levelBgDraw: () => void = g.missions[0]!.levelBgDraw;
  static levelBgUpdate: () => void = g.missions[0]!.levelBgUpdate;
}
