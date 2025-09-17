<template>
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
</script>

<style scoped>
.items {
  padding: 20px;
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
</style>