import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Pico8Colors } from "./pico8/Pico8Color";

export const b = BeetPx;

export const c = Pico8Colors;

export const u = Utils;

export const g = {
  fps: 60,

  canvasSize: v_(128, 128),

  assets: {
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
  },
};
