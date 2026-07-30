const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;
const whatsappRecipient = process.env.WHATSAPP_TO
  ? (process.env.WHATSAPP_TO.startsWith('whatsapp:') ? process.env.WHATSAPP_TO : `whatsapp:${process.env.WHATSAPP_TO}`)
  : 'whatsapp:+917075759797';

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 'p1',
    title: 'Aero Knit Jacket',
    description: 'Lightweight jacket for elevated streetwear.',
    category: 'Men',
    price: 1299,
    stock: 8,
    size: ['S', 'M', 'L'],
    color: ['Black', 'Ice'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    badge: 'New'
  },
  {
    id: 'p2',
    title: 'Luna Mini Bag',
    description: 'Soft sculptural bag with metallic finish.',
    category: 'Accessories',
    price: 899,
    stock: 12,
    size: ['One Size'],
    color: ['Rose', 'Silver'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    badge: 'Bestseller'
  },
  {
    id: 'p3',
    title: 'Nova Oversized Tee',
    description: 'Premium cotton tee with a relaxed cut.',
    category: 'Women',
    price: 699,
    stock: 15,
    size: ['S', 'M', 'L', 'XL'],
    color: ['Cream', 'Mauve'],
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
    badge: 'Trending'
  }
];

const orders = [];
let orderCounter = 1;

function generateOrderId() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `ORD${stamp}${String(orderCounter++).padStart(3, '0')}`;
}

function sanitizeOrder(order) {
  return {
    orderId: order.orderId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    total: order.total,
    items: order.items.map((item) => ({ title: item.title, qty: item.qty, price: item.price })),
    history: order.history,
    createdAt: order.createdAt
  };
}

function verifyAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Admin token required' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid admin token' });
  }
}

async function sendOrderNotification(order) {
  if (!twilioClient || !process.env.TWILIO_WHATSAPP_FROM) {
    console.log(`WhatsApp notification skipped for order ${order.orderId}. Configure Twilio credentials to enable it.`);
    return { ok: false, skipped: true };
  }

  const messageText = [
    'New INFINTYY.CREWW order received!',
    `Order ID: ${order.orderId}`,
    `Customer: ${order.customer.fullName}`,
    `Phone: ${order.customer.mobile}`,
    `Payment: ${order.paymentMethod}`,
    `Total: ₹${order.total}`,
    `Items: ${order.items.map((item) => `${item.title} x${item.qty}`).join(', ')}`
  ].join('\n');

  try {
    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: whatsappRecipient,
      body: messageText
    });
    return { ok: true, sid: message.sid };
  } catch (error) {
    console.error(`Failed to send WhatsApp notification for order ${order.orderId}:`, error.message);
    return { ok: false, error: error.message };
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true, app: 'INFINTYY.CREWW' }));
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@infintyy.com' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid admin credentials' });
});

app.post('/api/orders', async (req, res) => {
  const { shipping, paymentMethod, items } = req.body;
  if (!shipping || !items || items.length === 0) return res.status(400).json({ error: 'Cart is empty or incomplete' });

  let total = 0;
  const validatedItems = [];
  for (const item of items) {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return res.status(400).json({ error: `Product ${item.id} not found` });
    if (product.stock < item.qty) return res.status(400).json({ error: `${product.title} is out of stock` });
    total += product.price * item.qty;
    validatedItems.push({ title: product.title, price: product.price, qty: item.qty, productId: product.id });
  }

  const orderId = generateOrderId();
  const order = {
    orderId,
    customer: {
      fullName: shipping.fullName,
      mobile: shipping.mobile,
      email: shipping.email || '',
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      pinCode: shipping.pinCode
    },
    paymentMethod,
    items: validatedItems,
    total,
    status: 'Order Received',
    history: [{ status: 'Order Received', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  await sendOrderNotification(order);
  res.json({ message: `Order placed successfully via ${paymentMethod === 'razorpay' ? 'Razorpay' : 'COD'}.`, order: { orderId, status: order.status, total } });
});

app.get('/api/admin/orders', verifyAdmin, (req, res) => {
  res.json(orders.map((order) => ({ ...order, customer: { ...order.customer, email: '' } })));
});

app.patch('/api/admin/orders/:orderId', verifyAdmin, (req, res) => {
  const { orderId } = req.params;
  const order = orders.find((entry) => entry.orderId === orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  order.status = status;
  order.history.push({ status, timestamp: new Date().toISOString() });
  res.json({ message: 'Order updated', order });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
