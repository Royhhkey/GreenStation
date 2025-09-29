<template>
  <div class="chat-page">
    <div class="chat-header">
      <div class="back-button" @click="backToList">
        <left-outlined />

      </div>
      <div class="chat-user-info">
        <div class="avatar">
          <img :src="chat.avatar" :alt="chat.name" />
        </div>
        <div class="user-info">
          <div class="name">{{ chat.name }}</div>
          <!-- <div class="status">在线</div> -->
        </div>
      </div>
      <div class="chat-actions">
        <!-- <a-button type="text" shape="circle">
          <phone-outlined />
        </a-button>
        <a-button type="text" shape="circle">
          <video-camera-outlined />
        </a-button> -->
        <a-button type="text" shape="circle">
          <more-outlined />
        </a-button>
      </div>
    </div>

    <div ref="chatContainer" class="chat-container">
      <div class="chat-messages">
        <div
          v-for="message in chat.messages"
          :key="message.id"
          class="message-bubble"
          :class="{
            'message-sent': message.isSent,
            'message-received': !message.isSent
          }"
        >
          <div class="message-content">
            <!-- 文本消息 -->
            <div v-if="message.type === 'text'" class="message-text">
              {{ message.content }}
            </div>
            
            <!-- 图片消息 -->
            <div v-else-if="message.type === 'image'" class="message-image">
              <img 
                :src="message.content" 
                :alt="message.alt || '图片'"
                @click="previewImage(message.content)"
              />
            </div>
            
            <div class="message-time">{{ formatMessageTime(message.time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <a-modal 
      v-model:visible="previewVisible" 
      :footer="null"
      width="80%"
      style="top: 20px;"
      @cancel="previewVisible = false"
    >
      <img :src="previewImageUrl" style="width: 100%;" />
    </a-modal>

    <div class="chat-input-area">
      <!-- 工具栏 -->
      <div class="input-tools">
        <a-upload
          :before-upload="beforeUpload"
          :show-upload-list="false"
          accept="image/*"
          multiple
        >
          <a-button type="text" shape="circle">
            <picture-outlined />
          </a-button>
        </a-upload>
        <!-- <a-button type="text" shape="circle" @click="takePhoto">
          <camera-outlined />
        </a-button> -->
        <!-- <a-button type="text" shape="circle">
          <file-image-outlined />
        </a-button> -->
      </div>

      <!-- 图片预览区域 -->
      <div v-if="uploadedImages.length > 0" class="image-preview-area">
        <div class="preview-images">
          <div v-for="(image, index) in uploadedImages" :key="index" class="preview-item">
            <img :src="image.url" />
            <div class="preview-actions">
              <close-outlined @click="removeImage(index)" />
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <a-textarea
          v-model:value="newMessage"
          placeholder="输入消息..."
          :rows="1"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          @press-enter="sendMessage"
        />
        <a-button
          type="primary"
          shape="circle"
          :disabled="!newMessage.trim() && uploadedImages.length === 0"
          @click="sendMessage"
        >
          <send-outlined />
        </a-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  LeftOutlined,

  MoreOutlined,
  PictureOutlined,

  SendOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// 聊天数据
const chatId = parseInt(router.currentRoute.value.params.id);
const newMessage = ref('');
const chatContainer = ref(null);
const previewVisible = ref(false);
const previewImageUrl = ref('');



// 上传的图片
const uploadedImages = ref([]);

// 聊天数据
const chat = ref({
  id: chatId,
  name: '用户',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  messages: []
});

// 加载聊天数据
const loadChatData = () => {
  const chatData = {
    1: {
      id: 1,
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      messages: [
        {
          id: 1,
          content: '你好，这个商品还在吗？',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 10),
          isSent: false
        },
        {
          id: 2,
          content: '还在的，你需要吗？',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 8),
          isSent: true
        }
      ]
    }
  };

  chat.value = chatData[chatId] || {
    id: chatId,
    name: '用户',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    messages: []
  };
};

// 格式化消息时间
const formatMessageTime = (time) => {
  return new Date(time).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 返回消息列表
const backToList = () => {
  router.push('/home/messages');
};

// 图片上传前的处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!');
    return false;
  }

  // 预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImages.value.push({
      file: file,
      url: e.target.result,
      name: file.name
    });
  };
  reader.readAsDataURL(file);

  return false; // 阻止自动上传
};

