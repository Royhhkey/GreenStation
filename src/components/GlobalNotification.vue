<!-- src/components/GlobalNotification.vue -->
<template>
  <div class="notifications-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      @click="handleNotificationClick(notification)"
    >
      <div class="notification-item" v-show="isshow(notification.sender.id)">
        <div class="notification-avatar">
          <img
            :src="replaceUrlRegex(notification.sender.avatar) || defaultAvatar"
            :alt="notification.sender.username"
          />
        </div>
        <div class="notification-content">
          <div class="notification-header">
            <strong>{{ notification.sender.username }}</strong>
            <span class="notification-time">{{
              formatTime(notification.message.timestamp)
            }}</span>
          </div>
          <div class="notification-message">
            {{ getMessagePreview(notification.message) }}
          </div>
        </div>
        <div
          class="notification-close"
          @click.stop="removeNotification(notification.sender.id)"
        >
          ×
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMessageStore } from '@/stores/messageStore';
import { replaceUrlRegex } from '@/utils';

const route = useRoute(); // 获取当前路由对象
const router = useRouter();

const authStore = useAuthStore();
const messageStore = useMessageStore();

const defaultAvatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
const notifications = ref([]);
let notificationWebSocket = null;
const chatId = ref(parseInt(route.params.id) || -1);
watch(
  () => route.path,
  (newId) => {
    if (newId) {
      chatId.value = parseInt(route.params.id) || -1;
      if (chatId.value != -1) {
        removeNotification(chatId.value);
      }
    }
  },
);

const isshow = (ConversationId) => {
  return ConversationId != chatId.value;
};

const formatTime = (time) => {
  if (!time) return '';

  const now = new Date();
  const messageTime = new Date(time);
  const diffMs = now - messageTime;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      return messageTime.toLocaleDateString('zh-CN');
    }
  }
};

const getMessagePreview = (message) => {
  if (message.type === 'image') {
    return '[图片]';
  }
  return message.content;
};

const handleNotificationClick = (notification) => {
  // 跳转到对应的聊天页面
  router.push(`/home/chat/${notification.sender.id}`);
  removeNotification(notification.sender.id);
  // // 标记会话为已读
  // messageStore.markConversationAsRead(notification.conversation_id);
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.sender.id !== id);
};

const addNotification = (notificationData) => {
  const notification = {
    id: Date.now(),
    ...notificationData,
  };

  if (chatId.value != -1) {
    if (notification.sender.id == chatId.value) {
      return;
    }
  }

  // 添加到通知列表开头
  notifications.value.unshift(notification);
  // 添加到消息存储的通知列表
  messageStore.addNotification(notification);
  // console.log('添加通知:1231222121333333333', notification);
  // 如果通知超过5个，移除最旧的
  if (notifications.value.length > 5) {
    notifications.value.pop();
    messageStore.removeNotification(notification.sender.id);
  }

  // 显示浏览器通知（如果用户允许）
  showBrowserNotification(notification);
};

const showBrowserNotification = (notification) => {
  // 检查浏览器是否支持通知
  if (!('Notification' in window)) {
    return;
  }

  // 检查用户是否已经允许或拒绝通知
  if (Notification.permission === 'granted') {
    new Notification(
      `${notification.conversation_name || notification.sender.username}`,
      {
        body: getMessagePreview(notification.message),
        icon: notification.sender.avatar || defaultAvatar,
      },
    );
  } else if (Notification.permission !== 'denied') {
    // 请求通知权限
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(
          `${notification.conversation_name || notification.sender.username}`,
          {
            body: getMessagePreview(notification.message),
            icon: notification.sender.avatar || defaultAvatar,
          },
        );
      }
    });
  }
};

const connectNotificationWebSocket = () => {
  try {
    const userId = authStore.userInfo.id;
    if (!userId) return;

    let backendHost = import.meta.env.VITE_API_URL || 'localhost:8000';
    backendHost = backendHost.replace(/^http?:\/\//, '');
    backendHost = backendHost.replace(/\/$/, '');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${backendHost}/ws/notifications/${userId}/?token=${localStorage.getItem('token')}`;

    // console.log('Connecting to Notification WebSocket:', wsUrl);

    notificationWebSocket = new WebSocket(wsUrl);

    notificationWebSocket.onopen = () => {
      // console.log('Notification WebSocket connected');
    };

    notificationWebSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('123213:', data);
      console.log('添加通知:12312221', data.notification);
      if (data.notification) {
        // console.log('添加通知:1231222121333333333', );
        addNotification(data.notification);
      }
    };

    notificationWebSocket.onclose = (event) => {
      console.log('Notification WebSocket disconnected');
      // 自动重连
      setTimeout(connectNotificationWebSocket, 3000);
    };

    notificationWebSocket.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };
  } catch (error) {
    console.error('Notification WebSocket connection failed:', error);
  }
};

onMounted(() => {
  // 请求通知权限
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // 连接通知WebSocket
  connectNotificationWebSocket();
});

onUnmounted(() => {
  if (notificationWebSocket) {
    notificationWebSocket.close();
  }
});

// 暴露方法给父组件
defineExpose({
  addNotification,
});
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  background: var(--theme-cardBackground);
  border-left: 4px solid var(--theme-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-shadowMedium);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: flex-start;
  padding: 14px;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
  border: 1px solid var(--theme-borderLight);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-item:hover {
  transform: translateX(-6px);
  box-shadow: var(--theme-shadowHeavy);
  border-left-width: 5px;
}

.notification-item:active {
  transform: translateX(-4px) scale(0.98);
}

.notification-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--theme-borderLight);
  transition: border-color var(--transition-fast);
}

.notification-item:hover .notification-avatar {
  border-color: var(--theme-primary);
}

.notification-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
}

.notification-header strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-textPrimary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--transition-normal);
}

.notification-time {
  font-size: 12px;
  color: var(--theme-textTertiary);
  flex-shrink: 0;
  transition: color var(--transition-normal);
}

.notification-message {
  font-size: 13px;
  color: var(--theme-textSecondary);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  transition: color var(--transition-normal);
}

.notification-close {
  color: var(--theme-textTertiary);
  font-size: 20px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  align-self: flex-start;
  line-height: 1;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.notification-close:hover {
  color: var(--theme-textPrimary);
  background: var(--theme-surfaceBackground);
}

.notification-close:active {
  transform: scale(0.9);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .notifications-container {
    top: 70px;
    right: 12px;
    left: 12px;
    max-width: none;
  }

  .notification-item {
    padding: 12px;
    border-radius: var(--radius-md);
  }

  .notification-item:hover {
    transform: translateY(-2px);
  }

  .notification-avatar {
    width: 36px;
    height: 36px;
  }

  .notification-header strong {
    font-size: 13px;
  }

  .notification-time {
    font-size: 11px;
  }

  .notification-message {
    font-size: 12px;
  }

  .notification-close {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .notifications-container {
    top: 65px;
    right: 8px;
    left: 8px;
  }

  .notification-item {
    padding: 10px;
    gap: 10px;
  }

  .notification-avatar {
    width: 32px;
    height: 32px;
  }
}

/* 深色主题特定优化（如果需要） */
@media (prefers-color-scheme: dark) {
  .notification-item {
    box-shadow: var(--theme-shadowHeavy), 0 0 0 1px rgba(255, 255, 255, 0.05);
  }
}
</style>
