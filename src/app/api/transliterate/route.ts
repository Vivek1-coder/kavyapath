/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/transliterate/route.ts
import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error: sanscript has no TypeScript definitions

import Sanscript from 'sanscript';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { romanText } = body;

  if (!romanText) {
    return NextResponse.json({ error: 'Missing romanText' }, { status: 400 });
  }

  const hindi = Sanscript.t(romanText, 'itrans', 'devanagari');
  return NextResponse.json({ hindi });
}
