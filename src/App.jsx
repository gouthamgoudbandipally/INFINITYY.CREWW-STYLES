import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Menu, Search, ShoppingBag, Sparkles, Star, Heart, ShieldCheck, X, LayoutGrid, Ticket, Package, ImagePlus } from 'lucide-react';

const API = 'http://localhost:5000/api';
const placeholderLogo = '/logo.svg';
const adminCredentials = { email: 'admin@infintyy.com', password: 'admin123' };
const orderStatuses = ['Order Received', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const defaultProducts = [
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

const defaultBanners = [
  {
    id: 'b1',
    title: 'New season launch',
    subtitle: 'Exclusive essentials built for the city and the club.',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    link: '/shop'
  }
];

const defaultCoupons = [
  { id: 'c1', code: 'WELCOME10', discountPercent: 10, active: true }
];

function loadState(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function brandLogo() {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold tracking-[0.3em] text-white">
      <img src={placeholderLogo} alt="INFINTYY.CREWW logo" className="h-8 w-8 rounded-full object-cover" />
      <span>INFINTYY.CREWW</span>
    </div>
  );
}

function Navbar({ cartCount, wishlistCount, mobileMenuOpen, onToggleMenu }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {brandLogo()}
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/cart" aria-label="Cart" className="relative rounded-full border border-white/10 px-2 py-2 text-slate-300 flex items-center">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] text-white">{cartCount}</span>}
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-full border border-white/10 px-2 py-2 text-slate-300 flex items-center">
              <Heart size={18} />
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-pink-500 px-1.5 py-0.5 text-[10px] text-white">{wishlistCount}</span>}
            </Link>
          </div>
          <button className="rounded-full border border-white/10 p-2 text-slate-300 md:hidden" onClick={onToggleMenu}><Menu size={18} /></button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-300">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="rounded-full px-3 py-2 hover:text-white">Home</Link>
            <Link to="/shop" className="rounded-full px-3 py-2 hover:text-white">Shop</Link>
            <Link to="/about" className="rounded-full px-3 py-2 hover:text-white">About</Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/wishlist" className="rounded-full border border-white/10 px-3 py-2 text-slate-300 hover:text-white">Wishlist</Link>
            <Link to="/cart" className="rounded-full border border-white/10 px-3 py-2 text-slate-300 hover:text-white">Add Cart</Link>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="border-t border-white/10 bg-slate-950/95 p-4 md:hidden">
        <div className="flex flex-col gap-3 text-sm text-slate-300">
          <Link to="/" onClick={onToggleMenu}>Home</Link>
          <Link to="/shop" onClick={onToggleMenu}>Shop</Link>
          <Link to="/about" onClick={onToggleMenu}>About</Link>
          <Link to="/wishlist" onClick={onToggleMenu}>Wishlist</Link>
          <Link to="/cart" onClick={onToggleMenu}>Add Cart</Link>
        </div>
      </div>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 px-4 py-10 text-sm text-slate-400 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src={placeholderLogo} alt="INFINTYY.CREWW logo" className="h-8 w-8 rounded-full object-cover" />
          <div>
            <div className="font-semibold tracking-[0.3em] text-white">INFINTYY.CREWW</div>
            <div>Guest-only checkout, elevated essentials.</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-slate-300">
            <a href="https://www.instagram.com/infinityy.creww?igsh=MXVwd29oc2xhbXB1eQ==" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a href="https://www.facebook.com/share/1aWGKxGpPH/" target="_blank" rel="noreferrer"><Facebook size={18} /></a>
          </div>
          <Link to="/admin" className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ products, banners, wishlist, onAddToCart, onToggleWishlist, viewed }) {
  const featured = products.slice(0, 3);
  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-pink-600/20 via-slate-900 to-cyan-600/20 p-8 lg:p-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-sm text-pink-200"><Sparkles size={16} /> Guest-only checkout</div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">INFINTYY.CREWW brings bold style to everyday essentials.</h1>
            <p className="text-lg text-slate-300">Discover curated fashion, accessories, and effortless drops without creating an account.</p>
            <div className="flex gap-3">
              <Link to="/shop" className="rounded-full bg-white px-5 py-3 font-medium text-slate-900">Shop Now</Link>
            </div>
          </div>
          <div className="grid gap-3 lg:w-[320px]">
            {featured.map((p) => <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><div className="text-sm text-slate-400">{p.badge}</div><div className="font-medium text-white">{p.title}</div></div>)}
          </div>
        </div>
      </section>

      {banners.length > 0 && <section className="mx-auto max-w-7xl px-2">
        <div className="grid gap-4 md:grid-cols-2">
          {banners.map((banner) => <div key={banner.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
            <img src={banner.imageUrl} alt={banner.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">{banner.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{banner.subtitle}</p>
            </div>
          </div>)}
        </div>
      </section>}

      <section className="mx-auto max-w-7xl space-y-4 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Featured Picks</h2>
          <Link to="/shop" className="text-sm text-cyan-300">Browse all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
              <img src={product.images[0]} alt={product.title} className="h-56 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">{product.category}</span>
                  <button onClick={() => onToggleWishlist(product)} className="text-pink-300">{wishlist.some((i) => i.id === product.id) ? '♥' : '♡'}</button>
                </div>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="text-sm text-slate-400">{product.description}</p>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-cyan-300">₹{product.price}</div>
                  <button onClick={() => onAddToCart(product)} className="rounded-full bg-pink-500 px-4 py-2 text-sm text-white">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-2">
        <h2 className="mb-4 text-2xl font-semibold text-white">Recently Viewed</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {viewed.map((product) => (<div key={product.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"><div className="font-medium text-white">{product.title}</div><div className="text-sm text-slate-400">{product.category}</div></div>))}
        </div>
      </section>
    </div>
  );
}

function ShopPage({ products, filters, setFilters, wishlist, onAddToCart, onToggleWishlist }) {
  const filteredProducts = useMemo(() => products.filter((product) => {
    const q = filters.query.toLowerCase();
    const matchesQuery = product.title.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = product.price <= filters.maxPrice;
    const matchesSize = !filters.size || product.size.includes(filters.size);
    const matchesColor = !filters.color || product.color.includes(filters.color);
    const matchesStock = !filters.inStock || product.stock > 0;
    return matchesQuery && matchesCategory && matchesPrice && matchesSize && matchesColor && matchesStock;
  }), [products, filters]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Shop the edit</h1>
            <p className="text-sm text-slate-400">Search, filter, and discover standout pieces instantly.</p>
          </div>
          <div className="flex flex-col gap-2 lg:w-[360px]">
            <input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} className="rounded-full border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white" placeholder="Search products" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
              <option value="">All</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Max Price</label>
            <input type="range" min="300" max="2000" step="100" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} className="w-full" />
            <div className="text-sm text-slate-400">Up to ₹{filters.maxPrice}</div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Size</label>
            <select value={filters.size} onChange={(e) => setFilters({ ...filters, size: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
              <option value="">Any</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="One Size">One Size</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Color</label>
            <select value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
              <option value="">Any</option>
              <option value="Black">Black</option>
              <option value="Ice">Ice</option>
              <option value="Rose">Rose</option>
              <option value="Silver">Silver</option>
              <option value="Cream">Cream</option>
              <option value="Mauve">Mauve</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} /> In Stock only</label>
        </aside>
        <div className="grid gap-5 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
              <img src={product.images[0]} alt={product.title} className="h-48 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">{product.category}</span>
                  <button onClick={() => onToggleWishlist(product)} className="text-pink-300">{wishlist.some((i) => i.id === product.id) ? '♥' : '♡'}</button>
                </div>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="text-sm text-slate-400">{product.description}</p>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-cyan-300">₹{product.price}</div>
                  <button onClick={() => onAddToCart(product)} className="rounded-full bg-pink-500 px-4 py-2 text-sm text-white">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage({ products, wishlist, onAddToCart, onToggleWishlist, onViewed }) {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const product = products.find((item) => item.id === id) || products[0];
  const similar = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  useEffect(() => {
    if (product) onViewed(product);
  }, [product, onViewed]);

  if (!product) return <Navigate to="/shop" />;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4">
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <img src={product.images[0]} alt={product.title} className="h-[420px] w-full rounded-[2rem] object-cover" />
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">{product.category}</span>
            <button onClick={() => onToggleWishlist(product)} className="text-pink-300">{wishlist.some((i) => i.id === product.id) ? '♥' : '♡'}</button>
          </div>
          <h1 className="text-3xl font-semibold text-white">{product.title}</h1>
          <p className="text-slate-400">{product.description}</p>
          <div className="flex items-center gap-2 text-amber-300"><Star fill="currentColor" size={16} /> 4.8</div>
          <div className="text-3xl font-semibold text-white">₹{product.price}</div>
          <div className="text-sm text-slate-400">In stock: {product.stock}</div>
          <button onClick={() => onAddToCart(product)} className="w-full rounded-full bg-pink-500 px-4 py-3 font-medium text-white">Add to Cart</button>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-white">Similar Products</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {similar.map((item) => <Link key={item.id} to={`/product/${item.id}`} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4"><div className="font-medium text-white">{item.title}</div><div className="text-sm text-slate-400">₹{item.price}</div></Link>)}
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onQtyChange, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4">
      <h1 className="text-3xl font-semibold text-white">Your Cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-3">
          {cart.length === 0 && <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-8 text-slate-400">Your cart is empty.</div>}
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-sm text-slate-400">₹{item.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onQtyChange(item.id, -1)} className="rounded-full border border-white/10 px-3 py-1 text-white">-</button>
                <span className="w-8 text-center text-white">{item.qty}</span>
                <button onClick={() => onQtyChange(item.id, 1)} className="rounded-full border border-white/10 px-3 py-1 text-white">+</button>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-sm text-pink-300">Remove</button>
            </div>
          ))}
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold text-white">Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400"><span>Subtotal</span><span>₹{total}</span></div>
          <button onClick={onCheckout} className="mt-6 w-full rounded-full bg-cyan-500 px-4 py-3 font-medium text-slate-950">Continue to Checkout</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, onPlaceOrder }) {
  const [shipping, setShipping] = useState({ fullName: '', mobile: '', email: '', address: '', city: '', state: '', pinCode: '' });
  const [method, setMethod] = useState('cod');
  const [message, setMessage] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const buildWhatsAppUrl = (orderId, shippingInfo, paymentMethod, items, total) => {
    const phone = '9170759797';
    const lines = [
      'INFINTYY.CREWW Order Details',
      `Order ID: ${orderId}`,
      `Name: ${shippingInfo.fullName}`,
      `Mobile: ${shippingInfo.mobile}`,
      `Payment Method: ${paymentMethod}`,
      `Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pinCode}`,
      'Items:'
    ];
    items.forEach((item) => lines.push(`- ${item.title} x${item.qty} @ ₹${item.price}`));
    lines.push(`Total: ₹${total}`);
    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { shipping, paymentMethod: method, items: cart.map((item) => ({ id: item.id, title: item.title, price: item.price, qty: item.qty })) };
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setMessage(data.message || data.error || 'Order created');
    if (data.order) {
      const orderData = {
        id: Date.now(),
        orderId: data.order.orderId,
        customer: shipping,
        paymentMethod: method,
        items: cart.map((item) => ({ title: item.title, qty: item.qty, price: item.price })),
        total,
        status: 'Order Received',
        history: [{ status: 'Order Received', timestamp: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };
      onPlaceOrder(orderData);
      const whatsappUrl = buildWhatsAppUrl(orderData.orderId, shipping, method, orderData.items, total);
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4">
      <h1 className="text-3xl font-semibold text-white">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="Full Name" />
            <input required value={shipping.mobile} onChange={(e) => setShipping({ ...shipping, mobile: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="Mobile Number" />
            <input value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="Email (optional)" />
            <input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="City" />
            <input required value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="State" />
            <input required value={shipping.pinCode} onChange={(e) => setShipping({ ...shipping, pinCode: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="PIN Code" />
          </div>
          <textarea required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="min-h-[100px] w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" placeholder="Delivery Address" />
          <div className="flex gap-3">
            <button type="button" onClick={() => setMethod('cod')} className={`rounded-full px-4 py-2 text-sm ${method === 'cod' ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}`}>Cash on Delivery</button>
            <button type="button" onClick={() => setMethod('razorpay')} className={`rounded-full px-4 py-2 text-sm ${method === 'razorpay' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Razorpay</button>
          </div>
          {message && <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">{message}</div>}
          <button type="submit" className="rounded-full bg-pink-500 px-4 py-3 font-medium text-white">Place Order</button>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            {cart.map((item) => <div key={item.id} className="flex justify-between"><span>{item.title} × {item.qty}</span><span>₹{item.price * item.qty}</span></div>)}
          </div>
          <div className="mt-6 flex justify-between text-lg font-semibold text-white"><span>Total</span><span>₹{total}</span></div>
        </div>
      </form>
    </div>
  );
}

function OrderConfirmationPage({ order }) {
  if (!order) return <Navigate to="/" />;
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-8 text-center text-slate-100">
      <h1 className="text-3xl font-semibold text-white">Order Confirmed</h1>
      <p className="mt-3 text-slate-300">Your order has been placed successfully.</p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <div className="text-sm text-slate-400">Order ID</div>
        <div className="text-2xl font-semibold text-white">{order.orderId}</div>
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, onRemove }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4">
      <h1 className="text-3xl font-semibold text-white">Wishlist</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {wishlist.length === 0 && <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-8 text-slate-400">No saved favorites yet.</div>}
        {wishlist.map((product) => <div key={product.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4"><div className="font-medium text-white">{product.title}</div><div className="text-sm text-slate-400">₹{product.price}</div><button onClick={() => onRemove(product.id)} className="mt-4 text-sm text-pink-300">Remove</button></div>)}
      </div>
    </div>
  );
}

function AdminPanel({
  adminAuthenticated,
  adminError,
  adminLogin,
  setAdminLogin,
  onLogin,
  onLogout,
  activeTab,
  setActiveTab,
  products,
  productForm,
  setProductForm,
  editingProductId,
  onSaveProduct,
  onEditProduct,
  onDeleteProduct,
  banners,
  bannerForm,
  setBannerForm,
  onSaveBanner,
  onDeleteBanner,
  handleBannerImageChange,
  coupons,
  couponForm,
  setCouponForm,
  onSaveCoupon,
  onDeleteCoupon,
  orders,
  onStatusChange,
  onClose
}) {
  return (
    <div className="min-h-screen bg-slate-950/90 py-10">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-300"><ShieldCheck size={18} /> Admin Panel</div>
            <div className="text-sm text-slate-400">Manage products, banners, coupons, and orders from the customer page.</div>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300"><X size={18} /></button>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[220px,1fr]">
          {adminAuthenticated && (
            <aside className="space-y-2">
              {[
                { id: 'products', label: 'Products', icon: LayoutGrid },
                { id: 'banners', label: 'Banners', icon: ImagePlus },
                { id: 'coupons', label: 'Coupons', icon: Ticket },
                { id: 'orders', label: 'Orders', icon: Package }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-950/60 text-slate-300'}`}>
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </aside>
          )}
          <div className="space-y-6">
            {!adminAuthenticated ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
                <h2 className="text-2xl font-semibold text-white">Protected admin access</h2>
                <p className="mt-2 text-sm text-slate-400">Use the default admin credentials to unlock full management controls.</p>
                <form onSubmit={onLogin} className="mt-6 space-y-3">
                  <input required value={adminLogin.email} onChange={(e) => setAdminLogin({ ...adminLogin, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Email" />
                  <input required type="password" value={adminLogin.password} onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Password" />
                  {adminError && <div className="text-sm text-red-300">{adminError}</div>}
                  <button className="rounded-full bg-cyan-500 px-4 py-3 font-medium text-slate-950">Unlock Panel</button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                  <div>
                    <div className="text-sm text-slate-400">Authenticated admin</div>
                    <div className="text-lg font-semibold text-white">{adminCredentials.email}</div>
                  </div>
                  <button onClick={onLogout} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">Logout</button>
                </div>

                {activeTab === 'products' && (
                  <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                      <h3 className="text-xl font-semibold text-white">Product manager</h3>
                      <form onSubmit={onSaveProduct} className="mt-4 space-y-3">
                        <input required value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Product title" />
                        <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="min-h-[90px] w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Description" />
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Category" />
                          <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Price" />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input type="number" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Stock" />
                          <input value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Badge" />
                        </div>
                        <label className="block text-sm text-slate-300">Upload image(s)</label>
                        <input type="file" accept="image/*" multiple onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const fileUrls = await Promise.all(files.map((file) => new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          })));
                          setProductForm({ ...productForm, images: fileUrls });
                        }} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" />
                        {productForm.images && productForm.images.length > 0 && (
                          <div className="grid gap-2 pt-3 md:grid-cols-4">
                            {productForm.images.map((src, index) => <img key={`${src}-${index}`} src={src} alt={`Preview ${index + 1}`} className="h-20 w-full rounded-xl object-cover" />)}
                          </div>
                        )}
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={productForm.size} onChange={(e) => setProductForm({ ...productForm, size: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Sizes (S, M, L)" />
                          <input value={productForm.color} onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Colors (Black, Ivory)" />
                        </div>
                        <button className="rounded-full bg-pink-500 px-4 py-3 font-medium text-white">{editingProductId ? 'Update Product' : 'Create Product'}</button>
                      </form>
                    </div>
                    <div className="space-y-3">
                      {products.map((product) => <div key={product.id} className="rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{product.title}</div>
                            <div className="text-sm text-slate-400">₹{product.price} • Stock {product.stock}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => onEditProduct(product)} className="rounded-full border border-white/10 px-3 py-1 text-sm text-cyan-200">Edit</button>
                            <button onClick={() => onDeleteProduct(product.id)} className="rounded-full border border-white/10 px-3 py-1 text-sm text-pink-300">Delete</button>
                          </div>
                        </div>
                      </div>)}
                    </div>
                  </div>
                )}

                {activeTab === 'banners' && (
                  <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                      <h3 className="text-xl font-semibold text-white">Banner manager</h3>
                      <form onSubmit={onSaveBanner} className="mt-4 space-y-3">
                        <input required value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Banner title" />
                        <textarea required value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} className="min-h-[90px] w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Subtitle" />
                        <label className="block text-sm text-slate-400">Banner image</label>
                        <input required type="file" accept="image/*" onChange={handleBannerImageChange} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white file:rounded-full file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-slate-950" />
                        {bannerForm.imageUrl && <img src={bannerForm.imageUrl} alt="Banner preview" className="mt-2 h-32 w-full rounded-2xl object-cover" />}
                        <input value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Link" />
                        <button className="rounded-full bg-cyan-500 px-4 py-3 font-medium text-slate-950">Save Banner</button>
                      </form>
                    </div>
                    <div className="space-y-3">
                      {banners.map((banner) => <div key={banner.id} className="rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-4">
                        <div className="font-semibold text-white">{banner.title}</div>
                        <div className="mt-2 text-sm text-slate-400">{banner.subtitle}</div>
                        <button onClick={() => onDeleteBanner(banner.id)} className="mt-3 text-sm text-pink-300">Delete</button>
                      </div>)}
                    </div>
                  </div>
                )}

                {activeTab === 'coupons' && (
                  <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                      <h3 className="text-xl font-semibold text-white">Coupon manager</h3>
                      <form onSubmit={onSaveCoupon} className="mt-4 space-y-3">
                        <input required value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Coupon code" />
                        <input type="number" required value={couponForm.discountPercent} onChange={(e) => setCouponForm({ ...couponForm, discountPercent: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white" placeholder="Discount %" />
                        <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={couponForm.active} onChange={(e) => setCouponForm({ ...couponForm, active: e.target.checked })} /> Active</label>
                        <button className="rounded-full bg-pink-500 px-4 py-3 font-medium text-white">Save Coupon</button>
                      </form>
                    </div>
                    <div className="space-y-3">
                      {coupons.map((coupon) => <div key={coupon.id} className="rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-4">
                        <div className="font-semibold text-white">{coupon.code}</div>
                        <div className="text-sm text-slate-400">{coupon.discountPercent}% off • {coupon.active ? 'Active' : 'Inactive'}</div>
                        <button onClick={() => onDeleteCoupon(coupon.id)} className="mt-3 text-sm text-pink-300">Delete</button>
                      </div>)}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-3">
                    {orders.map((order) => <div key={order.id} className="rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold text-white">{order.orderId}</div>
                          <div className="text-sm text-slate-400">{order.customer?.fullName || 'Guest'} • {order.paymentMethod}</div>
                        </div>
                        <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white">
                          {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                      <div className="mt-3 text-sm text-slate-400">Items: {order.items?.map((item) => `${item.title} × ${item.qty}`).join(', ')}</div>
                      <div className="mt-2 text-sm text-cyan-200">Total: ₹{order.total}</div>
                    </div>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(() => loadState('infintyy-products', defaultProducts));
  const [banners, setBanners] = useState(() => loadState('infintyy-banners', defaultBanners));
  const [coupons, setCoupons] = useState(() => loadState('infintyy-coupons', defaultCoupons));
  const [orders, setOrders] = useState(() => loadState('infintyy-orders', []));
  const [cart, setCart] = useState(() => loadState('infintyy-cart', []));
  const [wishlist, setWishlist] = useState(() => loadState('infintyy-wishlist', []));
  const [viewed, setViewed] = useState(() => loadState('infintyy-viewed', []));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ query: '', category: '', maxPrice: 2000, size: '', color: '', inStock: false });
  const [order, setOrder] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => Boolean(localStorage.getItem('infintyy-admin-token')));
  const [activeAdminTab, setActiveAdminTab] = useState('products');
  const [adminLogin, setAdminLogin] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const [productForm, setProductForm] = useState({ title: '', description: '', category: 'Men', price: '', stock: '', images: [], size: '', color: '', badge: 'New' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '', active: true });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('infintyy-cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('infintyy-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem('infintyy-viewed', JSON.stringify(viewed));
  }, [viewed]);
  useEffect(() => {
    localStorage.setItem('infintyy-products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('infintyy-banners', JSON.stringify(banners));
  }, [banners]);
  useEffect(() => {
    localStorage.setItem('infintyy-coupons', JSON.stringify(coupons));
  }, [coupons]);
  useEffect(() => {
    localStorage.setItem('infintyy-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev.filter((item) => item.id !== product.id) : [...prev, product]);
  };

  const recordViewed = (product) => {
    setViewed((prev) => [product, ...prev.filter((item) => item.id !== product.id)].slice(0, 4));
  };

  const updateQty = (id, change) => {
    setCart((prev) => prev.flatMap((item) => item.id === id ? (item.qty + change > 0 ? [{ ...item, qty: item.qty + change }] : []) : [item]));
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const checkout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  const placeOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setOrder(newOrder);
    setCart([]);
    navigate('/confirmation');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminLogin.email === adminCredentials.email && adminLogin.password === adminCredentials.password) {
      localStorage.setItem('infintyy-admin-token', 'demo-jwt');
      setAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Invalid admin credentials');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('infintyy-admin-token');
    setAdminAuthenticated(false);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = {
      ...(!editingProductId ? { id: `p-${Date.now()}` } : {}),
      title: productForm.title,
      description: productForm.description,
      category: productForm.category || 'Men',
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      images: Array.isArray(productForm.images) ? productForm.images : productForm.images.split(',').map((entry) => entry.trim()).filter(Boolean),
      size: productForm.size.split(',').map((entry) => entry.trim()).filter(Boolean),
      color: productForm.color.split(',').map((entry) => entry.trim()).filter(Boolean),
      badge: productForm.badge || 'New'
    };
    if (editingProductId) {
      setProducts((prev) => prev.map((product) => product.id === editingProductId ? { ...product, ...payload } : product));
      setEditingProductId(null);
    } else {
      setProducts((prev) => [payload, ...prev]);
    }
    setProductForm({ title: '', description: '', category: 'Men', price: '', stock: '', images: [], size: '', color: '', badge: 'New' });
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      images: Array.isArray(product.images) ? product.images : [product.images],
      size: product.size.join(', '),
      color: product.color.join(', '),
      badge: product.badge
    });
    setActiveAdminTab('products');
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBannerForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    const payload = {
      id: `b-${Date.now()}`,
      title: bannerForm.title,
      subtitle: bannerForm.subtitle,
      imageUrl: bannerForm.imageUrl,
      link: bannerForm.link
    };
    setBanners((prev) => [payload, ...prev]);
    setBannerForm({ title: '', subtitle: '', imageUrl: '', link: '' });
  };

  const handleDeleteBanner = (id) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const payload = {
      id: `c-${Date.now()}`,
      code: couponForm.code.toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      active: couponForm.active
    };
    setCoupons((prev) => [payload, ...prev]);
    setCouponForm({ code: '', discountPercent: '', active: true });
  };

  const handleDeleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setOrders((prev) => prev.map((order) => order.id === id ? { ...order, status, history: [...order.history, { status, timestamp: new Date().toISOString() }] } : order));
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 overflow-x-hidden">
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} mobileMenuOpen={mobileMenuOpen} onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <main className="px-2 py-6 lg:px-0">
        <Routes>
          <Route path="/" element={<HomePage products={products} banners={banners} wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} viewed={viewed} />} />
          <Route path="/shop" element={<ShopPage products={products} filters={filters} setFilters={setFilters} wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />} />
          <Route path="/product/:id" element={<ProductDetailPage products={products} wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} onViewed={recordViewed} />} />
          <Route path="/cart" element={<CartPage cart={cart} onQtyChange={updateQty} onRemove={removeItem} onCheckout={checkout} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onPlaceOrder={placeOrder} />} />
          <Route path="/confirmation" element={<OrderConfirmationPage order={order} />} />
          <Route path="/admin" element={<AdminPanel adminAuthenticated={adminAuthenticated} adminError={adminError} adminLogin={adminLogin} setAdminLogin={setAdminLogin} onLogin={handleAdminLogin} onLogout={handleAdminLogout} activeTab={activeAdminTab} setActiveTab={setActiveAdminTab} products={products} productForm={productForm} setProductForm={setProductForm} editingProductId={editingProductId} onSaveProduct={handleSaveProduct} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct} banners={banners} bannerForm={bannerForm} setBannerForm={setBannerForm} onSaveBanner={handleSaveBanner} onDeleteBanner={handleDeleteBanner} handleBannerImageChange={handleBannerImageChange} coupons={coupons} couponForm={couponForm} setCouponForm={setCouponForm} onSaveCoupon={handleSaveCoupon} onDeleteCoupon={handleDeleteCoupon} orders={orders} onStatusChange={handleStatusChange} onClose={() => navigate('/')} />} />
          <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onRemove={toggleWishlist} />} />
          <Route path="/about" element={<div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8"><h1 className="text-3xl font-semibold text-white">About INFINTYY.CREWW</h1><p className="mt-3 text-slate-400">A bold, guest-first fashion storefront built for fast, modern shopping.</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;