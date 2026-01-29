<!-- ImagePreview.vue -->
<template>
  <a-modal
    :open="previewVisible"
    :footer="null"
    width="80%"
    style="top: 20px"
    @cancel="closePreview"
  >
    <img :src="previewImageUrl" style="width: 100%" />
  </a-modal>
</template>

<script setup>
const props = defineProps({
  previewVisible: Boolean,
  previewImageUrl: String,
});

const emit = defineEmits(['update:previewVisible']);

const closePreview = () => {
  emit('update:previewVisible', false);
};
</script>
