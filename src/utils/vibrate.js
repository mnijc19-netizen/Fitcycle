export function triggerHaptic(type = "light") {
  if (!navigator || !navigator.vibrate) return;
  try {
    if (type === "light") {
      navigator.vibrate(15);
    } else if (type === "medium") {
      navigator.vibrate(35);
    } else if (type === "success") {
      navigator.vibrate([20, 50, 40]);
    } else if (type === "warning") {
      navigator.vibrate([50, 100, 50]);
    } else if (type === "restComplete") {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
  } catch (e) {
    // Ignore if vibration disallowed by browser permissions
  }
}
