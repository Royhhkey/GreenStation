<template>
  <div class="profile-page">
    <!-- 头部信息卡片 -->
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="avatar-section">
        <div class="avatar-container">
          <img
            :src="
              userInfo.avatar ||
              'https://eo-oss.roy22.xyz/secondHand/avatar.png'
            "
            alt="用户头像"
            class="avatar"
            @error="handleAvatarError"
          />
          <div class="edit-avatar-btn" @click="showAvatarEdit = true">
            <EditOutlined />
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="user-id">ID: {{ userInfo.id }}</p>
          <!-- <a-button 
            type="primary" 
            class="edit-profile-btn"
            @click="showEditModal = true"
          >
            <template #icon><EditOutlined /></template>
            编辑资料
          </a-button> -->
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 个人信息卡片 -->
      <a-card class="info-card">
        <template #title>
          <div class="info-card-title-container">
            <div class="info-card-title">
              {{ isEditing ? '编辑个人信息' : '个人信息' }}
            </div>
            <div>
              <a-button
                v-if="!isEditing"
                type="primary"
                class="edit-profile-btn"
                @click="isEditing = true"
              >
                <template #icon><EditOutlined /></template>
                编辑资料
              </a-button>

              <div v-else class="edit-actions">
                <a-button type="primary" class="save-btn" @click="saveEditing">
                  <template #icon><CheckOutlined /></template>
                  保存
                </a-button>
                <a-button style="margin-left: 8px" @click="isEditing = false">
                  <template #icon><CloseOutlined /></template>
                  取消
                </a-button>
              </div>
            </div>
          </div>
        </template>

        <a-descriptions :column="1" bordered>
          <!-- <a-descriptions-item label="用户名">
              {{ userInfo.username }}
            </a-descriptions-item> -->
          <a-descriptions-item label="用户名">
            <span v-if="!isEditing">{{ userInfo.username || '未设置' }}</span>
            <a-input
              v-else
              v-model:value="editForm.username"
              size="small"
              placeholder="请输入用户名"
            />
          </a-descriptions-item>

          <a-descriptions-item label="学号">
            <span v-if="!isEditing">{{ userInfo.XH || '未设置' }}</span>
            <a-input
              v-else
              v-model:value="editForm.XH"
              size="small"
              placeholder="请输入学号"
            />
          </a-descriptions-item>

          <a-descriptions-item label="邮箱">
            <span v-if="!isEditing">{{ userInfo.email || '未设置' }}</span>
            <a-input
              v-else
              v-model:value="editForm.email"
              size="small"
              placeholder="请输入邮箱"
            />
          </a-descriptions-item>

          <a-descriptions-item label="手机号">
            <span v-if="!isEditing">{{
              userInfo.phoneNumber || '未设置'
            }}</span>
            <a-input
              v-else
              v-model:value="editForm.phoneNumber"
              size="small"
              placeholder="请输入手机号"
            />
          </a-descriptions-item>

          <a-descriptions-item label="寝室">
            <span v-if="!isEditing">{{ userInfo.QSH || '未填写' }}</span>
            <a-input
              v-else
              v-model:value="editForm.QSH"
              size="small"
              placeholder="请输入寝室"
            />
          </a-descriptions-item>

          <a-descriptions-item label="年级">
            <span v-if="!isEditing">{{ userInfo.grade || '未填写' }}</span>
            <a-input
              v-else
              v-model:value="editForm.grade"
              size="small"
              placeholder="请输入年级"
            />
          </a-descriptions-item>

          <a-descriptions-item label="专业">
            <span v-if="!isEditing">{{ userInfo.ZY || '未填写' }}</span>
            <a-input
              v-else
              v-model:value="editForm.ZY"
              size="small"
              placeholder="请输入专业"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 我的商品 -->
      <a-card title="我的商品" class="products-card">
        <div class="products-header">
          <a-button type="primary" @click="showProductModal = true">
            <template #icon><PlusOutlined /></template>
            发布商品
          </a-button>
        </div>

        <a-list
          :grid="gridConfig"
          :data-source="myProducts"
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
                      {{ item.category_info.cname }}
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
                      @click.stop="toggleProductStatus(item)"
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
        <div v-if="!loading && myProducts.length === 0" class="empty-products">
          <a-empty description="暂无商品">
            <a-button type="primary" @click="showProductModal = true">
              发布第一个商品
            </a-button>
          </a-empty>
        </div>
      </a-card>
    </div>

    <!-- 头像编辑弹窗 -->
    <a-modal
      v-model:open="showAvatarEdit"
      title="更换头像"
      width="400px"
      :footer="null"
    >
      <div class="avatar-edit-modal">
        <div class="avatar-preview">
          <img :src="avatarPreview" alt="头像预览" class="preview-image" />
        </div>

        <!-- 修改上传组件，添加 ref -->
        <a-upload
          ref="avatarUploadRef"
          :before-upload="beforeAvatarUpload"
          :show-upload-list="false"
          accept="image/*"
        >
          <a-button>
            <UploadOutlined />
            选择图片
          </a-button>
        </a-upload>

        <div class="avatar-actions">
          <a-button @click="showAvatarEdit = false">取消</a-button>
          <a-button
            type="primary"
            @click="handleAvatarSave"
            :loading="avatarLoading"
          >
            保存
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 发布/编辑商品弹窗 -->
    <ProductModal
      v-model:visible="showProductModal"
      :product-data="editingProduct"
      :categories="categories"
      @save="handleProductSave"
      @cancel="handleProductCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';
