<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userLogout } from '@/api/userController'
import { useLoginUserStore } from '@/stores/loginUser'

const router = useRouter()
const loginUserStore = useLoginUserStore()
const loading = ref(true)

const logout = async () => {
  loading.value = true
  try {
    const res = await userLogout()
    if (res.data.code === 0) {
      loginUserStore.resetLoginUser()
      message.success('已退出登录')
      router.replace('/user/login')
      return
    }
    message.error(res.data.message || '退出登录失败')
  } catch (error) {
    message.error('退出登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(logout)
</script>

<template>
  <div class="logout-page">
    <a-result
      :status="loading ? 'info' : 'success'"
      :title="loading ? '正在退出登录' : '已完成退出'"
      sub-title="正在清理当前登录状态"
    >
      <template #extra>
        <a-button type="primary" :loading="loading" @click="logout">重新退出</a-button>
        <a-button @click="router.replace('/user/login')">返回登录</a-button>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.logout-page {
  display: flex;
  min-height: 520px;
  align-items: center;
  justify-content: center;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #ffffff;
}
</style>
