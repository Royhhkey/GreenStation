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
                {{
                  productDetail.categoryName ||
                  getCategoryLabel(productDetail.categoryId)
                }}
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
            <div class="description-text">
              {{ productDetail.description || '暂无详细描述' }}
            </div>
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
  HeartFilled,
} from '@ant-design/icons-vue';

// 接收父组件传递的props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  productData: {
    type: Object,
    default: () => ({}),
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

// 定义emit事件
const emit = defineEmits(['update:visible', 'contact-seller']);

// 响应式数据
const isFavorite = ref(false);
const productDetail = ref({});

// 计算属性
const categoryMap = computed(() => {
  const map = {};
  props.categories.forEach((cat) => {
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
      minute: '2-digit',
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

  //   const sellerName = productDetail.value.user?.username || '未知卖家';
  //   message.info(`请联系卖家：${sellerName}`);
  emit('contact-seller', productDetail.value);
};

// const toggleFavorite = () => {
//   isFavorite.value = !isFavorite.value;
//   message.success(isFavorite.value ? '已收藏商品' : '已取消收藏');
// };

const handleImageError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/image.png';
};

// 监听productData变化，更新详情数据
watch(
  () => props.productData,
  (newProduct) => {
    if (newProduct && Object.keys(newProduct).length > 0) {
      productDetail.value = {
        ...newProduct,
        // 可以在这里添加一些默认值或转换逻辑
        isSold: newProduct.isSold || false,
        originalPrice: newProduct.originalPrice || null,
      };
    }
  },
  { immediate: true },
);

// 监听visible变化，重置状态
watch(
  () => props.visible,
  (newVisible) => {
    if (!newVisible) {
      // 关闭弹窗时重置收藏状态
      isFavorite.value = false;
    }
  },
);
</script>

<style scoped>
.product-detail-modal :deep(.ant-modal-body) {
  padding: 0 10px 10px 20px;
  min-height: 60vh;
  overflow-y: auto;
  transition: background-color var(--transition-normal);
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
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  display: flex;
  flex-direction: column;
  transition: background-color var(--transition-normal);
}

.main-image {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-cardBackground);
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--theme-borderLight);
  transition: all var(--transition-normal);
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
  overflow-y: auto;
}

.basic-info {
  border-bottom: 1px solid var(--theme-border);
  padding-bottom: 16px;
  flex-shrink: 0;
  transition: border-color var(--transition-normal);
}

.product-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--theme-textPrimary);
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  transition: color var(--transition-normal);
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
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.attributes {
  margin: 16px 0;
  flex-shrink: 0;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
  color: var(--theme-textSecondary);
  background: var(--theme-surfaceBackground);
  transition: all var(--transition-normal);
}

:deep(.ant-descriptions-item-content) {
  color: var(--theme-textPrimary);
  background: var(--theme-cardBackground);
  transition: all var(--transition-normal);
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label),
:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  border-color: var(--theme-border);
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
  color: var(--theme-textPrimary);
  flex-shrink: 0;
  transition: color var(--transition-normal);
}

.description-content {
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
  line-height: 1.6;
  color: var(--theme-textSecondary);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--theme-borderLight);
  transition: all var(--transition-normal);
}

.description-text {
  margin: 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  line-height: 1.6;
  padding: 8px;
  background: var(--theme-cardBackground);
  border-radius: var(--radius-sm);
  color: var(--theme-textPrimary);
  transition: all var(--transition-normal);
}

/* 自定义描述文本的滚动条 */
.description-text::-webkit-scrollbar {
  width: 4px;
}

.description-text::-webkit-scrollbar-track {
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-sm);
}

.description-text::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.description-text::-webkit-scrollbar-thumb:hover {
  background: var(--theme-textTertiary);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--theme-border);
  background: var(--theme-cardBackground);
  transition: all var(--transition-normal);
}

.contact-btn {
  flex: 1;
  height: 44px;
  font-size: 16px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 500;
  box-shadow: var(--theme-shadow);
  transition: all var(--transition-normal);
}

.contact-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--theme-shadowMedium);
  opacity: 0.9;
}

.contact-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--theme-shadow);
}

.contact-btn:disabled {
  background: var(--theme-border);
  color: var(--theme-textTertiary);
  cursor: not-allowed;
  box-shadow: none;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-container p {
  margin-top: 12px;
  color: var(--theme-textTertiary);
  transition: color var(--transition-normal);
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
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
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
    min-height: 100px;
  }

  .section-title {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .description-content {
    padding: 8px;
    min-height: 80px;
  }

  .description-text {
    font-size: 14px;
    padding: 6px;
  }

  .action-buttons {
    gap: 8px;
    padding-top: 16px;
    background: var(--theme-cardBackground);
  }

  .contact-btn {
    height: 44px;
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

  .contact-btn {
    height: 44px;
    min-height: 44px;
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
  content: '暂无详细描述';
  color: var(--theme-textTertiary);
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
  background: var(--theme-cardBackground);
  border-radius: var(--radius-xl);
  box-shadow: var(--theme-shadowHeavy);
  transition: all var(--transition-normal);
}

.detail-modal-wrap .ant-modal-header {
  background: var(--theme-cardBackground);
  border-bottom: 1px solid var(--theme-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  transition: all var(--transition-normal);
}

.detail-modal-wrap .ant-modal-title {
  color: var(--theme-textPrimary);
  font-weight: 600;
  transition: color var(--transition-normal);
}

.detail-modal-wrap .ant-modal-close {
  color: var(--theme-textSecondary);
  transition: color var(--transition-fast);
}

.detail-modal-wrap .ant-modal-close:hover {
  color: var(--theme-textPrimary);
  background: var(--theme-surfaceBackground);
}

.detail-modal-wrap .ant-modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--theme-cardBackground);
}

/* 移动端 Modal 样式调整 */
@media (max-width: 768px) {
  .detail-modal-wrap .ant-modal {
    width: 85vw !important;
    max-width: 85vw;
    margin: 10px auto;
  }

  .detail-modal-wrap .ant-modal-content {
    border-radius: var(--radius-lg);
  }

  .detail-modal-wrap .ant-modal-header {
    padding: 12px 16px;
    flex-shrink: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .detail-modal-wrap .ant-modal-title {
    font-size: 16px;
  }

  .detail-modal-wrap .ant-modal-close {
    top: 12px;
    right: 16px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail-modal-wrap .ant-modal-body {
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
    border-radius: var(--radius-md);
  }

  .detail-modal-wrap .ant-modal-header {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
}
</style>
