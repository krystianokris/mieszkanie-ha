import { resolve } from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: resolve(__dirname, "../custom_components/krystal_twin/frontend"),
    // layout.json is generated next to the bundle for private installs; keep it.
    emptyOutDir: false,
    target: "es2022",
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/twin/main.tsx"),
      formats: ["es"],
      fileName: () => "krystal-twin-panel.js",
    },
  },
});
