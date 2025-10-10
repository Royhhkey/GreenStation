<!-- ChatWindow.vue -->
<template>
  <div class="chat-page" @click="closeContextMenu">
    <ChatHeader 
      :chat="chat" 
      :is-connected="isConnected" 
      @back-to-list="backToList" 
    />
    
    <div ref="chatContainer" class="chat-container">
      <div class="chat-messages">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :my-avatar="myInfo.avatar"
          :chat-avatar="chat.avatar"
          :chat-name="chat.name"
          :can-withdraw="canWithdraw"
          @right-click="(event) => handleRightClick(event, message)"
          @touch-start="(event) => handleTouchStart(event, message)"
          @touch-end="handleTouchEnd"
          @preview-image="previewImage"
          @withdraw="() => withdrawMessage(message)"
          @copy="() => copyMessage(message)"
        />
        
        <MessageContextMenu
          :show-context-menu="showContextMenu"
          :context-menu-style="contextMenuStyle"
          :message="contextMenuMessage"
          :can-withdraw="canWithdraw"
          @withdraw="() => withdrawMessage(contextMenuMessage)"
          @copy="() => copyMessage(contextMenuMessage)"
          @close="closeContextMenu"
        />
      </div>
    </div>
    
    <ImagePreview
      :preview-visible="previewVisible"
      :preview-image-url="previewImageUrl"
      @update:preview-visible="previewVisible = $event"
    />
    
    <ChatInput
      :uploaded-images="uploadedImages"
      @send-message="sendMessage"
      @remove-image="removeImage"
      @before-upload="beforeUpload"
    />
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
} from '@/api';
import { useAuthStore } from '@/stores/auth';
import { replaceUrlRegex } from '@/utils';
import ChatHeader from './ChatHeader.vue';
import MessageBubble from './MessageBubble.vue';
import MessageContextMenu from './MessageContextMenu.vue';
import ImagePreview from './ImagePreview.vue';
import ChatInput from './ChatInput.vue';

const router = useRouter();
const authStore = useAuthStore();

const defaultavatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
const myInfo = ref({
  id: null,
  username: '',
  avatar: defaultavatar
});

// 聊天数据
const chatId = parseInt(router.currentRoute.value.params.id);
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
        messages.value[index] = {
          ...messages.value[index],
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

// 初始化函数
const init = async () => {
  const response = await StartConversations({
    other_user_id: chatId,
  });
  
  const { data } = response;

  if(data.code=='01'){
    myInfo.value = {
      id: authStore.userInfo.id,
      username: authStore.userInfo.username,
      avatar: authStore.userInfo.avatar || defaultavatar
    }
    
    if(data.data.participant2_info?.id == authStore.userInfo.id){
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

    let ConversationId;
    if (data.data.id) {
      ConversationId = data.data.id;
      currentConversationId.value = ConversationId;
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
    
    // console.log('Connecting to WebSocket:', wsUrl);

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
const sendMessage = async (content) => {
  if (!isConnected.value) {
    antMessage.error('连接已断开，请刷新页面重试');
    return;
  }
  
  if (uploadedImages.value.length > 0) {
    await sendImageMessage();
  }

  if (content) {
    const messageData = {
      type: 'text',
      content: content
    };
    
    console.log('发送文本消息:', messageData);
    
    try {
      socket.value.send(JSON.stringify(messageData));
      
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
</style>