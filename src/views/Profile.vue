<template>
  <div class="profile-page">
    <!-- 现代化头部信息卡片 -->
    <div class="profile-header">
      <div class="header-gradient"></div>
      <div class="header-pattern"></div>
      <div class="header-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <div class="avatar-container">
              <img
                :src="
                  userInfo.avatar ||
                  'https://eo-oss.roy22.xyz/secondHand/avatar.png'
                "
                alt="用户头像"
                class="avatar-image"
                @error="handleAvatarError"
              />
              <div class="avatar-ring"></div>
              <div class="avatar-edit-btn" @click="showAvatarEdit = true">
                <EditOutlined />
              </div>
            </div>
          </div>
          <div class="user-info-section">
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-container">
      <!-- 个人信息卡片 - 现代化玻璃态设计 -->
      <div class="info-card">
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
              class="action-btn"
              @click="isEditing = true"
            >
              <template #icon><EditOutlined /></template>
              编辑资料
            </a-button>

            <div v-else class="edit-actions-group">
              <a-button
                type="primary"
                class="action-btn save-btn"
                @click="saveEditing"
              >
                <template #icon><CheckOutlined /></template>
                保存
              </a-button>
              <a-button
                class="action-btn cancel-btn"
                @click="isEditing = false"
              >
                <template #icon><CloseOutlined /></template>
                取消
              </a-button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">用户名</div>
              <div class="info-value">
                <span v-if="!isEditing">{{
                  userInfo.username || '未设置'
                }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.username"
                  class="info-input"
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
                  class="info-input"
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
                  class="info-input"
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
                  class="info-input"
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
                  class="info-input"
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
                  class="info-input"
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
                  class="info-input"
                  placeholder="请输入专业"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的商品 - 现代化设计 -->
      <div class="products-card">
        <div class="card-header">
          <div class="card-title-wrapper">
            <div class="card-icon">🛍️</div>
            <h3 class="card-title">我的商品</h3>
          </div>
          <div class="card-actions">
            <a-button
              type="primary"
              class="action-btn"
              @click="showProductModal = true"
            >
              <template #icon><PlusOutlined /></template>
              发布商品
            </a-button>
          </div>
        </div>
        <div class="card-body">
          <a-spin :spinning="loading" tip="加载中...">
            <div class="products-grid">
              <div
                v-for="item in myProducts"
                :key="item.id"
                class="product-item"
                @click="editProduct(item)"
              >
                <div class="product-image-container">
                  <div class="product-category-tag">
                    <span class="category-badge">{{
                      item.category_info.cname
                    }}</span>
                  </div>
                  <img
                    :src="replaceUrlRegex(item.image)"
                    :alt="item.name"
                    class="product-image"
                    @error="handleProductImageError"
                  />
                  <div class="product-overlay">
                    <div class="product-actions">
                      <a-button
                        size="small"
                        @click.stop="toggleProductStatus(item)"
                        class="action-overlay-btn"
                      >
                        <template #icon>
                          <SwapOutlined />
                        </template>
                        {{ item.is_sold ? '设为在售' : '设为售出' }}
                      </a-button>
                      <a-button
                        size="small"
                        class="action-icon-btn"
                        @click.stop="editProduct(item)"
                      >
                        <EditOutlined />
                      </a-button>
                      <a-button
                        size="small"
                        class="action-icon-btn danger"
                        danger
                        @click.stop="deleteProduct(item.id)"
                      >
                        <DeleteOutlined />
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="product-info">
                  <div class="product-header-row">
                    <h4 class="product-title">{{ item.name }}</h4>
                    <div class="product-status">
                      <span
                        :class="[
                          'status-indicator',
                          item.is_sold ? 'sold' : 'available',
                        ]"
                      ></span>
                      <span class="status-text">{{
                        item.is_sold ? '已售出' : '在售中'
                      }}</span>
                    </div>
                  </div>
                  <div class="product-footer-row">
                    <p class="product-price">￥{{ item.price }}</p>
                    <p class="product-date">
                      {{ extractDateFromISO(item.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="!loading && myProducts.length === 0"
              class="empty-state"
            >
              <div class="empty-icon">📦</div>
              <p class="empty-text">暂无商品</p>
              <a-button
                type="primary"
                class="action-btn"
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
      class="avatar-modal"
    >
      <div class="avatar-modal-content">
        <div class="avatar-preview-wrapper">
          <img :src="avatarPreview" alt="头像预览" class="avatar-preview-image" />
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

        <div class="avatar-modal-actions">
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
/* Profile Page - Theme-aware Design */
.profile-page {
  min-height: 100vh;
  background: var(--theme-surfaceBackground);
  padding-bottom: var(--spacing-xl);
  transition: background var(--transition-normal);
}

/* Profile Header */
.profile-header {
  position: relative;
  padding: 5rem var(--spacing-lg) 6rem;
  overflow: hidden;
  margin-bottom: -3.75rem;
}

.header-gradient {
  position: absolute;
  inset: 0;
  background: var(--theme-gradient);
  opacity: 0.9;
  backdrop-filter: blur(40px);
}

.header-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 10;
}

.avatar-section {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xl);
  color: white;
}

.avatar-wrapper {
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-image {
  width: 140px;
  height: 140px;
  border-radius: var(--radius-full);
  border: 5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  object-fit: cover;
  box-shadow: 
    0 8px 32px var(--theme-shadowHeavy),
    0 0 0 8px rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  position: relative;
  z-index: 2;
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 
    0 12px 40px var(--theme-shadowHeavy),
    0 0 0 10px rgba(255, 255, 255, 0.15);
}

.avatar-ring {
  position: absolute;
  inset: -10px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-primary);
  cursor: pointer;
  border: 2px solid white;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px var(--theme-shadow);
  z-index: 3;
}

.avatar-edit-btn:hover {
  background: white;
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 6px 16px var(--theme-shadowMedium);
}

.user-info-section {
  flex: 1;
  padding-bottom: var(--spacing-lg);
}

.username {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px var(--theme-shadowHeavy);
  letter-spacing: -0.025em;
  background: linear-gradient(to bottom right, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-id {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px var(--theme-shadow);
  font-weight: 500;
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.75rem var(--spacing-lg) var(--spacing-xl);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  position: relative;
  z-index: 10;
}

/* Card Styles */
.info-card,
.products-card {
  background: var(--theme-cardBackground);
  backdrop-filter: blur(40px);
  border-radius: var(--radius-xl);
  box-shadow: 
    0 8px 32px var(--theme-shadow),
    0 0 0 1px var(--theme-borderLight);
  overflow: hidden;
  transition: all var(--transition-normal);
  border: 1px solid var(--theme-borderLight);
}

.info-card:hover,
.products-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 48px var(--theme-shadowMedium),
    0 0 0 1px var(--theme-border);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 1.75rem;
  background: var(--theme-surfaceGradient);
  border-bottom: 1px solid var(--theme-border);
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-gradient);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px var(--theme-shadow);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--theme-textPrimary);
  letter-spacing: -0.025em;
}

