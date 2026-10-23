import { NextResponse } from 'next/server';

// Reads a JSON request body with a hard size cap.
// Returns a 400 response (never throws) for oversized bodies, malformed
// JSON, or non-object payloads — a bad request must never crash the route,
// and a crashed route must never take the rest of the site down with it.
export async function parseJsonBody(
  request: Request,
  maxBytes: number
): Promise<{ data: Record<string, unknown> } | { response: NextResponse }> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    return {
      response: NextResponse.json(
        { error: 'Request body too large' },
        { status: 400 }
      ),
    };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return {
      response: NextResponse.json(
        { error: 'Could not read request body' },
        { status: 400 }
      ),
    };
  }

  if (new TextEncoder().encode(text).length > maxBytes) {
    return {
      response: NextResponse.json(
        { error: 'Request body too large' },
        { status: 400 }
      ),
    };
  }

  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        response: NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        ),
      };
    }
    return { data: parsed as Record<string, unknown> };
  } catch {
    return {
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
}

export function isBoundedString(
  value: unknown,
  maxLength: number
): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}
