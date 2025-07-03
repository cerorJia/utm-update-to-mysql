<script setup>
import { ref, computed, onMounted } from 'vue'
import UtmTracker from 'utm-params-extractor-test'

const utm = ref(null)
const utmJson = computed(() => utm.value ? JSON.stringify(utm.value, null, 2) : '正在获取...')

onMounted(() => {
  utm.value = UtmTracker.get()
})
function generateAndAppendUtmParams() {
  // 获取随机合法值的函数
  function getRandomValue() {
    return Math.random().toString(36).substring(2, 7);
  }

  // utm_source 合法取值范围
  const utmSourceOptions = ['baidu', 'bd', 'google', 'safari', 'tx', 'qq', 'wx'];

  // 随机选择一个 utm_source 值
  const utmSource = utmSourceOptions[
    Math.floor(Math.random() * utmSourceOptions.length)
  ];

  // 生成其他UTM参数的随机值
  const utmParams = {
    utm_source: utmSource,
    utm_medium: getRandomValue(),
    utm_campaign: getRandomValue(),
    utm_term: getRandomValue(),
    utm_content: getRandomValue()
  };

  // 构造带UTM参数的URL
  let urlWithParams = window.location.href.split('?')[0] + '?';
  const paramsArray = [];

  for (const key in utmParams) {
    paramsArray.push(`${key}=${encodeURIComponent(utmParams[key])}`);
  }

  urlWithParams += paramsArray.join('&');

  // 更新当前页面的URL
  window.history.pushState({}, '', urlWithParams);

  // 触发按钮点击事件
  submit();
}
  const submit = async () => {
    utm.value = UtmTracker.get()
    try {
      if (!utm.value) {
        console.error('utm数据为空');
        return;
      }
      
      console.log(utm.value);
      
      // 构造符合后端接口的数据结构
      const requestData = {
        utm_source: utm.value.utm_source || '',
        utm_medium: utm.value.utm_medium || '',
        utm_campaign: utm.value.utm_campaign || '',
        utm_term: utm.value.utm_term || '',
        utm_content: utm.value.utm_content || '',
        referrer: utm.value.referrer || '',
        isMobile: utm.value.browser.isMobile || '',
        browser: utm.value.browser.browser || '',
        userAgent: utm.value.browser.userAgent || '',
        osType: utm.value.browser.osType || '',
        osVersion: utm.value.browser.osVersion || '',
        timestamp: utm.value.timestamp || '',
        url: utm.value.url || ''
      };

      const res = await fetch('http://192.168.3.9:3000/api/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        console.log('数据插入成功:', data);
        // 可以在这里添加成功提示
      } else {
        console.error('数据插入失败:', data.error);
        // 可以在这里添加错误提示
      }
    } catch (error) {
      console.error('请求出错:', error);
      // 可以在这里添加错误提示
    }
  };
</script>

<template>
  <div style="padding: 24px; text-align: left;">
    <h1>UTM Params Extractor Demo (Vue3)</h1>
    <p>本页面演示如何在 Vue3 项目中使用 <code>utm-params-extractor-test</code> 包。</p>
    <h2>获取到的参数：</h2>
    <pre style="background: #f6f8fa; padding: 16px; border-radius: 8px; text-align: left;">
      {{ utmJson }}
    </pre>
    <button @click="generateAndAppendUtmParams()">提交到数据库</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