.card-actions {
  display: flex;
  gap: var(--spacing-md);
}

.edit-actions-group {
  display: flex;
  gap: var(--spacing-md);
}

.action-btn {
  border-radius: var(--radius-md);
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  height: auto;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px var(--theme-shadow);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--theme-shadowMedium);
}

.save-btn {
  background: var(--theme-secondary);
  border-color: var(--theme-secondary);
}

.save-btn:hover {
  background: var(--theme-secondary);
  filter: brightness(1.1);
}

.card-body {
  padding: 1.75rem;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--spacing-md);
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);
  transition: all var(--transition-normal);
}

.info-item:hover {
  background: var(--theme-cardBackground);
  border-color: var(--theme-primary);
  transform: translateX(4px);
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--theme-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.875rem;
  color: var(--theme-textPrimary);
  font-weight: 500;
}

.info-input {
  width: 100%;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.products-grid::-webkit-scrollbar {
  width: 6px;
}

.products-grid::-webkit-scrollbar-track {
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
}

.products-grid::-webkit-scrollbar-thumb {
  background: var(--theme-gradient);
  border-radius: var(--radius-md);
}

.products-grid::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

/* Product Item */
.product-item {
  background: var(--theme-cardBackground);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 1px solid var(--theme-borderLight);
  box-shadow: 0 4px 12px var(--theme-shadow);
}

.product-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px var(--theme-shadowMedium);
  border-color: var(--theme-primary);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: var(--theme-surfaceGradient);
}

