<!-- Profile.vue -->
<template>
  <div class="profile-page">
    <ProfileHeader 
      :user-info="userInfo"
      :avatar-preview="avatarPreview"
      @edit-avatar="showAvatarEdit = true"
    />
    
    <div class="profile-content">
      <UserInfoCard 
        :user-info="userInfo"
        :is-editing="isEditing"
        v-model:edit-form="editForm"
        @toggle-edit="isEditing = !isEditing"
        @save="saveEditing"
      />
      
      <UserProductsCard 
        :products="myProducts"
        :loading="loading"
        :categories="categories"
        @add-product="showProductModal = true"
        @edit-product="editProduct"
        @delete-product="deleteProduct"
        @toggle-status="toggleProductStatus"
      />
    </div>
    
    <AvatarEditModal
      v-model:visible="showAvatarEdit"
      :avatar-preview="avatarPreview"
      :avatar-loading="avatarLoading"
      @upload="handleAvatarUpload"
      @save="handleAvatarSave"
    />
    
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
import { ref, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import ProductModal from '@/components/ProductModal.vue';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import UserInfoCard from '@/components/profile/UserInfoCard.vue';
import UserProductsCard from '@/components/profile/UserProductsCard.vue';
import AvatarEditModal from '@/components/profile/AvatarEditModal.vue';
import { replaceUrlRegex, extractDateFromISO, getChangedValues } from '@/utils';
import {
  getMyproduct,
  ModifyUserInfo,
  AvatarUpload,
  DeleteProduct,
  CreateProduct,
  ModifyProduct
} from '@/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// 响应式数据
const showAvatarEdit = ref(false);
const showProductModal = ref(false);
const loading = ref(false);
const avatarPreview = ref('');
const editingProduct = ref(null);
const isEditing = ref(false);
const avatarLoading = ref(false);
const selectedAvatarFile = ref(null);

// 用户信息
const userInfo = ref({
  id: '',
  username: '',
  email: '',
  phoneNumber: '',
  avatar: 'https://eo-oss.roy22.xyz/secondHand/avatar.png',
});

const editForm = ref({});

// 我的商品列表
const myProducts = ref([]);

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

// 保存用户信息编辑
const saveEditing = async () => {
  isEditing.value = false;
  const changes = getChangedValues(userInfo.value, editForm.value);
  
  if (Object.keys(changes).length === 0) {
    message.info('未做任何修改');
    return;
  }
  
  try {
    const { data } = await ModifyUserInfo(changes);
    if (data.code === '01') {
      message.success('修改成功');
      userInfo.value = { ...userInfo.value, ...editForm.value };
      authStore.updateUserInfo(editForm.value);
    } else {
      message.error(data.msg || '修改失败');
    }
  } catch (error) {
    message.error('修改失败，请重试');
  }
};

// 处理头像上传
const handleAvatarUpload = (file) => {
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
  
  selectedAvatarFile.value = file;
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
  };
  
  return false;
};

// 保存头像
const handleAvatarSave = async () => {
  if (!avatarPreview.value || !selectedAvatarFile.value) {
    message.warning('请选择头像图片');
    return;
  }

  try {
    avatarLoading.value = true;
    
    const formData = new FormData();
    formData.append('avatar', selectedAvatarFile.value);
    
    const { data } = await AvatarUpload(formData);
    
    if (data.code === '01') {
      message.success('头像更新成功');
      userInfo.value.avatar = data.data?.url || avatarPreview.value;
      authStore.updateUserInfo({ avatar: userInfo.value.avatar });
      showAvatarEdit.value = false;
      avatarPreview.value = '';
      selectedAvatarFile.value = null;
    } else {
      message.error(data.msg || '头像更新失败');
    }
  } catch (error) {
    message.error('头像上传失败，请重试');
  } finally {
    avatarLoading.value = false;
  }
};

// 编辑商品
const editProduct = (product) => {
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
        const { data } = await DeleteProduct(productId);
        if (data.code === '01') {
          myProducts.value = myProducts.value.filter(p => p.id !== productId);
          message.success('商品删除成功');
        }
      } catch (error) {
        message.error('商品删除失败');
      }
    }
  });
};

// 更新商品状态
const updateProduct = async (id, datas) => {
  const { data } = await ModifyProduct(id, datas);
  return data;
};

const toggleProductStatus = (item) => {
  item.is_sold = !item.is_sold;
  updateProduct(item.id, { is_sold: item.is_sold });
};

// 保存商品
const handleProductSave = async (productData) => {
  const submitData = new FormData();

  if (productData.image) {
    submitData.append('image', productData.image);
  }

  if (productData.name) {
    submitData.append('name', productData.name);
  }
  
  if (productData.price !== undefined && productData.price !== null) {
    submitData.append('price', productData.price.toString());
  }
  
  if (productData.description) {
    submitData.append('description', productData.description);
  }
  
  if (productData.category_info && productData.category_info.cid !== undefined) {
    submitData.append('category', Number(productData.category_info.cid));
  }

  try {
    if (editingProduct.value) {
      const id = editingProduct.value.id;
      const newData = await updateProduct(id, submitData);
      
      const index = myProducts.value.findIndex(p => p.id === id);
      if (index !== -1) {
        myProducts.value[index] = { ...newData.data, id: id };
      }
      message.success('商品更新成功');
    } else {
      const { data } = await CreateProduct(submitData);
      myProducts.value.unshift(data.data);
      message.success('商品发布成功');
    }
    
    showProductModal.value = false;
    editingProduct.value = null;
  } catch (error) {
    message.error('操作失败，请重试');
  }
};

// 取消商品编辑
const handleProductCancel = () => {
  showProductModal.value = false;
  editingProduct.value = null;
};

// 获取我的商品数据
const getMyProductsData = async () => {
  try {
    loading.value = true;
    const { data } = await getMyproduct();
    myProducts.value = data.data.items;
  } catch (error) {
    message.error('获取商品列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  userInfo.value = authStore.userInfo;
  editForm.value = { ...authStore.userInfo };
  avatarPreview.value = userInfo.value.avatar || 'https://eo-oss.roy22.xyz/secondHand/avatar.png';
  getMyProductsData();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
    padding: 50px 16px 30px;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .profile-content {
    padding: 40px 12px 20px;
  }
}
</style>