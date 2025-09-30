const parser = require("@typescript-eslint/parser");
const plugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": plugin,
      prettier: prettierPlugin,
    },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "max-params": ["error", { max: 3 }],
      "max-statements": ["error", { max: 16 }],
      "max-classes-per-file": ["error", 1],
      "no-multi-spaces": "error",
      quotes: ["error", "double"],
      "prettier/prettier": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
    },
  },
  prettier,
];
