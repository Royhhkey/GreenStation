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
.info-card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px 12px 0 0;
}

.info-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.ant-input) {
  border-color: #1890ff;
  border-radius: 8px;
  padding: 8px;
}

:deep(.ant-input:focus) {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}
</style>
