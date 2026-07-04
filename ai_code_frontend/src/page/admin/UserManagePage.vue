<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Modal, message } from 'ant-design-vue'
import {
  addUser,
  deleteUser,
  listUserVoByPage,
  updateUser,
} from '@/api/userController'
import { getRoleLabel, ROLE_ENUM } from '@/access'

const loading = ref(false)
const submitting = ref(false)
const modalVisible = ref(false)
const editingUserId = ref<number>()
const userList = ref<API.UserVO[]>([])
const total = ref(0)

const searchParams = reactive<API.UserQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  userAccount: '',
  userName: '',
  userRole: undefined,
})

const formState = reactive<API.UserAddRequest & API.UserUpdateRequest>({
  userName: '',
  userAccount: '',
  userAvatar: '',
  userProfile: '',
  userRole: ROLE_ENUM.USER,
})

const isEditMode = computed(() => Boolean(editingUserId.value))

const roleOptions = [
  {
    label: '普通用户',
    value: ROLE_ENUM.USER,
  },
  {
    label: '管理员',
    value: ROLE_ENUM.ADMIN,
  },
]

const columns = [
  {
    title: '用户',
    key: 'user',
    width: 260,
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    key: 'userRole',
    width: 120,
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    key: 'userProfile',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 190,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await listUserVoByPage({
      ...searchParams,
      userAccount: searchParams.userAccount || undefined,
      userName: searchParams.userName || undefined,
    })
    if (res.data.code === 0 && res.data.data) {
      userList.value = res.data.data.records || []
      total.value = res.data.data.totalRow || 0
      return
    }
    message.error(res.data.message || '获取用户列表失败')
  } catch (error) {
    message.error('获取用户列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchParams.pageNum = 1
  fetchUserList()
}

const handleReset = () => {
  searchParams.pageNum = 1
  searchParams.userAccount = ''
  searchParams.userName = ''
  searchParams.userRole = undefined
  fetchUserList()
}

const resetForm = () => {
  editingUserId.value = undefined
  formState.id = undefined
  formState.userName = ''
  formState.userAccount = ''
  formState.userAvatar = ''
  formState.userProfile = ''
  formState.userRole = ROLE_ENUM.USER
}

const openCreateModal = () => {
  resetForm()
  modalVisible.value = true
}

const openEditModal = (record: API.UserVO) => {
  resetForm()
  editingUserId.value = record.id
  formState.id = record.id
  formState.userName = record.userName
  formState.userAccount = record.userAccount
  formState.userAvatar = record.userAvatar
  formState.userProfile = record.userProfile
  formState.userRole = record.userRole || ROLE_ENUM.USER
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!isEditMode.value && !formState.userAccount?.trim()) {
    message.warning('请输入账号')
    return
  }

  if (!formState.userRole) {
    message.warning('请选择角色')
    return
  }

  submitting.value = true
  try {
    const res = isEditMode.value
      ? await updateUser({
          id: formState.id,
          userName: formState.userName,
          userAvatar: formState.userAvatar,
          userProfile: formState.userProfile,
          userRole: formState.userRole,
        })
      : await addUser({
          userName: formState.userName,
          userAccount: formState.userAccount,
          userAvatar: formState.userAvatar,
          userProfile: formState.userProfile,
          userRole: formState.userRole,
        })

    if (res.data.code === 0) {
      message.success(isEditMode.value ? '更新成功' : '新增成功')
      modalVisible.value = false
      resetForm()
      fetchUserList()
      return
    }
    message.error(res.data.message || '保存失败')
  } catch (error) {
    message.error('保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const handleDelete = (record: API.UserVO) => {
  if (!record.id) {
    message.warning('用户 ID 不存在')
    return
  }

  Modal.confirm({
    title: '确认删除用户？',
    content: `删除后用户「${record.userName || record.userAccount || record.id}」将不可恢复。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      const res = await deleteUser({ id: record.id })
      if (res.data.code === 0) {
        message.success('删除成功')
        fetchUserList()
        return
      }
      message.error(res.data.message || '删除失败')
    },
  })
}

const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
  searchParams.pageNum = pagination.current || 1
  searchParams.pageSize = pagination.pageSize || 10
  fetchUserList()
}

onMounted(fetchUserList)
</script>

<template>
  <div class="user-manage-page">
    <section class="search-panel">
      <a-form class="search-form" layout="inline" :model="searchParams" @finish="handleSearch">
        <div class="search-fields">
          <a-form-item label="账号">
            <a-input
              v-model:value="searchParams.userAccount"
              allow-clear
              placeholder="输入账号"
            />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input v-model:value="searchParams.userName" allow-clear placeholder="输入用户名" />
          </a-form-item>
          <a-form-item label="角色">
            <a-select
              v-model:value="searchParams.userRole"
              allow-clear
              class="role-select"
              :options="roleOptions"
              placeholder="全部角色"
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </div>
        <a-form-item class="create-action">
          <a-button type="primary" @click="openCreateModal">新增用户</a-button>
        </a-form-item>
      </a-form>
    </section>

    <section class="table-panel">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :scroll="{ x: 980 }"
        :pagination="{
          current: searchParams.pageNum,
          pageSize: searchParams.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (count: number) => `共 ${count} 条`,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <a-space>
              <a-avatar :src="record.userAvatar">
                {{ record.userName?.slice(0, 1) || record.userAccount?.slice(0, 1) || 'U' }}
              </a-avatar>
              <div class="user-cell">
                <strong>{{ record.userName || '未命名用户' }}</strong>
                <span>ID: {{ record.id }}</span>
              </div>
            </a-space>
          </template>
          <template v-else-if="column.key === 'userRole'">
            <a-tag :color="record.userRole === ROLE_ENUM.ADMIN ? 'green' : 'blue'">
              {{ getRoleLabel(record.userRole) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'userProfile'">
            <span class="profile-text">{{ record.userProfile || '暂无简介' }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="openEditModal(record)">编辑</a-button>
              <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </section>

    <a-modal
      v-model:open="modalVisible"
      :title="isEditMode ? '编辑用户' : '新增用户'"
      :confirm-loading="submitting"
      width="560px"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form layout="vertical" :model="formState">
        <a-form-item label="账号" required>
          <a-input
            v-model:value="formState.userAccount"
            :disabled="isEditMode"
            placeholder="请输入账号"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="formState.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="头像地址">
          <a-input v-model:value="formState.userAvatar" placeholder="请输入头像 URL" />
        </a-form-item>
        <a-form-item label="角色" required>
          <a-select v-model:value="formState.userRole" :options="roleOptions" />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea
            v-model:value="formState.userProfile"
            :maxlength="160"
            show-count
            placeholder="请输入用户简介"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.user-manage-page {
  display: flex;
  position: relative;
  left: 50%;
  width: 80vw;
  flex-direction: column;
  gap: 18px;
  max-width: 1680px;
  min-width: 960px;
  transform: translateX(-50%);
}

.search-panel,
.table-panel {
  border: 1px solid #e8edf5;
  border-radius: 8px;
  background: #ffffff;
}

.search-panel {
  padding: 18px 24px 2px;
}

.search-form {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.search-fields {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0;
}

.create-action {
  margin-left: auto;
}

.table-panel {
  padding: 8px 8px 0;
}

.role-select {
  width: 150px;
}

.user-cell {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.user-cell strong {
  color: #111827;
}

.user-cell span,
.profile-text {
  color: #6b7280;
}

@media (max-width: 768px) {
  .user-manage-page {
    left: auto;
    width: 100%;
    min-width: 0;
    transform: none;
  }

  .search-form,
  .search-fields {
    flex-direction: column;
  }

  .create-action {
    width: 100%;
    margin-left: 0;
  }
}
</style>
