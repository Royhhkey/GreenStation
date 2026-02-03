<template>
  <div  class="h-screen flex flex-col bg-gray-100">
    <a-layout>
      <a-layout-header class=" bg-blue-500 text-white p-4 flex justify-between items-center h-16 min-w-0 sticky top-0 z-10">
        <div class="text-2xl font-bold text-white">GreenStation</div>
        <a-button type="text" @click="logout">
          <LogoutOutlined style="color: #fff" />
        </a-button>
      </a-layout-header>
      <a-layout>
        <!-- 只有在非聊天页面才显示底部导航 -->
        <FloatingNav v-if="!isChatPage" />

        <a-layout-content class="p-4">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FloatingNav from '@/components/FloatingNav.vue';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 判断当前是否为聊天页面
const isChatPage = computed(() => {
  return route.path.startsWith('/home/chat/');
});

function logout() {
  authStore.clearUserInfo();
  router.push('/');
}
</script>

<style scoped>
/* .home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eaf2ff;
} */

/* .header {
  background-color: #2c3e8f;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  min-width: 0;
  position: sticky;
  top: 0;
  z-index: 100;
} */

/* .logo {
  font-weight: bold;
  font-size: 18px;
  color: white;
  white-space: nowrap;
} */

/* .menu-sider {
  background-color: #ffffff;
  min-width: 160px;
  max-width: 240px;
  width: 18vw;
  transition: width 0.2s;
} */

/* .content {
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 56px); 
  flex: 1;
} */

/* @media (max-width: 768px) {
  .menu-sider {
    min-width: 60px;
    width: 60px;
    max-width: 80px;
  }

  .logo {
    font-size: 14px;
  }

  .content {
    padding: 8px;
  }
} */
</style>
