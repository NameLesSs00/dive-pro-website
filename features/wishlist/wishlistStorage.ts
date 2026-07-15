'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const wishlistStorageKey = 'dive-pro:wishlist-product-ids';
const wishlistChangedEvent = 'dive-pro:wishlist-changed';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeIds(ids: Array<number | string>) {
  return Array.from(
    new Set(
      ids
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0)
        .map((id) => Math.trunc(id)),
    ),
  );
}

function emitWishlistChanged() {
  window.dispatchEvent(new Event(wishlistChangedEvent));
}

export function getStoredWishlistIds() {
  if (!canUseStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(wishlistStorageKey);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? normalizeIds(parsedValue) : [];
  } catch {
    window.localStorage.removeItem(wishlistStorageKey);
    return [];
  }
}

export function setStoredWishlistIds(ids: Array<number | string>) {
  if (!canUseStorage()) return [];

  const normalizedIds = normalizeIds(ids);
  window.localStorage.setItem(wishlistStorageKey, JSON.stringify(normalizedIds));
  emitWishlistChanged();
  return normalizedIds;
}

export function addStoredWishlistId(id: number | string) {
  const nextIds = normalizeIds([...getStoredWishlistIds(), id]);
  return setStoredWishlistIds(nextIds);
}

export function removeStoredWishlistId(id: number | string) {
  const numericId = Number(id);
  const nextIds = getStoredWishlistIds().filter((storedId) => storedId !== numericId);
  return setStoredWishlistIds(nextIds);
}

export function toggleStoredWishlistId(id: number | string) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) return getStoredWishlistIds();

  const currentIds = getStoredWishlistIds();
  return currentIds.includes(numericId)
    ? setStoredWishlistIds(currentIds.filter((storedId) => storedId !== numericId))
    : setStoredWishlistIds([...currentIds, numericId]);
}

export function parseWishlistIdsFromShare(search: string) {
  const searchParams = new URLSearchParams(search);
  const sharedItems = searchParams.get('items') || searchParams.get('ids') || '';
  return normalizeIds(sharedItems.split(','));
}

export function buildWishlistShareUrl(ids: number[]) {
  if (typeof window === 'undefined') return '/wishlist';
  const url = new URL('/wishlist', window.location.origin);
  if (ids.length) url.searchParams.set('items', ids.join(','));
  return url.toString();
}

function subscribe(callback: () => void) {
  if (!canUseStorage()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === wishlistStorageKey) callback();
  };

  window.addEventListener(wishlistChangedEvent, callback);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(wishlistChangedEvent, callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function getSnapshot() {
  return getStoredWishlistIds().join(',');
}

export function useWishlistIds() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '');
  const ids = useMemo(() => (snapshot ? normalizeIds(snapshot.split(',')) : []), [snapshot]);

  const add = useCallback((id: number | string) => addStoredWishlistId(id), []);
  const remove = useCallback((id: number | string) => removeStoredWishlistId(id), []);
  const toggle = useCallback((id: number | string) => toggleStoredWishlistId(id), []);
  const replace = useCallback((nextIds: Array<number | string>) => setStoredWishlistIds(nextIds), []);

  return {
    ids,
    add,
    remove,
    toggle,
    replace,
    has: useCallback((id: number | string) => ids.includes(Number(id)), [ids]),
  };
}
