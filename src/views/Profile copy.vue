<template>
  <div class="profile-page">
    <!-- 现代化头部信息卡片 -->
    <div class="profile-header">
      <div class="header-gradient"></div>
      <div class="header-pattern"></div>
      <div class="header-content">
        <div class="avatar-section">
          <div class="avatar-container">
            <div class="avatar-wrapper">
              <img
                :src="
                  userInfo.avatar ||
                  'https://eo-oss.roy22.xyz/secondHand/avatar.png'
                "
                alt="用户头像"
                class="avatar"
                @error="handleAvatarError"
              />
              <div class="avatar-ring"></div>
              <div class="edit-avatar-btn" @click="showAvatarEdit = true">
                <EditOutlined />
              </div>
            </div>
          </div>
          <div class="user-info">
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 个人信息卡片 - 现代化玻璃态设计 -->
      <div class="modern-card info-card">
        <div class="card-header">
          <div class="card-title-wrapper">
            <div class="card-icon">👤</div>
            <h3 class="card-title">
              {{ isEditing ? '编辑个人信息' : '个人信息' }}
            </h3>
          </div>
          <div class="card-actions">
            <a-button
              v-if="!isEditing"
              type="primary"
              class="modern-btn edit-profile-btn"
              @click="isEditing = true"
            >
              <template #icon><EditOutlined /></template>
              编辑资料
            </a-button>

            <div v-else class="edit-actions flex">
              <a-button
                type="primary"
                class="modern-btn save-btn"
                @click="saveEditing"
              >
                <template #icon><CheckOutlined /></template>
                保存
              </a-button>
              <a-button
                class="modern-btn cancel-btn"
                @click="isEditing = false"
              >
                <template #icon><CloseOutlined /></template>
                取消
              </a-button>
            </div>
          </div>
        </div>
        <div class="card-body">

          <div class="info-list">
            <div class="info-item">
              <div class="info-label">用户名</div>
              <div class="info-value">
                <span v-if="!isEditing">{{
                  userInfo.username || '未设置'
                }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.username"
                  class="modern-input"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">学号</div>
              <div class="info-value">
                <span v-if="!isEditing">{{ userInfo.XH || '未设置' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.XH"
                  class="modern-input"
                  placeholder="请输入学号"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">邮箱</div>
              <div class="info-value">
                <span v-if="!isEditing">{{ userInfo.email || '未设置' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.email"
                  class="modern-input"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">手机号</div>
              <div class="info-value">
                <span v-if="!isEditing">{{
                  userInfo.phoneNumber || '未设置'
                }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.phoneNumber"
                  class="modern-input"
                  placeholder="请输入手机号"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">寝室</div>
              <div class="info-value">
                <span v-if="!isEditing">{{ userInfo.QSH || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.QSH"
                  class="modern-input"
                  placeholder="请输入寝室"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">年级</div>
              <div class="info-value">
                <span v-if="!isEditing">{{ userInfo.grade || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.grade"
                  class="modern-input"
                  placeholder="请输入年级"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">专业</div>
              <div class="info-value">
                <span v-if="!isEditing">{{ userInfo.ZY || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.ZY"
                  class="modern-input"
                  placeholder="请输入专业"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的商品 - 现代化设计 -->
      <div class="modern-card products-card">
        <div class="card-header">
          <div class="card-title-wrapper">
            <div class="card-icon">🛍️</div>
            <h3 class="card-title">我的商品</h3>
          </div>
          <div class="products-header">
            <a-button
              type="primary"
              class="modern-btn primary-btn"
              @click="showProductModal = true"
            >
              <template #icon><PlusOutlined /></template>
              发布商品
            </a-button>
          </div>
        </div>
        <div class="card-body">

          <a-spin :spinning="loading" tip="加载中...">
            <div class="product-list">
              <div
                v-for="item in myProducts"
                :key="item.id"
                class="product-card-modern"
                @click="editProduct(item)"
              >
              <div class="product-image-modern">
                <div class="category-tag-modern">
                  <span class="category-badge">{{
                    item.category_info.cname
                  }}</span>
                </div>
                <img
                  :src="replaceUrlRegex(item.image)"
                  :alt="item.name"
                  @error="handleProductImageError"
                />
                <div class="product-overlay">
                  <div class="product-actions-modern">
                    <a-button
                      size="small"
                      @click.stop="toggleProductStatus(item)"
                      class="action-btn status-btn"
                    >
                      <template #icon>
                        <SwapOutlined />
                      </template>
                      {{ item.is_sold ? '设为在售' : '设为售出' }}
                    </a-button>
                    <a-button
                      size="small"
                      class="action-btn edit-btn"
                      @click.stop="editProduct(item)"
                    >
                      <EditOutlined />
                    </a-button>
                    <a-button
                      size="small"
                      class="action-btn delete-btn"
                      danger
                      @click.stop="deleteProduct(item.id)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </div>
                </div>
              </div>
              <div class="product-info-modern">
                <div class="product-header-info">
                  <h4 class="product-title-modern">{{ item.name }}</h4>
                  <div class="product-status-badge">
                    <span
                      :class="[
                        'status-dot',
                        item.is_sold ? 'status-sold' : 'status-onsale',
                      ]"
                    ></span>
                    <span class="status-text">{{
                      item.is_sold ? '已售出' : '在售中'
                    }}</span>
                  </div>
                </div>
                <div class="product-footer-info">
                  <p class="product-price-modern">￥{{ item.price }}</p>
                  <p class="product-time-modern">
                    {{ extractDateFromISO(item.created_at) }}
                  </p>
                </div>
              </div>
            </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="!loading && myProducts.length === 0"
              class="empty-products-modern"
            >
              <div class="empty-icon">📦</div>
              <p class="empty-text">暂无商品</p>
              <a-button
                type="primary"
                class="modern-btn primary-btn"
                @click="showProductModal = true"
              >
                <template #icon><PlusOutlined /></template>
                发布第一个商品
              </a-button>
            </div>
          </a-spin>
        </div>
      </div>
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
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
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
/* 现代化全局样式 - 清新配色方案 */
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8f4f8 25%, #f0f9ff 50%, #f5f7fa 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  position: relative;
  padding-bottom: 40px;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 现代化输入框样式 */
:deep(.ant-input) {
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
}

:deep(.ant-input:hover) {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 1);
}

.modern-input {
  width: 100%;
}

/* 现代化头部样式 */
.profile-header {
  position: relative;
  padding: 80px 20px 100px;
  overflow: hidden;
  margin-bottom: -60px;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.85) 0%,
    rgba(14, 165, 233, 0.85) 50%,
    rgba(34, 197, 94, 0.85) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 20% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
  opacity: 0.5;
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
}

.avatar-section {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  color: white;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 0 8px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3),
    0 0 0 10px rgba(255, 255, 255, 0.15);
}

.avatar-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 3;
}

.edit-avatar-btn:hover {
  background: white;
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.user-info {
  flex: 1;
  padding-bottom: 20px;
}

.username {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-id {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 16px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  font-weight: 500;
}

/* 现代化内容区域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  position: relative;
  z-index: 1;
}

/* 现代化卡片设计 - 玻璃态效果 */
.modern-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(14, 165, 233, 0.05) 100%
  );
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
  letter-spacing: -0.3px;
}

.card-body {
  padding: 28px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.products-header {
  display: flex;
  gap: 12px;
}

/* 现代化按钮样式 */
.modern-btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 10px 20px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  border: none;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.cancel-btn {
  border-radius: 12px;
}

.save-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
}

.save-btn:hover {
  background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
}
/* 现代化信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(59, 130, 246, 0.06);
  border-color: rgba(59, 130, 246, 0.2);
  transform: translateX(4px);
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  color: #2d3748;
  font-weight: 500;
}

/* 现代化商品列表 */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.product-list::-webkit-scrollbar {
  width: 6px;
}

.product-list::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
}

.product-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  border-radius: 10px;
}

.product-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.product-card-modern {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-card-modern:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.product-image-modern {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.product-image-modern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card-modern:hover .product-image-modern img {
  transform: scale(1.1);
}

.category-tag-modern {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.category-badge {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #3b82f6;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card-modern:hover .product-overlay {
  opacity: 1;
}

.product-actions-modern {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #3b82f6;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-btn {
  flex: 1;
}

.edit-btn,
.delete-btn {
  min-width: 40px;
}

.product-info-modern {
  padding: 20px;
}

.product-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.product-title-modern {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex: 1;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.status-onsale {
  background: #48bb78;
}

.status-dot.status-sold {
  background: #f56565;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price-modern {
  font-size: 20px;
  font-weight: 800;
  color: #3b82f6;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-time-modern {
  font-size: 12px;
  color: #a0aec0;
  margin: 0;
  font-weight: 500;
}

/* 空状态现代化 */
.empty-products-modern {
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 18px;
  color: #a0aec0;
  margin-bottom: 24px;
  font-weight: 500;
}

/* 现代化头像编辑弹窗 */
.avatar-edit-modal {
  text-align: center;
  padding: 20px;
}

.avatar-preview {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.preview-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
}

.avatar-actions {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 现代化响应式设计 */
@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 60px 16px 80px;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .username {
    font-size: 28px;
  }

  .user-id {
    font-size: 14px;
  }

  .profile-content {
    padding: 50px 16px 30px;
    gap: 24px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .card-body {
    padding: 20px;
  }

  .product-list {
    grid-template-columns: 1fr;
    gap: 20px;
    max-height: none;
  }

  .product-image-modern {
    height: 200px;
  }

  .info-item {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 50px 12px 70px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .username {
    font-size: 24px;
  }

  .profile-content {
    padding: 40px 12px 20px;
  }

  .modern-card {
    border-radius: 20px;
  }

  .card-header {
    padding: 16px;
  }

  .card-body {
    padding: 16px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .product-image-modern {
    height: 180px;
  }

  .product-title-modern {
    font-size: 14px;
  }

  .product-price-modern {
    font-size: 18px;
  }

  .modern-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
