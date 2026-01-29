<!-- MessageBubble.vue -->
<template>
  <div
    class="message-bubble"
    :class="{
      'message-sent': message.isSent,
      'message-received': !message.isSent,
      'message-withdrawn': message.is_withdrawn,
    }"
    @contextmenu="handleRightClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <!-- 所有消息都显示头像 -->
    <div class="message-avatar">
      <img
        :src="
          message.isSent
            ? replaceUrlRegex(myAvatar)
            : replaceUrlRegex(chatAvatar)
        "
        :alt="message.isSent ? '我' : chatName"
      />
    </div>

    <div class="message-content-wrapper">
      <!-- 昵称显示 -->
      <div v-if="message.showName" class="message-sender">
        {{ message.senderName || (message.isSent ? '我' : chatName) }}
      </div>

      <div
        class="message-content"
        :class="{ 'image-content': message.type === 'image' }"
      >
        <!-- 文本消息 -->
        <div v-if="message.type === 'text'" class="message-text">
          {{ message.content }}
        </div>

        <!-- 图片消息 -->
        <div v-else-if="message.type === 'image'" class="message-image">
          <img
            :src="replaceUrlRegex(message.content)"
            :alt="message.alt || '图片'"
            @click="previewImage"
          />
        </div>
      </div>

      <!-- 消息状态和时间 -->
      <div class="message-status">
        <div class="message-time">
          {{ formatMessageTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlRegex } from '@/utils';

const props = defineProps({
  message: Object,
  myAvatar: String,
  chatAvatar: String,
  chatName: String,
});

const emit = defineEmits([
  'rightClick',
  'touchStart',
  'touchEnd',
  'previewImage',
]);

const handleRightClick = (event) => {
  emit('rightClick', event);
};

const handleTouchStart = (event) => {
  emit('touchStart', event);
};

const handleTouchEnd = (event) => {
  emit('touchEnd', event);
};

const previewImage = () => {
  if (props.message.type === 'image') {
    emit('previewImage', props.message.content);
  }
};

const formatMessageTime = (time) => {
  const messageTime = new Date(time);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    messageTime.getFullYear(),
    messageTime.getMonth(),
    messageTime.getDate(),
  );

  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return messageTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (diffDays === 1) {
    return `昨天 ${messageTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else {
    return messageTime.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};
</script>

<style scoped>
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

@media (max-width: 768px) {
  .message-bubble {
    max-width: 90%;
  }

  .message-content.image-content {
    max-width: 180px;
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
