# 快速开始指南 | Quick Start Guide
# 主题系统使用说明

## 🚀 5分钟上手 | Get Started in 5 Minutes

### 1. 切换主题 | Switch Themes

**最简单的方式**:
1. 点击页面右上角的 🎨 彩色按钮
2. 从下拉菜单中选择你喜欢的主题
3. 主题立即生效，并自动保存

**可用主题**:
- 🌞 浅色主题 (默认蓝色)
- 🌙 深色主题 (护眼黑色)
- 🌿 绿色主题 (环保绿色)
- 💜 紫色主题 (高端紫色)
- 🧡 橙色主题 (温暖橙色)

---

## 💻 开发者快速参考 | Developer Quick Reference

### 在组件中使用主题 | Use Themes in Components

#### 基础用法 (最常用)

```vue
<template>
  <div class="my-card">
    <h2>标题</h2>
    <p>内容文本</p>
    <button class="action-btn">按钮</button>
  </div>
</template>

<style scoped>
/* 背景和边框 */
.my-card {
  background: var(--theme-cardBackground);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 4px 6px var(--theme-shadow);
}

/* 文字颜色 */
h2 {
  color: var(--theme-textPrimary);
}

p {
  color: var(--theme-textSecondary);
}

/* 按钮 */
.action-btn {
  background: var(--theme-gradient);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px var(--theme-shadowMedium);
}
</style>
```

### 常用CSS变量速查表 | Common CSS Variables

| 变量名 | 用途 | 示例 |
|--------|------|------|
| `--theme-background` | 页面背景 | `background: var(--theme-background)` |
| `--theme-cardBackground` | 卡片背景 | `background: var(--theme-cardBackground)` |
| `--theme-textPrimary` | 主要文字 | `color: var(--theme-textPrimary)` |
| `--theme-textSecondary` | 次要文字 | `color: var(--theme-textSecondary)` |
| `--theme-border` | 边框 | `border: 1px solid var(--theme-border)` |
| `--theme-gradient` | 渐变按钮 | `background: var(--theme-gradient)` |
| `--theme-shadow` | 阴影 | `box-shadow: 0 4px 6px var(--theme-shadow)` |
| `--radius-md` | 圆角 | `border-radius: var(--radius-md)` |
| `--spacing-lg` | 间距 | `padding: var(--spacing-lg)` |
| `--transition-normal` | 过渡 | `transition: all var(--transition-normal)` |

---

## 📱 响应式设计速查 | Responsive Design Cheat Sheet

### 移动优先媒体查询模板

```css
/* 基础样式 - 移动端 */
.element {
  font-size: 14px;
  padding: 12px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .element {
    font-size: 16px;
    padding: 20px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .element {
    font-size: 18px;
    padding: 24px;
  }
}
```

### 移动端触控目标

```css
/* 确保移动端可点击元素足够大 */
@media (max-width: 768px) {
  button, a, input {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## 🎨 常见UI模式 | Common UI Patterns

### 1. 现代卡片

```vue
<template>
  <div class="modern-card">
    <div class="card-header">
      <h3>卡片标题</h3>
    </div>
    <div class="card-body">
      <p>卡片内容</p>
    </div>
    <div class="card-footer">
      <button class="primary-btn">操作</button>
    </div>
  </div>
</template>

<style scoped>
.modern-card {
  background: var(--theme-cardBackground);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 
    0 4px 6px -1px var(--theme-shadow),
    0 2px 4px -1px var(--theme-shadow);
  transition: all var(--transition-normal);
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 10px 15px -3px var(--theme-shadowMedium),
    0 4px 6px -2px var(--theme-shadowMedium);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--theme-borderLight);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--theme-borderLight);
  background: var(--theme-surfaceBackground);
}

.primary-btn {
  background: var(--theme-gradient);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px var(--theme-shadowMedium);
}
</style>
```

### 2. 输入框样式

```vue
<template>
  <div class="input-group">
    <label>标签</label>
    <input type="text" class="modern-input" placeholder="请输入...">
  </div>
</template>

<style scoped>
.input-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--theme-textPrimary);
  font-weight: 600;
  font-size: 14px;
}

.modern-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--theme-background);
  border: 2px solid var(--theme-border);
  border-radius: var(--radius-md);
  color: var(--theme-textPrimary);
  font-size: 15px;
  transition: all var(--transition-normal);
}

.modern-input:focus {
  outline: none;
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}
</style>
```

### 3. 渐变按钮组

```vue
<template>
  <div class="button-group">
    <button class="gradient-btn">主按钮</button>
    <button class="outline-btn">次按钮</button>
    <button class="ghost-btn">文字按钮</button>
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.gradient-btn {
  background: var(--theme-gradient);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 4px var(--theme-shadow);
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px var(--theme-shadowMedium);
}

.outline-btn {
  background: transparent;
  color: var(--theme-primary);
  border: 2px solid var(--theme-primary);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.outline-btn:hover {
  background: var(--theme-surfaceBackground);
}

.ghost-btn {
  background: transparent;
  color: var(--theme-textSecondary);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.ghost-btn:hover {
  color: var(--theme-primary);
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
}
</style>
```

---

## 🔍 故障排除 | Troubleshooting

### 问题1: 主题切换后颜色没变
**解决**: 确保使用了 CSS 变量而不是硬编码颜色
```css
/* ❌ 错误 */
color: #1890ff;

/* ✅ 正确 */
color: var(--theme-primary);
```

### 问题2: 移动端按钮太小
**解决**: 添加最小尺寸
```css
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### 问题3: 过渡效果不流畅
**解决**: 使用预定义的过渡变量
```css
/* ✅ 使用预定义 */
transition: all var(--transition-normal);

/* 而不是 */
transition: all 0.3s;
```

---

## 📚 更多资源 | More Resources

- 📖 完整文档: [THEME_SYSTEM.md](./THEME_SYSTEM.md)
- 🎨 设计系统: 查看 `src/assets/main.css`
- 🔧 主题配置: 查看 `src/stores/theme.js`
- 💡 组件示例: 查看 `src/components/` 下的各个组件

---

## 💡 小贴士 | Tips

1. **始终使用CSS变量** - 确保主题切换正常工作
2. **移动优先** - 先写移动端样式，再用 `@media (min-width:)` 扩展
3. **测试所有主题** - 切换到每个主题检查效果
4. **保持一致性** - 使用相同的间距、圆角、阴影系统
5. **性能优先** - 避免过度动画，使用硬件加速

---

**快速开始完成！** 🎉  
现在你已经掌握了主题系统的基本用法，开始构建美观的UI吧！

有问题？查看完整文档 [THEME_SYSTEM.md](./THEME_SYSTEM.md)
