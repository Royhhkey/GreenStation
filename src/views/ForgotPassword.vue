<template>
  <div class="forgot-password-container">
    <!-- Theme Switcher in top-right corner -->
    <div class="theme-switcher-position">
      <ThemeSwitcher />
    </div>
    
    <a-card class="forgot-password-card" bordered>
      <div class="logo-section">
        <h1 class="title">重置密码</h1>
        <p class="subtitle">通过邮箱验证码重置您的密码</p>
      </div>
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleSubmit"
        class="forgot-password-form"
      >
        <a-form-item label="邮箱" name="email" :rules="rules.email">
          <a-input 
            v-model:value="form.email" 
            placeholder="请输入邮箱" 
            size="large"
            class="modern-input"
          />
        </a-form-item>
        
        <a-form-item label="验证码" name="code" :rules="rules.code">
          <div class="code-container">
            <a-input 
              v-model:value="form.code" 
              placeholder="请输入验证码" 
              size="large"
              class="modern-input code-input"
            />
            <a-button
              type="primary"
              size="large"
              class="code-btn"
              @click="HandesendCode"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>
        
        <a-form-item label="新密码" name="password" :rules="rules.password">
          <a-input-password 
            v-model:value="form.password" 
            placeholder="请输入新密码" 
            size="large"
            class="modern-input"
          />
        </a-form-item>

        <a-form-item v-if="showSubmit" class="submit-item">
          <a-button 
            type="primary" 
            html-type="submit" 
            block 
            size="large"
            class="submit-btn"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="extra-links">
        <a @click.prevent="goBack" class="link">返回登录</a>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { sendCode, resetPassword } from '../api/index';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const router = useRouter();
const formRef = ref(null);
const form = reactive({
  email: '',
  code: '',
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'change' },
  ],
  code: [{ required: true, message: '请输入验证码' }],
  password: [{ required: true, message: '请输入新密码' }],
};

const countdown = ref(0);
let timer = null;

async function HandesendCode() {
  if (!form.email) {
    message.error('请输入邮箱后再发送验证码');
    return;
  }
  if (countdown.value > 0) return;
  const { data } = await sendCode({ email: form.email });
  if (data.code != '01') {
    message.error(data.msg);
    return;
  }
  // 这里写发送验证码的逻辑
  message.success(`验证码已发送到 ${form.email}`);

  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

async function handleSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      console.log('12312321');
      const Form = {
        email: form.email,
        code: form.code,
        new_password: form.password,
      };
      const { data } = await resetPassword(Form);
      if (data.code != '01') {
        message.error(data.msg);
        return;
      }
      // 这里写提交验证码的逻辑
      message.success('密码重置成功，请登录');
      router.push('/');
    })
    .catch(() => {});
}

function goBack() {
  router.push('/');
}

const showSubmit = ref(false);
watch(
  () => form.code,
  (val) => {
    showSubmit.value = val && val.trim().length > 0;
  },
);
</script>

<style scoped>
/* Mobile-First Approach */
.forgot-password-container {
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

.forgot-password-card {
  width: 100%;
  max-width: 450px;
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
  font-size: 40px;
  font-weight: 700;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--theme-textSecondary);
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
}

.forgot-password-form {
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

.code-container {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.code-input {
  flex: 1;
}

.code-btn {
  border-radius: var(--radius-md);
  background: var(--theme-gradient);
  border: none;
  font-weight: 600;
  white-space: nowrap;
  min-width: 110px;
  transition: all var(--transition-normal);
}

.code-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-item {
  margin-top: var(--spacing-lg);
  margin-bottom: 0;
}

.submit-btn {
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--theme-gradient);
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
  transition: all var(--transition-normal);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--theme-shadowHeavy);
}

.submit-btn:active {
  transform: translateY(0);
}

.extra-links {
  margin-top: var(--spacing-lg);
  text-align: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--theme-border);
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

/* Tablet and Desktop */
@media (min-width: 768px) {
  .forgot-password-container {
    padding: var(--spacing-2xl);
    background-image: url('../image/background2.jpg');
  }
  
  .forgot-password-card {
    padding: var(--spacing-2xl) var(--spacing-xl);
  }
  
  .title {
    font-size: 48px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}

/* Small mobile optimization */
@media (max-width: 375px) {
  .forgot-password-card {
    padding: var(--spacing-lg);
  }
  
  .title {
    font-size: 36px;
    letter-spacing: 3px;
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
