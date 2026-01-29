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
.products-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.products-header {
  margin-bottom: 20px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
}

/* 商品列表样式 */
.product-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  min-width: 300px;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 12px;
}

.category-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.category-tag :deep(.ant-tag) {
  margin: 0;
  font-size: 16px;
  padding: 2px 6px;
  line-height: 1;
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.change-status-btn {
  border: none;
  background-color: #000;
  color: #fff;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.change-status-btn:hover {
  background-color: #ff7875;
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(255, 120, 117, 0.4);
}

.change-status-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.product-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.product-info {
  text-align: left;
  padding: 8px 0;
}

.product-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.product-info-left {
  flex: 1;
  min-width: 0;
}

.product-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.product-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.product-price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.product-time {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
}

:deep(.ant-tag) {
  margin: 0;
  font-size: 11px;
  padding: 2px 6px;
  line-height: 1;
}

.empty-products {
  padding: 60px 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .product-list {
    padding: 20px 0px;
  }
}
</style>
