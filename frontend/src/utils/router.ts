import { useState, useEffect } from 'react';

export type AppRoute = '/' | '/worker' | '/contractor' | '/passport';

export interface RouteState {
  path: AppRoute;
  passportId?: string;
}

export function parseCurrentLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { path: '/' };
  }

  // Support both pathname (/worker) and hash (#/worker)
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');

  const effectivePath = hash.startsWith('/') ? hash : pathname;

  if (effectivePath.startsWith('/contractor')) {
    return { path: '/contractor' };
  }

  if (effectivePath.startsWith('/passport')) {
    const parts = effectivePath.split('/').filter(Boolean);
    const id = parts[1] || 'VOUCH-IN-2026-8842';
    return { path: '/passport', passportId: id };
  }

  if (effectivePath.startsWith('/worker')) {
    return { path: '/worker' };
  }

  // Default is the official public website
  return { path: '/' };
}

export function navigateTo(targetPath: string) {
  if (typeof window === 'undefined') return;

  try {
    window.history.pushState({}, '', targetPath);
  } catch {
    window.location.hash = targetPath;
  }
  window.dispatchEvent(new Event('vouch-route-change'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useAppRoute(): [RouteState, (path: string) => void] {
  const [route, setRoute] = useState<RouteState>(parseCurrentLocation);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseCurrentLocation());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('vouch-route-change', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('vouch-route-change', handleRouteChange);
    };
  }, []);

  return [route, navigateTo];
}
