import axios from 'axios';
import { message } from 'ant-design-vue';

export const request = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Token 管理函数
const tokenManager = {
  getToken: () => {
    return localStorage.getItem('token') || '';
  },
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },
  // 检查 token 是否过期（如果需要）
  isTokenExpired: () => {
    // 这里可以根据实际需求实现 token 过期检查
    return false;
  },
};

// 不需要添加 token 的白名单
const whiteList = [
  '/api/login/',
  '/api/register/',
  '/api/send-code/',
  '/api/verify-code/',
  '/api/reset-password/',
];

request.interceptors.request.use(
  (config) => {
    // 显示加载提示
    message.loading({
      content: 'Loading...',
      duration: 0,
      key: 'loading',
    });

    // 检查是否是白名单接口，如果是则不需要添加 token
    const isWhiteList = whiteList.some((url) => config.url?.includes(url));

    if (!isWhiteList) {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Token ${token}`;

        // 检查 token 是否过期（可选）
        if (tokenManager.isTokenExpired()) {
          message.warning('登录已过期，请重新登录');
          tokenManager.removeToken();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
      } else {
        // 如果没有 token 且不是白名单接口，可以跳转到登录页
        message.warning('请先登录');
        window.location.href = '/login';
        return Promise.reject(new Error('No token'));
      }
    }

    return config;
  },
  (error) => {
    message.destroy();
    message.error('请求超时');
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    message.destroy();

    // 处理业务逻辑错误
    if (response.data && response.data.code === '00') {
      message.error(response.data.msg || '操作失败');
      return Promise.reject(new Error(response.data.msg));
    }

    return response;
  },
  (error) => {
    message.destroy();

    // // 处理 HTTP 错误
    // if (error.response) {
    //     const status = error.response.status
    //     const errorMessage = error.response.data?.msg || error.response.data?.message

    //     switch (status) {
    //         case 401:
    //             message.error(errorMessage || '未授权，请重新登录')
    //             tokenManager.removeToken()
    //             setTimeout(() => {
    //                 window.location.href = '/login'
    //             }, 1500)
    //             break
    //         case 403:
    //             message.error(errorMessage || '拒绝访问')
    //             break
    //         case 404:
    //             message.error(errorMessage || '请求的资源不存在')
    //             break
    //         case 500:
    //             message.error(errorMessage || '服务器内部错误')
    //             break
    //         default:
    //             message.error(errorMessage || '请求失败')
    //     }
    // } else if (error.request) {
    //     message.error('网络错误，请检查网络连接')
    // } else {
    //     message.error('请求配置错误: ' + error.message)
    // }

    return Promise.reject(error);
  },
);

// 导出 token 管理函数，方便在其他地方使用
export { tokenManager };
