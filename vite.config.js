// vite.config.js
import { resolve } from "path";

export default {
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "dayjskh",
      fileName: (format) => `dayjskh.${format}.js`,
    },
    rollupOptions: {
      external: ["dayjs"],
      output: {
        globals: {
          dayjs: "dayjs",
        },
      },
    },
  },
};
