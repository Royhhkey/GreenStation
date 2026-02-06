<!-- components/profile/UserInfoCard.vue -->
<template>
  <a-card class="info-card">
    <template #title>
      <div class="info-card-title-container">
        <div class="info-card-title">
          {{ isEditing ? '编辑个人信息' : '个人信息' }}
        </div>
        <div>
          <a-button
            v-if="!isEditing"
            type="primary"
            class="edit-profile-btn"
            @click="toggleEdit"
          >
            <template #icon><EditOutlined /></template>
            编辑资料
          </a-button>

          <div v-else class="edit-actions">
            <a-button type="primary" class="save-btn" @click="save">
              <template #icon><CheckOutlined /></template>
              保存
            </a-button>
            <a-button style="margin-left: 8px" @click="toggleEdit">
              <template #icon><CloseOutlined /></template>
              取消
            </a-button>
          </div>
        </div>
      </div>
    </template>

    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="用户名">
        <span v-if="!isEditing">{{ userInfo.username || '未设置' }}</span>
        <a-input
          v-else
          v-model:value="editForm.username"
          size="small"
          placeholder="请输入用户名"
        />
      </a-descriptions-item>

      <a-descriptions-item label="学号">
        <span v-if="!isEditing">{{ userInfo.XH || '未设置' }}</span>
        <a-input
          v-else
          v-model:value="editForm.XH"
          size="small"
          placeholder="请输入学号"
        />
      </a-descriptions-item>

      <a-descriptions-item label="邮箱">
        <span v-if="!isEditing">{{ userInfo.email || '未设置' }}</span>
        <a-input
          v-else
          v-model:value="editForm.email"
          size="small"
          placeholder="请输入邮箱"
        />
      </a-descriptions-item>

      <a-descriptions-item label="手机号">
        <span v-if="!isEditing">{{ userInfo.phoneNumber || '未设置' }}</span>
        <a-input
          v-else
          v-model:value="editForm.phoneNumber"
          size="small"
          placeholder="请输入手机号"
        />
      </a-descriptions-item>

      <a-descriptions-item label="寝室">
        <span v-if="!isEditing">{{ userInfo.QSH || '未填写' }}</span>
        <a-input
          v-else
          v-model:value="editForm.QSH"
          size="small"
          placeholder="请输入寝室"
        />
      </a-descriptions-item>

      <a-descriptions-item label="年级">
        <span v-if="!isEditing">{{ userInfo.grade || '未填写' }}</span>
        <a-input
          v-else
          v-model:value="editForm.grade"
          size="small"
          placeholder="请输入年级"
        />
      </a-descriptions-item>

      <a-descriptions-item label="专业">
        <span v-if="!isEditing">{{ userInfo.ZY || '未填写' }}</span>
        <a-input
          v-else
          v-model:value="editForm.ZY"
          size="small"
          placeholder="请输入专业"
        />
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script setup>
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  userInfo: Object,
  isEditing: Boolean,
  editForm: Object,
});

const emit = defineEmits(['update:editForm', 'toggleEdit', 'save']);

const toggleEdit = () => {
  emit('toggleEdit');
};

const save = () => {
  emit('save');
};
</script>

<style scoped>
/* User Info Card - Theme-aware Design */
.info-card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.info-card {
  border-radius: var(--radius-md);
  box-shadow: 0 2px 12px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  transition: all var(--transition-normal);
}

.info-card:hover {
  box-shadow: 0 4px 16px var(--theme-shadowMedium);
}

:deep(.ant-card) {
  background: var(--theme-cardBackground);
  border-color: var(--theme-border);
  transition: all var(--transition-normal);
}

:deep(.ant-card-head) {
  background: var(--theme-surfaceGradient);
  border-bottom-color: var(--theme-border);
  color: var(--theme-textPrimary);
}

:deep(.ant-card-head-title) {
  color: var(--theme-textPrimary);
  font-weight: 600;
}

:deep(.ant-card-body) {
  background: var(--theme-cardBackground);
  color: var(--theme-textPrimary);
}

:deep(.ant-descriptions) {
  background: transparent;
}

:deep(.ant-descriptions-item-label) {
  color: var(--theme-textSecondary);
  font-weight: 600;
  background: var(--theme-surfaceBackground);
}

:deep(.ant-descriptions-item-content) {
  color: var(--theme-textPrimary);
  background: var(--theme-cardBackground);
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label),
:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  border-color: var(--theme-border);
}

:deep(.ant-descriptions-row:hover .ant-descriptions-item-label) {
  background: var(--theme-cardBackground);
}

:deep(.ant-descriptions-row:hover .ant-descriptions-item-content) {
  background: var(--theme-surfaceBackground);
}

:deep(.ant-input) {
  border: 2px solid var(--theme-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  background: var(--theme-cardBackground);
  color: var(--theme-textPrimary);
  transition: all var(--transition-normal);
}

:deep(.ant-input:hover) {
  border-color: var(--theme-primary);
}

:deep(.ant-input:focus) {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.ant-btn) {
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: all var(--transition-normal);
}

:deep(.ant-btn-primary) {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
}

:deep(.ant-btn-primary:hover) {
  background: var(--theme-primaryHover);
  border-color: var(--theme-primaryHover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--theme-shadow);
}

:deep(.ant-btn-default) {
  border-color: var(--theme-border);
  color: var(--theme-textPrimary);
}

:deep(.ant-btn-default:hover) {
  border-color: var(--theme-primary);
  color: var(--theme-primary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .info-card-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
