'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { removeConfirmAlert } from './Util';

export function RouteChangeListener() {
  const pathname = usePathname();
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    console.log(`Route changed to: ${pathname}`);
    removeConfirmAlert()
    setChanges((prev) => prev + 1);
  }, [pathname]);

  return <></>;
}