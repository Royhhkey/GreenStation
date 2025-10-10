// stores/messageStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GetMyAllConversations } from '@/api';
import { GetAllUnreadMessagesCounts } from '@/api';
// import { useAuthStore } from './auth';
// import { useRouter } from "vue-router";

const authStore = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;



export const useMessageStore = defineStore('message', () => {
  const conversations = ref([]);
  const totalUnread = ref(0);
  const notifications = ref([]);
  
  // 计算总未读消息数
  const calculateTotalUnread = () => {
    // console.log('calculateTotalUnread');
    totalUnread.value = conversations.value.reduce((total, conv) => total + conv.unreadCount, 0);

    console.log('totalUnread:', totalUnread.value);
  };

  
  
  // 加载所有会话
  const loadConversations = async () => {
    // if(localStorage.getItem('conversations')){
    //    conversations.value = JSON.parse(localStorage.getItem('conversations'));
    //    totalUnread.value = JSON.parse(localStorage.getItem('totalUnread'));
    //    notifications.value = JSON.parse(localStorage.getItem('notifications'));
    //    return ;
    // }
    try {
      const response = await GetMyAllConversations();
      console.log('authStore', authStore)
      conversations.value = response.data.results.map(item => {
        // 根据你的业务逻辑处理参与者信息
        if (item.participant2_info?.id === authStore?.id) {
          return {
            id: item.participant1_info?.id,
            name: item.participant1_info?.username,
            avatar: item.participant1_info?.avatar || 'https://eo-oss.roy22.xyz/secondHand/avatar.png',
            lastMessage: item.last_message?.content || '暂无消息',
            lastTime: item.last_message?.timestamp || '',
            unreadCount: item.unread_count || 0,
            conversationId: item.id
          };
        }
        return {
          id: item.participant2_info?.id,
          name: item.participant2_info?.username,
          avatar: item.participant2_info?.avatar || 'https://eo-oss.roy22.xyz/secondHand/avatar.png',
          lastMessage: item.last_message?.content || '暂无消息',
          lastTime: item.last_message?.timestamp || '',
          unreadCount: item.unread_count || 0,
          conversationId: item.id
        };
      });
      calculateTotalUnread();
      localStorage.setItem('conversations', JSON.stringify(conversations.value));
      localStorage.setItem('totalUnread', JSON.stringify(totalUnread.value));
      localStorage.setItem('notifications', JSON.stringify(notifications.value));
    } catch (error) {
      console.error('加载会话列表失败:', error);
    }
  };

// 获取未读消息数
  const getUnreadMessagesCounts = async () => {
    try {
      const {data} = await GetAllUnreadMessagesCounts();
            // console.log('res', data)

      if (data.code === '01') {
        // console.log('res', res)
        totalUnread.value = data.unread_count || 0;
      }
    } catch (error) {
      console.error('获取未读消息数失败:', error);
    }
  };
  
  // 更新会话的最新消息
  const updateConversationLastMessage = (conversationId, message, timestamp) => {
    console.log('updateConversationLastMessage213123123', conversationId, message, timestamp)
    console.log('conversations.value', conversations.value);
    const conversation = conversations.value.find((conv) => {
      // console.log('11111', conv);
      console.log('22222', conversationId);
      console.log('33333', conv.conversationId);
      
      console.log('44444', conv.conversationId == conversationId);

      return conv.conversationId == conversationId; // 返回布尔值
    });

    // console.log('213123123', conversations)
    console.log('updateConversationLastMessage', conversation)

    if (conversation) {
      // console.log('updateConversatio213213123', conversation)
      // console.log('updateConversationLastMessage', conversationId, message, timestamp)
      conversation.lastMessage = message;
      conversation.lastTime = timestamp;
      // 如果不在当前聊天页面，增加未读计数
      if (!isCurrentConversation(2222)) {
        conversation.unreadCount += 1;
      }
      // console.log("Roy321312321")
      // console.log('updateConversationLastMessage', conversation)
      // calculateTotalUnread();
    }
    localStorage.setItem('conversations', JSON.stringify(conversations.value));
    localStorage.setItem('totalUnread', JSON.stringify(totalUnread.value));
    // localStorage.setItem('notifications', JSON.stringify(notifications.value));
  };
  
  // 标记会话为已读
  const markConversationAsRead = (conversationId) => {
    const conversation = conversations.value.find(conv => conv.conversationId === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      calculateTotalUnread();
    }
  };
  
  // 检查是否为当前会话（需要根据实际路由判断）
  const isCurrentConversation = (id) => {
    // const router = useRouter();
    // console.log('router', router)
    // if(router.currentRoute.value.params.id==null)
    //   return false;
    // return router.currentRoute.value.params.id == id;
    // // 这里需要根据你的路由逻辑来判断
    // // 例如：return router.currentRoute.value.params.id == conversationId;
    return false;
  };
  
  // 添加通知
  const addNotification = (notification) => {
    notifications.value.push(notification);
    // console.log('addNotification21312213', notification)
    updateConversationLastMessage(notification.conversation_id, notification.message.content, notification.message.timestamp)
    calculateTotalUnread();
  };
  
  // 移除通知
  const removeNotification = (notificationId) => {
    notifications.value = notifications.value.filter(n => n.id !== notificationId);
  };
  
  return {
    conversations,
    totalUnread,
    notifications,
    loadConversations,
    updateConversationLastMessage,
    markConversationAsRead,
    getUnreadMessagesCounts,
    addNotification,
    removeNotification,
    calculateTotalUnread
  };
});