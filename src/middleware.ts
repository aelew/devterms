import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { env } from './env';
import { getSessionToken, SESSION_COOKIE_NAME } from './lib/auth';

// see https://lucia-auth.com/sessions/cookies/nextjs
export async function middleware(req: NextRequest) {
  if (req.method === 'GET') {
    const response = NextResponse.next();

    const token = getSessionToken(req.cookies);
    if (token) {
      const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

      // Only extend cookie expiration on GET requests to ensure a new session wasn't set while handling the request
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        secure: env.NODE_ENV === 'production',
        maxAge: THIRTY_DAYS_IN_SECONDS,
        sameSite: 'lax',
        httpOnly: true,
        path: '/'
      });
    }

    return response;
  }

  const originHeader = req.headers.get('Origin');
  const hostHeader = req.headers.get('Host');

  if (!originHeader || !hostHeader) {
    return NextResponse.json(
      { success: false, error: 'forbidden' },
      { status: 403 }
    );
  }

  let origin;
  try {
    origin = new URL(originHeader);
  } catch {
    return NextResponse.json(
      { success: false, error: 'forbidden' },
      { status: 403 }
    );
  }

  if (origin.host !== hostHeader) {
    return NextResponse.json(
      { success: false, error: 'forbidden' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}
