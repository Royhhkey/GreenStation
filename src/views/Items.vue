<template>
  <div class="title">
          <Myserach 
            :categories="categories"
            @search="handleSearch"
          >
          </Myserach>

      <!-- <a-avatar 
            :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 90 }"
            :style="{ backgroundColor: color, verticalAlign: 'middle' }" 
            :gap="gap"
            src="/src/assets/test.png"
        >
          <template #icon>
            <a-icon type="user" />
          </template>
      </a-avatar> -->
  </div>
  <div class="items">
    <a-row :gutter="20">
      <a-col :span="8" v-for="item in items" :key="item.id">
        <a-card :body-style="{ padding: '10px' }" hoverable>
          <img :src="item.image" alt="" class="item-image" />
          <div class="item-info">
            <h4>{{ item.title }}</h4>
            <p>价格：￥{{ item.price }}</p>
          </div>
          <a-button type="primary" size="small" @click="buyItem(item)">购买</a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { message } from "ant-design-vue";
import Myserach from '@/components/searchcompent.vue'
const categories = [
  { label: '全部', value: 'all' },
  { label: '教材', value: 'textbook' },
  { label: '课外读物', value: 'extbook' },
  { label: '电子产品', value: 'electronics' },
  { label: '生活用品', value: 'daily' },
  { label: '其他', value: 'others' },
  { label: '二手书', value: 'book' },
  { label: '二手手机', value: 'phone' },
  { label: '二手自行车', value: 'bicycle' },
  { label: '二手电脑', value: 'computer' },
  { label: '二手笔记本电脑', value: 'laptop' },
  { label: '二手平板电脑', value: 'tablet' },
  { label: '二手游戏机', value: 'game' },
  { label: '二手数码相机', value: 'camera' },
  { label: '二手数码相机', value: 'camera' },
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
]);

function buyItem(item) {
  message.success(`已购买：${item.title}`);
}

const handleSearch = ({ types, keyword }) => {
  console.log('选中的类别:', types)
  console.log('搜索关键词:', keyword)
  // 实现搜索逻辑
}
</script>

<style scoped>
.items {
  padding: 20px;
  margin-top: 21.68vh;
}
.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
.item-info {
  margin: 10px 0;
}
.title{
  display: flex;
}

@media (max-width: 768px) {
  .items {
    padding: 8px;
  }
  .item-image {
    height: 120px;
  }
  .item-info {
    margin: 8px 0;
  }
  .title {
    flex-direction: column;
    align-items: flex-start;
  }
  /* 让每行只显示一个商品 */
  .items .ant-col-8 {
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
  .items .ant-card {
    margin-bottom: 16px;
  }
}
</style>