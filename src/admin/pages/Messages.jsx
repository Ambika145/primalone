import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Avatar, Badge, Btn, Card, Confirm, Empty, PageHead, Tabs, ago, dateTime, useToast } from '../ui.jsx';

export default function Messages() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const messages = admin.useAdmin((d) => d.messages);
  const orders = admin.useAdmin((d) => d.orders);
  const [view, setView] = useState('all');
  const [reply, setReply] = useState('');
  const [removing, setRemoving] = useState(false);
  const list = messages.filter((m) => view === 'all' || (view === 'unread' ? !m.read : !m.replied));
  const openId = params.get('m');
  const open = messages.find((m) => m.id === openId);
  const order = open?.ref && orders.find((o) => o.number === open.ref);

  useEffect(() => {
    setReply(''); setRemoving(false);
    if (open && !open.read) admin.updateMessage(open.id, { read: true });
  }, [open?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = [
    { key: 'all', label: 'All', count: messages.length },
    { key: 'unread', label: 'Unread', count: messages.filter((m) => !m.read).length },
    { key: 'open', label: 'Not replied', count: messages.filter((m) => !m.replied).length },
  ];

  return (
    <>
      <PageHead title="Messages" sub="What customers send through the contact form." />
      <Card pad={false} className={`ad-inbox ${open ? 'has-open' : ''}`}>
        <div className="ad-inbox__list">
          <div className="ad-toolbar"><Tabs value={view} onChange={setView} items={tabs} /></div>
          {list.length ? (
            <ul>
              {list.map((m) => (
                <li key={m.id}>
                  <button type="button" className={`${m.id === open?.id ? 'is-on' : ''} ${m.read ? '' : 'is-unread'}`} onClick={() => setParams({ m: m.id })}>
                    <Avatar name={m.name} size={34} />
                    <div>
                      <div className="ad-inbox__row"><b>{m.name}</b><time>{ago(m.at)}</time></div>
                      <span className="ad-inbox__topic">{m.topic}{m.replied && ' · Replied'}</span>
                      <p className="ad-clip">{m.body}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : <Empty icon="inbox" title="Nothing here">No messages in this view.</Empty>}
        </div>

        <div className="ad-inbox__read">
          {open ? (
            <>
              <button type="button" className="ad-back ad-inbox__back" onClick={() => setParams({})}><Icon name="arrowLeft" size={15} />All messages</button>
              <div className="ad-inbox__head">
                <div className="ad-who ad-who--lg"><Avatar name={open.name} size={44} /><div><b>{open.name}</b><span><a href={`mailto:${open.email}`}>{open.email}</a></span></div></div>
                <div className="ad-row-actions">
                  <Badge tone="gold">{open.topic}</Badge>
                  <Btn variant="icon" icon="mail" aria-label="Mark as unread" title="Mark as unread" onClick={() => { admin.updateMessage(open.id, { read: false }); setParams({}); toast('Marked as unread'); }} />
                  <Btn variant="icon" icon="trash" aria-label="Delete message" onClick={() => setRemoving(true)} />
                </div>
              </div>
              {removing && <Confirm text="Delete this message?" onYes={() => { admin.deleteMessage(open.id); setParams({}); toast('Message deleted'); }} onNo={() => setRemoving(false)} />}
              <time className="ad-muted">{dateTime(open.at)}</time>
              <p className="ad-inbox__body">{open.body}</p>
              {open.ref && (
                <p className="ad-kv"><Icon name="box" size={15} />Order {order ? <Link to={`/admin/orders/${order.id}`} className="ad-link">{open.ref}</Link> : open.ref}</p>
              )}
              {open.replied && open.reply && (
                <div className="ad-reply-sent"><b>Your reply</b><p>{open.reply}</p></div>
              )}
              <form className="ad-reply" onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                admin.updateMessage(open.id, { replied: true, reply: reply.trim() });
                setReply('');
                toast(admin.DEMO_MODE ? 'Reply saved. Emails send once the backend is connected.' : 'Reply sent');
              }}>
                <textarea rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${open.name.split(' ')[0]}`} aria-label="Reply" />
                <div>
                  {!open.replied && <button type="button" className="ad-link" onClick={() => { admin.updateMessage(open.id, { replied: true }); toast('Marked as replied'); }}>Mark as replied</button>}
                  <Btn type="submit" icon="mail" disabled={!reply.trim()}>Send reply</Btn>
                </div>
              </form>
            </>
          ) : <Empty icon="inbox" title="Choose a message">It opens here.</Empty>}
        </div>
      </Card>
    </>
  );
}
