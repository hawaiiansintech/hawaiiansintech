module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Must be last to override other configs
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    // Essential runtime error prevention
    "no-undef": "error",
    "no-unused-vars": "off", // Using TypeScript version instead
    "@typescript-eslint/no-unused-vars": "error",

    // Basic code quality
    "prefer-const": "error",
    "no-var": "error",

    // React essentials
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // TypeScript specific
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-empty-object-type": "warn",

    // Prettier integration
    "prettier/prettier": "error",
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
};
