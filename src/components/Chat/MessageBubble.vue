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
  max-width: 75%;
  gap: 8px;
  transition: var(--transition-fast);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.message-bubble:active {
  background-color: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
}

.message-sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-received {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--theme-surfaceBackground);
  border: 2px solid var(--theme-borderLight);
  box-shadow: var(--theme-shadow);
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
  cursor: pointer;
}

.message-sender {
  font-size: 12px;
  color: var(--theme-textSecondary);
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

.message-content:not(.image-content) {
  background: var(--theme-cardBackground);
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-shadow);
  max-width: 100%;
  transition: var(--transition-fast);
}

.message-sent .message-content:not(.image-content) {
  background: var(--theme-primary);
  border-bottom-right-radius: var(--radius-sm);
}

.message-sent .message-content:not(.image-content):hover {
  background: var(--theme-primaryHover);
  box-shadow: var(--theme-shadowMedium);
}

.message-received .message-content:not(.image-content) {
  border-bottom-left-radius: var(--radius-sm);
  background: var(--theme-cardBackground);
}

.message-received .message-content:not(.image-content):hover {
  box-shadow: var(--theme-shadowMedium);
}

.message-content.image-content {
  background: transparent;
  padding: 0;
  box-shadow: none;
  max-width: 200px;
}

.message-text {
  margin-bottom: 0;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 14px;
  color: white;
}

.message-received .message-text {
  color: var(--theme-textPrimary);
}

.message-image {
  position: relative;
  display: inline-block;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--theme-shadow);
}

.message-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  display: block;
}

.message-image img:hover {
  transform: scale(1.02);
  box-shadow: var(--theme-shadowHeavy);
}

.message-withdrawn .message-text {
  color: var(--theme-textTertiary) !important;
  font-style: italic;
}

.message-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
}

.message-time {
  font-size: 11px;
  color: var(--theme-textTertiary);
}

@media (min-width: 768px) {
  .message-bubble {
    max-width: 65%;
    gap: 12px;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
  }

  .message-content:not(.image-content) {
    padding: 12px 16px;
  }

  .message-text {
    font-size: 15px;
  }

  .message-content.image-content {
    max-width: 250px;
  }

  .message-image img {
    max-height: 250px;
  }
}
</style>
