<template>
  <div class="login-container">
    <a-card class="login-card" bordered>
      <h2 class="title">校园二手交易平台登录</h2>
      <a-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        layout="vertical"
        @finish="handleLogin"
      >
        <a-form-item label="用户名" name="username" :rules="rules.username">
          <a-input
            v-model:value="form.username"
            autocomplete="off"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="rules.password">
          <a-input-password
            v-model:value="form.password"
            autocomplete="off"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
      <div class="extra-links">
        <a @click.prevent="goToForgot">忘记密码？</a>
        <a @click.prevent="goToRegister" style="margin-left: 16px;">创建账号</a>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref,onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { login } from "../api/index";
import { useAuthStore } from '@/stores/auth'

const router = useRouter();

const authStore = useAuthStore()
const form = reactive({
  username: "",
  password: "",
});
const loginForm = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名"}],
  password: [{ required: true, message: "请输入密码"}],
};

const handleLogin =  async() => {
  // 登录逻辑

  const {data} = await login(form);

  console.log(data);
  if(data.code !== "01"){
        message.error(data.msg);
        return;
  }
  console.log(data.data);
  // authStore.setAuth(data.data)
//   console.log(authStore);
  authStore.saveUserInfo(
      data.data.user,  // 用户信息
      data.data.token  // token
  )
  message.success("登录成功");
  router.push("/home/items");
};

function goToForgot() {
  router.push("/forgot-password");
}

function goToRegister() {
  router.push("/register");
}
onMounted(()=>{
  if(authStore.isAuthenticated){
    router.push("/home/items");
  }
  // router.push("/home/items");
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  /* width: 100vw; */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e6f0ff;
}
.login-card {
  width: 360px;
  padding: 20px;
  border-radius: 8px;
}
.title {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e8f;
}
.a-form-item {
  margin-bottom: 20px;
}
.extra-links {
  margin-top: 12px;
  text-align: center;
}
.extra-links a {
  cursor: pointer;
  color: #1890ff;
}
</style>