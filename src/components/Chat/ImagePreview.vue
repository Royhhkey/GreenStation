<!-- ImagePreview.vue -->
<template>
  <a-modal
    :open="previewVisible"
    :footer="null"
    width="90%"
    :style="modalStyle"
    @cancel="closePreview"
    class="image-preview-modal"
  >
    <div class="preview-container">
      <img :src="previewImageUrl" class="preview-image" />
    </div>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  previewVisible: Boolean,
  previewImageUrl: String,
});

const emit = defineEmits(['update:previewVisible']);

const modalStyle = computed(() => ({
  top: '20px',
}));

const closePreview = () => {
  emit('update:previewVisible', false);
};
</script>

<style scoped>
.image-preview-modal :deep(.ant-modal) {
  background: var(--theme-surfaceBackground);
}

.image-preview-modal :deep(.ant-modal-content) {
  background: var(--theme-cardBackground);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--theme-shadowHeavy);
  transition: var(--transition-normal);
}

.image-preview-modal :deep(.ant-modal-close) {
  color: var(--theme-textPrimary);
  transition: var(--transition-fast);
}

.image-preview-modal :deep(.ant-modal-close:hover) {
  color: var(--theme-primary);
  background: var(--theme-surfaceBackground);
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--theme-cardBackground);
  border-radius: var(--radius-lg);
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-md);
  box-shadow: var(--theme-shadowMedium);
}

@media (min-width: 768px) {
  .image-preview-modal :deep(.ant-modal) {
    width: 80% !important;
    max-width: 1200px;
  }

  .preview-container {
    padding: 30px;
  }
}
</style>