.product-category-tag {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 2;
}

.category-badge {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: var(--theme-primary);
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px var(--theme-shadow);
  border: 1px solid var(--theme-borderLight);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--transition-normal);
}

.product-item:hover .product-image {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--spacing-md);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.product-item:hover .product-overlay {
  opacity: 1;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
}

.action-overlay-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid var(--theme-borderLight);
  border-radius: var(--radius-md);
  color: var(--theme-primary);
  font-weight: 600;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px var(--theme-shadow);
}

.action-overlay-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

.action-icon-btn {
  min-width: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid var(--theme-borderLight);
  border-radius: var(--radius-md);
  color: var(--theme-primary);
  font-weight: 600;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px var(--theme-shadow);
}

.action-icon-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-shadowMedium);
}

.product-info {
  padding: var(--spacing-lg);
}

.product-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.product-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--theme-textPrimary);
  margin: 0;
  flex: 1;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

.status-indicator.available {
  background: var(--theme-secondary);
}

.status-indicator.sold {
  background: #ff4d4f;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--theme-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-date {
  font-size: 0.75rem;
  color: var(--theme-textTertiary);
  margin: 0;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  padding: 5rem var(--spacing-lg);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.6;
}

.empty-text {
  font-size: 1.125rem;
  color: var(--theme-textTertiary);
  margin-bottom: var(--spacing-lg);
  font-weight: 500;
}

/* Avatar Modal */
.avatar-modal-content {
  text-align: center;
  padding: var(--spacing-lg);
}

.avatar-preview-wrapper {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.avatar-preview-image {
  width: 180px;
  height: 180px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid var(--theme-border);
  box-shadow: 0 8px 24px var(--theme-shadow);
  transition: all var(--transition-normal);
}

.avatar-preview-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px var(--theme-shadowMedium);
}

.avatar-modal-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Ant Design Input Overrides */
:deep(.ant-input) {
  border: 2px solid var(--theme-border);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  background: var(--theme-cardBackground);
  transition: all var(--transition-normal);
  font-size: 14px;
  color: var(--theme-textPrimary);
}

:deep(.ant-input:hover) {
  border-color: var(--theme-primary);
  background: var(--theme-cardBackground);
}

:deep(.ant-input:focus) {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.1);
  background: var(--theme-cardBackground);
}

/* Responsive Design - Mobile First */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 4rem var(--spacing-md) 5rem;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
  }

  .avatar-image {
    width: 120px;
    height: 120px;
  }

  .username {
    font-size: 1.875rem;
  }

  .content-container {
    padding: 3rem var(--spacing-md) var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .card-body {
    padding: var(--spacing-lg);
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    max-height: none;
  }

  .product-image-container {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 3rem var(--spacing-sm) 4.5rem;
  }

  .avatar-image {
    width: 100px;
    height: 100px;
  }

  .username {
    font-size: 1.5rem;
  }

  .user-id {
    font-size: 0.875rem;
  }

  .content-container {
    padding: 2.5rem var(--spacing-sm) var(--spacing-md);
  }

  .card-header {
    padding: var(--spacing-md);
  }

  .card-body {
    padding: var(--spacing-md);
  }

  .info-item {
    padding: var(--spacing-sm);
  }

  .product-image-container {
    height: 180px;
  }

  .info-card,
  .products-card {
    border-radius: var(--radius-lg);
  }
}
</style>
