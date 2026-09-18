/**
 * 英文文案字典
 *
 * 由客户端语言切换器启用。
 * key 用 "区块.用途" 的平铺命名，与 zh.ts 必须严格一一对应。
 * 新增文案时两个文件都要加，否则缺的那一侧会直接显示 key。
 */
const en: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.about": "About",
  "nav.tags": "Tags",
  "nav.search": "Search",
  "nav.projects": "Projects",
  "nav.now": "Now",
  "nav.links": "Links",
  "nav.uses": "Uses",
  "nav.explore": "Explore",
  "nav.openMenu": "Open navigation menu",
  "nav.closeMenu": "Close navigation menu",

  // Home
  "home.greeting": "Hello, welcome.",
  "home.tagline": "A place for notes on tech, thoughts, and life. Writing helps me think clearly — hope it inspires you too.",
  "home.latestPosts": "Latest Posts",
  "home.empty": "No posts yet. Check back soon.",
  "home.startHere": "Start here",
  "home.readPost": "Read article",

  // Popular posts
  "popular.title": "Popular Posts",
  "popular.empty": "No popular posts yet",

  // Post
  "post.notFound": "Not Found",
  "post.backHome": "Back to Home",
  "post.readingTime": "min read",
  "post.toc": "Contents",

  // Comments
  "comments.title": "Comments",
  "comments.desc": "Share your thoughts, questions, or additions. Comments are powered by GitHub Discussions.",
  "comments.loading": "Loading comments...",
  "comments.missingTitle": "Comments temporarily unavailable",
  "comments.missingDesc": "Set Giscus repoId and categoryId in your environment variables, then redeploy.",
  "comments.setupGuide": "Get config at giscus.app →",
  "comments.reload": "Reload comments",
  "comments.loadErrorDesc": "Comments failed to load. Please check your connection and try again.",

  // Tags
  "tags.title": "Tags",
  "tags.description": "Browse articles by tag to find what interests you.",
  "tags.metaTitle": "Tags",
  "tags.metaDesc": "Browse articles by tag",
  "tags.allTags": "All Tags",
  "tags.articleCount": "{count} articles",
  "tags.tagPrefix": "Tag: ",
  "tags.tagMetaDesc": "All articles tagged '{tag}'",

  // About
  "about.title": "About",
  "about.intro": "Hi, I'm LunaPath.",
  "about.bio": "This is where I document my learnings in tech, reflections on life, and reading notes. Writing helps me organize my thoughts, and I hope it brings you some value too.",
  "about.contact": "Contact",
  "about.contactDesc": "You can find me on GitHub, or leave a comment below any article.",
  "about.more": "More pages",
  "about.moreProjects": "Projects, experiments, and ongoing work.",
  "about.moreNow": "What I am learning, making, and paying attention to lately.",
  "about.moreLinks": "Useful sites and blogroll notes.",
  "about.moreUses": "Tools, software, and services I use.",

  // Content pages
  "projects.title": "Projects",
  "projects.description": "Projects, experiments, and small systems I am building or maintaining.",
  "projects.featured": "Featured",
  "projects.archive": "Archive & experiments",
  "projects.empty": "Projects are being organized.",
  "projects.featuredEmpty": "Featured projects are being organized.",
  "projects.readPost": "Related post",
  "projects.status.featured": "Featured",
  "projects.status.building": "Building",
  "projects.status.archived": "Archived",
  "projects.status.paused": "Paused",
  "now.title": "Now",
  "now.description": "What I am doing lately — lightweight, hand-written, and updated when it changes.",
  "now.updatedAt": "Last updated: {date}",
  "now.empty": "Recent status is being organized.",
  "links.title": "Links",
  "links.description": "Useful sites I want to keep around, plus blogroll notes.",
  "links.exchange": "Link exchange",
  "links.broken": "Broken links",
  "links.empty": "Links are being organized.",
  "uses.title": "Uses",
  "uses.description": "Tools, software, devices, and services I currently use and recommend.",
  "uses.empty": "The uses list is being organized.",
  "uses.visit": "Visit",
  "uses.readPost": "Related post",

  // Subscribe
  "subscribe.title": "📬 Subscribe",
  "subscribe.desc": "Don't want to miss new posts? Leave your email and I'll notify you.",
  "subscribe.placeholder": "your@email.com",
  "subscribe.ariaLabel": "Email address",
  "subscribe.btn": "Subscribe",
  "subscribe.loading": "Submitting...",
  "subscribe.success": "Subscribed! Thanks for following.",
  "subscribe.errorEmpty": "Please enter your email",
  "subscribe.errorFormat": "Invalid email format, please check",
  "subscribe.errorTooLong": "Email address is too long, please check and try again",
  "subscribe.errorFail": "Subscription failed, please try again",
  "subscribe.errorUnavailable": "Subscription service is temporarily unavailable, please try again later",
  "subscribe.errorNetwork": "Network error, please try again",
  "subscribe.already": "You're already subscribed!",

  // Search
  "search.ariaLabel": "Search articles",
  "search.label": "Search",
  "search.modalAria": "Search",
  "search.placeholder": "Search titles, summaries, tags...",
  "search.loading": "Loading...",
  "search.empty": "No articles found",
  "search.error": "Failed to load the search index. Please try again.",
  "search.retry": "Retry",
  "search.filters": "Filters",
  "search.filterTag": "Filter by tag",
  "search.filterSeries": "Filter by series",
  "search.allTags": "All tags",
  "search.allSeries": "All series",
  "search.clearFilters": "Clear",
  "search.seriesPrefix": "Series: ",
  "search.move": "Move",
  "search.goto": "Go",
  "search.close": "Close",

  // TOC
  "toc.ariaLabel": "Table of contents",
  "toc.title": "Contents",

  // Theme
  "theme.system": "System",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.ariaPrefix": "Current: ",
  "theme.ariaSuffix": ", click to switch",

  // Sidebar stats
  "sidebar.posts": "posts",
  "sidebar.tags": "tags",

  // Post pinned
  "post.pinned": "Pinned",

  // Browse navigation
  "browse.title": "Browse",
  "browse.allTags": "All tags",
  "browse.archive": "Archive by date",

  // Archive page
  "archive.title": "Archive",
  "archive.daySuffix": "",

  // Related Posts
  "related.title": "Related Posts",

  // Code Copy
  "copy.btn": "Copy",
  "copy.ariaLabel": "Copy code",
  "copy.copying": "Copying...",
  "copy.success": "Copied!",
  "copy.fail": "Failed",

  // Footer
  "footer.builtWith": "Built with Next.js",

  // Site description
  "site.description": "LunaPath's blog — notes on tech, thoughts, and life",
  "site.rssTitle": "LunaPath RSS",

  // 404
  "notFound.title": "Page Not Found",
  "notFound.desc": "The page you're looking for doesn't exist — it may have been moved or the link is incorrect.",
  "notFound.backHome": "Back to Home",
  "notFound.browseTags": "Browse Tags",

  // Offline
  "offline.badge": "Offline",
  "offline.title": "You are offline",
  "offline.desc": "The network is unavailable. You can still open previously visited and cached pages. If this is your first visit, please reconnect and try again.",
  "offline.backHome": "Back to Home",
  "offline.reload": "Reload",

  // Skip link
  "a11y.skipToContent": "Skip to content",

  // Post nav
  "post.prev": "Previous",
  "post.next": "Next",
  "post.wordCount": "words",

  // Archive
  "nav.archive": "Archive",

  // Contact form
  "contact.title": "Contact Me",
  "contact.desc": "Have a question or thought? Feel free to reach out via the form below.",
  "contact.name": "Your Name",
  "contact.namePlaceholder": "LunaPath",
  "contact.email": "Email Address",
  "contact.emailPlaceholder": "your@email.com",
  "contact.message": "Message",
  "contact.messagePlaceholder": "Write your message...",
  "contact.submit": "Send",
  "contact.sending": "Sending...",
  "contact.success": "Message sent! Thanks for reaching out.",
  "contact.errorEmpty": "Please fill in all fields",
  "contact.errorEmail": "Invalid email format",
  "contact.errorTooLong": "Message is too long, please shorten it and try again",
  "contact.errorFail": "Failed to send, please try again",
  "contact.errorUnavailable": "Contact service is temporarily unavailable, please try again later",
  "contact.errorNetwork": "Network error, please try again",

  // Lightbox
  "lightbox.close": "Close",
  "lightbox.prev": "Previous",
  "lightbox.next": "Next",
  "lightbox.zoom": "Zoom",

  // Pagination
  "pagination.prev": "Prev",
  "pagination.next": "Next",
  "pagination.aria": "Pagination",

  // Back to top
  "backToTop.label": "Back to top",

  // Donate
  "donate.title": "☕ Support",
  "donate.desc": "If this article helped you, consider buying the author a coffee~",
  "donate.wechat": "WeChat",
  "donate.alipay": "Alipay",
  "donate.scanWechat": "Open WeChat to scan",
  "donate.scanAlipay": "Open Alipay to scan",
  "donate.qrPlaceholder": "QR Code Placeholder",
  "donate.replaceHint": "Drop QR images into public/donate/ to replace",

  // Share
  "share.title": "Share",
  "share.shareTo": "Share to",
  "share.copyLink": "Copy Link",
  "share.copied": "Copied!",

  // Series
  "series.title": "Series",
};

export default en;
