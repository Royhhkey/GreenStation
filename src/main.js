// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import 'ant-design-vue/dist/antd.css'
// import 'ant-design-vue/dist/antd.min.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'  // Changed from antd.css to reset.css
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import App from './App.vue'
import router from './router'
import './assets/main.css'
const app = createApp(App)

app.use(createPinia())
app.use(Antd,{ locale: zhCN })

app.use(router)

app.mount('#app')
