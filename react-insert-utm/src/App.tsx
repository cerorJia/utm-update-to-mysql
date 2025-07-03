import React, { useEffect, useState } from 'react';
import UtmTracker from 'utm-params-extractor-test';

function App() {
  const [utm, setUtm] = useState<any>(null);
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
  const utmParams: { [key: string]: string } = {
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
  const submit = async () => {;
    try {
      if (!utm) {
        console.error('utm数据为空');
        return;
      }
      
      console.log(utm);
      
      // 构造符合后端接口的数据结构
      const requestData = {
        utm_source: utm.utm_source || '',
        utm_medium: utm.utm_medium || '',
        utm_campaign: utm.utm_campaign || '',
        utm_term: utm.utm_term || '',
        utm_content: utm.utm_content || '',
        referrer: utm.referrer || '',
        isMobile: utm.browser.isMobile || '',
        browser: utm.browser.browser || '',
        userAgent: utm.browser.userAgent || '',
        osType: utm.browser.osType || '',
        osVersion: utm.browser.osVersion || '',
        timestamp: utm.timestamp || '',
        url: utm.url || ''
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

  useEffect(() => {
    const params = UtmTracker.get();
    setUtm(params);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>UTM Params Extractor Demo</h1>
      <p>本页面演示如何在 React + TypeScript 项目中使用 <code>utm-params-extractor-test</code> 包。</p>
      <h2>获取到的参数：</h2>
      <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8 }}>
        {utm ? JSON.stringify(utm, null, 2) : '正在获取...'}
      </pre>
      <button onClick={() => generateAndAppendUtmParams()} >提交</button>
    </div>
  );
}

export default App;
