/* eslint-disable @next/next/no-img-element */
import { and, desc, eq, sql } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { NextResponse, type NextRequest } from 'next/server';

import { env } from '@/env';
import { slugToTerm } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface OpenGraphDefinitionProps {
  params: Promise<{ slug: string }>;
}

export const runtime = 'edge';

const key = crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(env.OG_HMAC_SECRET),
  { name: 'HMAC', hash: { name: 'SHA-256' } },
  false,
  ['sign']
);

function toHex(arrayBuffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, '0'))
    .join('');
}

export async function GET(req: NextRequest, props: OpenGraphDefinitionProps) {
  const params = await props.params;

  const term = slugToTerm(params.slug);

  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('t');

  const verifyToken = toHex(
    await crypto.subtle.sign(
      'HMAC',
      await key,
      new TextEncoder().encode(JSON.stringify({ slug: params.slug }))
    )
  );

  if (token !== verifyToken) {
    return NextResponse.json(
      { success: false, error: 'invalid_token' },
      { status: 401 }
    );
  }

  // locate definition
  const result = await db.query.definitions.findFirst({
    orderBy: desc(definitions.upvotes),
    where: and(
      eq(definitions.status, 'approved'),
      eq(definitions.term, sql`${term} COLLATE NOCASE`)
    ),
    with: {
      user: {
        columns: {
          name: true
        }
      }
    }
  });
  if (!result) {
    return NextResponse.json(
      { success: false, error: 'definition_not_found' },
      { status: 404 }
    );
  }

  // load resources
  const mediumFontData = await fetch(
    new URL('./assets/geist-medium.otf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const semiBoldFontData = await fetch(
    new URL('./assets/geist-semibold.otf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const logoImage = await fetch(
    new URL('../../../../../public/logo.png', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const backgroundImage = await fetch(
    new URL('./assets/background.jpg', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        tw="flex flex-col relative text-white h-full w-full items-center justify-center text-center"
        style={{ fontFamily: 'Geist Sans' }}
      >
        <img
          // @ts-ignore-error ArrayBuffers accepted
          src={backgroundImage}
          tw="absolute"
          height="630"
          width="1200"
          alt=""
        />
        <img
          // @ts-ignore-error ArrayBuffers accepted
          src={logoImage}
          height="128"
          width="128"
          tw="mb-4"
          alt=""
        />
        <h1
          tw="text-6xl text-transparent tracking-tight -mb-2 pb-2"
          style={{
            background: 'linear-gradient(to bottom, #fff 30%, #a5a5a5)',
            backgroundClip: 'text'
          }}
        >
          {result.term}
        </h1>
        <p tw="text-xl max-w-2xl mb-0 text-zinc-300">{result.definition}</p>
        <p tw="text-sm max-w-md text-zinc-400 mb-0">
          &quot;{result.example}&quot;
        </p>
        <p tw="text-sm mb-0 text-[rgb(225,225,225)]">
          — <span tw="font-semibold ml-1 mr-0.5">@{result.user.name}</span>{' '}
          &middot;
          {' ' +
            new Date(result.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: mediumFontData,
          name: 'Geist Sans',
          style: 'normal',
          weight: 500
        },
        {
          data: semiBoldFontData,
          name: 'Geist Sans',
          style: 'normal',
          weight: 600
        }
      ]
    }
  );
}
