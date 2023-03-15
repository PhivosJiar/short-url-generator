import '@/styles/globals.scss';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { initCSRFToken } from '@/api/apiHandle';

export default function App({ Component, pageProps }: AppProps) {
  const [cookie, setCookie] = useCookies(['_csrf', 'secret_key']);

  useEffect(() => {
    // init cookie
    const initCookie = () => {
      // generate csrfToken
      const csrfToken = initCSRFToken();
      // set cookie
      setCookie('_csrf', JSON.stringify(csrfToken), { sameSite: true });
      setCookie(
        'secret_key',
        JSON.stringify(`${process.env.NEXT_PUBLIC_SECRET_KEY}`),
        { sameSite: true }
      );
    };
    initCookie();
  }, []);

  // initToken();
  return <Component {...pageProps} />;
}
