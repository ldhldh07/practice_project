import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import pluginImport from "eslint-plugin-import"
import boundaries from "eslint-plugin-boundaries"
import path from "node:path"

export default tseslint.config(
  { ignores: ["dist", "vite-env.d.ts", "vitest.config.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import": pluginImport,
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: path.resolve(process.cwd(), "tsconfig.app.json"),
        },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/app/*/**" },
        { type: "pages", pattern: "src/pages/*/**" },
        { type: "widgets", pattern: "src/widgets/*/**" },
        { type: "features", pattern: "src/features/*/**" },
        { type: "entities", pattern: "src/entities/*/**" },
        { type: "shared", pattern: "src/shared/*/**" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"], "object", "type"],
          "pathGroups": [
            { pattern: "@shared/**", group: "internal", position: "before" },
            { pattern: "@entities/**", group: "internal", position: "before" },
            { pattern: "@features/**", group: "internal", position: "before" },
            { pattern: "@widgets/**", group: "internal", position: "before" },
            { pattern: "@pages/**", group: "internal", position: "before" },
            { pattern: "@app/**", group: "internal", position: "before" },
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["features", "entities", "shared"] },
            { from: "entities", allow: ["entities", "shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
    },
  },
)
