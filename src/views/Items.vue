<template>
  <div class="page-wrapper">
    <!-- 搜索组件 -->
    <Myserach 
      :categories="categories"
      @search="handleSearch"
    />
    
    <!-- 内容区域 -->
    <div class="content-area">
      <div 
        ref="scrollContainer"
        class="items-container"
        @scroll="handleScroll"
      >
        <a-list :grid="gridConfig" :data-source="items">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card 
                :body-style="{ padding: '16px' }" 
                hoverable 
                class="item-card"
                @click="viewItemDetail(item)"
              >
                <div class="item-image-container">
                  <img 
                    :src="item.image" 
                    :alt="item.title" 
                    class="item-image"
                    loading="lazy"
                  />
                  <div class="item-category-tag">
                    {{ getCategoryLabel(item.categoryId) }}
                  </div>
                </div>
                <div class="item-info">
                  <h4 class="item-title" :title="item.title">{{ item.title }}</h4>
                  <p class="item-price">￥{{ item.price }}</p>
                  <div class="item-meta">
                    <!-- <span class="item-location">{{ item.location }}</span> -->
                    <span class="item-time">{{ formatTime(item.createTime) }}</span>
                  </div>
                </div>
                <div class="item-actions">
                  <a-button 
                    size="small" 
                    class="buy-btn" 
                    @click.stop="viewItemDetail(item)"
                  >
                    <template #icon><ReadOutlined  /></template>
                    详情
                  </a-button>
                  <a-button 
                    type="primary" 
                    size="small" 
                    class="contact-btn"
                    @click.stop="contactSeller(item)"
                  >
                    <template #icon><MessageOutlined /></template>
                    联系卖家
                  </a-button>
                </div>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
        
        <!-- 加载状态提示 -->
        <div v-if="loading && !noMoreData" class="loading-container">
          <a-spin size="large" />
          <span class="loading-text">加载中...</span>
        </div>
        
        <!-- 没有更多数据提示 -->
        <div v-if="noMoreData && items.length > 0" class="no-more-container">
          <a-divider>
            <smile-outlined />
            <span class="no-more-text">已经到底了，没有更多商品了</span>
          </a-divider>
        </div>
        <!-- 商品详情弹窗 -->
        <ProductDetailModal
          :visible="detailModalVisible"
          :product-data="selectedProduct"
          :categories="categories"
          @update:visible="handleDetailModalVisibleChange"
          @contact-seller="handleContactSeller"
        />
        <!-- 空状态 -->
        <!-- <div v-if="!loading && displayItems.length === 0" class="empty-container">
          <a-empty description="暂无商品数据">
            <a-button type="primary" @click="resetSearch">重新加载</a-button>
          </a-empty>
        </div> -->
      </div>
    </div>
    
    <!-- 回到顶部按钮 -->
    <a-back-top :visibility-height="300" :target="backTopTarget"  class="back-top"/>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { message, Modal } from "ant-design-vue";
import { ReadOutlined , MessageOutlined, SmileOutlined } from '@ant-design/icons-vue';
import Myserach from '@/components/searchcompent.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue'; // 引入详情组件
import {replaceUrlRegex,removeEmptyProperties,objectToString,formatTime} from '@/utils'
import {getproducts} from '@/api'

// 详情弹窗相关
const detailModalVisible = ref(false);
const selectedProduct = ref(null);

// 商品类别配置
const categories = [
  { label: '全部', value: '' },
  { label: '学习用品', value: '4' },
  { label: '生活用品', value: '5' },
  { label: '电子产品', value: '6' },
  { label: '美妆护肤', value: '7' },
  { label: '服装鞋包', value: '8' },
  { label: '食品饮料', value: '9' },
  { label: '其他', value: '10' },
];

// 响应式数据
const items = ref([]);
const loading = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const searchParams = reactive({
  keyword: '',
  category: ''
});

// const searchTimeout = ref(null);
const isSearching = ref(false);

// 滚动容器引用
const scrollContainer = ref(null);

// 回到顶部目标
const backTopTarget = () => scrollContainer.value;

// 响应式网格配置
const gridConfig = ref({
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
  xxl: 4
});


// 创建类别映射表
const categoryMap = computed(() => {
  const map = {};
  categories.forEach(cat => {
    map[cat.value] = cat.label;
  });
  return map;
});

// 使用映射表查找
const getCategoryLabel = (value) => {
  if (value === null || value === undefined) return '其他';
  
  const stringValue = String(value).trim();
  return categoryMap.value[stringValue] || '其他';
};


// 防抖函数
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// 实际的搜索执行函数
const executeSearch = async (params) => {
  isSearching.value = true;
  
  try {
    searchParams.keyword = params.keyword || '';
    searchParams.category = params.types || '';
    if (searchParams.category !== '') {
      searchParams.category = searchParams.category.join(','); 
    }
    
    console.log('执行搜索，参数:', searchParams);
    items.value = [];
    currentPage.value = 1;
    noMoreData.value = false;
    
    await loadMore();
  } finally {
    isSearching.value = false;
  }
};

// 创建防抖版本的搜索函数（1000ms 延迟）
const debouncedSearch = debounce(executeSearch, 1000);

