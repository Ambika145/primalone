import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Avatar, Badge, Btn, Card, Drawer, Empty, PageHead, Search, StatusBadge, Tabs, dateLong, inr, useToast } from '../ui.jsx';

const SORTS = [{ key: 'recent', label: 'Recent' }, { key: 'spent', label: 'Top spend' }, { key: 'orders', label: 'Most orders' }];

export default function Customers() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recent');
  const customers = admin.useAdmin((d) => d.customers);
  const open = customers.find((c) => c.email === params.get('c'));

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const l = customers.filter((c) => !t || c.name.toLowerCase().includes(t) || c.email.includes(t) || c.city.toLowerCase().includes(t));
    if (sort === 'spent') return [...l].sort((a, b) => b.spent - a.spent);
    if (sort === 'orders') return [...l].sort((a, b) => b.orders.length - a.orders.length);
    return l;
  }, [customers, q, sort]);

  const repeat = customers.filter((c) => c.orders.length > 1).length;
  const exportCsv = () => {
    const rows = [['Name', 'Email', 'Phone', 'City', 'Orders', 'Spent', 'Customer since']];
    list.forEach((c) => rows.push([c.name, c.email, c.phone, c.city, c.orders.length, c.spent, dateLong(c.since)]));
    admin.download('primalone-customers.csv', admin.toCsv(rows));
    toast(`${list.length} customers exported`);
  };

  return (
    <>
      <PageHead title="Customers" sub="Everyone who has an account or has ordered." actions={<Btn variant="ghost" icon="download" onClick={exportCsv}>Export CSV</Btn>} />
      <div className="ad-stats ad-stats--3">
        <div className="ad-stat"><p>Customers</p><b>{customers.length}</b></div>
        <div className="ad-stat"><p>Ordered more than once</p><b>{customers.length ? Math.round((repeat / customers.length) * 100) : 0}%</b></div>
        <div className="ad-stat"><p>Average spend</p><b>{inr(Math.round(customers.reduce((n, c) => n + c.spent, 0) / Math.max(1, customers.length)))}</b></div>
      </div>
      <Card pad={false}>
        <div className="ad-toolbar">
          <Tabs value={sort} onChange={setSort} items={SORTS} />
          <Search value={q} onChange={setQ} placeholder="Search name, email or city" />
        </div>
        {list.length ? (
          <div className="ad-table-wrap">
            <table className="ad-table ad-table--cards">
              <thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Last order</th><th className="is-num">Spent</th></tr></thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.email} onClick={() => setParams({ c: c.email })}>
                    <td className="c-who">
                      <div className="ad-who"><Avatar name={c.name} size={32} /><div>
                        <button type="button" className="ad-strong ad-plain" onClick={(e) => { e.stopPropagation(); setParams({ c: c.email }); }}>{c.name}</button>
                        <span>{c.email}</span>
                      </div></div>
                    </td>
                    <td className="c-city">{c.city || 'Not given'}</td>
                    <td className="c-count">{c.orders.length}<span className="ad-m-only"> {c.orders.length === 1 ? 'order' : 'orders'}</span>{c.account && <Badge tone="gold">Account</Badge>}</td>
                    <td className="ad-nowrap c-date">{c.last ? dateLong(c.last) : 'No orders yet'}</td>
                    <td className="is-num ad-strong c-total">{inr(c.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty title="No customers found">Try another name, email or city.</Empty>}
      </Card>

      <Drawer open={!!open} onClose={() => setParams({})} title="Customer">
        {open && (
          <>
            <div className="ad-who ad-who--lg"><Avatar name={open.name} size={52} /><div><b>{open.name}</b><span>Customer since {dateLong(open.since)}</span></div></div>
            <div className="ad-split ad-split--3">
              <div><span>Orders</span><b>{open.orders.length}</b></div>
              <div><span>Spent</span><b>{inr(open.spent)}</b></div>
              <div><span>Average</span><b>{inr(Math.round(open.spent / Math.max(1, open.orders.filter((o) => o.status !== 'cancelled').length)))}</b></div>
            </div>
            <h3 className="ad-sub">Contact</h3>
            <p className="ad-kv"><Icon name="mail" size={15} /><a href={`mailto:${open.email}`}>{open.email}</a></p>
            {open.phone && <p className="ad-kv"><Icon name="chat" size={15} />{open.phone}</p>}
            {open.city && <p className="ad-kv"><Icon name="pin" size={15} />{open.city}</p>}
            <h3 className="ad-sub">Orders</h3>
            {open.orders.length ? (
              <ul className="ad-mini-orders">
                {open.orders.map((o) => (
                  <li key={o.id}>
                    <Link to={`/admin/orders/${o.id}`}>
                      <div><b>{o.number}</b><span>{dateLong(o.createdAt)}</span></div>
                      <StatusBadge status={o.status} />
                      <b>{inr(o.total)}</b>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="ad-muted">Has an account but has not ordered yet.</p>}
          </>
        )}
      </Drawer>
    </>
  );
}