// 移除图片
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};







// 预览图片
const previewImage = (imageUrl) => {
  previewImageUrl.value = imageUrl;
  previewVisible.value = true;
};

// 发送消息
const sendMessage = async () => {
  // 发送文本消息
  if (newMessage.value.trim()) {
    const textMsg = {
      id: chat.value.messages.length + 1,
      content: newMessage.value.trim(),
      type: 'text',
      time: new Date(),
      isSent: true
    };
    
    chat.value.messages.push(textMsg);
    newMessage.value = '';
  }

  // 发送图片消息
  if (uploadedImages.value.length > 0) {
    for (const image of uploadedImages.value) {
      // 模拟图片上传到服务器（实际应该使用真实的API）
      const imageUrl = await simulateImageUpload(image);
      
      const imageMsg = {
        id: chat.value.messages.length + 1,
        content: imageUrl,
        type: 'image',
        alt: image.name,
        time: new Date(),
        isSent: true
      };
      
      chat.value.messages.push(imageMsg);
    }
    uploadedImages.value = [];
  }

  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });

  // 模拟对方回复
  if (newMessage.value.trim() || uploadedImages.value.length > 0) {
    setTimeout(() => {
      const replyMsg = {
        id: chat.value.messages.length + 1,
        content: '收到，谢谢！',
        type: 'text',
        time: new Date(Date.now() + 2000),
        isSent: false
      };
      
      chat.value.messages.push(replyMsg);
      
      nextTick(() => {
        scrollToBottom();
      });
    }, 2000);
  }
};

// 模拟图片上传到服务器
const simulateImageUpload = async (image) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 如果是拍照的图片，直接使用Data URL
      // 如果是文件上传，这里应该返回服务器返回的URL
      resolve(image.url);
    }, 500);
  });
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 初始化
onMounted(() => {
  loadChatData();
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  background: white;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  color: #1890ff;
}

.back-button span {
  margin-left: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.chat-user-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.chat-user-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info .name {
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: 600;
}

.user-info .status {
  font-size: 12px;
  color: #52c41a;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.chat-container {
  /* flex: 1; */
  height: 80%;
  overflow-y: auto;
  padding: 16px;
  background-color: #fff;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  display: flex;
  max-width: 70%;
}

.message-sent {
  align-self: flex-end;
}

.message-received {
  align-self: flex-start;
}

.message-content {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.message-sent .message-content {
  /* background: #1890ff; */
  /* color: white; */
  background: #edf3fe;
  color: #000;

}

.message-text {
  margin-bottom: 4px;
  word-wrap: break-word;
}

.message-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.message-image img:hover {
  transform: scale(1.02);
}

.message-time {
  font-size: 11px;
  color: #999;
  text-align: right;
  margin-top: 4px;
}

/* .message-sent .message-time {
  color: rgba(255, 255, 255, 0.8);
} */
.message-sent .message-time {
  color: #000;
}

.chat-input-area {
  border-top: 1px solid #e8e8e8;
  background: white;
}

.input-tools {
  padding: 12px 16px 0;
  display: flex;
  gap: 8px;
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
  width: 80px;
  height: 80px;
  border-radius: 8px;
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
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.input-container {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container :deep(.ant-input) {
  flex: 1;
}

.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.camera-video {
  width: 100%;
  max-width: 360px;
  border-radius: 8px;
  background: #000;
}

.camera-actions {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 8px 12px;
  }
  
  .chat-container {
    padding: 12px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .message-content {
    max-width: 250px;
  }
  
  .input-tools,
  .image-preview-area,
  .input-container {
    padding: 8px 12px;
  }
  
  .preview-item {
    width: 60px;
    height: 60px;
  }
}
</style>