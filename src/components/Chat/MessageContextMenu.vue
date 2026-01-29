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
/* 右键菜单 */
.message-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 140px;
  padding: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  color: #333;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.menu-item :deep(.anticon) {
  font-size: 12px;
}

@media (max-width: 768px) {
  .message-context-menu {
    min-width: 120px;
  }

  .menu-item {
    padding: 10px 12px;
    font-size: 13px;
  }
}

/* 为移动端优化菜单样式 */
@media (max-width: 768px) {
  .message-context-menu {
    min-width: 160px;
    font-size: 16px; /* 移动端字体稍大 */
  }

  .menu-item {
    padding: 12px 16px;
    font-size: 16px;
  }
}
</style>
