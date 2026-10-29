import { CartProvider } from './context/CartContext.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Sequence from './components/Sequence.jsx';
import WhySequence from './components/WhySequence.jsx';
import DayLine from './components/DayLine.jsx';
import Benefits from './components/Benefits.jsx';
import Learn from './components/Learn.jsx';
import FilmBand from './components/FilmBand.jsx';
import EarlySignal from './components/EarlySignal.jsx';
import Shop from './components/Shop.jsx';
import Faq from './components/Faq.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import StickyBuyBar from './components/StickyBuyBar.jsx';

export default function App() {
  return (
    <CartProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Sequence />
        <WhySequence />
        <DayLine />
        <Benefits />
        <Learn />
        <FilmBand />
        <EarlySignal />
        <Shop />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <CartDrawer />
      <StickyBuyBar />
    </CartProvider>
  );
}
