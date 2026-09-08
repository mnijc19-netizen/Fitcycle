/**
 * FitCycle Mobile Fullscreen & Minimal-UI Engine
 *
 * Implements mobile browser (iOS Safari & Android Chrome) minimal-UI / fullscreen capsule mode:
 * 1. Automatically collapses the URL bar into the bottom floating capsule on page entry.
 * 2. Ensures the viewport height remains static and stable (via 100lvh & overlays-content).
 * 3. Prevents layout jumping, stretching, or resizing when the user scrolls.
 */

export function initMobileFullscreenCapsule() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const nudgeMinimalUI = () => {
    // On mobile touch devices, a tiny 1px scroll nudges Safari/Chrome into minimal-UI capsule state
    if (window.scrollY === 0) {
      window.scrollTo(0, 1);
    }
  };

  // 1. Initial attempt on document completion
  if (document.readyState === "complete") {
    requestAnimationFrame(() => {
      nudgeMinimalUI();
      setTimeout(nudgeMinimalUI, 200);
    });
  } else {
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        nudgeMinimalUI();
        setTimeout(nudgeMinimalUI, 200);
      });
    }, { passive: true });
  }

  // 2. On first touch gesture, ensure address bar is collapsed into capsule immediately
  window.addEventListener("touchstart", nudgeMinimalUI, { once: true, passive: true });
  window.addEventListener("pointerdown", nudgeMinimalUI, { once: true, passive: true });
}
