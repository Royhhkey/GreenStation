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
        <a-button type="text" shape="circle">
          <phone-outlined />
        </a-button>
        <a-button type="text" shape="circle">
          <video-camera-outlined />
        </a-button>
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
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ formatMessageTime(message.time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <div class="input-tools">
        <a-button type="text" shape="circle">
          <plus-outlined />
        </a-button>
        <a-button type="text" shape="circle" @click="chooseImage">
          <picture-outlined />
        </a-button>

      </div>
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
          :disabled="!newMessage.trim()"
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
import {
  LeftOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  PlusOutlined,
  PictureOutlined,
  FileImageOutlined,
  SendOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// 从路由参数获取聊天ID
const chatId = parseInt(router.currentRoute.value.params.id);

// 新消息内容
const newMessage = ref('');

// 聊天容器引用
const chatContainer = ref(null);

// 模拟聊天数据（实际应该从API获取）
const chat = ref({
  id: chatId,
  name: '用户',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  messages: []
});

// 根据ID加载聊天数据
const loadChatData = () => {
  // 模拟数据 - 实际应该从API获取
  const chatData = {
    1: {
      id: 1,
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      messages: [
        {
          id: 1,
          content: '你好，这个商品还在吗？',
          time: new Date(Date.now() - 1000 * 60 * 10),
          isSent: false
        },
        {
          id: 2,
          content: '还在的，你需要吗？',
          time: new Date(Date.now() - 1000 * 60 * 8),
          isSent: true
        }
      ]
    },
    2: {
      id: 2,
      name: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      messages: [
        {
          id: 1,
          content: '价格可以便宜点吗？',
          time: new Date(Date.now() - 1000 * 60 * 60),
          isSent: false
        }
      ]
    },
    3: {
      id: 3,
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      messages: [
        {
          id: 1,
          content: '什么时候可以交易？',
          time: new Date(Date.now() - 1000 * 60 * 60 * 3),
          isSent: false
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

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  const newMsg = {
    id: chat.value.messages.length + 1,
    content: newMessage.value.trim(),
    time: new Date(),
    isSent: true
  };
  
  chat.value.messages.push(newMsg);
  newMessage.value = '';
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
  
  // 模拟对方回复
  setTimeout(() => {
    const replyMsg = {
      id: chat.value.messages.length + 1,
      content: '收到，谢谢！',
      time: new Date(Date.now() + 2000),
      isSent: false
    };
    
    chat.value.messages.push(replyMsg);
    
    nextTick(() => {
      scrollToBottom();
    });
  }, 2000);
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
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f0f2f5;
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
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-sent .message-content {
  background: #1890ff;
  color: white;
}

.message-text {
  margin-bottom: 4px;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  text-align: right;
}

.message-sent .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.chat-input-area {
  border-top: 1px solid #e8e8e8;
  padding: 16px;
  background: white;
}

.input-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container :deep(.ant-input) {
  flex: 1;
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
  
  .chat-input-area {
    padding: 12px;
  }
}
</style>