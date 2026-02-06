<template>
  <div class="theme-switcher">
    <a-dropdown :trigger="['click']" placement="bottomRight">
      <a-button 
        class="theme-button" 
        shape="circle"
        :style="{ background: currentThemeConfig.gradient }"
      >
        <BgColorsOutlined class="theme-icon" />
      </a-button>
      <template #overlay>
        <a-menu 
          class="theme-menu"
          :selected-keys="[themeStore.currentTheme]"
          @click="handleThemeChange"
        >
          <a-menu-item 
            v-for="theme in availableThemes" 
            :key="theme.value"
            class="theme-menu-item"
          >
            <div class="theme-option">
              <div 
                class="theme-color-preview"
                :style="{ background: themePresets[theme.value].gradient }"
              ></div>
              <span class="theme-label">{{ theme.label }}</span>
              <CheckOutlined 
                v-if="themeStore.currentTheme === theme.value" 
                class="theme-check"
              />
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BgColorsOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { useThemeStore, themePresets } from '@/stores/theme';

const themeStore = useThemeStore();

const availableThemes = computed(() => themeStore.getAvailableThemes());
const currentThemeConfig = computed(() => themeStore.getThemeConfig());

const handleThemeChange = ({ key }) => {
  themeStore.setTheme(key);
};
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-button {
  width: 40px;
  height: 40px;
  border: none;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.12);
}

.theme-icon {
  font-size: 20px;
  color: white;
}

:deep(.theme-menu) {
  min-width: 200px;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.theme-menu-item) {
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 8px 12px;
}

:deep(.theme-menu-item:last-child) {
  margin-bottom: 0;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-color-preview {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.theme-check {
  color: var(--theme-primary, #1890ff);
  font-size: 16px;
}

@media (max-width: 768px) {
  .theme-button {
    width: 36px;
    height: 36px;
  }
  
  .theme-icon {
    font-size: 18px;
  }
}
</style>
