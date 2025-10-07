<template>
  <div class="message-list-page">
    <div class="message-header">
      <h2>消息 
        <span v-if="messageStore.totalUnread > 0" class="total-unread-badge">
          {{ messageStore.totalUnread }}
        </span>
      </h2>
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索聊天"
        style="width: 200px"
        @search="handleSearch"
      />
    </div>
    
    <!-- WebSocket 状态指示器 -->
    <div class="websocket-status" :class="websocketStatus">
      WebSocket: {{ websocketStatusText }}
    </div>
    
    <!-- 有数据时显示消息列表 -->
    <div v-if="filteredChats.length > 0" class="message-list">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="message-item"
        @click="goToChat(chat)"
      >
        <div class="avatar">
          <img :src="replaceUrlRegex(chat.avatar)" :alt="chat.name" />
        </div>
        <div class="message-content">
          <div class="message-top">
            <span class="name">{{ chat.name }}</span>
            <span class="time">{{ formatTime(chat.lastTime) }}</span>
          </div>
          <div class="message-bottom">
            <span class="last-message">{{ chat.lastMessage }}</span>
            <div class="message-badges">
              <a-badge v-if="getUnreadCount(chat.id) > 0" :count="getUnreadCount(chat.id)" class="unread-badge" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无数据时显示空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M52 44H12C10.8954 44 10 43.1046 10 42V14C10 12.8954 10.8954 12 12 12H52C53.1046 12 54 12.8954 54 14V42C54 43.1046 53.1046 44 52 44Z" stroke="#d9d9d9" stroke-width="2"/>
          <path d="M10 18H54" stroke="#d9d9d9" stroke-width="2"/>
          <path d="M16 24H24" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 32H32" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round"/>
          <circle cx="46" cy="28" r="2" fill="#d9d9d9"/>
          <circle cx="46" cy="36" r="2" fill="#d9d9d9"/>
        </svg>
      </div>
      <div class="empty-text">
        <h3>暂无消息</h3>
        <p>还没有任何聊天记录，快去和朋友们聊天吧</p>
      </div>
    </div>

    <!-- 通知中心 -->
    <div class="notifications-container">
      <div
        v-for="notification in messageStore.notifications"
        :key="notification.id"
        class="conversation-notification"
        @click="switchToConversation(notification.conversationId)"
      >
        <div class="notification-header">
          <strong>{{ notification.conversationName }}</strong>
          <span class="unread-count">{{ notification.unreadCount }}</span>
          <button class="close-btn" @click.stop="removeNotification(notification.id)">×</button>
        </div>
        <div class="notification-body">
          <img :src="replaceUrlRegex(notification.message.sender?.avatar) || defaultavatar" 
               :alt="notification.message.sender?.username" class="avatar">
          <div class="content">
            <div class="sender">{{ notification.message.sender?.username }}</div>
            <div class="message">{{ notification.message.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useMessageStore } from '@/stores/messageStore';
import WebSocketService from '@/services/websocket';
import { useAuthStore } from '@/stores/auth';
import { replaceUrlRegex } from '@/utils';

const router = useRouter();
const searchKeyword = ref('');
const defaultavatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';

const authStore = useAuthStore();
const messageStore = useMessageStore();

// WebSocket 状态
const websocketStatus = computed(() => WebSocketService.getStatus());
const websocketStatusText = computed(() => {
  const statusMap = {
    'connected': '已连接',
    'connecting': '连接中',
    'disconnected': '未连接',
    'closed': '已关闭',
    'closing': '关闭中',
    'unknown': '未知状态'
  };
  return statusMap[websocketStatus.value] || '未知状态';
});

// 过滤后的聊天列表
const filteredChats = computed(() => {
  const chats = messageStore.conversationList;
  
  if (!searchKeyword.value) {
    return chats;
  }
  
  return chats.filter(chat => 
    chat.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// 获取未读消息数量
const getUnreadCount = (conversationId) => {
  return messageStore.unreadCounts.get(conversationId) || 0;
};

// 格式化时间显示
const formatTime = (time) => {
  if (!time) return '';
  
  const now = new Date();
  const messageTime = new Date(time);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(messageTime.getFullYear(), messageTime.getMonth(), messageTime.getDate());
  const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return messageTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays === 2) {
    return '前天';
  } else if (diffDays < 7) {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${weekdays[messageTime.getDay()]}`;
  } else {
    return `${messageTime.getMonth() + 1}-${messageTime.getDate()}`;
  }
};

// 搜索处理
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value);
};

// 跳转到聊天页面
const goToChat = (chat) => {
  // 标记为已读
  messageStore.markConversationAsRead(chat.id);
  // 跳转到聊天页面
  const chatId = chat.id;
  router.push(`/home/chat/${chatId}`);
};

// 切换到会话
const switchToConversation = (conversationId) => {
  messageStore.switchToConversation(conversationId);
  // 这里可以添加跳转到聊天页面的逻辑
  router.push(`/home/chat/${conversationId}`);
};

// 移除通知
const removeNotification = (notificationId) => {
  messageStore.removeNotification(notificationId);
};

// 请求通知权限
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('通知权限:', permission);
    });
  }
};

onMounted(() => {
  console.log("初始化消息列表");
  
  // 请求通知权限
  requestNotificationPermission();
  
  // 加载会话列表
  messageStore.loadConversations().catch(error => {
    console.error('加载会话列表失败:', error);
    message.error('加载会话列表失败');
  });
  
  // 连接 WebSocket
  const userId = authStore.userInfo?.id;
  if (userId) {
    WebSocketService.connect(userId);
  } else {
    console.warn('用户ID为空，无法连接WebSocket');
  }
});

onUnmounted(() => {
  // 断开 WebSocket 连接
  WebSocketService.disconnect();
});
</script>

<style scoped>
.message-list-page {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.message-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.message-header h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-unread-badge {
  background: #ff3b30;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: normal;
}

.websocket-status {
  padding: 4px 16px;
  font-size: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.websocket-status.connected {
  background: #f6ffed;
  color: #52c41a;
}

.websocket-status.connecting {
  background: #fff7e6;
  color: #fa8c16;
}

.websocket-status.disconnected {
  background: #fff2f0;
  color: #ff4d4f;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

.message-item {
  display: flex;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.message-item:hover {
  background-color: #f8f8f8;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
  background: #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.name {
  font-weight: 500;
  font-size: 16px;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
}

.time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.message-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
}

.message-badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.unread-badge {
  :deep(.ant-badge-count) {
    background: #ff3b30;
    box-shadow: none;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
  }
}

/* 通知容器 */
.notifications-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
}

.conversation-notification {
  background: white;
  border-left: 4px solid #1890ff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.conversation-notification:hover {
  transform: translateX(-5px);
}

.notification-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header .unread-count {
  background: #ff4757;
  color: white;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 12px;
}

.notification-body {
  padding: 12px;
  display: flex;
  align-items: flex-start;
}

.notification-body .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.notification-body .content {
  flex: 1;
}

.notification-body .sender {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
}

.notification-body .message {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

/* 空状态样式 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.empty-text p {
  margin: 0;
  font-size: 14px;
  color: #999;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .message-header {
    padding: 12px;
  }
  
  .message-item {
    padding: 10px 12px;
  }
  
  .avatar {
    width: 44px;
    height: 44px;
  }
  
  .name {
    font-size: 15px;
  }
  
  .last-message {
    font-size: 13px;
  }
  
  .notifications-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .empty-state {
    padding: 30px 16px;
  }
}
</style>