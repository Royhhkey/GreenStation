<!-- components/profile/ProfileHeader.vue -->
<template>
  <div class="profile-header">
    <div class="header-bg"></div>
    <div class="avatar-section">
      <div class="avatar-container">
        <img
          :src="avatarUrl"
          alt="用户头像"
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="edit-avatar-btn" @click="editAvatar">
          <EditOutlined />
        </div>
      </div>
      <div class="user-info">
        <h2 class="username">{{ userInfo.username }}</h2>
        <p class="user-id">ID: {{ userInfo.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  userInfo: Object,
  avatarPreview: String,
});

const emit = defineEmits(['editAvatar']);

const avatarUrl = computed(() => {
  return (
    props.avatarPreview ||
    props.userInfo?.avatar ||
    'https://eo-oss.roy22.xyz/secondHand/avatar.png'
  );
});

const editAvatar = () => {
  emit('editAvatar');
};

const handleAvatarError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
};
</script>

<style scoped>
.profile-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 20px 60px;
  color: white;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.avatar-section {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
}

.avatar-container {
  position: relative;
  margin-bottom: -30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  background: white;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.edit-avatar-btn:hover {
  background: #40a9ff;
  transform: scale(1.1);
}

.user-info {
  flex: 1;
  padding-bottom: 20px;
}

.username {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-id {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 100px 16px 50px;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    margin-bottom: 0;
  }

  .avatar-container {
    margin-bottom: 0;
  }

  .user-info {
    padding-bottom: 0;
  }

  .username {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 80px 12px 40px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .username {
    font-size: 20px;
  }
}
</style>
