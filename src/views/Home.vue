<template>
  <div class="home-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">校园二手交易平台</div>
        <a-button type="text" @click="logout">退出登录</a-button>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="200" class="menu-sider">
          <a-menu
            mode="inline"
            :selectedKeys="[selectedKey]"
            @click="handleMenuSelect"
            :items="menuItems"
          />
        </a-layout-sider>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

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
}
.header {
  background-color: #2c3e8f;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}
.logo {
  font-weight: bold;
  font-size: 18px;
  color: white;
}
.menu-sider {
  background-color: #f0f5ff;
}
.content {
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 56px);
}
</style>