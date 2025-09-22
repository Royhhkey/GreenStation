import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'login',
    component :()=>import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: ()=>import('../views/Home.vue'),
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: ()=>import('../views/Profile.vue'),
      },
      {
        path: 'items',
        name: 'items',
        component: ()=>import('../views/Items.vue'),
      },
      {
        path: 'messages',
        name: 'messages',
        component: ()=>import('../views/Message.vue'),
      },
      {
        path: '',
        redirect: 'profile',
      }
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
]

const router = createRouter({
  history:createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
