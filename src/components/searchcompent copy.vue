<template>
  <div class="search-box">
    <a-input-search
      v-model:value="searchKeyword"
      placeholder="搜索"
      class="search-input"
      @search="handleSearch"
      
      enter-button
    />
    <div class="category-list">
      <a-checkbox-group 
        v-model:value="selectedTypes" 
        class="checkbox-group"
      >
        <a-tag
          v-for="(category, index) in categories"
          :key="category.value"
          :class="[
            'category-tag', 
            `category-${index}`,
            { active: selectedTypes.includes(category.value) }
          ]"
          @click="toggleCategory(category.value)"
        >
          {{ category.label }}
        </a-tag>
        <a-button type="primary" class="category-expand-btn">
          展开
        </a-button>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { label: '全部', value: 'all' },
      { label: '书籍', value: 'book' },
      { label: '电子产品', value: 'electronics' },
      { label: '其他', value: 'others' }
    ]
  }
})

const emit = defineEmits(['search'])

const searchKeyword = ref('')
const selectedTypes = ref(['all'])

const toggleCategory = (value) => {
  const index = selectedTypes.value.indexOf(value)
  
  if (value === 'all') {
    // 点击"全部"时的逻辑
    if (selectedTypes.value.includes('all')) {
      // 如果已经选中"全部"，则取消选中所有
      selectedTypes.value = []
    } else {
      // 如果未选中"全部"，则只选中"全部"
      selectedTypes.value = ['all']
    }
  } else {
    // 点击其他分类时的逻辑
    if (index === -1) {
      // 添加新分类
      selectedTypes.value = selectedTypes.value.filter(type => type !== 'all')
      selectedTypes.value.push(value)
    } else {
      // 移除已选分类
      selectedTypes.value.splice(index, 1)
    }
    
    // 如果没有选中任何分类，自动选中"全部"
    if (selectedTypes.value.length === 0) {
      selectedTypes.value = ['all']
    }
  }
}

const handleSearch = () => {
  emit('search', {
    types: selectedTypes.value,
    keyword: searchKeyword.value
  })
}

// 当选中类型改变时自动触发搜索
watch(selectedTypes, () => {
  handleSearch()
})
</script>

<style scoped>
.search-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  margin: 0 auto;
  position: fixed;
  /* top: ; */
  top :8.524vh;
  left: 10px;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.search-input{
    width: 90%;
    height: 6vh
}

.category-list {
  width: 100%;
}
.category-expand-btn {
  margin-left: auto;
  display: block;
  margin-right: 30px;
}
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
}

:deep(.category-tag) {
  cursor: pointer;
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 20px;
  margin: 0;
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

/* 定义一组循环使用的颜色 */
:deep(.category-tag.active) {
  color: #fff;
}

:deep(.category-tag.active:nth-child(8n+1)) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.category-tag.active:nth-child(8n+2)) {
  background: #52c41a;
  border-color: #52c41a;
}

:deep(.category-tag.active:nth-child(8n+3)) {
  background: #722ed1;
  border-color: #722ed1;
}

:deep(.category-tag.active:nth-child(8n+4)) {
  background: #fa8c16;
  border-color: #fa8c16;
}

:deep(.category-tag.active:nth-child(8n+5)) {
  background: #eb2f96;
  border-color: #eb2f96;
}

:deep(.category-tag.active:nth-child(8n+6)) {
  background: #13c2c2;
  border-color: #13c2c2;
}

:deep(.category-tag.active:nth-child(8n+7)) {
  background: #f5222d;
  border-color: #f5222d;
}

:deep(.category-tag.active:nth-child(8n+8)) {
  background: #faad14;
  border-color: #faad14;
}

/* 悬停效果 */
:deep(.category-tag:nth-child(8n+1):hover) { 
  color: #1890ff; 
  border-color: #1890ff; 
  background-color: rgba(24, 144, 255, 0.1);
}
:deep(.category-tag:nth-child(8n+1).active:hover) {
  color: #fff !important;
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.category-tag:nth-child(8n+2):hover) { 
  color: #52c41a; 
  border-color: #52c41a;
  background-color: rgba(82, 196, 26, 0.1);
}
:deep(.category-tag:nth-child(8n+2).active:hover) {
  color: #fff !important;
  background: #52c41a;
  border-color: #52c41a;
}

:deep(.category-tag:nth-child(8n+3):hover) { 
  color: #722ed1; 
  border-color: #722ed1;
  background-color: rgba(114, 46, 209, 0.1);
}
:deep(.category-tag:nth-child(8n+3).active:hover) {
  color: #fff !important;
  background: #722ed1;
  border-color: #722ed1;
}

:deep(.category-tag:nth-child(8n+4):hover) { 
  color: #fa8c16; 
  border-color: #fa8c16;
  background-color: rgba(250, 140, 22, 0.1);
}
:deep(.category-tag:nth-child(8n+4).active:hover) {
  color: #fff !important;
  background: #fa8c16;
  border-color: #fa8c16;
}

:deep(.category-tag:nth-child(8n+5):hover) { 
  color: #eb2f96; 
  border-color: #eb2f96;
  background-color: rgba(235, 47, 150, 0.1);
}
:deep(.category-tag:nth-child(8n+5).active:hover) {
  color: #fff !important;
  background: #eb2f96;
  border-color: #eb2f96;
}

:deep(.category-tag:nth-child(8n+6):hover) { 
  color: #13c2c2; 
  border-color: #13c2c2;
  background-color: rgba(19, 194, 194, 0.1);
}
:deep(.category-tag:nth-child(8n+6).active:hover) {
  color: #fff !important;
  background: #13c2c2;
  border-color: #13c2c2;
}

:deep(.category-tag:nth-child(8n+7):hover) { 
  color: #f5222d; 
  border-color: #f5222d;
  background-color: rgba(245, 34, 45, 0.1);
}
:deep(.category-tag:nth-child(8n+7).active:hover) {
  color: #fff !important;
  background: #f5222d;
  border-color: #f5222d;
}

:deep(.category-tag:nth-child(8n+8):hover) { 
  color: #faad14; 
  border-color: #faad14;
  background-color: rgba(250, 173, 20, 0.1);
}
:deep(.category-tag:nth-child(8n+8).active:hover) {
  color: #fff !important;
  background: #faad14;
  border-color: #faad14;
}

:deep(.ant-input-search .ant-input) {
  background: #fff;
  height: 40px;
}

:deep(.ant-input-search .ant-input-search-button) {
  height: 40px;
}

@media (max-width: 768px) {
  .search-box {
    padding: 8px;
  }
  
  .checkbox-group {
    gap: 8px;
  }

  :deep(.category-tag) {
    font-size: 12px;
    padding: 4px 12px;
  }
}
</style>