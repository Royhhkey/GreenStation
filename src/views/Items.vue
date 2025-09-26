<template>
  <div class="page-wrapper">
    <div class="title">
      <Myserach 
        :categories="categories"
        @search="handleSearch"
      />
    </div>
    <div 
      v-infinite-scroll="loadMore"
      class="items-container"
      :infinite-scroll-disabled="loading || noMoreData"
      :infinite-scroll-distance="10"
    >
      <div class="items">
        <a-list :grid="gridConfig" :data-source="items">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :body-style="{ padding: '16px' }" hoverable class="item-card">
                <img :src="item.image" alt="" class="item-image" />
                <div class="item-info">
                  <h4 class="item-title">{{ item.title }}</h4>
                  <p class="item-price">价格：￥{{ item.price }}</p>
                </div>
                <a-button type="primary" size="small" class="buy-btn" @click="buyItem(item)">购买</a-button>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
        
        <!-- 加载状态提示 -->
        <div v-if="loading" class="loading-container">
          <a-spin />
          <span class="loading-text">加载中...</span>
        </div>
        
        <!-- 没有更多数据提示 -->
        <div v-if="noMoreData" class="no-more-container">
          <span class="no-more-text">没有更多数据了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import Myserach from '@/components/searchcompent.vue'

// 修复指令导入
const vInfiniteScroll = {
  mounted(el, binding) {
    const callback = binding.value;
    const options = {
      distance: binding.arg || 10,
      disabled: binding.modifiers.disabled
    };
    
    const handleScroll = () => {
      if (binding.modifiers.disabled) return;
      
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      if (distanceFromBottom <= options.distance) {
        callback();
      }
    };
    
    el.addEventListener('scroll', handleScroll);
    el._infiniteScrollHandler = handleScroll;
  },
  unmounted(el) {
    if (el._infiniteScrollHandler) {
      el.removeEventListener('scroll', el._infiniteScrollHandler);
    }
  }
};

const categories = [
  { label: '全部', value: 'all' },
  { label: '学习用品', value: 'study' },
  { label: '生活用品', value: 'life' },
  { label: '电子产品', value: 'electronic' },
  { label: '美妆护肤', value: 'makeup' },
  { label: '服装鞋包', value: 'clothing' },
  { label: '食品饮料', value: 'food' },
  { label: '其他', value: 'others' },
]

const items = reactive([
  {
    id: 1,
    title: "二手教材《大学物理》",
    price: 30,
    image: "https://via.placeholder.com/200x150?text=教材",
  },
  {
    id: 2,
    title: "二手手机",
    price: 500,
    image: "https://via.placeholder.com/200x150?text=手机",
  },
  {
    id: 3,
    title: "二手自行车",
    price: 300,
    image: "https://via.placeholder.com/200x150?text=自行车",
  },
  {
    id: 4,
    title: "二手教材《大学物理》",
    price: 20,
    image: "https://via.placeholder.com/200x150?text=教材",
  },
  {
    id: 5,
    title: "二手手机",
    price: 400,
    image: "https://via.placeholder.com/200x150?text=手机",
  },
]);

// 响应式网格配置
const gridConfig = ref({
  gutter: 24,
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 4
});

// 加载状态
const loading = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const pageSize = ref(8);

function buyItem(item) {
  message.success(`已购买：${item.title}`);
}

const handleSearch = ({ types, keyword }) => {
  console.log('选中的类别:', types)
  console.log('搜索关键词:', keyword)
  // 重置数据并重新加载
  items.length = 0;
  currentPage.value = 1;
  noMoreData.value = false;
  loadMore();
}

// 加载更多数据
const loadMore = async () => {
  console.log('触发加载更多')
  
  if (loading.value || noMoreData.value) {
    return;
  }
  
  loading.value = true;
  
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟分页数据
    const newItems = [];
    const startId = items.length + 1;
    
    for (let i = 0; i < pageSize.value; i++) {
      const id = startId + i;
      newItems.push({
        id,
        title: `商品${id}`,
        price: Math.floor(Math.random() * 1000) + 10,
        image: `https://via.placeholder.com/200x150?text=商品${id}`,
      });
    }
    
    // 模拟数据限制（只有50条数据）
    if (items.length >= 50) {
      noMoreData.value = true;
      message.info('已加载所有数据');
    } else {
      items.push(...newItems);
      currentPage.value++;
    }
    
    console.log(`加载完成，当前数据量: ${items.length}`)
  } catch (error) {
    console.error('加载数据失败:', error);
    message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 初始化加载数据
onMounted(() => {
  loadMore();
});
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 隐藏页面滚动条 */
}

.title {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
}

.items-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0; /* 关键：解决flex滚动问题 */
}

.items {
  min-height: 100%;
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.loading-container, .no-more-container {
  text-align: center;
  padding: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .items-container {
    padding: 8px;
    margin-bottom: 10vh;

  }
  
  .title {
    padding: 12px;
  }
}

@media (max-width: 576px) {
  .items-container {
    padding: 6px;
    margin-bottom: 10vh;
  }
}
</style>