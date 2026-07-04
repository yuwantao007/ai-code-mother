import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import UserLoginPage from '@/page/user/UserLoginPage.vue'
import UserRegisterPage from '@/page/user/UserRegisterPage.vue'
import UserLogoutPage from '@/page/user/UserLogoutPage.vue'
import UserManagePage from '@/page/admin/UserManagePage.vue'
import HomePage from '@/page/HomePage.vue'
import { canAccess, ROLE_ENUM } from '@/access'
import { useLoginUserStore } from '@/stores/loginUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
      meta: {
        hideInMenu: true,
      },
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
      meta: {
        hideInMenu: true,
      },
    },
    {
      path: '/user/logout',
      name: '用户注销',
      component: UserLogoutPage,
      meta: {
        hideInMenu: true,
        requireLogin: true,
      },
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
      meta: {
        title: '用户管理',
        access: ROLE_ENUM.ADMIN,
        requireLogin: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const loginUserStore = useLoginUserStore()

  if (!loginUserStore.isFetched) {
    await loginUserStore.fetchLoginUser()
  }

  const isLoginPage = to.path === '/user/login'
  const isRegisterPage = to.path === '/user/register'
  const isPublicPage = isLoginPage || isRegisterPage

  if (to.meta.requireLogin && !loginUserStore.loginUser.id) {
    return {
      path: '/user/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (!isPublicPage && !canAccess(loginUserStore.loginUser, to.meta.access as string | undefined)) {
    message.error('无权限访问该页面')
    return '/'
  }

  if ((isLoginPage || isRegisterPage) && loginUserStore.loginUser.id) {
    return '/'
  }

  return true
})

export default router
