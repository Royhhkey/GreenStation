import { request } from "@/utils/request";


export const  login = (data)=>{
    return request({
        url: '/api/login',
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