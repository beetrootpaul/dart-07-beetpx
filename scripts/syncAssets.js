#!/usr/bin/env node

const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

const watchForChanges = process.argv[2] === "watch";

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

  const simplifiedJson = {
    jsonVersion: fullJson.jsonVersion,
    externalLevels: fullJson.externalLevels,
    simplifiedExport: fullJson.simplifiedExport,
    levels: fullJson.levels.map((l) => ({
      identifier: l.identifier,
      pxHei: l.pxHei,
      layerInstances: l.layerInstances.map((li) => ({
        __identifier: li.__identifier,
        autoLayerTiles: li.autoLayerTiles.map((alt) => ({
          px: [alt.px[0], alt.px[1]],
          t: alt.t,
        })),
        entityInstances: li.entityInstances.map((ei) => ({
          __identifier: ei.__identifier,
          __grid: [ei.__grid[0], ei.__grid[1]],
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
