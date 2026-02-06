<!-- components/profile/UserProductsCard.vue -->
<template>
  <a-card title="我的商品" class="products-card">
    <div class="products-header">
      <a-button type="primary" @click="addProduct">
        <template #icon><PlusOutlined /></template>
        发布商品
      </a-button>
    </div>

    <a-list
      :grid="gridConfig"
      :data-source="products"
      :loading="loading"
      class="product-list"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card
            hoverable
            class="product-card"
            :body-style="{ padding: '12px' }"
            @click="editProduct(item)"
          >
            <div class="product-image">
              <!-- 添加类别标签 -->
              <div class="category-tag">
                <a-tag color="blue" size="small">
                  {{ item.category_info?.cname }}
                </a-tag>
              </div>
              <img
                :src="replaceUrlRegex(item.image)"
                :alt="item.title"
                @error="handleProductImageError"
              />
              <div class="product-actions">
                <!-- 状态切换按钮 -->
                <a-button
                  size="small"
                  @click.stop="toggleStatus(item)"
                  :class="item.is_sold ? 'status-sold' : 'status-onsale'"
                  class="change-status-btn"
                >
                  <template #icon>
                    <SwapOutlined />
                  </template>
                  {{ item.is_sold ? '设为在售' : '设为售出' }}
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  @click.stop="editProduct(item)"
                >
                  <EditOutlined />
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  danger
                  @click.stop="deleteProduct(item.id)"
                >
                  <DeleteOutlined />
                </a-button>
              </div>
            </div>
            <div class="product-info">
              <div class="product-info-row">
                <div class="product-info-left">
                  <h4 class="product-title">{{ item.name }}</h4>
                  <p class="product-price">￥{{ item.price }}</p>
                </div>
                <div class="product-info-right">
                  <p class="product-time">
                    {{ extractDateFromISO(item.created_at) }}
                  </p>
                  <a-tag :color="item.is_sold ? 'red' : 'green'">
                    {{ item.is_sold ? '已售出' : '在售中' }}
                  </a-tag>
                </div>
              </div>
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <!-- 空状态 -->
    <div v-if="!loading && products.length === 0" class="empty-products">
      <a-empty description="暂无商品">
        <a-button type="primary" @click="addProduct"> 发布第一个商品 </a-button>
      </a-empty>
    </div>
  </a-card>
</template>

<script setup>
import { computed } from 'vue';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue';
import { replaceUrlRegex, extractDateFromISO } from '@/utils';

const props = defineProps({
  products: Array,
  loading: Boolean,
  categories: Array,
});

const emit = defineEmits([
  'addProduct',
  'editProduct',
  'deleteProduct',
  'toggleStatus',
]);

const gridConfig = computed(() => ({
  gutter: 12,
  xs: 1,
  sm: 1,
  md: 1,
  lg: 1,
  xl: 2,
  xxl: 2,
}));

const addProduct = () => {
  emit('addProduct');
};

const editProduct = (product) => {
  emit('editProduct', product);
};

const deleteProduct = (productId) => {
  emit('deleteProduct', productId);
};

const toggleStatus = (item) => {
  emit('toggleStatus', item);
};

const handleProductImageError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/image.png';
};
</script>

<style scoped>
/* User Products Card - Theme-aware Design */
.products-card {
  border-radius: var(--radius-md);
  box-shadow: 0 2px 12px var(--theme-shadow);
  transition: all var(--transition-normal);
}

:deep(.ant-card) {
  background: var(--theme-cardBackground);
  border-color: var(--theme-border);
  border-radius: var(--radius-md);
}

:deep(.ant-card-head) {
  background: var(--theme-surfaceGradient);
  border-bottom-color: var(--theme-border);
}

:deep(.ant-card-head-title) {
  color: var(--theme-textPrimary);
  font-weight: 600;
}

:deep(.ant-card-body) {
  background: var(--theme-cardBackground);
}

.products-header {
  margin-bottom: var(--spacing-lg);
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
}

.product-list::-webkit-scrollbar {
  width: 8px;
}

.product-list::-webkit-scrollbar-track {
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
}

.product-list::-webkit-scrollbar-thumb {
  background: var(--theme-gradient);
  border-radius: var(--radius-md);
}

/* Product Card */
.product-card {
  transition: all var(--transition-normal);
  border-radius: var(--radius-sm);
  overflow: hidden;
  min-width: 300px;
  border: 1px solid var(--theme-border);
}

:deep(.product-card.ant-card) {
  background: var(--theme-cardBackground);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--theme-shadowMedium);
  border-color: var(--theme-primary);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
  background: var(--theme-surfaceBackground);
}

.category-tag {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  z-index: 2;
}

.category-tag :deep(.ant-tag) {
  margin: 0;
  font-size: 1rem;
  padding: 2px 6px;
  line-height: 1;
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 4px var(--theme-shadow);
  background: var(--theme-cardBackground);
  color: var(--theme-primary);
  border: 1px solid var(--theme-borderLight);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.change-status-btn {
  border: none;
  background: var(--theme-textPrimary);
  color: white;
  padding: 2px 4px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 5px var(--theme-shadow);
}

.change-status-btn:hover {
  background: #ff7875;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(255, 120, 117, 0.4);
}

.change-status-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px var(--theme-shadow);
}

.product-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.product-card:hover .product-actions {
  opacity: 1;
}

:deep(.product-actions .ant-btn) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-color: var(--theme-borderLight);
  color: var(--theme-primary);
  box-shadow: 0 2px 8px var(--theme-shadow);
}

:deep(.product-actions .ant-btn:hover) {
  background: white;
  border-color: var(--theme-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

.product-info {
  text-align: left;
  padding: var(--spacing-sm) 0;
}

.product-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.product-info-left {
  flex: 1;
  min-width: 0;
}

.product-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.product-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
  color: var(--theme-textPrimary);
}

.product-price {
  color: #ff4d4f;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.product-time {
  font-size: 0.75rem;
  color: var(--theme-textTertiary);
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
}

:deep(.ant-tag) {
  margin: 0;
  font-size: 0.6875rem;
  padding: 2px 6px;
  line-height: 1;
  border-radius: var(--radius-sm);
}

.empty-products {
  padding: 3.75rem var(--spacing-lg);
  text-align: center;
}

:deep(.ant-empty-description) {
  color: var(--theme-textSecondary);
}

:deep(.ant-btn-primary) {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

:deep(.ant-btn-primary:hover) {
  background: var(--theme-primaryHover);
  border-color: var(--theme-primaryHover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-list {
    padding: var(--spacing-lg) 0;
  }

  .product-image {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 180px;
  }

  .product-title {
    font-size: 0.8125rem;
  }

  .product-price {
    font-size: 0.9375rem;
  }
}
</style>
