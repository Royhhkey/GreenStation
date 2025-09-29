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
        <a-list :grid="gridConfig" :data-source="displayItems">
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
                    {{ getCategoryLabel(item.category) }}
                  </div>
                </div>
                <div class="item-info">
                  <h4 class="item-title" :title="item.title">{{ item.title }}</h4>
                  <p class="item-price">￥{{ item.price }}</p>
                  <div class="item-meta">
                    <span class="item-location">{{ item.location }}</span>
                    <span class="item-time">{{ formatTime(item.createTime) }}</span>
                  </div>
                </div>
                <div class="item-actions">
                  <a-button 
                    type="primary" 
                    size="small" 
                    class="buy-btn" 
                    @click.stop="buyItem(item)"
                  >
                    <template #icon><ShoppingCartOutlined /></template>
                    购买
                  </a-button>
                  <a-button 
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
        <div v-if="noMoreData && displayItems.length > 0" class="no-more-container">
          <a-divider>
            <smile-outlined />
            <span class="no-more-text">已经到底了，没有更多商品了</span>
          </a-divider>
        </div>
        
        <!-- 空状态 -->
        <div v-if="!loading && displayItems.length === 0" class="empty-container">
          <a-empty description="暂无商品数据">
            <a-button type="primary" @click="resetSearch">重新加载</a-button>
          </a-empty>
        </div>
      </div>
    </div>
    
    <!-- 回到顶部按钮 -->
    <a-back-top :visibility-height="300" :target="backTopTarget"  class="back-top"/>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { message, Modal } from "ant-design-vue";
import { ShoppingCartOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons-vue';
import Myserach from '@/components/searchcompent.vue';
import {getproducts} from '@/api'
// 商品类别配置
const categories = [
  { label: '全部', value: 'all' },
  { label: '学习用品', value: 'study' },
  { label: '生活用品', value: 'life' },
  { label: '电子产品', value: 'electronic' },
  { label: '美妆护肤', value: 'makeup' },
  { label: '服装鞋包', value: 'clothing' },
  { label: '食品饮料', value: 'food' },
  { label: '其他', value: 'others' },
];

// 响应式数据
const items = ref([]);
const loading = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(12);
const searchParams = reactive({
  keyword: '',
  category: 'all'
});

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

// 计算属性：过滤后的显示项目
const displayItems = computed(() => {
  let filtered = items.value;
  
  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }
  
  if (searchParams.category !== 'all') {
    filtered = filtered.filter(item => item.category === searchParams.category);
  }
  
  return filtered;
});

// 根据值获取类别标签
const getCategoryLabel = (value) => {
  const category = categories.find(cat => cat.value === value);
  return category ? category.label : '其他';
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

// 处理搜索
const handleSearch = (params) => {
  searchParams.keyword = params.keyword || '';
  searchParams.category = params.types || 'all';
  
  items.value = [];
  currentPage.value = 1;
  noMoreData.value = false;
  
  loadMore();
};

// 重置搜索
const resetSearch = () => {
  searchParams.keyword = '';
  searchParams.category = 'all';
  items.value = [];
  currentPage.value = 1;
  noMoreData.value = false;
  loadMore();
};

// 查看商品详情
const viewItemDetail = (item) => {
  Modal.info({
    title: item.title,
    width: 600,
    content: `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${item.image}" alt="${item.title}" style="max-width: 100%; max-height: 300px;" />
      </div>
      <p><strong>价格：</strong>￥${item.price}</p>
      <p><strong>类别：</strong>${getCategoryLabel(item.category)}</p>
      <p><strong>位置：</strong>${item.location}</p>
      <p><strong>描述：</strong>${item.description}</p>
      <p><strong>发布时间：</strong>${new Date(item.createTime).toLocaleString()}</p>
    `,
    okText: '关闭'
  });
};

// 购买商品
const buyItem = (item) => {
  Modal.confirm({
    title: '确认购买',
    content: `您确定要购买「${item.title}」吗？价格：￥${item.price}`,
    okText: '确认购买',
    cancelText: '取消',
    onOk() {
      message.success(`购买成功！您已购买 ${item.title}`);
    }
  });
};

// 联系卖家
const contactSeller = (item) => {
  message.info(`请联系卖家：${item.seller || '未知卖家'}`);
};

// 生成模拟数据
const generateMockData = (count, startId = 1) => {
  const mockTitles = {
    study: ['高等数学教材', '英语四级词汇', '考研政治笔记', '编程入门教程', '学术论文写作指南'],
    life: ['保温杯', '台灯', '收纳箱', '床上小桌', '瑜伽垫'],
    electronic: ['二手iPhone', '笔记本电脑', '蓝牙耳机', '机械键盘', '平板电脑'],
    makeup: ['口红', '面膜', '防晒霜', '眼影盘', '粉底液'],
    clothing: ['卫衣', '牛仔裤', '运动鞋', '羽绒服', '连衣裙'],
    food: ['速溶咖啡', '方便面', '小零食', '能量饮料', '饼干'],
    others: ['自行车', '吉他', '画板', '健身器材', '盆栽']
  };
  
  const locations = ['教学楼A区', '宿舍楼B栋', '图书馆', '食堂门口', '运动场'];
  const sellers = ['张三', '李四', '王五', '赵六', '钱七'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const categoryKeys = Object.keys(mockTitles).filter(key => key !== 'all');
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const titles = mockTitles[category];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    return {
      id,
      title: `${title} ${id}`,
      price: Math.floor(Math.random() * 500) + 10,
      image: `https://picsum.photos/300/200?random=${id}`,
      category,
      description: `这是${title}的详细描述，商品状况良好，欢迎前来查看。`,
      location: locations[Math.floor(Math.random() * locations.length)],
      seller: sellers[Math.floor(Math.random() * sellers.length)],
      createTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    };
  });
};

// 模拟API请求
const fetchItems = async (page, size) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startIndex = (page - 1) * size;
  
  if (startIndex >= totalItems.value) {
    return { items: [], hasMore: false };
  }
  
  const endIndex = Math.min(startIndex + size, totalItems.value);
  const count = endIndex - startIndex;
  
  return {
    items: generateMockData(count, startIndex + 1),
    hasMore: endIndex < totalItems.value
  };
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
  console.log(`开始加载第 ${currentPage.value} 页数据...`);
  
  try {
    const result = await fetchItems(currentPage.value, pageSize.value);
    
    if (result.items.length > 0) {
      items.value.push(...result.items);
      currentPage.value++;
      console.log(`成功加载 ${result.items.length} 条数据，当前总数: ${items.value.length}`);
    }
    
    noMoreData.value = !result.hasMore;
    
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

const test = async()=>{
  const res = await getproducts({
    q:'手机',
  });
  console.log("21321",res);
  console.log(res.data);
}

// 初始化加载数据
onMounted(() => {
  test();
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