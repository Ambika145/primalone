import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AnnouncementBar from '../components/AnnouncementBar.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import StickyBuyBar from '../components/StickyBuyBar.jsx';

const titles = {
  '/': 'PrimalOne | Sequence, don’t stack',
  '/shop': 'Shop | PrimalOne',
  '/products/origin': 'Origin | PrimalOne',
  '/products/restore': 'Restore | PrimalOne',
  '/sequence': 'Sequence | PrimalOne',
  '/science': 'Science | PrimalOne',
  '/about': 'About | PrimalOne',
  '/journal': 'Journal | PrimalOne',
  '/contact': 'Help & contact | PrimalOne',
  '/account': 'Your account | PrimalOne',
  '/checkout': 'Checkout | PrimalOne',
  '/shipping': 'Shipping | PrimalOne',
  '/returns': 'Returns | PrimalOne',
  '/privacy': 'Privacy | PrimalOne',
  '/terms': 'Terms | PrimalOne',
};

// Pages whose first viewport is night/forest — keep nav logo + icons light like the homepage evening hero.
const nightHeroRoutes = new Set(['/products/restore', '/science']);

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const base = titles[pathname] || (pathname.startsWith('/journal/') ? 'Journal | PrimalOne' : 'PrimalOne');
    document.title = base;

    // Home manages its own day/night swap in Hero; other routes set a stable tone.
    if (pathname !== '/') {
      // article pages open on a full-bleed photo with a dark veil
      const night = nightHeroRoutes.has(pathname) || pathname.startsWith('/journal/');
      document.documentElement.dataset.heroTone = night ? 'night' : 'day';
    }

    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      if (pathname !== '/') delete document.documentElement.dataset.heroTone;
    };
  }, [pathname, hash]);
  return null;
}

export default function SiteLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      {isHome && <StickyBuyBar />}
    </>
  );
}
