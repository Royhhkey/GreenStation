<template>
  <div class="chat-page" @click="closeContextMenu">
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
        <div class="user-info">
          <div class="name">{{ chat.name }}</div>
        </div>
      </div>
    </div>

    <div ref="chatContainer" class="chat-container">
      <div class="chat-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-bubble"
          :class="{
            'message-sent': message.isSent,
            'message-received': !message.isSent,
            'message-withdrawn': message.is_withdrawn
          }"
          @contextmenu="handleRightClick($event, message)"
          @touchstart="handleTouchStart($event, message)"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
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
              <!-- 已撤回的消息 -->
              <!-- <div v-if="message.is_withdrawn" class="withdrawn-message">
                <exclamation-circle-outlined />
                <span>消息已撤回</span>
              </div>
               -->
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
              </div>
            </div>
            
            <!-- 消息状态和时间 -->
            <div class="message-status">
              <div class="message-time">
                {{ formatMessageTime(message.timestamp) }}
              </div>
              <div v-if="message.isSent && !message.is_withdrawn" class="message-actions">
                <a-dropdown :trigger="['click']" placement="topLeft">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="withdrawMessage(message)" v-if="canWithdraw(message)">
                        <span>撤回</span>
                      </a-menu-item>
                      <a-menu-item @click="copyMessage(message)">
                        <span>复制</span>
                      </a-menu-item>
                      <!-- <a-menu-item @click="deleteMessage(message)">
                        <span>删除</span>
                      </a-menu-item> -->
                    </a-menu>
                  </template>
                  <more-outlined class="action-icon" />
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右键菜单 -->
        <div v-if="showContextMenu" 
             class="message-context-menu"
             :style="contextMenuStyle"
             @click.stop>
          <div class="menu-item" @click="withdrawMessage(contextMenuMessage)" v-if="canWithdraw(contextMenuMessage)">
            <undo-outlined />
            <span>撤回消息</span>
          </div>
          <div class="menu-item" @click="copyMessage(contextMenuMessage)">
            <copy-outlined />
            <span>复制</span>
          </div>
          <!-- <div class="menu-item" @click="deleteMessage(contextMenuMessage)" v-if="canDelete(contextMenuMessage)">
            <delete-outlined />
            <span>删除</span>
          </div> -->
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
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message as antMessage } from 'ant-design-vue';
import {
  StartConversations,
  GetCurrentUserConversationMessages,
  WithdrawMessage
} from '../api';

import {
  replaceUrlRegex,
} from '@/utils'

import {
  LeftOutlined,
  PictureOutlined,
  SendOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  UndoOutlined,
  CopyOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const authStore = useAuthStore()

const defaultavatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
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
const currentConversationId = ref(null);

// 撤回相关状态
const showContextMenu = ref(false);
const contextMenuMessage = ref({});
const contextMenuStyle = ref({});


// 添加长按相关状态
const longPressTimer = ref(null);
const isLongPressing = ref(false);
const longPressMessage = ref(null);

// 聊天数据
const chat = ref({
  id: chatId,
  name: '用户',
  avatar: defaultavatar,
});

// 检查消息是否可以撤回
const canWithdraw = (message) => {
  if (!message.isSent || message.is_withdrawn) return false;
  
  // 5分钟内可撤回
  const messageTime = new Date(message.timestamp);
  const now = new Date();
  const diffMinutes = (now - messageTime) / (1000 * 60);
  return diffMinutes <= 5;
};

// // 检查消息是否可以删除
// const canDelete = (message) => {
//   return message.isSent;
// };


// 长按开始处理
const handleTouchStart = (event, message) => {
  // 阻止默认行为，避免触发浏览器默认的长按菜单
  event.preventDefault();
  
  longPressMessage.value = message;
  isLongPressing.value = false;
  
  // 设置长按计时器
  longPressTimer.value = setTimeout(() => {
    isLongPressing.value = true;
    showContextMenuForMessage(message, event);
  }, 500); // 500毫秒后触发长按菜单
};

// 长按结束处理
const handleTouchEnd = () => {
  // 清除计时器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  
  // 如果是长按操作，阻止后续的点击事件
  if (isLongPressing.value) {
    isLongPressing.value = false;
    // 阻止后续的点击事件
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
      if (this.type === 'click' || this.type === 'touchend') {
        return;
      }
      originalPreventDefault.call(this);
    };
    
    setTimeout(() => {
      Event.prototype.preventDefault = originalPreventDefault;
    }, 100);
  }
};

