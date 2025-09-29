import { request } from "@/utils/request";


export const  login = (data)=>{
    return request({
        url: '/api/login/',
        method: 'post',
        data
    })
}

export const test = ()=>{
    return request({
        url: '/api/tests/',
        method: 'get',
    })
}

export const sendCode = (data)=>{
    return request({
        url: '/api/send-code/',
        method: 'post',
        data
    })
}

export const verifyCode = (data)=>{
    return request({
        url: '/api/verify-code/',
        method: 'post',
        data
    })
}
export const register = (data)=>{
    return request({
        url: '/api/register/',
        method: 'post',
        data
    })
}

export const  resetPassword = (data)=>{
    return request({
        url: '/api/reset-password/',
        method: 'post',
        data
    })
}

export const  getproducts = (data)=>{
    return request({
        url: '/api/products/?q=手机',
        method: 'get',
        data
    })
}