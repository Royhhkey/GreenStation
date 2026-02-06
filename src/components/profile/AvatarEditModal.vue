<!-- components/profile/AvatarEditModal.vue -->
<template>
  <a-modal
    :open="visible"
    title="更换头像"
    width="400px"
    :footer="null"
    @cancel="close"
  >
    <div class="avatar-edit-modal">
      <div class="avatar-preview">
        <img :src="avatarPreview" alt="头像预览" class="preview-image" />
      </div>

      <a-upload
        :before-upload="beforeUpload"
        :show-upload-list="false"
        accept="image/*"
      >
        <a-button>
          <UploadOutlined />
          选择图片
        </a-button>
      </a-upload>

      <div class="avatar-actions">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="save" :loading="avatarLoading">
          保存
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  visible: Boolean,
  avatarPreview: String,
  avatarLoading: Boolean,
});

const emit = defineEmits(['update:visible', 'upload', 'save']);

const close = () => {
  emit('update:visible', false);
};

const beforeUpload = (file) => {
  emit('upload', file);
  return false;
};

const save = () => {
  emit('save');
};
</script>

<style scoped>
/* Avatar Edit Modal - Theme-aware Design */
:deep(.ant-modal-content) {
  background: var(--theme-cardBackground);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 48px var(--theme-shadowHeavy);
}

:deep(.ant-modal-header) {
  background: var(--theme-surfaceGradient);
  border-bottom: 1px solid var(--theme-border);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

:deep(.ant-modal-title) {
  color: var(--theme-textPrimary);
  font-weight: 600;
}

.avatar-edit-modal {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.avatar-preview {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.preview-image {
  width: 150px;
  height: 150px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid var(--theme-border);
  box-shadow: 0 8px 24px var(--theme-shadow);
  transition: all var(--transition-normal);
}

.preview-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px var(--theme-shadowMedium);
  border-color: var(--theme-primary);
}

.avatar-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

:deep(.ant-btn) {
  border-radius: var(--radius-md);
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  height: auto;
  transition: all var(--transition-normal);
}

:deep(.ant-btn-primary) {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  box-shadow: 0 2px 8px var(--theme-shadow);
}

:deep(.ant-btn-primary:hover) {
  background: var(--theme-primaryHover);
  border-color: var(--theme-primaryHover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

:deep(.ant-btn-default) {
  border-color: var(--theme-border);
  color: var(--theme-textPrimary);
}

:deep(.ant-btn-default:hover) {
  border-color: var(--theme-primary);
  color: var(--theme-primary);
}

/* Upload Button */
:deep(.ant-upload) {
  display: inline-block;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .preview-image {
    width: 120px;
    height: 120px;
  }

  .avatar-actions {
    flex-direction: column;
    width: 100%;
  }

  :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
