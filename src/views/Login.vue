<template>
  <div class="min-h-screen flex justify-center items-center p-theme-md bg-theme-surface-gradient relative bg-cover bg-center bg-no-repeat md:p-theme-2xl" style="background-image: url('../image/background4.jpg');">
    <!-- Theme Switcher in top-right corner -->
    <div class="absolute top-theme-lg right-theme-lg z-10 sm:top-theme-md sm:right-theme-md">
      <ThemeSwitcher />
    </div>
    
    <a-card class="w-full max-w-[420px] p-theme-xl rounded-theme-xl bg-theme-card backdrop-blur-[20px] border border-theme-border-light shadow-theme-lg animate-slide-up md:p-theme-2xl md:px-theme-xl sm:p-theme-lg" bordered>
      <div class="text-center mb-theme-2xl">
        <h1 class="text-5xl font-bold mb-theme-sm m-0 tracking-[8px] bg-theme-gradient bg-clip-text text-transparent md:text-7xl sm:text-4xl sm:tracking-[6px]">绿驿</h1>
        <p class="text-sm text-theme-text-secondary font-medium m-0 tracking-[2px] md:text-base">GreenStation</p>
      </div>
      
      <a-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        layout="vertical"
        @finish="handleLogin"
        class="mt-theme-lg"
      >
        <a-form-item label="用户名" name="username" :rules="rules.username">
          <a-input
            v-model:value="form.username"
            size="large"
            autocomplete="off"
            placeholder="请输入用户名"
            class="modern-input"
          >
            <template #prefix>
              <UserOutlined class="text-theme-text-tertiary text-lg" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item label="密码" name="password" :rules="rules.password">
          <a-input-password
            v-model:value="form.password"
            size="large"
            autocomplete="off"
            placeholder="请输入密码"
            class="modern-input"
          >
            <template #prefix>
              <LockOutlined class="text-theme-text-tertiary text-lg" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            size="large"
            block 
            html-type="submit"
            class="h-12 rounded-theme-md bg-theme-gradient border-none text-base font-semibold tracking-[1px] shadow-theme-md transition-all duration-normal mt-theme-md hover:-translate-y-0.5 hover:shadow-theme-lg active:translate-y-0"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="mt-theme-lg text-center flex justify-center gap-theme-lg">
        <a @click.prevent="goToForgot" class="cursor-pointer text-theme-text-secondary text-sm font-medium no-underline transition-all duration-fast px-theme-sm py-theme-xs rounded-theme-sm hover:text-theme-primary hover:bg-theme-surface">忘记密码？</a>
        <a @click.prevent="goToRegister" class="cursor-pointer text-theme-primary font-semibold text-sm no-underline transition-all duration-fast px-theme-sm py-theme-xs rounded-theme-sm hover:bg-theme-surface">创建账号</a>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { login } from '../api/index';
import { useAuthStore } from '@/stores/auth';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const router = useRouter();

const authStore = useAuthStore();
const form = reactive({
  username: '',
  password: '',
});
const loginForm = ref(null);

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
};

const handleLogin = async () => {
  // 登录逻辑

  const { data } = await login(form);

  console.log(data);
  if (data.code !== '01') {
    message.error(data.msg);
    return;
  }
  console.log(data.data);
  // authStore.setAuth(data.data)
  //   console.log(authStore);
  authStore.saveUserInfo(
    data.data.user, // 用户信息
    data.data.token, // token
  );
  message.success('登录成功');
  router.push('/home/items');
};

function goToForgot() {
  router.push('/forgot-password');
}

function goToRegister() {
  router.push('/register');
}
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/home/items');
  }
  // router.push("/home/items");
});
</script>

<style scoped>
/* Ant Design Form Overrides */
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: var(--theme-textPrimary);
  font-size: 14px;
}

.modern-input :deep(.ant-input),
.modern-input :deep(.ant-input-password) {
  border-radius: var(--radius-md);
  border: 2px solid var(--theme-border);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 15px;
  transition: all var(--transition-normal);
  background: var(--theme-background);
  color: var(--theme-textPrimary);
}

.modern-input :deep(.ant-input:focus),
.modern-input :deep(.ant-input-password:focus),
.modern-input :deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .min-h-screen {
    background-image: url('../image/background2.jpg');
  }
}
</style>
