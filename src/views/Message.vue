<template>
  <div class="message-list-page">
    <div class="message-header">
      <h2>消息</h2>
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索聊天"
        style="width: 200px"
        @search="handleSearch"
      />
    </div>
    
    <div class="message-list">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="message-item"
        @click="goToChat(chat.id)"
      >
        <div class="avatar">
          <img :src="chat.avatar" :alt="chat.name" />
        </div>
        <div class="message-content">
          <div class="message-top">
            <span class="name">{{ chat.name }}</span>
            <span class="time">{{ formatTime(chat.lastTime) }}</span>
          </div>
          <div class="message-bottom">
            <span class="last-message">{{ chat.lastMessage }}</span>
            <div class="message-badges">
              <a-badge v-if="chat.unreadCount > 0" :count="chat.unreadCount" class="unread-badge" />
              <span v-if="chat.mute" class="mute-icon">🔇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchKeyword = ref('');

// 模拟消息数据 - 根据你提供的截图样式调整
const chats = ref([
  {
    id: 1,
    name: '持剑行山雪',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: '收到！',
    lastTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 0,
    mute: false
  },
  {
    id: 2,
    name: 'Toriko',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: '[事项提醒]',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 8-31
    unreadCount: 0,
    mute: true
  },
  {
    id: 3,
    name: '裤衩114514',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: '[表情]',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 33), // 8-23
    unreadCount: 0,
    mute: false
  },
  {
    id: 4,
    name: '八荒88',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: '[表情]',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 69), // 7-22
    unreadCount: 0,
    mute: false
  },
  {
    id: 5,
    name: '35岁带4娃画稿宝妈日常',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: '笑死我了',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 162), // 4-20
    unreadCount: 3,
    mute: false
  }
]);

// 过滤后的聊天列表
const filteredChats = computed(() => {
  if (!searchKeyword.value) {
    return chats.value.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
  }
  
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchKeyword.value.toLowerCase())
  ).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
});

// 格式化时间显示 - 改为QQ样式
const formatTime = (time) => {
  const now = new Date();
  const messageTime = new Date(time);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(messageTime.getFullYear(), messageTime.getMonth(), messageTime.getDate());
  const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // 今天显示具体时间
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
    // 超过一周显示月日
    return `${messageTime.getMonth() + 1}-${messageTime.getDate()}`;
  }
};

// 搜索处理
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value);
};

// 跳转到聊天页面
const goToChat = (chatId) => {
  router.push(`/home/chat/${chatId}`);
};
</script>

<style scoped>
.message-list-page {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
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

.message-item:active {
  background-color: #e6e6e6;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 6px;
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

.mute-icon {
  font-size: 12px;
  color: #999;
}

/* 分割线样式 */
.message-item::after {
  content: '';
  position: absolute;
  left: 76px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #f0f0f0;
}

.message-item:last-child::after {
  display: none;
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
}
</style>