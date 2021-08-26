# ZegoSuperBoard SDK Demo

## 项目运行指引

### 填入所需参数

在 js/login/init.js 文件中填写登录房间所需的 AppID。
### 启动项目

在项目所在目录下，双击打开 “index.html” 页面，输入房间号和用户名进入房间。
## 项目结构介绍
```
superboard
├─ README.md # 项目 README
├─ fileList.json # ZEGO 预置文件列表
├─ img # 项目用到的图片
│  ├─ custom-icon-active.png
│  ├─ custom-icon.png
│  ├─ login-bg.png
│  └─ logo.png
├─ index.html # 入口文件
├─ js # 项目用到的非第三方 UI 的所有 JavaScript
│  ├─ login # 登录模块，初始化、登录相关功能
│  │  ├─ init.js # 初始化相关功能
│  │  ├─ login.js # 登录相关功能
│  │  └─ utils.js # 登录模块相关更新 DOM 的方法、相关工具方法
│  └─ room # 房间模块，白板相关功能
│     ├─ addImage.js # 添加自定义图形、插入图片
│     ├─ cacheFile.js # 文件预加载
│     ├─ flipToPage.js # 白板翻页
│     ├─ other.js # 清空、撤销、重做、保存快照、清空当前页、清除选中、设置渲染延时
│     ├─ reloadView.js # 重新加载白板 View
│     ├─ setBackgroundImage.js # 设置背景图
│     ├─ setOperationMode.js # 白板操作模式
│     ├─ setOther.js # 笔锋、画笔粗细、画笔颜色、文本大小、文本粗体、文本斜体
│     ├─ setScaleFactor.js # 白板缩放功能
│     ├─ setToolType.js # 设置白板工具
│     ├─ uploadFile.js # 上传静态、动态文件
│     ├─ uploadH5File.js # 上传 H5 功能
│     ├─ utils.js # 房间模块，相关更新 DOM 的方法、相关工具方法
│     └─ whiteboard.js # 创建、销毁、切换、查询白板列表相关功能
├─ lib # 第三方 UI 库所需的 CSS、JavaScript 文件、内置的第三方字体文件
├─ main.css # 项目用到的非第三方 UI 的所有 CSS 样式
└─ sdk # 项目引用的 ZEGO SDK
   ├─ ZegoSuperBoardWeb-2.0.0.js # ZEGO  超级白板 SDK
   └─ ZegoExpressWebRTC-2.9.1.js # ZEGO 音视频 SDK

```

## 第三方库说明
项目中功能模块采用原生 JavaScript 编写，同时用到了第三方的 UI 库，代码中使用该 UI 库的地方均已增加注释，仅供参考，开发者可以根据自己的项目选择的框架、UI 库进行处理。

项目所使用的UI库官方文档如下：
- Bootstrap: https://v3.bootcss.com
- Layui: https://www.layui.com/doc/
