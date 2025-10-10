<!-- src/components/GlobalNotification.vue -->
<template>
  <div class="notifications-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-item"
      @click="handleNotificationClick(notification)"
    >
      <div class="notification-avatar">
        <img 
          :src="replaceUrlRegex(notification.sender.avatar) || defaultAvatar" 
          :alt="notification.sender.username"
        />
      </div>
      <div class="notification-content">
        <div class="notification-header">
          <strong>{{ notification.conversation_name || notification.sender.username }}</strong>
          <span class="notification-time">{{ formatTime(notification.message.timestamp) }}</span>
        </div>
        <div class="notification-message">
          {{ getMessagePreview(notification.message) }}
        </div>
      </div>
      <div class="notification-close" @click.stop="removeNotification(notification.id)">
        ×
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMessageStore } from '@/stores/messageStore';
import { replaceUrlRegex } from '@/utils';

const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const defaultAvatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
const notifications = ref([]);
let notificationWebSocket = null;

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
  removeNotification(notification.id);
  // 标记会话为已读
  messageStore.markConversationAsRead(notification.conversation_id);
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

const addNotification = (notificationData) => {
  const notification = {
    id: Date.now(),
    ...notificationData
  };
  
  // 添加到通知列表开头
  notifications.value.unshift(notification);
  // 添加到消息存储的通知列表
  messageStore.addNotification(notification);
  // console.log('添加通知:1231222121333333333', notification);
  // 如果通知超过5个，移除最旧的
  if (notifications.value.length > 5) {
    notifications.value.pop();
    messageStore.removeNotification(removed.id); 
  }
  
  // 显示浏览器通知（如果用户允许）
  showBrowserNotification(notification);
};

const showBrowserNotification = (notification) => {
  // 检查浏览器是否支持通知
  if (!("Notification" in window)) {
    return;
  }
  
  // 检查用户是否已经允许或拒绝通知
  if (Notification.permission === "granted") {
    new Notification(`${notification.conversation_name || notification.sender.username}`, {
      body: getMessagePreview(notification.message),
      icon: notification.sender.avatar || defaultAvatar
    });
  } else if (Notification.permission !== "denied") {
    // 请求通知权限
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(`${notification.conversation_name || notification.sender.username}`, {
          body: getMessagePreview(notification.message),
          icon: notification.sender.avatar || defaultAvatar
        });
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
      // console.log('添加通知:12312221', data.notification);
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
  if ("Notification" in window) {
    if (Notification.permission === "default") {
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
  addNotification
});
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  max-width: 300px;
}

.notification-item {
  background: white;
  border-left: 4px solid #1890ff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  padding: 12px;
}

.notification-item:hover {
  transform: translateX(-5px);
}

.notification-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  flex-shrink: 0;
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
  margin-bottom: 4px;
}

.notification-header strong {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 8px;
}

.notification-message {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-close {
  color: #999;
  font-size: 18px;
  font-weight: bold;
  padding: 0 4px;
  cursor: pointer;
  flex-shrink: 0;
  align-self: flex-start;
}

.notification-close:hover {
  color: #666;
}

@media (max-width: 768px) {
  .notifications-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>