/**
 * 中文文案字典
 *
 * 服务端默认渲染这一套（见 index.tsx 的说明）。
 * key 用 "区块.用途" 的平铺命名，与 en.ts 必须严格一一对应。
 * 新增文案时两个文件都要加，否则缺的那一侧会直接显示 key。
 */
const zh: Record<string, string> = {
  // 导航
  "nav.home": "首页",
  "nav.about": "关于",
  "nav.tags": "标签",
  "nav.search": "搜索",
  "nav.projects": "项目",
  "nav.now": "Now",
  "nav.links": "链接",
  "nav.uses": "Uses",
  "nav.explore": "探索",
  "nav.openMenu": "打开导航菜单",
  "nav.closeMenu": "关闭导航菜单",

  // 首页
  "home.greeting": "欢迎来到我的博客",
  "home.tagline": "这里记录一些关于技术、思考和生活的内容。写作帮助我理清思路，也希望对你有所启发。",
  "home.latestPosts": "最新文章",
  "home.empty": "暂时还没有文章，稍后再来看看吧。",
  "home.startHere": "从这里开始",
  "home.readPost": "阅读全文",

  // 热门文章
  "popular.title": "热门文章",
  "popular.empty": "暂无热门文章",

  // 文章页
  "post.notFound": "未找到",
  "post.backHome": "返回首页",
  "post.readingTime": "分钟阅读",
  "post.toc": "目录",

  // 评论
  "comments.title": "评论",
  "comments.desc": "欢迎留下你的想法、问题或补充，评论通过 GitHub Discussions 提供支持。",
  "comments.loading": "评论加载中...",
  "comments.missingTitle": "评论暂时不可用",
  "comments.missingDesc": "请先在环境变量中配置 Giscus 的 repoId 和 categoryId，然后重新部署。",
  "comments.setupGuide": "前往 giscus.app 获取配置 →",
  "comments.reload": "重新加载评论",
  "comments.loadErrorDesc": "评论加载超时，请检查网络连接后重试。",

  // 标签页
  "tags.title": "标签",
  "tags.description": "按标签浏览文章，找到你感兴趣的内容。",
  "tags.metaTitle": "标签",
  "tags.metaDesc": "按标签浏览文章",
  "tags.allTags": "所有标签",
  "tags.articleCount": "共 {count} 篇文章",
  "tags.tagPrefix": "标签：",
  "tags.tagMetaDesc": "包含「{tag}」标签的所有文章",

  // 关于页
  "about.title": "关于",
  "about.intro": "你好，我是 LunaPath。",
  "about.bio": "这里是我记录技术学习、生活思考和阅读笔记的地方。写作帮助我整理思路，也希望能为你带来一些价值。",
  "about.contact": "联系方式",
  "about.contactDesc": "可以通过 GitHub 找到我，或者在文章下方留言讨论。",
  "about.more": "更多页面",
  "about.moreProjects": "正在打磨的项目、实验和作品。",
  "about.moreNow": "最近在学习、创作和关注什么。",
  "about.moreLinks": "收藏的站点和友情链接说明。",
  "about.moreUses": "常用工具、软件和服务。",

  // 内容页
  "projects.title": "项目",
  "projects.description": "这里整理我正在做、做过和持续维护的小项目。",
  "projects.featured": "精选项目",
  "projects.archive": "归档与实验",
  "projects.empty": "项目正在整理中。",
  "projects.featuredEmpty": "精选项目正在整理中。",
  "projects.readPost": "相关文章",
  "projects.status.featured": "精选",
  "projects.status.building": "建设中",
  "projects.status.archived": "已归档",
  "projects.status.paused": "暂停",
  "now.title": "Now",
  "now.description": "最近在做什么。保持轻量、手写和及时更新。",
  "now.updatedAt": "最后更新：{date}",
  "now.empty": "最近状态还在整理中。",
  "links.title": "链接",
  "links.description": "一些值得收藏的站点，以及友情链接说明。",
  "links.exchange": "链接交换",
  "links.broken": "失效处理",
  "links.empty": "链接列表正在整理中。",
  "uses.title": "Uses",
  "uses.description": "我当前使用和推荐的开发工具、软件、设备与服务。",
  "uses.empty": "工具清单正在整理中。",
  "uses.visit": "访问",
  "uses.readPost": "相关文章",

  // 订阅
  "subscribe.title": "📬 订阅博客",
  "subscribe.desc": "不想错过新文章？留下邮箱，有新内容时我会通知你。",
  "subscribe.placeholder": "your@email.com",
  "subscribe.ariaLabel": "邮箱地址",
  "subscribe.btn": "订阅",
  "subscribe.loading": "提交中...",
  "subscribe.success": "订阅成功！感谢你的关注。",
  "subscribe.errorEmpty": "请输入邮箱地址",
  "subscribe.errorFormat": "邮箱格式不正确，请检查后再试",
  "subscribe.errorTooLong": "邮箱地址太长，请检查后再试",
  "subscribe.errorFail": "订阅失败，请稍后再试",
  "subscribe.errorUnavailable": "订阅服务暂不可用，请稍后再试",
  "subscribe.errorNetwork": "网络出错了，请稍后再试",
  "subscribe.already": "你已经订阅过了！",

  // 搜索
  "search.ariaLabel": "搜索文章",
  "search.label": "搜索",
  "search.modalAria": "搜索",
  "search.placeholder": "搜索文章标题、摘要、标签...",
  "search.loading": "加载中...",
  "search.empty": "没有找到相关文章",
  "search.error": "搜索索引加载失败，请稍后再试。",
  "search.retry": "重试",
  "search.filters": "筛选",
  "search.filterTag": "按标签筛选",
  "search.filterSeries": "按系列筛选",
  "search.allTags": "全部标签",
  "search.allSeries": "全部系列",
  "search.clearFilters": "清除",
  "search.seriesPrefix": "系列：",
  "search.move": "移动",
  "search.goto": "跳转",
  "search.close": "关闭",

  // 目录
  "toc.ariaLabel": "文章目录",
  "toc.title": "目录",

  // 主题切换
  "theme.system": "跟随系统",
  "theme.light": "浅色模式",
  "theme.dark": "深色模式",
  "theme.ariaPrefix": "当前：",
  "theme.ariaSuffix": "，点击切换",

  // 侧边栏统计
  "sidebar.posts": "文章",
  "sidebar.tags": "标签",

  // 文章置顶
  "post.pinned": "置顶",

  // 浏览导航
  "browse.title": "浏览",
  "browse.allTags": "所有标签",
  "browse.archive": "按时间归档",

  // 归档页
  "archive.title": "文章归档",
  "archive.daySuffix": "日",

  // 相关文章
  "related.title": "相关文章",

  // 代码复制
  "copy.btn": "复制",
  "copy.ariaLabel": "复制代码",
  "copy.copying": "复制中...",
  "copy.success": "已复制!",
  "copy.fail": "失败",

  // Footer
  "footer.builtWith": "Built with Next.js",

  // 站点描述
  "site.description": "LunaPath 的博客，记录思考和分享知识的地方",
  "site.rssTitle": "LunaPath RSS",

  // 404 页
  "notFound.title": "页面走丢了",
  "notFound.desc": "你要找的页面不存在，可能已被移除或地址有误。",
  "notFound.backHome": "返回首页",
  "notFound.browseTags": "浏览标签",

  // 离线页
  "offline.badge": "Offline",
  "offline.title": "现在处于离线状态",
  "offline.desc": "网络连接不可用。你仍然可以打开之前访问过并已缓存的文章；如果这是第一次访问该页面，请恢复网络后重试。",
  "offline.backHome": "返回首页",
  "offline.reload": "重新加载",

  // 跳过导航
  "a11y.skipToContent": "跳到主要内容",

  // 文章导航
  "post.prev": "上一篇",
  "post.next": "下一篇",
  "post.wordCount": "字",

  // 归档
  "nav.archive": "归档",

  // 联系表单
  "contact.title": "联系我",
  "contact.desc": "有任何问题或想法？欢迎通过下面的表单联系我。",
  "contact.name": "你的名字",
  "contact.namePlaceholder": "LunaPath",
  "contact.email": "邮箱地址",
  "contact.emailPlaceholder": "your@email.com",
  "contact.message": "留言内容",
  "contact.messagePlaceholder": "写下你想说的...",
  "contact.submit": "发送",
  "contact.sending": "发送中...",
  "contact.success": "发送成功！感谢你的留言。",
  "contact.errorEmpty": "请填写所有字段",
  "contact.errorEmail": "邮箱格式不正确",
  "contact.errorTooLong": "内容太长，请精简后再发送",
  "contact.errorFail": "发送失败，请稍后再试",
  "contact.errorUnavailable": "联系服务暂不可用，请稍后再试",
  "contact.errorNetwork": "网络出错了，请稍后再试",

  // 图片灯箱
  "lightbox.close": "关闭",
  "lightbox.prev": "上一张",
  "lightbox.next": "下一张",
  "lightbox.zoom": "放大",

  // 分页
  "pagination.prev": "上一页",
  "pagination.next": "下一页",
  "pagination.aria": "分页导航",

  // 回到顶部
  "backToTop.label": "回到顶部",

  // 赞赏支持
  "donate.title": "☕ 赞赏支持",
  "donate.desc": "如果这篇文章对你有帮助，可以请作者喝杯咖啡~",
  "donate.wechat": "微信",
  "donate.alipay": "支付宝",
  "donate.scanWechat": "请打开微信扫一扫",
  "donate.scanAlipay": "请打开支付宝扫一扫",
  "donate.qrPlaceholder": "收款码占位",
  "donate.replaceHint": "将收款码图片放到 public/donate/ 目录即可替换",

  // 社交分享
  "share.title": "分享文章",
  "share.shareTo": "分享到",
  "share.copyLink": "复制链接",
  "share.copied": "已复制!",

  // 系列文章
  "series.title": "系列文章",
};

export default zh;
