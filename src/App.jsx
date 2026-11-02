import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import SiteLayout from './layouts/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import OriginPage from './pages/OriginPage.jsx';
import RestorePage from './pages/RestorePage.jsx';
import SequencePage from './pages/SequencePage.jsx';
import SciencePage from './pages/SciencePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="products/origin" element={<OriginPage />} />
            <Route path="products/restore" element={<RestorePage />} />
            <Route path="sequence" element={<SequencePage />} />
            <Route path="science" element={<SciencePage />} />
            <Route path="about" element={<AboutPage />} />
            {/* FAQs live on the Contact page now */}
            <Route path="faq" element={<Navigate to="/contact#faq" replace />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="journal/:slug" element={<ArticlePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="shipping" element={<LegalPage />} />
            <Route path="returns" element={<LegalPage />} />
            <Route path="privacy" element={<LegalPage />} />
            <Route path="terms" element={<LegalPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
