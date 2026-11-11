import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { AreaChart, Avatar, BarList, Card, Delta, Empty, PageHead, StatusBadge, Tabs, ago, inr } from '../ui.jsx';

const RANGES = [{ key: 7, label: '7 days' }, { key: 30, label: '30 days' }, { key: 90, label: '90 days' }];
const short = (n, axis) => (axis && n >= 1000 ? `₹${n >= 1e5 ? `${(n / 1e5).toFixed(1).replace(/\.0$/, '')}L` : `${Math.round(n / 1000)}k`}` : inr(Math.round(n)));

export default function Dashboard() {
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const d = admin.useAdmin((x) => x);
  const who = admin.adminSession();

  const now = admin.inRange(d.orders, days);
  const before = admin.inRange(d.orders, days, 1);
  const paid = (l) => l.filter((o) => o.status !== 'cancelled');
  const revenue = (l) => paid(l).reduce((n, o) => n + o.total, 0);
  const firstOrder = new Map();
  [...d.orders].reverse().forEach((o) => { if (!firstOrder.has(o.customer.email)) firstOrder.set(o.customer.email, o.createdAt); });
  const newCustomers = (l) => new Set(l.filter((o) => firstOrder.get(o.customer.email) === o.createdAt).map((o) => o.customer.email)).size;
  const aov = (l) => (paid(l).length ? revenue(l) / paid(l).length : 0);

  const stats = [
    { label: 'Revenue', icon: 'trendUp', value: inr(revenue(now)), a: revenue(now), b: revenue(before) },
    { label: 'Orders', icon: 'box', value: paid(now).length, a: paid(now).length, b: paid(before).length },
    { label: 'Average order', icon: 'cart', value: inr(Math.round(aov(now))), a: aov(now), b: aov(before) },
    { label: 'New customers', icon: 'users', value: newCustomers(now), a: newCustomers(now), b: newCustomers(before) },
  ];

  const byProduct = Object.values(d.products).map((p) => ({
    label: p.name,
    value: paid(now).flatMap((o) => o.items).filter((l) => l.product === p.id).reduce((n, l) => n + l.total, 0),
    color: p.id === 'origin' ? 'var(--ad-s1)' : 'var(--ad-s2)',
    note: `${paid(now).flatMap((o) => o.items).filter((l) => l.product === p.id).reduce((n, l) => n + l.qty, 0)} packs sold`,
  }));
  const fulfil = d.orders.filter(admin.toFulfil).reverse(); // oldest first: pack these first
  const low = Object.values(d.products).flatMap((p) => p.sizes.filter((s) => s.stock <= d.settings.lowStock).map((s) => ({ p, s })));
  const unread = d.messages.filter((m) => !m.read);
  const hour = new Date().getHours();

  return (
    <>
      <PageHead
        title={`Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}, ${who?.name || 'there'}`}
        sub="Here is how the store is doing."
        actions={<Tabs value={days} onChange={setDays} items={RANGES} />}
      />

      <div className="ad-stats">
        {stats.map((s) => (
          <div key={s.label} className="ad-stat">
            <span className="ad-stat__icon"><Icon name={s.icon} size={18} /></span>
            <p>{s.label}</p>
            <b>{s.value}</b>
            <Delta now={s.a} before={s.b} />
          </div>
        ))}
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Card title="Revenue" action={<span className="ad-muted">Last {days} days, cancelled orders left out</span>}>
          <AreaChart data={admin.series(d.orders, days)} value={(x) => x.revenue} format={short} label={`Revenue per day over the last ${days} days`} />
        </Card>
        <Card title="Sales by product">
          <BarList rows={byProduct} format={(v) => inr(v)} />
          <div className="ad-split">
            <div><span>Bundles</span><b>{paid(now).filter((o) => o.bundleOff > 0).length}</b></div>
            <div><span>Codes used</span><b>{paid(now).filter((o) => o.promo).length}</b></div>
          </div>
        </Card>
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Card title="Orders to fulfil, oldest first" action={<Link to="/admin/orders?view=fulfil" className="ad-link">View all</Link>} pad={false}>
          {fulfil.length ? (
            <ul className="ad-list">
              {fulfil.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                    <Avatar name={o.customer.name} />
                    <div className="ad-list__main"><b>{o.number} · {o.customer.name}</b><span>{o.items.map((l) => `${l.name} ${l.days}d × ${l.qty}`).join(', ')}</span></div>
                    <StatusBadge status={o.status} />
                    <span className="ad-list__end"><b>{inr(o.total)}</b><span>{ago(o.createdAt)}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <Empty icon="check" title="All caught up">No orders are waiting to be packed or shipped.</Empty>}
        </Card>

        <div className="ad-stack">
          <Card title="Stock alerts" action={<Link to="/admin/products" className="ad-link">Products</Link>}>
            {low.length ? (
              <ul className="ad-alerts">
                {low.map(({ p, s }) => (
                  <li key={p.id + s.days}>
                    <span className="ad-alerts__dot" aria-hidden="true" />
                    <div><b>{p.name} {s.days}-day</b><span>Only {s.stock} left</span></div>
                    <Link to={`/admin/products/${p.id}`} className="ad-link">Restock</Link>
                  </li>
                ))}
              </ul>
            ) : <p className="ad-muted">Every pack is above {d.settings.lowStock} in stock.</p>}
          </Card>
          <Card title="Messages" action={<Link to="/admin/messages" className="ad-link">Inbox</Link>}>
            {unread.length ? (
              <ul className="ad-alerts">
                {unread.slice(0, 3).map((m) => (
                  <li key={m.id}>
                    <Avatar name={m.name} size={30} />
                    <div><b>{m.name}</b><span className="ad-clip">{m.body}</span></div>
                  </li>
                ))}
              </ul>
            ) : <p className="ad-muted">No unread messages.</p>}
          </Card>
        </div>
      </div>

      <Card title="Recent activity">
        {d.activity.length ? (
          <ul className="ad-activity">
            {d.activity.slice(0, 6).map((a) => <li key={a.at + a.note}><span>{a.note}</span><time>{ago(a.at)}</time></li>)}
          </ul>
        ) : <p className="ad-muted">Changes you make in the admin will be listed here.</p>}
      </Card>
    </>
  );
}
