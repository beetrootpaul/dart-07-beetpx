module.exports = {
  rootDir: "./src/",
  passWithNoTests: true,
  // This entry does NOT ignore `node_modules`, which is required for tests in this project to not fail due to EMS modules used in BeetPx
  transformIgnorePatterns: [],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: {
          // Fix for BeetPx JS files imported by TS files. Taken from https://github.com/kulshekhar/ts-jest/issues/970#issuecomment-1014215089
          allowJs: true,
          // Set only in order to suppress warning "If you have issues related to imports, you should consider (…)"
          esModuleInterop: true,
        },
      },
    ],
  },
  globals: {
    __BEETPX_IS_PROD__: false,
  },
};
