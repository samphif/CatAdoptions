require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_REPLACE_WITH_YOUR_SECRET_KEY');

const app = express();
app.use(cors({ origin: 'https://685825c2abe1d4f35a3dc3b6--radiant-cascaron-ad2763.netlify.app' }));
app.use(express.json());

const PRICE_IDS = {
  monthly: 'price_1RcbTaPDjN1uzOMW9QR2bJkk',
  yearly: 'price_1RcqHxPDjN1uzOMWUJoh9OiO'
};

app.post('/create-checkout-session', async (req, res) => {
  const { plan } = req.body;
  const priceId = PRICE_IDS[plan];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://685825c2abe1d4f35a3dc3b6--radiant-cascaron-ad2763.netlify.app/success',
      cancel_url: 'https://685825c2abe1d4f35a3dc3b6--radiant-cascaron-ad2763.netlify.app/',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 