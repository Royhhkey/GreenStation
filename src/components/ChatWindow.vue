<template>
  <div class="chat-page">
    <div class="chat-header">
      <div class="back-button" @click="backToList">
        <left-outlined />
      </div>
      <div class="head-right">
              <div class="connection-status" :class="{ connected: isConnected, disconnected: !isConnected }">
            {{ isConnected ? '已连接' : '连接中...' }}
            </div>
      </div>
      <div class="chat-user-info">
        <!-- <div class="avatar">
          <img :src="chat.avatar" :alt="chat.name" />
        </div> -->
        <div class="user-info">
          <div class="name">{{ chat.name }}</div>
          <!-- <div class="status">在线</div> -->
        </div>
      </div>
      <!-- <div class="chat-actions">
        <a-button type="text" shape="circle" class="action-btn">
          <search-outlined />
        </a-button>
        <a-button type="text" shape="circle" class="action-btn">
          <more-outlined />
        </a-button>
      </div> -->
    </div>

    <div ref="chatContainer" class="chat-container">
      <div class="chat-messages">
        <div
          v-for="message in messages"
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
              :src="message.isSent ? replaceUrlRegex(myInfo.avatar) : replaceUrlRegex(chat.avatar)" 
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
                  :src="replaceUrlRegex(message.content)" 
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
              {{ formatMessageTime(message.timestamp) }}
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
        <!-- <a-button type="text" shape="circle" class="tool-btn">
          <smile-outlined />
        </a-button> -->
                  <!-- multiple -->

        <a-upload
          :before-upload="beforeUpload"
          :show-upload-list="false"
          accept="image/*"
        >
          <a-button type="text" shape="circle" class="tool-btn">
            <PictureOutlined/>
          </a-button>
        </a-upload>
        <!-- <a-button type="text" shape="circle" class="tool-btn">
          <more-outlined />
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
import { ref, onMounted, nextTick,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  StartConversations,
  GetCurrentUserConversationMessages
}from '../api';

import {
  replaceUrlRegex,
  // removeEmptyProperties,
  // objectToString,
  // formatTime
} from '@/utils'

