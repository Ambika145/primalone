import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Badge, Btn, Card, Confirm, Drawer, Empty, Field, PageHead, SaveBar, Search, Tabs, Toggle, dateLong, useDraft, useToast } from '../ui.jsx';

/* ---------------- Pages: search titles and descriptions ---------------- */

export function PagesAdmin() {
  const toast = useToast();
  const pages = admin.useAdmin((d) => d.pages);
  const [edit, setEdit] = useState(null);
  const save = () => { admin.savePage(edit); toast(`${edit.name} saved`); setEdit(null); };
  const len = (s, max) => <small className={s.length > max ? 'ad-over' : ''}>{s.length} / {max}</small>;

  return (
    <>
      <PageHead title="Pages" sub="How each page appears in Google and when shared." />
      <Card pad={false}>
        <ul className="ad-pages">
          {pages.map((p) => (
            <li key={p.path}>
              <div className="ad-serp">
                <span className="ad-serp__url">primalone.in{p.path === '/' ? '' : p.path}</span>
                <b className="ad-serp__title">{p.title}</b>
                <p>{p.description}</p>
              </div>
              <div className="ad-row-actions">
                <a className="ad-btn ad-btn--icon" href={p.path} target="_blank" rel="noreferrer" aria-label={`View ${p.name}`}><Icon name="external" size={16} /></a>
                <Btn variant="ghost" icon="edit" onClick={() => setEdit({ ...p })}>Edit</Btn>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit ? `${edit.name} page` : ''}
        footer={<><Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn><Btn onClick={save} disabled={!edit?.title.trim()}>Save</Btn></>}>
        {edit && (
          <div className="ad-form ad-form--1">
            <Field label="Page title" hint={len(edit.title, 60)}><input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Description" hint={len(edit.description, 160)}><textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <p className="ad-sub">Preview</p>
            <div className="ad-serp ad-serp--box">
              <span className="ad-serp__url">primalone.in{edit.path === '/' ? '' : edit.path}</span>
              <b className="ad-serp__title">{edit.title || 'Page title'}</b>
              <p>{edit.description || 'Description'}</p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}

/* ---------------- Journal ---------------- */

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const IMAGES = ['ritual-duo', 'sage-powder', 'bottle-tilt', 'food-bowl', 'origin-stir', 'origin-scoop', 'lab-droplet', 'fitness', 'powder-pour'];

export function JournalList() {
  const navigate = useNavigate();
  const articles = admin.useAdmin((d) => d.articles);
  const [view, setView] = useState('all');
  const [q, setQ] = useState('');
  const list = articles.filter((a) => (view === 'all' || a.status === view) && a.title.toLowerCase().includes(q.trim().toLowerCase()));
  const tabs = [{ key: 'all', label: 'All' }, { key: 'published', label: 'Published' }, { key: 'draft', label: 'Drafts' }]
    .map((t) => ({ ...t, count: articles.filter((a) => t.key === 'all' || a.status === t.key).length }));
  return (
    <>
      <PageHead title="Journal" sub="Write and publish articles." actions={<Btn icon="plus" onClick={() => navigate('/admin/journal/new')}>New article</Btn>} />
      <Card pad={false}>
        <div className="ad-toolbar">
          <Tabs value={view} onChange={setView} items={tabs} />
          <Search value={q} onChange={setQ} placeholder="Search articles" />
        </div>
        {list.length ? (
          <ul className="ad-articles">
            {list.map((a) => (
              <li key={a.id}>
                <Link to={`/admin/journal/${a.id}`}>
                  <img src={`/img/${a.image}-640.webp`} alt="" />
                  <div>
                    <b>{a.title}</b>
                    <span>{a.topic} · {dateLong(a.date)}</span>
                  </div>
                  <Badge tone={a.status === 'published' ? 'green' : 'grey'}>{a.status === 'published' ? 'Published' : 'Draft'}</Badge>
                  <Icon name="arrow" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        ) : <Empty icon="doc" title="No articles here">Write one with New article.</Empty>}
      </Card>
    </>
  );
}

export function JournalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isNew = id === 'new';
  const source = admin.useAdmin((d) => (isNew ? null : d.articles.find((a) => a.id === id)));
  const [blank] = useState(() => ({ id: '', slug: '', title: '', topic: 'Routine', open: '', body: [''], image: IMAGES[0], status: 'draft', date: new Date().toISOString() }));
  const { draft, set, setDraft, dirty, reset } = useDraft(source ? { ...source, bodyText: source.body.join('\n\n') } : { ...blank, bodyText: '' });
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);

  if (!isNew && !source) return <Empty icon="doc" title="Article not found"><Link to="/admin/journal" className="ad-link">Back to the journal</Link></Empty>;
  const save = (status = draft.status) => {
    if (!draft.title.trim()) { setError('Please give the article a title.'); return; }
    if (!draft.bodyText.trim()) { setError('Please write the article text.'); return; }
    const { bodyText, ...rest } = draft;
    const article = { ...rest, status, id: draft.id || slugify(draft.title), slug: draft.slug || slugify(draft.title), body: bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) };
    article.open = article.open || article.body[0];
    admin.saveArticle(article);
    toast(status === 'published' ? 'Article published' : 'Draft saved');
    if (isNew) navigate(`/admin/journal/${article.id}`, { replace: true });
  };

  return (
    <>
      <PageHead
        back={<Link to="/admin/journal" className="ad-back"><Icon name="arrowLeft" size={15} />Journal</Link>}
        title={isNew ? 'New article' : draft.title || 'Article'}
        actions={
          <>
            {draft.status === 'published' && !isNew && <a className="ad-btn ad-btn--ghost" href={`/journal/${draft.slug}`} target="_blank" rel="noreferrer"><Icon name="external" size={16} /><span>View</span></a>}
            {draft.status === 'published'
              ? <Btn variant="ghost" onClick={() => save('draft')}>Unpublish</Btn>
              : <Btn variant="ghost" onClick={() => save('draft')}>Save draft</Btn>}
            {draft.status !== 'published' && <Btn icon="check" onClick={() => save('published')}>Publish</Btn>}
          </>
        }
      />
      {error && <p className="ad-error ad-banner" role="alert">{error}</p>}
      <div className="ad-grid ad-grid--2-1">
        <Card>
          <div className="ad-form ad-form--1">
            <Field label="Title"><input className="ad-input-lg" value={draft.title} onChange={(e) => { set('title')(e); setError(''); }} placeholder="A clear, short title" /></Field>
            <Field label="Opening line" hint="Shown on the journal page. Leave empty to use the first paragraph."><textarea rows={2} value={draft.open} onChange={set('open')} /></Field>
            <Field label="Article" hint="Leave an empty line between paragraphs."><textarea rows={16} value={draft.bodyText} onChange={(e) => { set('bodyText')(e); setError(''); }} /></Field>
          </div>
        </Card>
        <div className="ad-stack">
          <Card title="Settings">
            <div className="ad-form ad-form--1">
              <Field label="Topic">
                <select value={draft.topic} onChange={set('topic')}>{['Sequence', 'Morning', 'Evening', 'Routine', 'Science'].map((t) => <option key={t}>{t}</option>)}</select>
              </Field>
              <Field label="Web address" hint={`primalone.in/journal/${draft.slug || slugify(draft.title) || '…'}`}>
                <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} placeholder={slugify(draft.title) || 'made-from-the-title'} />
              </Field>
            </div>
          </Card>
          <Card title="Cover image">
            <div className="ad-pick">
              {IMAGES.map((img) => (
                <button key={img} type="button" aria-pressed={draft.image === img} onClick={() => setDraft({ ...draft, image: img })} aria-label={img.replace(/-/g, ' ')}>
                  <img src={`/img/${img}-640.webp`} alt="" />
                </button>
              ))}
            </div>
          </Card>
          {!isNew && (
            <Card>
              {removing
                ? <Confirm text="Delete this article?" onYes={() => { admin.deleteArticle(draft.id); toast('Article deleted'); navigate('/admin/journal'); }} onNo={() => setRemoving(false)} />
                : <button type="button" className="ad-link ad-link--danger" onClick={() => setRemoving(true)}><Icon name="trash" size={15} />Delete article</button>}
            </Card>
          )}
        </div>
      </div>
      {!isNew && <SaveBar dirty={dirty} onSave={() => save()} onReset={reset} />}
    </>
  );
}

/* ---------------- FAQs ---------------- */

export function FaqAdmin() {
  const toast = useToast();
  const items = admin.useAdmin((d) => d.faq);
  const [edit, setEdit] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [q, setQ] = useState('');
  const move = (i, by) => {
    const l = [...items];
    [l[i], l[i + by]] = [l[i + by], l[i]];
    admin.saveFaq(l);
  };
  const save = () => {
    const l = edit.id ? items.map((f) => (f.id === edit.id ? edit : f)) : [...items, { ...edit, id: `f${Date.now()}` }];
    admin.saveFaq(l);
    toast(edit.id ? 'Question updated' : 'Question added');
    setEdit(null);
  };
  const t = q.trim().toLowerCase();
  const shown = items.map((f, i) => ({ f, i })).filter(({ f }) => !t || f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t));

  return (
    <>
      <PageHead title="FAQs" sub="The questions in the FAQ section of the home page." actions={<Btn icon="plus" onClick={() => setEdit({ q: '', a: '' })}>Add question</Btn>} />
      <Card pad={false}>
        <div className="ad-toolbar"><span className="ad-muted">{items.length} questions, shown in this order</span><Search value={q} onChange={setQ} placeholder="Search questions" /></div>
        {shown.length ? (
          <ul className="ad-faq">
            {shown.map(({ f, i }) => (
              <li key={f.id}>
                <div className="ad-faq__move">
                  <Btn variant="icon" icon="chevronUp" aria-label="Move up" disabled={i === 0 || !!t} onClick={() => move(i, -1)} />
                  <Btn variant="icon" icon="chevronDown" aria-label="Move down" disabled={i === items.length - 1 || !!t} onClick={() => move(i, 1)} />
                </div>
                <div className="ad-faq__text"><b>{f.q}</b><p>{f.a}</p></div>
                {removing === f.id ? (
                  <Confirm text="Delete?" onYes={() => { admin.saveFaq(items.filter((x) => x.id !== f.id)); setRemoving(null); toast('Question deleted'); }} onNo={() => setRemoving(null)} />
                ) : (
                  <div className="ad-row-actions">
                    <Btn variant="icon" icon="edit" aria-label="Edit question" onClick={() => setEdit({ ...f })} />
                    <Btn variant="icon" icon="trash" aria-label="Delete question" onClick={() => setRemoving(f.id)} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : <Empty icon="help" title="No questions match">Try other words.</Empty>}
      </Card>
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit question' : 'New question'}
        footer={<><Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn><Btn onClick={save} disabled={!edit?.q.trim() || !edit?.a.trim()}>Save</Btn></>}>
        {edit && (
          <div className="ad-form ad-form--1">
            <Field label="Question"><input value={edit.q} onChange={(e) => setEdit({ ...edit, q: e.target.value })} autoFocus /></Field>
            <Field label="Answer"><textarea rows={6} value={edit.a} onChange={(e) => setEdit({ ...edit, a: e.target.value })} /></Field>
          </div>
        )}
      </Drawer>
    </>
  );
}

/* ---------------- Announcement bar ---------------- */

export function AnnouncementsAdmin() {
  const toast = useToast();
  const source = admin.useAdmin((d) => d.announcements);
  const { draft, setDraft, dirty, reset } = useDraft(source);
  const [text, setText] = useState('');
  const setItem = (i, v) => setDraft({ ...draft, items: draft.items.map((x, k) => (k === i ? v : x)) });
  const move = (i, by) => { const l = [...draft.items]; [l[i], l[i + by]] = [l[i + by], l[i]]; setDraft({ ...draft, items: l }); };

  return (
    <>
      <PageHead title="Announcement bar" sub="The moving strip of short messages at the top of every page." />
      <div className="ad-grid ad-grid--2-1">
        <Card title="Messages">
          <Toggle label="Show the announcement bar" checked={draft.show} onChange={(v) => setDraft({ ...draft, show: v })} />
          <ul className="ad-ann">
            {draft.items.map((a, i) => (
              <li key={i}>
                <div className="ad-faq__move">
                  <Btn variant="icon" icon="chevronUp" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} />
                  <Btn variant="icon" icon="chevronDown" aria-label="Move down" disabled={i === draft.items.length - 1} onClick={() => move(i, 1)} />
                </div>
                <input value={a} onChange={(e) => setItem(i, e.target.value)} aria-label={`Message ${i + 1}`} maxLength={70} />
                <Btn variant="icon" icon="trash" aria-label="Remove message" onClick={() => setDraft({ ...draft, items: draft.items.filter((_, k) => k !== i) })} />
              </li>
            ))}
          </ul>
          <form className="ad-note-form" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; setDraft({ ...draft, items: [...draft.items, text.trim()] }); setText(''); }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a short message" aria-label="Add a short message" maxLength={70} />
            <Btn type="submit" variant="ghost" icon="plus" disabled={!text.trim()}>Add</Btn>
          </form>
        </Card>
        <Card title="Preview">
          <div className={`ad-ann-preview ${draft.show ? '' : 'is-off'}`}>
            {draft.show ? draft.items.map((a, i) => <span key={i}>{a}</span>) : <span>The bar is hidden</span>}
          </div>
        </Card>
      </div>
      <SaveBar dirty={dirty} onSave={() => { admin.saveAnnouncements({ ...draft, items: draft.items.filter((a) => a.trim()) }); toast('Announcement bar saved'); }} onReset={reset} />
    </>
  );
}
