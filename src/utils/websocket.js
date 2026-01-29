// services/websocket.js
import { useMessageStore } from '@/stores/messageStore';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageStore = null;
  }

  connect(userId) {
    if (!userId) {
      console.error('用户ID为空，无法连接WebSocket');
      return;
    }

    this.messageStore = useMessageStore();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/`;

    console.log('正在连接WebSocket:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket 连接成功');
      this.reconnectAttempts = 0;
      this.subscribeToNotifications(userId);
    };

    this.socket.onmessage = (event) => {
      console.log('收到WebSocket消息:', event.data);
      this.handleMessage(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket 连接关闭:', event.code, event.reason);
      this.handleReconnect(userId);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };
  }

  subscribeToNotifications(userId) {
    const message = {
      type: 'subscribe_notifications',
      user_id: userId,
    };
    this.sendMessage(message);
  }

  handleMessage(data) {
    const { type, event, message, is_reminder, data: eventData } = data;

    switch (type) {
      case 'chat_message':
        if (is_reminder) {
          this.messageStore.handleNewMessage(message);
        } else {
          console.log('普通聊天消息:', message);
        }
        break;

      case 'notification_event':
        this.handleNotificationEvent(event, eventData);
        break;

      default:
        console.log('未知消息类型:', type, data);
    }
  }

  handleNotificationEvent(event, data) {
    switch (event) {
      case 'new_message':
        this.messageStore.handleNewMessage(data);
        break;
      default:
        console.log('未知事件类型:', event);
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket 未连接，无法发送消息');
    }
  }

  handleReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = 3000 * this.reconnectAttempts;
      console.log(
        `${delay}ms后尝试重新连接... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => {
        this.connect(userId);
      }, delay);
    } else {
      console.error('达到最大重连次数，停止重连');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getStatus() {
    if (!this.socket) return 'disconnected';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}

export default new WebSocketService();
