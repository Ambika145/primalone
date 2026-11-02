import { originPage } from '../data/pages.js';
import ProductDetail from './ProductDetail.jsx';

export default function OriginPage() {
  return <ProductDetail p={{ ...originPage, id: 'origin' }} />;
}