// 处理搜索
const handleSearch = (params) => {
  console.log('handleSearch', params);
  
  // 如果正在搜索，显示提示
  if (isSearching.value) {
    console.log('正在搜索中，请稍候...');
  }
  
  debouncedSearch(params);
};

// 重置搜索
const resetSearch = () => {
  searchParams.keyword = '';
  searchParams.category = '';
  items.value = [];
  currentPage.value = 1;
  noMoreData.value = false;
  loadMore();
};
// 处理详情弹窗显示状态变化
const handleDetailModalVisibleChange = (visible) => {
  detailModalVisible.value = visible;
};// 查看商品详情
const viewItemDetail = (item) => {
  selectedProduct.value = item;
  detailModalVisible.value = true;
};

// 联系卖家
const contactSeller = (item) => {
  message.info(`请联系卖家：${item.seller || '未知卖家'}`);
};



// 手动滚动处理
const handleScroll = () => {
  if (loading.value || noMoreData.value) return;
  
  const container = scrollContainer.value;
  if (!container) return;
  
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;
  
  // 距离底部100px时触发加载
  const distanceToBottom = scrollHeight - scrollTop - clientHeight;
  
  if (distanceToBottom < 100) {
    console.log('滚动到底部，触发加载');
    loadMore();
  }
};


// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMoreData.value) {
    console.log('阻止加载：loading=', loading.value, 'noMoreData=', noMoreData.value);
    return;
  }
  
  loading.value = true;
  // console.log(`开始加载第 ${currentPage.value} 页数据...`);
  
  try {

    let obj = {
      page: currentPage.value,
      page_size: pageSize.value,
      q: searchParams.keyword,
      category: searchParams.category,
    }
    obj = removeEmptyProperties(obj);
    const str = objectToString(obj);
    console.log(str);


    const {data} = await getproducts(str);
    // console.log('data',data);
    if(data.code=='01'){
       let result = data.data.results;
       
        const processedResult = result.map((item, index) => {

            const { username, id } = item.user || {};

            // 处理 price 和 image 字段
            const price = item.price !== null ? parseFloat(item.price) : null;
            const image = item.image !== null ? replaceUrlRegex(item.image) : "https://eo-oss.roy22.xyz/secondHand/image.png"
            // const useavatar = item.user?.avatar !== null ? replaceUrlRegex(item.user.avatar) : "https://eo-oss.roy22.xyz/secondHand/avatar.png"


            return {
                id: item.id,
                title: item.name,
                price: price,
                description: item.description,
                // isSold: item.is_sold,
                createTime: item.created_at,
                categoryId: item.category_info.cid,
                categoryName: item.category_info.cname,
                user: {
                    id: id,
                    username: username,
                    // avatar: useavatar
                },
                image: image
            };
        });
      console.log('processedResult',processedResult);
      items.value.push(...processedResult);
      currentPage.value++;
      noMoreData.value = items.value.length >= data.data.count;
    }

    
    if (noMoreData.value) {
      console.log('所有数据已加载完毕');
    }
    
  } catch (error) {
    console.error('加载数据失败:', error);
    message.error('加载数据失败，请重试');
  } finally {
    loading.value = false;
    console.log('加载完成');
  }
};


// 初始化加载数据
onMounted(() => {
  loadMore();
  
  // 确保容器样式正确应用
  nextTick(() => {
    if (scrollContainer.value) {
      console.log('滚动容器信息:', {
        scrollHeight: scrollContainer.value.scrollHeight,
        clientHeight: scrollContainer.value.clientHeight,
        offsetHeight: scrollContainer.value.offsetHeight
      });
    }
  });
});
</script>

<style scoped>
/* 重置全局滚动条 */
:deep(body) {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 隐藏body的滚动条 */
  height: 100vh;
}

:deep(html) {
  overflow: hidden; /* 隐藏html的滚动条 */
  height: 100%;
}

.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden; /* 隐藏页面容器的滚动条 */
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 隐藏内容区域的滚动条 */
  margin-top: 14vh;
}

.items-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto; /* 只有这个容器有滚动条 */
  overflow-x: hidden;
  height: calc(100vh - 14vh);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch; /* 移动端平滑滚动 */
}

/* 自定义滚动条样式 */
.items-container::-webkit-scrollbar {
  width: 6px;
}

.items-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.items-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.items-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.item-card {
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 16px;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-image-container {
  position: relative;
  margin-bottom: 12px;
}

.item-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.item-category-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.item-info {
  margin-bottom: 12px;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.item-price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.buy-btn, .contact-btn {
  flex: 1;
  font-size: 13px;
}

.loading-container, .no-more-container, .empty-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  margin-left: 8px;
  color: #999;
}

.no-more-text {
  color: #999;
}

.empty-container {
  padding: 80px 20px;
}
.back-top{
  position: fixed;
  bottom: 100px;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .content-area {
    margin-top: 12vh;
  }
  
  .items-container {
    padding: 12px;
    height: calc(100vh - 12vh);
    margin-top: 12vh;
  }
  
  .item-image {
    height: 140px;
  }
  
  .grid-config {
    gutter: 12;
    xs: 1;
    sm: 2;
    md: 2;
    lg: 3;
    xl: 3;
    xxl: 3;
  }
  
  .item-card {
    margin-bottom: 12px;
  }
}

/* 确保搜索组件不会导致滚动问题 */
:deep(.search-component) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>