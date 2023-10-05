#!/usr/bin/env node

const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

const watchForChanges = process.argv[2] === "watch";

// TODO: describe in README how to export PICO-8 SFX files (because could not automate due to headless export error)
//       /Applications/PICO-8.app/Contents/MacOS/pico8 assets/sounds_main.p8 -root_path public
//       inside: export sfx_main_%d.wav

// TODO: describe in README that this script requires Aseprite installed globally
// this path is specific to the project's author machine
const asperiteCli = "/Applications/Aseprite.app/Contents/MacOS/aseprite";

const rootDir = path.resolve(__dirname, "..");
const assetsDir = path.resolve(rootDir, "assets");
const publicDir = path.resolve(rootDir, "public");

const spriteSheets = [
  {
    asepriteInput: "spritesheet_main.aseprite",
    pngOutput: "spritesheet_main.png",
  },
  {
    asepriteInput: "spritesheet_mission_1.aseprite",
    pngOutput: "spritesheet_mission_1.png",
  },
  {
    asepriteInput: "spritesheet_mission_2.aseprite",
    pngOutput: "spritesheet_mission_2.png",
  },
  {
    asepriteInput: "spritesheet_mission_3.aseprite",
    pngOutput: "spritesheet_mission_3.png",
  },
];

spriteSheets.forEach(({ asepriteInput, pngOutput }) => {
  const asepriteInputPath = path.resolve(assetsDir, asepriteInput);
  const pngOutputPath = path.resolve(publicDir, pngOutput);

  exportAsepriteToPng(asepriteInputPath, pngOutputPath);
  if (watchForChanges) {
    fs.watchFile(asepriteInputPath, { interval: 1000 }, () => {
      exportAsepriteToPng(asepriteInputPath, pngOutputPath);
    });
  }
});

const missionsLdtkPath = path.resolve(assetsDir, "missions.ldtk");
const simplifiedMissionJsonPath = path.resolve(publicDir, "missions.json");

simplifyLdtkJson(missionsLdtkPath, simplifiedMissionJsonPath);
if (watchForChanges) {
  fs.watchFile(missionsLdtkPath, { interval: 1000 }, () => {
    simplifyLdtkJson(missionsLdtkPath, simplifiedMissionJsonPath);
  });
}

////////////////

function exportAsepriteToPng(asepriteInputPath, pngOutputPath) {
  const shortInputPath = path.relative(rootDir, asepriteInputPath);
  const shortOutputPath = path.relative(rootDir, pngOutputPath);
  console.log(`[syncAssets] ${shortInputPath} -> ${shortOutputPath} ...`);

  childProcess.execSync(
    `${asperiteCli} ${asepriteInputPath} --sheet ${pngOutputPath} --batch`,
    { stdio: "inherit" }
  );
}

function simplifyLdtkJson(missionsLdtkPath, simplifiedMissionJsonPath) {
  const shortMissionsLdtkPath = path.relative(rootDir, missionsLdtkPath);
  const shortSimplifiedMissionJsonPath = path.relative(
    rootDir,
    simplifiedMissionJsonPath
  );
  console.log(
    `[syncAssets] ${shortMissionsLdtkPath} -> ${shortSimplifiedMissionJsonPath} ...`
  );

  const fullJsonRaw = fs.readFileSync(shortMissionsLdtkPath, "utf-8");
  const fullJson = JSON.parse(fullJsonRaw);

  // TODO: check if everything listed here is really needed
  const simplifiedJson = {
    jsonVersion: fullJson.jsonVersion, // TODO: string, validate it's `1.3.4`
    externalLevels: fullJson.externalLevels, // TODO: boolean, validate it's `false
    simplifiedExport: fullJson.simplifiedExport, // TODO: boolean, validate it's `false
    levels: fullJson.levels.map((l) => ({
      identifier: l.identifier, // TODO: string
      pxWid: l.pxWid, // TODO: number, validate it's `128`
      pxHei: l.pxHei, // TODO: number
      layerInstances: l.layerInstances.map((li) => ({
        __identifier: li.__identifier, // TODO: string
        __type: li.__type, // TODO: string, validate it's `Entities` | `IntGrid`
        __cWid: li.__cWid, // TODO: number, validate it's `l.pxWid / 8`
        __cHei: li.__cHei, // TODO: number, validate it's `l.pxHei / 8`
        __tilesetRelPath: li.__tilesetRelPath, // TODO: string | null, validate it is one of expected PNGs, but first transform from `../public/spritesheet_mission_1.png` to `spritesheet_mission_1.png`
        autoLayerTiles: li.autoLayerTiles.map((alt) => ({
          px: alt.px, // TODO: [number, number], validate it's within real level bounds
          t: alt.t, // TODO: number, validate it's within tileset bounds
        })),
        entityInstances: li.entityInstances.map((ei) => ({
          __identifier: ei.__identifier, // TODO: string
          __grid: ei.__grid, // TODO: [number, number], validate it's within real level bounds
        })),
      })),
    })),
  };

  fs.writeFileSync(
    shortSimplifiedMissionJsonPath,
    JSON.stringify(simplifiedJson),
    {
      encoding: "utf-8",
    }
  );
}
