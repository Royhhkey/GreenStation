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
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.back-button :deep(.anticon) {
  font-size: 16px;
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
  color: #000;
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.connection-status.connected {
  background: #52c41a;
  color: white;
}

.connection-status.disconnected {
  background: #faad14;
  color: white;
}
</style>
