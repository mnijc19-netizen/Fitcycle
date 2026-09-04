// Mobile Ergonomic Scroll Lock Utility
// Prevents background scroll bleed and stray browser scrollbars when modals/sheets are open

let lockCount = 0;
let previousOverflow = "";

export function lockBodyScroll() {
  if (typeof document === "undefined") return;
  lockCount++;
  if (lockCount === 1) {
    previousOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
  }
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.documentElement.style.overscrollBehavior = "";
  }
}

export function getScrollLockCount() {
  return lockCount;
}

export function resetScrollLock() {
  lockCount = 0;
  if (typeof document !== "undefined") {
    document.body.style.overflow = previousOverflow || "";
    document.documentElement.style.overscrollBehavior = "";
  }
}
