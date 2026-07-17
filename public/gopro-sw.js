self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/vid/')) {
    const passcode = url.searchParams.get('gopropass');
    if (passcode) {
      const cleanUrl = new URL(event.request.url);
      cleanUrl.searchParams.delete('gopropass');

      const headers = new Headers(event.request.headers);
      headers.set('Authorization', `password=${passcode}`);

      const fetchRequest = new Request(cleanUrl.toString(), {
        method: event.request.method,
        headers: headers,
        mode: 'cors',
        credentials: event.request.credentials,
        cache: event.request.cache,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
      });

      event.respondWith(
        fetch(fetchRequest).catch((err) => {
          console.error("SW fetch error for /vid/:", err);
          return fetch(event.request);
        })
      );
    }
  }
});
