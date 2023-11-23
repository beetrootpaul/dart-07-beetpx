/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  rootDir: "./src/",
  passWithNoTests: true,
  testEnvironment: "jsdom",
  // We do *not* want to ignore `node_modules` (with BeetPx in it), otherwise tests fail.
  transformIgnorePatterns: [],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: {
          // A fix for BeetPx JS files imported by TS files. Taken from
          //   https://github.com/kulshekhar/ts-jest/issues/970#issuecomment-1014215089
          allowJs: true,
          // This one is set only in order to suppress warning "If you have issues
          //   related to imports, you should consider (…)"
          esModuleInterop: true,
        },
      },
    ],
  },
  globals: {
    __BEETPX__IS_PROD__: false,
    __BEETPX__VERSION__: "test",
  },
};
