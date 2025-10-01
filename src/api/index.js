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

export const  getproducts = (str)=>{
    return request({
        url: '/api/product/?'+str,
        method: 'get',
    })
}

export const  getMyproduct = ()=>{
    return request({
        url: '/api/my-products/',
        method: 'get',
    })
}

export const ModifyUserInfo = (data)=>{
    return request({
        url: '/api/ModifyInfoMessage/',
        method: 'post',
        data
    })
}

export const ModifyProduct = (productId,data)=>{
    return request({
        url: `/api/products/${productId}/`,
        method: 'patch',
        data
    })
}

export const AvatarUpload = (data) => {
  return request({
    url: '/api/uploadavatar/',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 10000
  });
};

export const DeleteProduct = (productId)=>{
    return request({
        url: `/api/products/${productId}/`,
        method: 'delete',
    })
}

export const  CreateProduct = (data)=>{
    return request({
        url: '/api/products/',
        method: 'post',
        data
    })
}
// /api/chats/conversations/start_conversation/
export const StartConversations = (data)=>{
    return request({
        url: '/api/chats/conversations/start_conversation/',
        method: 'post',
        data
    })
}

export const GetCurrentUserConversationMessages = (ConversationId)=>{
    return request({
        url: `/api/chats/conversations/${ConversationId}/messages/`,
        method: 'get',
    })
}

export const GetMyAllConversations = ()=>{
    return request({
        url: '/api/chats/conversations/',
        method: 'get',
    })
}