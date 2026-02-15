import nextPlugin from "@next/eslint-plugin-next"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: [".next/", "node_modules/"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
)
