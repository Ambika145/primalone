// Admin service: everything the dashboard reads and changes.
//
// DEMO ONLY. Edits are kept in this browser's localStorage so the admin can be designed and tried
// before a backend exists; they do not change the live site. Orders and customers combine a fixed
// set of sample data with the real demo orders placed on this site (services/store.js), so an order
// placed at checkout shows up here, and moving its status updates the customer's tracking page.
// When the backend is ready, replace these function bodies with API calls and keep their names.
import { useSyncExternalStore } from 'react';
import { announcements, bundle, faq, footer, products } from '../data/content.js';
import { journalPage } from '../data/pages.js';
import { ORDER_STEPS, STATUS_LABEL } from './store.js';

export { ORDER_STEPS, STATUS_LABEL };
export const DEMO_MODE = true;

const KEY = 'primalone-admin-v1';
const STORE_KEY = 'primalone-store-v1';
const DAY = 864e5;

/* ---------------- Sample data (fixed seed, so it looks the same every visit) ---------------- */

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PEOPLE = [
  ['Aarav Mehta', 'Mumbai', 'Maharashtra', '400050'], ['Priya Nair', 'Kochi', 'Kerala', '682020'],
  ['Rohan Kapoor', 'New Delhi', 'Delhi', '110017'], ['Ananya Iyer', 'Chennai', 'Tamil Nadu', '600028'],
  ['Vikram Reddy', 'Hyderabad', 'Telangana', '500033'], ['Sneha Kulkarni', 'Pune', 'Maharashtra', '411004'],
  ['Arjun Sharma', 'Jaipur', 'Rajasthan', '302001'], ['Meera Menon', 'Bengaluru', 'Karnataka', '560038'],
  ['Kabir Singh', 'Chandigarh', 'Chandigarh', '160017'], ['Isha Banerjee', 'Kolkata', 'West Bengal', '700019'],
  ['Neel Desai', 'Ahmedabad', 'Gujarat', '380015'], ['Tara Pillai', 'Thiruvananthapuram', 'Kerala', '695010'],
  ['Dev Malhotra', 'Gurugram', 'Haryana', '122002'], ['Riya Joshi', 'Indore', 'Madhya Pradesh', '452001'],
  ['Aditya Rao', 'Bengaluru', 'Karnataka', '560102'], ['Kavya Shetty', 'Mangaluru', 'Karnataka', '575001'],
  ['Siddharth Jain', 'Noida', 'Uttar Pradesh', '201301'], ['Nisha Verma', 'Lucknow', 'Uttar Pradesh', '226010'],
  ['Farhan Ali', 'Hyderabad', 'Telangana', '500081'], ['Pooja Gupta', 'New Delhi', 'Delhi', '110048'],
  ['Manav Bhatt', 'Surat', 'Gujarat', '395007'], ['Aisha Khan', 'Mumbai', 'Maharashtra', '400053'],
  ['Karthik Subramanian', 'Coimbatore', 'Tamil Nadu', '641002'], ['Zoya Mirza', 'Bhopal', 'Madhya Pradesh', '462016'],
];
const emailOf = (name) => name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com';
const phoneOf = (i) => `98${String(45012345 + i * 7919).slice(0, 8)}`;
const STREETS = ['Palm Grove', 'Lake View', 'Green Park', 'Sunrise Towers', 'Rose Villa', 'Banyan Court'];
const homeOf = (i) => `${14 + ((i * 37) % 160)}, ${STREETS[i % STREETS.length]}`;
const METHODS = ['upi', 'upi', 'upi', 'card', 'card', 'netbanking'];

