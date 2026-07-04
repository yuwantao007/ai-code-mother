<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userLogin } from '@/api/userController'
import { useLoginUserStore } from '@/stores/loginUser'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()
const submitting = ref(false)

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    const res = await userLogin(formState)
    if (res.data.code === 0 && res.data.data) {
      loginUserStore.setLoginUser(res.data.data)
      message.success('登录成功')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(redirect)
      return
    }
    message.error(res.data.message || '登录失败，请检查账号或密码')
  } catch (error) {
    message.error('登录失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-visual">
      <div class="brand-mark">
        <span class="brand-icon">AI</span>
        <span>AI 零代码生成平台</span>
      </div>

      <div class="hero-copy">
        <h1>一句话，生成你的应用</h1>
        <p>用自然语言描述需求，从页面布局、组件交互到业务配置，快速生成可用的 AI 应用原型。</p>
      </div>

      <div class="builder-preview">
        <div class="window-bar">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="preview-toolbar">
          <span>AI Builder</span>
          <a-tag color="green">Live Preview</a-tag>
        </div>
        <div class="preview-content">
          <div class="prompt-bubble">创建一个客户数据分析看板，包含指标卡、趋势图和用户列表</div>
          <div class="generated-screen">
            <div class="screen-header"></div>
            <div class="metric-grid">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="screen-body">
              <div class="chart-card"></div>
              <div class="list-card">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="prompt-input">
        <span>把客服系统改成深色主题，并增加权限菜单</span>
        <button type="button">↑</button>
      </div>
    </section>

    <section class="auth-card">
      <div class="card-header">
        <p>Welcome Back</p>
        <h2>用户登录</h2>
        <span>登录后开始生成和管理你的 AI 应用。</span>
      </div>

      <a-form layout="vertical" :model="formState" @finish="handleSubmit">
        <a-form-item
          label="账号"
          name="userAccount"
          :rules="[
            { required: true, message: '请输入账号' },
            { min: 4, message: '账号至少 4 位' },
          ]"
        >
          <a-input v-model:value="formState.userAccount" size="large" placeholder="请输入账号" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码至少 8 位' },
          ]"
        >
          <a-input-password
            v-model:value="formState.userPassword"
            size="large"
            placeholder="请输入密码"
          />
        </a-form-item>

        <a-button class="submit-button" type="primary" html-type="submit" size="large" :loading="submitting">
          登录
        </a-button>
      </a-form>

      <div class="auth-switch">
        没有账号？
        <RouterLink to="/user/register">立即注册</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  min-height: calc(100vh - 160px);
  grid-template-columns: minmax(0, 1.25fr) 460px;
  overflow: hidden;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
}

.auth-visual {
  position: relative;
  display: grid;
  align-content: center;
  min-height: 660px;
  padding: 56px 8% 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at 72% 24%, rgba(52, 211, 153, 0.28), transparent 30%),
    radial-gradient(circle at 20% 82%, rgba(56, 189, 248, 0.18), transparent 28%),
    linear-gradient(135deg, #f7fffb 0%, #ecfff7 48%, #effcff 100%);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  color: #111827;
  font-size: 25px;
  font-weight: 800;
}

.brand-icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 16px;
  background: #16e3bf;
  box-shadow: 0 10px 28px rgba(22, 227, 191, 0.36);
}

.hero-copy {
  margin-top: 72px;
}

.hero-copy h1 {
  max-width: 620px;
  margin: 0;
  color: #101418;
  font-size: 58px;
  font-weight: 900;
  line-height: 1.1;
}

.hero-copy h1::first-letter {
  color: #101418;
}

.hero-copy p {
  max-width: 520px;
  margin: 22px 0 0;
  color: #5f6b76;
  font-size: 19px;
  line-height: 1.7;
}

.builder-preview {
  width: min(640px, 100%);
  margin-top: 34px;
  border: 5px solid #111827;
  border-radius: 8px 8px 0 0;
  background: #ffffff;
  box-shadow: 0 34px 80px rgba(45, 212, 191, 0.18);
}

.window-bar {
  display: flex;
  gap: 7px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
}

.window-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d1d5db;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 0;
  color: #111827;
  font-weight: 700;
}

.preview-content {
  padding: 24px 32px 34px;
}

.prompt-bubble {
  width: fit-content;
  max-width: 92%;
  margin-left: auto;
  padding: 12px 18px;
  border-radius: 999px;
  color: #164e3d;
  background: #d9fbe9;
  font-weight: 700;
}

.generated-screen {
  margin-top: 22px;
  padding: 18px;
  border-radius: 8px;
  background: #f8fbff;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.screen-header {
  width: 48%;
  height: 18px;
  border-radius: 4px;
  background: #dbeafe;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}

.metric-grid span {
  height: 46px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.screen-body {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 14px;
  margin-top: 14px;
}

.chart-card,
.list-card {
  height: 142px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.chart-card {
  background:
    conic-gradient(from 120deg, #22c55e 0 34%, #3b82f6 34% 70%, #f97316 70% 100%);
  border: 28px solid #ffffff;
}

.list-card {
  display: grid;
  align-content: center;
  gap: 12px;
  padding: 18px;
}

.list-card i {
  display: block;
  height: 22px;
  border-radius: 999px;
  background: #ecfdf5;
}

.prompt-input {
  display: flex;
  width: min(680px, calc(100% + 40px));
  align-items: center;
  justify-content: space-between;
  margin-top: -10px;
  margin-left: -24px;
  padding: 14px 16px 14px 24px;
  border: 3px solid #2ee6bd;
  border-radius: 18px;
  color: #111827;
  background: #ffffff;
  box-shadow: 0 26px 60px rgba(45, 212, 191, 0.16);
  font-size: 22px;
  font-weight: 800;
}

.prompt-input button {
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 14px;
  color: #ffffff;
  background: #111827;
  font-size: 26px;
  line-height: 1;
}

.auth-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 54px;
  background: #ffffff;
}

.card-header {
  margin-bottom: 34px;
}

.card-header p {
  margin: 0 0 10px;
  color: #12b981;
  font-size: 13px;
  font-weight: 800;
}

.card-header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 34px;
  font-weight: 800;
}

.card-header span,
.auth-switch {
  color: #6b7280;
}

.submit-button {
  width: 100%;
  margin-top: 10px;
  background: #1677ff;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.22);
}

.auth-switch {
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .auth-visual {
    min-height: auto;
    padding: 36px 24px;
  }

  .hero-copy {
    margin-top: 40px;
  }

  .hero-copy h1 {
    font-size: 38px;
  }

  .builder-preview {
    border-width: 3px;
  }

  .prompt-input {
    width: 100%;
    margin-left: 0;
    font-size: 16px;
  }

  .auth-card {
    padding: 40px 24px;
  }
}
</style>
