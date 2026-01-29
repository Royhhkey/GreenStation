<template>
  <a-modal
    :open="visible"
    :title="productData ? '编辑商品' : '发布商品'"
    width="600px"
    @ok="handleSave"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <!-- 标题和价格放在同一行 -->
      <a-row :gutter="16">
        <a-col :span="16">
          <a-form-item label="商品标题" name="name">
            <a-input
              v-model:value="formState.name"
              placeholder="请输入商品标题"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="价格" name="price">
            <a-input-number
              v-model:value="formState.price"
              :min="0"
              :precision="2"
              style="width: 100%"
              placeholder="0.00"
              addon-before="￥"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="商品分类" class="category-item">
        <a-select
          v-model:value="formState.category_info.cid"
          placeholder="请选择分类"
        >
          <a-select-option
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="商品图片" name="image">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :before-upload="beforeUpload"
          @preview="handlePreview"
          @remove="handleRemove"
          accpet="image/*"
        >
          <div v-if="fileList.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">上传图片</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item label="商品描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入商品描述"
          :rows="4"
          show-count
          :maxlength="200"
        />
      </a-form-item>
    </a-form>

    <!-- 图片预览模态框 -->
    <a-modal
      :open="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img
        alt="预览图片"
        style="width: 100%; height: 400px; object-fit: contain"
        :src="previewImage"
      />
    </a-modal>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { replaceUrlRegex } from '@/utils';

const props = defineProps({
  visible: Boolean,
  productData: Object,
  categories: Array,
});

const emit = defineEmits(['update:visible', 'save', 'cancel']);

const formRef = ref();
const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref('');
const selectedAvatarFile = ref(null); // 存储选中的文件

// const formState = reactive({
//   // name: '',
//   // price: undefined,
//   // description: '',
//   // image: '',
//   category_info:{
//     cid:null
//     }
// });

const formState = reactive({
  // name: '',
  // price: undefined,
  // description: '',
  // image: '',
  category_info: { cid: null }, // 确保 category_info 始终是一个对象
});

const rules = {
  name: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 1, max: 25, message: '标题长度为2-50个字符', trigger: 'blur' },
  ],
  'category_info.cid': [
    { required: true, message: '请选择商品分类', trigger: 'change' },
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 1, max: 200, message: '描述长度为1-200个字符', trigger: 'blur' },
  ],
};

// 图片上传前的处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!');
    return false;
  }
  selectedAvatarFile.value = file;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    formState.image = e.target.result;
    fileList.value = [
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: e.target.result,
      },
    ];
  };

  return false;
};

// 图片预览处理
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};

// 将文件转换为base64
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleRemove = () => {
  fileList.value = [];
  formState.image = '';
};

const handleSave = async () => {
  try {
    console.log('formState', formState);
    await formRef.value.validate();
    if (fileList.value.length < 1) {
      message.error('请上传图片');
      return;
    }

    const submitData = {
      name: formState.name,
      price: formState.price,
      description: formState.description,
      category_info: formState.category_info,
      image: selectedAvatarFile.value,
    };

    emit('save', submitData);
    handleCancel();
  } catch (error) {
    console.log('error', error);
    message.error('请完善表单信息');
  }
};

const handleCancel = () => {
  formRef.value?.resetFields();
  fileList.value = [];
  previewVisible.value = false;
  emit('update:visible', false);
  emit('cancel');
};

watch(
  () => props.productData,
  (newProduct) => {
    console.log('newProduct', newProduct);
    if (newProduct) {
      Object.assign(formState, newProduct);
      formState.price = parseFloat(formState.price) || 0; // 转换为浮点数
      if (newProduct.category_info && newProduct.category_info.cid) {
        formState.category_info.cid = String(newProduct.category_info.cid);
      }
      // else  {
      //   formState.category_info.cid = null;
      // }

      if (newProduct.image) {
        fileList.value = [
          {
            uid: '-1',
            name: 'product-image',
            status: 'done',
            url: replaceUrlRegex(newProduct.image),
          },
        ];
      } else {
        fileList.value = [
          {
            uid: '-1',
            name: 'product-image',
            status: 'done',
            url: 'https://eo-oss.roy22.xyz/secondHand/image.png',
          },
        ];
      }
    } else {
      // 重置表单
      // Object.keys(formState).forEach(key => {
      //   if (key === 'price') {
      //     formState[key] = undefined;
      //   } else {
      //     formState[key] = '';
      //   }
      // });
      // formState.categoryId = undefined;
      fileList.value = [];
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.category-item {
  max-width: 60%;
}
</style>
