<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoUrl from '@/assets/ai_logo.png'

type MenuItem = {
  key: string
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  {
    key: '/',
    label: '首页',
    path: '/',
  },
  {
    key: '/about',
    label: '关于',
    path: '/about',
  },
]

const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => {
  const matchedItem = menuItems.find((item) => item.path === route.path)
  return [matchedItem?.key ?? route.path]
})

const handleMenuClick = ({ key }: { key: string }) => {
  const targetItem = menuItems.find((item) => item.key === key)

  if (targetItem && targetItem.path !== route.path) {
    router.push(targetItem.path)
  }
}
</script>

<template>
  <a-layout-header class="global-header">
    <div class="header-left">
      <RouterLink class="brand" to="/">
        <img class="brand-logo" :src="logoUrl" alt="AI Code Mother" />
        <span class="brand-title">AI 编程导航</span>
      </RouterLink>

      <a-menu
        class="header-menu"
        mode="horizontal"
        :items="menuItems"
        :selected-keys="selectedKeys"
        @click="handleMenuClick"
      />
    </div>

    <a-button type="primary">登录</a-button>
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
}
</style>
