import { NextResponse } from 'next/server';

class HttpError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = "HttpError"
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends HttpError {
  constructor(message = "Invalid request parameters") {
    super(message, 400)
    this.name = "ValidationError"
  }
}


/**
 * Central error -> HTTP response mapper for the API route handlers. Call it
 * from a route's `catch` block so error handling lives in one place:
 *
 *   try {
 *     ...
 *   } catch (err) {
 *     return handleError(err);
 *   }
 *
 * This is a STUB. Right now it always returns a generic 500. A real
 * implementation would inspect the error (validation vs. not-found vs.
 * conflict vs. unexpected) and choose an appropriate status code and shape.
 *
 * This is task A3. The write endpoints from A2 can't return sensible 400s and
 * 404s while every failure funnels into a 500.
 *
 * DONE (A3): map known error types to proper status codes (400, 404, 409, ...)
 * DONE (A3): avoid leaking internal error details in responses
 */
export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status })
  }

  if (err instanceof SyntaxError) {
    return NextResponse.json({ error: "Malformed JSON request body" }, { status: 400 })
  }

  console.error('Unhandled API error:', err);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
