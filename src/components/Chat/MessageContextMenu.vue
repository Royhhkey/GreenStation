<!-- MessageContextMenu.vue -->
<template>
  <div
    v-if="showContextMenu"
    class="message-context-menu"
    :style="contextMenuStyle"
    @click.stop
  >
    <div class="menu-item" @click="withdrawMessage" v-if="canWithdraw(message)">
      <undo-outlined />
      <span>撤回消息</span>
    </div>
    <div class="menu-item" @click="copyMessage">
      <copy-outlined />
      <span>复制</span>
    </div>
  </div>
</template>

<script setup>
import { UndoOutlined, CopyOutlined } from '@ant-design/icons-vue';

defineProps({
  showContextMenu: Boolean,
  contextMenuStyle: Object,
  message: Object,
  canWithdraw: Function,
});

const emit = defineEmits(['withdraw', 'copy', 'close']);

const withdrawMessage = () => {
  emit('withdraw');
  emit('close');
};

const copyMessage = () => {
  emit('copy');
  emit('close');
};
</script>

<style scoped>
.message-context-menu {
  position: fixed;
  background: var(--theme-cardBackground);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-shadowHeavy);
  z-index: 1000;
  min-width: 140px;
  padding: 4px 0;
  backdrop-filter: blur(8px);
  transition: var(--transition-fast);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition-fast);
  color: var(--theme-textPrimary);
  min-height: 44px;
}

.menu-item:hover {
  background: var(--theme-surfaceBackground);
  color: var(--theme-primary);
}

.menu-item:active {
  background: var(--theme-primary);
  color: white;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid var(--theme-borderLight);
}

.menu-item :deep(.anticon) {
  font-size: 14px;
  transition: var(--transition-fast);
}

@media (min-width: 768px) {
  .message-context-menu {
    min-width: 160px;
  }

  .menu-item {
    padding: 12px 16px;
    font-size: 15px;
  }

  .menu-item :deep(.anticon) {
    font-size: 15px;
  }
}
</style>
