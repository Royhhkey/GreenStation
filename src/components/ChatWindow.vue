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
          <div class="status">在线</div>
        </div>
      </div>
      <div class="chat-actions">
        <a-button type="text" shape="circle" class="action-btn">
          <search-outlined />
        </a-button>
        <a-button type="text" shape="circle" class="action-btn">
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
          <!-- 所有消息都显示头像 -->
          <div class="message-avatar">
            <img 
              :src="message.isSent ? currentUserAvatar : chat.avatar" 
              :alt="message.isSent ? '我' : chat.name" 
            />
          </div>
          
          <div class="message-content-wrapper">
            <!-- 昵称显示 -->
            <div v-if="message.showName" class="message-sender">
              {{ message.senderName || (message.isSent ? '我' : chat.name) }}
            </div>
            
            <div class="message-content" :class="{'image-content': message.type === 'image'}">
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
                <!-- 图片消息的时间显示在图片上 -->
                <!-- <div class="message-time image-time">
                  {{ formatMessageTime(message.time) }}
                </div> -->
              </div>
            </div>
            
            <!-- 文本消息的时间显示在内容下方 -->
            <!-- <div v-if="message.type === 'text'" class="message-time text-time">
              {{ formatMessageTime(message.time) }}
            </div> -->
              <div  class="message-time text-time">
              {{ formatMessageTime(message.time) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <a-modal 
      v-model:open="previewVisible" 
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
        <a-button type="text" shape="circle" class="tool-btn">
          <smile-outlined />
        </a-button>
        <a-upload
          :before-upload="beforeUpload"
          :show-upload-list="false"
          accept="image/*"
          multiple
        >
          <a-button type="text" shape="circle" class="tool-btn">
            <folder-open-outlined />
          </a-button>
        </a-upload>
        <a-button type="text" shape="circle" class="tool-btn">
          <more-outlined />
        </a-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  LeftOutlined,
  SearchOutlined,
  MoreOutlined,
  SmileOutlined,
  FolderOpenOutlined,
  SendOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// 当前用户头像
const currentUserAvatar = ref('https://randomuser.me/api/portraits/lego/1.jpg');

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
  name: '第三',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  messages: []
});

// 加载聊天数据
const loadChatData = () => {
  const chatData = {
    1: {
      id: 1,
      name: '第三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      messages: [
        {
          id: 1,
          content: '这个商品在任何时间',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 35),
          isSent: false,
          showName: true,
          senderName: '第三'
        },
        {
          id: 2,
          content: '价格是吗？',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 25),
          isSent: false,
          showName: true,
          senderName: '注'
        },
        {
          id: 3,
          content: '好的，我考虑一下',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 8),
          isSent: true
        },
        {
          id: 4,
          content: '没问题',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 5),
          isSent: false,
          showName: true,
          senderName: 'Zero'
        },
        {
          id: 5,
          content: '了解了',
          type: 'text',
          time: new Date(Date.now() - 1000 * 60 * 2),
          isSent: false,
          showName: true,
          senderName: 'regionv5@30'
        },
        {
          id: 6,
          content: 'https://via.placeholder.com/200x150/3f9db5/ffffff?text=商品图片',
          type: 'image',
          time: new Date(Date.now() - 1000 * 60 * 1),
          isSent: true,
          alt: '商品图片'
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
  const messageTime = new Date(time);
  const now = new Date();
  const diffMinutes = Math.floor((now - messageTime) / (1000 * 60));
  
  if (diffMinutes < 1) return '刚刚';
  else if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  else return messageTime.toLocaleTimeString('zh-CN', {
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

  return false;
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
        isSent: false,
        showName: true,
        senderName: '第三'
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
  background: #f5f5f5;
}

.chat-header {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

.back-button :deep(.anticon) {
  font-size: 16px;
  margin-right: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.chat-user-info .avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  background: #f0f0f0;
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
  color: #000;
}

.user-info .status {
  font-size: 12px;
  color: #666;
}

.chat-actions {
  display: flex;
  gap: 4px;
}

.action-btn, .tool-btn {
  color: #666;
  width: 32px;
  height: 32px;
}

.action-btn:hover, .tool-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: #f5f5f5;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.message-bubble {
  display: flex;
  max-width: 80%;
  gap: 8px;
}

.message-sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-received {
  align-self: flex-start;
}

/* 消息头像 */
.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content-wrapper {
  flex: 1;
  min-width: 0;
}

.message-sender {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.message-sent .message-sender {
  text-align: right;
  margin-right: 8px;
}

.message-received .message-sender {
  text-align: left;
  margin-left: 8px;
}

/* 文本消息内容 */
.message-content:not(.image-content) {
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.message-sent .message-content:not(.image-content) {
  background: #3f9db5;
  border-bottom-right-radius: 2px;
}

.message-received .message-content:not(.image-content) {
  border-bottom-left-radius: 2px;
}

/* 图片消息内容 - 无背景 */
.message-content.image-content {
  background: transparent;
  padding: 0;
  box-shadow: none;
  max-width: 200px;
}

.message-text {
  margin-bottom: 0;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
  color: white;
}

.message-received .message-text {
  color: #000;
}

/* 图片消息样式 */
.message-image {
  position: relative;
  display: inline-block;
}

.message-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  display: block;
}

.message-image img:hover {
  transform: scale(1.02);
}

/* 文本消息时间 */
.message-time.text-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.message-sent .message-time.text-time {
  text-align: right;
  margin-right: 8px;
}

.message-received .message-time.text-time {
  text-align: left;
  margin-left: 8px;
}

/* 图片消息的时间样式 */
.message-time.image-time {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  position: absolute;
  bottom: 8px;
  right: 8px;
  margin: 0;
}

.chat-input-area {
  border-top: 1px solid #e8e8e8;
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
  .chat-header {
    padding: 8px 12px;
  }
  
  .chat-messages {
    padding: 12px;
  }
  
  .message-bubble {
    max-width: 90%;
  }
  
  .input-tools,
  .image-preview-area,
  .input-container {
    padding: 8px 12px;
  }
  
  .preview-item {
    width: 50px;
    height: 50px;
  }
  
  .message-content.image-content {
    max-width: 180px;
  }
}
</style>