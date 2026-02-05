<template>
  <div class="search-box">
    <div class="search-input-container">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索商品、关键词..."
        class="search-input"
        @search="handleSearch"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        enter-button
      />
      
      <!-- 搜索建议下拉框 -->
      <div v-if="showSuggestions && (searchHistory.length > 0 || popularSearches.length > 0)" class="suggestions-dropdown">
        <!-- 最近搜索 -->
        <div v-if="searchHistory.length > 0" class="suggestion-section">
          <div class="suggestion-header">
            <span class="suggestion-title">
              <ClockCircleOutlined class="icon" />
              最近搜索
            </span>
            <a-button type="link" size="small" @click="clearHistory">清空</a-button>
          </div>
          <div class="suggestion-list">
            <div
              v-for="(item, index) in searchHistory"
              :key="'history-' + index"
              class="suggestion-item"
              @mousedown.prevent="selectSuggestion(item)"
            >
              <SearchOutlined class="item-icon" />
              <span class="item-text">{{ item }}</span>
            </div>
          </div>
        </div>
        
        <!-- 热门搜索 -->
        <div v-if="popularSearches.length > 0" class="suggestion-section">
          <div class="suggestion-header">
            <span class="suggestion-title">
              <FireOutlined class="icon" />
              热门搜索
            </span>
          </div>
          <div class="suggestion-tags">
            <a-tag
              v-for="(item, index) in popularSearches"
              :key="'popular-' + index"
              class="popular-tag"
              @click="selectSuggestion(item)"
            >
              {{ item }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
    
    <div class="category-list">
      <a-checkbox-group v-model:value="selectedTypes" class="checkbox-group">
        <a-tag
          v-for="(category, index) in categories"
          :key="category.value"
          :class="[
            'category-tag',
            { active: selectedTypes.includes(category.value) },
          ]"
          @click="toggleCategory(category.value)"
        >
          {{ category.label }}
        </a-tag>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  ClockCircleOutlined, 
  SearchOutlined, 
  FireOutlined 
} from '@ant-design/icons-vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['search']);

// 常量配置
const MAX_SEARCH_HISTORY = 10; // 最多保存的搜索历史数量
const SUGGESTION_HIDE_DELAY = 200; // 建议框隐藏延迟（毫秒）

const searchKeyword = ref('');
const selectedTypes = ref(['']);
const showSuggestions = ref(false);
const searchHistory = ref([]);

// 热门搜索建议
const popularSearches = ref([
  '电脑', 
  '手机', 
  '教材', 
  '自行车',
  '台灯',
  '耳机'
]);

// 从 localStorage 加载搜索历史
const loadSearchHistory = () => {
  const history = localStorage.getItem('searchHistory');
  if (history) {
    try {
      searchHistory.value = JSON.parse(history);
    } catch (e) {
      searchHistory.value = [];
    }
  }
};

// 保存搜索历史到 localStorage
const saveSearchHistory = (keyword) => {
  if (!keyword || keyword.trim() === '') return;
  
  // 移除重复项
  const history = searchHistory.value.filter(item => item !== keyword);
  // 添加到开头
  history.unshift(keyword);
  // 最多保存配置的数量
  searchHistory.value = history.slice(0, MAX_SEARCH_HISTORY);
  
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
};

// 选择建议项
const selectSuggestion = (keyword) => {
  searchKeyword.value = keyword;
  showSuggestions.value = false;
  handleSearch();
};

// 处理失焦事件
const handleBlur = () => {
  // 延迟隐藏，以便点击建议项时能触发
  setTimeout(() => {
    showSuggestions.value = false;
  }, SUGGESTION_HIDE_DELAY);
};

const toggleCategory = (value) => {
  const index = selectedTypes.value.indexOf(value);

  if (value === '') {
    // 点击"全部"时的逻辑
    if (selectedTypes.value.includes('')) {
      // 如果已经选中"全部"，则取消选中所有
      selectedTypes.value = [];
    } else {
      // 如果未选中"全部"，则只选中"全部"
      selectedTypes.value = [''];
    }
  } else {
    // 点击其他分类时的逻辑
    if (index === -1) {
      // 添加新分类
      selectedTypes.value = selectedTypes.value.filter((type) => type !== '');
      selectedTypes.value.push(value);
    } else {
      // 移除已选分类
      selectedTypes.value.splice(index, 1);
    }

    // 如果没有选中任何分类，自动选中"全部"
    if (selectedTypes.value.length === 0) {
      selectedTypes.value = [''];
    }
  }
};

const handleSearch = () => {
  // 保存搜索历史
  if (searchKeyword.value && searchKeyword.value.trim() !== '') {
    saveSearchHistory(searchKeyword.value.trim());
  }
  
  emit('search', {
    types: selectedTypes.value,
    keyword: searchKeyword.value,
  });
};

