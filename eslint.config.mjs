import { ourongxing, react } from "@ourongxing/eslint-config"

export default ourongxing({
  type: "app",
  // 貌似不能 ./ 开头，
  ignores: ["src/routeTree.gen.ts", "imports.app.d.ts", "public/", ".vscode", "**/*.json"],
  rules: {
    "node/prefer-global/process": "off",
  },
}).append(react({
  files: ["src/**"],
  rules: {
    "node/prefer-global/process": "off",
  },
}))
