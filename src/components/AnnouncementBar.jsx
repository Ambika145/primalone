import { useState } from 'react';
import { announcements } from '../data/content.js';
import Icon from './ui/Icon.jsx';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
  const [paused, setPaused] = useState(false);
  // Two identical groups make the -50% loop seamless; the copy is hidden from screen readers.
  const group = (hidden) => (
    <ul className="announce__group" aria-hidden={hidden || undefined}>
      {announcements.map((text) => (
        <li key={text} className="announce__item">
          <span>{text}</span>
          <Icon name="leaf" size={13} />
        </li>
      ))}
    </ul>
  );
  return (
    <aside className={`announce ${paused ? 'is-paused' : ''}`} aria-label="Announcements">
      <div className="announce__track">
        {group(false)}
        {group(true)}
      </div>
      <button type="button" className="announce__toggle" onClick={() => setPaused((p) => !p)}
        aria-pressed={paused} aria-label={paused ? 'Play announcements' : 'Pause announcements'}>
        <Icon name={paused ? 'play' : 'pause'} size={12} />
      </button>
    </aside>
  );
}
