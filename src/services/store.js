// Store service: accounts, addresses, saved carts and orders.
//
// DEMO BACKEND. Everything is kept in this browser's localStorage so the full account flow can be
// designed and tested before the real store is connected. Nothing leaves the device, other browsers
// and devices see nothing, and no payment is taken. When the backend is ready (Supabase, Shopify,
// a custom API), replace the bodies of the exported functions with network calls and keep their
// names and return shapes; the pages and contexts only talk to this file.
import { bundle, products, promoCodes } from '../data/content.js';

export const DEMO_MODE = true;

const KEY = 'primalone-store-v1';
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function read() {
  try {
    const db = JSON.parse(localStorage.getItem(KEY));
    if (db && db.users && db.orders) return db;
  } catch { /* fall through to a fresh store */ }
  return { users: {}, orders: [], session: null, nextOrder: 10001 };
}
function write(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage full or blocked */ }
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
const normEmail = (e) => String(e || '').trim().toLowerCase();

// Passwords are salted and hashed even in the demo, never stored as typed
async function hash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

class StoreError extends Error {
  constructor(message, field) { super(message); this.field = field; }
}

// What the pages see of a user: never the password hash
function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, phone: u.phone || '', createdAt: u.createdAt };
}
const userById = (db, id) => Object.values(db.users).find((u) => u.id === id);

export const passwordRule = 'At least 8 characters, with a letter and a number.';
const strongEnough = (p) => p.length >= 8 && /[a-z]/i.test(p) && /\d/.test(p);
const phoneOk = (p) => !p || /^\+?[\d\s-]{10,15}$/.test(p.trim());

/* ---------------- Session ---------------- */

export async function getSession() {
  const db = read();
  return publicUser(db.session && userById(db, db.session));
}

