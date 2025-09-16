import axios from "axios";

import { message } from "ant-design-vue";

export const request = axios.create({
    baseURL: "http://39.108.135.150:8888",
    // baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000,
    headers: { 
        "Content-Type": "application/x-www-form-urlencoded"  // 表单提交
    },
})
request.interceptors.request.use(config => {
    message.loading(
        {
            content: 'Loading...',
            duration: 0,
            key: 'loading'
        }
    )
    return config
},error =>{
    message.destroy()
    message.error({
        content: '请求超时',
        key: 'loading'
    })
    return Promise.reject(error)
}
)
request.interceptors.response.use(response => {
    message.destroy()
    // console.log("response",response)
    return response
},error => {
    message.destroy()
    message.error({
        content: '请求失败',
        key: 'loading'
    })
    return Promise.reject(error)
})