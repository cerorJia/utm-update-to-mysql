const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// 允许跨域
app.use(cors());
// 解析 JSON 请求体
app.use(express.json());

// 配置 MySQL 连接
const db = mysql.createConnection({
  host: '192.168.10.101',
  port: 4000,
  user: 'root', // 请根据你的实际用户名修改
  password: '123456', // 请根据你的实际密码修改
  database: 'utm' // 请根据你的实际数据库名修改
});

db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('已连接到MySQL数据库');
  }
});

// 插入数据接口
app.post('/api/insert', (req, res) => {
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    isMobile,
    browser,
    userAgent,
    osType,
    osVersion,
    timestamp,
    url
  } = req.body;

  const sql = `INSERT INTO data (
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    is_mobile,
    browser,
    user_agent,
    os_type,
    os_version,
    timestamp,
    url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    utm_source || '',
    utm_medium || '',
    utm_campaign || '',
    utm_term || '',
    utm_content || '',
    referrer || '',
    isMobile ? 1 : 0,
    browser || '',
    userAgent || '',
    osType || '',
    osVersion || '',
    timestamp || '',
    url || ''
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('数据库插入失败:', err);
      return res.status(500).json({ error: '数据库插入失败', details: err.message });
    }
    res.json({
      success: true,
      id: result.insertId,
      message: '数据插入成功'
    });
  });
});

app.listen(port, () => {
  console.log(`服务器已启动，端口 ${port}`);
}); 