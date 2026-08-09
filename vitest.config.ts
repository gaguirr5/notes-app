import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    env: {
      MONGODB_URI: "mongodb://fake-uri-for-tests",
      JWT_SECRET: "fake-secret-for-tests",
    },
  },
});