import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

const routes = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo.vue'),
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
      },
      {
        path: 'items',
        name: 'items',
        component: () => import('../views/Items.vue'),
      },
      {
        path: 'messages',
        name: 'messages',
        component: () => import('../views/Message.vue'),
      },
      {
        path: 'chat/:id', // 新增聊天路由
        name: 'chat',
        component: () => import('../components/Chat/ChatWindow.vue'),
      },
      {
        path: '',
        redirect: 'profile',
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPassword.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()

//   if (to.meta.requiresAuth && !authStore.checkAuth()) {
//     // 如果需要登录但未登录，跳转到登录页
//     next('/login')
//   } else if (to.path === '/login' && authStore.checkAuth()) {
//     // 如果已登录但访问登录页，跳转到首页
//     next('/')
//   } else {
//     next()
//   }
// })

export default router;
