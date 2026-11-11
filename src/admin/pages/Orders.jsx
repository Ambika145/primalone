import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Avatar, Badge, Btn, Card, Confirm, Empty, Field, PageHead, Search, StatusBadge, Tabs, dateLong, dateTime, inr, useToast } from '../ui.jsx';

const VIEWS = {
  all: () => true,
  fulfil: admin.toFulfil,
  transit: (o) => ['shipped', 'out'].includes(o.status),
  delivered: (o) => o.status === 'delivered',
  cancelled: (o) => o.status === 'cancelled',
};
const PER_PAGE = 12;

export function OrderList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') || 'all';
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const orders = admin.useAdmin((d) => d.orders);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return orders.filter(VIEWS[view] || VIEWS.all).filter((o) => !t
      || o.number.toLowerCase().includes(t) || o.customer.name.toLowerCase().includes(t)
      || o.customer.email.toLowerCase().includes(t) || o.address.city.toLowerCase().includes(t));
  }, [orders, view, q]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const tabs = [
    { key: 'all', label: 'All' }, { key: 'fulfil', label: 'To fulfil' }, { key: 'transit', label: 'In transit' },
    { key: 'delivered', label: 'Delivered' }, { key: 'cancelled', label: 'Cancelled' },
  ].map((t) => ({ ...t, count: orders.filter(VIEWS[t.key]).length }));

  const exportCsv = () => {
    const rows = [['Order', 'Date', 'Customer', 'Email', 'City', 'Items', 'Total', 'Payment', 'Status']];
    list.forEach((o) => rows.push([o.number, dateLong(o.createdAt), o.customer.name, o.customer.email, o.address.city,
      o.items.map((l) => `${l.name} ${l.days}d x${l.qty}`).join('; '), o.total, admin.PAYMENT_LABEL[o.payment.method] || o.payment.method, admin.STATUS_LABEL[o.status]]));
    admin.download(`primalone-orders-${view}.csv`, admin.toCsv(rows));
    toast(`${list.length} orders exported`);
  };

  return (
    <>
      <PageHead title="Orders" sub="Pack, ship and track every order." actions={<Btn variant="ghost" icon="download" onClick={exportCsv}>Export CSV</Btn>} />
      <Card pad={false}>
        <div className="ad-toolbar">
          <Tabs value={view} onChange={(v) => { setParams(v === 'all' ? {} : { view: v }); setPage(1); }} items={tabs} />
          <Search value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search order, name, email or city" />
        </div>
        {shown.length ? (
          <div className="ad-table-wrap">
            <table className="ad-table ad-table--cards">
              <thead>
                <tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Payment</th><th>Status</th><th className="is-num">Total</th></tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                    <td className="c-id"><Link to={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()} className="ad-strong">{o.number}</Link>{!o.sample && <Badge tone="gold">Site</Badge>}</td>
                    <td className="ad-nowrap c-date">{dateLong(o.createdAt)}</td>
                    <td className="c-who"><div className="ad-who"><Avatar name={o.customer.name} size={30} /><div><b>{o.customer.name}</b><span>{o.address.city}</span></div></div></td>
                    <td className="c-items">{o.items.map((l) => `${l.name} ${l.days}d × ${l.qty}`).join(', ')}</td>
                    <td className="c-pay"><Badge tone={o.payment.status === 'paid' ? 'green' : o.payment.status === 'refunded' ? 'grey' : 'amber'}>{o.payment.status === 'paid' ? 'Paid' : o.payment.status === 'refunded' ? 'Refunded' : 'Pending'}</Badge></td>
                    <td className="c-status"><StatusBadge status={o.status} /></td>
                    <td className="is-num ad-strong c-total">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty title="No orders found">Try another search or view.</Empty>}
        {pages > 1 && (
          <div className="ad-pager">
            <span>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, list.length)} of {list.length}</span>
            <div>
              <Btn variant="ghost" icon="arrowLeft" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page" />
              <Btn variant="ghost" icon="arrow" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page" />
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const order = admin.useAdmin((d) => d.orders.find((o) => o.id === id));
  const [cancel, setCancel] = useState(false);
  const [track, setTrack] = useState(null);
  const [note, setNote] = useState('');

  if (!order) {
    return <Empty icon="box" title="Order not found"><Link to="/admin/orders" className="ad-link">Back to orders</Link></Empty>;
  }
  const next = admin.NEXT_STEP[order.status];
  const stepIndex = admin.ORDER_STEPS.findIndex((s) => s.key === order.status);
  const when = (key) => order.history.find((h) => h.key === key)?.at;
  const advance = () => {
    if (next === 'shipped' && !order.tracking) { setTrack({ courier: 'Delhivery', awb: '' }); return; }
    admin.setOrderStatus(order.id, next);
    toast(`Marked as ${admin.STATUS_LABEL[next].toLowerCase()}`);
  };
  const saveTrack = (e) => {
    e.preventDefault();
    if (!track.awb.trim()) return;
    admin.setTracking(order.id, { courier: track.courier, awb: track.awb.trim() });
    if (order.status === 'packed') admin.setOrderStatus(order.id, 'shipped');
    setTrack(null);
    toast(order.status === 'packed' ? 'Tracking saved and marked as shipped' : 'Tracking saved');
  };

  return (
    <>
      <PageHead
        back={<Link to="/admin/orders" className="ad-back"><Icon name="arrowLeft" size={15} />Orders</Link>}
        title={<>{order.number} <StatusBadge status={order.status} /></>}
        sub={`Placed ${dateTime(order.createdAt)}${order.sample ? '' : ' on the website'}`}
        actions={
          <>
            <Btn variant="ghost" icon="print" onClick={() => window.print()}>Print</Btn>
            {next && <Btn icon="check" onClick={advance}>Mark as {admin.STATUS_LABEL[next].toLowerCase()}</Btn>}
          </>
        }
      />

      <div className="ad-grid ad-grid--2-1">
        <div className="ad-stack">
          <Card title="Progress">
            {order.status === 'cancelled' ? (
              <p className="ad-muted">This order was cancelled {dateTime(when('cancelled'))}. {order.payment.status === 'refunded' ? 'The payment was refunded.' : ''}</p>
            ) : (
              <ol className="ad-steps">
                {admin.ORDER_STEPS.map((s, i) => (
                  <li key={s.key} className={i <= stepIndex ? 'is-done' : i === stepIndex + 1 ? 'is-next' : ''}>
                    <span className="ad-steps__dot">{i <= stepIndex ? <Icon name="check" size={13} /> : null}</span>
                    <b>{s.label}</b>
                    <small>{when(s.key) ? dateTime(when(s.key)) : i === stepIndex + 1 ? 'Next' : ''}</small>
                  </li>
                ))}
              </ol>
            )}
            {track && (
              <form className="ad-inline-form" onSubmit={saveTrack}>
                <Field label="Courier">
                  <select value={track.courier} onChange={(e) => setTrack({ ...track, courier: e.target.value })}>
                    {['Delhivery', 'Blue Dart', 'DTDC', 'India Post', 'Shiprocket'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Tracking number">
                  <input value={track.awb} onChange={(e) => setTrack({ ...track, awb: e.target.value })} autoFocus required />
                </Field>
                <div className="ad-inline-form__actions">
                  <Btn variant="ghost" onClick={() => setTrack(null)}>Cancel</Btn>
                  <Btn type="submit">{order.status === 'packed' ? 'Save and mark shipped' : 'Save'}</Btn>
                </div>
              </form>
            )}
            {!track && (order.tracking ? (
              <div className="ad-track">
                <Icon name="truck" size={18} />
                <div><b>{order.tracking.courier}</b><span>Tracking {order.tracking.awb}</span></div>
                {order.status !== 'delivered' && order.status !== 'cancelled' && <button type="button" className="ad-link" onClick={() => setTrack(order.tracking)}>Edit</button>}
              </div>
            ) : ['packed', 'shipped', 'out'].includes(order.status) && (
              <button type="button" className="ad-link ad-mt" onClick={() => setTrack({ courier: 'Delhivery', awb: '' })}>Add tracking number</button>
            ))}
            {order.status === 'placed' && !cancel && <button type="button" className="ad-link ad-link--danger ad-mt" onClick={() => setCancel(true)}>Cancel order</button>}
            {cancel && (
              <Confirm text={`Cancel ${order.number}? ${order.payment.status === 'paid' ? 'The payment will be marked as refunded.' : ''}`} yes="Cancel order"
                onYes={() => { admin.setOrderStatus(order.id, 'cancelled'); setCancel(false); toast('Order cancelled'); }} onNo={() => setCancel(false)} />
            )}
          </Card>

          <Card title="Items" pad={false}>
            <ul className="ad-items">
              {order.items.map((l) => (
                <li key={l.product + l.days}>
                  <img src={`/img/${l.product}-turn-poster.webp`} alt="" />
                  <div><b>{l.name}</b><span>{l.days}-day pack · {inr(l.price)} each</span></div>
                  <span>× {l.qty}</span>
                  <b>{inr(l.total)}</b>
                </li>
              ))}
            </ul>
            <dl className="ad-sums">
              <div><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
              {order.bundleOff > 0 && <div><dt>Bundle saving</dt><dd>−{inr(order.bundleOff)}</dd></div>}
              {order.promo && <div><dt>Code {order.promo.code} ({order.promo.pct}%)</dt><dd>−{inr(order.promoOff)}</dd></div>}
              <div><dt>Shipping</dt><dd>{order.shipping == null ? 'To confirm' : order.shipping ? inr(order.shipping) : 'Free'}</dd></div>
              <div className="ad-sums__total"><dt>Total</dt><dd>{inr(order.total)}</dd></div>
            </dl>
          </Card>

          <Card title="Internal notes">
            {order.notes.length > 0 && (
              <ul className="ad-notes">{order.notes.map((n) => <li key={n.at}><p>{n.text}</p><time>{dateTime(n.at)}</time></li>)}</ul>
            )}
            <form className="ad-note-form" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; admin.addOrderNote(order.id, note.trim()); setNote(''); toast('Note added'); }}>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note only the team can see" aria-label="Internal note" />
              <Btn type="submit" variant="ghost" disabled={!note.trim()}>Add</Btn>
            </form>
          </Card>
        </div>

        <div className="ad-stack">
          <Card title="Customer">
            <div className="ad-who ad-who--lg"><Avatar name={order.customer.name} size={44} /><div><b>{order.customer.name}</b><span>{order.customer.email}</span></div></div>
            {order.customer.phone && <p className="ad-kv"><Icon name="chat" size={15} />{order.customer.phone}</p>}
            <Link to={`/admin/customers?c=${encodeURIComponent(order.customer.email)}`} className="ad-link ad-mt">View customer</Link>
          </Card>
          <Card title="Delivery address">
            <address className="ad-address">
              <b>{order.address.name}</b>
              <span>{order.address.line1}</span>
              {order.address.line2 && <span>{order.address.line2}</span>}
              <span>{order.address.city}, {order.address.state} {order.address.pin}</span>
              <span>{order.address.phone}</span>
            </address>
          </Card>
          <Card title="Payment">
            <p className="ad-kv"><Icon name="card" size={15} />{admin.PAYMENT_LABEL[order.payment.method] || order.payment.method}</p>
            <Badge tone={order.payment.status === 'paid' ? 'green' : order.payment.status === 'refunded' ? 'grey' : 'amber'}>
              {order.payment.status === 'paid' ? 'Paid' : order.payment.status === 'refunded' ? 'Refunded' : 'Awaiting payment'}
            </Badge>
            {order.payment.status === 'pending' && <p className="ad-muted ad-mt">Placed in demo mode, so no payment was taken.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
