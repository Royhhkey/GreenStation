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
              <a-badge
                v-if="chat.unreadCount > 0"
                :count="chat.unreadCount"
                class="unread-badge"
              />
              <!-- <span v-if="chat.mute" class="mute-icon">🔇</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据时显示空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M52 44H12C10.8954 44 10 43.1046 10 42V14C10 12.8954 10.8954 12 12 12H52C53.1046 12 54 12.8954 54 14V42C54 43.1046 53.1046 44 52 44Z"
            stroke="#d9d9d9"
            stroke-width="2"
          />
          <path d="M10 18H54" stroke="#d9d9d9" stroke-width="2" />
          <path
            d="M16 24H24"
            stroke="#d9d9d9"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M16 32H32"
            stroke="#d9d9d9"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle cx="46" cy="28" r="2" fill="#d9d9d9" />
          <circle cx="46" cy="36" r="2" fill="#d9d9d9" />
        </svg>
      </div>
      <div class="empty-text">
        <h3>暂无消息</h3>
        <p>还没有任何聊天记录，快去和朋友们聊天吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
// import {
//   GetMyAllConversations
// } from '@/api';
import { replaceUrlRegex } from '@/utils';
import { useMessageStore } from '@/stores/messageStore';
// import { message } from 'ant-design-vue';

const router = useRouter();
const searchKeyword = ref('');
// const defaultavatar ='https://eo-oss.roy22.xyz/secondHand/avatar.png '
// const loading = ref(false);
// import { useAuthStore } from '@/stores/auth'
// const authStore = useAuthStore()
const messageStore = useMessageStore();

// 模拟消息数据 - 根据你提供的截图样式调整
const chats = ref([]);

// 过滤后的聊天列表
const filteredChats = computed(() => {
  // chats.value = messageStore.conversations;
  if (!searchKeyword.value) {
    return chats.value.sort(
      (a, b) => new Date(b.lastTime) - new Date(a.lastTime),
    );
  }

  return chats.value
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        chat.lastMessage
          .toLowerCase()
          .includes(searchKeyword.value.toLowerCase()),
    )
    .sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
});

// 格式化时间显示 - 改为QQ样式
const formatTime = (time) => {
  if (!time) return '';

  const now = new Date();
  const messageTime = new Date(time);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    messageTime.getFullYear(),
    messageTime.getMonth(),
    messageTime.getDate(),
  );
  const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // 今天显示具体时间
    return messageTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
const goToChat = (chat) => {
  const chatId = chat.id;
  router.push(`/home/chat/${chatId}`);
  // chat.unreadCount = 0; // 清除未读消息数
};

// // 加载聊天列表
// const loadChats = async () => {
//   loading.value = true;
//   try {
//     const { data } = await GetMyAllConversations();
//     console.log("data", data);
//     chats.value = data.results.map(item => {
//       console.log("item", item); // 打印每个 item
//       // if (item.participant2_info.id === item.participant1_info.id) {
//       //   // 自己发的消息不显示
//       //   return null;
//       // }
//       // if (!item.last_message) {
//       //   // 没有消息记录的不显示
//       //   return null;
//       // }
//       if(item.participant2_info.id === authStore.userInfo.id){
//         // 对方是自己不显示
//         return {
//           id: item.participant1_info.id,
//           name: item.participant1_info.username,
//           avatar: item.participant1_info.avatar || defaultavatar,
//           lastMessage: item.last_message?.content || '暂无消息', // 使用可选链操作符和默认值
//           lastTime: item.last_message?.timestamp ||'', // 使用可选链操作符和默认值
//           unreadCount: item.unread_count,
//         }
//       }
//       return {
//         id: item.participant2_info.id,
//         name: item.participant2_info.username,
//         avatar: item.participant2_info.avatar || defaultavatar,
//         lastMessage: item.last_message?.content || '暂无消息', // 使用可选链操作符和默认值
//         lastTime: item.last_message?.timestamp ||'', // 使用可选链操作符和默认值
//         unreadCount: item.unread_count,
//       };
//     });
//   } catch (error) {
//     console.error('加载聊天列表失败:', error);
//     message.error('加载聊天列表失败');
//   } finally {
//     loading.value = false;
//   }
// };

