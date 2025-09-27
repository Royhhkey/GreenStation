<template>
    <div class="container">
        <div class="page-container">
            <a-button type="link" @click="goBack" class="back-btn">
            <ArrowLeftOutlined  class="arrow-icon" />
            </a-button>
            <a-card title="忘记密码" bordered>

            <a-form
                :model="form"
                :rules="rules"
                ref="formRef"
                layout="vertical"
                @finish="handleSubmit"
            >
                <a-form-item label="邮箱" name="email" :rules="rules.email">
                <a-input v-model:value="form.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="验证码" name="code" :rules="rules.code" class="code-form-item">
                      <div class="code-container">
                        <a-input v-model:value="form.code" placeholder="请输入验证码" />
                        <a-button type="primary" @click="HandesendCode" :disabled="countdown > 0">
                          {{ countdown > 0 ? countdown + 's后重新发送' : '获取验证码' }}
                        </a-button>
                      </div>
                </a-form-item>
                <a-form-item label="新密码" name="password" :rules="rules.password">
                <a-input v-model:value="form.password" placeholder="请输入新密码" />
                </a-form-item>

            
                <a-form-item v-if="showSubmit">
                <a-button type="primary" html-type="submit" block>提交</a-button>
                </a-form-item>
            </a-form>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import {sendCode,resetPassword} from "../api/index";

const router = useRouter();
const formRef = ref(null);
const form = reactive({
  email: "",
  code: "",
});

const rules = {
  email: [
    { required: true, message: "请输入邮箱"},
    { type: "email", message: "请输入有效的邮箱地址", trigger:  "change"},
  ],
  code: [
    { required: true, message: "请输入验证码", },
  ],
  password: [
    { required: true, message: "请输入新密码"},
  ],
};

const countdown = ref(0);
let timer = null;

 async function HandesendCode() {
  if (!form.email) {
    message.error("请输入邮箱后再发送验证码");
    return;
  }
  if (countdown.value > 0) return;
  const {data} = await sendCode(
    { email: form.email });
  if(data.code !='01'){
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
        const Form   ={
            email: form.email,
            code: form.code,
            new_password: form.password,
        }
        const {data} = await resetPassword(Form);
        if(data.code !='01'){
          message.error(data.msg);
          return;
        }
      // 这里写提交验证码的逻辑
      message.success("验证码验证成功");
      router.push("/");
    })
    .catch(() => {});
}

function goBack() {
  router.push("/");
}

const showSubmit = ref(false);
watch(
  () => form.code,
  (val) => {
    showSubmit.value = val && val.trim().length > 0;
  }
);
</script>

<style scoped>
.container {
  height: 100vh;
  background: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.title{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.page-container {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 360px;
}
.a-card {
  border-radius: 12px;
}
.back-btn {
  margin-bottom: 16px;
  padding: 0;
  height: 32px;
  line-height: 32px;
  color: #2c3e8f;
  font-weight: 500;
}
.back-btn:hover {
  color: #1d39c4;
  text-decoration: underline;
  background: transparent;
}
.arrow-icon {
  font-size: 24px;
  color: #1d39c4;
}
.code-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code-container .ant-input {

  /* flex: 1; */
}

.code-container .ant-btn {
  width: 100px;
}
</style>