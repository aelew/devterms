'use client';

import type { User } from 'lucia';
import Script from 'next/script';
import { useEffect } from 'react';

import { env } from '@/env';

interface CannyProps {
  user: User | null;
}

export function Canny({ user }: CannyProps) {
  useEffect(() => {
    if (user) {
      window.Canny('identify', {
        appID: env.NEXT_PUBLIC_CANNY_APP_ID,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarURL: user.avatar,
          created: user.createdAt.toISOString()
        }
      });
    }
  }, [user]);
  return (
    <Script
      async
      id="canny-sdk"
      dangerouslySetInnerHTML={{
        __html: `!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");`
      }}
    />
  );
}
