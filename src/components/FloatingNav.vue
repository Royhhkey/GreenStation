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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

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

const isActive = (path) => {
  return route.path === path;
};

const handleClick = (key) => {
  const item = navItems.find(item => item.key === key);
  if (item) {
    router.push(item.route);
  }
};
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
}
</style>