/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line unicorn/prefer-module, no-undef
module.exports = {
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(mt|t|cj|j)s$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
