<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoUrl from '@/assets/ai_logo.png'
import { canAccess, getRoleLabel } from '@/access'
import { useLoginUserStore } from '@/stores/loginUser.ts'

type MenuItem = {
  key: string
  label: string
  path: string
}

const route = useRoute()
const router = useRouter()
const loginUserStore = useLoginUserStore()

const menuItems = computed<MenuItem[]>(() =>
  router
    .getRoutes()
    .filter((routeRecord) => !routeRecord.meta.hideInMenu)
    .filter((routeRecord) =>
      canAccess(loginUserStore.loginUser, routeRecord.meta.access as string | undefined),
    )
    .map((routeRecord) => ({
      key: routeRecord.path,
      label: (routeRecord.meta.title as string) || String(routeRecord.name),
      path: routeRecord.path,
    }))
    .sort((firstItem, secondItem) => {
      if (firstItem.path === '/') {
        return -1
      }
      if (secondItem.path === '/') {
        return 1
      }
      return firstItem.label.localeCompare(secondItem.label, 'zh-Hans-CN')
    }),
)

const selectedKeys = computed(() => {
  const matchedItem = menuItems.value.find((item) => item.path === route.path)
  return [matchedItem?.key ?? route.path]
})

const handleMenuClick = ({ key }: { key: string }) => {
  const targetItem = menuItems.value.find((item) => item.key === key)

  if (targetItem && targetItem.path !== route.path) {
    router.push(targetItem.path)
  }
}
</script>

<template>
  <a-layout-header class="global-header">
    <div class="header-left">
      <RouterLink class="brand" to="/">
        <img class="brand-logo" :src="logoUrl" alt="AI 零代码生成平台" />
        <span class="brand-title">AI 零代码生成平台</span>
      </RouterLink>

      <a-menu
        class="header-menu"
        mode="horizontal"
        :items="menuItems"
        :selected-keys="selectedKeys"
        @click="handleMenuClick"
      />
    </div>

    <div class="user-login-status">
      <div v-if="loginUserStore.loginUser.id">
        <a-dropdown placement="bottomRight">
          <button class="user-trigger">
            <a-avatar :src="loginUserStore.loginUser.userAvatar">
              {{
                loginUserStore.loginUser.userName?.slice(0, 1) ||
                loginUserStore.loginUser.userAccount?.slice(0, 1) ||
                'U'
              }}
            </a-avatar>
            <span class="user-name">{{ loginUserStore.loginUser.userName ?? '无名' }}</span>
          </button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="role" disabled>
                {{ getRoleLabel(loginUserStore.loginUser.userRole) }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="router.push('/user/logout')">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <div v-else>
        <a-button type="primary" @click="router.push('/user/login')">登录</a-button>
      </div>
    </div>

  </a-layout-header>
</template>

<style scoped>
.global-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #edf0f5;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  margin-right: 32px;
  color: #111827;
  text-decoration: none;
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-title {
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.header-menu {
  flex: 1;
  min-width: 0;
  border-bottom: none;
}

.user-login-status {
  flex-shrink: 0;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  color: #111827;
  background: #ffffff;
  cursor: pointer;
}

.user-trigger:hover {
  border-color: #0d9488;
  color: #0f766e;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .global-header {
    height: auto;
    min-height: 64px;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
  }

  .header-left {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .brand {
    margin-right: 0;
  }

  .brand-title {
    font-size: 16px;
  }

  .header-menu {
    width: 100%;
    line-height: 40px;
  }

  .user-login-status {
    align-self: center;
  }

  .user-name {
    display: none;
  }
}
</style>
