import {NotFoundError, ValidationError} from "@/lib/errors";

export interface RestaurantBody {
    name: string
    address?: string | null
    cuisine?: string | null
    rating: number
}

export const parseRestaurantBody = (body: unknown): RestaurantBody => {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new ValidationError("Request body must be a JSON object")
    }

    const { name, cuisine, address, rating } = body as Record<string, unknown>
    if (typeof name !== "string" || name.trim() === "") {
        throw new ValidationError("\"name\" is required and must be a string")
    }

    if (typeof rating !== "number" || Number.isNaN(rating) || rating < 0 || rating > 5) {
        throw new ValidationError("\"rating\" is required and must be a number between 0 and 5")
    }

    if (address != null && typeof address !== "string") {
        throw new ValidationError("\"address\" must be a string")
    }

    if (cuisine != null && typeof cuisine !== "string") {
        throw new ValidationError("\"cuisine\" must be a string")
    }

    return { name, address, cuisine, rating }
}

export const parseRestaurantID = (id: unknown): number => {
    const rid = Number(id)
    if (!Number.isInteger(rid) || rid < 1) {
        throw new NotFoundError("Restaurant not found")
    }

    return rid
}


export interface VisitBody {
    restaurantId: number
    date: string
    amountSpent: number
    notes?: string | null
}

export const parseVisitBody = (body: unknown): VisitBody => {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new ValidationError("Request body must be a JSON object")
    }

    const { restaurantId, date, amountSpent, notes } = body as Record<string, unknown>
    if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId) || restaurantId < 0) {
        throw new ValidationError("\"restaurantId\" is required and must be a valid integer")
    }

    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
    if (typeof date !== "string" || !dateRegex.exec(date)) {
        throw new ValidationError("\"date\" is required and must be a string of format \"YYYY-MM-DD\"")
    }
    const d = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) {
        throw new ValidationError("\"date\" is required and must be a valid real date")
    }

    if (typeof amountSpent !== "number" || Number.isNaN(amountSpent) || amountSpent < 0) {
        throw new ValidationError("\"amountSpent\" must be a non-negative number")
    }

    if (notes != null && typeof notes !== "string") {
        throw new ValidationError("\"notes\" must be a string")
    }

    return { restaurantId, amountSpent, date, notes }
}

export const parseVisitID = (id: unknown): number => {
    const rid = Number(id)
    if (!Number.isInteger(rid) || rid < 1) {
        throw new NotFoundError("Visit not found")
    }

    return rid
}