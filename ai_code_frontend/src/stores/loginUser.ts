import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUser } from '@/api/userController.ts'

const DEFAULT_LOGIN_USER: API.LoginUserVO = {
  userName: '未登录',
}

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({ ...DEFAULT_LOGIN_USER })
  const isFetched = ref(false)

  async function fetchLoginUser() {
    try {
      const res = await getLoginUser()
      if (res.data.code === 0 && res.data.data) {
        loginUser.value = res.data.data
      } else {
        resetLoginUser()
      }
    } catch (error) {
      resetLoginUser()
    } finally {
      isFetched.value = true
    }
  }

  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser
    isFetched.value = true
  }

  function resetLoginUser() {
    loginUser.value = { ...DEFAULT_LOGIN_USER }
  }

  return { loginUser, isFetched, setLoginUser, resetLoginUser, fetchLoginUser }
})
