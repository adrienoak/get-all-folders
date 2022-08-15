import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  dts: true,
  entry: ["./src/index.ts"],
  clean: true,
  shims: true,
  treeshake: true,
});
