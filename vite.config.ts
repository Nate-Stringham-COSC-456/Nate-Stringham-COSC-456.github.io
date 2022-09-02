import { defineConfig } from "vite";

import glsl from "vite-plugin-glsl";

const pages = {
  homework: [],
  examples: ["triangle"],
};

export default defineConfig({
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        ...generatePageUrls(),
      },
    },
  },
  plugins: [glsl()],
});

function generatePageUrls() {
  const urls = {};
  for (const folder in pages) {
    for (const page of pages[folder]) {
      urls[`${folder}/${page}`] = new URL(`./${folder}/${page}/index.html`, import.meta.url).pathname;
    }
  }
  return urls;
}
