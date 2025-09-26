<template>
  <div class="title">
    <Myserach 
      :categories="categories"
      @search="handleSearch"
    >
    </Myserach>
  </div>
  <div class="items-container" @scroll="handleScroll">
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
</template>

<script setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import Myserach from '@/components/searchcompent.vue'

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
// 是否没有更多数据
const noMoreData = ref(false);
// 当前页码
const currentPage = ref(1);
// 每页数据量
const pageSize = ref(10);

function buyItem(item) {
  message.success(`已购买：${item.title}`);
}

const handleSearch = ({ types, keyword }) => {
  console.log('选中的类别:', types)
  console.log('搜索关键词:', keyword)
  // 实现搜索逻辑
}

// 滚动事件处理
const handleScroll = (e) => {
  console.log('滚动事件处理', e)
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  
  // 当滚动到底部时触发加载更多
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMore();
  }
};

// 防抖函数
let debounceTimer = null;
const loadMore = () => {
  // 防止频繁触发
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    // 如果正在加载或没有更多数据，则不执行
    if (loading.value || noMoreData.value) {
      return;
    }
    
    fetchData();
  }, 300);
};

// 模拟获取数据
const fetchData = async () => {
  loading.value = true;
  
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟分页数据
    const newItems = [];
    for (let i = 0; i < pageSize.value; i++) {
      const id = items.length + i + 1;
      newItems.push({
        id,
        title: `商品${id}`,
        price: Math.floor(Math.random() * 1000) + 10,
        image: `https://via.placeholder.com/200x150?text=商品${id}`,
      });
    }
    
    // 如果没有更多数据，设置 noMoreData 为 true
    if (currentPage.value >= 5) { // 模拟只有5页数据
      noMoreData.value = true;
    } else {
      // 添加新数据
      items.push(...newItems);
      currentPage.value++;
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 组件挂载时初始化数据
// onMounted(() => {
//   fetchData();
// });
</script>

<style scoped>
.title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.items-container {
  height: calc(100vh - 120px);
  overflow-y: auto;
  margin-top: 120px;
}

.items {
  padding: 20px;
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.item-info {
  margin: 0;
  font-size: 14px;
}

.item-title {
  font-size: 16px;
  margin: 0 0 8px 0;
  line-height: 1.2;
  color: #333;
}

.item-price {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.buy-btn {
  width: 80px;
  margin-top: 12px;
  border-radius: 4px;
}

.item-card {
  min-height: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.no-more-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.no-more-text {
  font-size: 14px;
  color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .items {
    padding: 8px;
  }
  
  .items-container {
    height: calc(100vh - 100px);
    margin-top: 100px;
  }
  
  .item-image {
    height: 160px;
  }
  .item-info {
    margin: 8px 0;
  }
  .title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-card {
    margin-bottom: 16px;
  }
  
  .item-title {
    font-size: 14px;
  }
  
  .item-price {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .items {
    padding: 6px;
  }
  
  .items-container {
    height: calc(100vh - 90px);
    margin-top: 90px;
  }
  
  .item-image {
    height: 140px;
  }
  
  .item-card {
    min-height: 280px;
  }
}
</style>