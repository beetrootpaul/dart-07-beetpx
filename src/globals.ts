import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { MissionMetadata } from "./MissionMetadata";
import { Pico8Colors } from "./pico8/Pico8Color";

export const b = BeetPx;

export const c = Pico8Colors;

export const u = Utils;

export const g = {
  fps: 60,

  viewportSize: v_(128, 128),
  gameAreaSize: v_(96, 128),
  gameAreaOffsetX: 16,

  assets: {
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
  },

  missions: [
    {
      missionNumber: 1,
      // TODO: migrate from Lua
      missionName: "emerald islands",
      // missionName: "emerald \-fislands",
      bgColor: c.trueBlue,
      missionInfoColor: c.darkOrange,
    },
  ] satisfies MissionMetadata[],
};
