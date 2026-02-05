<!-- ChatInput.vue -->
<template>
  <div class="chat-input-area">
    <!-- 工具栏 -->
    <div class="input-tools">
      <a-upload
        :before-upload="beforeUpload"
        :show-upload-list="false"
        accept="image/*"
      >
        <a-button type="text" shape="circle" class="tool-btn">
          <PictureOutlined />
        </a-button>
      </a-upload>
    </div>

    <!-- 图片预览区域 -->
    <div v-if="uploadedImages.length > 0" class="image-preview-area">
      <div class="preview-images">
        <div
          v-for="(image, index) in uploadedImages"
          :key="index"
          class="preview-item"
        >
          <img :src="image.url" />
          <div class="preview-actions">
            <close-outlined @click="() => removeImage(index)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <a-textarea
        v-model:value="newMessage"
        placeholder="有事Q我～"
        :rows="1"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        @press-enter="sendMessage"
        class="message-input"
      />
      <a-button
        type="primary"
        shape="circle"
        :disabled="!newMessage.trim() && uploadedImages.length === 0"
        @click="sendMessage"
        class="send-btn"
      >
        <send-outlined />
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import {
  PictureOutlined,
  SendOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

const newMessage = ref('');

const props = defineProps({
  uploadedImages: Array,
});

const emit = defineEmits(['sendMessage', 'removeImage', 'beforeUpload']);

const sendMessage = () => {
  if (newMessage.value.trim() || props.uploadedImages.length > 0) {
    emit('sendMessage', newMessage.value.trim());
    newMessage.value = '';
  }
};

const removeImage = (index) => {
  emit('removeImage', index);
};

const beforeUpload = (file) => {
  emit('beforeUpload', file);
};
</script>

<style scoped>
.chat-input-area {
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-lg);
  background: var(--theme-cardBackground);
  padding: 0;
  box-shadow: var(--theme-shadowMedium);
  transition: var(--transition-normal);
}

.input-tools {
  padding: 8px 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--theme-borderLight);
}

.tool-btn {
  color: var(--theme-textSecondary);
  transition: var(--transition-fast);
  min-width: 44px;
  min-height: 44px;
}

.tool-btn:hover {
  color: var(--theme-primary);
  background: var(--theme-surfaceBackground);
}

.image-preview-area {
  padding: 12px 16px;
  border-bottom: 1px solid var(--theme-borderLight);
}

.preview-images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--theme-border);
  box-shadow: var(--theme-shadow);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-actions {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: var(--transition-fast);
}

.preview-actions:hover {
  background: rgba(0, 0, 0, 0.8);
}

.input-container {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);
  resize: none;
  min-height: 44px;
  background: var(--theme-surfaceBackground);
  color: var(--theme-textPrimary);
  transition: var(--transition-fast);
}

.message-input:focus {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 2px var(--theme-primary)20;
  outline: none;
}

.message-input::placeholder {
  color: var(--theme-textTertiary);
}

.send-btn {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  width: 44px;
  height: 44px;
  transition: var(--transition-fast);
}

.send-btn:hover {
  background: var(--theme-primaryHover);
  border-color: var(--theme-primaryHover);
  transform: scale(1.05);
}

.send-btn:disabled {
  background: var(--theme-surfaceBackground);
  border-color: var(--theme-border);
  color: var(--theme-textTertiary);
}

@media (min-width: 768px) {
  .input-tools,
  .image-preview-area,
  .input-container {
    padding: 12px 20px;
  }

  .preview-item {
    width: 70px;
    height: 70px;
  }
}
</style>
