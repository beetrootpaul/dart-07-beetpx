# dart-07-beetpx

A scrolling shooter, built with BeetPx. As the Dart-07 you fight on Emerald Islands, Outpost in Space, and in the
interstellar Phoslar Mine

## Development

In separate consoles, run:

```shell
npm run tsc:watch
```

```shell
npm run syncAssets:watch
```

```shell
npm start
```

### Type check

If you want to check if your TypeScript types are correct, run either `npm run tsc` or `npm run tsc:watch` (the latter runs continuously, performing the check on every file change).

### Assets sync

There are two directories for assets:
- `assets/` – here you can put anything, e.g. `.aseprite` files in which you edit your sprites or `.ldtk` files which you use to work on your levels
- `public/` – whatever goes there, is added to the distributed game bundle. You should put here the final assets, in the format they are consumed by the game. 

Because of that, there are two scripts: `npm run syncAssets` and `npm run syncAssets:watch` (the latter runs continuously, performing the sync on every change to asset files from `assets/` observed by `scripts/syncAssets.js`).

Only **some asset types** are synced the script right now:
- `assets/*.aseprite` files listed inside [scripts/syncAssets.js](scripts/syncAssets.js) are exported to PNG in `public/` with use of a hardcoded path to Aseprite executable
- `assets/wav/*.wav` are converted to FLAC in `public/` with use of a `ffmpeg` executable
- `assets/*.ldtk` file listed inside [scripts/syncAssets.js](scripts/syncAssets.js) is copied and trimmed down to JSON in `public/`
- `assets/*.aseprite` files are NOT exported to WAV, since of the PICO-8 error in headless export in form of `/Applications/PICO-8.app/Contents/MacOS/pico8 assets/sounds_main.p8 -root_path public`. Moreover, that command makes the custom PICO-8 ROOT dir location reset to its defaults (which is an issue, if you use custom location for your regular PICO-8 work).

### Run game

`npm start` runs the game in a watch mode.

Things you should be aware of:
- whenever any of source code files change, the game reloads
- whenever any of `public/` asset files change, the game reloads
- type checking is NOT performed here

In other words:
- run `npm run tsc:watch` in parallel for a type checking
- if you run `npm run syncAssets:watch`, then saving changes in asset files in `assets/` will make the game reload

## Game cover

To create a game cover:
- go to `ScreenTitle`
- change `_gameCoverMode` to `true`
- run the game