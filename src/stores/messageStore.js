// stores/messageStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GetMyAllConversations } from '@/api';
import { useAuthStore } from '@/stores/auth';

export const useMessageStore = defineStore('message', () => {
  const authStore = useAuthStore();
  const defaultavatar = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
  
  // 状态
  const conversations = ref(new Map());
  const currentConversationId = ref(null);
  const unreadCounts = ref(new Map());
  const notifications = ref([]);
  const loading = ref(false);

  // 计算属性
  const totalUnread = computed(() => {
    let total = 0;
    for (let count of unreadCounts.value.values()) {
      total += count;
    }
    return total;
  });

  const conversationList = computed(() => {
    return Array.from(conversations.value.values()).sort((a, b) => 
      new Date(b.lastTime) - new Date(a.lastTime)
    );
  });

  // 方法
  function setConversation(conversation) {
    conversations.value.set(conversation.id, conversation);
    if (!unreadCounts.value.has(conversation.id)) {
      unreadCounts.value.set(conversation.id, conversation.unreadCount || 0);
    }
  }

  function updateConversationUnread(conversationId, count) {
    unreadCounts.value.set(conversationId, count);
    updatePageTitle();
  }

  function markConversationAsRead(conversationId) {
    unreadCounts.value.set(conversationId, 0);
    updatePageTitle();
    markAsReadOnServer(conversationId);
  }

  function handleNewMessage(data) {
    const { message, conversation_unread_count, conversation_id } = data;
    
    // 更新会话未读数量
    updateConversationUnread(conversation_id, conversation_unread_count);
    
    // 如果当前不在这个会话中，显示通知
    if (currentConversationId.value !== conversation_id) {
      showNotification(message, conversation_id);
    }
  }

  function showNotification(message, conversationId) {
    const conversation = conversations.value.get(conversationId);
    const conversationName = conversation?.name || `用户 ${conversationId}`;
    
    // 浏览器通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${conversationName} - 新消息`, {
        body: `${message.sender?.username}：${message.content}`,
        icon: message.sender?.avatar || defaultavatar,
        tag: `conversation_${conversationId}`
      });
    }
    
    // 应用内通知
    showInAppNotification(message, conversationId, conversationName);
  }

  function showInAppNotification(message, conversationId, conversationName) {
    const notification = {
      id: Date.now(),
      conversationId,
      conversationName,
      message,
      unreadCount: unreadCounts.value.get(conversationId) || 0
    };
    
    notifications.value.push(notification);
    
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }

  function removeNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function switchToConversation(conversationId) {
    currentConversationId.value = conversationId;
    markConversationAsRead(conversationId);
    removeNotificationsForConversation(conversationId);
  }

  function removeNotificationsForConversation(conversationId) {
    notifications.value = notifications.value.filter(
      n => n.conversationId !== conversationId
    );
  }

  function updatePageTitle() {
    if (totalUnread.value > 0) {
      document.title = `(${totalUnread.value}) 二手交易平台`;
    } else {
      document.title = '二手交易平台';
    }
  }

  async function markAsReadOnServer(conversationId) {
    try {
      // 这里调用您的标记已读API
      console.log('标记会话为已读:', conversationId);
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  }

  // 加载会话列表 - 基于您现有的 loadChats 逻辑
  async function loadConversations() {
    loading.value = true;
    try {
      const { data } = await GetMyAllConversations();
      console.log("加载会话数据:", data);
      
      // 清空现有会话
      conversations.value.clear();
      unreadCounts.value.clear();
      
      data.results.forEach(item => {
        if (item.participant2_info.id === authStore.userInfo.id) {
          // 对方是自己不显示
          return;
        }
        
        const conversation = {
          id: item.participant2_info.id, // 使用对方用户ID作为会话ID
          conversationId: item.id, // 实际会话ID
          name: item.participant2_info.username,
          avatar: item.participant2_info.avatar || defaultavatar,
          lastMessage: item.last_message?.content || '暂无消息',
          lastTime: item.last_message?.timestamp || '',
          unreadCount: item.unread_count || 0,
          participant1: item.participant1_info,
          participant2: item.participant2_info
        };
        
        setConversation(conversation);
        updateConversationUnread(conversation.id, conversation.unreadCount);
      });
    } catch (error) {
      console.error('加载会话列表失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    // 状态
    conversations,
    currentConversationId,
    unreadCounts,
    notifications,
    loading,
    
    // 计算属性
    totalUnread,
    conversationList,
    
    // 方法
    setConversation,
    updateConversationUnread,
    markConversationAsRead,
    handleNewMessage,
    switchToConversation,
    removeNotification,
    loadConversations
  };
});``