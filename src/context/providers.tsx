// app/providers.tsx
'use client';

import React from 'react';
import { AblyProvider } from '@/context/ably-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return <AblyProvider>{children}</AblyProvider>;
}
