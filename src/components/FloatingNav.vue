<template>
  <div class="floating-nav">
    <div class="nav-items">
      <div
        v-for="item in navItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: isActive(item.route) }"
        @click="handleClick(item.key)"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-text">{{ item.text }}</span>
        <!-- 消息未读数提示 -->
        <a-badge
          v-if="item.key === 'messages' && unreadMessagesCount > 0"
          :count="unreadMessagesCount"
          class="message-badge"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { GetAllUnreadMessagesCounts } from '@/api';
import { useMessageStore } from '@/stores/messageStore';
const router = useRouter();
const route = useRoute();
const messageStore = useMessageStore();

const unreadMessagesCount = ref(0);
watch(
  () => messageStore.totalUnread,
  (newVal) => {
    console.log('newVal', newVal);
    unreadMessagesCount.value = newVal;
  },
);
const navItems = [
  {
    key: 'items',
    text: '商品',
    icon: ShoppingOutlined,
    route: '/home/items',
  },
  {
    key: 'messages',
    text: '消息',
    icon: MessageOutlined,
    route: '/home/messages',
  },
  {
    key: 'profile',
    text: '我的',
    icon: UserOutlined,
    route: '/home/profile',
  },
];

// 获取未读消息数
const getUnreadMessagesCounts = async () => {
  try {
    const { data } = await GetAllUnreadMessagesCounts();
    console.log('res', data);

    if (data.code === '01') {
      // console.log('res', res)
      unreadMessagesCount.value = data.unread_count || 0;
    }
  } catch (error) {
    console.error('获取未读消息数失败:', error);
  }
};

const isActive = (path) => {
  return route.path === path;
};

const handleClick = (key) => {
  const item = navItems.find((item) => item.key === key);
  if (item) {
    router.push(item.route);
  }
};

// 监听路由变化，当进入消息页面时清零未读数，离开时更新未读数
watch(
  () => route.path,
  (newPath) => {
    console.log('newPath', newPath);
    getUnreadMessagesCounts();
  },
);

// 组件挂载时获取未读消息数
getUnreadMessagesCounts();
</script>

<style scoped>
.floating-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: var(--theme-cardBackground);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-xl);
  box-shadow: 
    0 10px 25px -5px var(--theme-shadowMedium),
    0 8px 10px -6px var(--theme-shadowMedium);
  padding: 8px 16px;
  transition: all var(--transition-normal);
  width: 90%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.nav-items {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: all var(--transition-normal);
  border-radius: var(--radius-md);
  position: relative;
  flex: 1;
  min-height: 48px; /* Mobile-friendly touch target */
}

/* 选中状态的样式 - 使用主题色 */
.nav-item.active {
  background: linear-gradient(135deg, 
    rgba(24, 144, 255, 0.08) 0%, 
    rgba(24, 144, 255, 0.12) 100%);
}

.nav-item.active .nav-icon,
.nav-item.active .nav-text {
  color: var(--theme-primary);
}

.nav-icon {
  font-size: 22px;
  margin-bottom: 4px;
  color: var(--theme-textSecondary);
  transition: all var(--transition-normal);
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--theme-textSecondary);
  transition: all var(--transition-normal);
}

.nav-item:hover {
  background: var(--theme-surfaceBackground);
  transform: translateY(-2px);
}

.nav-item:hover .nav-icon,
.nav-item:hover .nav-text {
  color: var(--theme-primary);
}

.nav-item:active {
  transform: translateY(0);
}

/* 消息未读数样式 */
.message-badge {
  position: absolute;
  top: 4px;
  right: 20%;
  transform: translateX(50%);
}

.message-badge :deep(.ant-badge-count) {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 11px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: var(--radius-full);
}

/* 移动端适配 - Mobile First */
@media (max-width: 768px) {
  .floating-nav {
    bottom: 12px;
    width: 96%;
    max-width: 100%;
    padding: 6px 12px;
    border-radius: var(--radius-lg);
  }

  .nav-item {
    padding: 10px 0;
    min-height: 52px; /* Larger for mobile */
  }

  .nav-icon {
    font-size: 24px;
  }

  .nav-text {
    font-size: 11px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .floating-nav {
    max-width: 450px;
  }
}

/* Desktop - hide floating nav on large screens, use sidebar instead */
@media (min-width: 1025px) {
  .floating-nav {
    bottom: 24px;
    max-width: 420px;
  }
  
  .nav-item {
    padding: 14px 0;
  }
  
  .nav-icon {
    font-size: 24px;
  }
  
  .nav-text {
    font-size: 13px;
  }
}
</style>
