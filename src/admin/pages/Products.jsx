import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Badge, Btn, Card, Empty, Field, PageHead, SaveBar, inr, useDraft, useToast } from '../ui.jsx';

const stockTone = (n, low) => (n === 0 ? 'red' : n <= low ? 'amber' : 'green');

export function ProductList() {
  const d = admin.useAdmin((x) => x);
  const sold = (id, days) => d.orders.filter((o) => o.status !== 'cancelled').flatMap((o) => o.items).filter((l) => l.product === id && (!days || l.days === days)).reduce((n, l) => n + l.qty, 0);
  return (
    <>
      <PageHead title="Products" sub="Prices, stock and product details." />
      <div className="ad-products">
        {Object.values(d.products).map((p) => (
          <Link key={p.id} to={`/admin/products/${p.id}`} className="ad-product">
            <div className="ad-product__media"><img src={`/img/${p.image}-640.webp`} alt="" /></div>
            <div className="ad-product__body">
              <div className="ad-product__title">
                <h2>{p.name}</h2>
                <Badge tone={p.status === 'active' ? 'green' : 'grey'}>{p.status === 'active' ? 'On sale' : 'Hidden'}</Badge>
              </div>
              <p className="ad-muted">{p.descriptor} · {sold(p.id)} packs sold</p>
              <table className="ad-table ad-table--mini">
                <thead><tr><th>Pack</th><th>Price</th><th>Stock</th></tr></thead>
                <tbody>
                  {p.sizes.map((s) => (
                    <tr key={s.days}>
                      <td>{s.days}-day</td>
                      <td>{inr(s.price)}</td>
                      <td><Badge tone={stockTone(s.stock, d.settings.lowStock)}>{s.stock} left</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="ad-link">Edit product <Icon name="arrow" size={14} /></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function ProductEdit() {
  const { id } = useParams();
  const toast = useToast();
  const source = admin.useAdmin((d) => d.products[id]);
  const low = admin.useAdmin((d) => d.settings.lowStock);
  const { draft, set, setDraft, dirty, reset } = useDraft(source || null);
  const [item, setItem] = useState('');

  if (!source || !draft) return <Empty icon="tag" title="Product not found"><Link to="/admin/products" className="ad-link">Back to products</Link></Empty>;
  const bad = draft.sizes.some((s) => !(s.price > 0) || s.stock < 0) || !draft.name.trim();
  const save = () => {
    if (bad) { toast('Check the name, prices and stock first'); return; }
    admin.saveProduct(draft);
    toast(`${draft.name} saved`);
  };
  const addItem = (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    setDraft({ ...draft, contains: [...draft.contains, item.trim()] });
    setItem('');
  };

  return (
    <>
      <PageHead
        back={<Link to="/admin/products" className="ad-back"><Icon name="arrowLeft" size={15} />Products</Link>}
        title={draft.name || 'Product'}
        actions={<a className="ad-btn ad-btn--ghost" href={`/products/${id}`} target="_blank" rel="noreferrer"><Icon name="external" size={16} /><span>View on site</span></a>}
      />
      <div className="ad-grid ad-grid--2-1">
        <div className="ad-stack">
          <Card title="Details">
            <div className="ad-form">
              <Field label="Name"><input value={draft.name} onChange={set('name')} /></Field>
              <Field label="Short descriptor" hint="Shown under the name in the shop."><input value={draft.descriptor} onChange={set('descriptor')} /></Field>
              <Field label="Tag"><input value={draft.tag} onChange={set('tag')} /></Field>
              <Field label="Shop description" wide><textarea rows={3} value={draft.copy} onChange={set('copy')} /></Field>
            </div>
          </Card>
          <Card title="Packs, prices and stock">
            <div className="ad-sizes">
              {draft.sizes.map((s, i) => (
                <div key={s.days} className="ad-size">
                  <div className="ad-size__head"><b>{s.days}-day pack</b><Badge tone={stockTone(s.stock, low)}>{s.stock === 0 ? 'Sold out' : s.stock <= low ? 'Low stock' : 'In stock'}</Badge></div>
                  <div className="ad-form ad-form--3">
                    <Field label="Price (₹)" hint={`${inr(Math.round(s.price / s.days))} a day`}><input type="number" min="1" value={s.price} onChange={set(`sizes.${i}.price`)} /></Field>
                    <Field label="In stock"><input type="number" min="0" value={s.stock} onChange={set(`sizes.${i}.stock`)} /></Field>
                    <Field label="SKU"><input value={s.sku} onChange={set(`sizes.${i}.sku`)} /></Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title={`What ${draft.name} contains`}>
            <ul className="ad-chips">
              {draft.contains.map((c, i) => (
                <li key={c + i}>{c}<button type="button" aria-label={`Remove ${c}`} onClick={() => setDraft({ ...draft, contains: draft.contains.filter((_, k) => k !== i) })}><Icon name="close" size={13} /></button></li>
              ))}
            </ul>
            <form className="ad-note-form" onSubmit={addItem}>
              <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Add an ingredient" aria-label="Add an ingredient" />
              <Btn type="submit" variant="ghost" icon="plus" disabled={!item.trim()}>Add</Btn>
            </form>
          </Card>
        </div>
        <div className="ad-stack">
          <Card title="Visibility">
            <div className="ad-radios">
              {[['active', 'On sale', 'Shown in the shop and can be bought.'], ['draft', 'Hidden', 'Not shown in the shop.']].map(([v, l, h]) => (
                <label key={v} className={draft.status === v ? 'is-on' : ''}>
                  <input type="radio" name="status" checked={draft.status === v} onChange={() => setDraft({ ...draft, status: v })} />
                  <span><b>{l}</b><small>{h}</small></span>
                </label>
              ))}
            </div>
          </Card>
          <Card title="Image">
            <img className="ad-preview" src={`/img/${draft.image}-640.webp`} alt="" />
            <p className="ad-muted ad-mt">Image uploads arrive with the backend.</p>
          </Card>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={save} onReset={reset} />
    </>
  );
}
