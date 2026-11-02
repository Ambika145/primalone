import { restorePage } from '../data/pages.js';
import ProductDetail from './ProductDetail.jsx';

export default function RestorePage() {
  return <ProductDetail p={{ ...restorePage, id: 'restore' }} />;
}
