import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// 主题预设配置
export const themePresets = {
  light: {
    name: '浅色主题',
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    secondary: '#52c41a',
    background: '#ffffff',
    surfaceBackground: '#f8f9fa',
    cardBackground: '#ffffff',
    textPrimary: '#262626',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    border: '#e8e8e8',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowHeavy: 'rgba(0, 0, 0, 0.16)',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    surfaceGradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  },
  dark: {
    name: '深色主题',
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    secondary: '#52c41a',
    background: '#141414',
    surfaceBackground: '#1f1f1f',
    cardBackground: '#262626',
    textPrimary: '#ffffff',
    textSecondary: '#d9d9d9',
    textTertiary: '#8c8c8c',
    border: '#434343',
    borderLight: '#303030',
    shadow: 'rgba(0, 0, 0, 0.45)',
    shadowMedium: 'rgba(0, 0, 0, 0.55)',
    shadowHeavy: 'rgba(0, 0, 0, 0.65)',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    surfaceGradient: 'linear-gradient(135deg, #1f1f1f 0%, #141414 100%)',
  },
  green: {
    name: '绿色主题',
    primary: '#52c41a',
    primaryHover: '#73d13d',
    primaryActive: '#389e0d',
    secondary: '#1890ff',
    background: '#ffffff',
    surfaceBackground: '#f6ffed',
    cardBackground: '#ffffff',
    textPrimary: '#262626',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    border: '#e8e8e8',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowHeavy: 'rgba(0, 0, 0, 0.16)',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    surfaceGradient: 'linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)',
  },
  purple: {
    name: '紫色主题',
    primary: '#722ed1',
    primaryHover: '#9254de',
    primaryActive: '#531dab',
    secondary: '#eb2f96',
    background: '#ffffff',
    surfaceBackground: '#f9f0ff',
    cardBackground: '#ffffff',
    textPrimary: '#262626',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    border: '#e8e8e8',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowHeavy: 'rgba(0, 0, 0, 0.16)',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    surfaceGradient: 'linear-gradient(135deg, #ffffff 0%, #f9f0ff 100%)',
  },
  orange: {
    name: '橙色主题',
    primary: '#fa8c16',
    primaryHover: '#ffa940',
    primaryActive: '#d46b08',
    secondary: '#faad14',
    background: '#ffffff',
    surfaceBackground: '#fff7e6',
    cardBackground: '#ffffff',
    textPrimary: '#262626',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    border: '#e8e8e8',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowHeavy: 'rgba(0, 0, 0, 0.16)',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    surfaceGradient: 'linear-gradient(135deg, #ffffff 0%, #fff7e6 100%)',
  },
};

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 加载主题，默认为 light
  const currentTheme = ref(localStorage.getItem('app-theme') || 'light');

  // 获取当前主题配置
  const getThemeConfig = () => {
    return themePresets[currentTheme.value] || themePresets.light;
  };

  // 应用主题到 CSS 变量
  const applyTheme = (themeName) => {
    const theme = themePresets[themeName] || themePresets.light;
    const root = document.documentElement;

    // 设置所有 CSS 变量
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // 添加/移除 dark 类用于某些组件的特殊处理
    if (themeName === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  };

  // 切换主题
  const setTheme = (themeName) => {
    if (themePresets[themeName]) {
      currentTheme.value = themeName;
      localStorage.setItem('app-theme', themeName);
      applyTheme(themeName);
    }
  };

  // 获取所有可用主题
  const getAvailableThemes = () => {
    return Object.keys(themePresets).map((key) => ({
      value: key,
      label: themePresets[key].name,
    }));
  };

  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  });

  // 初始化时应用主题
  applyTheme(currentTheme.value);

  return {
    currentTheme,
    getThemeConfig,
    setTheme,
    getAvailableThemes,
    themePresets,
  };
});
