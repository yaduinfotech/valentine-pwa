// Service Worker for Valentine PWA
const CACHE_NAME = 'valentine-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/rose.png',
  '/chocolate.png',
  '/teddy.png',
  '/promise.png',
  '/hug.png',
  '/kiss.png',
  '/valentine.png',
  '/propose.png',
  '/rose.mp3',
  '/promise.mp3',
  '/hug.mp3',
  '/valentine.mp3',
  '/propose.mp3'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Background sync for notifications
self.addEventListener('sync', event => {
  if (event.tag === 'valentine-notification') {
    event.waitUntil(sendNotification());
  }
});

function sendNotification() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  if (month === 2 && day >= 7 && day <= 14) {
    const notifications = {
      7: { title: "Rose Day 🌹", body: "May your life bloom like a beautiful rose." },
      8: { title: "Propose Day 💍", body: "Will you stay by my side forever?" },
      9: { title: "Chocolate Day 🍫", body: "Life is sweeter because I have you." },
      10: { title: "Teddy Day 🧸", body: "Sending you a big warm teddy hug." },
      11: { title: "Promise Day 🤝", body: "I promise to hold your hand forever." },
      12: { title: "Hug Day 🤗", body: "A hug makes everything feel right." },
      13: { title: "Kiss Day 💋", body: "Kisses are the language of the soul." },
      14: { title: "Valentine's Day ❤️", body: "Happy Valentine's Day!" }
    };

    const notification = notifications[day];
    if (notification) {
      return self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: '/valentine.png',
        badge: '/valentine.png'
      });
    }
  }
}

// Push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/valentine.png'
  });
});
