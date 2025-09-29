<template>
  <a-modal
    :open="visible"
    :title="productDetail.title"
    width="800px"
    :footer="null"
    @cancel="handleCancel"
    @update:open="handleOpenChange"
    class="product-detail-modal"
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
          <h1 class="product-title">{{ productDetail.title }}</h1>
          <div class="price-section">
            <span class="price">￥{{ productDetail.price }}</span>
            <!-- <span class="original-price" v-if="productDetail.originalPrice">
              原价：￥{{ productDetail.originalPrice }}
            </span> -->
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
            <!-- <a-descriptions-item label="商品状态">
              <a-tag :color="productDetail.isSold ? 'red' : 'green'">
                {{ productDetail.isSold ? '已售出' : '在售中' }}
              </a-tag>
            </a-descriptions-item> -->
            <a-descriptions-item label="发布时间" :span="1">
              {{ formatTime(productDetail.createTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="卖家信息" :span="1">
              {{ productDetail.user?.username || '未知卖家' }}
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- 商品描述 -->
        <div class="description-section">
          <h3 class="section-title">商品描述</h3>
          <div class="description-content">
            <p>{{ productDetail.description || '暂无详细描述' }}</p>
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
            <!-- {{ productDetail.isSold ? '商品已售出' : '联系卖家' }} -->
          </a-button>
          
          <!-- <a-button 
            size="large" 
            class="favorite-btn"
            @click="toggleFavorite"
          >
            <template #icon>
              <HeartOutlined v-if="!isFavorite" />
              <HeartFilled v-else style="color: #ff4d4f" />
            </template>
            {{ isFavorite ? '已收藏' : '收藏商品' }}
          </a-button> -->
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
  max-height: 70vh;
  overflow-y: auto;
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 0;
}

.image-section {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px 0 0 8px;
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
}

.basic-info {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.product-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
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

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.attributes {
  margin: 16px 0;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
}

.description-section {
  margin: 16px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.description-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  line-height: 1.6;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.contact-btn,
.favorite-btn {
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

/* 响应式设计 */
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
    height: 250px;
  }
  
  .product-title {
    font-size: 18px;
  }
  
  .price {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>