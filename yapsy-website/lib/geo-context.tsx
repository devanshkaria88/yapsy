'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface GeoData {
  country: string;
  isIndia: boolean;
  loading: boolean;
}

const GeoContext = createContext<GeoData>({
  country: 'GB',
  isIndia: false,
  loading: true,
});

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoData>({
    country: 'GB',
    isIndia: false,
    loading: true,
  });

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code || 'GB';
          setGeo({
            country: countryCode,
            isIndia: countryCode === 'IN',
            loading: false,
          });
          return;
        }
      } catch {
        // Silent fail
      }
      setGeo({ country: 'GB', isIndia: false, loading: false });
    }
    detectCountry();
  }, []);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
}

export function useGeo() {
  return useContext(GeoContext);
}
