import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UtmTracker from 'utm-params-extractor-test';

function App() {
  const [utm, setUtm] = useState<any>(null);

  // 浏览器指纹生成与存储
  useEffect(() => {
    let userId = localStorage.getItem('userid');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userid', userId);
    }
    const params = UtmTracker.get();
    setUtm(params);
  }, []);

  const submit = async () => {
    try {
      if (!utm) {
        console.error('utm数据为空');
        return;
      }
      const userId = localStorage.getItem('userid');
      const requestData = {
        utm_source: utm.utm_source || '',
        utm_medium: utm.utm_medium || '',
        utm_campaign: utm.utm_campaign || '',
        utm_term: utm.utm_term || '',
        utm_content: utm.utm_content || '',
        referrer: utm.referrer || '',
        isMobile: utm.browser?.isMobile || '',
        browser: utm.browser?.browser || '',
        userAgent: utm.browser?.userAgent || '',
        osType: utm.browser?.osType || '',
        osVersion: utm.browser?.osVersion || '',
        timestamp: utm.timestamp || '',
        url: utm.url || ''
      };
      const res = await fetch('http://192.168.3.9:3000/api/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId || ''
        },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      if (data.success) {
        console.log('数据插入成功:', data);
      } else {
        console.error('数据插入失败:', data.error);
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>UTM Params Extractor Demo</h1>
      <p>本页面演示如何在 React + TypeScript 项目中使用 <code>utm-params-extractor-test</code> 包。</p>
      <h2>获取到的参数：</h2>
      <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8 }}>
        {utm ? JSON.stringify(utm, null, 2) : '正在获取...'}
      </pre>
      <button onClick={() => submit()} >提交</button>
    </div>
  );
}

export default App;
