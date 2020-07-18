module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: [
    `node_modules`,
    `\\.cache`,
    `\\.linaria-cache`,
    `<rootDir>.*/public`,
  ],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/src/test/loader-shim.js`],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
    // Base package aliases
    "^@architus/facade/(.*)$": "<rootDir>/../design/src/$1",
    "^@architus/lib/(.*)$": "<rootDir>/../lib/src/$1",
    // Utility absolute import
    "^@docs/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    __PATH_PREFIX__: ``,
    "ts-jest": {
      babelConfig: {
        presets: ["babel-preset-gatsby"],
      },
    },
  },
};
