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