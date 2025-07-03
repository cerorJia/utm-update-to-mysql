# UTM 数据采集与存储系统

## 项目简介

本项目是一个用于采集和存储 UTM 及用户访问信息的全栈应用。
后端基于 Node.js + Express + MySQL，前端提供了原生 HTML、Vue3 和 React 三种实现方式，方便不同技术栈的集成和测试。
适用于广告投放效果追踪、渠道分析、用户行为分析等场景。

## 功能说明

- **后端（Node.js + Express + MySQL）**
  - 提供 `/api/insert` 接口，接收前端发送的 UTM 及用户访问信息，并插入 MySQL 数据库。
  - 支持字段包括：utm_source、utm_medium、utm_campaign、utm_term、utm_content、referrer、is_mobile、browser、user_agent、os_type、os_version、timestamp、url。
  - 兼容多种前端数据格式，自动处理布尔值和时间等类型。

- **前端**
  - 提供原生 HTML、Vue3、React 三种实现，均可通过表单采集数据并调用后端接口。
  - 可根据实际业务需求扩展和集成。

## 适用场景
- 广告投放效果追踪
- 渠道来源分析
- 用户行为数据采集

## 快速开始
1. 启动 MySQL 并创建对应数据表。
2. 启动 Node.js 后端服务：`node index.js`
3. 任选一种前端方式，填写表单并提交数据。

---
如需更多帮助或定制开发，请联系项目维护者。
