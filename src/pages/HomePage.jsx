import Hero from '../components/Hero.jsx';
import Sequence from '../components/Sequence.jsx';
import WhySequence from '../components/WhySequence.jsx';
import DayLine from '../components/DayLine.jsx';
import Benefits from '../components/Benefits.jsx';
import Learn from '../components/Learn.jsx';
import FilmBand from '../components/FilmBand.jsx';
import EarlySignal from '../components/EarlySignal.jsx';
import Shop from '../components/Shop.jsx';
import Faq from '../components/Faq.jsx';

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
