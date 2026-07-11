/**
 * PostCSS 配置
 * 使用 Tailwind CSS v4 的 @tailwindcss/postcss 插件处理 CSS。
 * v4 不再需要 content 配置，通过 CSS 文件中的 @theme 指令自动检测。
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
