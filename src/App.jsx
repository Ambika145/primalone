import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
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
import { AccountGate, AccountLayout, AccountOverview, AccountOrders, AccountOrder, AccountAddresses, AccountProfile, AccountReset } from './pages/AccountPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

// Policies carry the full legal text, so they load on first visit to a policy page
const LegalPageLazy = lazy(() => import('./pages/LegalPage.jsx'));
const LegalPage = () => (
  <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
    <LegalPageLazy />
  </Suspense>
);

// Admin dashboard: loaded only when someone opens /admin, so shoppers never download it
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminSignIn = lazy(() => import('./admin/AdminLayout.jsx').then((m) => ({ default: m.AdminSignIn })));
const Dashboard = lazy(() => import('./admin/pages/Dashboard.jsx'));
const OrderList = lazy(() => import('./admin/pages/Orders.jsx').then((m) => ({ default: m.OrderList })));
const OrderDetail = lazy(() => import('./admin/pages/Orders.jsx').then((m) => ({ default: m.OrderDetail })));
const Customers = lazy(() => import('./admin/pages/Customers.jsx'));
const Discounts = lazy(() => import('./admin/pages/Discounts.jsx'));
const ProductList = lazy(() => import('./admin/pages/Products.jsx').then((m) => ({ default: m.ProductList })));
const ProductEdit = lazy(() => import('./admin/pages/Products.jsx').then((m) => ({ default: m.ProductEdit })));
const PagesAdmin = lazy(() => import('./admin/pages/Content.jsx').then((m) => ({ default: m.PagesAdmin })));
const JournalList = lazy(() => import('./admin/pages/Content.jsx').then((m) => ({ default: m.JournalList })));
const JournalEdit = lazy(() => import('./admin/pages/Content.jsx').then((m) => ({ default: m.JournalEdit })));
const FaqAdmin = lazy(() => import('./admin/pages/Content.jsx').then((m) => ({ default: m.FaqAdmin })));
const AnnouncementsAdmin = lazy(() => import('./admin/pages/Content.jsx').then((m) => ({ default: m.AnnouncementsAdmin })));
const Messages = lazy(() => import('./admin/pages/Messages.jsx'));
const Settings = lazy(() => import('./admin/pages/Settings.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div className="ad-loading" aria-label="Loading" />}>
          <Routes>
            <Route path="admin/sign-in" element={<AdminSignIn />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductEdit />} />
              <Route path="pages" element={<PagesAdmin />} />
              <Route path="journal" element={<JournalList />} />
              <Route path="journal/:id" element={<JournalEdit />} />
              <Route path="faqs" element={<FaqAdmin />} />
              <Route path="announcements" element={<AnnouncementsAdmin />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
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
              <Route path="account/sign-in" element={<AccountGate />} />
              <Route path="account/reset" element={<AccountReset />} />
              <Route path="account" element={<AccountLayout />}>
                <Route index element={<AccountOverview />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="orders/:id" element={<AccountOrder />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="profile" element={<AccountProfile />} />
              </Route>
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="shipping" element={<LegalPage />} />
              <Route path="returns" element={<LegalPage />} />
              <Route path="privacy" element={<LegalPage />} />
              <Route path="terms" element={<LegalPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
