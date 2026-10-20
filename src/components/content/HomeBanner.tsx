/**
 * 首页顶部壁纸（对应 Fuwari MainGridLayout.astro 的 banner）
 *
 * 只出现在首页：整幅图铺满视口宽度，并通过负外边距向上顶到页面顶部，
 * 让 sticky 的导航栏浮在壁纸上方；内容区随后从壁纸下方开始。
 * 图片本身是纯装饰，交给屏幕阅读器跳过。
 */
export default function HomeBanner() {
  return (
    <div className="home-banner" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/banner-night.webp"
        alt=""
        width={2560}
        height={1440}
        className="home-banner__image"
        fetchPriority="high"
        decoding="async"
      />
      <div className="home-banner__shade" />
    </div>
  );
}
