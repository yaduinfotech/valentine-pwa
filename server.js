const express = require('express');
const path = require('path');
const webpush = require('web-push');
const app = express();
const PORT = process.env.PORT || 3000;

// Web Push setup
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:example@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

console.log('VAPID Public Key:', vapidKeys.publicKey);

// In-memory storage for subscriptions and opened status
let subscriptions = [];
let openedDays = new Set();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get VAPID public key
app.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// Endpoint to subscribe
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Endpoint to mark as opened
app.post('/opened', (req, res) => {
  const today = new Date().toDateString();
  openedDays.add(today);
  res.status(200).json({});
});

// Function to send notification
function sendNotification(subscription, payload) {
  webpush.sendNotification(subscription, JSON.stringify(payload)).catch(err => {
    console.error('Error sending notification:', err);
  });
}

// Hourly check and send notifications if not opened
setInterval(() => {
  const now = new Date();
  const today = now.toDateString();
  const hour = now.getHours();

  if (!openedDays.has(today) && hour >= 9 && hour <= 21) { // Between 9 AM and 9 PM
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
        subscriptions.forEach(sub => {
          sendNotification(sub, notification);
        });
      }
    }
  }
}, 60 * 60 * 1000); // Every hour

// Start server
app.listen(PORT, () => {
  console.log(`Valentine PWA running on http://localhost:${PORT}`);
});
