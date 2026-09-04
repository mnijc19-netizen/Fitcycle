// Universal Multi-Engine Cross-Device Scroll Utility
// Guarantees reliable scroll measurement and smooth scrolling across:
// - Standard Desktop & Mobile Browsers (Safari, Chrome, Firefox, Edge)
// - iOS & Android Standalone WebApps (PWA / Add to Home Screen)
// - In-App WebViews (WeChat, QQ, Douyin, Android WebView)

export function getUniversalScrollTop() {
  if (typeof window === "undefined") return 0;
  return (
    window.pageYOffset ||
    window.scrollY ||
    document.documentElement?.scrollTop ||
    document.body?.scrollTop ||
    0
  );
}

export function universalScrollToTop(smooth = true) {
  if (typeof window === "undefined") return;
  const behavior = smooth ? "smooth" : "instant";

  // 1. window.scrollTo
  try {
    window.scrollTo({ top: 0, behavior });
  } catch (e) {
    try {
      window.scrollTo(0, 0);
    } catch (_) {}
  }

  // 2. document.documentElement.scrollTo
  try {
    if (document.documentElement) {
      if (typeof document.documentElement.scrollTo === "function") {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior });
      }
      if (!smooth) document.documentElement.scrollTop = 0;
    }
  } catch (e) {
    if (document.documentElement) document.documentElement.scrollTop = 0;
  }

  // 3. document.body.scrollTo
  try {
    if (document.body) {
      if (typeof document.body.scrollTo === "function") {
        document.body.scrollTo({ top: 0, left: 0, behavior });
      }
      if (!smooth) document.body.scrollTop = 0;
    }
  } catch (e) {
    if (document.body) document.body.scrollTop = 0;
  }
}