// 显示消息菜单的通用函数
const showContextMenuForMessage = (message, event) => {
  contextMenuMessage.value = message;
  showContextMenu.value = true;
  
  // 计算菜单位置
  let clientX, clientY;
  
  if (event.type.includes('touch')) {
    // 触摸事件
    const touch = event.touches[0] || event.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    // 鼠标事件
    clientX = event.clientX;
    clientY = event.clientY;
  }
  clientX = clientX-40;
  clientY = clientY+30;
  
  contextMenuStyle.value = {
    left: `${clientX}px`,
    top: `${clientY}px`
  };
};

// // 右键菜单
// const handleRightClick = (event, message) => {
//   event.preventDefault();
//   contextMenuMessage.value = message;
//   showContextMenu.value = true;
//   contextMenuStyle.value = {
//     left: `${event.clientX}px`,
//     top: `${event.clientY}px`
//   };
// };

// 修改原有的右键处理函数，使用通用函数
const handleRightClick = (event, message) => {
  event.preventDefault();
  showContextMenuForMessage(message, event);
};

// 关闭右键菜单
const closeContextMenu = () => {
  showContextMenu.value = false;
};

// 撤回消息
const withdrawMessage = async (message) => {
  try {
    const response = await WithdrawMessage(message.id);
    if (response.data.code === '01') {
      // 更新本地消息状态
      const index = messages.value.findIndex(m => m.id === message.id);
      if (index !== -1) {
        // const isImage = message.type === 'image';
        messages.value[index] = {
          ...messages.value[index],
          // is_withdrawn: true,
          message_type :'text',
          type: 'text',
          content: '[消息已撤回]',
          original_content: messages.value[index].content
        };
      }
      console.log('messages:', messages.value);
      antMessage.success('消息已撤回');
    } else {
      antMessage.error(response.data.error || '撤回失败');
    }
  } catch (error) {
    console.error('撤回消息失败:', error);
    antMessage.error('撤回失败');
  } finally {
    closeContextMenu();
  }
};

