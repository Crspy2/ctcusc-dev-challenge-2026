import { NextResponse } from 'next/server'
import { pool } from '@/db/pool'
import { NotFoundError, ValidationError, handleError} from '@/lib/errors'
import { toVisit } from '@/lib/types'
import { parseVisitID } from "@/lib/validation"

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseVisitID(params.id)
    const { rows: visits } = await pool.query(
      'SELECT * FROM visits WHERE id = $1',
      [id]
    );

    if (visits.length === 0) throw new NotFoundError("Visit not found");

    return NextResponse.json(toVisit(visits[0]));
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = parseVisitID(params.id)

    const body = await req.json()
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object")
    }

    const { notes } = body as Record<string, unknown>
    if (typeof notes !== "string" || notes.trim() === "") {
      throw new ValidationError('"notes" is required and must be a string')
    }
    const { rows: visits } = await pool.query("UPDATE visits SET notes=$2 WHERE id=$1 RETURNING *;", [id, notes])

    if (visits.length === 0) throw new NotFoundError("Visit not found");

    return NextResponse.json(toVisit(visits[0]), { status: 200 })
  } catch (err) {
    return handleError(err);
  }
}

// No DELETE endpoint since you can't undo or delete a visit in real life