import ProductModal from '@/components//profile/ProductModal.vue';
import {
  removeEmptyProperties,
  objectToString,
  replaceUrlRegex,
  extractDateFromISO,
  getChangedValues,
} from '@/utils';
import {
  getMyproduct,
  ModifyUserInfo,
  AvatarUpload,
  DeleteProduct,
  CreateProduct,
  ModifyProduct,
} from '@/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
// 用户信息
const userInfo = ref({
  id: '12345',
  username: 'Roy',
  email: 'roy@example.com',
  phoneNumber: '138****8888',
  avatar: 'https://eo-oss.roy22.xyz/secondHand/avatar.png',
});

// 响应式数据

const showAvatarEdit = ref(false);
const showProductModal = ref(false);
const loading = ref(false);
const avatarPreview = ref('');
const editingProduct = ref(null);
const isEditing = ref(false);
const avatarLoading = ref(false);
const avatarUploadRef = ref(null); // 添加 ref 引用上传组件
const selectedAvatarFile = ref(null); // 存储选中的文件

const editForm = ref(userInfo.value);

watch(
  userInfo,
  (newVal, oldVal) => {
    editForm.value = { ...newVal };
  },
  { immediate: true },
);

// 商品类别
const categories = [
  { label: '学习用品', value: '4' },
  { label: '生活用品', value: '5' },
  { label: '电子产品', value: '6' },
  { label: '美妆护肤', value: '7' },
  { label: '服装鞋包', value: '8' },
  { label: '食品饮料', value: '9' },
  { label: '其他', value: '10' },
];
// 我的商品列表
const myProducts = ref([]);

const gridConfig = computed(() => ({
  gutter: 12,
  xs: 1,
  sm: 1,
  md: 1,
  lg: 1,
  xl: 2,
  xxl: 2,
}));
const saveEditing = async () => {
  isEditing.value = false;
  console.log('保存编辑', editForm.value);
  console.log('原始数据', userInfo.value);
  const changes = getChangedValues(userInfo.value, editForm.value);
  console.log('变化数据', changes);
  if (JSON.stringify(changes) === '{}') {
    message.info('未做任何修改');
    return;
  }
  // 这里调用API修改用户信息
  const { data } = await ModifyUserInfo(changes);
  if (data.code == '01') {
    message.success('修改成功');
    userInfo.value = { ...userInfo.value, ...editForm.value };
    authStore.updateUserInfo(editForm.value);
    console.log('修改后数据', userInfo.value);
    // userInfo.value = data.data
  } else {
    message.error(data.msg || '修改失败');
  }
  // console.log('changes', changes);
};

const handleAvatarError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
};

const handleProductImageError = (event) => {
  event.target.src = 'https://eo-oss.roy22.xyz/secondHand/image.png';
};

// 头像上传前处理
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
    return false;
  }

  // 保存选中的文件
  selectedAvatarFile.value = file;

  // 预览图片
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
  };

  return false; // 阻止自动上传
};

// 保存头像
const handleAvatarSave = async () => {
  if (!avatarPreview.value || !selectedAvatarFile.value) {
    message.warning('请选择头像图片');
    return;
  }

  try {
    avatarLoading.value = true;

    // 创建 FormData 对象并添加头像图片
    const formData = new FormData();
    formData.append('avatar', selectedAvatarFile.value);

    // 调用 API 上传头像
    const { data } = await AvatarUpload(formData);

    if (data.code === '01') {
      message.success('头像更新成功');

      // 更新用户信息中的头像 URL
      // 注意：这里使用 API 返回的 URL，而不是本地的 base64
      userInfo.value.avatar = data.data?.url || avatarPreview.value;

      // 更新全局用户信息状态
      authStore.updateUserInfo({ avatar: userInfo.value.avatar });

      showAvatarEdit.value = false;
      avatarPreview.value = '';
      selectedAvatarFile.value = null;

      // 重置上传组件
      if (avatarUploadRef.value) {
        // 清空上传组件的文件列表
        avatarUploadRef.value.fileList = [];
      }
    } else {
      message.error(data.msg || '头像更新失败');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    message.error('头像上传失败，请重试');
  } finally {
    avatarLoading.value = false;
  }
};

// 编辑商品
const editProduct = (product) => {
  console.log('product', product);
  editingProduct.value = { ...product };
  showProductModal.value = true;
};

// 删除商品
const deleteProduct = async (productId) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个商品吗？此操作不可恢复。',
    onOk: async () => {
      try {
        // 这里调用API删除商品
        const { data } = await DeleteProduct(productId);
        // console.log(data);
        if (data.code == '01') {
          myProducts.value = myProducts.value.filter((p) => p.id !== productId);
          message.success('商品删除成功');
        }
      } catch (error) {
        message.error('商品删除失败');
      }
    },
  });
};
const updatateProduct = async (id, datas) => {
  const { data } = await ModifyProduct(id, datas);
  console.log(data);

  return data;
};
const toggleProductStatus = (item) => {
  console.log(item);
  item.is_sold = !item.is_sold;
  updatateProduct(item.id, { is_sold: item.is_sold });
};

