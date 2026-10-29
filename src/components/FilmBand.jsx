import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import './FilmBand.css';

// Full-width film between sections: a runner in the park. It opens from an inset, rounded
// frame to the full width as it scrolls in, and only plays while on screen.
// Decorative, so it's hidden from screen readers. Reduced motion shows the still frame.
export default function FilmBand() {
  const [ref, inView] = useInView({ threshold: 0.25, rootMargin: '0px', once: false });
  const videoRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced]);

  return (
    <section ref={ref} className={`film ${inView ? 'is-in' : ''}`} aria-hidden="true">
      <div className="film__frame">
        <video
          ref={videoRef}
          className="film__video"
          src="/video/park-run.mp4"
          poster="/img/park-run-poster.webp"
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  );
}
