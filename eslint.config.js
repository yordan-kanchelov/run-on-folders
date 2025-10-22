const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tseslintParser = require("@typescript-eslint/parser");
const eslintPluginImport = require("eslint-plugin-import");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

const baseTypescriptRules = {
  "prettier/prettier": ["error"],

  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "sort-imports": ["error", { ignoreDeclarationSort: true }],
  "import/no-unresolved": ["off"],

  "@typescript-eslint/explicit-function-return-type": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
      fixStyle: "separate-type-imports",
    },
  ],
};

module.exports = [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.spec.json"],
      },
      globals: {
        ...globals.node,
        NodeJS: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "import": eslintPluginImport,
      "prettier": prettierPlugin,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./tsconfig.spec.json"],
        },
        node: {
          extensions: [".js", ".ts"],
        },
      },
    },
    rules: {
      ...baseTypescriptRules,
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },

  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  {
    files: ["eslint.config.js", "jest.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        module: "writable",
        require: "readonly",
        process: "readonly",
      },
    },
  },

  {
    ignores: [
      "**/dist/",
      "**/coverage/",
      "**/node_modules/",
      "**/.git/",
      "**/build/",
    ],
  },
];
