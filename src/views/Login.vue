<template>
  <div class="login-container">
    <!-- Theme Switcher in top-right corner -->
    <div class="theme-switcher-position">
      <ThemeSwitcher />
    </div>
    
    <a-card class="login-card" bordered>
      <div class="logo-section">
        <h1 class="title">绿驿</h1>
        <p class="subtitle">GreenStation</p>
      </div>
      
      <a-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        layout="vertical"
        @finish="handleLogin"
        class="login-form"
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
              <UserOutlined class="input-icon" />
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
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            size="large"
            block 
            html-type="submit"
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="extra-links">
        <a @click.prevent="goToForgot" class="link">忘记密码？</a>
        <a @click.prevent="goToRegister" class="link primary-link">创建账号</a>
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
/* Mobile-First Approach */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--theme-surfaceGradient);
  position: relative;
  background-image: url('../image/background4.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.theme-switcher-position {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 10;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  background: var(--theme-cardBackground);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 25px -5px var(--theme-shadowHeavy),
    0 10px 10px -5px var(--theme-shadowMedium);
  border: 1px solid var(--theme-borderLight);
  animation: slideUp 0.5s ease-out;
}

.logo-section {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.title {
  font-size: 48px;
  font-weight: 700;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--theme-textSecondary);
  font-weight: 500;
  margin: 0;
  letter-spacing: 2px;
}

.login-form {
  margin-top: var(--spacing-lg);
}

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

.input-icon {
  color: var(--theme-textTertiary);
  font-size: 18px;
}

.login-button {
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--theme-gradient);
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
  transition: all var(--transition-normal);
  margin-top: var(--spacing-md);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--theme-shadowHeavy);
}

.login-button:active {
  transform: translateY(0);
}

.extra-links {
  margin-top: var(--spacing-lg);
  text-align: center;
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.link {
  cursor: pointer;
  color: var(--theme-textSecondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.link:hover {
  color: var(--theme-primary);
  background: var(--theme-surfaceBackground);
}

.primary-link {
  color: var(--theme-primary);
  font-weight: 600;
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .login-container {
    padding: var(--spacing-2xl);
    background-image: url('../image/background2.jpg');
  }
  
  .login-card {
    padding: var(--spacing-2xl) var(--spacing-xl);
  }
  
  .title {
    font-size: 56px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}

/* Small mobile optimization */
@media (max-width: 375px) {
  .login-card {
    padding: var(--spacing-lg);
  }
  
  .title {
    font-size: 40px;
    letter-spacing: 6px;
  }
  
  .theme-switcher-position {
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
