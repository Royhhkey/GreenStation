<template>
  <a-modal
    :open="visible"
    :title="productDetail.title"
    width="800px"
    :footer="null"
    @cancel="handleCancel"
    @update:open="handleOpenChange"
    class="product-detail-modal"
    wrap-class-name="detail-modal-wrap"
  >
    <div class="product-detail-content" v-if="productDetail">
      <!-- 商品图片区域 -->
      <div class="image-section">
        <div class="main-image">
          <img 
            :src="productDetail.image" 
            :alt="productDetail.title"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- 商品信息区域 -->
      <div class="info-section">
        <!-- 标题和价格 -->
        <div class="basic-info">
          <!-- <h1 class="product-title">{{ productDetail.title }}</h1> -->
          <div class="price-section">
            <span class="price">￥{{ productDetail.price }}</span>
          </div>
        </div>

        <!-- 商品属性 -->
        <div class="attributes">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="商品分类">
              <a-tag color="blue">
                {{ productDetail.categoryName || getCategoryLabel(productDetail.categoryId) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="发布时间" :span="1">
              {{ formatTime(productDetail.createTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="卖家用户名" :span="1">
              {{ productDetail.user?.username || '未知卖家' }}
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- 商品描述 -->
        <div class="description-section">
          <h3 class="section-title">商品描述</h3>
          <div class="description-content">
            <p class="description-text">{{ productDetail.description || '暂无详细描述' }}</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-button 
            type="primary" 
            size="large" 
            class="contact-btn"
            @click="contactSeller"
            :disabled="productDetail.isSold"
          >
            <template #icon><MessageOutlined /></template>
            联系卖家
          </a-button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <a-spin size="large" />
      <p>加载商品详情中...</p>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import { 
  MessageOutlined, 
  HeartOutlined, 
  HeartFilled 
} from '@ant-design/icons-vue';

// 接收父组件传递的props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  productData: {
    type: Object,
    default: () => ({})
  },
  categories: {
    type: Array,
    default: () => []
  }
});

// 定义emit事件
const emit = defineEmits(['update:visible', 'contact-seller']);

// 响应式数据
const isFavorite = ref(false);
const productDetail = ref({});

// 计算属性
const categoryMap = computed(() => {
  const map = {};
  props.categories.forEach(cat => {
    map[cat.value] = cat.label;
  });
  return map;
});

// 方法
const getCategoryLabel = (value) => {
  if (value === null || value === undefined) return '其他';
  const stringValue = String(value).trim();
  return categoryMap.value[stringValue] || '其他';
};

const formatTime = (timeString) => {
  if (!timeString) return '未知时间';
  try {
    return new Date(timeString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timeString;
  }
};

const handleCancel = () => {
  emit('update:visible', false);
};

const handleOpenChange = (open) => {
  emit('update:visible', open);
};

const contactSeller = () => {
  if (productDetail.value.isSold) {
    message.warning('该商品已售出，无法联系卖家');
    return;
  }
  
  const sellerName = productDetail.value.user?.username || '未知卖家';
  message.info(`请联系卖家：${sellerName}`);
  emit('contact-seller', productDetail.value);
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  message.success(isFavorite.value ? '已收藏商品' : '已取消收藏');
};

const handleImageError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/image.png';
};

// 监听productData变化，更新详情数据
watch(() => props.productData, (newProduct) => {
  if (newProduct && Object.keys(newProduct).length > 0) {
    productDetail.value = {
      ...newProduct,
      // 可以在这里添加一些默认值或转换逻辑
      isSold: newProduct.isSold || false,
      originalPrice: newProduct.originalPrice || null
    };
  }
}, { immediate: true });

// 监听visible变化，重置状态
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    // 关闭弹窗时重置收藏状态
    isFavorite.value = false;
  }
});
</script>

<style scoped>
.product-detail-modal :deep(.ant-modal-body) {
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 0;
  min-height: 0;
}

.image-section {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px 0 0 8px;
  display: flex;
  flex-direction: column;
}

