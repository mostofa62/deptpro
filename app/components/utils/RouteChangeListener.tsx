'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { removeConfirmAlert } from './Util';
import useApp from '@/app/hooks/useApp';

export function RouteChangeListener() {
  const pathname = usePathname();
  const [changes, setChanges] = useState(0);
  const appCtx = useApp();

  useEffect(() => {
    console.log(`Route changed to: ${pathname}`);
    removeConfirmAlert()
    setChanges((prev) => prev + 1);
    appCtx.setDebtsAccountsScreen(0);
  }, [pathname,appCtx]);

  return <></>;
}