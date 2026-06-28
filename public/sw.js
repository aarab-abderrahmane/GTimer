const CACHE_NAME = "gtimer-v1";

const ASSETS = [
  "/",
  "/manifest.json",
];

const STRATEGIES = {
  CACHE_FIRST: [
    /\/fonts\//,
    /\/images\//,
    /\.(woff2?|ttf|otf)$/,
    /\.(png|jpg|jpeg|webp|avif|svg)$/,
    /\/manifest\.json$/,
  ],
  STALE_WHILE_REVALIDATE: [/\/videos\//, /\.(mp4|webm)$/],
  NETWORK_FIRST: [/^\/$/, /\/[a-z]{2}(-[A-Z]{2})?\//],
};

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  if (STRATEGIES.CACHE_FIRST.some((p) => p.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
  } else if (STRATEGIES.STALE_WHILE_REVALIDATE.some((p) => p.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (STRATEGIES.NETWORK_FIRST.some((p) => p.test(url.pathname))) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request: Request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request: Request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached ?? fetchPromise;
}

async function networkFirst(request: Request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}

export {};
