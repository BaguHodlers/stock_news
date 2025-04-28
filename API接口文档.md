# 新闻服务 API 接口文档

## 1. 获取新闻历史接口

### 接口地址
`POST /api/news/history`

### 请求参数（JSON Body）
| 参数名      | 类型      | 必填 | 说明                         |
| ----------- | --------- | ---- | ---------------------------- |
| minutes     | number    | 否   | 查询多少分钟内的新闻，默认5  |
| sourceIds   | string[]  | 否   | 渠道ID数组，筛选指定渠道新闻 |

### 返回示例
```json
{
  "status": "success",
  "data": {
    "total": 2,
    "startTime": 1710000000000,
    "endTime": 1710000300000,
    "items": [
      {
        "title": "新闻标题1",
        "insertedAt": 1710000100000,
        "channelName": "36氪",
        "url": "https://..."
      },
      {
        "title": "新闻标题2",
        "insertedAt": 1710000200000,
        "channelName": "华尔街见闻",
        "url": "https://..."
      }
    ]
  }
}
```

### curl 示例
- 查询最近60分钟所有渠道新闻：
```bash
curl -X POST http://localhost:5173/api/news/history \
  -H 'Content-Type: application/json' \
  -d '{"minutes":60}'
```

- 查询最近30分钟指定渠道（如36kr、wallstreetcn）的新闻：
```bash
curl -X POST http://localhost:5173/api/news/history \
  -H 'Content-Type: application/json' \
  -d '{"minutes":30, "sourceIds":["36kr","wallstreetcn"]}'
```

---

## 2. 获取可用新闻源列表

### 接口地址
`GET /api/news/sources`

### 返回示例
```json
{
  "status": "success",
  "data": {
    "total": 2,
    "sources": {
      "36kr": {
        "name": "36氪",
        "title": "36氪快讯",
        "type": "realtime",
        "column": "tech",
        "color": "primary",
        "interval": 60,
        "home": "https://36kr.com/"
      },
      "wallstreetcn": {
        "name": "华尔街见闻",
        "title": "华尔街见闻快讯",
        "type": "realtime",
        "column": "finance",
        "color": "primary",
        "interval": 60,
        "home": "https://wallstreetcn.com/"
      }
    }
  }
}
```

### curl 示例
```bash
curl http://localhost:5173/api/news/sources
```
