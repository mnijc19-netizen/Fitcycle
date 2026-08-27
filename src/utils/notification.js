// Web Notification & Dynamic Title Alert Utility

let originalDocumentTitle = "";

export function initNotification() {
  if (typeof document !== "undefined" && !originalDocumentTitle) {
    originalDocumentTitle = document.title || "FitCycle 智能健身";
  }
}

export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      try {
        Notification.requestPermission().catch(() => {});
      } catch (e) {}
    }
  }
}

export function sendRestCompleteNotification(skin = "default") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    try {
      const titles = {
        cs: "💥 目标达成！组间休息结束！",
        chamber: "⚜️ 完美间歇。准备下一组精准打击！",
        default: "⏰ 组间休息结束！"
      };
      const bodies = {
        cs: "起把狙！开始下一组战术突破！",
        chamber: "他们无法阻挡你的专注。开始下一组！",
        default: "呼吸调整完毕，开始下一组挑战吧！"
      };

      const notif = new Notification(titles[skin] || titles.default, {
        body: bodies[skin] || bodies.default,
        icon: "./themes/cs/icons/c4.svg",
        tag: "fitcycle-rest-timer",
        renotify: true
      });

      // Auto close after 6s
      setTimeout(() => notif.close(), 6000);
    } catch (e) {
      console.warn("Notification error:", e);
    }
  }
}

export function updateDocumentTitleForTimer(seconds) {
  if (typeof document === "undefined") return;
  if (!originalDocumentTitle) originalDocumentTitle = document.title || "FitCycle 智能健身";
  
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeStr = m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
  document.title = `[⏰ ${timeStr} 休息中] ${originalDocumentTitle}`;
}

export function setRestCompleteTitle() {
  if (typeof document === "undefined") return;
  if (!originalDocumentTitle) originalDocumentTitle = document.title || "FitCycle 智能健身";
  document.title = `[🔔 休息结束！冲！] ${originalDocumentTitle}`;
}

export function resetDocumentTitle() {
  if (typeof document === "undefined") return;
  if (originalDocumentTitle) {
    document.title = originalDocumentTitle;
  }
}