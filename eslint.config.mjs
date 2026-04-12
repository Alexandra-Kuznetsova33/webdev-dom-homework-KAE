import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import config from "eslint-config-prettier";
import plugin from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  config,
  plugin,
];
