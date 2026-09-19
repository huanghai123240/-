# 微信小程序收货地址模块

一套完整的微信小程序收货地址管理代码，包含地址列表、新增/编辑、删除、设为默认、选择模式等功能。

## 文件结构

```
miniprogram/
├── app.json                          # 小程序全局配置（已注册页面路由）
├── pages/
│   └── address/
│       ├── list/                     # 地址列表页
│       │   ├── list.wxml             # 页面结构
│       │   ├── list.wxss             # 页面样式
│       │   ├── list.js               # 页面逻辑
│       │   └── list.json             # 页面配置
│       └── edit/                     # 新增/编辑地址页
│           ├── edit.wxml
│           ├── edit.wxss
│           ├── edit.js
│           └── edit.json
└── utils/
    └── address.js                    # 地址数据操作工具（增删改查、校验）
```

## 功能清单

| 功能 | 说明 |
|------|------|
| 地址列表 | 展示所有收货地址，支持下拉刷新 |
| 新增地址 | 填写收货人、手机号、省市区、详细地址 |
| 编辑地址 | 点击编辑图标进入编辑页，自动回显数据 |
| 删除地址 | 弹窗确认后删除 |
| 设为默认 | 开关切换，同一时间只有一个默认地址 |
| 选择模式 | 从结算页进入时（带 `?scene=select` 参数），点击地址回传上一页 |
| 表单校验 | 姓名非空、手机号格式、省市区必选、详细地址非空 |

## 快速接入

### 1. 复制文件
把 `pages/address/` 目录和 `utils/address.js` 复制到你的项目对应位置。

### 2. 注册路由
在你项目的 `app.json` 的 `pages` 数组中添加：

```json
"pages/address/list/list",
"pages/address/edit/edit"
```

### 3. 跳转方式

```javascript
wx.navigateTo({ url: '/pages/address/list/list' });           // 地址管理
wx.navigateTo({ url: '/pages/address/list/list?scene=select' }); // 选择模式
wx.navigateTo({ url: '/pages/address/edit/edit' });             // 新增
wx.navigateTo({ url: '/pages/address/edit/edit?id=xxx' });      // 编辑
```

### 4. 接收选中的地址

```javascript
onShow() {
  if (this.data.selectedAddress) {
    console.log('选中的地址：', this.data.selectedAddress);
  }
}
```

## 接入后端 API

当前使用 `wx.Storage` 模拟本地存储，实际项目中把 `utils/address.js` 中的方法替换为后端请求即可。

## 注意事项

- 地区选择使用微信原生 `wx.chooseRegion`，需要基础库 2.17.0+
- 图片资源需自行放入 `/images/` 目录
- 默认地址在保存新地址或编辑时自动互斥
