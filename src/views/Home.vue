<template>
  <div class="home-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">校园二手交易平台</div>
        <a-button type="text" @click="logout">
             <LogoutOutlined  style="color: #fff;"/>
        </a-button>
      </a-layout-header>
      <a-layout>
              <FloatingNav />

        <!-- <a-layout-sider width="200" class="menu-sider">
          <a-menu
            mode="inline"
            :selectedKeys="[selectedKey]"
            @click="handleMenuSelect"
            :items="menuItems"
          />
        </a-layout-sider> -->
        <a-layout-content class="content">
          <!-- <Myserach/> -->
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import FloatingNav from '@/components/FloatingNav.vue'

import {LogoutOutlined} from '@ant-design/icons-vue'

const router = useRouter();
const route = useRoute();

const menuItems = [
  { key: "/home/profile", label: "个人主页" },
  { key: "/home/items", label: "交易物品" },
];

const selectedKey = computed(() => {
  return route.path.startsWith("/home/items") ? "/home/items" : "/home/profile";
});

function logout() {
  router.push("/");
}

function handleMenuSelect({ key }) {
  router.push(key);
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eaf2ff;
}
.header {
  background-color: #2c3e8f;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  min-width: 0;
}
.logo {
  font-weight: bold;
  font-size: 18px;
  color: white;
  white-space: nowrap;
}
.menu-sider {
  background-color: #ffffff;
  min-width: 160px;
  max-width: 240px;
  width: 18vw;
  transition: width 0.2s;
}
.content {
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 56px);
  overflow: auto;
  flex: 1;
}
@media (max-width: 768px) {
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
}

</style>