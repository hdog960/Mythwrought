// The development cache lives only on the loopback HTTPS-equivalent origin.
export async function ensureStagedOfflineCache() {
  if (!['localhost','127.0.0.1'].includes(location.hostname) ||
      !globalThis.isSecureContext || !('serviceWorker' in navigator)) return null;
  const worker = new URL('../../sw-m5.js?nonblock-staging=1',import.meta.url);
  const scope = new URL('../../',import.meta.url);
  const active = await navigator.serviceWorker.getRegistration(scope.href);
  if (active?.active?.scriptURL===worker.href) return active;
  if (!navigator.onLine) return null;
  return navigator.serviceWorker.register(worker.href,{scope:scope.pathname,updateViaCache:'none'});
}
