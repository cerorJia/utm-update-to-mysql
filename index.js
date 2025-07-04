const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3888;

// 允许跨域
app.use(cors());
// 解析 JSON 请求体
app.use(express.json());


// 配置 MySQL 连接
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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
  const userId = req.headers.userid;

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
    url,
    user_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    url || '',
    userId || '',
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('数据库插入失败:', err);
      return res.status(500).json({ error: '数据库插入失败', details: err.message });
    }
    res.json({
      success: true,
      code: 200,
      id: result.insertId,
      message: '数据插入成功'
    });
  });
});

// 记录每个用户的最后心跳时间和心跳毫秒数
const userHeartbeats = new Map();

// 兼容 sendBeacon 和普通 POST 的插入日志接口
app.post('/api/log', express.raw({ type: '*/*' }), (req, res) => {
  let data = {};
  // console.log(req.headers);
  // 读取心跳毫秒数（推荐用小写横线风格）
  const heartbeatMilliseconds = parseInt(req.headers['heartbeatseconds'], 10) || 10000;
  
  // 1. 先尝试直接用 req.body（普通 fetch/postman 情况）
  if (typeof req.body === 'object' && !(req.body instanceof Buffer)) {
    data = req.body;
  } else {
    // 2. sendBeacon 情况，body 是 Buffer，需要手动解析
    try {
      const jsonStr = req.body.toString();
      data = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(400).json({ error: '无法解析请求体', details: e.message });
    }
  }

  // 获取用户唯一标识（这里用前端传输过来的请求头中的 userId）
  const userId =req.headers.userid;
  const now = Date.now();
  const last = userHeartbeats.get(userId);

  // 判断是否超时（直接用毫秒数）
  if (last && now - last.lastHeartbeat > last.heartbeatMilliseconds) {
    console.log(`用户 ${userId} 离开，最后心跳时间：${new Date(last.lastHeartbeat).toISOString()}`);
  }

  // 更新心跳
  userHeartbeats.set(userId, {
    lastHeartbeat: now,
    heartbeatMilliseconds
  });

  const {
    eventType,
    text,
    timestamp
  } = data;

  const sql = `INSERT INTO log (
    event_type,
    text,
    timestamp,
    user_id
  ) VALUES (?, ?, ?, ?)`;

  const params = [
    eventType || '',
    text || '',
    timestamp || new Date().toISOString(),
    userId
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('数据库插入失败:', err);
      return res.status(500).json({ error: '数据库插入失败', details: err.message });
    }
    res.json({
      success: true,
      code: 200,
      id: result.insertId,
      message: '数据插入成功'
    });
  });
});

app.listen(port, () => {
  console.log(`服务器已启动，端口 ${port}`);
}); 