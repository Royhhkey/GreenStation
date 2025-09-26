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
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 8px;
  transition: all 0.3s;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}


.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  position: relative;
}

/* 选中状态的样式 */
.nav-item.active {
  background: #e6f7ff;
}

/* .nav-item.active::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: #1890ff;
  border-radius: 2px;
} */

.nav-item.active .nav-icon,
.nav-item.active .nav-text {
  color: #1890ff;
}

.nav-icon {
  font-size: 24px;
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

@media (max-width: 768px) {
  .floating-nav {
    right: 50%;
    left: 50%;
    top: auto;
    bottom: 10px;
    transform: translateX(-50%);
    border-radius: 20px;
    padding: 8px 4px;
    width: 95vw;
    max-width: 400px;
  }
  .nav-items {
    flex-direction: row;
    justify-content: space-around;
    gap: 0;
  }
  .nav-item {
    flex: 1;
    padding: 8px 0;
  }
}
</style>