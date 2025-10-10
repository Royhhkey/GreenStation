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
          <PictureOutlined/>
        </a-button>
      </a-upload>
    </div>

    <!-- 图片预览区域 -->
    <div v-if="uploadedImages.length > 0" class="image-preview-area">
      <div class="preview-images">
        <div v-for="(image, index) in uploadedImages" :key="index" class="preview-item">
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
  CloseOutlined 
} from '@ant-design/icons-vue';

const newMessage = ref('');

const props = defineProps({
  uploadedImages: Array
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
  border: 1px solid #333;
  border-radius: 15px;
  background: white;
  padding: 0;
}

.input-tools {
  padding: 8px 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.image-preview-area {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
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
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
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
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 10px;
}

.input-container {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  resize: none;
}

.message-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.send-btn {
  background: #07c160;
  border-color: #07c160;
  width: 36px;
  height: 36px;
}

.send-btn:hover {
  background: #06ae56;
  border-color: #06ae56;
}

.send-btn:disabled {
  background: #f0f0f0;
  border-color: #d9d9d9;
  color: #bfbfbf;
}

@media (max-width: 768px) {
  .input-tools,
  .image-preview-area,
  .input-container {
    padding: 8px 12px;
  }
  
  .preview-item {
    width: 50px;
    height: 50px;
  }
}
</style>