export async function register({ name, email, phone, password }) {
  await wait();
  const db = read();
  const e = normEmail(email);
  if (!name?.trim()) throw new StoreError('Please enter your name.', 'name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new StoreError('Please enter a valid email address.', 'email');
  if (db.users[e]) throw new StoreError('An account with this email already exists. Sign in instead.', 'email');
  if (!phoneOk(phone)) throw new StoreError('Please enter a valid phone number.', 'phone');
  if (!strongEnough(password || '')) throw new StoreError(passwordRule, 'password');
  const salt = uid();
  const user = {
    id: uid(), name: name.trim(), email: e, phone: (phone || '').trim(),
    salt, pass: await hash(password, salt), createdAt: new Date().toISOString(), addresses: [], cart: [],
  };
  db.users[e] = user;
  db.session = user.id;
  write(db);
  return publicUser(user);
}

export async function login({ email, password }) {
  await wait();
  const db = read();
  const user = db.users[normEmail(email)];
  if (!user || (await hash(password || '', user.salt)) !== user.pass) {
    throw new StoreError('That email and password do not match.', 'password');
  }
  db.session = user.id;
  write(db);
  return publicUser(user);
}

export async function logout() {
  const db = read();
  db.session = null;
  write(db);
}

// With a real backend this emails a reset link. The demo cannot send email, so it only answers
// the way a real store should: the same message whether or not the account exists.
export async function requestPasswordReset() {
  await wait(500);
  return true;
}

/* ---------------- Profile ---------------- */

function mustUser(db) {
  const u = db.session && userById(db, db.session);
  if (!u) throw new StoreError('Please sign in again.');
  return u;
}

export async function updateProfile({ name, email, phone }) {
  await wait();
  const db = read();
  const u = mustUser(db);
  const e = normEmail(email);
  if (!name?.trim()) throw new StoreError('Please enter your name.', 'name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new StoreError('Please enter a valid email address.', 'email');
  if (!phoneOk(phone)) throw new StoreError('Please enter a valid phone number.', 'phone');
  if (e !== u.email) {
    if (db.users[e]) throw new StoreError('Another account already uses this email.', 'email');
    delete db.users[u.email];
    u.email = e;
    db.users[e] = u;
  }
  u.name = name.trim();
  u.phone = (phone || '').trim();
  write(db);
  return publicUser(u);
}

export async function changePassword({ current, next }) {
  await wait();
  const db = read();
  const u = mustUser(db);
  if ((await hash(current || '', u.salt)) !== u.pass) throw new StoreError('Your current password is not right.', 'current');
  if (!strongEnough(next || '')) throw new StoreError(passwordRule, 'next');
  u.salt = uid();
  u.pass = await hash(next, u.salt);
  write(db);
  return true;
}

/* ---------------- Addresses ---------------- */

export async function listAddresses() {
  const db = read();
  return mustUser(db).addresses;
}

export function validateAddress(a) {
  const need = { name: 'Full name', phone: 'Phone', line1: 'Address', city: 'City', state: 'State', pin: 'PIN code' };
  for (const [k, label] of Object.entries(need)) {
    if (!String(a[k] || '').trim()) return { field: k, message: `${label} is required.` };
  }
  if (!/^\d{6}$/.test(String(a.pin).trim())) return { field: 'pin', message: 'PIN code should be 6 digits.' };
  if (!/^\+?[\d\s-]{10,15}$/.test(String(a.phone).trim())) return { field: 'phone', message: 'Please enter a valid phone number.' };
  return null;
}

export async function saveAddress(address) {
  await wait(250);
  const err = validateAddress(address);
  if (err) throw new StoreError(err.message, err.field);
  const db = read();
  const u = mustUser(db);
  const clean = { ...address, pin: String(address.pin).trim() };
  if (clean.id) {
    u.addresses = u.addresses.map((a) => (a.id === clean.id ? { ...a, ...clean } : a));
  } else {
    clean.id = uid();
    u.addresses.push(clean);
  }
  // exactly one default: the one just marked, or the first one saved
  if (clean.isDefault || u.addresses.length === 1) u.addresses = u.addresses.map((a) => ({ ...a, isDefault: a.id === clean.id }));
  write(db);
  return u.addresses;
}

export async function deleteAddress(id) {
  await wait(200);
  const db = read();
  const u = mustUser(db);
  const wasDefault = u.addresses.find((a) => a.id === id)?.isDefault;
  u.addresses = u.addresses.filter((a) => a.id !== id);
  if (wasDefault && u.addresses[0]) u.addresses[0].isDefault = true;
  write(db);
  return u.addresses;
}

export async function setDefaultAddress(id) {
  const db = read();
  const u = mustUser(db);
  u.addresses = u.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
  write(db);
  return u.addresses;
}

/* ---------------- Saved cart ---------------- */

export async function loadUserCart() {
  const db = read();
  const u = db.session && userById(db, db.session);
  return u ? u.cart || [] : [];
}

export async function saveUserCart(lines) {
  const db = read();
  const u = db.session && userById(db, db.session);
  if (!u) return;
  u.cart = lines.map(({ product, days, qty }) => ({ product, days, qty }));
  write(db);
}

/* ---------------- Orders ---------------- */

export const ORDER_STEPS = [
  { key: 'placed', label: 'Order placed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];
export const STATUS_LABEL = { placed: 'Processing', packed: 'Packed', shipped: 'Shipped', out: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' };
export const isOpenOrder = (o) => !['delivered', 'cancelled'].includes(o.status);

export async function listOrders() {
  await wait(200);
  const db = read();
  const u = mustUser(db);
  return db.orders.filter((o) => o.userId === u.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id) {
  await wait(150);
  const db = read();
  const u = mustUser(db);
  const o = db.orders.find((x) => x.id === id && x.userId === u.id);
  if (!o) throw new StoreError('We could not find that order.');
  return o;
}

// Prices and discounts are worked out here from the catalogue and the code entered, never taken
// from the page. A real backend must do the same on the server.
export async function placeOrder({ lines, promoCode = null, address, payment }) {
  await wait(700);
  if (!lines?.length) throw new StoreError('Your cart is empty.');
  const err = validateAddress(address || {});
  if (err) throw new StoreError(err.message, err.field);
  const db = read();
  const u = mustUser(db);
  const items = lines.map(({ product, days, qty }) => {
    const size = products[product].sizes.find((s) => s.days === days);
    return { product, name: products[product].name, days, qty, price: size.price, total: size.price * qty };
  });
  const subtotal = items.reduce((n, l) => n + l.total, 0);
  const bundled = items.some((l) => l.product === 'origin') && items.some((l) => l.product === 'restore');
  const bundleOff = bundled ? Math.round((subtotal * bundle.pct) / 100) : 0;
  const pct = promoCode ? promoCodes[promoCode] : 0;
  const promo = pct ? { code: promoCode, pct } : null;
  const promoOff = pct ? Math.round(((subtotal - bundleOff) * pct) / 100) : 0;
  const now = new Date().toISOString();
  const order = {
    id: uid(), number: `PO${db.nextOrder}`, userId: u.id, createdAt: now,
    items, subtotal, bundleOff, promo, promoOff, shipping: null, total: subtotal - bundleOff - promoOff,
    address: { ...address }, email: u.email,
    payment: { method: payment, status: DEMO_MODE ? 'pending' : 'paid' },
    status: 'placed', history: [{ key: 'placed', at: now }],
  };
  db.nextOrder += 1;
  db.orders.push(order);
  u.cart = [];
  write(db);
  return order;
}

export async function cancelOrder(id) {
  await wait(300);
  const db = read();
  const u = mustUser(db);
  const o = db.orders.find((x) => x.id === id && x.userId === u.id);
  if (!o) throw new StoreError('We could not find that order.');
  if (o.status !== 'placed') throw new StoreError('This order has already been packed and can no longer be cancelled here.');
  o.status = 'cancelled';
  o.history.push({ key: 'cancelled', at: new Date().toISOString() });
  write(db);
  return o;
}
