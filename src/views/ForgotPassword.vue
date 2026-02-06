<template>
  <div class="min-h-screen flex justify-center items-center p-theme-md bg-theme-surface-gradient relative bg-cover bg-center bg-no-repeat md:p-theme-2xl" style="background-image: url('../image/background4.jpg');">
    <!-- Theme Switcher in top-right corner -->
    <div class="absolute top-theme-lg right-theme-lg z-10 sm:top-theme-md sm:right-theme-md">
      <ThemeSwitcher />
    </div>
    
    <a-card class="w-full max-w-[450px] p-theme-xl rounded-theme-xl bg-theme-card backdrop-blur-[20px] border border-theme-border-light shadow-theme-lg animate-slide-up md:p-theme-2xl md:px-theme-xl sm:p-theme-lg" bordered>
      <div class="text-center mb-theme-2xl">
        <h1 class="text-4xl font-bold mb-theme-sm m-0 tracking-[4px] bg-theme-gradient bg-clip-text text-transparent md:text-6xl sm:text-4xl sm:tracking-[3px]">重置密码</h1>
        <p class="text-[13px] text-theme-text-secondary font-medium m-0 tracking-[0.5px] md:text-sm">通过邮箱验证码重置您的密码</p>
      </div>
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleSubmit"
        class="mt-theme-lg"
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
          <div class="flex gap-theme-sm items-center">
            <a-input 
              v-model:value="form.code" 
              placeholder="请输入验证码" 
              size="large"
              class="modern-input flex-1"
            />
            <a-button
              type="primary"
              size="large"
              class="rounded-theme-md bg-theme-gradient border-none font-semibold whitespace-nowrap min-w-[110px] transition-all duration-normal hover:-translate-y-0.5 hover:shadow-theme-md disabled:opacity-60 disabled:cursor-not-allowed"
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

        <a-form-item v-if="showSubmit" class="mt-theme-lg mb-0">
          <a-button 
            type="primary" 
            html-type="submit" 
            block 
            size="large"
            class="h-12 rounded-theme-md bg-theme-gradient border-none text-base font-semibold tracking-[1px] shadow-theme-md transition-all duration-normal hover:-translate-y-0.5 hover:shadow-theme-lg active:translate-y-0"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="mt-theme-lg text-center pt-theme-md border-t border-theme-border">
        <a @click.prevent="goBack" class="cursor-pointer text-theme-text-secondary text-sm font-medium no-underline transition-all duration-fast px-theme-sm py-theme-xs rounded-theme-sm hover:text-theme-primary hover:bg-theme-surface">返回登录</a>
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
