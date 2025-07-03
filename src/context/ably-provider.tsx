'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';

interface AblyContextShape {
  ably: Ably.Realtime | null;
}

const AblyContext = createContext<AblyContextShape>({ ably: null });

export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const client = new Ably.Realtime({ 
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
      clientId: `guest-${Math.random().toString(36).slice(2, 8)}`,
     });
    setAbly(client);
    return () => {
      client.close();
    };
  }, []);

  return (
    <AblyContext.Provider value={{ ably }}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = () => useContext(AblyContext);
