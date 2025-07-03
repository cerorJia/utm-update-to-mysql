<script setup>
import { ref, computed, onMounted } from 'vue'
import UtmTracker from 'utm-params-extractor-test'

const utm = ref(null)
const utmJson = computed(() => utm.value ? JSON.stringify(utm.value, null, 2) : '正在获取...')

onMounted(() => {
  utm.value = UtmTracker.get()
})
  const submit = async () => {
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
    <button @click="submit()">提交到数据库</button>
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
