

const replaceUrlRegex = (originalUrl, pattern = null, replacement = null) => {
    /**
     * 使用正则表达式替换URL
     *
     * @param {string} originalUrl - 原始URL
     * @param {string} pattern - 正则表达式模式
     * @param {string} replacement - 替换内容
     * @returns {string} - 替换后的URL
     */
    // 默认模式：匹配任意域名下的/oss/路径
    if(originalUrl===null || originalUrl===undefined){
        return '';
    }
    const defaultPattern = /https:\/\/[^/]+\/oss\//;
    const defaultReplacement = 'https://eo-oss.roy22.xyz/';
    // console.log('original_url', originalUrl);

    // 如果没有提供pattern或replacement，则使用默认值
    pattern = pattern || defaultPattern;
    replacement = replacement || defaultReplacement;

    // 使用正则表达式替换URL
    return originalUrl.replace(pattern, replacement);
}
const removeEmptyProperties = (obj) => {
    /**
     * 删除对象中没有值的属性
     *
     * @param {Object} obj - 原始对象
     * @returns {Object} - 删除空属性后的对象
     */
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            // 判断值是否为空，这里可以根据具体需求定义“空”的含义
            // 例如，这里认为null、undefined、空字符串等为“空”
            if (value != null && value !== '' && !(Array.isArray(value) && value.length === 0) && !(value instanceof Object && Object.keys(value).length === 0)) {
                result[key] = value;
            }
        }
    }
    return result;
};

const objectToString = (obj) => {
    /**
     * 将对象转换为 key=value&key=value 形式的字符串
     *
     * @param {Object} obj - 原始对象
     * @returns {string} - 转换后的字符串
     */
    return Object.keys(obj)
        .map(key => {
            // 对键和值进行 URL 编码
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(obj[key]);
            return `${encodedKey}=${encodedValue}`;
        })
        .join('&'); // 使用 & 连接所有键值对
};
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

const extractDateFromISO = (isoString) => {
    /**
     * 从ISO 8601格式的时间字符串中提取日期部分
     * 例如: "2025-09-29T06:11:20.261347Z" -> "2025-09-29"
     *
     * @param {string} isoString - ISO 8601格式的时间字符串
     * @returns {string} - 提取的日期部分 (YYYY-MM-DD格式)
     */
    if (!isoString || typeof isoString !== 'string') {
        console.warn('extractDateFromISO: 输入参数无效');
        return '';
    }
    
    try {
        // 方法1: 使用字符串分割（简单高效）
        const datePart = isoString.split('T')[0];
        
        // 验证提取的日期格式
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            return datePart;
        } else {
            console.warn('extractDateFromISO: 日期格式不正确');
            return '';
        }
    } catch (error) {
        console.error('extractDateFromISO: 处理日期时发生错误', error);
        return '';
    }
};


/**
 * 比较两个对象，返回发生变化的值
 * @param {Object} originalObj - 原始对象
 * @param {Object} newObj - 新对象
 * @returns {Object} - 包含变化值的新对象
 */
const getChangedValues = (originalObj, newObj) => {
  const changedValues = {};
  
  // 遍历新对象的所有属性
  for (const key in newObj) {
    // 确保属性是自身的，不是原型链上的
    if (newObj.hasOwnProperty(key)) {
      const newValue = newObj[key];
      const originalValue = originalObj[key];
      
      // 使用 JSON.stringify 进行深度比较
      if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
        changedValues[key] = newValue;
      }
    }
  }
  
  return changedValues;
};

export { 
    replaceUrlRegex,
    removeEmptyProperties,
    objectToString,
    formatTime,
    getChangedValues,
    extractDateFromISO
}