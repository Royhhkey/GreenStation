<!-- ChatHeader.vue -->
<template>
  <div class="chat-header">
    <div class="back-button" @click="backToList">
      <left-outlined />
    </div>
    <div class="head-right">
      <div
        class="connection-status"
        :class="{ connected: isConnected, disconnected: !isConnected }"
      >
        {{ isConnected ? '已连接' : '连接中...' }}
      </div>
    </div>
    <div class="chat-user-info">
      <div class="user-info">
        <div class="name">{{ chat.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LeftOutlined } from '@ant-design/icons-vue';

defineProps({
  chat: Object,
  isConnected: Boolean,
});

const emit = defineEmits(['backToList']);

const backToList = () => {
  emit('backToList');
};
</script>

<style scoped>
.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--theme-gradient);
  box-shadow: var(--theme-shadow);
  position: sticky;
  transition: var(--transition-normal);
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--theme-textPrimary);
  font-size: 14px;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  transition: var(--transition-fast);
}

.back-button:hover {
  color: var(--theme-primary);
}

.back-button :deep(.anticon) {
  font-size: 18px;
  margin-right: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 16px;
}

.user-info .name {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-textPrimary);
}

.user-info {
  position: relative;
  right: 20px;
}

.head-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.connection-status {
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  white-space: nowrap;
  transition: var(--transition-fast);
}

.connection-status.connected {
  background: var(--theme-primary);
  color: white;
}

.connection-status.disconnected {
  background: var(--theme-textTertiary);
  color: white;
}

@media (min-width: 768px) {
  .chat-header {
    padding: 16px 24px;
  }

  .user-info .name {
    font-size: 18px;
  }

  .connection-status {
    font-size: 13px;
  }
}
</style>
