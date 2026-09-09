import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toRestaurant } from '@/lib/types';
import { parseRestaurantBody, parseRestaurantID } from "@/lib/validation";

type Params = { params: { id: string } };

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant, or 404 if it doesn't exist.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseRestaurantID(params.id)
    const { rows } = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(toRestaurant(rows[0]));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /api/restaurants/:id
 * Update an existing restaurant.
 *
 * DONE (A2): implement. Update the row matching :id and return the updated
 * record (or 404 if it doesn't exist). Validate the body the same way POST does.
 */
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const id = parseRestaurantID(params.id)
    const { name, address, cuisine, rating } = parseRestaurantBody(body)
    const { rows } = await pool.query("UPDATE restaurants SET name=$2, cuisine=$3, address=$4, rating=$5 WHERE id=$1 RETURNING *;", [id, name, cuisine, address, rating])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(toRestaurant(rows[0]), { status: 200 })
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/restaurants/:id
 * Delete a restaurant.
 *
 * DONE (A2): implement. Delete the row matching :id and return 204 (or 404
 * if it doesn't exist).
 *
 * Worth noticing: the migration already made a call about what happens to that
 * restaurant's visits. Go read it. If you disagree with it, say so in your
 * write-up.
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const id = parseRestaurantID(params.id)
    const { rows } = await pool.query("DELETE FROM restaurants WHERE id=$1 RETURNING *;", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return handleError(err);
  }
}
