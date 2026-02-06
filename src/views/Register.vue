<template>
  <div class="min-h-screen flex justify-center items-center p-theme-md bg-theme-surface-gradient relative bg-cover bg-center bg-no-repeat md:p-theme-2xl" style="background-image: url('../image/background4.jpg');">
    <!-- Theme Switcher in top-right corner -->
    <div class="absolute top-theme-lg right-theme-lg z-10 sm:top-theme-md sm:right-theme-md">
      <ThemeSwitcher />
    </div>
    
    <a-card class="w-full max-w-[580px] p-theme-xl rounded-theme-xl bg-theme-card backdrop-blur-[20px] border border-theme-border-light shadow-theme-lg animate-slide-up max-h-[90vh] overflow-y-auto md:p-theme-2xl md:px-theme-xl sm:p-theme-lg" bordered>
      <div class="text-center mb-theme-xl">
        <h1 class="text-3xl font-bold mb-theme-xs m-0 tracking-[2px] bg-theme-gradient bg-clip-text text-transparent md:text-5xl sm:text-3xl sm:tracking-[1px]">创建账号</h1>
        <p class="text-[13px] text-theme-text-secondary font-medium m-0 tracking-[0.5px] md:text-sm">填写基础信息，完成校园绿色驿站账号注册</p>
      </div>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleRegister"
        class="mt-theme-md"
      >
        <!-- 基础信息 -->
        <section class="mb-theme-lg">
          <h2 class="m-0 mb-theme-md text-[15px] font-semibold text-theme-text pb-theme-xs border-b-2 border-theme-border">基础信息</h2>
          <a-form-item label="用户名" name="username" :rules="rules.username">
            <a-input 
              v-model:value="form.username" 
              placeholder="请输入用户名" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
          <a-form-item label="学号" name="XH" :rules="rules.XH">
            <a-input 
              v-model:value="form.XH" 
              placeholder="请输入学号" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
          <a-form-item label="手机号" name="phone" :rules="rules.phone">
            <a-input 
              v-model:value="form.phone" 
              placeholder="请输入手机号" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
        </section>

        <!-- 账号安全 -->
        <section class="form-section">
          <h2 class="section-title">账号安全</h2>
          <a-form-item label="邮箱" name="email" :rules="rules.email">
            <a-input 
              v-model:value="form.email" 
              placeholder="请输入邮箱" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
          <a-form-item label="验证码" name="captcha" :rules="rules.captcha">
            <div class="flex gap-theme-sm">
              <a-input
                v-model:value="form.captcha"
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

          <div class="flex gap-theme-sm flex-wrap sm:flex-col">
            <a-form-item
              label="密码"
              name="password"
              :rules="rules.password"
              class="flex-1 min-w-[200px] sm:min-w-full"
            >
              <a-input-password
                v-model:value="form.password"
                placeholder="请输入密码"
                size="large"
                class="modern-input"
              />
            </a-form-item>
            <a-form-item
              label="确认密码"
              name="confirmPassword"
              :rules="rules.confirmPassword"
              class="flex-1 min-w-[200px] sm:min-w-full"
            >
              <a-input-password
                v-model:value="form.confirmPassword"
                placeholder="请再次输入密码"
                size="large"
                class="modern-input"
              />
            </a-form-item>
          </div>
        </section>

        <!-- 学籍信息（可选） -->
        <section class="mb-theme-lg">
          <h2 class="m-0 mb-theme-md text-[15px] font-semibold text-theme-text pb-theme-xs border-b-2 border-theme-border">学籍信息（可选）</h2>
          <a-form-item label="年级" name="grade" :rules="rules.grade">
            <a-input 
              v-model:value="form.grade" 
              placeholder="请输入年级" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
          <a-form-item label="专业" name="zy" :rules="rules.zy">
            <a-input 
              v-model:value="form.zy" 
              placeholder="请填写专业" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
          <a-form-item label="寝室号" name="dorm" :rules="rules.QSH">
            <a-input 
              v-model:value="form.QSH" 
              placeholder="请填写寝室号" 
              size="large"
              class="modern-input"
            />
          </a-form-item>
        </section>

        <a-form-item class="mt-theme-lg mb-0">
          <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            class="h-12 rounded-theme-md bg-theme-gradient border-none text-base font-semibold tracking-[1px] shadow-theme-md transition-all duration-normal hover:-translate-y-0.5 hover:shadow-theme-lg active:translate-y-0"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="mt-theme-md text-center pt-theme-md border-t border-theme-border">
        <a @click.prevent="goBack" class="cursor-pointer text-theme-text-secondary text-sm font-medium no-underline transition-all duration-fast px-theme-sm py-theme-xs rounded-theme-sm hover:text-theme-primary hover:bg-theme-surface">返回登录</a>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { sendCode, register } from '@/api';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const router = useRouter();

const formRef = ref(null);
const countdown = ref(0);
let timer = null;

const form = reactive({
  email: '',
  username: '',
  password: '',
  XH: '',
  confirmPassword: '',
  phone: '',
  grade: '',
  zy: '',
  QSH: '',
  captcha: '',
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ],
  XH: [{ required: true, message: '请输入学号' }],
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }],
  phone: [{ required: true, message: '请输入手机号' }],
  grade: [{ message: '请输入年级' }],
  zy: [{ message: '请输入专业' }],
  QSH: [{ message: '请输入寝室号' }],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (rule, value) => {
        if (value !== form.password) {
          return Promise.reject('两次输入密码不一致');
        }
        return Promise.resolve();
      },
    },
  ],
};

async function HandesendCode() {
  console.log(form);
  if (!form.email) {
    message.error('请输入邮箱');
    return;
  }
  if (countdown.value > 0) return;

  // 这里写发送验证码的逻辑
  const { data } = await sendCode({ email: form.email });
  console.log(data);
  if (data.code !== '01') {
    message.error(data.msg);
    return;
  }
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

const handleRegister = async () => {
  // console.log("form123123");
  formRef.value
    .validate()
    .then(async () => {
      console.log('register123123');

      //         // 只传递有值的字段
      // const filteredForm = Object.fromEntries(
      //   Object.entries({
      //     email: form.email,
      //     username: form.username,
      //     password: form.password,
      //     code: form.captcha,
      //     XH: form.XH,
      //     phone: form.phone,
      //     grade: form.grade,
      //     ZY: form.zy,
      //     QSH: form.QSH
      //   }).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      // );
      //    const { data } = await register(filteredForm);

      const { data } = await register({
        email: form.email,
        username: form.username,
        password: form.password,
        code: form.captcha,
        XH: form.XH,
        phone: form.phone,
        grade: form.grade,
        ZY: form.zy,
        QSH: form.QSH,
      });
      if (data.code !== '01') {
        message.error(data.msg);
        return;
      }
      message.success('注册成功，请登录');
      router.push('/');
    })
    .catch(() => {
      // message.error("信息不完整");
    });
};
function goBack() {
  router.push('/');
}

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
