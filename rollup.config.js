import { babel } from "@rollup/plugin-babel";

const config = {
  input: "src/index.js",
  output: {
    name: "manipulator3d",
    dir: "dist",
    format: "umd",
  },
  plugins: [babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  })],
};

export default config;
