import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/motion.js';

// Product jar that turns while its card is hovered (after seed.com's product cards).
// With `video` (a 360° turntable clip, e.g. webm with transparency) it plays the clip on hover,
// as Seed does. Without one it turns the cut-out photo in 3D, with light sweeping across it.
// `hoverRef` is the element whose hover/focus drives the spin (usually the whole card).
export default function SpinJar({ image, alt, video, hoverRef }) {
  const videoRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hoverRef?.current, v = videoRef.current;
    if (!host || !v || reduced) return;
    const play = () => { v.play().catch(() => {}); };
    const stop = () => { v.pause(); };
    host.addEventListener('pointerenter', play);
    host.addEventListener('pointerleave', stop);
    host.addEventListener('focusin', play);
    host.addEventListener('focusout', stop);
    return () => {
      host.removeEventListener('pointerenter', play); host.removeEventListener('pointerleave', stop);
      host.removeEventListener('focusin', play); host.removeEventListener('focusout', stop);
    };
  }, [hoverRef, reduced]);

  const src = `/img/${image}.webp`;
  return (
    <div className="spin-jar">
      <span className="spin-jar__shadow" aria-hidden="true" />
      {video ? (
        <video ref={videoRef} className="spin-jar__media" src={video} poster={src} muted loop playsInline preload="none" aria-label={alt} />
      ) : (
        <div className="spin-jar__turn" style={{ '--jar': `url(${src})` }}>
          <img className="spin-jar__media" src={src} alt={alt} loading="lazy" decoding="async" />
          {/* highlight clipped to the jar's own shape, sliding across as it turns */}
          <span className="spin-jar__sheen" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
