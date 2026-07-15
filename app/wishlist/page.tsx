import type { Metadata } from 'next';
import WishlistClient from '@/app/wishlist/WishlistClient';

export const metadata: Metadata = {
  title: 'My Wish-list | Dive Pro',
  description: 'Review your saved Dive Pro gear and return to your favorite products.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
