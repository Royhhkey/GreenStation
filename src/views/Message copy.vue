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
        <div class="message-info">
          <div class="message-header">
            <span class="name">{{ chat.name }}</span>
            <span class="time">{{ formatTime(chat.lastTime) }}</span>
          </div>
          <div class="message-preview">
            <span class="last-message">{{ chat.lastMessage }}</span>
            <a-badge v-if="chat.unreadCount > 0" :count="chat.unreadCount" />
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

// 模拟消息数据
const chats = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: '你好，这个商品还在吗？',
    lastTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: '价格可以便宜点吗？',
    lastTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: '什么时候可以交易？',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1
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

// 格式化时间显示
const formatTime = (time) => {
  const now = new Date();
  const messageTime = new Date(time);
  const diff = now - messageTime;
  
  if (diff < 60 * 1000) return '刚刚';
  else if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`;
  else if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  else if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  else return messageTime.toLocaleDateString('zh-CN');
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



/* .message-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: sticky;
  top: 0; 
  z-index: 1000;
  flex-shrink: 0; 
} */

.message-header h2 {
  margin: 0;
  color: #333;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #fafafa;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.message-preview {
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

@media (max-width: 768px) {
  .message-header {
    padding: 12px;
  }
  
  .message-item {
    padding: 12px;
  }
  
  .avatar {
    width: 44px;
    height: 44px;
  }
}
</style>