// 当选中类型改变时自动触发搜索
watch(selectedTypes, () => {
  handleSearch();
});

// 组件挂载时加载搜索历史
onMounted(() => {
  loadSearchHistory();
});
</script>

<style scoped>
.search-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 96%;
  margin: 0 auto;
  position: fixed;
  top: 0; /* 贴顶 */
  margin-top: 56px; /* 向下微调 */
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.search-input-container {
  position: relative;
  width: 90%;
}

.search-input {
  width: 100%;
  height: 6vh;
}

/* 搜索建议下拉框样式 */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-section {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-section:last-child {
  border-bottom: none;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.suggestion-title {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}

.suggestion-title .icon {
  margin-right: 6px;
  font-size: 14px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.item-icon {
  margin-right: 10px;
  color: #bfbfbf;
  font-size: 14px;
}

.item-text {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.popular-tag {
  cursor: pointer;
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 16px;
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
  margin: 0;
}

.popular-tag:hover {
  color: #1890ff;
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
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

:deep(.category-tag.active:nth-child(8n + 1)) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.category-tag.active:nth-child(8n + 2)) {
  background: #52c41a;
  border-color: #52c41a;
}

:deep(.category-tag.active:nth-child(8n + 3)) {
  background: #722ed1;
  border-color: #722ed1;
}

:deep(.category-tag.active:nth-child(8n + 4)) {
  background: #fa8c16;
  border-color: #fa8c16;
}

:deep(.category-tag.active:nth-child(8n + 5)) {
  background: #eb2f96;
  border-color: #eb2f96;
}

:deep(.category-tag.active:nth-child(8n + 6)) {
  background: #13c2c2;
  border-color: #13c2c2;
}

:deep(.category-tag.active:nth-child(8n + 7)) {
  background: #f5222d;
  border-color: #f5222d;
}

:deep(.category-tag.active:nth-child(8n + 8)) {
  background: #faad14;
  border-color: #faad14;
}

/* 悬停效果 */
:deep(.category-tag:nth-child(8n + 1):hover) {
  color: #1890ff;
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}
:deep(.category-tag:nth-child(8n + 1).active:hover) {
  color: #fff !important;
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.category-tag:nth-child(8n + 2):hover) {
  color: #52c41a;
  border-color: #52c41a;
  background-color: rgba(82, 196, 26, 0.1);
}
:deep(.category-tag:nth-child(8n + 2).active:hover) {
  color: #fff !important;
  background: #52c41a;
  border-color: #52c41a;
}

:deep(.category-tag:nth-child(8n + 3):hover) {
  color: #722ed1;
  border-color: #722ed1;
  background-color: rgba(114, 46, 209, 0.1);
}
:deep(.category-tag:nth-child(8n + 3).active:hover) {
  color: #fff !important;
  background: #722ed1;
  border-color: #722ed1;
}

:deep(.category-tag:nth-child(8n + 4):hover) {
  color: #fa8c16;
  border-color: #fa8c16;
  background-color: rgba(250, 140, 22, 0.1);
}
:deep(.category-tag:nth-child(8n + 4).active:hover) {
  color: #fff !important;
  background: #fa8c16;
  border-color: #fa8c16;
}

:deep(.category-tag:nth-child(8n + 5):hover) {
  color: #eb2f96;
  border-color: #eb2f96;
  background-color: rgba(235, 47, 150, 0.1);
}
:deep(.category-tag:nth-child(8n + 5).active:hover) {
  color: #fff !important;
  background: #eb2f96;
  border-color: #eb2f96;
}

:deep(.category-tag:nth-child(8n + 6):hover) {
  color: #13c2c2;
  border-color: #13c2c2;
  background-color: rgba(19, 194, 194, 0.1);
}
:deep(.category-tag:nth-child(8n + 6).active:hover) {
  color: #fff !important;
  background: #13c2c2;
  border-color: #13c2c2;
}

:deep(.category-tag:nth-child(8n + 7):hover) {
  color: #f5222d;
  border-color: #f5222d;
  background-color: rgba(245, 34, 45, 0.1);
}
:deep(.category-tag:nth-child(8n + 7).active:hover) {
  color: #fff !important;
  background: #f5222d;
  border-color: #f5222d;
}

:deep(.category-tag:nth-child(8n + 8):hover) {
  color: #faad14;
  border-color: #faad14;
  background-color: rgba(250, 173, 20, 0.1);
}
:deep(.category-tag:nth-child(8n + 8).active:hover) {
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

  .search-input-container {
    width: 100%;
  }

  .checkbox-group {
    gap: 8px;
  }

  :deep(.category-tag) {
    font-size: 12px;
    padding: 4px 12px;
  }
  
  .suggestions-dropdown {
    max-height: 300px;
  }
  
  .suggestion-item {
    padding: 6px 10px;
  }
}
</style>
