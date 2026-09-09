import { NextResponse } from 'next/server'
import { pool } from '@/db/pool'
import {ValidationError, handleError, NotFoundError} from '@/lib/errors'
import { toVisit } from '@/lib/types'
import { parseVisitBody, parseVisitID } from "@/lib/validation"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurantIdParam = searchParams.get('restaurantId')
    const filtering = restaurantIdParam !== null
    let rid: number | undefined
    if (filtering) {
      rid = Number(restaurantIdParam)
      if (!Number.isInteger(rid) || rid < 1) {
        throw new ValidationError('"restaurantId" must be an integer')
      }
    }
    const { rows: visits } = await pool.query(
        filtering
            ? 'SELECT * FROM visits WHERE "restaurantId" = $1 ORDER BY created_at DESC'
            : 'SELECT * FROM visits ORDER BY created_at DESC',
        filtering ? [rid] : []
    )

    return NextResponse.json(visits.map(toVisit))
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { restaurantId, date, amountSpent, notes } = parseVisitBody(body)

    // make pool call instead of calling `getRestaurant(id: number)` to avoid http errors
    const { rows: restaurants } = await pool.query('SELECT 1 FROM restaurants WHERE id = $1', [restaurantId])
    if (restaurants.length === 0) {
      throw new ValidationError('"restaurantId" is not a valid restaurant')
    }
    const { rows: visits } = await pool.query('INSERT INTO visits ("restaurantId", date, "amountSpent", notes) VALUES ($1, $2, $3, $4) RETURNING *;', [restaurantId, date, amountSpent, notes])

    return NextResponse.json(toVisit(visits[0]), { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
