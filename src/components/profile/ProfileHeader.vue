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
/* Profile Header - Theme-aware Design */
.profile-header {
  position: relative;
  background: var(--theme-gradient);
  padding: 7.5rem var(--spacing-lg) 3.75rem;
  color: white;
  transition: all var(--transition-normal);
}

.header-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: background var(--transition-normal);
}

.avatar-section {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xl);
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
  border-radius: var(--radius-full);
  border: 4px solid white;
  background: white;
  object-fit: cover;
  box-shadow: 0 4px 20px var(--theme-shadowHeavy);
  transition: all var(--transition-normal);
}

.avatar:hover {
  transform: scale(1.05);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: var(--theme-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: 2px solid white;
  transition: all var(--transition-normal);
}

.edit-avatar-btn:hover {
  background: var(--theme-primaryHover);
  transform: scale(1.1) rotate(15deg);
}

.user-info {
  flex: 1;
  padding-bottom: var(--spacing-lg);
}

.username {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 2px 4px var(--theme-shadowHeavy);
}

.user-id {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-md);
}

/* Responsive Design - Mobile First */
@media (max-width: 768px) {
  .profile-header {
    padding: 6.25rem var(--spacing-md) 3.125rem;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
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
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 5rem var(--spacing-sm) 2.5rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .username {
    font-size: 1.25rem;
  }

  .user-id {
    font-size: 0.875rem;
  }
}
</style>
