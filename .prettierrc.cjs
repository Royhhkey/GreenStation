module.exports = {
  // 更偏向“默认 Prettier + 单引号”的团队风格
  printWidth: 80, // 每行最大字符数
  tabWidth: 2, // 两个空格缩进
  useTabs: false,
  semi: true, // 语句末尾加分号
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 能加尾逗号的地方尽量加
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'], // 自动排序 Tailwind 的 class
}
