import { ref, computed } from "vue";

export const isOnline = ref(typeof navigator !== "undefined" ? navigator.onLine : true);

export const networkStatusText = computed(() => {
  return isOnline.value ? "在线" : "离线 (健身房弱网保护中)";
});

let isInitialized = false;

/**
 * Initializes listeners for online and offline network events
 * @param {Function} onStatusChange - optional callback when status changes
 */
export function initNetworkStatusListener(onStatusChange = null) {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;

  const handleOnline = () => {
    isOnline.value = true;
    if (onStatusChange) onStatusChange(true);
  };

  const handleOffline = () => {
    isOnline.value = false;
    if (onStatusChange) onStatusChange(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
}
