<template>
  <div class="item-detail">
    <div class="item-header">
      <a-page-header
        :title="item.title"
        @back="goBack"
      />
    </div>
    
    <div class="item-content">
      <a-row :gutter="24">
        <!-- 左侧商品图片 -->
        <a-col :span="12">
          <div class="item-image">
            <img :src="item.image" :alt="item.title" />
          </div>
        </a-col>
        
        <!-- 右侧商品信息 -->
        <a-col :span="12">
          <div class="item-info">
            <h1 class="title">{{ item.title }}</h1>
            <div class="price">
              <span class="price-label">价格：</span>
              <span class="price-value">¥{{ item.price }}</span>
            </div>
            
            <div class="seller-info">
              <h3>卖家信息</h3>
              <a-descriptions>
                <a-descriptions-item label="卖家">
                  {{ item.seller.name }}
                </a-descriptions-item>
                <a-descriptions-item label="联系方式">
                  {{ item.seller.contact }}
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="item-status">
              <a-tag :color="item.status === '在售' ? 'green' : 'red'">
                {{ item.status }}
              </a-tag>
              <a-tag color="blue">{{ item.category }}</a-tag>
            </div>

            <div class="action-buttons">
              <a-button type="primary" size="large" @click="handleBuy">
                立即购买
              </a-button>
              <a-button size="large" @click="handleContact">
                联系卖家
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- 商品详情描述 -->
      <div class="item-description">
        <a-divider orientation="left">商品详情</a-divider>
        <div class="description-content">
          <h3>商品描述</h3>
          <p>{{ item.description }}</p>
          
          <h3>商品状况</h3>
          <p>{{ item.condition }}</p>

          <h3>交易方式</h3>
          <p>{{ item.tradeMethod }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

// 模拟商品数据，实际应该从API获取
const item = ref({
  id: 1,
  title: '二手教材《大学物理》',
  price: 30,
  image: 'https://via.placeholder.com/400x300?text=教材',
  description: '九成新，只翻阅过几次，无笔记，适合新生购买。',
  condition: '九成新，无破损',
  tradeMethod: '校园当面交易',
  status: '在售',
  category: '教材',
  seller: {
    name: '张同学',
    contact: '13800138000'
  }
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 购买商品
const handleBuy = () => {
  message.success('购买请求已发送');
  // 这里添加购买逻辑
};

// 联系卖家
const handleContact = () => {
  message.info(`请联系卖家：${item.value.seller.contact}`);
};

onMounted(async () => {
  // 这里可以根据路由参数获取商品详情
  const itemId = route.params.id;
  // const response = await getItemDetail(itemId);
  // item.value = response.data;
});
</script>

<style scoped>
.item-detail {
  padding: 20px;
  background: #fff;
  min-height: 100vh;
}

.item-content {
  margin-top: 20px;
}

.item-image {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.item-info {
  padding: 0 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.price {
  margin: 20px 0;
}

.price-label {
  font-size: 16px;
  color: #666;
}

.price-value {
  font-size: 28px;
  color: #f5222d;
  font-weight: bold;
  margin-left: 8px;
}

.seller-info {
  margin: 20px 0;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

.item-status {
  margin: 16px 0;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}

.item-description {
  margin-top: 40px;
}

.description-content {
  padding: 0 20px;
}

.description-content h3 {
  margin: 16px 0 8px;
  color: #333;
}

.description-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .item-detail {
    padding: 10px;
  }

  .item-info {
    padding: 0;
    margin-top: 20px;
  }

  .title {
    font-size: 20px;
  }

  .price-value {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .description-content {
    padding: 0;
  }
}
</style>