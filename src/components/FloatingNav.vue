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
import { ShoppingOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { GetAllUnreadMessagesCounts } from '@/api';

const router = useRouter();
const route = useRoute();

const unreadMessagesCount = ref(0);

const navItems = [
  {
    key: 'items',
    text: '商品',
    icon: ShoppingOutlined,
    route: '/home/items'
  },
  {
    key: 'messages',
    text: '消息',
    icon: MessageOutlined,
    route: '/home/messages'
  },
  {
    key: 'profile',
    text: '我的',
    icon: UserOutlined,
    route: '/home/profile'
  }
];

// 获取未读消息数
const getUnreadMessagesCounts = async () => {
  try {
    const {data} = await GetAllUnreadMessagesCounts();
          console.log('res', data)

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
  const item = navItems.find(item => item.key === key);
  if (item) {
    router.push(item.route);
  }
};

// 监听路由变化，当进入消息页面时清零未读数，离开时更新未读数
watch(
  () => route.path,
  (newPath) => {
     console.log('newPath', newPath)
      getUnreadMessagesCounts();

  }
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
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 16px;
  transition: all 0.3s;
  width: 90%;
  max-width: 400px;
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
  transition: all 0.3s;
  border-radius: 12px;
  position: relative;
  flex: 1;
}

/* 选中状态的样式 */
.nav-item.active {
  background: #e6f7ff;
}

.nav-item.active .nav-icon,
.nav-item.active .nav-text {
  color: #1890ff;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
  color: #666;
}

.nav-text {
  font-size: 12px;
  color: #666;
}

.nav-item:hover {
  background: #f0f0f0;
}

.nav-item:hover .nav-icon,
.nav-item:hover .nav-text {
  color: #1890ff;
}

/* 消息未读数样式 */
.message-badge {
  position: absolute;
  top: 4px;
  right: 20%;
  transform: translateX(50%);
}

.message-badge :deep(.ant-badge-count) {
  background: #ff3b30;
  box-shadow: none;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 10px;
  padding: 0 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .floating-nav {
    bottom: 10px;
    width: 95%;
    padding: 6px 12px;
  }
  
  .nav-item {
    padding: 10px 0;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .nav-text {
    font-size: 10px;
  }
  
  .message-badge {
    top: 2px;
    right: 25%;
  }
}
</style>