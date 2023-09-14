import { SolidColor } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyProperties } from "../game/EnemyProperties";

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
    progressionMarkersLayer: string;
  };

  levelBgUpdate(): void;
  levelBgDraw(): void;

  enemyPropertiesFor(enemyId: string): EnemyProperties;
  bossProperties(): BossProperties;
}