function seedOrders() {
  const r = rng(20261104);
  const now = Date.now();
  const list = [];
  for (let i = 0; i < 96; i += 1) {
    const age = Math.pow(r(), 1.25) * 90 * DAY; // more orders recently
    const created = new Date(now - age);
    const who = Math.floor(r() * PEOPLE.length);
    const [name, city, state, pin] = PEOPLE[who];
    const lines = [];
    const pick = r();
    const add = (id) => {
      const size = products[id].sizes[r() < 0.72 ? 0 : 1];
      const qty = r() < 0.86 ? 1 : 2;
      lines.push({ product: id, name: products[id].name, days: size.days, qty, price: size.price, total: size.price * qty });
    };
    if (pick < 0.62) add('origin'); else if (pick < 0.78) add('restore'); else { add('origin'); add('restore'); }
    const subtotal = lines.reduce((n, l) => n + l.total, 0);
    const bundleOff = lines.length === 2 ? Math.round((subtotal * bundle.pct) / 100) : 0;
    const promo = r() < 0.16 ? { code: 'WELCOME10', pct: 10 } : null;
    const promoOff = promo ? Math.round(((subtotal - bundleOff) * promo.pct) / 100) : 0;
    const days = age / DAY;
    let status = days > 5 ? 'delivered' : days > 4 ? 'out' : days > 2 ? 'shipped' : days > 0.8 ? 'packed' : 'placed';
    if (r() < 0.05) status = 'cancelled';
    const steps = status === 'cancelled' ? ['placed'] : ORDER_STEPS.map((s) => s.key).slice(0, ORDER_STEPS.findIndex((s) => s.key === status) + 1);
    const gap = Math.min(1.2 * DAY, age / (steps.length + 0.5));
    const history = steps.map((key, k) => ({ key, at: new Date(created.getTime() + k * gap).toISOString() }));
    if (status === 'cancelled') history.push({ key: 'cancelled', at: new Date(created.getTime() + Math.min(0.3 * DAY, age / 2)).toISOString() });
    list.push({
      id: `s${i + 1}`, number: `PO${9001 + i}`, sample: true, createdAt: created.toISOString(),
      customer: { name, email: emailOf(name), phone: phoneOf(who) },
      items: lines, subtotal, bundleOff, promo, promoOff, shipping: 0, total: subtotal - bundleOff - promoOff,
      address: { name, phone: phoneOf(who), line1: homeOf(who), line2: '', city, state, pin },
      payment: { method: METHODS[Math.floor(r() * METHODS.length)], status: status === 'cancelled' ? 'refunded' : 'paid' },
      status, history,
      tracking: ['shipped', 'out', 'delivered'].includes(status) ? { courier: r() < 0.5 ? 'Delhivery' : 'Blue Dart', awb: String(Math.floor(1e10 + r() * 9e10)) } : null,
      notes: [],
    });
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((o, i, all) => ({ ...o, number: `PO${9001 + all.length - 1 - i}` }));
}

const SEED_MESSAGES = [
  { topic: 'Order', name: 'Ananya Iyer', body: 'My order arrived today but the scoop was missing from the Origin jar. Can you send one?', ref: 'delivered', hours: 3 },
  { topic: 'Product', name: 'Kabir Singh', body: 'Is the omega-3 in Origin from fish oil or algal oil? I am vegetarian.', hours: 9 },
  { topic: 'Product', name: 'Riya Joshi', body: 'Can I take Restore if I already take a magnesium tablet at night?', hours: 20 },
  { topic: 'Shipping', name: 'Dev Malhotra', body: 'Do you deliver to Port Blair? Checkout did not show a date.', hours: 30 },
  { topic: 'Order', name: 'Meera Menon', body: 'I want to change my delivery address for my latest order please.', ref: 'open', hours: 44, read: true },
  { topic: 'Partnership', name: 'Nisha Verma', body: 'I run a nutrition clinic in Lucknow and would like to stock PrimalOne. Who should I talk to?', hours: 70, read: true },
  { topic: 'Product', name: 'Aditya Rao', body: 'What does Origin taste like? Planning to mix it in a smoothie.', hours: 96, read: true, replied: true },
];

const PAGES = [
  { path: '/', name: 'Home', title: 'PrimalOne | Sequence, don’t stack', description: 'Origin in the morning, Restore in the evening. Daily essentials sequenced, not stacked.' },
  { path: '/shop', name: 'Shop', title: 'Shop | PrimalOne', description: 'Buy Origin and Restore in 30-day and 15-day packs. UPI, cards and net banking.' },
  { path: '/products/origin', name: 'Origin', title: 'Origin | PrimalOne', description: 'Daily essentials in one morning scoop: greens, omega-3s, D3 + K2, minerals, CoQ10 and a probiotic.' },
  { path: '/products/restore', name: 'Restore', title: 'Restore | PrimalOne', description: 'Five ingredients for an optional evening: glycine, NAC, magnesium, ashwagandha and myo-inositol.' },
  { path: '/sequence', name: 'Sequence', title: 'The sequence | PrimalOne', description: 'Why PrimalOne separates morning and evening instead of stacking everything at once.' },
  { path: '/science', name: 'Science', title: 'Science | PrimalOne', description: 'The thinking and the ingredients behind Origin and Restore.' },
  { path: '/about', name: 'About', title: 'About | PrimalOne', description: 'The people and the idea behind PrimalOne.' },
  { path: '/journal', name: 'Journal', title: 'Journal | PrimalOne', description: 'Longer reads on sequencing, mornings, evenings and routine.' },
  { path: '/contact', name: 'Help & contact', title: 'Help & contact | PrimalOne', description: 'Answers to common questions, and a way to write to us.' },
];

function fresh() {
  const now = Date.now();
  const orders = seedOrders();
  // a message about an order points at that person's own order in the matching state
  const latest = (name, want) => orders.find((o) => o.customer.name === name
    && (want === 'delivered' ? o.status === 'delivered' : ['placed', 'packed'].includes(o.status)))?.number;
  return {
    v: 2,
    orders,
    orderEdits: {}, // changes to demo-store orders: { [id]: { tracking, notes } }
    products: Object.fromEntries(Object.values(products).map((p) => [p.id, {
      id: p.id, name: p.name, descriptor: p.shopDescriptor, tag: p.shopTag, copy: p.shopCopy,
      contains: [...p.contains], status: 'active', image: p.shopImage.name,
      sizes: p.sizes.map((s) => ({ days: s.days, price: s.price, stock: p.id === 'origin' ? (s.days === 30 ? 214 : 18) : (s.days === 30 ? 96 : 41), sku: `${p.id.slice(0, 3).toUpperCase()}-${s.days}` })),
    }])),
    bundle: { pct: bundle.pct, active: true },
    promos: [
      { id: 'p1', code: 'WELCOME10', pct: 10, active: true, limit: 500, ends: '' },
      { id: 'p2', code: 'MORNING15', pct: 15, active: false, limit: 100, ends: '2026-12-31' },
    ],
    announcements: { show: true, items: [...announcements] },
    faq: faq.items.map((f, i) => ({ id: `f${i + 1}`, ...f })),
    articles: journalPage.articles.map((a, i) => ({
      id: a.slug, slug: a.slug, title: a.title, topic: a.topic, open: a.open, body: [...a.body], image: a.image,
      status: 'published', date: new Date(now - (i * 12 + 6) * DAY).toISOString(),
    })),
    pages: PAGES.map((p) => ({ ...p })),
    messages: SEED_MESSAGES.map((m) => (m.ref === 'open' ? { ...m, name: orders.find((o) => ['placed', 'packed'].includes(o.status)).customer.name } : m)).map((m, i) => ({
      id: `m${i + 1}`, ...m, ref: m.ref ? latest(m.name, m.ref) : undefined, email: emailOf(m.name), read: !!m.read, replied: !!m.replied, reply: '',
      at: new Date(now - m.hours * 36e5).toISOString(),
    })),
    settings: {
      store: { name: 'PrimalOne', legal: 'Primalone Nutrition Pvt Ltd', email: '', phone: '', gstin: '', fssai: '', address: '' },
      grievance: { name: '', email: '' },
      shipping: { freeAbove: 0, flat: 0, processing: '1–2 business days', cod: false },
      payments: { upi: true, card: true, netbanking: true, gateway: 'Razorpay', connected: false },
      socials: footer.socials.map((s) => ({ ...s })),
      notify: { newOrder: true, lowStock: true, message: true, daily: false },
      lowStock: 25,
    },
    team: [
      { id: 't1', name: 'Rakesh', email: 'rakesh@primalone.in', role: 'Owner', active: true },
      { id: 't2', name: 'Yash', email: 'yash@primalone.in', role: 'Owner', active: true },
      { id: 't3', name: 'Support desk', email: 'support@primalone.in', role: 'Support', active: true },
    ],
    activity: [],
  };
}

/* ---------------- Persistence + subscriptions ---------------- */

let cache = null;
let version = 0;
const listeners = new Set();

function db() {
  if (cache) return cache;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.v === 2) cache = saved;
  } catch { /* start fresh */ }
  if (!cache) { cache = fresh(); persist(); }
  return cache;
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage full or blocked */ }
}
function commit(note) {
  if (note) cache.activity = [{ at: new Date().toISOString(), note }, ...cache.activity].slice(0, 40);
  persist();
  version += 1;
  listeners.forEach((l) => l());
}
function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => { if (e.key === STORE_KEY || e.key === KEY) { cache = null; version += 1; l(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
}

// Re-renders the component whenever admin data changes. Pass a function of the whole data set.
export function useAdmin(select) {
  useSyncExternalStore(subscribe, () => version);
  return select(snapshot());
}

/* ---------------- Demo-store orders (placed on this site) ---------------- */

function storeDb() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch { return null; }
}
function siteOrders() {
  const s = storeDb();
  if (!s?.orders) return [];
  const users = Object.values(s.users || {});
  const edits = db().orderEdits;
  return s.orders.map((o) => {
    const u = users.find((x) => x.id === o.userId);
    return {
      ...o, sample: false, shipping: o.shipping ?? null,
      customer: { name: u?.name || o.address?.name || 'Customer', email: u?.email || o.email, phone: u?.phone || o.address?.phone || '' },
      tracking: edits[o.id]?.tracking || null, notes: edits[o.id]?.notes || [],
    };
  });
}

function snapshot() {
  const d = db();
  const orders = [...siteOrders(), ...d.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const used = (code) => orders.filter((o) => o.promo?.code === code && o.status !== 'cancelled').length;
  return { ...d, orders, customers: buildCustomers(orders), promos: d.promos.map((p) => ({ ...p, uses: used(p.code) })) };
}

function buildCustomers(orders) {
  const map = new Map();
  const s = storeDb();
  Object.values(s?.users || {}).forEach((u) => map.set(u.email, { id: u.email, name: u.name, email: u.email, phone: u.phone || '', city: '', since: u.createdAt, orders: [], account: true }));
  orders.forEach((o) => {
    const key = o.customer.email;
    if (!map.has(key)) map.set(key, { id: key, name: o.customer.name, email: key, phone: o.customer.phone, city: '', since: o.createdAt, orders: [], account: !o.sample });
    const c = map.get(key);
    c.orders.push(o);
    if (!c.city) c.city = `${o.address.city}, ${o.address.state}`;
    if (o.createdAt < c.since) c.since = o.createdAt;
  });
  return [...map.values()].map((c) => {
    const kept = c.orders.filter((o) => o.status !== 'cancelled');
    return { ...c, spent: kept.reduce((n, o) => n + o.total, 0), last: c.orders[0]?.createdAt || null };
  }).sort((a, b) => (b.last || '').localeCompare(a.last || ''));
}

/* ---------------- Orders ---------------- */

export const NEXT_STEP = { placed: 'packed', packed: 'shipped', shipped: 'out', out: 'delivered' };
export const PAYMENT_LABEL = { upi: 'UPI', card: 'Card', netbanking: 'Net banking' };

export function setOrderStatus(id, status) {
  const now = new Date().toISOString();
  const d = db();
  const sample = d.orders.find((o) => o.id === id);
  if (sample) {
    sample.status = status;
    sample.history.push({ key: status, at: now });
    if (status === 'cancelled' && sample.payment.status === 'paid') sample.payment.status = 'refunded';
    commit(`${sample.number} marked ${STATUS_LABEL[status].toLowerCase()}`);
    return;
  }
  const s = storeDb();
  const o = s?.orders?.find((x) => x.id === id);
  if (!o) return;
  o.status = status;
  o.history.push({ key: status, at: now });
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* blocked */ }
  commit(`${o.number} marked ${STATUS_LABEL[status].toLowerCase()}`);
}

function orderExtra(id) {
  const d = db();
  const sample = d.orders.find((o) => o.id === id);
  if (sample) return sample;
  d.orderEdits[id] = d.orderEdits[id] || { tracking: null, notes: [] };
  return d.orderEdits[id];
}
export function setTracking(id, tracking) {
  orderExtra(id).tracking = tracking;
  commit('Tracking details saved');
}
export function addOrderNote(id, text) {
  orderExtra(id).notes.push({ at: new Date().toISOString(), text });
  commit('Note added to an order');
}

/* ---------------- Catalogue, discounts, content, inbox, settings ---------------- */

export function saveProduct(p) { db().products[p.id] = p; commit(`${p.name} updated`); }
export function saveBundle(b) { db().bundle = b; commit('Bundle discount updated'); }
export function savePromo(p) {
  const d = db();
  const code = p.code.trim().toUpperCase();
  const { uses, ...rest } = p; // eslint-disable-line no-unused-vars
  if (p.id) d.promos = d.promos.map((x) => (x.id === p.id ? { ...rest, code } : x));
  else d.promos.unshift({ ...rest, code, id: `p${Date.now()}` });
  commit(`Code ${code} saved`);
}
export function deletePromo(id) { const d = db(); d.promos = d.promos.filter((x) => x.id !== id); commit('Discount code removed'); }

export function saveAnnouncements(a) { db().announcements = a; commit('Announcement bar updated'); }
export function saveFaq(list) { db().faq = list; commit('FAQs updated'); }
export function savePage(page) { const d = db(); d.pages = d.pages.map((p) => (p.path === page.path ? page : p)); commit(`${page.name} page details saved`); }
export function saveArticle(a) {
  const d = db();
  if (d.articles.some((x) => x.id === a.id)) d.articles = d.articles.map((x) => (x.id === a.id ? a : x));
  else d.articles.unshift(a);
  commit(`Article "${a.title}" saved`);
}
export function deleteArticle(id) { const d = db(); d.articles = d.articles.filter((x) => x.id !== id); commit('Article deleted'); }

export function updateMessage(id, patch) {
  const d = db();
  d.messages = d.messages.map((m) => (m.id === id ? { ...m, ...patch } : m));
  commit(patch.replied ? 'Reply saved' : null);
}
export function deleteMessage(id) { const d = db(); d.messages = d.messages.filter((m) => m.id !== id); commit('Message deleted'); }

export function saveSettings(settings) { db().settings = settings; commit('Settings saved'); }
export function saveTeam(team) { db().team = team; commit('Team updated'); }

export function resetDemo() { cache = fresh(); commit('Demo data reset'); }

/* ---------------- Admin sign-in (demo) ---------------- */

const SESSION = 'primalone-admin-session';
export function adminSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION)); } catch { return null; }
}
export function adminSignIn(email) {
  const d = db();
  const member = d.team.find((t) => t.email === email.trim().toLowerCase());
  const who = { name: member?.name || email.split('@')[0], email: email.trim().toLowerCase(), role: member?.role || 'Admin' };
  try { sessionStorage.setItem(SESSION, JSON.stringify(who)); } catch { /* blocked */ }
  return who;
}
export function adminSignOut() { try { sessionStorage.removeItem(SESSION); } catch { /* blocked */ } }

/* ---------------- Helpers ---------------- */

export const isOpen = (o) => !['delivered', 'cancelled'].includes(o.status);
export const toFulfil = (o) => ['placed', 'packed'].includes(o.status);

// Sums orders into days for the chart, ignoring cancelled ones
export function series(orders, days) {
  const end = new Date(); end.setHours(0, 0, 0, 0);
  const start = end.getTime() - (days - 1) * DAY;
  const out = Array.from({ length: days }, (_, i) => ({ date: new Date(start + i * DAY), revenue: 0, orders: 0 }));
  orders.forEach((o) => {
    if (o.status === 'cancelled') return;
    const t = new Date(o.createdAt); t.setHours(0, 0, 0, 0);
    const i = Math.round((t.getTime() - start) / DAY);
    if (i >= 0 && i < days) { out[i].revenue += o.total; out[i].orders += 1; }
  });
  return out;
}

export function inRange(orders, days, offset = 0) {
  const now = Date.now();
  const to = now - offset * days * DAY;
  const from = to - days * DAY;
  return orders.filter((o) => { const t = Date.parse(o.createdAt); return t > from && t <= to; });
}

export function toCsv(rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return rows.map((r) => r.map(esc).join(',')).join('\n');
}

export function download(name, text, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
