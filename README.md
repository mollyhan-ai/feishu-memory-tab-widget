# Feishu Memory Tab Widget

一个面向飞书云文档小组件的五页签交互原型，对应：

1. 完整闭环
2. 记忆分层
3. 写入规则
4. 业务案例
5. 性格趋势

组件提供：

- Tab 切换与键盘导航（方向键、Home、End）
- 响应式布局，适配窄屏文档容器
- 当前页签的 URL 同步
- 本地预览时使用 `localStorage` 保存状态
- 在飞书 Block 容器中优先使用 `tt.Record` 保存状态，并调用 `tt.Bridge.updateHeight` 与 `tt.LifeCycle.notifyAppReady`
- `npm run build` 生成可部署的单文件 `dist/index.html`

## 本地运行

项目不依赖第三方 npm 包：

```bash
npm test
npm run build
```

然后用任意静态 HTTPS 服务托管 `dist/index.html`。飞书云文档小组件需要在飞书开放平台创建对应应用能力、配置组件入口，并把这个页面作为小组件前端资源发布；仅把代码上传到 GitHub 并不会自动安装到飞书文档。

## 接入飞书

1. 在飞书开放平台创建企业自建应用。
2. 为应用开启云文档小组件能力。
3. 配置小组件的入口页面为构建后的 `dist/index.html` 所在 HTTPS 地址。
4. 在飞书文档中通过小组件入口插入该组件。
5. 如果需要跨用户共享内容，把 `src/tab-model.mjs` 中的静态数据替换为应用自己的数据源，并根据飞书权限模型接入服务端。

当前代码已经把交互层与飞书宿主 API 隔离开：在普通浏览器里可以直接预览，在飞书 Block 容器里会自动探测 `window.tt`。

## 重要说明

飞书开放平台的应用配置、权限和发布审核由飞书开发者后台管理。组件前端代码本身不包含任何 App ID、App Secret 或用户凭据。
