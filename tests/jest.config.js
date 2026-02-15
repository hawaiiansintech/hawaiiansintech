const path = require("path");
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: path.join(__dirname, "../"),
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testEnvironment: "node",
  rootDir: path.join(__dirname, "../"),
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.{js,ts,tsx}",
    "<rootDir>/**/*.test.{js,ts,tsx}",
  ],
  collectCoverageFrom: [
    "pages/api/**/*.{js,ts,tsx}",
    "lib/**/*.{js,ts,tsx}",
    "components/**/*.{js,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
