<template>
  <div class="register-container">
    <!-- Theme Switcher in top-right corner -->
    <div class="theme-switcher-position">
      <ThemeSwitcher />
    </div>
    
    <a-card class="register-card" bordered>
      <div class="logo-section">
        <h1 class="title">创建账号</h1>
        <p class="subtitle">填写基础信息，完成校园绿色驿站账号注册</p>
      </div>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleRegister"
        class="register-form"
      >
        <!-- 基础信息 -->
        <section class="form-section">
          <h2 class="section-title">基础信息</h2>
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
            <div class="captcha-row">
              <a-input
                v-model:value="form.captcha"
                placeholder="请输入验证码"
                size="large"
                class="modern-input captcha-input"
              />
              <a-button
                type="primary"
                size="large"
                class="captcha-btn"
                @click="HandesendCode"
                :disabled="countdown > 0"
              >
                {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
              </a-button>
            </div>
          </a-form-item>

          <div class="password-row">
            <a-form-item
              label="密码"
              name="password"
              :rules="rules.password"
              class="password-item"
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
              class="password-item"
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
        <section class="form-section">
          <h2 class="section-title">学籍信息（可选）</h2>
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

        <a-form-item class="submit-item">
          <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            class="register-btn"
          >
            注册
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
/* Mobile-First Approach */
.register-container {
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

.register-card {
  width: 100%;
  max-width: 580px;
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  background: var(--theme-cardBackground);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 25px -5px var(--theme-shadowHeavy),
    0 10px 10px -5px var(--theme-shadowMedium);
  border: 1px solid var(--theme-borderLight);
  animation: slideUp 0.5s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.logo-section {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-xs) 0;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 13px;
  color: var(--theme-textSecondary);
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
}

.register-form {
  margin-top: var(--spacing-md);
}

.form-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  margin: 0 0 var(--spacing-md);
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-textPrimary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--theme-border);
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

.captcha-row {
  display: flex;
  gap: var(--spacing-sm);
}

.captcha-input {
  flex: 1;
}

.captcha-btn {
  border-radius: var(--radius-md);
  background: var(--theme-gradient);
  border: none;
  font-weight: 600;
  white-space: nowrap;
  min-width: 110px;
  transition: all var(--transition-normal);
}

.captcha-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

.captcha-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-row {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.password-item {
  flex: 1 1 0;
  min-width: 200px;
}

.submit-item {
  margin-top: var(--spacing-lg);
  margin-bottom: 0;
}

.register-btn {
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

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--theme-shadowHeavy);
}

.register-btn:active {
  transform: translateY(0);
}

.extra-links {
  margin-top: var(--spacing-md);
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
  .register-container {
    padding: var(--spacing-2xl);
    background-image: url('../image/background2.jpg');
  }
  
  .register-card {
    padding: var(--spacing-2xl) var(--spacing-xl);
  }
  
  .title {
    font-size: 40px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}

/* Small mobile optimization */
@media (max-width: 480px) {
  .register-card {
    padding: var(--spacing-lg);
  }
  
  .title {
    font-size: 28px;
    letter-spacing: 1px;
  }
  
  .password-row {
    flex-direction: column;
  }
  
  .password-item {
    min-width: 100%;
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