watch(
  () => messageStore.conversations,
  (newVal, oldVal) => {
    console.log('newVal', newVal);
    chats.value = newVal;
  },
);
onMounted(() => {
  // console.log("123213213d$$$$");
  // loadChats();
  messageStore.loadConversations();
});
</script>

<style scoped>
/* Message Page - Theme-aware Design */
.message-list-page {
  height: 100vh;
  background: var(--theme-cardBackground);
  display: flex;
  flex-direction: column;
  transition: background var(--transition-normal);
}

/* Message Header */
.message-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--theme-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--theme-cardBackground);
  transition: all var(--transition-normal);
}

.message-header h2 {
  margin: 0;
  color: var(--theme-textPrimary);
  font-size: 1.125rem;
  font-weight: 600;
}

/* Message List */
.message-list {
  flex: 1;
  overflow-y: auto;
  background: var(--theme-surfaceBackground);
  transition: background var(--transition-normal);
}

.message-list::-webkit-scrollbar {
  width: 8px;
}

.message-list::-webkit-scrollbar-track {
  background: var(--theme-surfaceBackground);
}

.message-list::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: var(--radius-md);
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: var(--theme-primary);
}

/* Message Item */
.message-item {
  display: flex;
  padding: var(--spacing-md);
  background: var(--theme-cardBackground);
  border-bottom: 1px solid var(--theme-borderLight);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.message-item:hover {
  background: var(--theme-surfaceBackground);
  transform: translateX(4px);
}

.message-item:active {
  background: var(--theme-surfaceBackground);
  transform: translateX(2px);
}

/* Avatar */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
  background: var(--theme-surfaceBackground);
  border: 2px solid var(--theme-borderLight);
  transition: all var(--transition-normal);
}

.message-item:hover .avatar {
  border-color: var(--theme-primary);
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Message Content */
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
  font-weight: 600;
  font-size: 1rem;
  color: var(--theme-textPrimary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: var(--spacing-sm);
  transition: color var(--transition-normal);
}

.time {
  font-size: 0.75rem;
  color: var(--theme-textTertiary);
  flex-shrink: 0;
  transition: color var(--transition-normal);
}

.message-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 0.875rem;
  color: var(--theme-textSecondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: var(--spacing-sm);
  transition: color var(--transition-normal);
}

.message-badges {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.unread-badge {
  :deep(.ant-badge-count) {
    background: #ff3b30;
    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    font-weight: 600;
  }
}

.mute-icon {
  font-size: 0.75rem;
  color: var(--theme-textTertiary);
}

/* Message Item Border */
.message-item::after {
  content: '';
  position: absolute;
  left: 76px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--theme-borderLight);
  transition: background var(--transition-normal);
}

.message-item:last-child::after {
  display: none;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--theme-surfaceBackground);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  transition: background var(--transition-normal);
}

.empty-icon {
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
  transition: opacity var(--transition-normal);
}

.empty-icon svg {
  width: 64px;
  height: 64px;
}

.empty-text h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1rem;
  color: var(--theme-textSecondary);
  font-weight: 600;
  transition: color var(--transition-normal);
}

.empty-text p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--theme-textTertiary);
  line-height: 1.5;
  transition: color var(--transition-normal);
}

/* Responsive Design - Mobile First */
@media (max-width: 768px) {
  .message-header {
    padding: var(--spacing-sm);
  }

  .message-item {
    padding: 10px var(--spacing-sm);
  }

  .avatar {
    width: 44px;
    height: 44px;
  }

  .name {
    font-size: 0.9375rem;
  }

  .last-message {
    font-size: 0.8125rem;
  }

  .empty-state {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .empty-icon svg {
    width: 48px;
    height: 48px;
  }

  .empty-text h3 {
    font-size: 0.9375rem;
  }

  .empty-text p {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .message-header h2 {
    font-size: 1rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .name {
    font-size: 0.875rem;
  }

  .time {
    font-size: 0.6875rem;
  }

  .last-message {
    font-size: 0.75rem;
  }
}
</style>