import {
  LeftOutlined,
  SearchOutlined,
  MoreOutlined,
  SmileOutlined,
  PictureOutlined ,
  SendOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const authStore = useAuthStore()

const defaultavatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
// 当前用户头像
// const currentUserAvatar = ref(defaultavatar);
const myInfo = ref({
  id: null,
  username: '',
  avatar: defaultavatar
});
// 聊天数据
const chatId = parseInt(router.currentRoute.value.params.id);
const newMessage = ref('');
const chatContainer = ref(null);
const previewVisible = ref(false);
const previewImageUrl = ref('');

// WebSocket 相关
const socket = ref(null);
const isConnected = ref(false);
const reconnectAttempts = ref(0);
const maxReconnectAttempts = 5;

// 上传的图片
const uploadedImages = ref([]);
const messages = ref([]);


// 聊天数据
const chat = ref({
  id: chatId,
  name: '第三',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
});

// });
// 修改初始化函数
const init = async () => {
    // 等待 API 调用完成
    const response = await StartConversations({
      other_user_id: chatId,
    });
    
    // 确保拿到数据后再继续执行
    const { data } = response;
    console.log('data21312', data);

    if(data.code=='01'){
    // 数据已准备好，开始赋值
          // chat.value = {
          //   name: data.data.participant2_info?.username || '未知用户',
          //   avatar: data.data.participant2_info?.avatar || defaultavatar,
          //   id: data.data.participant2_info?.id || null
          // };
          // console.log('chat', chat.value);

          // myInfo.value = {
          //   id: data.data.participant1_info?.id || null,
          //   username: data.data.participant1_info?.username || '',
          //   avatar: data.data.participant1_info?.avatar || defaultavatar  
          // };

          myInfo.value ={
            id: authStore.userInfo.id,
            username: authStore.userInfo.username,
            avatar: authStore.userInfo.avatar||defaultavatar
          }
          if(data.data.participant2_info?.id==authStore.userInfo.id){
              chat.value = {
                name: data.data.participant1_info?.username || '未知用户',
                avatar: data.data.participant1_info?.avatar || defaultavatar,
                id: data.data.participant1_info?.id || null
              };
          }else{
            chat.value = {
              name: data.data.participant2_info?.username || '未知用户',
              avatar: data.data.participant2_info?.avatar || defaultavatar,
              id: data.data.participant2_info?.id || null
            };
          }

          console.log('myInfo', myInfo.value);
          let ConversationId
          if (data.data.id) {
            ConversationId = data.data.id;
            console.log('ConversationId', ConversationId);
          }

            // // 连接 WebSocket
            connectWebSocket(ConversationId);

            // 加载历史消息
            const res = await GetCurrentUserConversationMessages(ConversationId);
            const expandedMessages = res.data.data.map((message) => ({
              ...message,
                isSent: message.sender === myInfo.value.id,
                type: message.message_type || 'text', // 使用服务器返回的消息类型
                content: message.message_type === 'image' ? (message.image_url || message.content) : message.content

            }));

            messages.value = expandedMessages;
            
    }
};

// 连接 WebSocket
const connectWebSocket = (conversationId) => {
  try {
    // 获取环境变量并清理协议部分
    let backendHost = import.meta.env.VITE_API_URL || 'localhost:8000';
    
    // 移除 http:// 或 https:// 前缀
    backendHost = backendHost.replace(/^http?:\/\//, '');
    
    // 确保没有尾随斜杠
    backendHost = backendHost.replace(/\/$/, '');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${backendHost}/ws/chat/${conversationId}/?token=${localStorage.getItem('token')}`;
    
    console.log('Connecting to WebSocket:', wsUrl);

    socket.value = new WebSocket(wsUrl);
    
    socket.value.onopen = () => {
      console.log('WebSocket connected');
      isConnected.value = true;
      reconnectAttempts.value = 0;
    };
    
    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };
    
    socket.value.onclose = (event) => {
      console.log('WebSocket disconnected');
      isConnected.value = false;
      
      // 自动重连
      if (reconnectAttempts.value < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.value++;
          connectWebSocket(conversationId);
        }, 3000);
      }
    };
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
  } catch (error) {
    console.error('WebSocket connection failed:', error);
  }
};

// 处理 WebSocket 消息
const handleWebSocketMessage = (data) => {
  console.log('收到WebSocket消息:', data);
  
  if (data.message) {
    handleNewMessage(data.message);
  } else {
    console.log('未知消息格式:', data);
  }
};

// 处理新消息
const handleNewMessage = (messageData) => {
  console.log('处理新消息:', messageData);
  
  const newMsg = {
    id: messageData.id || Date.now(),
    content: messageData.content || '',
    type: messageData.message_type || 'text',
    timestamp: messageData.timestamp || messageData.created_at || new Date().toISOString(),
    isSent: messageData.sender === myInfo.value.id,
    senderName: messageData.sender_info?.username || '',
    showName: messageData.sender !== myInfo.value.id,
    // 如果是图片消息，使用 image_url
    imageUrl: messageData.image_url || null
  };
  
  // 如果是图片消息，使用图片URL作为显示内容
  if (newMsg.type === 'image' && newMsg.imageUrl) {
    newMsg.content = newMsg.imageUrl;
  }
  
  console.log('构建的消息对象:', newMsg);
  
  // 检查是否已存在该消息
  const exists = messages.value.find(msg => msg.id === newMsg.id);
  if (!exists) {
    messages.value.push(newMsg);
    
    nextTick(() => {
      scrollToBottom();
    });
  }
};
// 格式化消息时间
const formatMessageTime = (time) => {
  console.log('time', time)
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
  previewImageUrl.value = replaceUrlRegex(imageUrl);
  previewVisible.value = true;
};

// 发送图片消息
const sendImageMessage = async () => {
  if (uploadedImages.value.length > 0) {
    for (const image of uploadedImages.value) {
      try {
        // 确保是纯base64数据，移除data URL前缀
        let imageData = image.url;
        if (imageData.includes(';base64,')) {
          // 如果是data URL格式，提取纯base64部分
          imageData = imageData.split(';base64,')[1];
        }
        
        const messageData = {
          type: 'image',
          image_data: imageData, // 纯base64数据
          file_name: image.name || `image_${Date.now()}`
        };
        
        console.log('发送图片消息:', messageData);
        
        socket.value.send(JSON.stringify(messageData));
        
        // // 本地立即显示图片消息（乐观更新）
        // const tempMsg = {
        //   id: Date.now(),
        //   content: image.url, // 使用原始URL用于预览
        //   type: 'image',
        //   timestamp: new Date().toISOString(),
        //   isSent: true,
        //   showName: false,
        //   senderName: myInfo.value.username
        // };
        
        // messages.value.push(tempMsg);
        
      } catch (error) {
        console.error('发送图片失败:', error);
        message.error('图片发送失败');
      }
    }
    uploadedImages.value = [];
    
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// 发送消息
const sendMessage = async () => {
  if (!isConnected.value) {
    message.error('连接已断开，请刷新页面重试');
    return;
  }
  // 先发送图片消息
    if (uploadedImages.value.length > 0) {
      await sendImageMessage();
    }

  // 发送文本消息
  if (newMessage.value.trim()) {
    const messageData = {
      type: 'text', // 添加消息类型
      content: newMessage.value.trim()
    };
    
    console.log('发送文本消息:', messageData);
    
    try {
      socket.value.send(JSON.stringify(messageData));
      
      // // 本地立即显示发送的消息（乐观更新）
      // const tempMsg = {
      //   id: Date.now(), // 临时ID，等服务器返回真实ID后会替换
      //   content: newMessage.value.trim(),
      //   type: 'text',
      //   timestamp: new Date().toISOString(),
      //   isSent: true,
      //   showName: false,
      //   senderName: myInfo.value.username
      // };
      
      // messages.value.push(tempMsg);
      newMessage.value = '';
      
      nextTick(() => {
        scrollToBottom();
      });
      
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送失败，请重试');
    }
  }


};

// // 发送消息
// const sendMessage = async () => {
//   if (!isConnected.value) {
//     message.error('连接已断开，请刷新页面重试');
//     return;
//   }

//   // 发送文本消息
//   if (newMessage.value.trim()) {
//     const messageData = {
//       type: 'text', // 添加消息类型
//       content: newMessage.value.trim()
//     };
    
//     console.log('发送文本消息:', messageData);
    
//     try {
//       socket.value.send(JSON.stringify(messageData));
      
//       // 本地立即显示发送的消息（乐观更新）
//       const tempMsg = {
//         id: Date.now(), // 临时ID，等服务器返回真实ID后会替换
//         content: newMessage.value.trim(),
//         type: 'text',
//         timestamp: new Date().toISOString(),
//         isSent: true,
//         showName: false,
//         senderName: myInfo.value.username
//       };
      
//       messages.value.push(tempMsg);
//       newMessage.value = '';
      
//       nextTick(() => {
//         scrollToBottom();
//       });
      
//     } catch (error) {
//       console.error('发送消息失败:', error);
//       message.error('发送失败，请重试');
//     }
//   }

//   // 发送图片消息
//   if (uploadedImages.value.length > 0) {
//     for (const image of uploadedImages.value) {
//       try {
//         // 直接发送base64图片数据
//         const messageData = {
//           type: 'image',
//           image_data: image.url, // base64数据
//           file_name: image.name || `image_${Date.now()}`
//         };
        
//         console.log('发送图片消息:', messageData);
        
//         socket.value.send(JSON.stringify(messageData));
        
//         // 本地立即显示图片消息（乐观更新）
//         const tempMsg = {
//           id: Date.now(),
//           content: image.url,
//           type: 'image',
//           timestamp: new Date().toISOString(),
//           isSent: true,
//           showName: false,
//           senderName: myInfo.value.username
//         };
        
//         messages.value.push(tempMsg);
        
//       } catch (error) {
//         console.error('发送图片失败:', error);
//         message.error('图片发送失败');
//       }
//     }
//     uploadedImages.value = [];
    
//     nextTick(() => {
//       scrollToBottom();
//     });
//   }
// };

// 发送输入状态
// const sendTypingStatus = (isTyping) => {
//   if (socket.value && isConnected.value) {
//     const typingData = {
//       type: 'typing',
//       is_typing: isTyping
//     };
//     socket.value.send(JSON.stringify(typingData));
//   }
// };

// // 监听输入框变化
// const onInputChange = () => {
//   // 防抖处理输入状态
//   clearTimeout(typingTimer);
//   if (newMessage.value.trim()) {
//     sendTypingStatus(true);
//     typingTimer = setTimeout(() => {
//       sendTypingStatus(false);
//     }, 1000);
//   } else {
//     sendTypingStatus(false);
//   }
// };

// let typingTimer = null;

// // 图片上传函数
// const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append('image', file);
  
//   try {
//     const response = await fetch('/api/upload/image/', {
//       method: 'POST',
//       body: formData,
//     });
    
//     const data = await response.json();
//     return data.url;
//   } catch (error) {
//     console.error('图片上传失败:', error);
//     throw error;
//   }
// };

// 组件卸载时关闭连接
onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});


// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 初始化
onMounted(() => {
  // loadChatData();
  init();
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
  justify-content: space-between; /* 关键：左右分布 */
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  flex-shrink: 0; /* 防止压缩 */
}

.back-button :deep(.anticon) {
  font-size: 16px;
  margin-right: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center; /* 用户信息居中 */
  margin: 0 16px;
}

.user-info .name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 防止压缩 */
}

.connection-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap; /* 防止文字换行 */
}

.connection-status.connected {
  background: #52c41a;
  color: white;
}

.connection-status.disconnected {
  background: #faad14;
  color: white;
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