// 复制消息
const copyMessage = async (message) => {
  try {
    await navigator.clipboard.writeText(message.content);
    antMessage.success('已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    antMessage.error('复制失败');
  } finally {
    closeContextMenu();
  }
};

// // 删除消息
// const deleteMessage = async (message) => {
//   try {
//     // 从本地列表中移除
//     messages.value = messages.value.filter(m => m.id !== message.id);
//     antMessage.success('消息已删除');
//   } catch (error) {
//     console.error('删除消息失败:', error);
//     antMessage.error('删除失败');
//   } finally {
//     closeContextMenu();
//   }
// };

// 初始化函数
const init = async () => {
  const response = await StartConversations({
    other_user_id: chatId,
  });
  
  const { data } = response;

  if(data.code=='01'){
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

    let ConversationId
    if (data.data.id) {
      ConversationId = data.data.id;
      currentConversationId.value = ConversationId
    }

    // 连接 WebSocket
    connectWebSocket(ConversationId);

    // 加载历史消息
    const res = await GetCurrentUserConversationMessages(ConversationId);
    const expandedMessages = res.data.data.map((message) => ({
      ...message,
      isSent: message.sender === myInfo.value.id,
      type: message.message_type || 'text',
      content: message.message_type === 'image' ? (message.image_url || message.content) : message.content,
      timestamp: message.created_at || message.timestamp,
      is_withdrawn: message.is_withdrawn || false
    }));

    messages.value = expandedMessages;
    scrollToBottom();
  }
};

// 连接 WebSocket
const connectWebSocket = (conversationId) => {
  try {
    let backendHost = import.meta.env.VITE_API_URL || 'localhost:8000';
    backendHost = backendHost.replace(/^http?:\/\//, '');
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
  } else if (data.message_withdrawn) {
    // 处理消息撤回通知
    handleMessageWithdrawn(data.message_withdrawn);
  } else {
    console.log('未知消息格式:', data);
  }
};

// 处理新消息
const handleNewMessage = (messageData) => {
  const newMsg = {
    id: messageData.id || Date.now(),
    content: messageData.content || '',
    type: messageData.message_type || 'text',
    timestamp: messageData.timestamp || messageData.created_at || new Date().toISOString(),
    isSent: messageData.sender === myInfo.value.id,
    senderName: messageData.sender_info?.username || '',
    showName: messageData.sender !== myInfo.value.id,
    is_withdrawn: messageData.is_withdrawn || false,
    imageUrl: messageData.image_url || null
  };
  
  if (newMsg.type === 'image' && newMsg.imageUrl) {
    newMsg.content = newMsg.imageUrl;
  }
  
  // 检查是否已存在该消息
  const exists = messages.value.find(msg => msg.id === newMsg.id);
  if (!exists) {
    messages.value.push(newMsg);
    
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// 处理消息撤回
const handleMessageWithdrawn = (messageData) => {
  const index = messages.value.findIndex(m => m.id === messageData.id);
  if (index !== -1) {
    messages.value[index] = {
      ...messages.value[index],
      is_withdrawn: true,
      content: '[消息已撤回]',
      original_content: messages.value[index].content
    };
  }
};

// 格式化消息时间
const formatMessageTime = (time) => {
  const messageTime = new Date(time);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(messageTime.getFullYear(), messageTime.getMonth(), messageTime.getDate());
  
  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return messageTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffDays === 1) {
    return `昨天 ${messageTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  } else {
    return messageTime.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// 返回消息列表
const backToList = async () => {
  await markMessagesAsRead();
  router.push('/home/messages');
};

// 图片上传前的处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    antMessage.error('只能上传图片文件!');
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    antMessage.error('图片大小不能超过5MB!');
    return false;
  }

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
        let imageData = image.url;
        if (imageData.includes(';base64,')) {
          imageData = imageData.split(';base64,')[1];
        }
        
        const messageData = {
          type: 'image',
          image_data: imageData,
          file_name: image.name || `image_${Date.now()}`
        };
        
        console.log('发送图片消息:', messageData);
        socket.value.send(JSON.stringify(messageData));
        
      } catch (error) {
        console.error('发送图片失败:', error);
        antMessage.error('图片发送失败');
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
    antMessage.error('连接已断开，请刷新页面重试');
    return;
  }
  
  if (uploadedImages.value.length > 0) {
    await sendImageMessage();
  }

  if (newMessage.value.trim()) {
    const messageData = {
      type: 'text',
      content: newMessage.value.trim()
    };
    
    console.log('发送文本消息:', messageData);
    
    try {
      socket.value.send(JSON.stringify(messageData));
      newMessage.value = '';
      
      nextTick(() => {
        scrollToBottom();
      });
      
    } catch (error) {
      console.error('发送消息失败:', error);
      antMessage.error('发送失败，请重试');
    }
  }
};

// 滚动到底部
const scrollToBottom = async() => {
  if (chatContainer.value) {
    await nextTick();
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 标记会话消息为已读
const markMessagesAsRead = async () => {
  if (currentConversationId.value) {
    try {
      await GetCurrentUserConversationMessages(currentConversationId.value);
      console.log('会话消息已标记为已读');
    } catch (error) {
      console.error('标记消息已读失败:', error);
    }
  }
};

// 组件卸载时关闭连接
// onUnmounted(() => {
//   if (socket.value) {
//     socket.value.close();
//   }
// });

onUnmounted(() => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
  }
  if (socket.value) {
    socket.value.close();
  }
});

// 初始化
onMounted(() => {
  init();
});
</script>



<style scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
}

.chat-header {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.back-button :deep(.anticon) {
  font-size: 16px;
  margin-right: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 16px;
}

.user-info .name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.user-info{
  position: relative;
  right: 20px;
}

.head-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.connection-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
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
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  background: #f0f0f0;
}

.chat-user-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  padding-bottom: 100px;
  background: #f5f5f5;
  position: relative;
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
  border-radius: 50%;
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
  position: relative;
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

/* 图片消息内容 */
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

/* 已撤回消息样式 */
.withdrawn-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
}

.message-withdrawn .message-text {
  color: #999 !important;
  font-style: italic;
}

/* 消息状态区域 */
.message-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.message-bubble:hover .message-actions {
  opacity: 1;
}

.action-icon {
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  font-size: 12px;
}

.action-icon:hover {
  background: #f0f0f0;
  color: #666;
}

/* 右键菜单 */
.message-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 140px;
  padding: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  color: #333;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.menu-item :deep(.anticon) {
  font-size: 12px;
}

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
  
  .message-actions {
    opacity: 1;
  }
  
  .message-context-menu {
    min-width: 120px;
  }
  
  .menu-item {
    padding: 10px 12px;
    font-size: 13px;
  }
}

.message-bubble {
  /* 添加长按反馈 */
  transition: background-color 0.2s;
}

.message-bubble:active {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

/* 为移动端优化菜单样式 */
@media (max-width: 768px) {
  .message-context-menu {
    min-width: 160px;
    font-size: 16px; /* 移动端字体稍大 */
  }
  
  .menu-item {
    padding: 12px 16px;
    font-size: 16px;
  }
  
  /* 为移动端添加更大的点击区域 */
  .message-avatar,
  .message-content-wrapper {
    cursor: pointer;
  }
}

/* 防止文本选择 */
.message-bubble {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>