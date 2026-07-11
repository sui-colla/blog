/**
 * ESLint 配置
 *
 * 基于 eslint-config-next 的预置规则集：
 * - core-web-vitals: 包含 React 性能与可访问性规则
 * - typescript: TypeScript 类型检查相关规则
 * - globalIgnores: 显式覆盖默认忽略列表，避免误忽略项目文件
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
