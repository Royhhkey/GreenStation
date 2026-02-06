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
  gap: 18px;
  padding: 18px 20px;
  width: 96%;
  margin: 0 auto;
  position: fixed;
  top: 0;
  margin-top: 56px;
  z-index: 100;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 2px 4px -1px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.search-input-container {
  position: relative;
  width: 90%;
}

.search-input {
  width: 100%;
  height: 6vh;
  min-height: 44px;
}

/* 增强搜索输入框样式 */
:deep(.ant-input-search .ant-input) {
  background: #fff;
  height: 44px;
  border-radius: 12px;
  border: 2px solid #e8e8e8;
  font-size: 15px;
  padding: 0 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:deep(.ant-input-search .ant-input:focus) {
  border-color: #40a9ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

:deep(.ant-input-search .ant-input-search-button) {
  height: 44px;
  border-radius: 0 12px 12px 0;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.ant-input-search .ant-input-search-button:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* 搜索建议下拉框样式 - 更现代的设计 */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.12),
    0 8px 10px -6px rgba(0, 0, 0, 0.08);
  max-height: 420px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-section {
  padding: 16px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.suggestion-section:last-child {
  border-bottom: none;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.suggestion-title {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #595959;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.suggestion-title .icon {
  margin-right: 8px;
  font-size: 15px;
  color: #1890ff;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.suggestion-item:hover {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.12) 100%);
  transform: translateX(4px);
}

.suggestion-item:active {
  transform: translateX(4px) scale(0.98);
}

.item-icon {
  margin-right: 12px;
  color: #8c8c8c;
  font-size: 15px;
  transition: color 0.25s;
}

.suggestion-item:hover .item-icon {
  color: #1890ff;
}

.item-text {
  flex: 1;
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.popular-tag {
  cursor: pointer;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 20px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  border: 1.5px solid rgba(24, 144, 255, 0.2);
  color: #1890ff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.popular-tag:hover {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-color: #1890ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.35);
}

.popular-tag:active {
  transform: translateY(-1px) scale(0.96);
}

/* 清空按钮样式增强 */
:deep(.suggestion-header .ant-btn-link) {
  color: #8c8c8c;
  font-size: 12px;
  padding: 4px 8px;
  height: auto;
  transition: all 0.25s;
}

:deep(.suggestion-header .ant-btn-link:hover) {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.08);
  border-radius: 6px;
}

.category-list {
  width: 100%;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

:deep(.category-tag) {
  cursor: pointer;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 24px;
  margin: 0;
  background: white;
  border: 2px solid #e8e8e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  letter-spacing: 0.3px;
}

:deep(.category-tag:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 定义一组循环使用的颜色 - 使用渐变和更好的颜色 */
:deep(.category-tag.active) {
  color: #fff;
  border: none;
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag.active:nth-child(8n + 1)) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 2)) {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  box-shadow: 0 4px 16px rgba(82, 196, 26, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 3)) {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
  box-shadow: 0 4px 16px rgba(114, 46, 209, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 4)) {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
  box-shadow: 0 4px 16px rgba(250, 140, 22, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 5)) {
  background: linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%);
  box-shadow: 0 4px 16px rgba(235, 47, 150, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 6)) {
  background: linear-gradient(135deg, #13c2c2 0%, #08979c 100%);
  box-shadow: 0 4px 16px rgba(19, 194, 194, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 7)) {
  background: linear-gradient(135deg, #f5222d 0%, #cf1322 100%);
  box-shadow: 0 4px 16px rgba(245, 34, 45, 0.4);
}

:deep(.category-tag.active:nth-child(8n + 8)) {
  background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
  box-shadow: 0 4px 16px rgba(250, 173, 20, 0.4);
}

/* 悬停效果 - 更柔和的过渡 */
:deep(.category-tag:nth-child(8n + 1):hover) {
  color: #1890ff;
  border-color: #1890ff;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 1).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 2):hover) {
  color: #52c41a;
  border-color: #52c41a;
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.08) 0%, rgba(82, 196, 26, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 2).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 3):hover) {
  color: #722ed1;
  border-color: #722ed1;
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.08) 0%, rgba(114, 46, 209, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 3).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #9254de 0%, #722ed1 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 4):hover) {
  color: #fa8c16;
  border-color: #fa8c16;
  background: linear-gradient(135deg, rgba(250, 140, 22, 0.08) 0%, rgba(250, 140, 22, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 4).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #ffa940 0%, #fa8c16 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 5):hover) {
  color: #eb2f96;
  border-color: #eb2f96;
  background: linear-gradient(135deg, rgba(235, 47, 150, 0.08) 0%, rgba(235, 47, 150, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 5).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #f759ab 0%, #eb2f96 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 6):hover) {
  color: #13c2c2;
  border-color: #13c2c2;
  background: linear-gradient(135deg, rgba(19, 194, 194, 0.08) 0%, rgba(19, 194, 194, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 6).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #36cfc9 0%, #13c2c2 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 7):hover) {
  color: #f5222d;
  border-color: #f5222d;
  background: linear-gradient(135deg, rgba(245, 34, 45, 0.08) 0%, rgba(245, 34, 45, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 7).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #ff4d4f 0%, #f5222d 100%);
  transform: translateY(-2px) scale(1.05);
}

:deep(.category-tag:nth-child(8n + 8):hover) {
  color: #faad14;
  border-color: #faad14;
  background: linear-gradient(135deg, rgba(250, 173, 20, 0.08) 0%, rgba(250, 173, 20, 0.12) 100%);
}

:deep(.category-tag:nth-child(8n + 8).active:hover) {
  color: #fff !important;
  background: linear-gradient(135deg, #ffc53d 0%, #faad14 100%);
  transform: translateY(-2px) scale(1.05);
}

@media (max-width: 768px) {
  .search-box {
    padding: 12px 14px;
    border-radius: 12px;
    gap: 14px;
  }

  .search-input-container {
    width: 100%;
  }

  :deep(.ant-input-search .ant-input) {
    height: 40px;
    font-size: 14px;
  }

  :deep(.ant-input-search .ant-input-search-button) {
    height: 40px;
  }

  .checkbox-group {
    gap: 8px;
  }

  :deep(.category-tag) {
    font-size: 13px;
    padding: 6px 14px;
  }
  
  .suggestions-dropdown {
    max-height: 320px;
    border-radius: 12px;
  }
  
  .suggestion-item {
    padding: 8px 12px;
  }
  
  .popular-tag {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* 滚动条美化 */
.suggestions-dropdown::-webkit-scrollbar {
  width: 6px;
}

.suggestions-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.suggestions-dropdown::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d9d9d9 0%, #bfbfbf 100%);
  border-radius: 3px;
}

.suggestions-dropdown::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #bfbfbf 0%, #8c8c8c 100%);
}
</style>
