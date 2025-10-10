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
        <a-button 
          type="primary" 
          @click="save" 
          :loading="avatarLoading"
        >
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
  avatarLoading: Boolean
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
.avatar-edit-modal {
  text-align: center;
}

.avatar-preview {
  margin-bottom: 20px;
}

.preview-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.avatar-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>