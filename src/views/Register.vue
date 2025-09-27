<template>
    <div class="container">
        <div class="page-container">
    <a-button type="link" @click="goBack" class="back-btn">
      <ArrowLeftOutlined  class="arrow-icon" />
    </a-button>
    <a-card title="创建账号" bordered>
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleRegister"
        class="register-form"
      >
        <a-form-item label="用户名" name="username" :rules="rules.username">
            <a-input v-model:value="form.username" placeholder="请输入用户名" />
         </a-form-item>
        <a-form-item label="学号" name="xh" :rules="rules.xh">
            <a-input v-model:value="form.xh" placeholder="请输入学号" />
         </a-form-item>
        <a-form-item label="邮箱" name="email" :rules="rules.email">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" />
        </a-form-item>
                <a-form-item label="验证码" name="captcha" :rules="rules.captcha" >
            <div class="captcha-container">
                <a-input v-model:value="form.captcha" placeholder="请输入验证码" />
                <a-button type="primary" class="captcha-btn"  @click="HandesendCode"  :disabled="countdown > 0">   
                     {{ countdown > 0 ? countdown + 's后重新发送' : '获取验证码' }}
                </a-button>
            </div>
        </a-form-item>

        <a-form-item label="手机号" name="phone" :rules="rules.phone">
            <a-input v-model:value="form.phone" placeholder="请输入手机号" />
        </a-form-item>

                <a-form-item label="密码" name="password" :rules="rules.password">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassword" :rules="rules.confirmPassword">
          <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入密码" />
        </a-form-item>


        <a-form-item label="年级" name="grade" :rules="rules.grade">
            <a-input v-model:value="form.grade" placeholder="请输入年级" />
        </a-form-item>
        <a-form-item label="专业" name="zy" :rules="rules.zy">
            <a-input v-model:value="form.zy" placeholder="请填写专业" />
        </a-form-item>

        <a-form-item label="寝室号" name="dorm" :rules="rules.QSH">
            <a-input v-model:value="form.QSH" placeholder="请填写寝室号" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block class="register-btn" >注册</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { sendCode,register} from  '@/api'


const router = useRouter();

const formRef = ref(null);
const countdown = ref(0);
let timer = null;

const form = reactive({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  grade: "",
  zy: "",
  QSH: "",
  captcha: "",
});

const rules = {
  email: [
    { required: true, message: "请输入邮箱"},
    { type: "email", message: "请输入有效的邮箱地址"},
  ],
  xh: [{ required: true, message: "请输入学号" }],
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
  captcha: [{ required: true, message: "请输入验证码" }],
  phone: [{ required: true, message: "请输入手机号" }],
  grade: [{  message: "请输入年级" }],
  zy: [{  message: "请输入专业" }],
  QSH: [{ message: "请输入寝室号" }],
  confirmPassword: [
    { required: true, message: "请确认密码" },
    {
      validator: (rule, value) => {
        if (value !== form.password) {
          return Promise.reject("两次输入密码不一致");
        }
        return Promise.resolve();
      },
     
    },
  ],
};


 async function HandesendCode  ()  {
    console.log(form);
  if (!form.email) {
    message.error("请输入邮箱");
    return;
  }
  if (countdown.value > 0) return;

  // 这里写发送验证码的逻辑
  const {data} = await sendCode({ email: form.email });
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
        console.log("register123123");

      //         // 只传递有值的字段
      // const filteredForm = Object.fromEntries(
      //   Object.entries({
      //     email: form.email,
      //     username: form.username,
      //     password: form.password,
      //     code: form.captcha,
      //     XH: form.xh,
      //     phone: form.phone,
      //     grade: form.grade,
      //     ZY: form.zy,
      //     QSH: form.QSH
      //   }).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      // );
      //    const { data } = await register(filteredForm);

        const {data} = await register(
            {
            email: form.email,
            username: form.username,
            password: form.password,
            code: form.captcha,
            XH: form.xh,
            phone: form.phone,
            grade: form.grade,
            ZY: form.zy,
            QSH: form.QSH
            }
        );
        if (data.code !== "01") {
            message.error(data.msg);
            return;
        }
      message.success("注册成功，请登录");
      router.push("/");
    })
    .catch(() => {
        // message.error("信息不完整");
    });

};
function goBack() {
  router.push("/");
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  width: 100vw;
  background: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-container {
  /* max-width: 400px;
  min-width: 500px; */
  margin:  auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  /* box-shadow: 0 0 8px #ccc; */
}
.back-btn {
  margin-bottom: 16px;
  color: #2c3e8f;
  font-weight: 500;
  padding: 0;
  height: 32px;
  line-height: 32px;
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
.register-btn{
    margin: 10px auto;
    width: 60%;
    height: 44px;
    display: block;
}
.captcha-container{
    display: flex;
    justify-content: space-between;
}
.captcha-container > input{
    width: 50%;
}
.captcha-btn{
    margin-left: 20px;
    height: 40px;
}

/* .register-form  input{
    height: 50px;
} */

</style>