.main-image {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info-section {
  padding: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.basic-info {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  flex-shrink: 0;
}

.product-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
}

.attributes {
  margin: 16px 0;
  flex-shrink: 0;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
}

.description-section {
  margin: 16px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  flex-shrink: 0;
}

.description-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  line-height: 1.6;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.description-text {
  margin: 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
  max-height: 200px; /* 移除最大高度限制 */
  padding-right: 4px;
}

/* 自定义描述文本的滚动条 */
.description-text::-webkit-scrollbar {
  width: 4px;
}

.description-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.description-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.description-text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1;
}

.contact-btn {
  flex: 1;
  height: 44px;
  font-size: 16px;
}

.contact-btn:disabled {
  background-color: #d9d9d9;
  border-color: #d9d9d9;
  color: #999;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-container p {
  margin-top: 12px;
  color: #999;
}

/* 响应式设计 - 平板 */
@media (max-width: 1024px) {
  .product-detail-content {
    gap: 20px;
  }
  
  .image-section {
    padding: 16px;
  }
  
  .info-section {
    padding: 16px 16px 16px 0;
  }
  
  .main-image {
    height: 280px;
  }
}

/* 响应式设计 - 移动端 */
@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .image-section {
    border-radius: 8px 8px 0 0;
    padding: 16px;
  }
  
  .info-section {
    padding: 16px;
  }
  
  .main-image {
    height: 220px;
    max-height: 40vh;
  }
  
  .product-title {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .price {
    font-size: 20px;
  }
  
  .attributes {
    margin: 12px 0;
  }
  
  .description-section {
    margin: 12px 0;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 8px;
  }
  
  .description-content {
    padding: 12px;
    font-size: 14px;
  }
  
  .description-text {
    font-size: 14px;
  }
  
  .action-buttons {
    gap: 8px;
    padding-top: 16px;
    position: sticky;
    bottom: 0;
    background: white;
  }
  
  .contact-btn{
    height: 40px;
    font-size: 14px;
  }
}

/* 超小屏幕手机 */
@media (max-width: 480px) {
  .image-section {
    padding: 12px;
  }
  
  .info-section {
    padding: 12px;
  }
  
  .main-image {
    height: 180px;
  }
  
  .product-title {
    font-size: 16px;
  }
  
  .price {
    font-size: 18px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .contact-btn{
    height: 38px;
  }
}

/* 横屏手机优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .main-image {
    height: 150px;
  }
}

/* 当描述内容很少时的样式 */
.description-text:empty::before {
  content: "暂无详细描述";
  color: #999;
  font-style: italic;
}
</style>

<style>
/* 全局样式，用于修改 Ant Design Modal 的样式 */
.detail-modal-wrap .ant-modal {
  margin: 20px auto;
}

.detail-modal-wrap .ant-modal-content {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.detail-modal-wrap .ant-modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 移动端 Modal 样式调整 */
@media (max-width: 768px) {
  .detail-modal-wrap .ant-modal {
    width: 85vw !important;
    max-width: 85vw;
    margin: 10px auto;
    max-height: 90vh;
  }
  
  .detail-modal-wrap .ant-modal-content {
    border-radius: 12px;
    max-height: 90vh;
  }
  
  .detail-modal-wrap .ant-modal-header {
    padding: 12px 16px;
    flex-shrink: 0;
  }
  
  .detail-modal-wrap .ant-modal-title {
    font-size: 16px;
  }
  
  .detail-modal-wrap .ant-modal-close {
    top: 12px;
    right: 16px;
  }
  
  .detail-modal-wrap .ant-modal-body {
    max-height: calc(90vh - 55px);
    overflow-y: auto;
  }
}

/* 超小屏幕进一步优化 */
@media (max-width: 480px) {
  .detail-modal-wrap .ant-modal {
    width: 88vw !important;
    max-width: 88vw;
    margin: 5px auto;
  }
  
  .detail-modal-wrap .ant-modal-content {
    border-radius: 8px;
  }
}

/* 横屏手机优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .detail-modal-wrap .ant-modal {
    max-height: 85vh;
  }
  
  .detail-modal-wrap .ant-modal-body {
    max-height: calc(85vh - 55px);
  }
}
</style>