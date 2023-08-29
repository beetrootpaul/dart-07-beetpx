#!/usr/bin/env node

const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

const watchForChanges = process.argv[2] === "watch";

// TODO: describe in README that this script requires Aseprite installed globally
// this path is specific to the project's author machine
const asperiteCli = "/Applications/Aseprite.app/Contents/MacOS/aseprite";

const rootDir = path.resolve(__dirname, "..");
const graphicsDir = path.resolve(rootDir, "graphics");
const publicDir = path.resolve(rootDir, "public");

const spriteSheets = [
  { input: "spritesheet_main.aseprite", output: "spritesheet_main.png" },
  {
    input: "spritesheet_mission_1.aseprite",
    output: "spritesheet_mission_1.png",
  },
  {
    input: "spritesheet_mission_2.aseprite",
    output: "spritesheet_mission_2.png",
  },
  {
    input: "spritesheet_mission_3.aseprite",
    output: "spritesheet_mission_3.png",
  },
];

// graphics/spritesheet_main.aseprite --sheet abc.png --batch

spriteSheets.forEach(({ input, output }) => {
  const inputPath = path.resolve(graphicsDir, input);
  const outputPath = path.resolve(publicDir, output);

  syncFile(inputPath, outputPath);

  if (watchForChanges) {
    fs.watchFile(inputPath, { interval: 1000 }, () => {
      syncFile(inputPath, outputPath);
    });
  }
});

function syncFile(inputPath, outputPath) {
  const shortInputPath = path.relative(rootDir, inputPath);
  const shortOutputPath = path.relative(rootDir, outputPath);
  console.log(`[syncAssets] ${shortInputPath} -> ${shortOutputPath} ...`);
  childProcess.execSync(
    `${asperiteCli} ${inputPath} --sheet ${outputPath} --batch`,
    { stdio: "inherit" }
  );
}
