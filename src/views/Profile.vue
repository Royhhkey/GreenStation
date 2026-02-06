<template>
  <div class="min-h-screen bg-theme-surface pb-theme-xl transition-colors duration-normal">
    <!-- 现代化头部信息卡片 -->
    <div class="relative py-20 px-theme-lg pb-24 -mb-15 overflow-hidden">
      <div class="absolute inset-0 bg-theme-gradient opacity-90 backdrop-blur-[40px]"></div>
      <div class="absolute inset-0 opacity-50" style="background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
      <div class="relative max-w-[1200px] mx-auto z-10">
        <div class="flex items-end gap-theme-xl text-white md:flex-col md:items-center md:text-center md:gap-theme-md">
          <div class="relative">
            <div class="relative inline-block">
              <img
                :src="
                  userInfo.avatar ||
                  'https://eo-oss.roy22.xyz/secondHand/avatar.png'
                "
                alt="用户头像"
                class="w-[140px] h-[140px] rounded-full border-[5px] border-white/30 bg-white/20 object-cover shadow-theme-lg transition-all duration-normal relative z-[2] hover:scale-105 md:w-[120px] md:h-[120px] sm:w-[100px] sm:h-[100px]"
                style="box-shadow: 0 8px 32px var(--theme-shadowHeavy), 0 0 0 8px rgba(255, 255, 255, 0.1);"
                @error="handleAvatarError"
              />
              <div class="absolute -inset-[10px] rounded-full border-2 border-white/20 animate-rotate"></div>
              <div class="absolute bottom-2 right-2 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-theme-primary cursor-pointer border-2 border-white transition-all duration-normal shadow-theme z-[3] hover:bg-white hover:scale-115 hover:rotate-90" @click="showAvatarEdit = true">
                <EditOutlined />
              </div>
            </div>
          </div>
          <div class="flex-1 pb-theme-lg md:pb-0">
            <h2 class="text-4xl font-bold mb-2 tracking-tight md:text-3xl sm:text-2xl" style="text-shadow: 0 2px 4px var(--theme-shadowHeavy); background: linear-gradient(to bottom right, white, rgba(255, 255, 255, 0.8)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ userInfo.username }}</h2>
            <p class="text-base opacity-90 mb-4 font-medium sm:text-sm" style="text-shadow: 0 1px 2px var(--theme-shadow);">ID: {{ userInfo.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="max-w-[1200px] mx-auto pt-15 px-theme-lg pb-theme-xl grid grid-cols-[1fr_2fr] gap-theme-xl relative z-10 lg:grid-cols-1 lg:gap-theme-lg md:pt-12 md:px-theme-md md:pb-theme-lg sm:pt-10 sm:px-theme-sm sm:pb-theme-md">
      <!-- 个人信息卡片 - 现代化玻璃态设计 -->
      <div class="bg-theme-card backdrop-blur-[40px] rounded-theme-xl shadow-theme overflow-hidden transition-all duration-normal border border-theme-border-light hover:-translate-y-0.5 hover:shadow-theme-md sm:rounded-theme-lg" style="box-shadow: 0 8px 32px var(--theme-shadow), 0 0 0 1px var(--theme-borderLight);">
        <div class="flex justify-between items-center p-theme-lg px-7 bg-theme-surface-gradient border-b border-theme-border md:flex-col md:items-start md:gap-theme-md md:p-theme-lg sm:p-theme-md">
          <div class="flex items-center gap-theme-md">
            <div class="text-2xl w-12 h-12 flex items-center justify-center bg-theme-gradient rounded-theme-md shadow-theme md:w-10 md:h-10 md:text-xl">👤</div>
            <h3 class="text-xl font-bold m-0 text-theme-text tracking-tight md:text-lg">
              {{ isEditing ? '编辑个人信息' : '个人信息' }}
            </h3>
          </div>
          <div class="flex gap-theme-md">
            <a-button
              v-if="!isEditing"
              type="primary"
              class="rounded-theme-md font-semibold px-5 py-2.5 h-auto transition-all duration-normal shadow-theme hover:-translate-y-0.5 hover:shadow-theme-md"
              @click="isEditing = true"
            >
              <template #icon><EditOutlined /></template>
              编辑资料
            </a-button>

            <div v-else class="flex gap-theme-md">
              <a-button
                type="primary"
                class="rounded-theme-md font-semibold px-5 py-2.5 h-auto transition-normal shadow-theme hover:-translate-y-0.5 hover:shadow-theme-md bg-theme-secondary border-theme-secondary hover:bg-theme-secondary hover:brightness-110"
                @click="saveEditing"
              >
                <template #icon><CheckOutlined /></template>
                保存
              </a-button>
              <a-button
                class="rounded-theme-md font-semibold px-5 py-2.5 h-auto transition-all duration-normal shadow-theme hover:-translate-y-0.5 hover:shadow-theme-md"
                @click="isEditing = false"
              >
                <template #icon><CloseOutlined /></template>
                取消
              </a-button>
            </div>
          </div>
        </div>
        <div class="p-7 md:p-theme-lg sm:p-theme-md">
          <div class="flex flex-col gap-theme-lg">
            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">用户名</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{
                  userInfo.username || '未设置'
                }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.username"
                  class="w-full"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">学号</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{ userInfo.XH || '未设置' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.XH"
                  class="w-full"
                  placeholder="请输入学号"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">邮箱</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{ userInfo.email || '未设置' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.email"
                  class="w-full"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">手机号</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{
                  userInfo.phoneNumber || '未设置'
                }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.phoneNumber"
                  class="w-full"
                  placeholder="请输入手机号"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">寝室</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{ userInfo.QSH || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.QSH"
                  class="w-full"
                  placeholder="请输入寝室"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">年级</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{ userInfo.grade || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.grade"
                  class="w-full"
                  placeholder="请输入年级"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 p-theme-md bg-theme-surface rounded-theme-md border border-theme-border transition-all duration-normal hover:bg-theme-card hover:border-theme-primary hover:translate-x-1 sm:p-theme-sm">
              <div class="text-xs font-semibold text-theme-primary uppercase tracking-wider">专业</div>
              <div class="text-sm text-theme-text font-medium">
                <span v-if="!isEditing">{{ userInfo.ZY || '未填写' }}</span>
                <a-input
                  v-else
                  v-model:value="editForm.ZY"
                  class="w-full"
                  placeholder="请输入专业"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的商品 - 现代化设计 -->
      <div class="bg-theme-card backdrop-blur-[40px] rounded-theme-xl shadow-theme overflow-hidden transition-all duration-normal border border-theme-border-light hover:-translate-y-0.5 hover:shadow-theme-md sm:rounded-theme-lg" style="box-shadow: 0 8px 32px var(--theme-shadow), 0 0 0 1px var(--theme-borderLight);">
        <div class="flex justify-between items-center p-theme-lg px-7 bg-theme-surface-gradient border-b border-theme-border md:flex-col md:items-start md:gap-theme-md md:p-theme-lg sm:p-theme-md">
          <div class="flex items-center gap-theme-md">
            <div class="text-2xl w-12 h-12 flex items-center justify-center bg-theme-gradient rounded-theme-md shadow-theme md:w-10 md:h-10 md:text-xl">🛍️</div>
            <h3 class="text-xl font-bold m-0 text-theme-text tracking-tight md:text-lg">我的商品</h3>
          </div>
          <div class="flex gap-theme-md">
            <a-button
              type="primary"
              class="rounded-theme-md font-semibold px-5 py-2.5 h-auto transition-all duration-normal shadow-theme hover:-translate-y-0.5 hover:shadow-theme-md"
              @click="showProductModal = true"
            >
              <template #icon><PlusOutlined /></template>
              发布商品
            </a-button>
          </div>
        </div>
        <div class="p-7 md:p-theme-lg sm:p-theme-md">
          <a-spin :spinning="loading" tip="加载中...">
            <div class="products-grid grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-theme-lg max-h-[600px] overflow-y-auto pr-2 md:grid-cols-1 md:max-h-none">
              <div
                v-for="item in myProducts"
                :key="item.id"
                class="group bg-theme-card backdrop-blur-sm rounded-theme-lg overflow-hidden transition-all duration-normal cursor-pointer border border-theme-border-light shadow-theme hover:-translate-y-2 hover:scale-[1.02] hover:shadow-theme-md hover:border-theme-primary"
                @click="editProduct(item)"
              >
                <div class="relative w-full h-[220px] overflow-hidden bg-theme-surface-gradient md:h-[200px] sm:h-[180px]">
                  <div class="absolute top-theme-md left-theme-md z-[2]">
                    <span class="bg-white/95 backdrop-blur-sm text-theme-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-theme border border-theme-border-light">{{
                      item.category_info.cname
                    }}</span>
                  </div>
                  <img
                    :src="replaceUrlRegex(item.image)"
                    :alt="item.name"
                    class="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-110"
                    @error="handleProductImageError"
                  />
                  <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end justify-center p-theme-md opacity-0 transition-opacity group-hover:opacity-100">
                    <div class="flex gap-2 w-full justify-center">
                      <a-button
                        size="small"
                        @click.stop="toggleProductStatus(item)"
                        class="flex-1 bg-white/95 backdrop-blur-sm border border-theme-border-light rounded-theme-md text-theme-primary font-semibold transition-all duration-normal shadow-theme hover:bg-white hover:-translate-y-0.5 hover:shadow-theme-md"
                      >
                        <template #icon>
                          <SwapOutlined />
                        </template>
                        {{ item.is_sold ? '设为在售' : '设为售出' }}
                      </a-button>
                      <a-button
                        size="small"
                        class="min-w-[40px] bg-white/95 backdrop-blur-sm border border-theme-border-light rounded-theme-md text-theme-primary font-semibold transition-all duration-normal shadow-theme hover:bg-white hover:-translate-y-0.5 hover:shadow-theme-md"
                        @click.stop="editProduct(item)"
                      >
                        <EditOutlined />
                      </a-button>
                      <a-button
                        size="small"
                        class="min-w-[40px] bg-white/95 backdrop-blur-sm border border-theme-border-light rounded-theme-md text-theme-primary font-semibold transition-all duration-normal shadow-theme hover:bg-white hover:-translate-y-0.5 hover:shadow-theme-md"
                        danger
                        @click.stop="deleteProduct(item.id)"
                      >
                        <DeleteOutlined />
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="p-theme-lg">
                  <div class="flex justify-between items-start mb-theme-md gap-theme-md">
                    <h4 class="text-base font-bold text-theme-text m-0 flex-1 line-clamp-2 leading-snug">{{ item.name }}</h4>
                    <div class="flex items-center gap-1.5 px-2.5 py-1 bg-theme-surface rounded-theme-md flex-shrink-0">
                      <span
                        :class="[
                          'w-2 h-2 rounded-full animate-pulse',
                          item.is_sold ? 'bg-[#ff4d4f]' : 'bg-theme-secondary',
                        ]"
                      ></span>
                      <span class="text-[11px] font-semibold text-theme-primary uppercase tracking-wider">{{
                        item.is_sold ? '已售出' : '在售中'
                      }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-xl font-extrabold m-0 bg-theme-gradient bg-clip-text text-transparent">￥{{ item.price }}</p>
                    <p class="text-xs text-theme-text-tertiary m-0 font-medium">
                      {{ extractDateFromISO(item.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="!loading && myProducts.length === 0"
              class="py-20 px-theme-lg text-center"
            >
              <div class="text-6xl mb-theme-md opacity-60">📦</div>
              <p class="text-lg text-theme-text-tertiary mb-theme-lg font-medium">暂无商品</p>
              <a-button
                type="primary"
                class="rounded-theme-md font-semibold px-5 py-2.5 h-auto transition-all duration-normal shadow-theme hover:-translate-y-0.5 hover:shadow-theme-md"
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
      <div class="text-center p-theme-lg">
        <div class="mb-theme-xl flex justify-center">
          <img :src="avatarPreview" alt="头像预览" class="w-[180px] h-[180px] rounded-full object-cover border-4 border-theme-border shadow-theme transition-all duration-normal hover:scale-105 hover:shadow-theme-md" />
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

        <div class="mt-theme-xl flex gap-theme-md justify-center">
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

/* Custom scrollbar for products grid */
:deep(.products-grid)::-webkit-scrollbar {
  width: 6px;
}

:deep(.products-grid)::-webkit-scrollbar-track {
  background: var(--theme-surfaceBackground);
  border-radius: var(--radius-md);
}

:deep(.products-grid)::-webkit-scrollbar-thumb {
  background: var(--theme-gradient);
  border-radius: var(--radius-md);
}

:deep(.products-grid)::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

/* Product item hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