// 保存商品
const handleProductSave = async (productData) => {
  console.log('productData', productData);
  console.log('editingProduct', editingProduct.value);
  console.log('myProducts before', myProducts.value);
  const submitData = new FormData();

  // 添加文件到formData
  if (productData.image) {
    submitData.append('image', productData.image);
  }

  // 添加其他表单数据到formData
  if (productData.name) {
    submitData.append('name', productData.name);
  }
  if (productData.price !== undefined && productData.price !== null) {
    submitData.append('price', productData.price.toString());
  }
  if (productData.description) {
    submitData.append('description', productData.description);
  }
  if (
    productData.category_info &&
    productData.category_info.cid !== undefined &&
    productData.category_info.cid !== null
  ) {
    submitData.append('category', Number(productData.category_info.cid));
  }
  if (editingProduct.value) {
    const id = editingProduct.value.id;
    const newData = await updatateProduct(id, submitData);

    const index = myProducts.value.findIndex((p) => p.id === id);
    console.log('index', index);
    if (index !== -1) {
      myProducts.value[index] = { ...newData.data, id: id };
    }

    message.success('商品更新成功');
  } else {
    const { data } = await CreateProduct(submitData);
    console.log('1213data', data);

    myProducts.value.unshift(data.data);
    message.success('商品发布成功');
  }

  showProductModal.value = false;
  editingProduct.value = null;
};

// 取消商品编辑
const handleProductCancel = () => {
  showProductModal.value = false;
  editingProduct.value = null;
};

const getmyProductsData = async () => {
  const { data } = await getMyproduct();

  myProducts.value = data.data.items;
  console.log(myProducts.value);
};

onMounted(() => {
  userInfo.value = authStore.userInfo;

  // Object.assign(editForm, userInfo.value);
  // console.log("editForm",editForm.value);
  avatarPreview.value = userInfo.value.avatar;
  console.log(userInfo.value);
  getmyProductsData();
});
</script>

<style scoped>
/* 或者使用深度选择器 */
:deep(.ant-input) {
  border-color: #1890ff;
  border-radius: 8px;
  padding: 8px;
}

:deep(.ant-input:focus) {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 头部样式 */
.profile-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 20px 60px;
  color: white;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.avatar-section {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
}

.avatar-container {
  position: relative;
  margin-bottom: -30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  background: white;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.edit-avatar-btn:hover {
  background: #40a9ff;
  transform: scale(1.1);
}

.user-info {
  flex: 1;
  padding-bottom: 20px;
}

.username {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-id {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 16px;
}

/* 内容区域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

.info-card,
.products-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.info-card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  /* background: #f5f5f5; */
  border-radius: 12px 12px 0 0;
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
  background-color: #000; /* 默认背景颜色 */
  color: #fff; /* 文字颜色 */
  padding: 2px 4px; /* 内边距，使按钮看起来更饱满 */
  font-size: 12px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  border-radius: 5px; /* 圆角边框 */
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.change-status-btn:hover {
  background-color: #ff7875; /* 鼠标悬停时的背景颜色 */
  color: #fff; /* 鼠标悬停时的文字颜色 */
  transform: scale(1.05); /* 鼠标悬停时稍微放大 */
  box-shadow: 0 5px 15px rgba(255, 120, 117, 0.4); /* 鼠标悬停时的阴影效果 */
}

.change-status-btn:active {
  transform: scale(0.95); /* 按下时稍微缩小 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 按下时的阴影效果 */
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
  min-width: 0; /* 防止内容溢出 */
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

/* 确保标签样式合适 */
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

/* 头像编辑弹窗 */
.avatar-edit-modal {
  text-align: center;
}

.avatar-preview {
  margin-bottom: 20px;
}

.preview-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.avatar-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 100px 16px 50px;
  }
  .product-list {
    padding: 20px 0px;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    margin-bottom: 0;
  }

  .avatar-container {
    margin-bottom: 0;
  }

  .user-info {
    padding-bottom: 0;
  }

  .username {
    font-size: 24px;
  }

  .profile-content {
    grid-template-columns: 1fr;
    padding: 50px 16px 30px;
    gap: 20px;
  }

  /* .product-image {
    height: 250px;
  } */

  .grid-config {
    gutter: 12;
    xs: 1;
    sm: 1;
    md: 1;
    lg: 1;
    xl: 2;
    xxl: 2;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 80px 12px 40px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .username {
    font-size: 20px;
  }

  .profile-content {
    padding: 40px 12px 20px;
  }

  /* .product-image {
    height: 120px;
  } */
}
</style>
