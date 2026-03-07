import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import { HomeOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import FingerPrintPage from '@/pages/fingerprint/FingerPrintPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
      meta:{
        access: ACCESS_ENUM.USER,
        pageType: 'menu',
      },
    },{
      path: '/user/login',
      name: '用户登录',
      meta:{
        pageType: 'login',
      },
      component: () => import('../pages/user/UserLoginPage.vue'),
    },{
      path: '/user/register',
      name: '用户注册',
      meta:{
        pageType: 'login',
      },
      component: () => import('../pages/user/UserRegisterPage.vue'),
    },{
      path: '/user/userCenter',
      name: '个人中心',
      meta:{
        access: ACCESS_ENUM.USER,
        pageType: 'menu',
      },
      component: () => import('../pages/user/UserCenterPage.vue'),
    },{
      path: '/admin/userManage',
      name: '用户管理',
      meta:{
        access: ACCESS_ENUM.ADMIN,
        pageType: 'menu'
      },
      component: () => import('../pages/admin/UserManagePage.vue'),
    },
    {
      path: '/room/roomTypeManage',
      name: '房间类型管理',
      meta:{
        access: ACCESS_ENUM.ADMIN,
        pageType: 'menu'
      },
      component: () => import('../pages/room/RoomTypePage.vue'),
    },{
      path: '/room/roomManage',
      name: '房间管理',
      meta:{
        access: ACCESS_ENUM.ADMIN,
        pageType: 'menu'
      },
      component: () => import('../pages/room/RoomPage.vue'),
    },{
      path: '/noAuth',
      name: '无权限页面',
      component: () => import('../pages/error/NoAuthPage.vue'),
    }
    ,{
      path: '/notFound',
      name: '无权限页面',
      component: () => import('../pages/error/NotFoundPage.vue'),
    },{
      path: '/test',
      name: 'test',
      component: () => import('../pages/Test.vue'),
    },{
      path: '/fingerprint',
      name: 'fingerprint',
      component: FingerPrintPage
    }


  ],
})

export default router
