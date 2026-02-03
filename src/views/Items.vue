<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- 搜索组件 -->
    <Myserach :categories="categories" @search="handleSearch" />

    <!-- 内容区域 -->
    <div class="mt-14 md:mt-16">
      <div
        ref="scrollContainer"
        class="items-container px-4 py-6 md:px-6 md:py-8 overflow-y-auto overflow-x-hidden"
        @scroll="handleScroll"
      >
        <!-- 商品列表 -->
        <a-list
          v-if="items.length > 0"
          :grid="gridConfig"
          :data-source="items"
          class="product-list"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card
                :body-style="{ padding: '0' }"
                hoverable
                class="product-card h-full bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden group hover:shadow-xl hover:-translate-y-1"
                @click="viewItemDetail(item)"
              >
                <!-- 图片区域 -->
                <div
                  class="relative w-full aspect-[4/3] overflow-hidden bg-gray-100"
                >
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <!-- 分类标签 -->
                  <div
                    class="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm"
                  >
                    {{ getCategoryLabel(item.categoryId) }}
                  </div>
                  <!-- 遮罩层（hover时显示） -->
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"
                  ></div>
                </div>

                <!-- 内容区域 -->
                <div class="p-4 space-y-3">
                  <!-- 标题 -->
                  <h4
                    class="text-[15px] md:text-base font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-blue-600 transition-colors"
                    :title="item.title"
                  >
                    {{ item.title }}
                  </h4>

                  <!-- 价格和时间 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs text-gray-400 font-normal">¥</span>
                      <span
                        class="text-xl md:text-2xl font-bold text-red-500 leading-none"
                      >
                        {{ item.price }}
                      </span>
                    </div>
                    <span
                      class="text-xs text-gray-400 flex items-center gap-1"
                    >
                      <ClockCircleOutlined class="text-[10px]" />
                      {{ formatTime(item.createTime) }}
                    </span>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex gap-2 pt-2 border-t border-gray-100">
                    <a-button
                      size="small"
                      class="flex-1 h-9 text-xs font-medium border-gray-200 hover:border-blue-400 hover:text-blue-500 transition-colors"
                      @click.stop="viewItemDetail(item)"
                    >
                      <template #icon><ReadOutlined /></template>
                      查看详情
                    </a-button>
                    <a-button
                      type="primary"
                      size="small"
                      class="flex-1 h-9 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
                      @click.stop="contactSeller(item)"
                    >
                      <template #icon><MessageOutlined /></template>
                      联系卖家
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-list-item>
          </template>
        </a-list>

        <!-- 空状态 -->
        <div
          v-if="!loading && items.length === 0"
          class="flex flex-col items-center justify-center py-20 px-5"
        >
          <div
            class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <ShoppingOutlined class="text-4xl text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">暂无商品</h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            试试调整搜索条件或筛选条件
          </p>
          <a-button type="primary" @click="resetSearch">
            重新加载
          </a-button>
        </div>

        <!-- 加载状态提示 -->
        <div
          v-if="loading && !noMoreData"
          class="flex flex-col items-center justify-center py-16 px-5"
        >
          <a-spin size="large" />
          <span class="mt-4 text-sm text-gray-500">正在加载商品...</span>
        </div>

        <!-- 没有更多数据提示 -->
        <div
          v-if="noMoreData && items.length > 0"
          class="flex flex-col items-center justify-center py-12 px-5"
        >
          <div class="flex items-center gap-3 text-gray-400">
            <div class="h-px w-12 bg-gray-200"></div>
            <SmileOutlined class="text-2xl" />
            <span class="text-sm">已经到底了，没有更多商品了</span>
            <div class="h-px w-12 bg-gray-200"></div>
          </div>
        </div>

        <!-- 商品详情弹窗 -->
        <ProductDetailModal
          :visible="detailModalVisible"
          :product-data="selectedProduct"
          :categories="categories"
          @update:visible="handleDetailModalVisibleChange"
          @contact-seller="contactSeller"
        />
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <a-back-top
      :visibility-height="300"
      :target="backTopTarget"
      class="fixed bottom-24 right-4 md:right-6"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  ReadOutlined,
  MessageOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons-vue';
import Myserach from '@/components/searchcompent.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue'; // 引入详情组件
import {
  replaceUrlRegex,
  removeEmptyProperties,
  objectToString,
  formatTime,
} from '@/utils';
import { getproducts } from '@/api';
import { useRouter } from 'vue-router';

// 详情弹窗相关
const detailModalVisible = ref(false);
const selectedProduct = ref(null);
const router = useRouter();

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
  category: '',
});

// const searchTimeout = ref(null);
const isSearching = ref(false);

// 滚动容器引用
const scrollContainer = ref(null);

// 回到顶部目标
const backTopTarget = () => scrollContainer.value;

// 响应式网格配置
const gridConfig = ref({
  gutter: [16, 20],
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 4,
});

// 创建类别映射表
const categoryMap = computed(() => {
  const map = {};
  categories.forEach((cat) => {
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
}; // 查看商品详情
const viewItemDetail = (item) => {
  selectedProduct.value = item;
  detailModalVisible.value = true;
};

// 联系卖家
const contactSeller = async (item) => {
  // message.info(`请联系卖家：${item.seller || '未知卖家'}`);
  console.log('item', item);
  router.push(`/home/chat/${item.user.id}`);

  // const {data} = await StartConversations({
  //   other_user_id: item.user.id
  //   // product_id: item.id
  // });
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
    console.log(
      '阻止加载：loading=',
      loading.value,
      'noMoreData=',
      noMoreData.value,
    );
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
    };
    obj = removeEmptyProperties(obj);
    const str = objectToString(obj);
    console.log(str);

    const { data } = await getproducts(str);
    // console.log('data',data);
    if (data.code == '01') {
      let result = data.data.results;

      const processedResult = result.map((item, index) => {
        const { username, id } = item.user || {};

        // 处理 price 和 image 字段
        const price = item.price !== null ? parseFloat(item.price) : null;
        const image =
          item.image !== null
            ? replaceUrlRegex(item.image)
            : 'https://eo-oss.roy22.xyz/secondHand/image.png';
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
          image: image,
        };
      });
      // console.log('processedResult',processedResult);
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
    // console.log('加载完成');
  }
};

// 图片加载错误处理
const handleImageError = (event) => {
  event.target.src =
    'https://eo-oss.roy22.xyz/secondHand/image.png';
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
        offsetHeight: scrollContainer.value.offsetHeight,
      });
    }
  });
});
</script>

<style scoped>
/* 自定义滚动条样式 */
.items-container::-webkit-scrollbar {
  width: 8px;
}

.items-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.items-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  transition: background 0.2s;
}

.items-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 商品卡片动画优化 */
.product-card {
  will-change: transform;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .items-container {
    padding: 12px 16px;
  }

  .product-card {
    border-radius: 12px;
  }
}

/* 列表间距优化 */
:deep(.ant-list-item) {
  padding: 0 !important;
  margin-bottom: 20px;
}

/* 确保卡片高度一致 */
:deep(.ant-list-grid .ant-col) {
  display: flex;
}

/* 按钮图标间距 */
:deep(.ant-btn-icon) {
  margin-right: 4px;
}
</style>
