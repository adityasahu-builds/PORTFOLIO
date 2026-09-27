/**
 * Cross-tab real-time synchronization helper.
 * Broadcasts an invalidation signal to all open tabs (main site + admin)
 * whenever data is created, updated, or deleted.
 */
export function broadcastDataChange(entity?: string) {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel("portfolio-realtime-sync");
      channel.postMessage({ type: "invalidate", entity });
      setTimeout(() => {
        try {
          channel.close();
        } catch {
          // ignore
        }
      }, 100);
    } catch {
      // safe fallback for environments without BroadcastChannel
    }
  }
}
